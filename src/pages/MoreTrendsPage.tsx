import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: API 연동 시 교체할 더미 데이터 (트렌드 카테고리 필터)
const FILTER_TABS = [
  { id: 'all', label: '전체' },
  { id: 'my-style', label: '내 스타일' },
  { id: 'minimal', label: '#미니멀' },
  { id: 'street', label: '#스트릿' },
  { id: 'vintage', label: '#빈티지' },
];

// TODO: API 연동 시 교체할 더미 데이터 (트렌드 목록)
const TREND_LIST = [
  {
    id: 1,
    tag: '#미니멀',
    title: '미니멀 무드',
    bgGradient: 'linear-gradient(160deg, #EEE9FF, #D5CCF5)',
    tagColor: '#3c3489', // primary-800
    isSaved: true,
  },
  {
    id: 2,
    tag: '#스트릿',
    title: '스트릿 무드',
    bgGradient: 'linear-gradient(160deg, #F0EDF9, #DDD5F5)',
    tagColor: '#3c3489',
    isSaved: false,
  },
  {
    id: 3,
    tag: '#빈티지',
    title: '빈티지 무드',
    bgGradient: 'linear-gradient(160deg, #EDF5E8, #C8E4C0)',
    tagColor: '#27500A',
    isSaved: false,
  },
  {
    id: 4,
    tag: '#캐주얼',
    title: '캐주얼 무드',
    bgGradient: 'linear-gradient(160deg, #FEF5E8, #FAD9A0)',
    tagColor: '#9C620B', // arbitrary color for a900
    isSaved: false,
  },
];

const MoreTrendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [trends, setTrends] = useState(TREND_LIST);

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setTrends(trends.map(t => t.id === id ? { ...t, isSaved: !t.isSaved } : t));
    // TODO: Toast 알림 추가 (ex: '저장되었습니다', '저장 해제되었습니다')
  };

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    if (filterId === 'my-style') {
      // TODO: Toast 알림 추가 (ex: '내 스타일 기반 필터 적용됨')
    }
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
              onClick={() => handleFilterClick(tab.id)}
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
        <div className="grid grid-cols-2 gap-3 content-start">
          {trends.map((trend) => (
            <div
              key={trend.id}
              onClick={() => handleTrendClick(trend.id)}
              className="rounded-[18px] aspect-[0.85] flex flex-col justify-end p-3 relative cursor-pointer"
              style={{ background: trend.bgGradient }}
            >
              {/* Bookmark Icon */}
              <button
                className="absolute top-2.5 right-2.5 cursor-pointer z-10"
                onClick={(e) => toggleSave(e, trend.id)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={trend.isSaved ? '#3c3489' : 'none'}
                  stroke={trend.isSaved ? '#3c3489' : '#3c3489'}
                  strokeWidth={trend.isSaved ? "1" : "2"}
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
                className="text-[13px] font-bold"
                style={{ color: trend.tagColor }}
              >
                {trend.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreTrendsPage;
