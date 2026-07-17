import { DUMMY_UPLOAD_IMAGE_URL } from '../../constants/dummyData';

interface LookbookFeedItem {
  id: string;
  authorHandle: string;
  likeCount: number;
}

interface LookbookFeedCardProps {
  item: LookbookFeedItem;
  liked: boolean;
  onOpenDetail: () => void;
  onToggleLike: () => void;
}

export default function LookbookFeedCard({
  item,
  liked,
  onOpenDetail,
  onToggleLike,
}: LookbookFeedCardProps) {
  return (
    <div
      onClick={onOpenDetail}
      className='rounded-2xl border border-border bg-white overflow-hidden cursor-pointer'
    >
      <div className='relative flex'>
        <div className='flex-1 aspect-square bg-bg-secondary overflow-hidden'>
          <img
            src={DUMMY_UPLOAD_IMAGE_URL}
            alt='원본 사진'
            className='h-full w-full object-cover'
          />
          <span className='absolute top-2 left-2 rounded bg-white/85 px-1.5 py-0.5 text-[9px] font-semibold text-text'>
            원본
          </span>
        </div>

        <div className='flex-1 aspect-square bg-bg-secondary overflow-hidden border-l border-border relative'>
          <img
            src={DUMMY_UPLOAD_IMAGE_URL}
            alt='매칭 아이템'
            className='h-full w-full object-cover'
          />
          <span className='absolute top-2 right-2 rounded bg-white/85 px-1.5 py-0.5 text-[9px] font-semibold text-text'>
            매칭
          </span>
        </div>

        <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[11px] font-bold text-text-secondary'>
          VS
        </span>
      </div>

      <div className='flex items-center justify-between px-3 py-2'>
        <div className='flex items-center gap-2'>
          <div className='h-5 w-5 rounded-full bg-primary-50' />
          <span className='text-xs text-text-secondary'>
            {item.authorHandle}
          </span>
        </div>

        <button
          type='button'
          aria-label='좋아요'
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike();
          }}
          className='flex items-center gap-1 text-xs text-text-secondary'
        >
          <HeartIcon filled={liked} />
          {item.likeCount + (liked ? 1 : 0)}
        </button>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill={filled ? 'currentColor' : 'none'}
      stroke='currentColor'
      strokeWidth='2'
      className={filled ? 'text-pink-500' : ''}
    >
      <path d='M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z' />
    </svg>
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
