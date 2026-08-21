import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useUnreadNotificationCount } from '../../hooks/useNotification';
import hangerIcon from '../../assets/hanger-icon.png';

// 옅은 그라디언트(왼쪽 #8f86dd → 오른쪽 #d0caf6)를 썼더니 로고가 흐리멍텅해
// 보인다는 피드백 — 그라디언트를 없애고 디자인 시스템에서 가장 진한 보라
// 토큰(primary-900)의 단색으로 통일한다.
const LOGO_COLOR = '#26215c';

const Header = () => {
  const navigate = useNavigate();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  return (
    <header className="h-16 w-full flex items-center justify-between px-4 bg-white">
      {/* 1. 로고 영역 */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
        {/* 옷걸이 아이콘(알파 채널만 있는 PNG)을 CSS mask로 써서 단색을
            아이콘 실루엣에만 채운다 — 배경은 완전히 투명.
            (이전 추출본은 배경의 min(r,g,b) 값이 완전히 0으로 안 떨어져서
            옅은 사각형이 배경에 비쳐 보였음 — chroma(=max-min 채널 차)
            기준으로 다시 뽑아서 배경은 완전히 alpha 0으로 처리) */}
        <span
          aria-hidden="true"
          className="h-8 shrink-0"
          style={{
            aspectRatio: '178 / 134',
            backgroundColor: LOGO_COLOR,
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
        <span
          aria-hidden="true"
          className="font-extrabold text-xl"
          style={{ color: LOGO_COLOR }}
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