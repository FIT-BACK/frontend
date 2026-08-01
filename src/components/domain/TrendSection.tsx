import { TREND_ARTICLES, type TrendArticle } from '../../constants/trendArticles';
import { useMyProfile } from '../../hooks/useMyPage';

interface TrendSectionProps {
  onOpenTrendDetail?: (id: string) => void;
  onSaveTrend?: (id: string) => void;
  /** "더보기" 클릭 시 호출. 트렌드 전체 목록 화면이 아직 없다면 콜백을 안 넘겨도 됩니다. */
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

  // 회원가입/마이페이지에서 고른 관심 스타일 중 첫 번째를 개인화 기준으로 사용
  const primaryStyle = profile?.styleTags?.[0];
  const primaryTag = primaryStyle ? `#${primaryStyle}` : undefined;

  const matchedItems = primaryTag
    ? TREND_ARTICLES.filter((item) => item.relatedTags.includes(primaryTag))
    : [];

  // 선택한 스타일과 맞는 트렌드가 있을 때만 "당신을 위한" 개인화 피드로 전환하고,
  // 없으면 원래의 전체 트렌드 피드를 그대로 보여준다.
  const isPersonalized = matchedItems.length > 0;
  const visibleItems = isPersonalized ? matchedItems : TREND_ARTICLES;

  return (
    <section className='mt-6 px-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-bold text-text'>나를 위한 트렌드</h2>

        <button
          type='button'
          onClick={onSeeMoreTrends}
          className='text-xs text-text-secondary cursor-pointer'
        >
          더보기 &gt;
        </button>
      </div>

      <div className='mt-3 flex gap-3 overflow-x-auto pb-2 snap-x'>
        {visibleItems.map((item) => {
          const thumbnail = getTrendThumbnail(item);
          return (
            <button
              key={item.id}
              type='button'
              onClick={() => onOpenTrendDetail?.(String(item.id))}
              className='relative w-[260px] shrink-0 snap-start rounded-2xl border border-border bg-white overflow-hidden text-left'
            >
              <div
                className='h-[150px] w-full bg-cover bg-center relative'
                style={
                  thumbnail
                    ? { backgroundImage: `url(${thumbnail})` }
                    : { background: item.bgGradient }
                }
              >
                <span className='absolute top-2.5 left-2.5 rounded-full bg-primary-400 px-2.5 py-1 text-[10px] font-bold text-white'>
                  {item.tag}
                </span>

                <span
                  role='button'
                  aria-label='마이 클로젯에 저장'
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveTrend?.(String(item.id));
                  }}
                  className='absolute top-2.5 right-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/85 text-text-secondary'
                >
                  <BookmarkIcon />
                </span>
              </div>

              <div className='px-3 py-2.5'>
                <p className='text-[13px] font-bold text-text leading-snug'>{item.title}</p>
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
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path d='M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z' />
    </svg>
  );
}
