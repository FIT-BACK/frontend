// src/api/auth.ts
import { api as axiosInstance } from './axiosInstance';

/**
 * 인증(Auth) 관련 API 통신 함수
 */

// 로그인 요청 함수
export const loginUser = async (credentials: any) => {
  const response = await axiosInstance.post('/api/v1/auth/login', credentials);
  return response.data;
};