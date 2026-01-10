import apiClient from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
  disableDemo,
  enableDemo,
  getDemoUser,
  isDemoEnabled,
  updateDemoUser
} from '../utils/demoStore';

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
  recoveryCode?: string;
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

export interface ResetPasswordPayload {
  email: string;
  recoveryCode: string;
  newPassword: string;
}

class AuthService {
  startDemo(): User {
    return enableDemo();
  }

  stopDemo(): void {
    disableDemo();
  }

  isDemoMode(): boolean {
    return isDemoEnabled();
  }

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
    disableDemo();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (isDemoEnabled()) {
      return getDemoUser();
    }
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  // Get current token
  getToken(): string | null {
    if (isDemoEnabled()) {
      return 'demo-token';
    }
    return localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (isDemoEnabled()) {
      return true;
    }
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Verify token with server
  async verifyToken(): Promise<User> {
    if (isDemoEnabled()) {
      const user = getDemoUser();
      if (!user) {
        throw new Error('Demo session expired');
      }
      return user;
    }
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
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
    if (isDemoEnabled()) {
      const user = getDemoUser();
      if (!user) {
        throw new Error('Demo session expired');
      }
      return user;
    }
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
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
    if (isDemoEnabled()) {
      return updateDemoUser({ name: data.name });
    }
    try {
      const response = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, data);
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
    if (isDemoEnabled()) {
      return;
    }
    try {
      await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  async resetPassword(data: ResetPasswordPayload): Promise<void> {
    if (isDemoEnabled()) {
      throw new Error('Demo mode does not support password reset');
    }
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
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
