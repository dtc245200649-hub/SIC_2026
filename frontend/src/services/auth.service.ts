import api from './api';
import { LoginPayload, RegisterPayload, TokenResponse, User } from '../types/auth.types';

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const response = await api.post<User>('/auth/register', payload);
    return response.data;
  },

  async login(payload: LoginPayload): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/auth/login', payload);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user_info', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    localStorage.setItem('user_info', JSON.stringify(response.data));
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Bỏ qua lỗi server khi logout
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user_info');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
