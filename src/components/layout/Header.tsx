import { useNavigate } from 'react-router-dom';
import { useUnreadNotificationCount } from '../../hooks/useNotification';
import logoImage from '../../../public/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 border-b border-primary-200 bg-white">
      {/* 1. 로고 영역 */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <img
          src={logoImage}
          alt="FIT BACK 로고"
          className="w-8 h-8 object-contain rounded-md"
        />
        <div className="font-bold text-lg text-primary-900">FIT BACK</div>
      </div>

      {/* 2. 알림 아이콘 영역 */}
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
        onClick={() => navigate('/alerts')}
        aria-label='알림'
      >
        {/* 예쁜 선형 종 모양 SVG 아이콘 */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>

        {/* 빨간색 알림 점 */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-pink-500 border-2 border-white" />
        )}
      </button>
    </header>
  );
};

export default Header;