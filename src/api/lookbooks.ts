import { api } from './axiosInstance';

/**
 * ==========================================
 *  룩북 상세(SCR-04B) / 신고(SCR-04C) 관련 API 통신 정의
 * ==========================================
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useLookbookDetail.ts를 사용하세요.
 */

// 백엔드 LookbookReportReason과 동일한 값 (Lookbook 컨트롤러 기준)
export type ReportType =
  | 'INAPPROPRIATE_IMAGE'
  | 'COPYRIGHT_INFRINGEMENT'
  | 'FRAUD_OR_FALSE_INFORMATION'
  | 'SPAM_OR_ADVERTISEMENT'
  | 'OTHER';

export interface LookbookTag {
  tagId: number;
  tagName: string;
}

export interface LookbookDetail {
  id: number;
  authorNickname: string;
  authorProfileImageUrl: string | null;
  createdAt: string;
  originalImageUrl: string;
  matchedImageUrl: string | null;
  // 매칭 상품이 실제 상품 카탈로그에 있을 때만 채워짐 — 있으면 GET /api/v1/products/{id}로 상세(이름/가격/판매처) 조회
  matchedProductId: number | null;
  purchaseUrl: string | null;
  tags: LookbookTag[];
  comment: string | null;
  likeCount: number;
  isLiked: boolean;
  isOwner: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

const USE_MOCK = false;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDetail: LookbookDetail = {
  id: 1,
  authorNickname: '@minji_style',
  authorProfileImageUrl: null,
  createdAt: new Date().toISOString(),
  originalImageUrl: 'https://picsum.photos/seed/original/800/1000',
  matchedImageUrl: 'https://picsum.photos/seed/matched/800/1000',
  matchedProductId: 1,
  purchaseUrl: 'https://example.com',
  tags: [
    { tagId: 1, tagName: '미니멀' },
    { tagId: 2, tagName: '와이드핏' },
    { tagId: 3, tagName: '베이지톤' },
  ],
  comment:
    '무신사에서 3만원대에 찾았어요! 핏이 거의 똑같고 소재도 생각보다 좋아서 만족 😊',
  likeCount: 128,
  isLiked: false,
  isOwner: false,
};

/** GET /api/v1/lookbooks/{lookbookId} */
export const getLookbookDetail = async (
  lookbookId: number,
): Promise<LookbookDetail> => {
  if (USE_MOCK) {
    await delay(400);
    return { ...mockDetail, id: lookbookId };
  }
  const response = await api.get<ApiEnvelope<Omit<LookbookDetail, 'id'>>>(
    `/api/v1/lookbooks/${lookbookId}`,
  );
  return { id: lookbookId, ...response.data.data };
};

/** POST /api/v1/lookbooks/{lookbookId}/likes — 좋아요 등록 */
export const likeLookbook = async (
  lookbookId: number,
): Promise<{ isLiked: boolean; likeCount: number }> => {
  if (USE_MOCK) {
    await delay(200);
    return { isLiked: true, likeCount: mockDetail.likeCount + 1 };
  }
  const response = await api.post<ApiEnvelope<{ isLiked: boolean; likeCount: number }>>(
    `/api/v1/lookbooks/${lookbookId}/likes`,
  );
  return response.data.data;
};

/** DELETE /api/v1/lookbooks/{lookbookId}/likes — 좋아요 취소 */
export const unlikeLookbook = async (
  lookbookId: number,
): Promise<{ isLiked: boolean; likeCount: number }> => {
  if (USE_MOCK) {
    await delay(200);
    return { isLiked: false, likeCount: Math.max(mockDetail.likeCount - 1, 0) };
  }
  const response = await api.delete<ApiEnvelope<{ isLiked: boolean; likeCount: number }>>(
    `/api/v1/lookbooks/${lookbookId}/likes`,
  );
  return response.data.data;
};

/**
 * 룩북 저장(찜)은 룩북 전용 엔드포인트가 없고 공용 마이 클로젯 API를 사용한다
 * (POST /api/v1/closet-saves, targetType: 'LOOKBOOK'). 삭제는 saveId가 필요한데
 * 룩북 상세 응답에는 saveId가 내려오지 않아 지금은 저장만 가능하고 저장 취소는
 * 아직 연동할 수 없다 — closet-saves 목록 쪽에서 saveId를 받아온 뒤 이어서 작업할 것.
 */
export const saveLookbook = async (lookbookId: number): Promise<void> => {
  if (USE_MOCK) {
    await delay(200);
    return;
  }
  await api.post('/api/v1/closet-saves', {
    targetType: 'LOOKBOOK',
    targetId: lookbookId,
  });
};

/** POST /api/v1/lookbooks/{lookbookId}/reports */
export const reportLookbook = async (
  lookbookId: number,
  reason: ReportType,
): Promise<void> => {
  if (USE_MOCK) {
    await delay(300);
    return;
  }
  await api.post(`/api/v1/lookbooks/${lookbookId}/reports`, { reason });
};

/** DELETE /api/v1/lookbooks/{lookbookId} */
export const deleteLookbook = async (lookbookId: number): Promise<void> => {
  if (USE_MOCK) {
    await delay(300);
    return;
  }
  await api.delete(`/api/v1/lookbooks/${lookbookId}`);
};
