import React from 'react';
import { TagChip } from '../components/common/TagChip';
import { useParams, useNavigate } from 'react-router-dom';
import { useSaveReport } from '../hooks/useSaveReport';
import { useAppStore } from '../store/useAppStore';
import TabBar from '../components/layout/TabBar';

export const ResultReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>(); // URL에서 받아온다고 가정
  const { mutate: saveReport, isPending } = useSaveReport();

  const handleSave = () => {
    if (reportId) {
      saveReport({ reportId });
    } else {
      alert('저장할 리포트 식별자가 없습니다.');
    }
  };

  const tags = useAppStore((state) => state.tags);

  const tops = [
    { rank: 1, name: '오버핏 셔츠', shop: '에이블리', price: '₩28,900' },
    { rank: 2, name: '루즈핏 셔츠', shop: '무신사', price: '₩32,000' },
    { rank: 3, name: '와이드 셔츠', shop: '지그재그', price: '₩35,500' },
  ];

  const bottoms = [
    { rank: 1, name: '와이드 슬랙스', shop: '지그재그', price: '₩24,900' },
  ];

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      {/* 📌 주석을 태그 안쪽으로 내려서 문법 오류를 완벽하게 해결했습니다. */}
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col shadow-lg relative text-text">

        {/* Header (자체 구현한 분석 결과 헤더) */}
        <div className="px-[14px] pt-[10px] pb-0 shrink-0">
          <div className="relative flex items-center justify-between">
            <span 
              onClick={() => navigate(-1)}
              className="text-text-secondary text-[14px] cursor-pointer">←</span>
            <span className="absolute left-1/2 -translate-x-1/2 text-[14px] font-extrabold text-text">분석 결과</span>
            <span 
              onClick={handleSave} 
              className={`text-[12px] font-bold text-primary-400 cursor-pointer ${isPending ? 'opacity-50' : ''}`}
            >
              {isPending ? '저장 중...' : '저장'}
            </span>
          </div>
          <div className="text-[9px] text-text-secondary mt-[3px]">
            상의·하의 각 3개 대안 · 최저가순
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-[4px] px-[14px] pt-[8px] pb-[10px] flex-wrap shrink-0">
          {tags.map((tag) => (
            <TagChip key={tag} label={tag} variant="default" />
          ))}
        </div>

        {/* Result Scroll (하단 바에 가려지지 않도록 패딩 확보) */}
        <div className="flex-1 overflow-y-auto px-[14px] flex flex-col gap-[6px] pb-32">
          {/* Tops Section */}
          <div className="text-[10px] font-bold text-text pt-[6px] pb-[4px] flex items-center gap-[4px]">
            상의{' '}
            <span className="text-[8px] bg-bg-secondary text-text-secondary px-[5px] py-[1px] rounded-[5px] font-semibold">
              3개 대안
            </span>
          </div>
          {tops.map((item) => (
            <div
              key={item.name}
              className="flex gap-[7px] border-[0.5px] border-border rounded-[11px] p-[7px] items-center"
            >
              <div
                className={`text-[8px] px-[6px] py-[2px] rounded-[6px] shrink-0 font-bold ${
                  item.rank === 1
                    ? 'bg-primary-50 text-primary-800'
                    : 'bg-bg-secondary text-text-secondary'
                }`}
              >
                {item.rank}위
              </div>
              <div className="w-[36px] h-[36px] rounded-[8px] bg-bg-secondary shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-text font-semibold">{item.name}</div>
                <div className="text-[8px] text-text-secondary mt-[1px]">{item.shop}</div>
              </div>
              <div className="text-[11px] font-extrabold text-primary-800 mt-[1px]">
                {item.price}
              </div>
            </div>
          ))}

          {/* Bottoms Section */}
          <div className="text-[10px] font-bold text-text pt-[10px] pb-[4px] flex items-center gap-[4px]">
            하의{' '}
            <span className="text-[8px] bg-bg-secondary text-text-secondary px-[5px] py-[1px] rounded-[5px] font-semibold">
              3개 대안
            </span>
          </div>
          {bottoms.map((item) => (
            <div
              key={item.name}
              className="flex gap-[7px] border-[0.5px] border-border rounded-[11px] p-[7px] items-center"
            >
              <div
                className={`text-[8px] px-[6px] py-[2px] rounded-[6px] shrink-0 font-bold ${
                  item.rank === 1
                    ? 'bg-primary-50 text-primary-800'
                    : 'bg-bg-secondary text-text-secondary'
                }`}
              >
                {item.rank}위
              </div>
              <div className="w-[36px] h-[36px] rounded-[8px] bg-bg-secondary shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-text font-semibold">{item.name}</div>
                <div className="text-[8px] text-text-secondary mt-[1px]">{item.shop}</div>
              </div>
              <div className="text-[11px] font-extrabold text-primary-800 mt-[1px]">
                {item.price}
              </div>
            </div>
          ))}

          <div className="text-[9px] text-primary-400 text-center p-[8px] font-semibold mt-2 cursor-pointer">
            더보기 +
          </div>
        </div>

        {/* CTA 버튼 (하단 고정) */}
        <div className="absolute bottom-[70px] left-0 right-0 px-[14px] z-10">
          <button
            onClick={() => navigate('/upload-lookbook')}
            className="w-full text-bg text-[14px] font-bold border-none rounded-[10px] p-[14px] bg-primary-800 hover:bg-primary-900 transition-colors shadow-lg"
          >
            이 조합으로 내 룩북 올리기 🚀
          </button>
        </div>

        {/* 하단 네비게이션 바 */}
        <TabBar />

      </div>
    </div>
  );
};