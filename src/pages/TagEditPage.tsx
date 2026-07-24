import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useItemMatching } from '../hooks/useItemMatching';
import { useAppStore } from '../store/useAppStore';

export const TagEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>(); 
  const { mutate: getRecommendations, isPending } = useItemMatching(reportId || '');
  
  const tags = useAppStore((state) => state.tags);
  const setTags = useAppStore((state) => state.setTags);
  const [tagWarning, setTagWarning] = useState(false);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  // [Mock Data Flow]: 직접 입력 외에 노출되는 추천 태그 더미 리스트입니다.
  // [Real API Flow]: 추후 필요하다면 서버의 추천 태그 API와 연동합니다.
  const recommendedTags = ['스트릿', '캐주얼', '빈티지', '고프코어', '아메카지', '프레피'];

  const [matchLevel, setMatchLevel] = useState(70);

  const handleDelete = (tagToDelete: string) => {
    if (tags.length <= 1) {
      setTagWarning(true);
      setTimeout(() => setTagWarning(false), 2000); 
      return;
    }
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setNewTagInput('');
      return;
    }
    if (tags.length >= 8) {
      alert('태그는 최대 8개까지만 추가할 수 있습니다.');
      return;
    }
    setTags([...tags, trimmed]);
    setNewTagInput('');
    setIsBottomSheetOpen(false);
  };

  return (
    <div className="max-w-[375px] min-h-screen mx-auto bg-bg flex flex-col text-text relative overflow-hidden pb-5">
      <div className="flex items-center justify-between p-[20px_20px_8px] shrink-0">
        <span className="text-[16px] font-bold text-text"></span>
      </div>

      <div className="flex-1 overflow-y-auto px-[20px] flex flex-col gap-[12px]">
        <div className="pt-[4px] shrink-0">
          <div className="text-[17px] font-extrabold text-text">AI가 이렇게 분석했어요</div>
          <div className="text-[12px] text-text-secondary mt-[6px] leading-relaxed">
            맞지 않는 태그는 빼고, 원하는 매칭 강도를 조절해보세요
          </div>
        </div>

        {/* [Mock Data Flow]: 더미 배경 이미지입니다. */}
        {/* [Real API Flow]: 이전 화면에서 넘어온 원본 이미지 URL 렌더링 필요 */}
        <div 
          className="h-[70px] rounded-[10px] bg-bg-secondary shrink-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://picsum.photos/400/100')" }}
        ></div>

        {/* Tags */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-[6px]">
            <span className="text-[10px] font-bold text-text-secondary">추출된 스타일 태그</span>
            {tagWarning && (
              <span className="text-error-400 text-[9px] font-semibold transition-opacity duration-300">
                태그를 1개 이상 남겨주세요
              </span>
            )}
          </div>
          <div className="flex gap-[5px] flex-wrap items-center">
            {tags.map((tag) => (
              <div key={tag} className="inline-flex items-center gap-[5px] text-[12px] bg-primary-50 text-primary-800 px-[12px] py-[6px] rounded-full font-semibold">
                #{tag}
                <span onClick={() => handleDelete(tag)} className="cursor-pointer text-[10px] flex items-center justify-center rounded-full bg-primary-900/15 w-[14px] h-[14px] ml-1">✕</span>
              </div>
            ))}
            
            {tags.length < 8 && (
              <div 
                onClick={() => setIsBottomSheetOpen(true)} 
                className="cursor-pointer text-[12px] border border-dashed border-primary-200 text-primary-400 px-[12px] py-[6px] rounded-full font-semibold"
              >
                + 추가
              </div>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Slider Card */}
        <div className="bg-bg-secondary p-[14px] rounded-[12px] shrink-0 mt-4 border border-border">
          <div className="flex justify-between items-center mb-[12px]">
            <span className="text-[12px] font-bold text-text">매칭 정도</span>
            <span className="text-[14px] font-extrabold text-primary-400">{matchLevel}%</span>
          </div>
          
          <div className="relative flex items-center h-[24px]">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={matchLevel}
              onChange={(e) => setMatchLevel(Number(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10 m-0"
            />
            <div className="absolute w-full h-[6px] bg-border rounded-[10px] pointer-events-none">
              <div 
                className="h-full bg-gradient-to-r from-primary-200 to-primary-400 rounded-[10px]"
                style={{ width: `${matchLevel}%` }}
              ></div>
              <div 
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-bg border-[2.5px] border-primary-400 shadow-[0_2px_5px_rgba(0,0,0,0.12)] transition-none"
                style={{ left: `${matchLevel}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between text-[10px] text-text-secondary mt-[8px]">
            <span>더 다양하게</span>
            <span>더 비슷하게</span>
          </div>
        </div>

        {/* Confirm Button */}
        <button 
          onClick={() => {
            // [Real API Flow]: 최종 결정된 태그 배열(tags)과 매칭 강도(matchLevel)를 서버로 전송합니다.
            getRecommendations(
              { tags, matchIntensity: matchLevel },
              { 
                onSuccess: () => navigate('/result'),
                onError: () => {
                  // [Mock Data Flow]: 백엔드 서버가 닫혀있어도 프로토타입 UI 확인을 위해 에러 무시하고 강제 이동
                  console.warn('API 연결이 되지 않아 더미 UI 흐름으로 강제 이동합니다.');
                  navigate('/result');
                }
              }
            );
          }}
          disabled={isPending}
          className="w-full text-bg text-[15px] font-bold border-none rounded-[14px] p-[16px] bg-primary-400 hover:bg-primary-500 transition-colors disabled:opacity-50 shrink-0 mt-2"
        >
          {isPending ? '매칭 중...' : '이대로 매칭하기'}
        </button>
      </div>

      {/* 태그 추가 바텀시트 */}
      {isBottomSheetOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-primary-900/40 transition-opacity"
            onClick={() => setIsBottomSheetOpen(false)}
          ></div>
          
          <div className="relative bg-bg w-full rounded-t-[24px] p-[12px_20px_34px] shadow-xl">
            <div className="w-[40px] h-[4px] bg-border rounded-full mx-auto mb-[18px]"></div>
            
            <div className="text-[15px] font-bold text-text mb-[14px]">태그 추가</div>
            
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTag(newTagInput);
              }}
              placeholder="직접 입력 후 엔터"
              className="w-full bg-bg text-text border border-border rounded-[12px] p-[14px_16px] text-[14px] outline-none focus:border-primary-400 focus:bg-primary-50 mb-[20px] transition-colors"
              autoFocus
            />

            <div className="text-[12px] font-bold text-text-secondary mb-[10px]">추천 태그</div>
            <div className="flex flex-wrap gap-[6px]">
              {recommendedTags.map((tag) => (
                <div 
                  key={tag} 
                  onClick={() => handleAddTag(tag)} 
                  className="cursor-pointer inline-flex items-center gap-[5px] text-[12px] bg-primary-50 text-primary-800 px-[12px] py-[6px] rounded-full font-semibold"
                >
                  #{tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
