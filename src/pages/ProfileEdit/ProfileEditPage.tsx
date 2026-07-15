import { useEffect, useRef, useState } from 'react'
import { Button, TextInput } from '../../components/common'
import { STYLE_TAG_SUGGESTIONS } from '../../constants/styleTags'
import { checkNicknameAvailable } from '../../api/profile'
import { useImageUpload } from '../../hooks/useImageUpload'
import { useMyProfile, useUpdateProfile } from '../../hooks/useMyPage'
import { navigate } from '../../utils/navigate'
import StyleTagInput from '../LookbookUpload/components/StyleTagInput'
import AvatarEditField from './components/AvatarEditField'

const NICKNAME_DEBOUNCE_MS = 500

export default function ProfileEditPage() {
  const { data: profile, isLoading } = useMyProfile()
  const { mutate: saveProfile, isPending, isError } = useUpdateProfile()
  const avatarUpload = useImageUpload()

  const [name, setName] = useState('')
  const [styleTags, setStyleTags] = useState<string[]>([])
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [avatarImageId, setAvatarImageId] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [nicknameError, setNicknameError] = useState<string | null>(null)
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const checkTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (profile) {
      setName(profile.name)
      setStyleTags(profile.styleTags)
    }
  }, [profile])

  const handleNameChange = (value: string) => {
    setName(value)
    setNicknameError(null)
    if (checkTimer.current) clearTimeout(checkTimer.current)

    if (value.length === 0) return
    if (value.length < 2) {
      setNicknameError('2자 이상 입력해주세요')
      return
    }
    if (value.length > 16) {
      setNicknameError('16자 이하로 입력해주세요')
      return
    }

    checkTimer.current = setTimeout(async () => {
      setIsCheckingNickname(true)
      const { available } = await checkNicknameAvailable(value)
      setIsCheckingNickname(false)
      if (!available) setNicknameError('이미 사용중인 닉네임입니다')
    }, NICKNAME_DEBOUNCE_MS)
  }

  const handleAvatarSelect = async (file: File) => {
    setAvatarFile(file)
    setAvatarPreviewUrl(URL.createObjectURL(file))
    setAvatarImageId(null)
    try {
      const { imageId } = await avatarUpload.uploadImage(file)
      setAvatarImageId(imageId)
    } catch {
      // 에러 상태는 avatarUpload.error로 노출됨
    }
  }

  const isDirty =
    !!profile &&
    (name !== profile.name ||
      JSON.stringify(styleTags) !== JSON.stringify(profile.styleTags) ||
      !!avatarPreviewUrl)

  const canSave =
    isDirty &&
    !isPending &&
    !avatarUpload.isUploading &&
    !nicknameError &&
    !isCheckingNickname &&
    name.length >= 2

  const handleBack = () => {
    if (isDirty && !window.confirm('변경 내용이 저장되지 않습니다. 나가시겠어요?')) return
    navigate('/mypage')
  }

  const handleSave = () => {
    if (!canSave) return
    saveProfile(
      { name, styleTags, avatarImageId: avatarImageId ?? undefined },
      { onSuccess: () => navigate('/mypage') },
    )
  }

  if (isLoading || !profile) {
    return <p className="p-4 text-center text-sm text-text-tertiary">불러오는 중...</p>
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 bg-bg p-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={handleBack} className="text-sm text-text-secondary">
          ←
        </button>
        <h1 className="text-base font-semibold text-text">회원정보 수정</h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="text-sm font-bold text-primary-600 disabled:text-text-tertiary"
        >
          저장
        </button>
      </div>

      <AvatarEditField
        avatarUrl={avatarPreviewUrl ?? profile.avatarUrl}
        isUploading={avatarUpload.isUploading}
        uploadError={avatarUpload.error ? '이미지 업로드에 실패했습니다' : null}
        onSelect={handleAvatarSelect}
        onRetry={() => avatarFile && handleAvatarSelect(avatarFile)}
      />

      <div className="flex flex-col gap-1">
        <TextInput
          label="닉네임"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          error={nicknameError ?? undefined}
        />
        <span className="text-xs text-text-tertiary">2~16자, 영문·한글·숫자 사용 가능</span>
      </div>

      <StyleTagInput
        label="관심 스타일"
        tags={styleTags}
        onChange={setStyleTags}
        suggestions={STYLE_TAG_SUGGESTIONS}
      />

      <TextInput label="이메일 (변경 불가)" value={profile.email} disabled readOnly />

      {isError && (
        <p className="text-center text-sm text-error-400">저장에 실패했습니다. 다시 시도해주세요</p>
      )}

      <Button disabled={!canSave} onClick={handleSave}>
        저장하기
      </Button>
    </div>
  )
}
