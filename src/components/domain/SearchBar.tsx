interface SearchBarProps {
  onOpenSearch?: () => void;
  onOpenImageSearch?: () => void;
}

export default function SearchBar({
  onOpenSearch,
  onOpenImageSearch,
}: SearchBarProps) {
  return (
    <div className='px-5 pt-4'>
      <button
        type='button'
        onClick={onOpenSearch}
        className='w-full flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-left'
      >
        <SearchIcon />

        <span className='flex-1 text-xs text-text-secondary'>
          스타일, 브랜드, 태그 검색
        </span>

        <span
          role='button'
          aria-label='이미지로 검색'
          onClick={(e) => {
            e.stopPropagation();
            onOpenImageSearch?.();
          }}
          className='text-text-secondary'
        >
          <CameraIcon />
        </span>
      </button>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <circle cx='11' cy='11' r='7' />
      <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path d='M4 8h3l2-2h6l2 2h3v11H4z' />
      <circle cx='12' cy='13' r='3.5' />
    </svg>
  );
}
