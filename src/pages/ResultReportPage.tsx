import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSaveReport } from '../hooks/useSaveReport';
import { useAppStore } from '../store/useAppStore';

export const ResultReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  const { mutate: saveReport, isPending } = useSaveReport();
  const tags = useAppStore((state) => state.tags);

  const [selectedTop, setSelectedTop] = useState<number | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<number | null>(null);

  // [Real API Flow]: 리포트 저장(찜) API를 호출하는 로직입니다. 
  // 실제 연동 시 onSuccess 콜백 등을 통해 UI 토스트(저장 완료) 처리가 필요합니다.
  const handleSave = () => {
    if (reportId) saveReport({ reportId });
    else alert('저장할 리포트 식별자가 없습니다.');
  };

  // [Mock Data Flow]: 하드코딩된 대안 상품 데이터입니다.
  // [Real API Flow]: 명세서에 따르면 GET /api/v1/results 호출 결과를 받아와 렌더링해야 합니다.
  const tops = [
    { id: 1, rank: 1, name: '오버핏 셔츠', shop: '무신사 스탠다드', price: '₩28,900', img: 'https://picsum.photos/100' },
    { id: 2, rank: 2, name: '루즈핏 셔츠', shop: '에이블리', price: '₩32,000', img: 'https://picsum.photos/101' },
    { id: 3, rank: 3, name: '와이드 셔츠', shop: '지그재그', price: '₩35,500', img: 'https://picsum.photos/102' },
  ];

  const bottoms = [
    { id: 4, rank: 1, name: '와이드 슬랙스', shop: '지그재그', price: '₩24,900', img: 'https://picsum.photos/103' },
    { id: 5, rank: 2, name: '스트레이트 핏 데님', shop: '무신사', price: '₩39,900', img: 'https://picsum.photos/104' },
  ];

  const ItemCard = ({ 
    item, 
    isSelected, 
    onSelect 
  }: { 
    item: any, 
    isSelected: boolean, 
    onSelect: () => void 
  }) => (
    <div
      onClick={onSelect}
      className={`flex gap-[10px] rounded-[11px] p-[10px] items-center cursor-pointer transition-colors border-[1px] ${
        isSelected ? 'border-primary-400 bg-primary-50' : 'border-border bg-white'
      }`}
    >
      {/* Radio Button */}
      <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
        isSelected ? 'border-primary-400 bg-primary-400' : 'border-border bg-bg-secondary'
      }`}>
        {isSelected && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <div 
        className="w-[44px] h-[44px] rounded-[8px] bg-bg-secondary shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.img})` }}
      ></div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="text-[12px] text-text font-bold truncate">{item.name}</div>
        <div className="text-[10px] text-text-secondary mt-[2px]">{item.shop}</div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="text-[10px] px-[6px] py-[2px] rounded-[6px] font-extrabold bg-[#FAEEDA] text-[#633806] mb-[4px]">
          {item.rank}위 매칭
        </div>
        <div className="text-[14px] font-extrabold text-primary-800">
          {item.price}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[375px] min-h-screen mx-auto bg-bg flex flex-col text-text relative">
      {/* Header */}
      <div className="flex items-center justify-between p-[12px_20px_8px] shrink-0 bg-bg z-10 sticky top-0">
        <span onClick={() => navigate(-1)} className="text-[22px] text-text-secondary cursor-pointer p-1">←</span>
        <div className="flex flex-col items-center">
          <span className="text-[16px] font-bold text-text">분석 결과</span>
        </div>
        <span 
          onClick={handleSave} 
          className={`text-[14px] font-bold text-primary-400 cursor-pointer p-1 ${isPending ? 'opacity-50' : ''}`}
        >
          {isPending ? '저장 중...' : '저장'}
        </span>
      </div>

      {/* Tags */}
      <div className="flex gap-[6px] px-[20px] pt-[4px] pb-[12px] flex-wrap shrink-0 border-b border-border bg-bg">
        {tags.map((tag) => (
          <div key={tag} className="inline-flex items-center gap-[5px] text-[11px] bg-primary-50 text-primary-800 px-[10px] py-[4px] rounded-full font-semibold">
            #{tag}
          </div>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-[20px] flex flex-col gap-[12px] pb-[100px] pt-[14px]">
        
        {/* Tops Section */}
        <div className="text-[12px] font-bold text-text pb-[4px] flex items-center gap-[6px]">
          상의 <span className="text-[10px] bg-bg-secondary text-text-secondary px-[6px] py-[2px] rounded-[6px] font-semibold">{tops.length}개 대안</span>
        </div>
        <div className="flex flex-col gap-[8px]">
          {tops.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              isSelected={selectedTop === item.id}
              onSelect={() => setSelectedTop(item.id)}
            />
          ))}
        </div>
        <div className="text-[11px] text-primary-400 text-center p-[8px] font-bold cursor-pointer hover:bg-primary-50 rounded-[8px] transition-colors mb-[10px]">
          더보기 +
        </div>

        {/* Bottoms Section */}
        <div className="text-[12px] font-bold text-text pb-[4px] flex items-center gap-[6px]">
          하의 <span className="text-[10px] bg-bg-secondary text-text-secondary px-[6px] py-[2px] rounded-[6px] font-semibold">{bottoms.length}개 대안</span>
        </div>
        <div className="flex flex-col gap-[8px]">
          {bottoms.map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              isSelected={selectedBottom === item.id}
              onSelect={() => setSelectedBottom(item.id)}
            />
          ))}
        </div>
        <div className="text-[11px] text-primary-400 text-center p-[8px] font-bold cursor-pointer hover:bg-primary-50 rounded-[8px] transition-colors">
          더보기 +
        </div>

      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-[20px] left-[20px] right-[20px] z-20">
        {/* 
          [Real API Flow]: 명세서에 따르면 '룩북으로 올리기' 진입 시 
          원본 imageId와 여기서 선택한 상품의 imageUrl을 다음 페이지(SCR-09)로 전달해야 합니다. 
          상태 관리자나 라우터 state로 넘기는 로직 연동이 필요합니다. 
        */}
        <button
          onClick={() => navigate('/upload-lookbook')}
          disabled={!selectedTop && !selectedBottom}
          className="w-full text-bg text-[15px] font-bold border-none rounded-[14px] p-[16px] bg-primary-400 hover:bg-primary-500 transition-colors shadow-[0_5px_12px_rgba(127,119,221,0.3)] disabled:bg-border disabled:text-text-secondary disabled:shadow-none"
        >
          이 조합으로 내 룩북 올리기 
        </button>
      </div>

    </div>
  );
};