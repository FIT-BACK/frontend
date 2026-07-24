import { api } from './axiosInstance'

/**
 * ==========================================
 *  알림 설정(SCR-13) 관련 API 통신 정의
 * ==========================================
 *
 * 백엔드 배포 전이므로 USE_MOCK = true로 가짜 응답을 반환한다.
 * 컴포넌트에서 직접 호출하지 말고 src/hooks/useNotificationSettings.ts 훅을 사용할 것.
 */

export interface NotificationSettings {
  aiAnalysisComplete: boolean
  lookbookLike: boolean
  trendUpdate: boolean
  marketing: boolean
}

const USE_MOCK = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  if (USE_MOCK) {
    await delay(600)
    return {
      aiAnalysisComplete: true,
      lookbookLike: true,
      trendUpdate: false,
      marketing: false,
    }
  }

  const response = await api.get<NotificationSettings>('/api/users/me/notification')
  return response.data
}

export const updateNotificationSetting = async (
  key: keyof NotificationSettings,
  value: boolean,
): Promise<void> => {
  if (USE_MOCK) {
    await delay(400)
    return
  }

  await api.patch('/api/users/me/notification', { [key]: value })
}
