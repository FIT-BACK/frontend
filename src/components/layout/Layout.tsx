import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import TabBar from './TabBar';
import UploadSelectSheet, {
  type UploadPurpose,
} from '../domain/UploadSelectSheet';
import OnboardingTutorial from '../domain/OnboardingTutorial';
import UploadHintArrow from '../domain/UploadHintArrow';

const Layout = () => {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);

  const handleSelectPurpose = (purpose: UploadPurpose) => {
    if (purpose === 'analysis') {
      navigate('/image-upload'); // AI 가성비 매칭 분석 ➔ 이미지 업로드 페이지로
    } else if (purpose === 'lookbook') {
      navigate('/upload'); // 내 룩북 올리기 ➔ 룩북 업로드 페이지로
    }
  };

  return (
    // h-screen(100vh)만 쓰면 모바일 브라우저 주소창/툴바가 접혔다 펴졌다 하는
    // 만큼의 높이가 빠진 채로 계산돼서, 하단에 고정된 TabBar가 실제 화면보다
    // 아래로 밀려나 "하단 바가 너무 낮다"(스크롤해야 보이거나 잘려 보임)는
    // 문제가 있었다 — 100dvh(동적 뷰포트 높이)로 덮어써서 실제 보이는 화면
    // 높이에 맞춘다. (ResultReportPage에 이미 있던 동일 패턴과 통일)
    <div className='h-screen h-[100dvh] bg-bg flex justify-center'>
      <div className='w-full max-w-[480px] bg-white h-screen h-[100dvh] flex flex-col shadow-lg relative'>
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

        {/* 처음 앱을 켠 사용자를 위한 1회성 사용법 안내 */}
        <OnboardingTutorial onVisibilityChange={setIsOnboardingVisible} />

        {/* 홈 화면에서 뭘 해야 할지 몰라 스크롤만 내리게 된다는 피드백 — 업로드
            버튼을 가리키는 1회성 화살표 안내 (첫 방문 시에만). 온보딩 모달이
            떠 있는 동안은 waitFor로 대기시켜, 온보딩을 다 읽고 닫은 뒤부터
            화살표가 6초간 보이도록 한다. */}
        <UploadHintArrow dismissOn={isSheetOpen} waitFor={isOnboardingVisible} />
      </div>
    </div>
  );
};

export default Layout;
