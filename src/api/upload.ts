import { api } from './axiosInstance'

/**
 * ==========================================
 *  이미지 업로드(Presigned URL) 관련 API 통신 정의
 * ==========================================
 *
 * 현재는 USE_MOCK = true로 가짜 응답을 반환하며, 추후 백엔드 연동 시 아래 실제 API 호출 로직으로 교체할 예정이다.
 * 컴포넌트에서 직접 호출하지 말고 src/hooks/useImageUpload.ts 훅을 사용할 것.
 *
 * 주의: presigned URL로의 실제 S3 PUT 업로드는 절대 axiosInstance(api)를 거치지 않는다.
 * api 인스턴스는 모든 요청에 우리 서비스 JWT를 자동으로 붙이는데, 그 토큰을 S3로 보내면 안 되기 때문.
 */

// TODO: 아래 요청/응답 필드명은 백엔드 확정 전 임시값. 명세 확정되면 교체할 것.
export interface PresignedUrlRequest {
  fileName: string
  contentType: string
}

export interface PresignedUrlResponse {
  presignedUrl: string
  imageId: string
}

const USE_MOCK = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 1. 백엔드에 presigned URL 발급 요청 (우리 서버로 가는 요청이므로 api 인스턴스 사용)
export const requestPresignedUrl = async (file: File): Promise<PresignedUrlResponse> => {
  if (USE_MOCK) {
    await delay(500)
    return { presignedUrl: 'https://mock-s3.example.com/upload', imageId: crypto.randomUUID() }
  }

  // TODO: 실제 엔드포인트 경로 미확정
  const response = await api.post<PresignedUrlResponse>('/api/images/presigned-url', {
    fileName: file.name,
    contentType: file.type,
  } satisfies PresignedUrlRequest)
  return response.data
}

// 2. presigned URL로 S3에 직접 PUT (api 인스턴스를 거치지 않고 순수 fetch 사용)
export const uploadFileToPresignedUrl = async (
  presignedUrl: string,
  file: File,
): Promise<void> => {
  if (USE_MOCK) {
    await delay(1000)
    return
  }

  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패했습니다')
  }
}
