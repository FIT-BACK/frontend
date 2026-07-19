import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupBasicPage from './pages/LoginPage/SignupBasicPage';
import SignupProfilePage from './pages/LoginPage/SignupProfilePage';
import KakaoCallback from './pages/LoginPage/KakaoCallback'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LookbookUploadPage from './pages/LookbookUpload/LookbookUploadPage'
import MyClosetPage from './pages/MyCloset/MyClosetPage'
import MyPagePage from './pages/MyPage/MyPagePage'
import NotificationSettingsPage from './pages/NotificationSettings/NotificationSettingsPage'
import ProfileEditPage from './pages/ProfileEdit/ProfileEditPage'

import {AiWaitingPage} from './pages/AiWaitingPage';
import {TagEditPage} from './pages/TagEditPage';
import { ResultReportPage } from './pages/ResultReportPage'; 
import ChangePasswordPage from './pages/ChangePasswordPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={
            <div className="p-4 text-center">
              <h1 className="text-2xl font-bold mt-10">홈 화면</h1>
              <p>실제 컨텐츠 표시</p>
            </div>
          } />
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <div className="p-4 text-center">
                <h1 className="text-2xl font-bold mt-10">홈 화면</h1>
                <p>실제 컨텐츠 표시</p>
              </div>
            }
          />
          <Route path="mypage" element={<MyPagePage />} />
          <Route path="closet" element={<MyClosetPage />} />
          <Route path="upload" element={<LookbookUploadPage />} />
          <Route path="profile-edit" element={<ProfileEditPage />} />
          <Route path="notifications" element={<NotificationSettingsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupBasicPage />} />
        <Route path="/signup/basic" element={<SignupBasicPage />} />
        <Route path="/signup/profile" element={<SignupProfilePage />} />
        
        <Route path="/oauth/kakao" element={<KakaoCallback />} />
        
        {/* 추가된 비밀번호 변경 페이지 라우터 */}
        <Route path="/change-password" element={<ChangePasswordPage />} />

        <Route path="/waiting" element={<AiWaitingPage />} />
        <Route path="/tag-edit" element={<TagEditPage />} />
        <Route path="/result" element={<ResultReportPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
