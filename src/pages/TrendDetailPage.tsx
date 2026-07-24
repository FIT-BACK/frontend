import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// TODO: API 연동 시 교체할 더미 데이터 (트렌드 상세 정보)
const TREND_DETAIL_DATA = {
  id: 1,
  tag: '#미니멀',
  title: '미니멀 무드',
  description: '군더더기 없는 깔끔한 실루엣과 뉴트럴 컬러로 완성하는 미니멀 스타일. 이번 시즌 가장 핫한 트렌드예요.',
  bgGradient: 'linear-gradient(160deg, #EEE9FF, #D5CCF5)',
  relatedTags: ['#미니멀', '#뉴트럴', '#와이드핏'],
  isSaved: false,
};

// TODO: API 연동 시 교체할 더미 데이터 (연관 룩북)
const RELATED_LOOKBOOKS = [
  { id: 1, bgGradient: 'linear-gradient(135deg, #E8E4F5, #D0C9EE)' },
  { id: 2, bgGradient: 'linear-gradient(135deg, #C9C4F2, #AFA9EC)' },
  { id: 3, bgGradient: 'linear-gradient(135deg, #AFA9EC, #8A82E0)' },
];

const TrendDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // 추후 API 조회 후 상태 업데이트
  const [detailData, setDetailData] = useState(TREND_DETAIL_DATA);

  const toggleSave = () => {
    setDetailData((prev) => ({ ...prev, isSaved: !prev.isSaved }));
    // TODO: Toast 알림 추가 (ex: '트렌드가 클로젯에 저장되었습니다')
  };

  const handleTagClick = (tag: string) => {
    // TODO: Toast 알림 및 검색 페이지 이동 (ex: '#미니멀 검색')
  };

  const handleLookbookClick = (lookbookId: number) => {
    // 룩북 상세 페이지(SCR-04B)로 이동
    // navigate(`/lookbook/${lookbookId}`);
  };

  const handleMatchStartClick = () => {
    // 업로드 페이지(SCR-05)로 이동하면서 현재 트렌드 정보를 전달할 수 있음
    navigate('/upload');
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
            fill={detailData.isSaved ? '#3c3489' : 'none'}
            stroke={detailData.isSaved ? '#3c3489' : 'var(--color-text-secondary)'}
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </header>

      {/* Main Visual */}
      <div 
        className="h-[150px] shrink-0 flex items-center justify-center relative"
        style={{ background: detailData.bgGradient }}
      >
        <div className="absolute top-3 left-3 text-[11px] bg-primary-400 text-white px-2.5 py-1 rounded-full font-bold">
          {detailData.tag}
        </div>
        <span className="text-sm text-primary-800">트렌드 대표 이미지</span>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-20">
        <h2 className="text-[20px] font-extrabold text-text mb-2.5">{detailData.title}</h2>
        <p className="text-[13px] text-text-secondary leading-[1.7] mb-3.5">
          {detailData.description}
        </p>
        
        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4.5">
          {detailData.relatedTags.map((tag) => (
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
              onClick={() => handleLookbookClick(lb.id)}
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
