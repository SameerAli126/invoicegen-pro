import apiClient from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'free' | 'premium';
  subscriptionStatus: string;
  invoiceCount: number;
  monthlyInvoiceLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  // Register new user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  // Get current token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Verify token with server
  async verifyToken(): Promise<User> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      const { user } = response.data;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  }

  // Get user profile
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
      const { user } = response.data;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }

  // Update user profile
  async updateProfile(data: { name: string }): Promise<User> {
    try {
      const response = await apiClient.put(API_ENDPOINTS.AUTH.ME, data);
      const { user } = response.data;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  // Change password
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    try {
      await apiClient.put('/auth/change-password', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  // Check if user is premium
  isPremium(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'premium' && user?.subscriptionStatus === 'active';
  }

  // Get user's invoice usage
  getInvoiceUsage(): { current: number; limit: number; canCreate: boolean } {
    const user = this.getCurrentUser();
    if (!user) {
      return { current: 0, limit: 0, canCreate: false };
    }

    const canCreate = user.role === 'premium' || user.invoiceCount < user.monthlyInvoiceLimit;
    
    return {
      current: user.invoiceCount,
      limit: user.monthlyInvoiceLimit,
      canCreate
    };
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
