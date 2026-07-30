import { api } from './axiosInstance';

/**
 * ==========================================
 *  AI 태그 분석 API 통신 정의
 * ==========================================
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useCreateAnalysisMutation.ts를 사용하세요.
 *
 * ⚠️ imageId 타입 - 일단 number로 정의함
 */

export interface AnalysisCreateResponse {
  reportId: string;
}

// 이 값을 false로 바꾸면 실제 서버와 연동됩니다.
const USE_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** POST /api/v1/analyses - 업로드된 이미지(imageId)로 AI 태그 분석 시작 */
export const createAnalysis = async (
  imageId: number,
): Promise<AnalysisCreateResponse> => {
  if (USE_MOCK) {
    await delay(1000);
    return { reportId: 'mock-report-1' };
  }

  const response = await api.post<AnalysisCreateResponse>('/api/v1/analyses', {
    imageId,
  });
  return response.data;
};
