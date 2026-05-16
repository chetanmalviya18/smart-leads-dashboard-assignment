import { apiClient } from './api';
import { ApiResponse, AuthResponse } from '../types';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<{ user: AuthResponse['user'] }>>('/auth/me');
    return res.data;
  },

  getUsers: async () => {
    const res = await apiClient.get<ApiResponse<{ users: AuthResponse['user'][] }>>('/auth/users');
    return res.data;
  },
};
