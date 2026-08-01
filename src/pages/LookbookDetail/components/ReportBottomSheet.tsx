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

export default function ReportBottomSheet({
  lookbookId,
  onClose,
}: {
  lookbookId: number;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<ReportType | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    <div className='fixed inset-0 bg-black/30 flex items-end' onClick={onClose}>
      <div
        className='w-full bg-white rounded-t-2xl p-4'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='text-sm font-bold mb-3'>신고 유형을 선택해주세요</div>
        <div className='flex flex-col'>
          {REPORT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className='flex items-center gap-2.5 py-3 border-b last:border-0'
            >
              <input
                type='radio'
                name='reportType'
                checked={selected === opt.value}
                onChange={() => setSelected(opt.value)}
              />
              <span className='text-xs'>{opt.label}</span>
            </label>
          ))}
        </div>
        <button
          className='w-full bg-pink-500 text-white rounded-lg py-3 text-xs font-bold mt-3 disabled:bg-gray-300'
          disabled={!selected || submitting}
          onClick={handleSubmit}
        >
          신고하기
        </button>
      </div>
    </div>
  );
}
