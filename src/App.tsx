import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LookbookUploadPage from './pages/LookbookUpload/LookbookUploadPage'
import MyClosetPage from './pages/MyCloset/MyClosetPage'
import MyPagePage from './pages/MyPage/MyPagePage'
import NotificationSettingsPage from './pages/NotificationSettings/NotificationSettingsPage'
import ProfileEditPage from './pages/ProfileEdit/ProfileEditPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
