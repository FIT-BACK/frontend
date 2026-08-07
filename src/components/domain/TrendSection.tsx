import {
  TREND_ARTICLES,
  type TrendArticle,
} from '../../constants/trendArticles';
import { useMyProfile } from '../../hooks/useMyPage';

interface TrendSectionProps {
  onOpenTrendDetail?: (id: string) => void;
  onSaveTrend?: (id: string) => void;
  onSeeMoreTrends?: () => void;
}

function getTrendThumbnail(trend: TrendArticle): string | null {
  if (trend.contentType === 'photo') return trend.imageUrl;
  if (trend.contentType === 'magazine') return trend.photos[0] ?? null;
  return null;
}

export default function TrendSection({
  onOpenTrendDetail,
  onSaveTrend,
  onSeeMoreTrends,
}: TrendSectionProps) {
  const { data: profile } = useMyProfile();

  const primaryStyle = profile?.styleTags?.[0];
  const primaryTag = primaryStyle ? `#${primaryStyle}` : undefined;

  const matchedItems = primaryTag
    ? TREND_ARTICLES.filter((item) => item.relatedTags.includes(primaryTag))
    : [];

  const visibleItems = matchedItems.length > 0 ? matchedItems : TREND_ARTICLES;

  return (
    <section className='mt-5 px-5'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-base font-bold text-text'>🔥 요즘 트렌드</h2>

        <button
          type='button'
          onClick={onSeeMoreTrends}
          className='text-sm text-text-tertiary'
        >
          더보기 &gt;
        </button>
      </div>

      <div className='scrollbar-hide flex gap-4 overflow-x-auto pb-2'>
        {visibleItems.map((item) => {
          const thumbnail = getTrendThumbnail(item);

          return (
            <button
              key={item.id}
              type='button'
              onClick={() => onOpenTrendDetail?.(String(item.id))}
              className='relative h-[170px] w-[150px] shrink-0 overflow-hidden rounded-3xl text-left'
            >
              {/* 배경 */}
              <div
                className='absolute inset-0 bg-cover bg-center'
                style={
                  thumbnail
                    ? {
                        backgroundImage: `url(${thumbnail})`,
                      }
                    : {
                        background: item.bgGradient,
                      }
                }
              />

              {/* 어둡게 */}
              <div className='absolute inset-0 bg-black/15' />

              {/* 저장 버튼 */}
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveTrend?.(String(item.id));
                }}
                className='absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-text-secondary'
              >
                <BookmarkIcon />
              </button>

              {/* 태그 + 제목 */}
              <div className='absolute bottom-3 left-3 right-3'>
                <span className='inline-block rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-primary-600'>
                  {item.tag}
                </span>

                <p className='mt-2 text-[17px] font-bold leading-tight text-white drop-shadow'>
                  {item.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BookmarkIcon() {
  return (
    <svg
      width='15'
      height='15'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path d='M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z' />
    </svg>
  );
}
