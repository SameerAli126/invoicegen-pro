import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, IS_DEVELOPMENT } from '../config/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor to add auth token and debug logging
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging in development
    if (IS_DEVELOPMENT) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (IS_DEVELOPMENT) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and debug logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Debug logging in development
    if (IS_DEVELOPMENT) {
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Debug logging in development
    if (IS_DEVELOPMENT) {
      console.error('❌ API Response Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network Error - Backend might be down:', {
        message: error.message,
        baseURL: API_CONFIG.BASE_URL,
      });
      
      // Show user-friendly error message
      const networkError = new Error(
        'Unable to connect to server. Please check your internet connection or try again later.'
      );
      return Promise.reject(networkError);
    }

    // Return the original error for other cases
    return Promise.reject(error);
  }
);

// Helper function to test API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    console.log('✅ API Connection Test Successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ API Connection Test Failed:', error);
    return false;
  }
};

// Helper function to get API status
export const getApiStatus = () => {
  return {
    baseURL: API_CONFIG.BASE_URL,
    isProduction: !IS_DEVELOPMENT,
    hasToken: !!localStorage.getItem('token'),
  };
};

export default apiClient;
