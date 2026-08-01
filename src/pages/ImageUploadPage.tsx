import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadStore } from '../store/useUploadStore';
import { useImageUpload } from '../hooks/useImageUpload';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUploadPage() {
  const navigate = useNavigate();
  const imageUri = useUploadStore((state) => state.imageUri);
  const setImage = useUploadStore((state) => state.setImage);
  const setImageId = useUploadStore((state) => state.setImageId);
  const resetUpload = useUploadStore((state) => state.resetUpload);

  const { uploadImage, isUploading, uploadProgress, error: uploadError } = useImageUpload('ANALYSIS');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
    setSelectedFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleDropZoneClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
    e.target.value = ''; // 같은 파일 재선택 가능하도록 초기화
  };

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;
    const imageId = await uploadImage(selectedFile);
    if (imageId) {
      setImageId(imageId);
      navigate('/waiting');
    }
  };

  const handleRetake = () => {
    resetUpload();
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className='max-w-[375px] min-h-screen mx-auto bg-bg flex flex-col text-text px-5 pb-8 pt-6'>
      {/* 헤더 */}
      <header className='flex items-center gap-3'>
        <button
          type='button'
          onClick={() => navigate(-1)}
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
            {!isUploading && (
              <button
                type='button'
                onClick={handleRetake}
                className='absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white'
              >
                다시 선택
              </button>
            )}
            {isUploading && (
              <div className='absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-[11px] text-white'>
                업로드 중... {uploadProgress}%
              </div>
            )}
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

        {(error || uploadError) && (
          <p className='mt-2 text-[11px] text-error-400 text-center'>{error ?? uploadError}</p>
        )}
      </div>

      <div className='flex-1' />

      {/* C-05-03 분석 시작하기 */}
      <div className='mt-6'>
        <button
          type='button'
          onClick={handleStartAnalysis}
          disabled={!imageUri || isUploading}
          className='w-full rounded-xl bg-primary-400 py-4 text-sm font-bold text-white transition active:scale-[0.98] disabled:opacity-40'
        >
          {isUploading ? '업로드 중...' : '분석 시작하기'}
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
