import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    // 서버는 { success, code, message, data } 포맷으로 실패 사유를 message에 담아 내려준다.
    // 지금까지 여러 화면(AiWaitingPage/TagEditPage/LookbookUploadPage 등)이 err.message를
    // 그대로 화면에 보여주는데, 여기서 손대지 않으면 axios 기본 메시지("Request failed
    // with status code 409" 같은 영문 문구)가 뜨는 문제가 있었음 — 여기서 한 번만 고쳐서
    // err.message를 쓰는 모든 곳이 실제 서버 메시지를 받도록 함.
    const serverMessage = error.response?.data?.message;
    if (typeof serverMessage === 'string' && serverMessage.length > 0) {
      error.message = serverMessage;
    }
    return Promise.reject(error);
  }
);