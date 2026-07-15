import { api } from './axiosInstance'

/**
 * ==========================================
 *  마이페이지(SCR-11) 관련 API 통신 정의
 * ==========================================
 *
 * 현재는 USE_MOCK = true로 가짜 응답을 반환하며, 추후 백엔드 연동 시 아래 실제 API 호출 로직으로 교체할 예정이다.
 * 컴포넌트에서 직접 호출하지 말고 src/hooks/useMyPage.ts 훅을 사용할 것.
 */

export interface UserProfile {
  name: string
  email: string
  avatarUrl: string
  isSocialLogin: boolean
  styleTags: string[]
  stats: {
    saved: number
    analyzed: number
    uploaded: number
  }
}

const USE_MOCK = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getMyProfile = async (): Promise<UserProfile> => {
  if (USE_MOCK) {
    await delay(1500)
    return {
      name: '이지연',
      email: 'minji_style@email.com',
      avatarUrl: 'https://picsum.photos/seed/myprofile/200',
      isSocialLogin: false,
      styleTags: ['미니멀', '스트릿'],
      stats: { saved: 12, analyzed: 8, uploaded: 3 },
    }
  }

  const response = await api.get<UserProfile>('/api/users/me')
  return response.data
}

export interface UpdateProfilePayload {
  name: string
  styleTags: string[]
  avatarImageId?: string
}

// 아바타는 presigned URL로 S3에 먼저 업로드된 상태(useImageUpload) — 여기서는 imageId만 닉네임/태그와 함께 한 번에 저장
export const updateProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  if (USE_MOCK) {
    await delay(800)
    return {
      name: payload.name,
      email: 'minji_style@email.com',
      avatarUrl: payload.avatarImageId
        ? `https://picsum.photos/seed/${payload.avatarImageId}/200`
        : 'https://picsum.photos/seed/myprofile/200',
      isSocialLogin: false,
      styleTags: payload.styleTags,
      stats: { saved: 12, analyzed: 8, uploaded: 3 },
    }
  }

  const response = await api.patch<UserProfile>('/api/users/me', payload)
  return response.data
}

export const checkNicknameAvailable = async (nickname: string): Promise<{ available: boolean }> => {
  if (USE_MOCK) {
    await delay(400)
    return { available: nickname !== '이미사용중' }
  }

  const response = await api.get<{ available: boolean }>('/api/users/nickname-check', {
    params: { nickname },
  })
  return response.data
}

export const logout = async (): Promise<void> => {
  if (USE_MOCK) {
    await delay(300)
    return
  }

  await api.post('/api/auth/logout')
}
