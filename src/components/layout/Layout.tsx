import { Outlet } from 'react-router-dom';
import Header from './Header';
import TabBar from './TabBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* 가로 480px 상한 + 중앙 정렬 + 흰색 배경 */}
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col shadow-lg relative">
        <Header />
        
        {/* 콘텐츠가 들어갈 영역 */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        
        <TabBar />
      </div>
    </div>
  );
};

export default Layout;