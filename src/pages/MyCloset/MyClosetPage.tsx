import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { ClosetItem } from '../../api/closet'
import {
  useClosetItems,
  useDeleteClosetItem,
  useMyLookbooks,
  useDeleteMyLookbook,
} from '../../hooks/useMyCloset'
import LookbookFeedCard from '../../components/domain/LookbookFeedCard'
import CategoryTabs, { type ClosetTab } from './components/CategoryTabs'
import ClosetGrid from './components/ClosetGrid'

const VALID_TABS: ClosetTab[] = ['all', 'trend', 'lookbook', 'report', 'my-lookbook']

export default function MyClosetPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<ClosetTab>(
    VALID_TABS.includes(initialTab as ClosetTab) ? (initialTab as ClosetTab) : 'all',
  )
  const { data: items = [], isLoading, isError } = useClosetItems()
  const { mutate: deleteItem } = useDeleteClosetItem()

  // "내가 올린 룩북"은 저장(찜)한 항목이 아니라 직접 업로드한 룩북이라 별도 API/탭으로 분리
  const {
    data: myLookbooksData,
    isLoading: isMyLookbooksLoading,
    isError: isMyLookbooksError,
  } = useMyLookbooks()
  const { mutate: deleteMyLookbook } = useDeleteMyLookbook()
  const myLookbooks = myLookbooksData?.items ?? []

  const filteredItems = useMemo(
    () => (activeTab === 'all' ? items : items.filter((item) => item.category === activeTab)),
    [items, activeTab],
  )

  const handleSelect = (item: ClosetItem) => {
    if (item.category === 'trend') {
      navigate(`/trend/${item.targetId}`)
      return
    }
    if (item.category === 'lookbook') {
      navigate(`/lookbooks/${item.targetId}`)
      return
    }
    if (item.category === 'report') {
      navigate(`/reports/${item.targetId}`)
    }
  }

  const handleDelete = (item: ClosetItem) => {
    if (window.confirm(`'${item.title}'을(를) 삭제할까요?`)) {
      deleteItem(item.id)
    }
  }

  const handleDeleteMyLookbook = (lookbookId: number) => {
    if (window.confirm('이 룩북을 삭제할까요? 삭제하면 되돌릴 수 없어요.')) {
      deleteMyLookbook(lookbookId)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 bg-bg p-4">
      <h1 className="text-lg font-semibold text-text">마이 클로젯</h1>

      <CategoryTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'my-lookbook' ? (
        <>
          {isMyLookbooksLoading && (
            <p className="py-8 text-center text-sm text-text-tertiary">불러오는 중...</p>
          )}
          {isMyLookbooksError && (
            <p className="py-8 text-center text-sm text-error-400">
              데이터를 불러오지 못했습니다
            </p>
          )}
          {!isMyLookbooksLoading && !isMyLookbooksError && myLookbooks.length === 0 && (
            <p className="py-8 text-center text-sm text-text-tertiary">
              아직 올린 룩북이 없어요
            </p>
          )}
          {!isMyLookbooksLoading && !isMyLookbooksError && myLookbooks.length > 0 && (
            <div className="flex flex-col gap-3">
              {/* 길게 누르면 삭제 — 마이클로젯 다른 탭(ClosetGrid)과 동일한 조작 방식 */}
              {myLookbooks.map((item) => (
                <LookbookFeedCard
                  key={item.id}
                  item={item}
                  onOpenDetail={() => navigate(`/lookbooks/${item.id}`)}
                  onDelete={() => handleDeleteMyLookbook(item.id)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
