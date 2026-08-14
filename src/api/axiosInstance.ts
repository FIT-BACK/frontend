import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 요청 시마다 Access Token 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 발생 시 토큰 재발급 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 아직 재시도를 안 한 경우에만 실행
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        // 리프레시 토큰마저 없으면 바로 로그인 창으로
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // 1. 토큰 재발급 요청 (순환 참조 방지를 위해 기본 axios 사용 혹은 별도 인스턴스 사용 가능)
        const response = await axios.post(`${BASE_URL}/api/v1/auth/token/refresh`, {
          refreshToken,
        });

        // 서버 응답 구조에 맞게 새 토큰 저장 (예: response.data.data.accessToken)
        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // 2. 원래 하려던 요청의 헤더를 새 토큰으로 교체
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 3. 실패했던 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        // 재발급 실패 시 (리프레시 토큰도 만료된 경우 등)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);