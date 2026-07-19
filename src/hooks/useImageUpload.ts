import { useState, useCallback } from 'react';
import axios from 'axios'; 

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0); //  진행률(%)을 담는 새로운 상태
  const [imageId, setImageId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);

  // 1. 파일 유효성 검증 (5MB 제한 & 확장자 체크)
  const validateFile = (file: File): boolean => {
    const MAX_SIZE = 5 * 1024 * 1024; // 최대 파일 크기 5MB 이하 정책
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']; // 허용 파일 형식 

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

  // 2. 실제 Presigned URL 발급 및 S3 직접 업로드 프로세스
  const uploadImage = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setLastFile(file);
    setIsUploading(true);
    setUploadProgress(0); //  업로드 시작 시 진행률 0으로 초기화
    setError(null);
    setImageId(null);

    try {
      // ========================================================
      // [1단계] 백엔드에 Presigned URL 요청
      // ⚠️ 주의: '/api/v1/analyses/presigned' 주소는 백엔드 최종 명세에 따라 이름이 변경될 수 있어 향후 수정 예정입니다
      const presignedResponse = await axios.post('/api/v1/analyses/presigned', {
        fileName: file.name,
        fileType: file.type, // 백엔드가 S3 Content-Type을 지정할 수 있도록 전달
      });
      
      // 백엔드로부터 S3 업로드용 URL과 최종 저장될 이미지 ID를 반환받습니다.
      const { uploadUrl, generatedImageId } = presignedResponse.data;

      // [2단계] 발급받은 Presigned URL로 S3에 직접 이미지 업로드
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type, // S3에 직접 쏠 때는 파일의 원본 타입을 명시
        },
        //  onUploadProgress를 이용해 진행률을 계산
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted); // 0 ~ 100 사이의 숫자가 상태에 계속 업데이트 됨
          }
        },
      });
      // ========================================================

      // [3단계] S3 업로드 성공 시 백엔드로부터 미리 받아둔 imageId를 훅의 상태로 저장 (전달용)
      setImageId(generatedImageId);

    } catch (err: any) {
      console.error("업로드 실패:", err);
      // 실패 시 토스트 노출을 위한 에러 문구 세팅
      setError(err.response?.data?.message || '이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
      // 참고: 에러가 나거나 성공해도 진행률은 마지막 상태로 두어 UI가 자연스럽게 끝나도록 합니다.
    }
  }, []);

  // 3. 에러 발생 시 호출할 재시도 함수 (재시도 버튼 연동용)
  const retryUpload = useCallback(async () => {
    if (!lastFile) {
      setError('다시 시도할 파일이 존재하지 않습니다.');
      return;
    }
    await uploadImage(lastFile);
  }, [lastFile, uploadImage]);

  return {
    uploadImage,    // 이미지를 업로드하는 함수 (유효성 검사 및 S3 업로드 실행)
    retryUpload,    // 업로드 실패 시 마지막 파일 객체로 업로드를 재시도하는 함수
    isUploading,    // 현재 이미지 업로드가 진행 중인지 여부 (boolean)
    uploadProgress, // 이미지 업로드 진행률 (0 ~ 100 사이의 숫자 %)
    imageId,        // 업로드 완료 후 백엔드로부터 발급받은 이미지 고유 ID (number)
    error,          // 파일 검증 실패 또는 업로드 중 발생한 에러 메시지 (string | null)
    lastFile,       // 에러 발생 시 재시도를 위해 기억해 둔 직전 파일 객체 (File | null)
  };
};