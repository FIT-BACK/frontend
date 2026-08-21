export const UPLOAD_STAGE_TELEMETRY_EVENT = 'fitback:upload-stage-telemetry'

export const UPLOAD_STAGE_TELEMETRY_STAGES = [
  'UPLOAD_REQUEST_CREATED',
  'PRESIGN_RECEIVED',
  'UPLOAD_STARTED',
  'UPLOAD_COMPLETED',
  'FINALIZE_STARTED',
  'FINALIZE_COMPLETED',
  'ANALYSIS_STARTED',
  'ANALYSIS_COMPLETED',
  'EVIDENCE_READY',
  'PRESIGN_FAILED',
  'UPLOAD_FAILED',
  'FINALIZE_FAILED',
  'ANALYSIS_FAILED',
] as const

export const UPLOAD_STAGE_TELEMETRY_REASONS = [
  'PRESIGN_INVALID_RESPONSE',
  'UPLOAD_NON_2XX',
  'UPLOAD_TIMEOUT',
  'UPLOAD_TRANSPORT_FAILURE',
  'FINALIZE_FAILURE',
  'ANALYSIS_FAILURE',
] as const

export type UploadStageTelemetryStage = typeof UPLOAD_STAGE_TELEMETRY_STAGES[number]
export type UploadStageTelemetryReason = typeof UPLOAD_STAGE_TELEMETRY_REASONS[number]

export interface UploadStageTelemetryEvent {
  stage: UploadStageTelemetryStage
  success: boolean
  reason: UploadStageTelemetryReason | null
}

type UploadStageTelemetryListener = (event: UploadStageTelemetryEvent) => void

const listeners = new Set<UploadStageTelemetryListener>()

export function subscribeUploadStageTelemetry(listener: UploadStageTelemetryListener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function emitUploadStageTelemetry(event: UploadStageTelemetryEvent) {
  const safeEvent = Object.freeze({
    stage: event.stage,
    success: event.success,
    reason: event.reason,
  })

  for (const listener of listeners) {
    try {
      listener(safeEvent)
    } catch {
      // Telemetry is observation-only and must never affect the upload flow.
    }
  }

  if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(UPLOAD_STAGE_TELEMETRY_EVENT, { detail: safeEvent }))
    } catch {
      // Browser instrumentation failures must not change user-visible behavior.
    }
  }
}
