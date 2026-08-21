import { useState, useCallback } from 'react';
import axios from 'axios';
import { uploadImageToReady, type UploadPurpose } from '../api/imageUpload.ts';
import { api } from '../api/axiosInstance';

// 업로드 용도(목적)를 명확한 타입으로 정의
export type { UploadPurpose } from '../api/imageUpload.ts';

export const useImageUpload = (purpose: UploadPurpose) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // 진행률(%) 상태
  const [imageId, setImageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);

  // 1. 파일 유효성 검증 
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

  // 2. 실제 백엔드 연동 업로드 프로세스
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!validateFile(file)) return null;

    setLastFile(file);
    setIsUploading(true);
    setUploadProgress(0); // 업로드 시작 시 진행률 0으로 초기화
    setError(null);
    setImageId(null);

    try {
      const newImageId = await uploadImageToReady({
        file,
        purpose,
        apiClient: api,
        uploadClient: axios.create(),
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      // 모든 단계 성공 시 상태 업데이트
      setImageId(newImageId);
      setUploadProgress(100);
      return newImageId as string;
    } catch (err: any) {
      setError(err.response?.data?.message || '이미지 업로드 중 오류가 발생했습니다.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [purpose]);

  // 3. 에러 발생 시 호출할 재시도 함수
  const retryUpload = useCallback(async () => {
    if (!lastFile) {
      setError('다시 시도할 파일이 존재하지 않습니다.');
      return;
    }
    await uploadImage(lastFile);
  }, [lastFile, uploadImage]);

  return {
    uploadImage,    // 이미지를 업로드하는 함수
    retryUpload,    // 업로드 실패 시 마지막 파일 객체로 업로드를 재시도하는 함수
    isUploading,    // 현재 이미지 업로드가 진행 중인지 여부 (boolean)
    uploadProgress, // 이미지 업로드 진행률 (0 ~ 100 사이의 숫자 %)
    imageId,        // 업로드 완료 후 발급받은 이미지 고유 ID (string | null)
    error,          // 파일 검증 실패 또는 업로드 중 발생한 에러 메시지 (string | null)
    lastFile,       // 에러 발생 시 재시도를 위해 기억해 둔 직전 파일 객체 (File | null)
  };
};
