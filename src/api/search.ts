import { api } from './axiosInstance'
import type { TrendItem } from './trends'

/**
 * ==========================================
 *  통합 콘텐츠 검색 (SCR-16) API 통신 정의
 * ==========================================
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useContentSearch.ts를 사용하세요.
 */

export interface LookbookSearchItem {
  id: number
  imageUrl: string
  comment: string
  authorNickname: string
  tags: string[]
}

export interface ContentSearchResult {
  trends: TrendItem[]
  lookbooks: LookbookSearchItem[]
}

const USE_MOCK = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_TRENDS: TrendItem[] = [
  { id: 1, imageUrl: 'https://picsum.photos/seed/trend1/300/300', label: '베이지 트렌치코트', styleTags: ['미니멀', '포멀'] },
  { id: 2, imageUrl: 'https://picsum.photos/seed/trend2/300/300', label: '화이트 셔츠', styleTags: ['미니멀', '캐주얼'] },
]

const MOCK_LOOKBOOKS: LookbookSearchItem[] = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/lookbook1/300/300',
    comment: '미니멀 오피스룩 완성',
    authorNickname: 'minji_style',
    tags: ['미니멀', '오피스룩'],
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/lookbook2/300/300',
    comment: '데일리 캐주얼 코디',
    authorNickname: 'street_boy',
    tags: ['캐주얼', '스트릿'],
  },
]

/** GET /api/v1/content-search?keyword= - 트렌드+룩북 통합 검색 */
export const searchContent = async (keyword: string): Promise<ContentSearchResult> => {
  if (USE_MOCK) {
    await delay(400)
    const q = keyword.trim().toLowerCase()
    if (!q) return { trends: [], lookbooks: [] }

    return {
      trends: MOCK_TRENDS.filter((t) => t.label.toLowerCase().includes(q)),
      lookbooks: MOCK_LOOKBOOKS.filter(
        (l) =>
          l.comment.toLowerCase().includes(q) ||
          l.authorNickname.toLowerCase().includes(q) ||
          l.tags.some((tag) => tag.toLowerCase().includes(q)),
      ),
    }
  }

  const response = await api.get<ContentSearchResult>('/api/v1/content-search', {
    params: { keyword },
  })
  return response.data
}
