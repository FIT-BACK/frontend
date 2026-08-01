import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

import LoginPage from './pages/LoginPage/LoginPage';
import SignupBasicPage from './pages/LoginPage/SignupBasicPage';
import SignupProfilePage from './pages/LoginPage/SignupProfilePage';
import SignupCompletePage from './pages/LoginPage/SignupCompletePage';
import KakaoCallback from './pages/LoginPage/KakaoCallback';
import FindPasswordPage from './pages/LoginPage/FindPasswordPage';
import ResetPasswordPage from './pages/LoginPage/ResetPasswordPage';
import HomePage from './pages/HomePage';

import LookbookUploadPage from './pages/LookbookUpload/LookbookUploadPage';
import MyClosetPage from './pages/MyCloset/MyClosetPage';
import MyPagePage from './pages/MyPage/MyPagePage';
import NotificationSettingsPage from './pages/NotificationSettings/NotificationSettingsPage';
import ProfileEditPage from './pages/ProfileEdit/ProfileEditPage';
import SearchPage from './pages/SearchPage';

import ImageUploadPage from './pages/ImageUploadPage';
import { AiWaitingPage } from './pages/AiWaitingPage';
import { TagEditPage } from './pages/TagEditPage';
import { ResultReportPage } from './pages/ResultReportPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import TrendDetailPage from './pages/TrendDetailPage';
import MoreTrendsPage from './pages/MoreTrendsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import LookbookDetailPage from './pages/LookbookDetail/LookbookDetailPage';
import NotificationListPage from './pages/NotificationListPage';

// 검색바의 텍스트 검색은 /search로, 카메라(이미지로 검색) 아이콘은 AI 매칭 업로드로 연결
function HomeRoute() {
  const navigate = useNavigate();
  return (
    <HomePage
      onOpenSearch={() => navigate('/search')}
      onOpenImageSearch={() => navigate('/image-upload')}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout이 적용되는 페이지 그룹 */}
        <Route path='/' element={<Layout />}>
          <Route index element={<HomeRoute />} />
          <Route path='mypage' element={<MyPagePage />} />
          <Route path='closet' element={<MyClosetPage />} />
          <Route path='upload' element={<LookbookUploadPage />} />
          <Route path='profile-edit' element={<ProfileEditPage />} />
          <Route path='notifications' element={<NotificationSettingsPage />} />
          <Route path='image-upload' element={<ImageUploadPage />} />
          <Route path='search' element={<SearchPage />} />
          <Route path='lookbooks/:lookbookId' element={<LookbookDetailPage />} />
          <Route path='alerts' element={<NotificationListPage />} />
        </Route>

        {/* Layout이 적용되지 않는 단독 페이지들 */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupBasicPage />} />
        <Route path='/signup/basic' element={<SignupBasicPage />} />
        <Route path='/signup/profile' element={<SignupProfilePage />} />
        <Route path='/signup/complete' element={<SignupCompletePage />} />

        <Route path='/find-password' element={<FindPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />

        <Route path='/oauth/kakao' element={<KakaoCallback />} />

        <Route path='/change-password' element={<ChangePasswordPage />} />

        <Route path='/waiting' element={<AiWaitingPage />} />
        <Route path='/tag-edit' element={<TagEditPage />} />
        <Route path='/result' element={<ResultReportPage />} />
        <Route path='/product/:productId' element={<ProductDetailPage />} />
        <Route path='/trend/:id' element={<TrendDetailPage />} />
        <Route path='/trends' element={<MoreTrendsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
