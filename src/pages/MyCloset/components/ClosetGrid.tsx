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
          className="flex flex-col overflow-hidden rounded-lg border border-border bg-white text-left"
        >
          <img src={item.imageUrl} alt={item.title} className="h-32 w-full object-cover" />
          <span className="p-2 text-sm text-text">{item.title}</span>
        </button>
      ))}
    </div>
  )
}
