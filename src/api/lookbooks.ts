import { api } from './axiosInstance'; // ← apiClient → api로 수정

/**
 * ==========================================
 *  룩북 상세(SCR-04B) / 신고(SCR-04C) 관련 API 통신 정의
 * ==========================================
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useLookbookDetail.ts를 사용하세요.
 */

// 도메인 타입은 여기서 직접 정의 (types/component.ts는 공용 UI props 전용)
export type ReportType =
  | 'INAPPROPRIATE_IMAGE'
  | 'COPYRIGHT'
  | 'FALSE_INFO'
  | 'SPAM'
  | 'ETC';

export interface LookbookDetail {
  id: number;
  authorNickname: string;
  authorAvatarUrl: string | null;
  createdAt: string;
  originalImageUrl: string;
  matchedImageUrl: string;
  styleTags: string[];
  comment: string | null;
  products: {
    id: number;
    name: string;
    shopName: string;
    price: number;
    purchaseUrl: string | null;
  }[];
  relatedTrend: { id: number; name: string } | null;
  likeCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isMine: boolean;
}

const USE_MOCK = true;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDetail: LookbookDetail = {
  id: 1,
  authorNickname: '@minji_style',
  authorAvatarUrl: null,
  createdAt: '3시간 전',
  originalImageUrl: 'https://picsum.photos/seed/original/800/1000',
  matchedImageUrl: 'https://picsum.photos/seed/matched/800/1000',
  styleTags: ['미니멀', '와이드핏', '베이지톤'],
  comment:
    '무신사에서 3만원대에 찾았어요! 핏이 거의 똑같고 소재도 생각보다 좋아서 만족 😊',
  products: [
    {
      id: 1,
      name: '오버핏 베이지 셔츠',
      shopName: '무신사 스탠다드',
      price: 28900,
      purchaseUrl: 'https://example.com',
    },
  ],
  relatedTrend: { id: 1, name: '미니멀 무드' },
  likeCount: 128,
  isLiked: false,
  isSaved: false,
  isMine: false,
};

/** GET /api/v1/lookbooks/{lookbookId} */
export const getLookbookDetail = async (
  lookbookId: number,
): Promise<LookbookDetail> => {
  if (USE_MOCK) {
    await delay(400);
    return { ...mockDetail, id: lookbookId };
  }
  const { data } = await api.get<LookbookDetail>(
    `/api/v1/lookbooks/${lookbookId}`,
  );
  return data;
};

/** POST /api/v1/lookbooks/{lookbookId}/likes */
export const toggleLookbookLike = async (lookbookId: number): Promise<void> => {
  if (USE_MOCK) {
    await delay(200);
    return;
  }
  await api.post(`/api/v1/lookbooks/${lookbookId}/likes`);
};

/** POST /api/v1/lookbooks/{lookbookId}/saves */
export const toggleLookbookSave = async (lookbookId: number): Promise<void> => {
  if (USE_MOCK) {
    await delay(200);
    return;
  }
  await api.post(`/api/v1/lookbooks/${lookbookId}/saves`);
};

/** POST /api/v1/lookbooks/{lookbookId}/reports */
export const reportLookbook = async (
  lookbookId: number,
  reportType: ReportType,
): Promise<void> => {
  if (USE_MOCK) {
    await delay(300);
    return;
  }
  await api.post(`/api/v1/lookbooks/${lookbookId}/reports`, { reportType });
};

/** DELETE /api/v1/lookbooks/{lookbookId} */
export const deleteLookbook = async (lookbookId: number): Promise<void> => {
  if (USE_MOCK) {
    await delay(300);
    return;
  }
  await api.delete(`/api/v1/lookbooks/${lookbookId}`);
};
