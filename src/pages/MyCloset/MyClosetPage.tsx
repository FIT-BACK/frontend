import { useMemo, useState } from 'react'
import type { ClosetItem } from '../../api/closet'
import { useClosetItems, useDeleteClosetItem } from '../../hooks/useMyCloset'
import CategoryTabs, { type ClosetTab } from './components/CategoryTabs'
import ClosetGrid from './components/ClosetGrid'

export default function MyClosetPage() {
  const [activeTab, setActiveTab] = useState<ClosetTab>('all')
  const { data: items = [], isLoading, isError } = useClosetItems()
  const { mutate: deleteItem } = useDeleteClosetItem()

  const filteredItems = useMemo(
    () => (activeTab === 'all' ? items : items.filter((item) => item.category === activeTab)),
    [items, activeTab],
  )

  const handleSelect = (item: ClosetItem) => {
    console.log('선택한 클로젯 아이템', item)
  }

  const handleDelete = (item: ClosetItem) => {
    if (window.confirm(`'${item.title}'을(를) 삭제할까요?`)) {
      deleteItem(item.id)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 bg-bg p-4">
      <h1 className="text-lg font-semibold text-text">마이 클로젯</h1>

      <CategoryTabs activeTab={activeTab} onChange={setActiveTab} />

      {isLoading && (
        <p className="py-8 text-center text-sm text-text-tertiary">불러오는 중...</p>
      )}
      {isError && (
        <p className="py-8 text-center text-sm text-error-400">
          데이터를 불러오지 못했습니다
        </p>
      )}
      {!isLoading && !isError && (
        <ClosetGrid items={filteredItems} onSelect={handleSelect} onDelete={handleDelete} />
      )}
    </div>
  )
}
