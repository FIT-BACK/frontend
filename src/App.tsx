import { useEffect, useState } from 'react'
import LookbookUploadPage from './pages/LookbookUpload/LookbookUploadPage'
import MyClosetPage from './pages/MyCloset/MyClosetPage'
import MyPagePage from './pages/MyPage/MyPagePage'
import NotificationSettingsPage from './pages/NotificationSettings/NotificationSettingsPage'
import ProfileEditPage from './pages/ProfileEdit/ProfileEditPage'

function getCurrentRoute() {
  if (typeof window === 'undefined') return '/'

  const pathname = window.location.pathname
  if (pathname === '/mypage') return '/mypage'
  if (pathname === '/my-closet') return '/my-closet'
  if (pathname === '/lookbook-upload') return '/lookbook-upload'
  if (pathname === '/profile-edit') return '/profile-edit'
  if (pathname === '/notifications') return '/notifications'
  return '/'
}

function App() {
  const [route, setRoute] = useState(getCurrentRoute())

  useEffect(() => {
    const handleRouteChange = () => setRoute(getCurrentRoute())
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const navigateTo = (nextRoute: string) => {
    window.history.pushState({}, '', nextRoute)
    setRoute(nextRoute)
  }

  if (route === '/mypage') return <MyPagePage />
  if (route === '/my-closet') return <MyClosetPage />
  if (route === '/lookbook-upload') return <LookbookUploadPage />
  if (route === '/profile-edit') return <ProfileEditPage />
  if (route === '/notifications') return <NotificationSettingsPage />

  return (
    <div className="min-h-screen bg-bg px-4 py-10 text-text">
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">FIT-BACK</h1>
          <p className="text-sm text-text-tertiary">원하는 화면으로 이동해보세요.</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigateTo('/mypage')}
            className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-left font-medium text-primary-700"
          >
            마이페이지
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/my-closet')}
            className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-left font-medium text-primary-700"
          >
            마이 클로젯
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/lookbook-upload')}
            className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-left font-medium text-primary-700"
          >
            룩북 업로드
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/profile-edit')}
            className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-left font-medium text-primary-700"
          >
            회원정보 수정
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/notifications')}
            className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-left font-medium text-primary-700"
          >
            알림 설정
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
