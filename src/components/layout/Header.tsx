import { useNavigate } from 'react-router-dom';
import { useUnreadNotificationCount } from '../../hooks/useNotification';

const Header = () => {
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 border-b border-primary-200 bg-white">
      <div className="font-bold text-lg text-primary-900">FIT BACK</div>
      <button
        className="relative text-text-secondary"
        onClick={() => navigate('/alerts')}
        aria-label="알림"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-error-400 border border-white" />
        )}
      </button>
    </header>
  );
};

export default Header;
