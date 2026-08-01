import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TREND_ARTICLES } from '../constants/trendArticles';

const FILTER_TABS = [
  { id: 'all', label: '전체' },
  { id: 'minimal', label: '#미니멀', tag: '#미니멀' },
  { id: 'street', label: '#스트릿', tag: '#스트릿' },
  { id: 'vintage', label: '#빈티지', tag: '#빈티지' },
  { id: 'casual', label: '#캐주얼', tag: '#캐주얼' },
  { id: 'formal', label: '#포멀', tag: '#포멀' },
];

const CONTENT_TYPE_ICON: Record<string, string> = {
  photo: '📷',
  article: '📰',
  youtube: '▶',
  magazine: '✨',
};

const MoreTrendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const activeTag = FILTER_TABS.find((tab) => tab.id === activeFilter)?.tag;

  const trends = useMemo(
    () => (activeTag ? TREND_ARTICLES.filter((t) => t.relatedTags.includes(activeTag)) : TREND_ARTICLES),
    [activeTag],
  );

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleTrendClick = (id: number) => {
    navigate(`/trend/${id}`);
  };

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Header */}
      <header className="flex items-center justify-between p-5 shrink-0">
        <button onClick={() => navigate(-1)} className="text-xl font-bold cursor-pointer">
          ←
        </button>
        <h1 className="text-base font-bold text-text">요즘 트렌드</h1>
        <div className="w-8"></div> {/* Spacer for centering */}
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-5 pb-3 overflow-x-auto shrink-0 scrollbar-hide">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full shrink-0 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-primary-400 text-white font-bold'
                  : 'bg-bg-secondary text-text-secondary font-medium'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable Body - Grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {trends.length === 0 ? (
          <p className="pt-16 text-center text-xs text-text-secondary">해당하는 트렌드가 없어요</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 content-start">
            {trends.map((trend) => (
              <div
                key={trend.id}
                onClick={() => handleTrendClick(trend.id)}
                className="rounded-[18px] aspect-[0.85] flex flex-col justify-end p-3 relative cursor-pointer overflow-hidden"
                style={
                  trend.contentType === 'photo'
                    ? { backgroundImage: `url(${trend.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : trend.contentType === 'magazine' && trend.photos[0]
                      ? { backgroundImage: `url(${trend.photos[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: trend.bgGradient }
                }
              >
                {/* Content type badge */}
                <span className="absolute top-2.5 left-2.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-[11px]">
                  {CONTENT_TYPE_ICON[trend.contentType]}
                </span>

                {/* Bookmark Icon */}
                <button
                  className="absolute top-2.5 right-2.5 cursor-pointer z-10"
                  onClick={(e) => toggleSave(e, trend.id)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={savedIds.has(trend.id) ? '#3c3489' : 'none'}
                    stroke={savedIds.has(trend.id) ? '#3c3489' : '#3c3489'}
                    strokeWidth={savedIds.has(trend.id) ? '1' : '2'}
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>

                {/* Tag Badge */}
                <span
                  className="text-[10px] bg-white/90 px-2 py-0.5 rounded-full font-semibold self-start mb-1.5"
                  style={{ color: trend.tagColor }}
                >
                  {trend.tag}
                </span>
                {/* Title */}
                <span
                  className={`text-[13px] font-bold ${
                    trend.contentType === 'photo' || (trend.contentType === 'magazine' && trend.photos[0])
                      ? 'text-white drop-shadow'
                      : ''
                  }`}
                  style={
                    trend.contentType === 'photo' || (trend.contentType === 'magazine' && trend.photos[0])
                      ? undefined
                      : { color: trend.tagColor }
                  }
                >
                  {trend.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreTrendsPage;
