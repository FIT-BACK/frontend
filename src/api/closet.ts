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

// 실제 API(GET /api/v1/closet-saves)의 targetType → 화면에서 쓰는 ClosetCategory 매핑 (api-spec.md 참고)
type ClosetTargetType = 'TREND' | 'LOOKBOOK' | 'ANALYSIS_REPORT'

const TARGET_TYPE_TO_CATEGORY: Record<ClosetTargetType, ClosetCategory> = {
  TREND: 'trend',
  LOOKBOOK: 'lookbook',
  ANALYSIS_REPORT: 'report',
}

interface ClosetSaveApiItem {
  targetType: ClosetTargetType
  targetId: number
  thumbnailUrl: string
  tags: string[]
}

interface ClosetSavesApiResponse {
  success: boolean
  code: string
  message: string
  data: {
    items: ClosetSaveApiItem[]
    nextCursor: number | null
    hasNext: boolean
    pageSize: number
  }
}

// 마이클로젯 GET/DELETE는 별도 플래그로 분리 — GET은 스펙 확정, DELETE는 saveId 누락으로 아직 연동 불가
const USE_MOCK_GET = true
const USE_MOCK_DELETE = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_CLOSET_ITEMS: ClosetItem[] = [
  { id: 1, category: 'trend', imageUrl: 'https://picsum.photos/seed/trend1/300', title: '오버사이즈 자켓 트렌드' },
  { id: 2, category: 'trend', imageUrl: 'https://picsum.photos/seed/trend2/300', title: '와이드 데님 트렌드' },
  { id: 3, category: 'lookbook', imageUrl: 'https://picsum.photos/seed/look1/300', title: '미니멀 캐주얼 룩북' },
  { id: 4, category: 'lookbook', imageUrl: 'https://picsum.photos/seed/look2/300', title: '스트릿 룩북' },
  { id: 5, category: 'report', imageUrl: 'https://picsum.photos/seed/report1/300', title: '7월 스타일 분석 리포트' },
]

export const getClosetItems = async (): Promise<ClosetItem[]> => {
  if (USE_MOCK_GET) {
    await delay(1500)
    return MOCK_CLOSET_ITEMS
  }

  const response = await api.get<ClosetSavesApiResponse>('/api/v1/closet-saves')
  return response.data.data.items.map((item) => ({
    // TODO: 실제 응답에 saveId가 없어(api-spec.md 확인 중 항목) targetId로 대체 — targetType이 다르면 id가 겹칠 수 있음.
    // saveId가 추가되면 이 값과 deleteClosetItem의 경로 파라미터를 saveId로 교체할 것.
    id: item.targetId,
    category: TARGET_TYPE_TO_CATEGORY[item.targetType],
    imageUrl: item.thumbnailUrl,
    // TODO: 실제 응답엔 title 필드가 없어 tags로 임시 대체 — 화면 표시 문구는 기획 확인 필요
    title: item.tags.join(', '),
  }))
}

export const deleteClosetItem = async (id: number): Promise<void> => {
  if (USE_MOCK_DELETE) {
    await delay(500)
    return
  }

  // TODO: 실제 엔드포인트는 DELETE /api/v1/closet-saves/{saveId} (api-spec.md 참고).
  // GET 응답에 saveId가 없어 지금은 연동 불가 — 노션 쪽 saveId 추가 확인되면 여기부터 다시 작업할 것.
  await api.delete(`/api/closet/${id}`)
}
