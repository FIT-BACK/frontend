import { type UploadPurpose } from '../components/domain/UploadSelectSheet';
import SearchBar from '../components/domain/SearchBar';
import TrendSection from '../components/domain/TrendSection';
import LookbookFeedCard from '../components/domain/LookbookFeedCard';
import { useState } from 'react';

interface LookbookFeedItem {
  id: string;
  authorHandle: string;
  likeCount: number;
  originalImageUrl?: string;
  matchedImageUrl?: string;
}

// 가성비 룩북 피드 예시 카드 — 실제 룩북 API 연동 전까지는 화면 자리표시용으로 소수만 보여준다.
const FEED_ITEMS: LookbookFeedItem[] = [
  {
    id: 'lookbook-featured-1',
    authorHandle: '@minji_style',
    likeCount: 128,
    originalImageUrl: 'https://i.pinimg.com/736x/58/89/bd/5889bdca4cc29df44f87ab87f0b6dfe6.jpg',
    matchedImageUrl: 'https://i.pinimg.com/736x/3e/b0/49/3eb04975a5fbf8fc44269d4ad8648470.jpg',
  },
];

interface HomePageProps {
  onOpenUploadSheet?: (purpose: UploadPurpose) => void;
  onOpenSearch?: () => void;
  onOpenImageSearch?: () => void;
  onOpenTrendDetail?: (id: string) => void;
  onSaveTrend?: (id: string) => void;
  onSeeMoreTrends?: () => void;
  onOpenLookbookDetail?: (id: string) => void;
}

export default function HomePage({
  onOpenSearch,
  onOpenImageSearch,
  onOpenTrendDetail,
  onSaveTrend,
  onSeeMoreTrends,
  onOpenLookbookDetail,
}: HomePageProps) {
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className='max-w-[375px] mx-auto text-text'>
      <SearchBar
        onOpenSearch={onOpenSearch}
        onOpenImageSearch={onOpenImageSearch}
      />

      <TrendSection
        onOpenTrendDetail={onOpenTrendDetail}
        onSaveTrend={onSaveTrend}
        onSeeMoreTrends={onSeeMoreTrends}
      />

      <section className='mt-8 px-5 pb-8'>
        <h2 className='text-sm font-bold text-text'>가성비 룩북 피드</h2>

        <div className='mt-3 flex flex-col gap-3'>
          {FEED_ITEMS.map((item) => (
            <LookbookFeedCard
              key={item.id}
              item={item}
              liked={likedIds.has(item.id)}
              onOpenDetail={() => onOpenLookbookDetail?.(item.id)}
              onToggleLike={() => toggleLike(item.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
