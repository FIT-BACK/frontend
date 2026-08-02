import { useState } from 'react'
import { Button, TagSelectBottomSheet, TextInput } from '../../components/common'
import { useTags } from '../../hooks/useTags'
import type { StyleTag } from '../../api/tags'
import { useImageUpload } from '../../hooks/useImageUpload'
import { useLookbookUpload } from '../../hooks/useLookbookUpload'
import ImageUploadField from './components/ImageUploadField'

const URL_PATTERN = /^https?:\/\/[^\s]+$/
const MAX_TAGS = 5

export default function LookbookUploadPage() {
  const [selectedTags, setSelectedTags] = useState<StyleTag[]>([])
  const [isTagSheetOpen, setIsTagSheetOpen] = useState(false)
  const [purchaseLink, setPurchaseLink] = useState('')
  const [linkError, setLinkError] = useState<string | null>(null)
  const [comment, setComment] = useState('')

  const { data: allTags = [], isLoading: isTagsLoading } = useTags()

  // useImageUpload가 uploadImage()의 결과를 반환하지 않고 내부 상태(imageId/lastFile)로 들고 있는 방식이라
  // 여기서도 로컬 state로 별도 관리하지 않고 훅의 상태를 그대로 사용
  const originalLookUpload = useImageUpload('LOOKBOOK')
  const valueMatchUpload = useImageUpload('LOOKBOOK')
  const { mutate, isPending, isError, isSuccess } = useLookbookUpload()

  // 백엔드가 매칭 이미지/매칭 상품 중 정확히 하나만 요구함(둘 다 없거나 둘 다 있으면 에러) —
  // 이 화면은 분석 결과 연동 없이 직접 올리는 흐름이라 매칭 이미지를 필수로 받는다.
  const canSubmit =
    !!originalLookUpload.imageId &&
    !!valueMatchUpload.imageId &&
    selectedTags.length > 0 &&
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
      originalImageId: originalLookUpload.imageId,
      matchedImageId: valueMatchUpload.imageId,
      tagIds: selectedTags.map((tag) => tag.tagId),
      purchaseUrl: purchaseLink || undefined,
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

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text">스타일 태그</span>
        <div className="flex flex-wrap items-center gap-2">
          {selectedTags.map((tag) => (
            <button
              key={tag.tagId}
              type="button"
              onClick={() => setSelectedTags((prev) => prev.filter((t) => t.tagId !== tag.tagId))}
              className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-800"
            >
              #{tag.tagName} ✕
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsTagSheetOpen(true)}
            disabled={selectedTags.length >= MAX_TAGS}
            className="rounded-full border border-border px-3 py-1 text-sm text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            + 추가
          </button>
        </div>
      </div>

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

      <TagSelectBottomSheet
        open={isTagSheetOpen}
        tags={allTags}
        selectedTagIds={selectedTags.map((tag) => tag.tagId)}
        maxTags={MAX_TAGS}
        isLoading={isTagsLoading}
        onConfirm={setSelectedTags}
        onClose={() => setIsTagSheetOpen(false)}
      />
    </div>
  )
}
