import { useEffect, useMemo, useRef, useState } from 'react';

interface ImageCropModalProps {
  imageUrl: string;
  fileName: string;
  fileType: string;
  onCancel: () => void;
  onConfirm: (croppedFile: File) => void;
}

// 크롭 창 크기(화면에 보이는 CSS px 기준) — 옷 사진은 대체로 세로가 더 긴
// 4:5 비율로 고정. 결과물 해상도는 화질을 위해 이 크기의 2배로 렌더링한다.
const FRAME_WIDTH = 300;
const FRAME_HEIGHT = 375;
const OUTPUT_SCALE = 2;

/**
 * 옷 부분만 잘라서 올릴 수 있게 하는 간단한 크롭 도구.
 * 라이브러리 없이 순수 canvas + pointer 이벤트로 구현 — 이미지를 드래그로
 * 이동시키고 슬라이더로 확대해서, 고정된 창(프레임) 안에 보이는 부분만 잘라낸다.
 */
export default function ImageCropModal({
  imageUrl,
  fileName,
  fileType,
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);

  // 프레임을 항상 덮도록 하는 최소 배율(baseScale). 실제 화면 배율 = baseScale * zoom
  const baseScale = useMemo(() => {
    if (!naturalSize) return 1;
    return Math.max(FRAME_WIDTH / naturalSize.width, FRAME_HEIGHT / naturalSize.height);
  }, [naturalSize]);

  const displayedSize = useMemo(() => {
    if (!naturalSize) return { width: FRAME_WIDTH, height: FRAME_HEIGHT };
    const scale = baseScale * zoom;
    return { width: naturalSize.width * scale, height: naturalSize.height * scale };
  }, [naturalSize, baseScale, zoom]);

  const clampOffset = (next: { x: number; y: number }, size = displayedSize) => ({
    x: Math.min(0, Math.max(FRAME_WIDTH - size.width, next.x)),
    y: Math.min(0, Math.max(FRAME_HEIGHT - size.height, next.y)),
  });

  // 이미지가 처음 로드되면 중앙 정렬로 시작
  const handleImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    setNaturalSize({ width, height });
    const scale = Math.max(FRAME_WIDTH / width, FRAME_HEIGHT / height);
    const displayW = width * scale;
    const displayH = height * scale;
    setOffset({ x: (FRAME_WIDTH - displayW) / 2, y: (FRAME_HEIGHT - displayH) / 2 });
  };

  // 줌이 바뀌면 현재 오프셋이 새 크기에서도 프레임을 벗어나지 않도록 다시 클램프
  useEffect(() => {
    setOffset((prev) => clampOffset(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, offsetX: offset.x, offsetY: offset.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset(
      clampOffset({ x: dragState.current.offsetX + dx, y: dragState.current.offsetY + dy }),
    );
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    if (!img || !naturalSize) return;
    const scale = baseScale * zoom;

    // 화면에 보이는 프레임 영역을, 원본 이미지의 실제 픽셀 좌표로 역산한다.
    const sx = -offset.x / scale;
    const sy = -offset.y / scale;
    const sWidth = FRAME_WIDTH / scale;
    const sHeight = FRAME_HEIGHT / scale;

    const canvas = document.createElement('canvas');
    canvas.width = FRAME_WIDTH * OUTPUT_SCALE;
    canvas.height = FRAME_HEIGHT * OUTPUT_SCALE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const croppedFile = new File([blob], fileName, { type: fileType || 'image/jpeg' });
        onConfirm(croppedFile);
      },
      fileType || 'image/jpeg',
      0.92,
    );
  };

  return (
    // 온보딩 튜토리얼(z-[100])과 동시에 뜰 수 있는 상황(첫 방문 직후 바로 업로드)을 대비해
    // 더 높은 z-index로 고정 — 업로드 작업 중인 모달이 항상 위에 와야 한다.
    <div className='fixed inset-0 z-[110] flex flex-col bg-black'>
      <div className='flex items-center justify-between px-4 py-3'>
        <button type='button' onClick={onCancel} className='text-sm font-medium text-white/80'>
          취소
        </button>
        <span className='text-sm font-bold text-white'>옷 부분만 잘라주세요</span>
        <button type='button' onClick={handleConfirm} className='text-sm font-bold text-primary-300'>
          완료
        </button>
      </div>

      <p className='px-5 pb-3 text-center text-xs text-white/70'>
        상의·하의·원피스·아우터 중 <b className='text-white'>하나만</b> 나오게 옮기고 확대해주세요
      </p>

      <div className='flex flex-1 items-center justify-center overflow-hidden'>
        <div
          className='relative touch-none overflow-hidden rounded-2xl border-2 border-white/80'
          style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt='크롭할 사진'
            onLoad={handleImageLoad}
            draggable={false}
            className='absolute select-none'
            style={{
              left: offset.x,
              top: offset.y,
              width: displayedSize.width,
              height: displayedSize.height,
              maxWidth: 'none',
            }}
          />
        </div>
      </div>

      <div className='flex flex-col items-center gap-2 px-8 pb-8 pt-4'>
        <span className='text-[11px] text-white/60'>확대/축소</span>
        <input
          type='range'
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className='w-full accent-primary-400'
          aria-label='이미지 확대/축소'
        />
      </div>
    </div>
  );
}
