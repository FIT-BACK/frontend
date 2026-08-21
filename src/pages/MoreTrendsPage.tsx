import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark } from 'lucide-react';
import { TREND_ARTICLES } from '../constants/trendArticles';
import { useMyProfile } from '../hooks/useMyPage';
import { useClosetItems, useDeleteClosetItem, useSaveTrend } from '../hooks/useMyCloset';

const FILTER_TABS = [
  { id: 'all', label: '전체' },
  { id: 'my-style', label: '내 스타일' },
  { id: 'minimal', label: '#미니멀', tag: '#미니멀' },
  { id: 'street', label: '#스트릿', tag: '#스트릿' },
  { id: 'lovely', label: '#러블리', tag: '#러블리' },
  { id: 'casual', label: '#캐주얼', tag: '#캐주얼' },
  { id: 'formal', label: '#포멀', tag: '#포멀' },
];

const MoreTrendsPage: React.FC = () => {
  const navigate = useNavigate();
  // 홈 화면 "나를 위한 트렌드"의 더보기를 눌러 들어오는 화면이라 기본 탭도
  // 전체가 아니라 내 스타일에 맞춘 결과로 시작한다.
  const [activeFilter, setActiveFilter] = useState('my-style');
  const { data: profile } = useMyProfile();

  // 저장 여부를 로컬 Set으로만 흉내내던 것 — 실제로는 마이 클로젯에 반영이 안 됐음
  // (새로고침하면 사라짐). 진짜 저장/삭제 API로 교체.
  const { data: closetItems = [] } = useClosetItems();
  const savedItemByTrendId = useMemo(() => {
    const map = new Map<number, number>(); // trendId -> closetSave id
    closetItems.forEach((item) => {
      if (item.category === 'trend') map.set(item.targetId, item.id);
    });
    return map;
  }, [closetItems]);
  const saveTrend = useSaveTrend();
  const deleteClosetItem = useDeleteClosetItem();

  const activeTag = FILTER_TABS.find((tab) => tab.id === activeFilter)?.tag;
  const myStyleTags = useMemo(
    () => (profile?.styleTags ?? []).map((name) => `#${name}`),
    [profile],
  );

  const trends = useMemo(() => {
    if (activeFilter === 'my-style') {
      return TREND_ARTICLES.filter((t) => t.relatedTags.some((tag) => myStyleTags.includes(tag)));
    }
    return activeTag ? TREND_ARTICLES.filter((t) => t.relatedTags.includes(activeTag)) : TREND_ARTICLES;
  }, [activeFilter, activeTag, myStyleTags]);

  const toggleSave = (e: React.MouseEvent, trendId: number) => {
    e.stopPropagation();
    const savedId = savedItemByTrendId.get(trendId);
    if (savedId != null) {
      deleteClosetItem.mutate(savedId);
    } else {
      saveTrend.mutate(trendId);
    }
  };

  const handleTrendClick = (id: number) => {
    navigate(`/trend/${id}`);
  };

  return (
    <div className="h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[480px] bg-bg h-screen flex flex-col shadow-lg relative">
        {/* Header */}
      <header className="flex items-center justify-between p-5 shrink-0">
        <button onClick={() => navigate(-1)} className="cursor-pointer" aria-label="뒤로가기">
          <ArrowLeft size={22} strokeWidth={2} />
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
          // 한 줄에 두 개씩이던 카드 그리드를 홈 화면 "나를 위한 트렌드" 카드와
          // 같은 형태(한 줄에 하나, 사진 위에 태그+제목을 흰 글씨로 얹는 방식)로 통일
          <div className="flex flex-col gap-3">
            {trends.map((trend) => {
              const thumbnail =
                trend.contentType === 'photo'
                  ? trend.imageUrl
                  : trend.contentType === 'magazine'
                    ? (trend.photos[0] ?? null)
                    : null;

              return (
                <div
                  key={trend.id}
                  onClick={() => handleTrendClick(trend.id)}
                  className="relative h-[210px] w-full overflow-hidden rounded-2xl cursor-pointer"
                >
                  {/* 배경 */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={
                      thumbnail
                        ? { backgroundImage: `url(${thumbnail})` }
                        : { background: trend.bgGradient }
                    }
                  />

                  {/* 태그·제목 가독성용 그라디언트 — 사진이 있을 때만 필요 */}
                  {thumbnail && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-primary-900/40 via-40% to-transparent" />
                  )}

                  {/* Bookmark Icon */}
                  <button
                    className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center text-white drop-shadow"
                    onClick={(e) => toggleSave(e, trend.id)}
                  >
                    <Bookmark
                      size={18}
                      strokeWidth={2}
                      fill={savedItemByTrendId.has(trend.id) ? '#fff' : 'none'}
                      stroke="#fff"
                    />
                  </button>

                  {/* Tag + Title */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span
                      className={`inline-block rounded-full bg-white px-2.5 py-1 text-[11px] font-bold shadow-sm ${thumbnail ? 'text-primary-600' : ''}`}
                      style={thumbnail ? undefined : { color: trend.tagColor }}
                    >
                      {trend.tag}
                    </span>
                    <p
                      className={`mt-2 text-[15px] font-bold leading-tight ${thumbnail ? 'text-white drop-shadow' : ''}`}
                      style={thumbnail ? undefined : { color: trend.tagColor }}
                    >
                      {trend.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default MoreTrendsPage;
