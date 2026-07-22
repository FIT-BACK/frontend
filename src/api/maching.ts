import { api } from './axiosInstance';

/**
 * ==========================================
 *  AI 매칭 및 리포트 결과 관련 API 통신 정의
 * ==========================================
 * 
 * 1. 이 파일은 백엔드 통신 함수와 데이터 타입을 정의하는 곳입니다.
 * 2. 현재 백엔드가 개발 중이므로 'USE_MOCK = true' 상태로 가짜 데이터를 반환합니다.
 * 3. 컴포넌트에서 직접 이 함수를 부르지 마시고, 
 *    `src/hooks/queries/useMatchingQuery.ts`에 만들어둔 커스텀 훅을 사용해 주세요!
 */


// 1. 데이터 구조 (TypeScript Interface) 선언
export interface ProductItem {
  id: number;
  name: string;
  price: string;
}


// 2. 개발 편의를 위한 헬퍼 변수 및 함수
// 이 값을 false로 바꾸면 실제 서버와 연동됩니다
const USE_MOCK = true; 

// 실제 서버처럼 응답 지연(로딩) 현상 만드는 delay 함수
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


// 3. 실제 API 호출 함수 (통신 비즈니스 로직)
// AI 분석 매칭 리포트 결과 데이터를 가져오는 함수입니다.
export const getMatchingReport = async (): Promise<ProductItem[]> => {
  
  // A. 가짜데이터 사용
  if (USE_MOCK) {
    await delay(1500); //로딩 UI 테스트용
    return [
      { id: 1, name: '오버핏 셔츠', price: '₩28,900' },
      { id: 2, name: '루즈핏 셔츠', price: '₩32,000' }
    ];
  }

  // B. 실제 서버 통신 
  const response = await api.get<ProductItem[]>('/api/matching/report');
  return response.data;
};