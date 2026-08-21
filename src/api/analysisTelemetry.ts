import { emitUploadStageTelemetry } from '../telemetry/uploadStageTelemetry.ts'

export interface AnalysisPostClient<T> {
  post: (
    url: string,
    body: unknown,
  ) => Promise<{ data: { data: T } }>
}

export async function createAnalysisWithTelemetry<T>(
  imageId: string,
  client: AnalysisPostClient<T>,
): Promise<T> {
  emitUploadStageTelemetry({ stage: 'ANALYSIS_STARTED', success: true, reason: null })
  try {
    const response = await client.post('/api/v1/analyses', { imageId })
    emitUploadStageTelemetry({ stage: 'ANALYSIS_COMPLETED', success: true, reason: null })
    emitUploadStageTelemetry({ stage: 'EVIDENCE_READY', success: true, reason: null })
    return response.data.data
  } catch (error) {
    emitUploadStageTelemetry({
      stage: 'ANALYSIS_FAILED',
      success: false,
      reason: 'ANALYSIS_FAILURE',
    })
    throw error
  }
}
