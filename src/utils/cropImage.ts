import type { PixelCrop } from 'react-image-crop';

// AI 분석용으로는 이 정도 해상도면 충분하고, 백엔드/S3가 5MB로 업로드를
// 제한하고 있어서 원본 해상도를 그대로 내보내면 특히 요즘 폰 카메라
// 사진(고해상도)에서 너무 쉽게 5MB를 넘겨버린다.
const MAX_OUTPUT_DIMENSION = 2000;
const MAX_OUTPUT_BYTES = 5 * 1024 * 1024;
const INITIAL_QUALITY = 0.85;

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

/**
 * 캔버스를 이용해 이미지를 크롭하고 File 객체로 반환합니다.
 */
export const getCroppedImg = async (
  image: HTMLImageElement,
  pixelCrop: PixelCrop,
  fileName: string = 'cropped.jpg'
): Promise<File | null> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // 화면 렌더링 크기와 실제 이미지 크기 간의 배율 계산
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const cropX = pixelCrop.x * scaleX;
  const cropY = pixelCrop.y * scaleY;
  const cropWidth = pixelCrop.width * scaleX;
  const cropHeight = pixelCrop.height * scaleY;

  // 이미 naturalWidth/Height(원본 픽셀)를 기준으로 크롭 영역을 계산했으므로,
  // 여기에 devicePixelRatio까지 곱해서 캔버스를 더 키우면 실제로 존재하지
  // 않는 디테일을 보간만 해서 늘리는 셈이라 화질 이득 없이 용량만 커진다
  // (레티나 화면에서 3배까지 부풀어서 5MB 제한을 넘기는 원인이었음 — 크롭은
  // 됐는데 "분석 시작하기"를 누르면 조용히 실패하는 것처럼 보였던 버그).
  // 대신 긴 변 기준 MAX_OUTPUT_DIMENSION으로 상한을 둬서, 원본이 아무리
  // 고해상도라도 출력은 AI 분석에 충분한 크기로만 내보낸다.
  const longestSide = Math.max(cropWidth, cropHeight);
  const downscale = longestSide > MAX_OUTPUT_DIMENSION ? MAX_OUTPUT_DIMENSION / longestSide : 1;

  canvas.width = Math.max(1, Math.round(cropWidth * downscale));
  canvas.height = Math.max(1, Math.round(cropHeight * downscale));
  ctx.imageSmoothingQuality = 'high';

  // 원본 이미지에서 크롭 영역만큼 잘라서(필요하면 축소하면서) 캔버스에 그리기
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // 그래도 5MB를 넘으면(아주 디테일이 많은 사진 등) 화질을 단계적으로
  // 낮춰가며 재시도 — 조용히 실패하고 "분석 시작하기"가 안 먹히는 대신
  // 항상 업로드 가능한 파일을 만들어낸다.
  let quality = INITIAL_QUALITY;
  let blob = await canvasToBlob(canvas, quality);
  for (let attempt = 0; attempt < 4 && blob && blob.size > MAX_OUTPUT_BYTES; attempt += 1) {
    quality -= 0.15;
    blob = await canvasToBlob(canvas, Math.max(quality, 0.4));
  }

  if (!blob) {
    return null;
  }

  return new File([blob], fileName, { type: 'image/jpeg' });
};
