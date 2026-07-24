import { api } from './axiosInstance'

/**
 * ==========================================
 *  태그 목록 조회 (SCR-03/SCR-12 관심 스타일 태그 선택용)
 * ==========================================
 *
 * 현재는 USE_MOCK = true로 가짜 응답을 반환하며, 추후 백엔드 연동 시 아래 실제 API 호출 로직으로 교체할 예정이다.
 */

export interface StyleTag {
  tagId: number
  tagName: string
}

const USE_MOCK = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_TAGS: StyleTag[] = [
  { tagId: 1, tagName: '미니멀' },
  { tagId: 2, tagName: '스트릿' },
  { tagId: 3, tagName: '캐주얼' },
  { tagId: 4, tagName: '포멀' },
  { tagId: 5, tagName: '빈티지' },
  { tagId: 6, tagName: '스포티' },
  { tagId: 7, tagName: '러블리' },
  { tagId: 8, tagName: '시크' },
  { tagId: 9, tagName: '유니크' },
  { tagId: 10, tagName: '오피스룩' },
]

interface TagsApiResponse {
  success: boolean
  code: string
  message: string
  data: {
    items: StyleTag[]
  }
}

export const getTags = async (): Promise<StyleTag[]> => {
  if (USE_MOCK) {
    await delay(500)
    return MOCK_TAGS
  }

  const response = await api.get<TagsApiResponse>('/api/v1/tags')
  return response.data.data.items
}
