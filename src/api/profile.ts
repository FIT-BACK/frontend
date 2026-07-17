import { api } from './axiosInstance'
import type { StyleTag } from './tags'

/**
 * ==========================================
 *  마이페이지(SCR-11) 관련 API 통신 정의
 * ==========================================
 *
 * 현재는 USE_MOCK = true로 가짜 응답을 반환하며, 추후 백엔드 연동 시 아래 실제 API 호출 로직으로 교체할 예정이다.
 * 컴포넌트에서 직접 호출하지 말고 src/hooks/useMyPage.ts 훅을 사용할 것.
 */

export interface UserProfile {
  name: string
  email: string
  avatarUrl: string
  isSocialLogin: boolean
  styleTags: string[]
  stats: {
    saved: number
    analyzed: number
    uploaded: number
  }
}

// GET /api/v1/members/me 응답 형태 (api-spec.md 참고) — name/avatarUrl/stats.* 필드명이 화면 쪽과 다름
interface MyProfileApiResponse {
  success: boolean
  code: string
  message: string
  data: {
    memberId: number
    email: string
    nickname: string
    profileImageUrl: string
    savedCount: number
    analysisCount: number
    uploadCount: number
  }
}

// 기능별로 USE_MOCK 분리 — 확정 스펙이 다르게 진행되므로 따로 관리
const USE_MOCK_GET = true
const USE_MOCK_SAVE = true
const USE_MOCK_NICKNAME_CHECK = true // 전용 중복확인 GET 엔드포인트 자체가 노션에 아직 없음 (api-spec.md 확인 중 항목)
const USE_MOCK_LOGOUT = true
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getMyProfile = async (): Promise<UserProfile> => {
  if (USE_MOCK_GET) {
    await delay(1500)
    return {
      name: '이지연',
      email: 'minji_style@email.com',
      avatarUrl: 'https://picsum.photos/seed/myprofile/200',
      isSocialLogin: false,
      styleTags: ['미니멀', '스트릿'],
      stats: { saved: 12, analyzed: 8, uploaded: 3 },
    }
  }

  const response = await api.get<MyProfileApiResponse>('/api/v1/members/me')
  const data = response.data.data
  return {
    name: data.nickname,
    email: data.email,
    avatarUrl: data.profileImageUrl,
    // TODO: 실제 GET /members/me 응답에 isSocialLogin 필드가 없음 — 비밀번호 변경 버튼 비활성화 조건에 쓰이는데
    // 백엔드 스펙에 아직 없어서 임시로 false 고정. 소셜 로그인 판별 필드가 추가되면 교체할 것.
    isSocialLogin: false,
    // TODO: 실제 GET /members/me 응답에 styleTags(관심 태그) 필드가 없음 — 임시 빈 배열, 태그 조회 방법 확인 필요
    styleTags: [],
    stats: {
      saved: data.savedCount,
      analyzed: data.analysisCount,
      uploaded: data.uploadCount,
    },
  }
}

export interface UpdateProfilePayload {
  name: string
  // PUT /members/me/tags가 tagIds(숫자)를 받기 때문에 이름 문자열이 아닌 태그 객체(tagId 포함)로 들고 있음
  // (관련 배경: [[scr12_tag_input_spec_gap]] 참고 — SCR-12는 자유 입력이 아니라 목록 선택 방식이어야 함)
  styleTags: StyleTag[]
  avatarImageId?: string
}

interface MembersMePatchApiResponse {
  success: boolean
  code: string
  message: string
  data: {
    memberId: number
    nickname: string
    profileImageUrl: string
  }
}

interface MembersMeTagsApiResponse {
  success: boolean
  code: string
  message: string
  data: {
    tags: { tagId: number; tagName: string; tagType: string }[]
  }
}

// 아바타는 presigned URL로 S3에 먼저 업로드된 상태(useImageUpload) — 여기서는 imageId만 닉네임/태그와 함께 한 번에 저장
export const updateProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  if (USE_MOCK_SAVE) {
    await delay(800)
    return {
      name: payload.name,
      email: 'minji_style@email.com',
      avatarUrl: payload.avatarImageId
        ? `https://picsum.photos/seed/${payload.avatarImageId}/200`
        : 'https://picsum.photos/seed/myprofile/200',
      isSocialLogin: false,
      styleTags: payload.styleTags.map((tag) => tag.tagName),
      stats: { saved: 12, analyzed: 8, uploaded: 3 },
    }
  }

  // TODO: profileImageUrl 필드가 presigned 업로드 후 URL 문자열을 받는지 imageId를 받는지 노션 문서에
  // 미반영 (SCR-09 룩북 업로드 때와 같은 패턴 — 문서가 옛날 스펙일 가능성 있음, api-spec.md 참고).
  // 일단 avatarImageId를 그대로 profileImageUrl 필드에 실어 보내는 것으로 최선 추정, 노션 갱신되면 교체 필요.
  const patchResponse = await api.patch<MembersMePatchApiResponse>('/api/v1/members/me', {
    nickname: payload.name,
    ...(payload.avatarImageId ? { profileImageUrl: payload.avatarImageId } : {}),
  })

  const tagsResponse = await api.put<MembersMeTagsApiResponse>('/api/v1/members/me/tags', {
    tagIds: payload.styleTags.map((tag) => tag.tagId),
  })

  // PATCH/PUT 응답 둘 다 email과 stats(savedCount 등)를 안 내려주므로, 최신 전체 프로필은 GET으로 다시
  // 받아와 병합. GET /members/me엔 태그 필드가 없어서(api-spec.md 확인 중 항목) styleTags는 방금 PUT
  // 응답으로 온 값으로 덮어씀.
  const freshProfile = await getMyProfile()
  return {
    ...freshProfile,
    name: patchResponse.data.data.nickname,
    avatarUrl: patchResponse.data.data.profileImageUrl,
    styleTags: tagsResponse.data.data.tags.map((tag) => tag.tagName),
  }
}

export const checkNicknameAvailable = async (nickname: string): Promise<{ available: boolean }> => {
  if (USE_MOCK_NICKNAME_CHECK) {
    await delay(400)
    return { available: nickname !== '이미사용중' }
  }

  // TODO: 전용 중복확인 GET 엔드포인트가 노션에 아직 없음(api-spec.md 확인 중 항목) — PATCH /members/me
  // 시도 후 에러 코드로 판별하는 방식이 될 가능성이 있어 경로/방식 자체가 바뀔 수 있음
  const response = await api.get<{ available: boolean }>('/api/users/nickname-check', {
    params: { nickname },
  })
  return response.data
}

export const logout = async (): Promise<void> => {
  if (USE_MOCK_LOGOUT) {
    await delay(300)
    return
  }

  await api.post('/api/v1/auth/logout')
}
