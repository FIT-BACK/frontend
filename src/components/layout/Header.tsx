import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useUnreadNotificationCount } from '../../hooks/useNotification';
import hangerIcon from '../../assets/hanger-icon.png';

// 원래 브랜드 로고(public/logo.png)는 보라색 그라디언트 사각형 배경 위에
// 흰색 옷걸이+글자를 얹은 형태였음 — 배경 사각형을 없애는 대신, 그 배경이
// 쓰던 그라디언트를 옷걸이 아이콘과 글자에 그대로 옮겨왔다.
// (원본 로고에서 좌/우 끝 색을 직접 샘플링: 왼쪽 #8f86dd → 오른쪽 #d0caf6)
const LOGO_GRADIENT = 'linear-gradient(90deg, #8f86dd 0%, #d0caf6 100%)';

const Header = () => {
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 bg-white">
      {/* 1. 로고 영역 */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
        {/* 옷걸이 아이콘(알파 채널만 있는 PNG)을 CSS mask로 써서 그라디언트를
            아이콘 실루엣에만 채운다 — 배경은 완전히 투명. */}
        <span
          aria-hidden="true"
          className="h-8 shrink-0"
          style={{
            aspectRatio: '180 / 137',
            backgroundImage: LOGO_GRADIENT,
            WebkitMaskImage: `url(${hangerIcon})`,
            maskImage: `url(${hangerIcon})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        />
        {/* 글자도 같은 그라디언트로 채운다 (배경 그라디언트를 text-fill로 잘라냄) */}
        <span
          aria-hidden="true"
          className="font-extrabold text-xl bg-clip-text text-transparent"
          style={{ backgroundImage: LOGO_GRADIENT }}
        >
          FIT BACK
        </span>
        <span className="sr-only">FIT BACK 홈으로 이동</span>
      </div>

      {/* 2. 알림 아이콘 영역 */}
      <button
        className="relative flex items-center justify-center w-10 h-10 text-gray-500"
        onClick={() => navigate('/alerts')}
        aria-label='알림'
      >
        {/* 디자인 시스템 아이콘 시트(System·알림)과 동일한 stroke 2px 종 아이콘 */}
        <Bell size={22} strokeWidth={2} />

        {/* 빨간색 알림 점 */}
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-error-400 border-2 border-white" />
        )}
      </button>
    </header>
  );
};

export default Header;