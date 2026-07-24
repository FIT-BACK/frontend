import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Plus, Search, User } from 'lucide-react';

const TabBar = () => {
  const location = useLocation();

  // 현재 경로와 링크 경로가 같은지 확인하는 함수
  const isActive = (path: string) => location.pathname === path;

  // 스타일을 결정하는 공통 함수
  const getLinkClass = (path: string) => 
    `flex flex-col items-center transition-colors ${isActive(path) ? 'text-primary-600' : 'text-text-secondary'}`;

  return (
    <nav className="h-16 w-full flex items-center justify-around border-t border-primary-200 bg-white z-50">
      
      {/* 홈 */}
      <Link to="/" className={getLinkClass('/')}>
        <Home size={22} />
        <span className="text-[10px] mt-1 font-medium">홈</span>
      </Link>

      {/* 클로젯 */}
      <Link to="/closet" className={getLinkClass('/closet')}>
        <ClipboardList size={22} />
        <span className="text-[10px] mt-1 font-medium">클로젯</span>
      </Link>
      
      {/* 업로드 버튼 (이건 보라색 고정) */}
      <Link to="/upload" className="flex flex-col items-center">
        <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center -mt-8 shadow-lg hover:bg-primary-800 transition-colors border-4 border-white">
          <Plus size={28} strokeWidth={3} />
        </div>
        <span className={`text-[10px] mt-1 font-medium ${isActive('/upload') ? 'text-primary-600' : 'text-text-secondary'}`}>업로드</span>
      </Link>
      
      {/* 검색 */}
      <Link to="/search" className={getLinkClass('/search')}>
        <Search size={22} />
        <span className="text-[10px] mt-1 font-medium">검색</span>
      </Link>

      {/* 마이 */}
      <Link to="/mypage" className={getLinkClass('/mypage')}>
        <User size={22} />
        <span className="text-[10px] mt-1 font-medium">마이</span>
      </Link>
    </nav>
  );
};

export default TabBar;