import { useState } from 'react'
import { Button, TextInput } from '../../components/common'
import { STYLE_TAG_SUGGESTIONS } from '../../constants/styleTags'
import { useImageUpload } from '../../hooks/useImageUpload'
import { useLookbookUpload } from '../../hooks/useLookbookUpload'
import ImageUploadField from './components/ImageUploadField'
import StyleTagInput from './components/StyleTagInput'

const URL_PATTERN = /^https?:\/\/[^\s]+$/

export default function LookbookUploadPage() {
  const [styleTags, setStyleTags] = useState<string[]>([])
  const [purchaseLink, setPurchaseLink] = useState('')
  const [linkError, setLinkError] = useState<string | null>(null)
  const [comment, setComment] = useState('')

  // useImageUpload가 uploadImage()의 결과를 반환하지 않고 내부 상태(imageId/lastFile)로 들고 있는 방식이라
  // 여기서도 로컬 state로 별도 관리하지 않고 훅의 상태를 그대로 사용
  const originalLookUpload = useImageUpload()
  const valueMatchUpload = useImageUpload()
  const { mutate, isPending, isSuccess, isError } = useLookbookUpload()

  const canSubmit =
    !!originalLookUpload.imageId &&
    !!valueMatchUpload.imageId &&
    styleTags.length > 0 &&
    !isPending &&
    !originalLookUpload.isUploading &&
    !valueMatchUpload.isUploading

  const handlePurchaseLinkChange = (value: string) => {
    setPurchaseLink(value)
    setLinkError(value && !URL_PATTERN.test(value) ? '올바른 링크 형식을 입력해주세요' : null)
  }

  const handleSubmit = () => {
    if (!canSubmit || !originalLookUpload.imageId || !valueMatchUpload.imageId) return
    if (purchaseLink && !URL_PATTERN.test(purchaseLink)) {
      setLinkError('올바른 링크 형식을 입력해주세요')
      return
    }

    mutate({
      originalLookImageId: originalLookUpload.imageId,
      valueMatchImageId: valueMatchUpload.imageId,
      styleTags,
      purchaseLink: purchaseLink || undefined,
      comment: comment || undefined,
    })
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 bg-bg p-4">
      <h1 className="text-lg font-semibold text-text">내 룩북 올리기</h1>

      <div className="grid grid-cols-2 gap-3">
        <ImageUploadField
          label="원본 룩 사진"
          onChange={originalLookUpload.uploadImage}
          isUploading={originalLookUpload.isUploading}
          uploadError={originalLookUpload.error}
          onRetry={originalLookUpload.retryUpload}
        />
        <ImageUploadField
          label="가성비 매칭 사진"
          onChange={valueMatchUpload.uploadImage}
          isUploading={valueMatchUpload.isUploading}
          uploadError={valueMatchUpload.error}
          onRetry={valueMatchUpload.retryUpload}
        />
      </div>

      <StyleTagInput
        tags={styleTags}
        onChange={setStyleTags}
        suggestions={STYLE_TAG_SUGGESTIONS}
      />

      <TextInput
        label="구매 링크 (선택)"
        placeholder="https://..."
        value={purchaseLink}
        onChange={(e) => handlePurchaseLinkChange(e.target.value)}
        error={linkError ?? undefined}
      />

      <TextInput
        label="코멘트"
        placeholder="한 줄 코멘트를 남겨주세요"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button disabled={!canSubmit} onClick={handleSubmit}>
        {isPending ? '업로드 중...' : '룩북 올리기'}
      </Button>

      {isError && (
        <p className="text-center text-sm text-error-400">
          업로드에 실패했습니다. 다시 시도해주세요
        </p>
      )}
      {isSuccess && (
        <p className="text-center text-sm text-primary-600">
          룩북이 업로드되었습니다
        </p>
      )}
    </div>
  )
}
