import { useState, useCallback } from 'react';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false); //현재 이미지가 업로드 중인지 여부
  const [imageId, setImageId] = useState<number | null>(null);  // 업로드 완료 후 백엔드로부터 받은 고유 ID
  const [error, setError] = useState<string | null>(null); //업로드 중 발생한 에러 메시지
  
  // 재시도를 위해 마지막으로 선택했던 파일 객체를 기억하는 상태
  const [lastFile, setLastFile] = useState<File | null>(null);

  // 1. 파일 유효성 검증 (5MB 제한 & 확장자 체크)
  const validateFile = (file: File): boolean => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('JPG, PNG, WEBP 형식의 이미지 파일만 업로드할 수 있습니다.');
      return false;
    }

    if (file.size > MAX_SIZE) {
      setError('파일 용량은 최대 5MB를 초과할 수 없습니다.');
      return false;
    }

    setError(null);
    return true;
  };

  // 2. 가상의 Presigned URL 발급 및 S3 업로드 프로세스 
  const uploadImage = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    // 재시도를 위해 최신 파일 객체를 상태에 저장해 둡니다.
    setLastFile(file);
    setIsUploading(true);
    setError(null);
    setImageId(null);

    try {
      // ========================================================
      //  [임시 구현] 실제 백엔드 API 호출 대신 시뮬레이션하는 부분
      // (나중에 이 안의 코드들만 실제 axios/fetch 통신 코드로 대체됩니다)

      console.log(`[1단계] 백엔드에 파일명(${file.name}) 전달 후 Presigned URL 요청 중...`);
      await new Promise((resolve) => setTimeout(resolve, 800)); // 발급 대기 시간 시뮬레이션
      const mockPresignedUrl = "https://s3.amazonaws.com/fitback-bucket/temp-image-url";
      const mockImageId = Math.floor(Math.random() * 1000) + 1; // 가짜 imageId 생성 (예: 501)

      console.log(`[2단계] 발급 완료! S3 주소(${mockPresignedUrl})로 진짜 파일 PUT 전송 중...`);
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 테스트용: 10% 확률로 업로드 실패를 일으켜 재시도 로직을 테스트해 볼 수 있습니다.
          if (Math.random() < 0.1) {
            reject(new Error("S3 업로드에 실패했습니다. (네트워크 불안정)"));
          } else {
            resolve(true);
          }
        }, 1200);
      });

      //  [임시 구현 끝]
      // ========================================================

      console.log(`[완료] S3 업로드 성공 및 백엔드 이미지 ID(${mockImageId}) 확보 완료`);
      setImageId(mockImageId);

    } catch (err: any) {
      console.error("업로드 실패:", err.message);
      setError(err.message || '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  // 3.  에러 발생 시 호출할 재시도 함수
  const retryUpload = useCallback(async () => {
    if (!lastFile) {
      setError('다시 시도할 파일이 존재하지 않습니다.');
      return;
    }
    console.log("🔄 마지막 파일로 업로드 재시도 중...");
    await uploadImage(lastFile);
  }, [lastFile, uploadImage]);

  return {
    uploadImage,   // 이미지를 올릴 때 실행할 함수
    retryUpload,   // 실패 시 다시 시도할 함수
    isUploading,   // 업로드 중인지 여부 (로딩 바 띄우기용)
    imageId,       // 최종 확보된 이미지의 고유 ID (등록 폼 전송용)
    error,         // 에러 메시지
    lastFile,      // 현재 기억하고 있는 파일 객체 (확인용)
  };
};