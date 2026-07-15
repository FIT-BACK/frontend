import { api } from './axiosInstance'

/**
 * ==========================================
 *  마이 클로젯(SCR-10) 관련 API 통신 정의
 * ==========================================
 *
 * 현재는 USE_MOCK = true로 가짜 응답을 반환하며, 추후 백엔드 연동 시 아래 실제 API 호출 로직으로 교체할 예정이다.
 * 컴포넌트에서 직접 호출하지 말고 src/hooks/useMyCloset.ts 훅을 사용할 것.
 */

export type ClosetCategory = 'trend' | 'lookbook' | 'report'

export interface ClosetItem {
  id: number
  category: ClosetCategory
  imageUrl: string
  title: string
}

const USE_MOCK = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_CLOSET_ITEMS: ClosetItem[] = [
  { id: 1, category: 'trend', imageUrl: 'https://picsum.photos/seed/trend1/300', title: '오버사이즈 자켓 트렌드' },
  { id: 2, category: 'trend', imageUrl: 'https://picsum.photos/seed/trend2/300', title: '와이드 데님 트렌드' },
  { id: 3, category: 'lookbook', imageUrl: 'https://picsum.photos/seed/look1/300', title: '미니멀 캐주얼 룩북' },
  { id: 4, category: 'lookbook', imageUrl: 'https://picsum.photos/seed/look2/300', title: '스트릿 룩북' },
  { id: 5, category: 'report', imageUrl: 'https://picsum.photos/seed/report1/300', title: '7월 스타일 분석 리포트' },
]

export const getClosetItems = async (): Promise<ClosetItem[]> => {
  if (USE_MOCK) {
    await delay(1500)
    return MOCK_CLOSET_ITEMS
  }

  const response = await api.get<ClosetItem[]>('/api/closet')
  return response.data
}

export const deleteClosetItem = async (id: number): Promise<void> => {
  if (USE_MOCK) {
    await delay(500)
    return
  }

  await api.delete(`/api/closet/${id}`)
}
