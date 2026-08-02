import { api } from './axiosInstance';

/**
 * ==========================================
 *  트렌드 관련 API 통신 정의
 * ==========================================
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useTrendsQuery.ts를 사용하세요.
 */

export interface TrendItem {
  trendId: number;     // id -> trendId로 변경
  imageUrl: string;
  title: string;       // label -> title로 변경
  tags: string[];      // styleTags -> tags로 변경 및 신규 추가
  isSaved: boolean;    // 신규 추가
}

export interface TrendDetail extends TrendItem {
  description?: string;
}

// 실제 서버와 연동하도록 false로 변경
const USE_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_TRENDS: TrendItem[] = [
  {
    trendId: 1,
    imageUrl: 'https://picsum.photos/seed/trend1/300/300',
    title: '베이지 트렌치코트',
    tags: ['가을', '클래식'],
    isSaved: false,
  },
  {
    trendId: 2,
    imageUrl: 'https://picsum.photos/seed/trend2/300/300',
    title: '화이트 셔츠',
    tags: ['베이직', '미니멀'],
    isSaved: true,
  },
  {
    trendId: 3,
    imageUrl: 'https://picsum.photos/seed/trend3/300/300',
    title: '블랙 슬랙스',
    tags: ['오피스룩', '시크'],
    isSaved: false,
  },
];

/** GET /api/v1/trends - 홈 화면 요즘 트렌드 목록 조회 */
export const getTrends = async (): Promise<TrendItem[]> => {
  if (USE_MOCK) {
    await delay(400);
    return MOCK_TRENDS;
  }
  
  // 리턴 시 response.data.data 로 한 겹 더 벗겨서 반환합니다.
  const response = await api.get<{ data: TrendItem[] }>('/api/v1/trends');
  return response.data.data;
};

/** GET /api/v1/trends/{trendId} - 트렌드 카드 선택 시 상세 조회 */
export const getTrendDetail = async (trendId: number): Promise<TrendDetail> => {
  if (USE_MOCK) {
    await delay(400);
    const found = MOCK_TRENDS.find((t) => t.trendId === trendId);
    return {
      trendId: trendId,
      imageUrl: found?.imageUrl ?? MOCK_TRENDS[0].imageUrl,
      title: found?.title ?? '트렌드',
      tags: found?.tags ?? [],
      isSaved: found?.isSaved ?? false,
      description: '이 시즌 인기 있는 스타일이에요.',
    };
  }
  
  const response = await api.get<{ data: TrendDetail }>(`/api/v1/trends/${trendId}`);
  return response.data.data;
};