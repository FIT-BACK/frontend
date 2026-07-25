import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { PageLoader } from './components/common'

const LookbookUploadPage = lazy(() => import('./pages/LookbookUpload/LookbookUploadPage'))
const MyClosetPage = lazy(() => import('./pages/MyCloset/MyClosetPage'))
const MyPagePage = lazy(() => import('./pages/MyPage/MyPagePage'))
const NotificationSettingsPage = lazy(() => import('./pages/NotificationSettings/NotificationSettingsPage'))
const ProfileEditPage = lazy(() => import('./pages/ProfileEdit/ProfileEditPage'))

const AiWaitingPage = lazy(() =>
  import('./pages/AiWaitingPage').then((m) => ({ default: m.AiWaitingPage })),
)
const TagEditPage = lazy(() =>
  import('./pages/TagEditPage').then((m) => ({ default: m.TagEditPage })),
)
const ResultReportPage = lazy(() =>
  import('./pages/ResultReportPage').then((m) => ({ default: m.ResultReportPage })),
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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

          {/*  SCR 06, 07, 08 (독립 경로) */}
          <Route path="/waiting" element={<AiWaitingPage />} />
          <Route path="/tag-edit" element={<TagEditPage />} />
          <Route path="/result" element={<ResultReportPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
