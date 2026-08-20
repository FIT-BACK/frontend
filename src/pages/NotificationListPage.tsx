import { Heart, Info } from 'lucide-react';
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
  switch (n.targetType) {
    case 'LOOKBOOK':
      return `/lookbooks/${n.targetId}`;
    case 'TREND':
      return `/trend/${n.targetId}`;
    case 'ANALYSIS_REPORT':
      // 과거 리포트를 id로 다시 보는 화면이 아직 없어 마이 클로젯으로 안내
      return '/closet';
    default:
      return null;
  }
};
const NotificationIcon = ({ type }: { type: NotificationItem['type'] }) => {
  const config = {
    LOOKBOOK_LIKED: {
      bg: 'bg-purple-400',
      icon: <Heart size={14} strokeWidth={2} fill='#fff' stroke='#fff' />,
    },
    ANALYSIS_COMPLETE: {
      bg: 'bg-[#1D9E75]',
      icon: <Info size={14} strokeWidth={2} stroke='#fff' />,
    },
    TREND_UPDATE: {
      bg: 'bg-gray-100',
      icon: (
        <svg
          width='14'
          height='14'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#9E9BB0'
          strokeWidth='2'
        >
          <polyline points='17 1 21 5 17 9' />
          <path d='M3 11V9a4 4 0 0 1 4-4h14' />
        </svg>
      ),
    },
    MARKETING: {
      bg: 'bg-gray-100',
      icon: (
        <svg
          width='14'
          height='14'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#9E9BB0'
          strokeWidth='2'
        >
          <rect x='3' y='5' width='18' height='14' rx='2' />
          <path d='M3 7l9 6 9-6' />
        </svg>
      ),
    },
  }[type];

  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}
    >
      {config.icon}
    </div>
  );
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
    else alert('아직 준비 중인 화면이에요');
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
              className={`flex items-center gap-2.5 px-4 py-2.5 text-left border-b ${n.isRead ? 'bg-white' : 'bg-purple-50'}`}
            >
              <NotificationIcon type={n.type} />
              <div className='flex-1'>
                <div
                  className={`text-xs ${n.isRead ? 'text-gray-500' : 'font-bold'}`}
                >
                  {n.title}
                </div>
                {n.body && (
                  <div className='text-[10px] text-gray-400 mt-0.5'>
                    {n.body}
                  </div>
                )}
                <div className='text-[9px] text-gray-400 mt-0.5'>
                  {new Date(n.createdAt).toLocaleString()}
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
