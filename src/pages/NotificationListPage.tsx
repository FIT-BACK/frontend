import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '../hooks/useNotification';
import { navigate } from '../utils/navigate';
import type { NotificationItem } from '../api/notificationFeed';

// C-17-03 딥링크 처리
const getDeepLink = (n: NotificationItem): string | null => {
  if (n.targetId == null) return null;
  switch (n.type) {
    case 'LIKE':
      return `/lookbooks/${n.targetId}`;
    case 'ANALYSIS_DONE':
      return `/report/${n.targetId}`;
    case 'TREND':
      return `/trends/${n.targetId}`;
    default:
      return null;
  }
};

export default function NotificationListPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const hasUnread = notifications.some((n) => !n.isRead);

  const handleClick = (n: NotificationItem) => {
    if (!n.isRead) markAsRead.mutate(n.id);
    const link = getDeepLink(n);
    if (link) navigate(link);
    else alert('삭제된 콘텐츠입니다');
  };

  if (isLoading) return <div className='p-4 text-center'>불러오는 중...</div>;

  return (
    <div className='flex flex-col h-full'>
      <div className='flex items-center justify-between px-4 py-2.5'>
        <span className='font-bold text-sm'>알림</span>
        <button
          className='text-xs font-bold text-purple-400 disabled:text-gray-300'
          disabled={!hasUnread}
          onClick={() => markAllAsRead.mutate()}
        >
          모두 읽음
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className='flex-1 flex items-center justify-center text-gray-400 text-sm'>
          아직 알림이 없어요
        </div>
      ) : (
        <div className='flex flex-col'>
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-left border-b ${
                n.isRead ? 'bg-white' : 'bg-purple-50'
              }`}
            >
              <div className='flex-1'>
                <div
                  className={`text-xs ${n.isRead ? 'text-gray-500' : 'font-bold'}`}
                >
                  {n.message}
                </div>
                <div className='text-[9px] text-gray-400 mt-0.5'>
                  {n.createdAt}
                </div>
              </div>
              {!n.isRead && (
                <div className='w-1.5 h-1.5 rounded-full bg-purple-400' />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
