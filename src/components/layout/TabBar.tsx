import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, Plus, Search, User } from 'lucide-react';

interface TabBarProps {
  onUploadClick?: () => void;
}

const TabBar = ({ onUploadClick }: TabBarProps) => {
  const location = useLocation();

  // 현재 경로와 링크 경로가 같은지 확인하는 함수
  const isActive = (path: string) => location.pathname === path;

  // 스타일을 결정하는 공통 함수
  const getLinkClass = (path: string) => 
    `flex flex-col items-center transition-colors ${isActive(path) ? 'text-primary-600' : 'text-text-secondary'}`;

  return (
    // fixed + inset-x-0 bottom-0으로 뷰포트 바닥에 직접 붙인다 — 부모의
    // dvh 계산에 기대는 대신, 브라우저가 매 순간 알려주는 실제 보이는
    // 화면 하단을 기준으로 위치를 잡기 때문에 카톡 인앱 브라우저처럼
    // 자체 하단 툴바가 있는 임베디드 브라우저에서도 가려지지 않는다.
    // Layout이 max-w-[480px]로 가운데 정렬돼 있으므로 TabBar도 같은
    // 너비로 맞춰야 데스크톱에서 폭이 어긋나지 않는다.
    //
    // 세이프 에어리어 패딩을 아이콘 행과 같은 flex 컨테이너에 주면(예:
    // min-h-16 + items-center) 그만큼 아이콘 행 전체가 위로 쏠리고 짧게
    // 눌려 보이므로, 아이콘 행(h-16, 항상 고정 높이로 정중앙 정렬)과
    // 세이프 에어리어 여백(그 아래 별도 공간)을 분리해둔다.
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] border-t border-primary-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="h-16 w-full flex items-center justify-around">
        {/* 홈 */}
        <Link to="/" className={getLinkClass('/')}>
          <Home size={26} />
          <span className="text-[10px] mt-1 font-medium">홈</span>
        </Link>

        {/* 클로젯 */}
        <Link to="/closet" className={getLinkClass('/closet')}>
          <Menu size={26} />
          <span className="text-[10px] mt-1 font-medium">클로젯</span>
        </Link>

        {/* 업로드 버튼 */}
        {onUploadClick ? (
          <button
            type="button"
            onClick={onUploadClick}
            className="flex flex-col items-center focus:outline-none"
          >
            <div className="bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center -mt-8 shadow-lg hover:bg-primary-800 transition-colors border-4 border-white">
              <Plus size={32} strokeWidth={3} />
            </div>
            <span className={`text-[10px] mt-1 font-medium ${isActive('/upload') ? 'text-primary-600' : 'text-text-secondary'}`}>
              업로드
            </span>
          </button>
        ) : (
          <Link to="/upload" className="flex flex-col items-center">
            <div className="bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center -mt-8 shadow-lg hover:bg-primary-800 transition-colors border-4 border-white">
              <Plus size={32} strokeWidth={3} />
            </div>
            <span className={`text-[10px] mt-1 font-medium ${isActive('/upload') ? 'text-primary-600' : 'text-text-secondary'}`}>
              업로드
            </span>
          </Link>
        )}

        {/* 검색 */}
        <Link to="/search" className={getLinkClass('/search')}>
          <Search size={26} />
          <span className="text-[10px] mt-1 font-medium">검색</span>
        </Link>

        {/* 마이 */}
        <Link to="/mypage" className={getLinkClass('/mypage')}>
          <User size={26} />
          <span className="text-[10px] mt-1 font-medium">마이</span>
        </Link>
      </div>
    </nav>
  );
};

export default TabBar;