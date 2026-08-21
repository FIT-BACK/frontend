import assert from 'node:assert/strict'
import test from 'node:test'

import { createAnalysisWithTelemetry } from '../src/api/analysisTelemetry.ts'
import { uploadImageToReady } from '../src/api/imageUpload.ts'
import {
  subscribeUploadStageTelemetry,
  type UploadStageTelemetryEvent,
} from '../src/telemetry/uploadStageTelemetry.ts'

const SUCCESS_UPLOAD_STAGES = [
  'UPLOAD_REQUEST_CREATED',
  'PRESIGN_RECEIVED',
  'UPLOAD_STARTED',
  'UPLOAD_COMPLETED',
  'FINALIZE_STARTED',
  'FINALIZE_COMPLETED',
]

function fixtureFile() {
  return new File([new Uint8Array([1, 2, 3])], 'crop.jpg', { type: 'image/jpeg' })
}

function uploadApi(overrides: Record<string, () => Promise<unknown>> = {}) {
  return {
    async post(url: string) {
      if (overrides[url]) return overrides[url]()
      if (url === '/api/v1/images/upload-requests') {
        return {
          data: {
            data: {
              imageId: 'transient-image',
              uploadUrl: 'http://127.0.0.1/presigned-post',
              uploadFields: { key: 'transient-key' },
            },
          },
        }
      }
      if (url === '/api/v1/images/transient-image/complete') {
        return { data: { data: { status: 'READY' } } }
      }
      throw new Error('unexpected api path')
    },
  }
}

function uploadClient(implementation: () => Promise<unknown> = async () => ({ status: 204 })) {
  return { post: implementation }
}

async function capture(run: () => Promise<unknown>) {
  const events: UploadStageTelemetryEvent[] = []
  const unsubscribe = subscribeUploadStageTelemetry((event) => events.push(event))
  try {
    await run()
  } catch {
    // Failure fixtures assert the terminal safe event, not raw errors.
  } finally {
    unsubscribe()
  }
  return events
}

test('upload and analysis runtime emit the nine-stage success trace', async () => {
  const events = await capture(async () => {
    const imageId = await uploadImageToReady({
      file: fixtureFile(),
      purpose: 'ANALYSIS',
      apiClient: uploadApi(),
      uploadClient: uploadClient(),
      onUploadProgress: () => undefined,
    })
    await createAnalysisWithTelemetry(imageId, {
      async post() {
        return {
          data: {
            data: {
              reportId: 1,
              imageUrl: 'transient-signed-image',
              matchPercentage: 70,
              suggestedTags: [{ tagId: 1, tagName: 'safe-tag' }],
            },
          },
        }
      },
    })
  })

  assert.deepEqual(events.map(({ stage }) => stage), [
    ...SUCCESS_UPLOAD_STAGES,
    'ANALYSIS_STARTED',
    'ANALYSIS_COMPLETED',
    'EVIDENCE_READY',
  ])
})

test('runtime preserves upload and analysis request order and bodies', async () => {
  const calls: Array<{ target: string; url: string; body: unknown }> = []
  const apiClient = {
    async post(url: string, body?: unknown) {
      calls.push({ target: 'api', url, body })
      if (url === '/api/v1/images/upload-requests') {
        return {
          data: {
            data: {
              imageId: 'transient-image',
              uploadUrl: 'http://127.0.0.1/presigned-post',
              uploadFields: { key: 'transient-key' },
            },
          },
        }
      }
      return { data: { data: { status: 'READY' } } }
    },
  }

  const imageId = await uploadImageToReady({
    file: fixtureFile(),
    purpose: 'ANALYSIS',
    apiClient,
    uploadClient: {
      async post(url: string, body: FormData) {
        calls.push({ target: 'upload', url, body: [...body.keys()] })
        return { status: 204 }
      },
    },
    onUploadProgress: () => undefined,
  })
  await createAnalysisWithTelemetry(imageId, {
    async post(url: string, body: unknown) {
      calls.push({ target: 'analysis', url, body })
      return { data: { data: { reportId: 1 } } }
    },
  })

  assert.deepEqual(calls, [
    {
      target: 'api',
      url: '/api/v1/images/upload-requests',
      body: { purpose: 'ANALYSIS', contentType: 'image/jpeg', fileSize: 3 },
    },
    {
      target: 'upload',
      url: 'http://127.0.0.1/presigned-post',
      body: ['key', 'file'],
    },
    {
      target: 'api',
      url: '/api/v1/images/transient-image/complete',
      body: undefined,
    },
    {
      target: 'analysis',
      url: '/api/v1/analyses',
      body: { imageId: 'transient-image' },
    },
  ])
})

test('presign failure emits PRESIGN_FAILED', async () => {
  const events = await capture(() => uploadImageToReady({
    file: fixtureFile(),
    purpose: 'ANALYSIS',
    apiClient: uploadApi({
      '/api/v1/images/upload-requests': async () => { throw new Error('fixture') },
    }),
    uploadClient: uploadClient(),
    onUploadProgress: () => undefined,
  }))
  assert.deepEqual(events.at(-1), {
    stage: 'PRESIGN_FAILED',
    success: false,
    reason: 'PRESIGN_INVALID_RESPONSE',
  })
})

test('upload failure emits UPLOAD_FAILED', async () => {
  const error = Object.assign(new Error('fixture'), { response: { status: 503 } })
  const events = await capture(() => uploadImageToReady({
    file: fixtureFile(),
    purpose: 'ANALYSIS',
    apiClient: uploadApi(),
    uploadClient: uploadClient(async () => { throw error }),
    onUploadProgress: () => undefined,
  }))
  assert.deepEqual(events.at(-1), {
    stage: 'UPLOAD_FAILED',
    success: false,
    reason: 'UPLOAD_NON_2XX',
  })
})

test('finalize failure emits FINALIZE_FAILED', async () => {
  const events = await capture(() => uploadImageToReady({
    file: fixtureFile(),
    purpose: 'ANALYSIS',
    apiClient: uploadApi({
      '/api/v1/images/transient-image/complete': async () => { throw new Error('fixture') },
    }),
    uploadClient: uploadClient(),
    onUploadProgress: () => undefined,
  }))
  assert.deepEqual(events.at(-1), {
    stage: 'FINALIZE_FAILED',
    success: false,
    reason: 'FINALIZE_FAILURE',
  })
})

test('analysis failure emits ANALYSIS_FAILED', async () => {
  const events = await capture(() => createAnalysisWithTelemetry('transient-image', {
    async post() { throw new Error('fixture') },
  }))
  assert.deepEqual(events, [
    { stage: 'ANALYSIS_STARTED', success: true, reason: null },
    { stage: 'ANALYSIS_FAILED', success: false, reason: 'ANALYSIS_FAILURE' },
  ])
})

test('telemetry contains only stage success and reason', async () => {
  const events = await capture(() => uploadImageToReady({
    file: fixtureFile(),
    purpose: 'ANALYSIS',
    apiClient: uploadApi(),
    uploadClient: uploadClient(),
    onUploadProgress: () => undefined,
  }))

  for (const event of events) {
    assert.deepEqual(Object.keys(event), ['stage', 'success', 'reason'])
  }
  const serialized = JSON.stringify(events).toLowerCase()
  for (const forbidden of [
    'url', 'token', 'imageid', 'payload', 'bytes', 'credential', 'identity',
    'transient-image', 'transient-key', '127.0.0.1',
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden)
  }
})

test('observer failures never change the upload result', async () => {
  const unsubscribe = subscribeUploadStageTelemetry(() => { throw new Error('observer fixture') })
  try {
    const imageId = await uploadImageToReady({
      file: fixtureFile(),
      purpose: 'ANALYSIS',
      apiClient: uploadApi(),
      uploadClient: uploadClient(),
      onUploadProgress: () => undefined,
    })
    assert.equal(imageId, 'transient-image')
  } finally {
    unsubscribe()
  }
})
