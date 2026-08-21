import {
  emitUploadStageTelemetry,
  type UploadStageTelemetryReason,
} from '../telemetry/uploadStageTelemetry.ts'

export type UploadPurpose = 'ANALYSIS' | 'LOOKBOOK' | 'PROFILE'

interface ApiPostClient {
  post: (url: string, body?: unknown) => Promise<{ data: { data: unknown } }>
}

interface UploadPostClient {
  post: (
    url: string,
    body: FormData,
    config: { onUploadProgress: (event: UploadProgressEvent) => void },
  ) => Promise<{ status: number }>
}

interface UploadProgressEvent {
  loaded: number
  total?: number
}

interface UploadRequestData {
  imageId: string
  uploadUrl: string
  uploadFields: Record<string, string>
}

interface UploadImageToReadyOptions {
  file: File
  purpose: UploadPurpose
  onUploadProgress: (event: UploadProgressEvent) => void
  apiClient: ApiPostClient
  uploadClient: UploadPostClient
}

export async function uploadImageToReady({
  file,
  purpose,
  onUploadProgress,
  apiClient,
  uploadClient,
}: UploadImageToReadyOptions): Promise<string> {
  let activeStage: 'PRESIGN' | 'UPLOAD' | 'FINALIZE' = 'PRESIGN'
  emitUploadStageTelemetry({ stage: 'UPLOAD_REQUEST_CREATED', success: true, reason: null })

  try {
    const requestRes = await apiClient.post('/api/v1/images/upload-requests', {
      purpose,
      contentType: file.type,
      fileSize: file.size,
    })
    const uploadRequest = requestRes.data.data as UploadRequestData

    emitUploadStageTelemetry({ stage: 'PRESIGN_RECEIVED', success: true, reason: null })

    const formData = new FormData()
    for (const [key, value] of Object.entries(uploadRequest.uploadFields)) {
      formData.append(key, value)
    }
    formData.append('file', file)

    activeStage = 'UPLOAD'
    emitUploadStageTelemetry({ stage: 'UPLOAD_STARTED', success: true, reason: null })
    const s3Response = await uploadClient.post(uploadRequest.uploadUrl, formData, {
      onUploadProgress,
    })
    if (s3Response.status !== 204) {
      throw new UploadResponseFailure()
    }

    emitUploadStageTelemetry({ stage: 'UPLOAD_COMPLETED', success: true, reason: null })
    activeStage = 'FINALIZE'
    emitUploadStageTelemetry({ stage: 'FINALIZE_STARTED', success: true, reason: null })

    const completeRes = await apiClient.post(`/api/v1/images/${uploadRequest.imageId}/complete`)
    const completeData = completeRes.data.data as { status?: unknown }
    if (completeData?.status !== 'READY') {
      throw new FinalizeResponseFailure()
    }

    emitUploadStageTelemetry({ stage: 'FINALIZE_COMPLETED', success: true, reason: null })
    return uploadRequest.imageId
  } catch (error) {
    if (activeStage === 'PRESIGN') {
      emitUploadStageTelemetry({
        stage: 'PRESIGN_FAILED',
        success: false,
        reason: 'PRESIGN_INVALID_RESPONSE',
      })
    } else if (activeStage === 'UPLOAD') {
      emitUploadStageTelemetry({
        stage: 'UPLOAD_FAILED',
        success: false,
        reason: uploadFailureReason(error),
      })
    } else {
      emitUploadStageTelemetry({
        stage: 'FINALIZE_FAILED',
        success: false,
        reason: 'FINALIZE_FAILURE',
      })
    }
    throw error
  }
}

function uploadFailureReason(error: unknown): UploadStageTelemetryReason {
  if (error instanceof UploadResponseFailure) return 'UPLOAD_NON_2XX'
  if (isTimeout(error)) return 'UPLOAD_TIMEOUT'
  if (hasHttpStatus(error)) return 'UPLOAD_NON_2XX'
  return 'UPLOAD_TRANSPORT_FAILURE'
}

function isTimeout(error: unknown) {
  if (error == null || typeof error !== 'object') return false
  const value = error as { name?: unknown; code?: unknown }
  return value.name === 'AbortError'
    || value.name === 'TimeoutError'
    || value.code === 'ECONNABORTED'
    || value.code === 'ETIMEDOUT'
}

function hasHttpStatus(error: unknown) {
  if (error == null || typeof error !== 'object') return false
  const response = (error as { response?: { status?: unknown } }).response
  return typeof response?.status === 'number'
}

class UploadResponseFailure extends Error {}
class FinalizeResponseFailure extends Error {}
