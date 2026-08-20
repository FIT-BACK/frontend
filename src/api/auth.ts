import { api as axiosInstance } from './axiosInstance';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post('/api/v1/auth/login', credentials);
  return response.data;
};

/** POST /api/v1/auth/token/refresh - 리프레시 토큰으로 액세스 토큰 재발급 */
export const refreshTokenAPI = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  // 백엔드가 쿠키로 리프레시 토큰을 관리한다면 body나 headers가 다를 수 있습니다.
  const response = await axiosInstance.post('/api/v1/auth/token/refresh', { refreshToken });
  return response.data;
};

/** POST /api/v1/auth/password-reset/request - 가입 이메일로 재설정 링크 전송 */
export const requestPasswordReset = async (email: string) => {
  const response = await axiosInstance.post('/api/v1/auth/password-reset/request', { email });
  return response.data;
};

export interface PasswordResetPayload {
  resetToken: string;
  newPassword: string;
}

/** PATCH /api/v1/auth/password-reset - 이메일로 받은 토큰으로 새 비밀번호 설정 */
export const resetPassword = async ({ resetToken, newPassword }: PasswordResetPayload) => {
  const response = await axiosInstance.patch('/api/v1/auth/password-reset', { resetToken, newPassword });
  return response.data;
};