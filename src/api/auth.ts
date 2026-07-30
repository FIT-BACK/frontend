import { api as axiosInstance } from './axiosInstance';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post('/api/v1/auth/login', credentials);
  return response.data;
};