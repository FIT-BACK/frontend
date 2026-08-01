import { api } from './axiosInstance';

/**
 * ==========================================
 *  트렌드 관련 API 통신 정의
 * ==========================================
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useTrendsQuery.ts를 사용하세요.
 */

export interface TrendItem {
  id: number;
  imageUrl: string;
  label: string;
  styleTags: string[];
}

export interface TrendDetail extends TrendItem {
  description?: string;
}

// 이 값을 false로 바꾸면 실제 서버와 연동됩니다.
const USE_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_TRENDS: TrendItem[] = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/trend1/300/300',
    label: '베이지 트렌치코트',
    styleTags: ['미니멀', '포멀'],
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/trend2/300/300',
    label: '화이트 셔츠',
    styleTags: ['미니멀', '캐주얼'],
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/trend3/300/300',
    label: '블랙 슬랙스',
    styleTags: ['미니멀', '포멀'],
  },
  {
    id: 4,
    imageUrl: 'https://picsum.photos/seed/trend4/300/300',
    label: '오버사이즈 후드',
    styleTags: ['스트릿', '캐주얼'],
  },
  {
    id: 5,
    imageUrl: 'https://picsum.photos/seed/trend5/300/300',
    label: '카고 팬츠',
    styleTags: ['스트릿', '고프코어'],
  },
  {
    id: 6,
    imageUrl: 'https://picsum.photos/seed/trend6/300/300',
    label: '레이스 블라우스',
    styleTags: ['페미닌', '빈티지'],
  },
  {
    id: 7,
    imageUrl: 'https://picsum.photos/seed/trend7/300/300',
    label: '트랙 자켓',
    styleTags: ['스포티', '캐주얼'],
  },
  {
    id: 8,
    imageUrl: 'https://picsum.photos/seed/trend8/300/300',
    label: '와이드 데님',
    styleTags: ['빈티지', '캐주얼'],
  },
];

/** GET /api/v1/trends - 홈 화면 요즘 트렌드 목록 조회 */
export const getTrends = async (): Promise<TrendItem[]> => {
  if (USE_MOCK) {
    await delay(400);
    return MOCK_TRENDS;
  }
  const response = await api.get<TrendItem[]>('/api/v1/trends');
  return response.data;
};

/** GET /api/v1/trends/{trendId} - 트렌드 카드 선택 시 상세 조회 */
export const getTrendDetail = async (trendId: number): Promise<TrendDetail> => {
  if (USE_MOCK) {
    await delay(400);
    const found = MOCK_TRENDS.find((t) => t.id === trendId);
    return {
      id: trendId,
      imageUrl: found?.imageUrl ?? MOCK_TRENDS[0].imageUrl,
      label: found?.label ?? '트렌드',
      styleTags: found?.styleTags ?? [],
      description: '이 시즌 인기 있는 스타일이에요.',
    };
  }
  const response = await api.get<TrendDetail>(`/api/v1/trends/${trendId}`);
  return response.data;
};
