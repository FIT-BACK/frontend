import { useState } from 'react';
import { reportLookbook } from '../../../api/lookbooks';
import type { ReportType } from '../../../api/lookbooks';

const REPORT_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'INAPPROPRIATE_IMAGE', label: '부적절한 이미지 (성인/폭력)' },
  { value: 'COPYRIGHT_INFRINGEMENT', label: '저작권 침해 / 무단 도용' },
  { value: 'FRAUD_OR_FALSE_INFORMATION', label: '허위 정보 / 사기' },
  { value: 'SPAM_OR_ADVERTISEMENT', label: '스팸 / 광고성 콘텐츠' },
  { value: 'OTHER', label: '기타' },
];

interface ReportBottomSheetProps {
  isOpen: boolean;
  lookbookId: number;
  onClose: () => void;
}

export default function ReportBottomSheet({
  isOpen,
  lookbookId,
  onClose,
}: ReportBottomSheetProps) {
  const [selected, setSelected] = useState<ReportType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await reportLookbook(lookbookId, selected);
      alert('신고가 접수되었습니다. 검토 후 조치할게요');
      onClose();
    } catch (e: any) {
      if (e?.response?.status === 409) {
        alert('이미 신고한 룩북이에요');
      } else {
        alert('잠시 후 다시 시도해주세요');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center'>
      {/* 백드롭 배경 딤 처리 - 탭하면 닫힘 */}
      <button
        type='button'
        aria-label='닫기'
        onClick={onClose}
        className='absolute inset-0 bg-black/40'
      />

      {/* 바텀시트 본체 */}
      <div className='relative z-10 w-full max-w-[375px] rounded-t-3xl bg-white px-5 pb-8 pt-3 border-t border-border shadow-2xl animate-[slideUp_0.25s_ease-out]'>
        {/* 드래그 핸들 */}
        <div className='mx-auto mb-5 h-1 w-10 rounded-full bg-border' />

        {/* 타이틀 */}
        <h2 className='text-base font-bold text-text mb-4'>
          신고 유형을 선택해주세요
        </h2>

        {/* 옵션 리스트 */}
        <div className='flex flex-col space-y-1 mb-6'>
          {REPORT_OPTIONS.map((opt) => {
            const isChecked = selected === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition active:bg-bg ${
                  isChecked
                    ? 'border-primary-400 bg-primary-50/50 font-medium'
                    : 'border-border'
                }`}
              >
                <span className='text-sm text-text'>{opt.label}</span>
                <input
                  type='radio'
                  name='reportType'
                  checked={isChecked}
                  onChange={() => setSelected(opt.value)}
                  className='h-4 w-4 accent-primary-500 cursor-pointer'
                />
              </label>
            );
          })}
        </div>

        {/* 제출 버튼 */}
        <button
          type='button'
          className='w-full rounded-xl bg-primary-500 py-3.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400'
          disabled={!selected || submitting}
          onClick={handleSubmit}
        >
          {submitting ? '접수 중...' : '신고하기'}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
