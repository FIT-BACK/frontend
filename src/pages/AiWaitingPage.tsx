import React from 'react';
import { ProgressBar } from '../components/common/ProgressBar';
import { useMatchingReport } from '../hooks/useMatchingQuery';

export const AiWaitingPage: React.FC = () => {
  const {} = useMatchingReport();

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
      


      <div className="flex-1 flex flex-col items-center justify-center gap-[18px] px-5">
        {/* Scan Box */}
        <div className="w-[130px] h-[160px] rounded-[14px] bg-bg-secondary relative overflow-hidden border-[0.5px] border-border">
          {/* Corners */}
          <div className="absolute w-[13px] h-[13px] border-primary-400 top-[6px] left-[6px] border-t-2 border-l-2 rounded-tl-[3px]"></div>
          <div className="absolute w-[13px] h-[13px] border-primary-400 top-[6px] right-[6px] border-t-2 border-r-2 rounded-tr-[3px]"></div>
          <div className="absolute w-[13px] h-[13px] border-primary-400 bottom-[6px] left-[6px] border-b-2 border-l-2 rounded-bl-[3px]"></div>
          <div className="absolute w-[13px] h-[13px] border-primary-400 bottom-[6px] right-[6px] border-b-2 border-r-2 rounded-br-[3px]"></div>
          
          {/* Scan Line */}
          <div className="absolute left-0 right-0 h-[2px] animate-scan bg-gradient-to-r from-transparent via-primary-400 to-transparent shadow-[0_0_8px] shadow-primary-400"></div>
        </div>

        {/* Text */}
        <div>
          <div className="text-[12px] text-primary-800 font-bold text-center">
            스타일과 실루엣을<br />분석하고 있어요
          </div>
          <div className="text-[9px] text-text-secondary text-center mt-[3px]">
            감성은 그대로, 가격은 가볍게
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full mt-4">
          <ProgressBar currentStep={3} />
        </div>
      </div>
    </div>
  );
};
