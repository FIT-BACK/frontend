export const REASON_CODE_MAP: Record<string, { label: string; color: string }> = {
  FULL_ATTRIBUTE_MATCH: { label: '모든 속성 완벽 일치 ✨', color: 'bg-blue-100 text-blue-700' },
  HIGH_SIMILARITY: { label: '매칭률 80% 이상 🔥', color: 'bg-indigo-100 text-indigo-700' },
  PARTIAL_ATTRIBUTE_MATCH: { label: '일부 태그 매칭', color: 'bg-gray-100 text-gray-700' },
  NO_ATTRIBUTE_MATCH: { label: '일치하는 속성 없음', color: 'bg-gray-100 text-gray-500' },
  NO_SCORABLE_TAGS: { label: '추가 속성 태그 없음', color: 'bg-purple-100 text-purple-700' },
};
