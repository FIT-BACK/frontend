import { api } from './axiosInstance'

/**
 * ==========================================
 *  룩북 업로드(SCR-09) 관련 API 통신 정의
 * ==========================================
 *
 * 현재는 USE_MOCK = true로 가짜 응답을 반환하며, 추후 백엔드 연동 시 아래 실제 API 호출 로직으로 교체할 예정이다.
 * 컴포넌트에서 직접 호출하지 말고 src/hooks/useLookbookUpload.ts 훅을 사용할 것.
 */

export interface LookbookUploadPayload {
  originalLookImageId: number
  valueMatchImageId: number
  styleTags: string[]
  purchaseLink?: string
  comment?: string
}

export interface LookbookUploadResult {
  id: number
}

const USE_MOCK = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 이미지는 presigned URL로 S3에 먼저 업로드된 상태 (useImageUpload) — 여기서는 imageId만 전달
export const uploadLookbook = async (
  payload: LookbookUploadPayload,
): Promise<LookbookUploadResult> => {
  if (USE_MOCK) {
    await delay(1500)
    return { id: Date.now() }
  }

  const response = await api.post<LookbookUploadResult>('/api/lookbooks', payload)
  return response.data
}
