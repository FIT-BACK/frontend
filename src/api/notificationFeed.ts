import { api } from './axiosInstance';

/**
 * ==========================================
 *  알림 목록(SCR-17) 관련 API 통신 정의
 * ==========================================
 * 알림 "설정"(SCR-13)은 api/notifications.ts를 따로 사용합니다.
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useNotification.ts를 사용하세요.
 */

export interface NotificationItem {
  id: number;
  type: 'LIKE' | 'ANALYSIS_DONE' | 'TREND';
  message: string;
  createdAt: string;
  isRead: boolean;
  targetId: number | null;
}

const USE_MOCK = true;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'LIKE',
    message: 'minji_style님이 내 룩북을 좋아해요 ❤️',
    createdAt: '방금',
    isRead: false,
    targetId: 101,
  },
  {
    id: 2,
    type: 'ANALYSIS_DONE',
    message: '분석이 완료됐어요! 지금 바로 확인해보세요 👗',
    createdAt: '5분 전',
    isRead: false,
    targetId: 202,
  },
  {
    id: 3,
    type: 'TREND',
    message: '새 트렌드가 올라왔어요! #스트릿 무드 지금 확인하기 🔥',
    createdAt: '어제',
    isRead: true,
    targetId: 303,
  },
];

export const getNotifications = async (): Promise<NotificationItem[]> => {
  if (USE_MOCK) {
    await delay(400);
    return mockNotifications;
  }
  const response = await api.get<NotificationItem[]>('/api/v1/notifications');
  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: number,
): Promise<void> => {
  if (USE_MOCK) {
    await delay(200);
    return;
  }
  await api.patch(`/api/v1/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  if (USE_MOCK) {
    await delay(200);
    return;
  }
  await api.patch('/api/v1/notifications/read');
};

export const deleteNotification = async (
  notificationId: number,
): Promise<void> => {
  if (USE_MOCK) {
    await delay(200);
    return;
  }
  await api.delete(`/api/v1/notifications/${notificationId}`);
};
