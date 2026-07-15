import { create } from 'zustand';

// 1) State 타입
interface UploadState {
  imageUri: string | null;
  aiTags: string[]; // AI 태그 확인·수정 화면에서 편집됨
  analysisStatus: 'idle' | 'analyzing' | 'done' | 'error';
}

// 2) Action 타입
interface UploadActions {
  setImage: (uri: string) => void;
  setAiTags: (tags: string[]) => void;
  setStatus: (status: UploadState['analysisStatus']) => void;
  resetUpload: () => void; // 리포트 확인 후 다음 업로드를 위해 초기화
}

type UploadStore = UploadState & UploadActions;

// 3) 초기값
const initialState: UploadState = {
  imageUri: null,
  aiTags: [],
  analysisStatus: 'idle',
};

// 4) 스토어 생성 — persist 불필요 (새로고침 시 유지할 필요 없는 임시 데이터)
export const useUploadStore = create<UploadStore>((set) => ({
  ...initialState,

  setImage: (imageUri) => set({ imageUri, analysisStatus: 'idle' }),
  setAiTags: (aiTags) => set({ aiTags }),
  setStatus: (analysisStatus) => set({ analysisStatus }),
  resetUpload: () => set({ ...initialState }),
}));
