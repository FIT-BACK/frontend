import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface AiAnalysisResponse {
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETE' | 'FAILED';
  tags: string[];
}

/**
 * SCR-06: AI 분석 상태를 주기적으로 폴링하는 훅
 * @param reportId 리포트 식별자
 */
export const useAiAnalysis = (reportId: string) => {
  return useQuery<AiAnalysisResponse, Error>({
    queryKey: ['aiAnalysis', reportId],
    queryFn: async () => {
      const response = await axios.get<AiAnalysisResponse>(`/api/v1/analyses/${reportId}`);
      return response.data;
    },
    // React Query v4(data)와 v5(query.state.data) 방식 모두 대응
    refetchInterval: (queryOrData: any) => {
      const data = queryOrData?.state?.data ?? queryOrData;
      if (data?.status === 'COMPLETE' || data?.status === 'FAILED') {
        return false; // 완료 상태 시 폴링 중단
      }
      return 3000; // 3초마다 재요청
    },
    enabled: !!reportId, // reportId가 존재할 때만 실행
  });
};
