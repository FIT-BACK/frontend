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
  analysisCompleteEnabled: boolean
  lookbookLikedEnabled: boolean
  trendUpdateEnabled: boolean
  marketingEnabled: boolean
}

interface NotificationSettingsApiResponse {
  success: boolean
  code: string
  message: string
  data: NotificationSettings
}

const USE_MOCK = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  if (USE_MOCK) {
    await delay(600)
    return {
      analysisCompleteEnabled: true,
      lookbookLikedEnabled: true,
      trendUpdateEnabled: false,
      marketingEnabled: false,
    }
  }

  const response = await api.get<NotificationSettingsApiResponse>('/api/v1/members/me/notification-settings')
  return response.data.data
}

export const updateNotificationSetting = async (
  key: keyof NotificationSettings,
  value: boolean,
): Promise<void> => {
  if (USE_MOCK) {
    await delay(400)
    return
  }

  await api.patch<NotificationSettingsApiResponse>('/api/v1/members/me/notification-settings', {
    [key]: value,
  })
}
