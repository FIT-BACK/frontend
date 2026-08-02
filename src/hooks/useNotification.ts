import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type NotificationPage,
} from '../api/notificationFeed';

const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export const useNotifications = () =>
  useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: getNotifications,
    select: (page) => page.items,
  });

// Header의 🔔 뱃지용 — useNotifications와 같은 쿼리 키를 공유해 중복 요청 없이 캐시를 재사용한다.
export const useUnreadNotificationCount = () =>
  useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: getNotifications,
    select: (page) => page.unreadCount,
  });

const patchUnreadCount = (page: NotificationPage, delta: number): NotificationPage => ({
  ...page,
  unreadCount: Math.max(0, page.unreadCount + delta),
});

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData<NotificationPage>(NOTIFICATIONS_QUERY_KEY);
      queryClient.setQueryData<NotificationPage>(NOTIFICATIONS_QUERY_KEY, (old) => {
        if (!old) return old;
        const target = old.items.find((n) => n.id === notificationId);
        const wasUnread = target ? !target.isRead : false;
        return patchUnreadCount(
          { ...old, items: old.items.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)) },
          wasUnread ? -1 : 0,
        );
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previous);
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationPage>(NOTIFICATIONS_QUERY_KEY, (old) =>
        old ? { ...old, items: old.items.map((n) => ({ ...n, isRead: true })), unreadCount: 0 } : old,
      );
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_data, notificationId) => {
      queryClient.setQueryData<NotificationPage>(NOTIFICATIONS_QUERY_KEY, (old) => {
        if (!old) return old;
        const target = old.items.find((n) => n.id === notificationId);
        const wasUnread = target ? !target.isRead : false;
        return patchUnreadCount(
          { ...old, items: old.items.filter((n) => n.id !== notificationId) },
          wasUnread ? -1 : 0,
        );
      });
    },
  });
};
