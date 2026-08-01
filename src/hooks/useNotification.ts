import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type NotificationItem,
} from '../api/notificationFeed';

const NOTIFICATIONS_QUERY_KEY = ['notifications'];

export const useNotifications = () =>
  useQuery({ queryKey: NOTIFICATIONS_QUERY_KEY, queryFn: getNotifications });

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previous = queryClient.getQueryData<NotificationItem[]>(
        NOTIFICATIONS_QUERY_KEY,
      );
      queryClient.setQueryData<NotificationItem[]>(
        NOTIFICATIONS_QUERY_KEY,
        (old) =>
          old?.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previous);
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(
        NOTIFICATIONS_QUERY_KEY,
        (old) => old?.map((n) => ({ ...n, isRead: true })),
      );
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_data, notificationId) => {
      queryClient.setQueryData<NotificationItem[]>(
        NOTIFICATIONS_QUERY_KEY,
        (old) => old?.filter((n) => n.id !== notificationId),
      );
    },
  });
};
