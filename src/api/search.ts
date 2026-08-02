import { api } from './axiosInstance'
import type { TrendItem } from './trends'
import { TREND_ARTICLES, type TrendArticle } from '../constants/trendArticles'

/**
 * ==========================================
 *  통합 콘텐츠 검색 (SCR-16) API 통신 정의
 * ==========================================
 * 컴포넌트에서 직접 부르지 말고 src/hooks/useContentSearch.ts를 사용하세요.
 *
 * 트렌드는 백엔드 trend 도메인이 아니라 constants/trendArticles.ts(관리자가
 * 직접 push하는 콘텐츠)로 운영되고 있어 실제로는 항상 비어있다
 * (GET /api/v1/trends 확인 결과 items: [] — 팀이 트렌드 콘텐츠 전략을
 * 프론트 상수 관리 방식으로 전환한 이후 백엔드 쪽에 데이터를 넣지 않음).
 * 그래서 트렌드 검색은 로컬 TREND_ARTICLES를 대상으로 하고, 룩북 검색만
 * 실제 백엔드(GET /api/v1/content-search)를 사용한다.
 */

export interface LookbookSearchItem {
  id: number
  imageUrl: string
  authorNickname: string
  authorProfileImageUrl: string | null
  tags: string[]
  likeCount: number
  isLiked: boolean
}

export interface ContentSearchResult {
  trends: TrendItem[]
  lookbooks: LookbookSearchItem[]
}

interface ApiEnvelope<T> {
  success: boolean
  code: string
  message: string
  data: T
}

interface LookbookSearchApiItem {
  lookbookId: number
  originalImageUrl: string
  matchedImageUrl: string | null
  matchedProductId: number | null
  authorNickname: string
  authorProfileImageUrl: string | null
  tags: string[]
  likeCount: number
  isLiked: boolean
}

interface ContentSearchApiResponse {
  trends: unknown[]
  lookbooks: LookbookSearchApiItem[]
}

const USE_MOCK = false
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_LOOKBOOKS: LookbookSearchItem[] = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/seed/lookbook1/300/300',
    authorNickname: 'minji_style',
    authorProfileImageUrl: null,
    tags: ['미니멀', '오피스룩'],
    likeCount: 12,
    isLiked: false,
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/seed/lookbook2/300/300',
    authorNickname: 'street_boy',
    authorProfileImageUrl: null,
    tags: ['캐주얼', '스트릿'],
    likeCount: 4,
    isLiked: false,
  },
]

function trendThumbnail(article: TrendArticle): string {
  if (article.contentType === 'photo') return article.imageUrl
  if (article.contentType === 'magazine') return article.photos[0] ?? ''
  if (article.contentType === 'youtube') {
    return `https://img.youtube.com/vi/${article.youtubeVideoId}/hqdefault.jpg`
  }
  return ''
}

function searchLocalTrends(keyword: string): TrendItem[] {
  const q = keyword.trim().toLowerCase()
  if (!q) return []
  return TREND_ARTICLES.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.tag.toLowerCase().includes(q) ||
      t.relatedTags.some((tag) => tag.toLowerCase().includes(q)),
  ).map((t) => ({
    id: t.id,
    imageUrl: trendThumbnail(t),
    label: t.title,
    styleTags: t.relatedTags.map((tag) => tag.replace('#', '')),
  }))
}

/** GET /api/v1/content-search?keyword= - 룩북 검색(트렌드는 로컬 콘텐츠 대상) */
export const searchContent = async (keyword: string): Promise<ContentSearchResult> => {
  const trends = searchLocalTrends(keyword)

  if (USE_MOCK) {
    await delay(400)
    const q = keyword.trim().toLowerCase()
    if (!q) return { trends: [], lookbooks: [] }

    return {
      trends,
      lookbooks: MOCK_LOOKBOOKS.filter(
        (l) =>
          l.authorNickname.toLowerCase().includes(q) ||
          l.tags.some((tag) => tag.toLowerCase().includes(q)),
      ),
    }
  }

  const response = await api.get<ApiEnvelope<ContentSearchApiResponse>>(
    '/api/v1/content-search',
    { params: { keyword } },
  )
  const lookbooks = response.data.data.lookbooks.map((item) => ({
    id: item.lookbookId,
    imageUrl: item.matchedImageUrl ?? item.originalImageUrl,
    authorNickname: item.authorNickname,
    authorProfileImageUrl: item.authorProfileImageUrl,
    tags: item.tags,
    likeCount: item.likeCount,
    isLiked: item.isLiked,
  }))
  return { trends, lookbooks }
}
