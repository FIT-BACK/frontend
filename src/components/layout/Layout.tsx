import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import TabBar from './TabBar';
import UploadSelectSheet, {
  type UploadPurpose,
} from '../domain/UploadSelectSheet';

const Layout = () => {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSelectPurpose = (purpose: UploadPurpose) => {
    if (purpose === 'analysis') {
      navigate('/image-upload'); // AI 가성비 매칭 분석 ➔ 이미지 업로드 페이지로
    } else if (purpose === 'lookbook') {
      navigate('/upload'); // 내 룩북 올리기 ➔ 룩북 업로드 페이지로
    }
  };

  return (
    <div className='h-screen bg-bg flex justify-center'>
      <div className='w-full max-w-[480px] bg-white h-screen flex flex-col shadow-lg relative'>
        <Header />

        {/* 콘텐츠가 들어갈 영역 */}
        <main className='flex-1 overflow-y-auto'>
          <Outlet />
        </main>

        {/* 3. TabBar에 onUploadClick 핸들러 전달 */}
        <TabBar onUploadClick={() => setIsSheetOpen(true)} />

        {/* 4. 바텀시트 컴포넌트배치 */}
        <UploadSelectSheet
          open={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          onSelected={handleSelectPurpose}
        />
      </div>
    </div>
  );
};

export default Layout;
