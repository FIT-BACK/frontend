// src/components/layout/TabBar.tsx
import { Link } from 'react-router-dom';

const TabBar = () => {
  return (
    <nav className="h-16 w-full flex items-center justify-around border-t border-gray-200 bg-white">
      <Link to="/">홈</Link>
      <Link to="/closet">클로젯</Link>
      
      {/* 가운데 강조된 플러스 버튼 (FAB) */}
      <Link to="/upload" className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center -mt-8 shadow-lg">
        +
      </Link>
      
      <Link to="/saved">저장</Link>
      <Link to="/mypage">마이</Link>
    </nav>
  );
};

export default TabBar;