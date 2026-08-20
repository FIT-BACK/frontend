import { Bookmark } from 'lucide-react';
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
  const featured = visibleItems[0];
  const thumbnail = featured ? getTrendThumbnail(featured) : null;

  if (!featured) return null;

  return (
    <section className='mt-5 px-5'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-base font-bold text-text'>나를 위한 트렌드</h2>

        <button
          type='button'
          onClick={onSeeMoreTrends}
          className='text-sm text-text-tertiary'
        >
          더보기 &gt;
        </button>
      </div>

      <button
        type='button'
        onClick={() => onOpenTrendDetail?.(String(featured.id))}
        className='block w-full text-left'
      >
        {/* 사진 자체의 rounded+overflow-hidden은 안쪽 래퍼에만 걸어서, 바깥 태그가
            그 경계에 걸치게 배치해도 잘려나가지 않게 한다 */}
        <div className='relative h-[150px] w-full'>
          <div className='absolute inset-0 overflow-hidden rounded-2xl'>
            {/* 배경 */}
            <div
              className='absolute inset-0 bg-cover bg-center'
              style={
                thumbnail
                  ? { backgroundImage: `url(${thumbnail})` }
                  : { background: featured.bgGradient }
              }
            />

            {/* 블랙-보라 그라디언트 — 하단 태그 가독성용, 와이어프레임처럼 이미지
                아래쪽에 진하게 깔리다가 위로 갈수록 사라진다 */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-primary-900/35 via-40% to-transparent' />
          </div>

          {/* 저장 버튼 */}
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onSaveTrend?.(String(featured.id));
            }}
            className='absolute right-3 top-3 grid h-8 w-8 place-items-center text-white drop-shadow'
          >
            <Bookmark size={18} strokeWidth={2} />
          </button>

          {/* 태그 — 이미지 하단 경계에 걸치게 */}
          <span className='absolute -bottom-2.5 left-3 inline-block rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-primary-600 shadow-sm'>
            {featured.tag}
          </span>
        </div>

        {/* 제목 — 이미지 밖, 태그 아래 */}
        <p className='mt-4 px-1 text-[15px] font-bold leading-tight text-text'>
          {featured.title}
        </p>
      </button>
    </section>
  );
}
