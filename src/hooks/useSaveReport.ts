import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface SaveReportRequest {
  reportId: string;
}

export interface SaveReportResponse {
  success: boolean;
  savedId?: string;
}

/**
 * SCR-08: 최종 리포트를 마이 클로젯에 저장하는 훅
 */
export const useSaveReport = () => {
  return useMutation<SaveReportResponse, Error, SaveReportRequest>({
    mutationFn: async (data: SaveReportRequest) => {
      const response = await axios.post<SaveReportResponse>('/api/v1/closet-saves', data);
      return response.data;
    },
    onSuccess: () => {
      alert('리포트가 마이 클로젯에 성공적으로 저장되었습니다!');
    },
    onError: (error) => {
      console.error('마이 클로젯 저장 실패:', error);
      alert('마이 클로젯에 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    },
  });
};
