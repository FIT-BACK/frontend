import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateAnalysis } from '../hooks/useAiAnalysis';
import { useUploadStore } from '../store/useUploadStore';

export const AiWaitingPage: React.FC = () => {
  const navigate = useNavigate();
  const imageId = useUploadStore((state) => state.imageId);
  const imageUri = useUploadStore((state) => state.imageUri);
  const setAnalysisResult = useUploadStore((state) => state.setAnalysisResult);

  const { mutate: createAnalysis, isPending, isSuccess, isError, error } = useCreateAnalysis();
  const [progress, setProgress] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!imageId) {
      navigate('/analyze');
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;

    createAnalysis(imageId, {
      onSuccess: (data) => {
        setAnalysisResult({
          reportId: data.reportId,
          imageUrl: data.imageUrl,
          matchPercentage: data.matchPercentage,
          suggestedTags: data.suggestedTags,
        });
      },
    });
  }, [imageId, createAnalysis, navigate, setAnalysisResult]);

  useEffect(() => {
    // UX용 진행바 애니메이션 — 실제 분석 완료 여부와는 별개로 최소 시청 시간을 보장한다.
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const canProceed = progress >= 100 && isSuccess;

  const handleNext = () => {
    if (!canProceed) return;
    navigate('/tag-edit');
  };

  return (
    <div className="max-w-[375px] min-h-screen mx-auto bg-bg flex flex-col text-text">
      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="flex-1 flex flex-col items-center justify-center gap-[24px] px-7">
        <div
          className="w-[180px] h-[220px] rounded-[20px] bg-bg-secondary relative overflow-hidden border border-border bg-cover bg-center"
          style={{ backgroundImage: imageUri ? `url('${imageUri}')` : undefined }}
        >
          {/* Scan Line */}
          <div className="absolute left-0 right-0 h-[3px] animate-scan bg-gradient-to-r from-transparent via-primary-400 to-transparent shadow-[0_0_12px] shadow-primary-400"></div>

          {/* Corners */}
          <div className="absolute w-[18px] h-[18px] border-primary-400 top-[8px] left-[8px] border-t-[2.5px] border-l-[2.5px] rounded-tl-[3px]"></div>
          <div className="absolute w-[18px] h-[18px] border-primary-400 top-[8px] right-[8px] border-t-[2.5px] border-r-[2.5px] rounded-tr-[3px]"></div>
          <div className="absolute w-[18px] h-[18px] border-primary-400 bottom-[8px] left-[8px] border-b-[2.5px] border-l-[2.5px] rounded-bl-[3px]"></div>
          <div className="absolute w-[18px] h-[18px] border-primary-400 bottom-[8px] right-[8px] border-b-[2.5px] border-r-[2.5px] rounded-br-[3px]"></div>
        </div>

        {/* Text */}
        <div className="text-center">
          <div className="text-[16px] text-primary-800 font-bold leading-snug">
            스타일과 실루엣을<br />분석하고 있어요
          </div>
          <div className="text-[12px] text-text-secondary mt-[8px]">
            {isError
              ? (error?.message ?? '분석 중 오류가 발생했습니다')
              : '감성은 그대로, 가격은 가볍게'}
          </div>
        </div>

        {/* Progress List */}
        <div className="w-full flex flex-col gap-[10px]">
          {/* Step 1 */}
          <div className="flex items-center gap-[10px]">
            <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 ${progress > 0 ? 'bg-primary-400' : 'bg-bg-secondary border-[2px] border-border'}`}>
              {progress > 0 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className={`text-[13px] ${progress > 0 ? 'text-text-secondary' : 'text-primary-800 font-bold'}`}>이미지 업로드 완료</span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-[10px]">
            <div className={`w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center ${
              progress > 60 ? 'bg-primary-400' : progress > 0 ? 'bg-primary-50 border-[2px] border-primary-400' : 'bg-bg-secondary border-[2px] border-border'
            }`}>
              {progress > 60 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className={`text-[13px] ${progress > 60 ? 'text-text-secondary' : progress > 0 ? 'text-primary-800 font-bold' : 'text-text-secondary'}`}>
              스타일 태그 분석 중
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-[10px]">
            <div className={`w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center ${
              progress >= 100 ? 'bg-primary-400' : progress > 60 ? 'bg-primary-50 border-[2px] border-primary-400' : 'bg-bg-secondary border-[2px] border-border'
            }`}>
              {progress >= 100 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className={`text-[13px] ${progress >= 100 ? 'text-text-secondary' : progress > 60 ? 'text-primary-800 font-bold' : 'text-text-secondary'}`}>
              가성비 아이템 매칭
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-[6px] bg-bg-secondary rounded-[10px] overflow-hidden mt-[6px]">
            <div
              className="h-full bg-gradient-to-r from-primary-200 to-primary-400 rounded-[10px] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full mt-4 text-bg text-[15px] font-bold border-none rounded-[14px] p-[16px] bg-primary-400 disabled:opacity-50 transition-opacity"
        >
          {isPending ? '분석 중...' : '태그 확인하기 →'}
        </button>
      </div>
    </div>
  );
};
