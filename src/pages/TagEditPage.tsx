import React, { useState } from 'react';
import { TagChip } from '../components/common/TagChip';
import { useMatchingReport } from '../hooks/useMatchingQuery';
import { useAppStore } from '../store/useAppStore';
import { ResultReportPage } from './ResultReportPage';

export const TagEditPage: React.FC = () => {
  const {} = useMatchingReport();
  
  // 1. 태그 상태 (Zustand 스토어 사용)
  const tags = useAppStore((state) => state.tags);
  const setTags = useAppStore((state) => state.setTags);
  const [tagWarning, setTagWarning] = useState(false);

  // 페이지 전환용 상태
  const [showResultPage, setShowResultPage] = useState(false);

  // 2. 바텀시트 상태 및 인풋
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const recommendedTags = ['스트릿', '캐주얼', '빈티지', '고프코어', '아메카지', '프레피'];

  // 3. 슬라이더 (매칭 정도) 상태
  const [matchLevel, setMatchLevel] = useState(70);

  // 4. 모의 API 호출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 태그 삭제 핸들러
  const handleDelete = (tagToDelete: string) => {
    // 1. 최소 1개 유지 및 경고 UI
    if (tags.length <= 1) {
      setTagWarning(true);
      setTimeout(() => setTagWarning(false), 2000); // 2초 후 경고 숨김
      return;
    }
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  // 태그 추가 핸들러
  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    
    // 중복 추가 방지
    if (tags.includes(trimmed)) {
      setNewTagInput('');
      return;
    }
    
    // 8개 제한 방어 로직
    if (tags.length >= 8) {
      alert('태그는 최대 8개까지만 추가할 수 있습니다.');
      return;
    }
    
    setTags([...tags, trimmed]);
    setNewTagInput('');
    setIsBottomSheetOpen(false);
  };

  // 결과 보기 모의(Mock) 호출
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    // 20% 확률로 에러 발생
    if (Math.random() < 0.2) {
      setSubmitError('결과를 불러오지 못했습니다. 다시 시도해 주세요.');
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setShowResultPage(true);
    }
  };

  if (showResultPage) {
    return <ResultReportPage />;
  }

  return (
    <div className="max-w-[375px] min-h-screen mx-auto bg-bg flex flex-col text-text relative overflow-hidden">
      <div className="flex-1 overflow-hidden px-[14px] flex flex-col gap-[12px]">
        {/* Header */}
        <div className="pt-[12px] shrink-0">
          <div className="text-[13px] font-extrabold text-text">AI가 이렇게 분석했어요</div>
          <div className="text-[9px] text-text-secondary mt-[3px] leading-relaxed">
            맞지 않는 태그는 빼고, 원하는 매칭 강도를 조절해보세요
          </div>
        </div>

        {/* Preview */}
        <div className="h-[70px] rounded-[10px] bg-bg-secondary shrink-0"></div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-[6px]">
            <span className="text-[10px] font-bold text-text-secondary">추출된 스타일 태그</span>
            {tagWarning && (
              <span className="text-error-400 text-[9px] font-semibold transition-opacity duration-300">
                태그를 1개 이상 남겨주세요
              </span>
            )}
          </div>
          <div className="flex gap-[5px] flex-wrap">
            {tags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                variant="deletable"
                onDelete={() => handleDelete(tag)}
              />
            ))}
            
            {/* 2. 8개 이상일 때 +추가 버튼 렌더링 제한 */}
            {tags.length < 8 && (
              <div onClick={() => setIsBottomSheetOpen(true)} className="cursor-pointer">
                <TagChip label="추가" variant="add" />
              </div>
            )}
          </div>
        </div>

        {/* Slider Card */}
        <div className="bg-bg-secondary p-[11px] rounded-[12px] shrink-0">
          <div className="flex justify-between items-center mb-[8px]">
            <span className="text-[10px] font-bold text-text">매칭 정도</span>
            <span className="text-[13px] font-extrabold text-primary-400">{matchLevel}%</span>
          </div>
          
          <div className="relative flex items-center h-[24px]">
            {/* 실제 Range Input (보이지 않지만 이벤트를 받음) */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={matchLevel}
              onChange={(e) => setMatchLevel(Number(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10 m-0"
            />
            {/* 시각적 Slider Track */}
            <div className="absolute w-full h-[6px] bg-border rounded-[10px] pointer-events-none">
              {/* 채워지는 게이지 */}
              <div 
                className="h-full bg-gradient-to-r from-primary-200 to-primary-400 rounded-[10px]"
                style={{ width: `${matchLevel}%` }}
              ></div>
              {/* 드래그 썸네일(동그라미) */}
              <div 
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[16px] h-[16px] rounded-full bg-bg border-[2.5px] border-primary-400 shadow-sm transition-none"
                style={{ left: `${matchLevel}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-[8px] text-text-secondary mt-[6px]">
            <span>더 다양하게</span>
            <span>더 비슷하게</span>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Button & Error Message */}
        <div className="flex flex-col gap-[8px] shrink-0 mb-[14px]">
          {submitError && (
            <div className="text-error-400 text-[11px] font-semibold text-center">
              {submitError}
            </div>
          )}
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`text-bg text-[12px] font-bold border-none rounded-[10px] p-[11px] transition-colors ${
              isSubmitting ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary-400 hover:bg-primary-500'
            }`}
          >
            {isSubmitting ? '분석 중...' : '이대로 결과 보기'}
          </button>
        </div>
      </div>

      {/* 태그 추가 바텀시트 */}
      {isBottomSheetOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* 딤 처리된 반투명 배경 */}
          <div 
            className="absolute inset-0 bg-primary-900/35"
            onClick={() => setIsBottomSheetOpen(false)}
          ></div>
          
          {/* 바텀시트 컨텐츠 */}
          <div className="relative bg-bg w-full rounded-t-[20px] p-[20px] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="w-[40px] h-[4px] bg-border rounded-full mx-auto mb-[20px]"></div>
            
            <div className="text-[14px] font-bold text-text mb-[16px]">태그 추가</div>
            
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag(newTagInput);
              }}
              placeholder="직접 입력 후 엔터"
              className="w-full bg-bg-secondary text-text border border-border rounded-[10px] p-[12px] text-[12px] outline-none focus:border-primary-400 mb-[20px]"
              autoFocus
            />

            <div className="text-[11px] font-bold text-text-secondary mb-[10px]">추천 태그</div>
            <div className="flex flex-wrap gap-[6px]">
              {recommendedTags.map((tag) => (
                // 추천 태그 클릭 시 추가되도록 이벤트 바인딩
                <div key={tag} onClick={() => handleAddTag(tag)} className="cursor-pointer">
                  {/* TagChip에 default variant가 없을 수도 있어 렌더링 에러 방지용으로 span 혹은 기본 형태의 UI 사용 가능하나 기존 TagChip을 최대한 활용 */}
                  {/* @ts-ignore : variant prop 타입 검사를 임시로 우회 (추천 칩 형태) */}
                  <TagChip label={tag} variant="default" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
