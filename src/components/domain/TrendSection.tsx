import { CLOSET_DUMMY_ITEMS } from '../../constants/dummyData';

interface TrendSectionProps {
  onOpenTrendDetail?: (id: string) => void;
  onSaveTrend?: (id: string) => void;
}

export default function TrendSection({
  onOpenTrendDetail,
  onSaveTrend,
}: TrendSectionProps) {
  return (
    <section className='mt-6 px-5'>
      <div className='flex items-center justify-between'>
        <h2 className='text-sm font-bold text-text'>🔥 요즘 트렌드</h2>

        <span className='text-xs text-text-secondary cursor-pointer'>
          더보기 &gt;
        </span>
      </div>

      <div className='mt-3 flex gap-3 overflow-x-auto pb-2'>
        {CLOSET_DUMMY_ITEMS.length === 0
          ? Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className='w-32 h-32 shrink-0 rounded-xl bg-bg-secondary animate-pulse'
              />
            ))
          : CLOSET_DUMMY_ITEMS.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => onOpenTrendDetail?.(item.id)}
                className='relative w-32 h-32 shrink-0 rounded-xl bg-bg-secondary border border-border overflow-hidden text-left'
              >
                <img
                  src={item.imageUrl}
                  alt={item.label}
                  className='h-full w-full object-cover'
                />

                <span
                  role='button'
                  aria-label='마이 클로젯에 저장'
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveTrend?.(item.id);
                  }}
                  className='absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-white/80 text-text-secondary'
                >
                  <BookmarkIcon />
                </span>

                <span className='absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-text'>
                  #{item.label}
                </span>
              </button>
            ))}
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
