import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentSearch } from '../hooks/useContentSearch';

export default function SearchPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');

  // 입력 300ms 후에만 검색 실행 (매 타이핑마다 요청 나가는 것 방지)
  useEffect(() => {
    const timer = setTimeout(() => setKeyword(input), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const { data, isLoading } = useContentSearch(keyword);

  const hasQuery = keyword.trim().length > 0;
  const hasResults = !!data && (data.trends.length > 0 || data.lookbooks.length > 0);

  return (
    <div className='max-w-[375px] min-h-screen mx-auto bg-bg flex flex-col text-text'>
      <header className='flex items-center gap-2 px-4 pt-5 pb-3 shrink-0'>
        <button
          type='button'
          onClick={() => navigate(-1)}
          aria-label='뒤로가기'
          className='grid h-9 w-9 place-items-center rounded-full border border-border bg-white shrink-0'
        >
          <BackIcon />
        </button>

        <div className='flex-1 flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5'>
          <SearchIcon />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='스타일, 브랜드, 태그 검색'
            className='flex-1 text-sm outline-none bg-transparent placeholder:text-text-secondary'
          />
        </div>
      </header>

      <div className='flex-1 overflow-y-auto px-5 pb-8'>
        {!hasQuery && (
          <p className='pt-16 text-center text-xs text-text-secondary'>
            찾고 싶은 스타일이나 태그를 검색해보세요
          </p>
        )}

        {hasQuery && isLoading && (
          <p className='pt-16 text-center text-xs text-text-secondary'>검색 중...</p>
        )}

        {hasQuery && !isLoading && !hasResults && (
          <p className='pt-16 text-center text-xs text-text-secondary'>
            '{keyword}'에 대한 검색 결과가 없어요
          </p>
        )}

        {hasQuery && !isLoading && data && data.trends.length > 0 && (
          <section className='mt-2'>
            <h2 className='text-xs font-bold text-text-secondary mb-2'>트렌드</h2>
            <div className='flex gap-3 overflow-x-auto pb-1'>
              {data.trends.map((trend) => (
                <button
                  key={trend.id}
                  type='button'
                  onClick={() => navigate(`/trend/${trend.id}`)}
                  className='relative w-28 h-28 shrink-0 rounded-xl bg-bg-secondary border border-border overflow-hidden text-left'
                >
                  <img src={trend.imageUrl} alt={trend.label} className='h-full w-full object-cover' />
                  <span className='absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-text'>
                    #{trend.label}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {hasQuery && !isLoading && data && data.lookbooks.length > 0 && (
          <section className='mt-6'>
            <h2 className='text-xs font-bold text-text-secondary mb-2'>룩북</h2>
            <div className='grid grid-cols-2 gap-3'>
              {data.lookbooks.map((lookbook) => (
                <button
                  key={lookbook.id}
                  type='button'
                  onClick={() => navigate(`/lookbook/${lookbook.id}`)}
                  className='rounded-xl overflow-hidden border border-border bg-white text-left'
                >
                  <div
                    className='aspect-square bg-bg-secondary bg-cover bg-center'
                    style={{ backgroundImage: `url(${lookbook.imageUrl})` }}
                  />
                  <div className='p-2'>
                    <p className='text-xs font-semibold text-text truncate'>{lookbook.comment}</p>
                    <p className='text-[11px] text-text-secondary mt-0.5'>@{lookbook.authorNickname}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <path d='M15 18l-6-6 6-6' />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <circle cx='11' cy='11' r='7' />
      <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
  );
}
