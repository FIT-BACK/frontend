import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TREND_ARTICLES } from '../constants/trendArticles';

const RELATED_LOOKBOOKS = [
  { id: 1, bgGradient: 'linear-gradient(135deg, #E8E4F5, #D0C9EE)' },
  { id: 2, bgGradient: 'linear-gradient(135deg, #C9C4F2, #AFA9EC)' },
  { id: 3, bgGradient: 'linear-gradient(135deg, #AFA9EC, #8A82E0)' },
];

const TrendDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState(false);

  const trend = TREND_ARTICLES.find((t) => t.id === Number(id)) ?? TREND_ARTICLES[0];

  const toggleSave = () => setIsSaved((prev) => !prev);

  const handleTagClick = (tag: string) => {
    navigate(`/search?q=${encodeURIComponent(tag.replace('#', ''))}`);
  };

  const handleLookbookClick = () => {
    // 룩북 상세 페이지(SCR-04B)로 이동
    // navigate(`/lookbook/${lookbookId}`);
  };

  const handleMatchStartClick = () => {
    navigate('/image-upload');
  };

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Header */}
      <header className="flex items-center justify-between p-5 shrink-0 bg-bg">
        <button onClick={() => navigate(-1)} className="text-xl font-bold cursor-pointer">
          ←
        </button>
        <h1 className="text-base font-bold text-text">트렌드</h1>
        <button onClick={toggleSave} className="cursor-pointer">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isSaved ? '#3c3489' : 'none'}
            stroke={isSaved ? '#3c3489' : 'var(--color-text-secondary)'}
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </header>

      {/* Main Visual — 콘텐츠 타입별로 다르게 렌더링 */}
      {trend.contentType === 'youtube' ? (
        <div className="shrink-0 relative bg-black">
          <iframe
            className="w-full aspect-video"
            src={`https://www.youtube.com/embed/${trend.youtubeVideoId}`}
            title={trend.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="absolute top-3 left-3 text-[11px] bg-primary-400 text-white px-2.5 py-1 rounded-full font-bold">
            {trend.tag}
          </div>
        </div>
      ) : (
        <div
          className="h-[150px] shrink-0 flex items-center justify-center relative bg-cover bg-center"
          style={
            trend.contentType === 'photo'
              ? { backgroundImage: `url(${trend.imageUrl})` }
              : { background: trend.bgGradient }
          }
        >
          <div className="absolute top-3 left-3 text-[11px] bg-primary-400 text-white px-2.5 py-1 rounded-full font-bold">
            {trend.tag}
          </div>
          {trend.contentType === 'article' && (
            <span className="text-sm text-primary-800">📰 {trend.sourceName}</span>
          )}
        </div>
      )}

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-20">
        <h2 className="text-[20px] font-extrabold text-text mb-2.5">{trend.title}</h2>
        <p className="text-[13px] text-text-secondary leading-[1.7] mb-3.5">
          {trend.description}
        </p>

        {trend.contentType === 'article' && (
          <a
            href={trend.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] font-bold text-primary-600 mb-3.5"
          >
            {trend.sourceName}에서 원문 보기 ↗
          </a>
        )}

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4.5">
          {trend.relatedTags.map((tag) => (
            <span
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="text-xs text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full font-medium cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Related Lookbooks */}
        <h3 className="text-[14px] font-bold text-text mb-3">이 트렌드의 가성비 룩북</h3>
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
          {RELATED_LOOKBOOKS.map((lb) => (
            <div
              key={lb.id}
              onClick={() => handleLookbookClick()}
              className="w-[110px] shrink-0 aspect-[0.8] rounded-xl cursor-pointer transition-transform active:scale-95"
              style={{ background: lb.bgGradient }}
            />
          ))}
        </div>

        {/* Bottom Button */}
        <button
          onClick={handleMatchStartClick}
          className="w-full bg-primary-400 text-white py-4 rounded-xl font-bold text-[15px] active:bg-primary-600 transition-colors"
        >
          이 트렌드로 매칭 시작하기
        </button>
      </div>
    </div>
  );
};

export default TrendDetailPage;
