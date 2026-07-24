import { useRef, useState } from 'react';
import { useUploadStore } from '../store/useUploadStore';
import { DUMMY_UPLOAD_IMAGE_URL } from '../constants/dummyData.ts';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const RECENT_GALLERY_DUMMY: string[] = [
  DUMMY_UPLOAD_IMAGE_URL,
  DUMMY_UPLOAD_IMAGE_URL,
  DUMMY_UPLOAD_IMAGE_URL,
];

interface ImageUploadPageProps {
  onBack: () => void;
  onStartAnalysis: () => void;
}

export default function ImageUploadPage({
  onBack,
  onStartAnalysis,
}: ImageUploadPageProps) {
  const imageUri = useUploadStore((state) => state.imageUri);
  const setImage = useUploadStore((state) => state.setImage);
  const setStatus = useUploadStore((state) => state.setStatus);
  const resetUpload = useUploadStore((state) => state.resetUpload);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const hasGalleryPermission = RECENT_GALLERY_DUMMY.length > 0;

  const validateAndSetFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('5MB 이하 이미지만 업로드 가능합니다');
      return;
    }
    setError(null);
    // TODO: 실제 업로드 훅 연동 시 여기서 Presigned URL 요청 → S3 업로드로 대체
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
  };

  const handleDropZoneClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    e.target.value = ''; // 같은 파일 재선택 가능하도록 초기화
  };

  const handleSelectRecent = (dummyUrl: string) => {
    setError(null);
    setImage(dummyUrl);
  };

  const handleStartAnalysis = () => {
    setStatus('analyzing');
    onStartAnalysis();
  };

  const handleRetake = () => {
    resetUpload();
    setError(null);
  };

  return (
    <div className='max-w-[375px] min-h-screen mx-auto bg-bg flex flex-col text-text px-5 pb-8 pt-6'>
      {/* 헤더 */}
      <header className='flex items-center gap-3'>
        <button
          type='button'
          onClick={onBack}
          aria-label='뒤로가기'
          className='grid h-9 w-9 place-items-center rounded-full border border-border bg-white'
        >
          <BackIcon />
        </button>
      </header>

      {/* 메인 타이틀 */}
      <div className='mt-4'>
        <h2 className='text-xl font-extrabold text-text leading-snug'>
          워너비 사진을
          <br />
          올려주세요
        </h2>
        <p className='mt-2 text-xs text-text-secondary leading-normal'>
          인플루언서 룩, 핀터레스트 컷 등 따라하고 싶은 패션 사진을 업로드하면
          AI가 스타일과 핏을 분석해 가성비 아이템을 찾아드려요.
        </p>
      </div>

      {/* 숨겨진 파일 인풋 (실제 갤러리 피커 트리거) */}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />

      {/* C-05-01 업로드 영역 */}
      <div className='mt-6'>
        {imageUri ? (
          <div className='relative overflow-hidden rounded-2xl bg-bg-secondary border border-border'>
            <img
              src={imageUri}
              alt='업로드한 사진 미리보기'
              className='h-[320px] w-full object-cover'
            />
            <button
              type='button'
              onClick={handleRetake}
              className='absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white'
            >
              다시 선택
            </button>
          </div>
        ) : (
          <button
            type='button'
            onClick={handleDropZoneClick}
            className='grid h-[320px] w-full place-items-center rounded-2xl border border-dashed border-border bg-white text-center'
          >
            <div className='flex flex-col items-center gap-3'>
              <span className='grid h-11 w-11 place-items-center rounded-full bg-primary-50 text-primary-400'>
                <UploadArrowIcon />
              </span>
              <div>
                <p className='text-xs text-text'>탭하여 사진 선택</p>
                <p className='text-xs text-text-secondary'>
                  또는 갤러리에서 가져오기
                </p>
              </div>
            </div>
          </button>
        )}

        {error && (
          <p className='mt-2 text-[11px] text-error-400 text-center'>{error}</p>
        )}
      </div>

      {/* C-05-02 최근 사진 미리보기 (갤러리 권한 없으면 미표시) */}
      {hasGalleryPermission && !imageUri && (
        <div className='mt-3 flex gap-2 justify-center'>
          {RECENT_GALLERY_DUMMY.map((url, i) => (
            <button
              key={i}
              type='button'
              onClick={() => handleSelectRecent(url)}
              aria-label={`최근 사진 ${i + 1}`}
              className='h-16 w-16 overflow-hidden rounded-lg bg-bg-secondary border border-border'
            >
              <img src={url} alt='' className='h-full w-full object-cover' />
            </button>
          ))}
        </div>
      )}

      <div className='flex-1' />

      {/* C-05-03 분석 시작하기 */}
      <div className='mt-6'>
        <button
          type='button'
          onClick={handleStartAnalysis}
          disabled={!imageUri}
          className='w-full rounded-xl bg-primary-400 py-4 text-sm font-bold text-white transition active:scale-[0.98] disabled:opacity-40'
        >
          분석 시작하기
        </button>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <path d='M15 18l-6-6 6-6' />
    </svg>
  );
}

function UploadArrowIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
    >
      <line x1='12' y1='19' x2='12' y2='5' />
      <path d='M5 12l7-7 7 7' />
    </svg>
  );
}
