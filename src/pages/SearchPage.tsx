import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentSearch } from '../hooks/useContentSearch';
import { useTags } from '../hooks/useTags';

const RECENT_SEARCH_KEY = 'fitback:recentSearches';
const MAX_RECENT = 8;

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(list: string[]) {
  localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(list));
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadRecentSearches());

  const { data: tags = [] } = useTags();

  // 입력 300ms 후에만 검색 실행 (매 타이핑마다 요청 나가는 것 방지)
  useEffect(() => {
    const timer = setTimeout(() => setKeyword(input), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const { data, isLoading } = useContentSearch(keyword);

  const hasQuery = keyword.trim().length > 0;
  const hasResults = !!data && (data.trends.length > 0 || data.lookbooks.length > 0);

  // 실제 검색 결과가 나온 키워드만 최근 검색어에 남긴다 (빈 결과·오타는 제외)
  useEffect(() => {
    if (!hasQuery || isLoading || !hasResults) return;
    const trimmed = keyword.trim();
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((term) => term !== trimmed)].slice(0, MAX_RECENT);
      saveRecentSearches(next);
      return next;
    });
  }, [hasQuery, isLoading, hasResults, keyword]);

  const runSearch = (term: string) => {
    setInput(term);
    setKeyword(term);
  };

  const removeRecentSearch = (term: string) => {
    setRecentSearches((prev) => {
      const next = prev.filter((t) => t !== term);
      saveRecentSearches(next);
      return next;
    });
  };

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
          <div className='pt-2'>
            {recentSearches.length > 0 && (
              <section className='mb-6'>
                <h2 className='text-xs font-bold text-text-secondary mb-2'>최근 검색어</h2>
                <div className='flex flex-wrap gap-2'>
                  {recentSearches.map((term) => (
                    <span
                      key={term}
                      className='inline-flex items-center gap-1.5 rounded-full bg-bg-secondary px-3 py-1.5 text-xs text-text'
                    >
                      <button type='button' onClick={() => runSearch(term)}>
                        {term}
                      </button>
                      <button
                        type='button'
                        onClick={() => removeRecentSearch(term)}
                        aria-label={`${term} 삭제`}
                        className='text-text-tertiary'
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </section>
            )}

            {tags.length > 0 && (
              <section>
                <h2 className='text-xs font-bold text-text-secondary mb-2'>추천 태그</h2>
                <div className='flex flex-wrap gap-2'>
                  {tags.map((tag) => (
                    <button
                      key={tag.tagId}
                      type='button'
                      onClick={() => runSearch(tag.tagName)}
                      className='rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700'
                    >
                      #{tag.tagName}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {recentSearches.length === 0 && tags.length === 0 && (
              <p className='pt-16 text-center text-xs text-text-secondary'>
                찾고 싶은 스타일이나 태그를 검색해보세요
              </p>
            )}
          </div>
        )}

        {hasQuery && isLoading && (
          <p className='pt-16 text-center text-xs text-text-secondary'>검색 중...</p>
        )}

        {hasQuery && !isLoading && !hasResults && (
          <p className='pt-16 text-center text-xs text-text-secondary'>
            '{keyword}'에 대한 검색 결과가 없어요
          </p>
        )}

        {/* 💡 트렌드 섹션: id -> trendId, label -> title 수정 완료 */}
        {hasQuery && !isLoading && data && data.trends.length > 0 && (
          <section className='mt-2'>
            <h2 className='text-xs font-bold text-text-secondary mb-2'>트렌드</h2>
            <div className='flex gap-3 overflow-x-auto pb-1'>
              {data.trends.map((trend) => (
                <button
                  key={trend.trendId} 
                  type='button'
                  onClick={() => navigate(`/trend/${trend.trendId}`)}
                  className='relative w-28 h-28 shrink-0 rounded-xl bg-bg-secondary border border-border overflow-hidden text-left'
                >
                  <img src={trend.imageUrl} alt={trend.title} className='h-full w-full object-cover' />
                  <span className='absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-text'>
                    #{trend.title}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 💡 룩북 섹션: id -> lookbookId, imageUrl -> originalImageUrl 수정 완료, 신규 필드 UI 반영 */}
        {hasQuery && !isLoading && data && data.lookbooks.length > 0 && (
          <section className='mt-6'>
            <h2 className='text-xs font-bold text-text-secondary mb-2'>룩북</h2>
            <div className='grid grid-cols-2 gap-3'>
              {data.lookbooks.map((lookbook) => (
                <button
                  key={lookbook.lookbookId}
                  type='button'
                  onClick={() => navigate(`/lookbooks/${lookbook.lookbookId}`)}
                  className='rounded-xl overflow-hidden border border-border bg-white text-left'
                >
                  <div
                    className='aspect-square bg-bg-secondary bg-cover bg-center'
                    style={{ backgroundImage: `url(${lookbook.originalImageUrl})` }}
                  />
                  <div className='p-2 flex items-center justify-between'>
                    <div className='flex items-center gap-1.5'>
                      <img 
                        src={lookbook.authorProfileImageUrl ?? undefined} 
                        alt="profile" 
                        className="w-5 h-5 rounded-full object-cover bg-gray-100" 
                      />
                    </div>
                    <div className='flex items-center gap-1 text-[11px] text-text-secondary'>
                      <span>{lookbook.isLiked ? '❤️' : '🤍'}</span>
                      <span>{lookbook.likeCount}</span>
                    </div>
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