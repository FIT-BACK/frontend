import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface ItemMatchingRequest {
  tags: string[];
  matchIntensity: number; // 0 ~ 100
}

export interface RecommendationItem {
  itemId: string;
  itemName: string;
  price: number;
  imageUrl: string;
  productUrl: string;
}

export interface RecommendationCategory {
  category: string; // 예: '상의', '하의'
  items: RecommendationItem[];
}

export interface ItemMatchingResponse {
  recommendations: RecommendationCategory[];
}

/**
 * SCR-07: 사용자가 태그를 수정한 뒤 매칭 결과를 생성하는 훅
 * @param reportId 리포트 식별자
 */
export const useItemMatching = (reportId: string) => {
  return useMutation<ItemMatchingResponse, Error, ItemMatchingRequest>({
    mutationFn: async (data: ItemMatchingRequest) => {
      const response = await axios.patch<ItemMatchingResponse>(
        `/api/v1/analyses/${reportId}/recommendations`,
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // 성공 시 동작 (예: 성공 로그 또는 다음 화면으로 데이터 전달 처리 등)
      console.log('매칭 결과 업데이트 성공:', data);
    },
    onError: (error) => {
      console.error('매칭 결과 생성 실패:', error);
      alert('매칭 결과를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    },
  });
};
