import { api } from './axiosInstance';

/**
 * ==========================================
 *  알림 목록(SCR-17) 관련 API 통신 정의
 * ==========================================
 * 알림 "설정"(SCR-13)은 api/notifications.ts를 따로 사용합니다.
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useNotification.ts를 사용하세요.
 */

export type NotificationType =
  | 'ANALYSIS_COMPLETE'
  | 'LOOKBOOK_LIKED'
  | 'TREND_UPDATE'
  | 'MARKETING';

export type NotificationTargetType = 'ANALYSIS_REPORT' | 'LOOKBOOK' | 'TREND' | null;

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  targetType: NotificationTargetType;
  targetId: number | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPage {
  items: NotificationItem[];
  unreadCount: number;
  nextCursor: number | null;
  hasNext: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

interface NotificationApiItem {
  notificationId: number;
  notificationType: NotificationType;
  title: string;
  body: string;
  targetType: NotificationTargetType;
  targetId: number | null;
  readAt: string | null;
  createdAt: string;
}

interface NotificationListApiResponse {
  items: NotificationApiItem[];
  unreadCount: number;
  nextCursor: number | null;
  hasNext: boolean;
  pageSize: number;
}

const USE_MOCK = true;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'LOOKBOOK_LIKED',
    title: 'minji_style님이 내 룩북을 좋아해요 ❤️',
    body: '',
    targetType: 'LOOKBOOK',
    targetId: 101,
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'ANALYSIS_COMPLETE',
    title: '분석이 완료됐어요! 지금 바로 확인해보세요 👗',
    body: '',
    targetType: 'ANALYSIS_REPORT',
    targetId: 202,
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    type: 'TREND_UPDATE',
    title: '새 트렌드가 올라왔어요! #스트릿 무드 지금 확인하기 🔥',
    body: '',
    targetType: 'TREND',
    targetId: 303,
    isRead: true,
    createdAt: new Date().toISOString(),
  },
];

export const getNotifications = async (): Promise<NotificationPage> => {
  if (USE_MOCK) {
    await delay(400);
    return {
      items: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.isRead).length,
      nextCursor: null,
      hasNext: false,
    };
  }
  const response = await api.get<ApiEnvelope<NotificationListApiResponse>>(
    '/api/v1/notifications',
  );
  const data = response.data.data;
  return {
    items: data.items.map((item) => ({
      id: item.notificationId,
      type: item.notificationType,
      title: item.title,
      body: item.body,
      targetType: item.targetType,
      targetId: item.targetId,
      isRead: item.readAt != null,
      createdAt: item.createdAt,
    })),
    unreadCount: data.unreadCount,
    nextCursor: data.nextCursor,
    hasNext: data.hasNext,
  };
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
