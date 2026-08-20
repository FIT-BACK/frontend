import { useRef } from 'react'
import type { ClosetItem } from '../../../api/closet'

const LONG_PRESS_MS = 600

interface ClosetGridProps {
  items: ClosetItem[]
  onSelect: (item: ClosetItem) => void
  onDelete: (item: ClosetItem) => void
}

export default function ClosetGrid({ items, onSelect, onDelete }: ClosetGridProps) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressed = useRef(false)

  if (items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-text-tertiary">
        아직 저장한 항목이 없어요
      </div>
    )
  }

  const startPress = (item: ClosetItem) => {
    longPressed.current = false
    pressTimer.current = setTimeout(() => {
      longPressed.current = true
      onDelete(item)
    }, LONG_PRESS_MS)
  }

  const endPress = (item: ClosetItem) => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
    if (!longPressed.current) onSelect(item)
  }

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onPointerDown={() => startPress(item)}
          onPointerUp={() => endPress(item)}
          onPointerLeave={cancelPress}
          className="relative flex h-44 w-full flex-col overflow-hidden rounded-lg border border-border bg-white text-left"
        >
          {item.matchedImageUrl ? (
            // 룩북: 원본 vs 매칭 상품 비교 — 두 장을 나란히 보여준다
            <div className="flex h-full w-full gap-[1px]">
              <img
                src={item.imageUrl}
                alt={`${item.title} 원본`}
                className="h-full w-1/2 object-cover"
              />
              <img
                src={item.matchedImageUrl}
                alt={`${item.title} 매칭 상품`}
                className="h-full w-1/2 object-cover"
              />
            </div>
          ) : (
            <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
          )}

          {/* 홈 트렌드 카드와 같은 블랙-보라 그라디언트 — 사진이 카드 전체를 채우도록
              바꾸면서 태그를 사진 위에 얹기 때문에, 태그가 사진 색과 상관없이 항상
              읽히도록 하단에 깐다 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-primary-900/35 via-40% to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1 p-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  )
}
