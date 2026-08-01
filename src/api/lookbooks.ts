import { api } from './axiosInstance';

/**
 * ==========================================
 *  룩북 피드 관련 API 통신 정의
 * ==========================================
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useLookbookFeedQuery.ts를 사용하세요.
 */

export interface LookbookFeedItem {
  id: number;
  authorHandle: string;
  likeCount: number;
  isLiked: boolean;
  originalImageUrl: string;
  matchedImageUrl: string;
}

export interface LookbookListResponse {
  items: LookbookFeedItem[];
  hasMore: boolean;
}

// 이 값을 false로 바꾸면 실제 서버와 연동됩니다.
const USE_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 목업 상태에서도 좋아요 토글이 실제로 반영되도록 하는 간단한 인메모리 저장소
// (새로고침하면 초기화됩니다. 실제 서버 연동 시 이 블록은 필요 없습니다.)
const mockLikedIds = new Set<number>();

function createMockPage(page: number): LookbookFeedItem[] {
  return Array.from({ length: page === 0 ? 1 : 20 }).map((_, i) => {
    const id = page * 1000 + i;
    return {
      id,
      authorHandle: '@minji_style',
      likeCount: 128 + (mockLikedIds.has(id) ? 1 : 0),
      isLiked: mockLikedIds.has(id),
      originalImageUrl: 'https://picsum.photos/seed/fitback-upload/800/1000',
      matchedImageUrl: 'https://picsum.photos/seed/fitback-upload/800/1000',
    };
  });
}

/** GET /api/v1/lookbooks - 홈 가성비 룩북 피드 목록 (페이지네이션) */
export const getLookbooks = async (
  page: number,
): Promise<LookbookListResponse> => {
  if (USE_MOCK) {
    await delay(500);
    return { items: createMockPage(page), hasMore: page < 1 };
  }
  // TODO: 실제 페이지네이션 파라미터 이름(page/cursor 등)은 백엔드 확정되면 맞추기
  const response = await api.get<LookbookListResponse>('/api/v1/lookbooks', {
    params: { page },
  });
  return response.data;
};

/** POST /api/v1/lookbooks/{lookbookId}/like - 좋아요 등록 */
export const likeLookbook = async (lookbookId: number): Promise<void> => {
  if (USE_MOCK) {
    await delay(200);
    mockLikedIds.add(lookbookId);
    return;
  }
  await api.post(`/api/v1/lookbooks/${lookbookId}/like`);
};

/** DELETE /api/v1/lookbooks/{lookbookId}/like - 좋아요 취소 */
export const unlikeLookbook = async (lookbookId: number): Promise<void> => {
  if (USE_MOCK) {
    await delay(200);
    mockLikedIds.delete(lookbookId);
    return;
  }
  await api.delete(`/api/v1/lookbooks/${lookbookId}/like`);
};
