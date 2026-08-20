import { Heart } from 'lucide-react';
import { useToggleLike } from '../../hooks/useLookbookDetail';
import { DUMMY_UPLOAD_IMAGE_URL } from '../../constants/dummyData';
import type { LookbookFeedItem } from '../../api/lookbooks';

interface LookbookFeedCardProps {
  item: LookbookFeedItem;
  onOpenDetail: () => void;
}

export default function LookbookFeedCard({
  item,
  onOpenDetail,
}: LookbookFeedCardProps) {
  const toggleLike = useToggleLike(item.id);

  return (
    <div
      onClick={onOpenDetail}
      className='rounded-2xl border border-border bg-white overflow-hidden cursor-pointer'
    >
      <div className='relative flex gap-2 p-2'>
        <div className='relative flex-1 aspect-square overflow-hidden rounded-xl bg-bg-secondary'>
          <img
            src={item.originalImageUrl ?? DUMMY_UPLOAD_IMAGE_URL}
            alt='원본 사진'
            className='h-full w-full object-cover'
          />
          <span className='absolute top-2 left-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-text'>
            원본
          </span>
        </div>

        <div className='relative flex-1 aspect-square overflow-hidden rounded-xl bg-bg-secondary'>
          <img
            src={item.matchedImageUrl ?? DUMMY_UPLOAD_IMAGE_URL}
            alt='매칭 아이템'
            className='h-full w-full object-cover'
          />
          <span className='absolute top-2 right-2 rounded-md bg-primary-50/95 px-1.5 py-0.5 text-[9px] font-bold text-primary-800'>
            매칭
          </span>
        </div>

        <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[11px] font-bold text-text-secondary shadow-sm'>
          VS
        </span>
      </div>

      {item.tags.length > 0 && (
        <div className='flex flex-wrap gap-1 px-3 pt-2'>
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className='rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-bold text-primary-800'
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className='rounded-full bg-bg-secondary px-2 py-0.5 text-[10px] font-bold text-text-tertiary'>
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className='flex items-center justify-between px-3 py-2'>
        <div className='flex items-center gap-2'>
          <div className='h-5 w-5 rounded-full bg-primary-50 overflow-hidden'>
            {item.authorProfileImageUrl && (
              <img
                src={item.authorProfileImageUrl}
                alt=''
                className='h-full w-full object-cover'
              />
            )}
          </div>
          <span className='text-xs text-text-secondary'>
            {item.authorNickname}
          </span>
        </div>

        <button
          type='button'
          aria-label='좋아요'
          onClick={(e) => {
            e.stopPropagation();
            toggleLike.mutate(item.isLiked);
          }}
          className='flex items-center gap-1 text-xs text-text-secondary'
        >
          <Heart
            size={14}
            strokeWidth={2}
            fill={item.isLiked ? 'currentColor' : 'none'}
            className={item.isLiked ? 'text-error-400' : ''}
          />
          {item.likeCount}
        </button>
      </div>
    </div>
  );
}

export function SpinnerIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      className='animate-spin text-primary-400'
    >
      <circle
        cx='12'
        cy='12'
        r='9'
        stroke='currentColor'
        strokeWidth='2'
        strokeOpacity='0.25'
      />
      <path
        d='M21 12a9 9 0 00-9-9'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
}
