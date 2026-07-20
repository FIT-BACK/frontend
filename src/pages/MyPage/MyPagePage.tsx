import { useState } from 'react'
import { navigate } from '../../utils/navigate'
import { useMyProfile, useLogout } from '../../hooks/useMyPage'
import ProfileHeader from './components/ProfileHeader'
import SettingsListItem from './components/SettingsListItem'
import StatSummary from './components/StatSummary'
import LogoutModal from '../../components/common/LogoutModal'

export default function MyPagePage() {
  const { data: profile, isLoading, isError } = useMyProfile()
  const { mutate: logout } = useLogout()
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  const executeLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        localStorage.removeItem('accessToken')
        setIsLogoutModalOpen(false) 
        window.location.href = '/login'
      },
    })
  }

  if (isLoading) {
    return <p className="p-4 text-center text-sm text-text-tertiary">불러오는 중...</p>
  }

  if (isError || !profile) {
    return <p className="p-4 text-center text-sm text-error-400">데이터를 불러오지 못했습니다</p>
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 bg-bg p-4">
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
        onAvatarClick={() => navigate('/profile-edit')}
      />

      <StatSummary {...profile.stats} />

      <div className="flex flex-col">
        <SettingsListItem label="회원정보 수정" onClick={() => navigate('/profile-edit')} />
        <SettingsListItem label="알림 설정" onClick={() => navigate('/notifications')} />
        <SettingsListItem
          label="비밀번호 변경"
          onClick={() => navigate('/change-password')}
          disabled={profile.isSocialLogin}
        />
        <SettingsListItem label="로그아웃" onClick={() => setIsLogoutModalOpen(true)} />
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={executeLogout}
      />
    </div>
  )
}