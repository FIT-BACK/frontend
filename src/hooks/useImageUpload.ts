import { useState, useCallback } from 'react';
import axios from 'axios';
import { api } from '../api/axiosInstance';

// 백엔드 develop 브랜치 ImageUploadRequest.purpose 기준 (2026-07-25 재확인).
// 엔티티 저장용 ImagePurpose는 6개 값(LOOKBOOK_ORIGINAL/LOOKBOOK_MATCHED 포함)이지만,
// 업로드 요청 API가 실제로 받는 타입(ImageUploadPurpose)은 3개뿐이고 LOOKBOOK은 서버에서
// 무조건 LOOKBOOK_ORIGINAL로 저장된다(ImageUploadService.toStoredPurpose) — 원본/매칭 이미지를
// 요청 시점에 구분할 방법이 현재 API에 없다. SCR-09 두 슬롯 모두 'LOOKBOOK'으로 보낼 것.
export type UploadPurpose = 'ANALYSIS' | 'LOOKBOOK' | 'PROFILE';

interface ImageUploadResponseData {
  imageId: string;
  uploadUrl: string;
  uploadMethod: string;
  uploadFields: Record<string, string>;
  expiresAt: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

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

  // 2. 실제 업로드: Presigned POST 발급 → S3 직접 업로드 → 완료 확인
  const uploadImage = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setLastFile(file);
    setIsUploading(true);
    setUploadProgress(0); // 업로드 시작 시 진행률 0으로 초기화
    setError(null);
    setImageId(null);

    try {
      const presignedResponse = await api.post<ApiEnvelope<ImageUploadResponseData>>(
        '/api/v1/images/upload-requests',
        {
          purpose,
          contentType: file.type,
          fileSize: file.size,
        },
      );

      const { imageId: newImageId, uploadUrl, uploadFields } = presignedResponse.data.data;

      // S3 Presigned POST 정책 — uploadFields를 먼저 채우고 file 필드는 반드시 마지막에 추가
      const formData = new FormData();
      Object.entries(uploadFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);

      await axios.post(uploadUrl, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      await api.post(`/api/v1/images/${newImageId}/complete`);
      setImageId(newImageId);
    } catch (err: any) {
      setError(err.response?.data?.message || '이미지 업로드 중 오류가 발생했습니다.');
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
    imageId,        // 업로드 완료 후 발급받은 이미지 고유 ID (string UUID | null)
    error,          // 파일 검증 실패 또는 업로드 중 발생한 에러 메시지 (string | null)
    lastFile,       // 에러 발생 시 재시도를 위해 기억해 둔 직전 파일 객체 (File | null)
  };
};
