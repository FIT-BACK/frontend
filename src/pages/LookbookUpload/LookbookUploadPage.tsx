import { useState } from 'react'
import { Button, TextInput } from '../../components/common'
import { STYLE_TAG_SUGGESTIONS } from '../../constants/styleTags'
import { useImageUpload } from '../../hooks/useImageUpload'
import { useLookbookUpload } from '../../hooks/useLookbookUpload'
import ImageUploadField from './components/ImageUploadField'
import StyleTagInput from './components/StyleTagInput'

const URL_PATTERN = /^https?:\/\/[^\s]+$/

export default function LookbookUploadPage() {
  const [originalLookImageId, setOriginalLookImageId] = useState<string | null>(null)
  const [valueMatchImageId, setValueMatchImageId] = useState<string | null>(null)
  const [originalLookFile, setOriginalLookFile] = useState<File | null>(null)
  const [valueMatchFile, setValueMatchFile] = useState<File | null>(null)
  const [styleTags, setStyleTags] = useState<string[]>([])
  const [purchaseLink, setPurchaseLink] = useState('')
  const [linkError, setLinkError] = useState<string | null>(null)
  const [comment, setComment] = useState('')

  const originalLookUpload = useImageUpload()
  const valueMatchUpload = useImageUpload()
  const { mutate, isPending, isSuccess, isError } = useLookbookUpload()

  const canSubmit =
    !!originalLookImageId &&
    !!valueMatchImageId &&
    styleTags.length > 0 &&
    !isPending &&
    !originalLookUpload.isUploading &&
    !valueMatchUpload.isUploading

  const handlePurchaseLinkChange = (value: string) => {
    setPurchaseLink(value)
    setLinkError(value && !URL_PATTERN.test(value) ? '올바른 링크 형식을 입력해주세요' : null)
  }

  const handleOriginalLookSelect = async (file: File) => {
    setOriginalLookFile(file)
    setOriginalLookImageId(null)
    try {
      const { imageId } = await originalLookUpload.uploadImage(file)
      setOriginalLookImageId(imageId)
    } catch {
      // 에러 상태는 originalLookUpload.error로 노출됨
    }
  }

  const handleValueMatchSelect = async (file: File) => {
    setValueMatchFile(file)
    setValueMatchImageId(null)
    try {
      const { imageId } = await valueMatchUpload.uploadImage(file)
      setValueMatchImageId(imageId)
    } catch {
      // 에러 상태는 valueMatchUpload.error로 노출됨
    }
  }

  const handleSubmit = () => {
    if (!canSubmit || !originalLookImageId || !valueMatchImageId) return
    if (purchaseLink && !URL_PATTERN.test(purchaseLink)) {
      setLinkError('올바른 링크 형식을 입력해주세요')
      return
    }

    mutate({
      originalLookImageId,
      valueMatchImageId,
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
          onChange={handleOriginalLookSelect}
          isUploading={originalLookUpload.isUploading}
          uploadError={originalLookUpload.error ? '이미지 업로드에 실패했습니다' : null}
          onRetry={() => originalLookFile && handleOriginalLookSelect(originalLookFile)}
        />
        <ImageUploadField
          label="가성비 매칭 사진"
          onChange={handleValueMatchSelect}
          isUploading={valueMatchUpload.isUploading}
          uploadError={valueMatchUpload.error ? '이미지 업로드에 실패했습니다' : null}
          onRetry={() => valueMatchFile && handleValueMatchSelect(valueMatchFile)}
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
