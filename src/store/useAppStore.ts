import { create } from 'zustand';

type PageType = 'AiWaitingPage' | 'TagEditPage' | 'ResultReportPage';

interface AppState {
  currentPage: PageType;
  tags: string[];
  setPage: (page: PageType) => void;
  setTags: (tags: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'TagEditPage', // 기본 시작 페이지
  tags: ['미니멀', '와이드핏', '베이지톤'],
  setPage: (page) => set({ currentPage: page }),
  setTags: (tags) => set({ tags }),
}));
