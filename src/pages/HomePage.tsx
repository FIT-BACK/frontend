import { useEffect, useRef, useState } from 'react';
import { type UploadPurpose } from '../components/domain/UploadSelectSheet';
import SearchBar from '../components/domain/SearchBar';
import TrendSection from '../components/domain/TrendSection';
import LookbookFeedCard, {
  SpinnerIcon,
} from '../components/domain/LookbookFeedCard';

interface LookbookFeedItem {
  id: string;
  authorHandle: string;
  likeCount: number;
}

const PAGE_SIZE = 20;

function createDummyFeedPage(page: number): LookbookFeedItem[] {
  return Array.from({ length: page === 0 ? 1 : PAGE_SIZE }).map((_, i) => ({
    id: `lookbook-${page}-${i}`,
    authorHandle: '@minji_style',
    likeCount: 128,
  }));
}

interface HomePageProps {
  onOpenUploadSheet?: (purpose: UploadPurpose) => void;
  onOpenSearch?: () => void;
  onOpenImageSearch?: () => void;
  onOpenTrendDetail?: (id: string) => void;
  onSaveTrend?: (id: string) => void;
  onOpenLookbookDetail?: (id: string) => void;
}

export default function HomePage({
  onOpenSearch,
  onOpenImageSearch,
  onOpenTrendDetail,
  onSaveTrend,
  onOpenLookbookDetail,
}: HomePageProps) {
  const [feedItems, setFeedItems] = useState<LookbookFeedItem[]>([]);
  const [feedStatus, setFeedStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [hasMore, setHasMore] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const pageRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadPage = () => {
    setFeedStatus('loading');

    setTimeout(() => {
      const page = pageRef.current;
      const newItems = createDummyFeedPage(page);

      setFeedItems((prev) => [...prev, ...newItems]);

      pageRef.current += 1;
      setHasMore(page < 1);
      setFeedStatus('ready');
    }, 500);
  };

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {
    if (!hasMore || feedStatus === 'loading') return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadPage();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasMore, feedStatus]);

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
      />

      <section className='mt-8 px-5'>
        <h2 className='text-sm font-bold text-text'>가성비 룩북 피드</h2>

        <div className='mt-3 flex flex-col gap-3'>
          {feedItems.length === 0 && feedStatus === 'ready' ? (
            <p className='py-10 text-center text-xs text-text-secondary'>
              아직 룩북이 없어요
            </p>
          ) : (
            feedItems.map((item) => (
              <LookbookFeedCard
                key={item.id}
                item={item}
                liked={likedIds.has(item.id)}
                onOpenDetail={() => onOpenLookbookDetail?.(item.id)}
                onToggleLike={() => toggleLike(item.id)}
              />
            ))
          )}

          {feedStatus === 'loading' && (
            <div className='py-4 flex justify-center'>
              <SpinnerIcon />
            </div>
          )}

          {feedStatus === 'error' && (
            <button
              type='button'
              onClick={loadPage}
              className='py-3 text-center text-xs font-bold text-primary-400'
            >
              새로고침
            </button>
          )}

          <div ref={sentinelRef} />
        </div>
      </section>
    </div>
  );
}
