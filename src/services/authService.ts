import { User } from '../types';
import { apiService } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },

  register: async (userData: RegisterData): Promise<User> => {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiService.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};