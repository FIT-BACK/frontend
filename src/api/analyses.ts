import { api } from './axiosInstance';

/**
 * ==========================================
 *  AI 태그 분석 API 통신 정의
 * ==========================================
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useCreateAnalysisMutation.ts를 사용하세요.
 */

export interface SuggestedTag {
  tagId: number;
  tagName: string;
}

export interface AnalysisCreateResponse {
  reportId: number; // string → number로 수정 (실제 API 기준)
  imageUrl: string;
  matchPercentage: number;
  suggestedTags: SuggestedTag[];
}

const USE_MOCK = true;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** POST /api/v1/analyses - 업로드된 이미지(imageId)로 AI 태그 분석 시작 */
export const createAnalysis = async (
  imageId: string, // ⚠️ 아래 참고 - number가 아니라 string(UUID)일 가능성 높음
): Promise<AnalysisCreateResponse> => {
  if (USE_MOCK) {
    await delay(1000);
    return {
      reportId: 501,
      imageUrl: 'https://picsum.photos/seed/analysis-mock/800/1000',
      matchPercentage: 70,
      suggestedTags: [
        { tagId: 12, tagName: '미니멀' },
        { tagId: 21, tagName: '와이드핏' },
        { tagId: 33, tagName: '베이지톤' },
      ],
    };
  }

  const response = await api.post('/api/v1/analyses', { imageId });
  return response.data.data;
};
