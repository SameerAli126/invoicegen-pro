// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5002/api',
  
  // Timeout for API requests (30 seconds)
  TIMEOUT: 30000,
  
  // Default headers
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Clients
  CLIENTS: {
    BASE: '/clients',
    STATS: '/clients/stats',
    BY_ID: (id: string) => `/clients/${id}`,
    UPDATE_STATS: (id: string) => `/clients/${id}/update-stats`,
  },
  
  // Invoices
  INVOICES: {
    BASE: '/invoices',
    STATS: '/invoices/stats',
    BY_ID: (id: string) => `/invoices/${id}`,
    SEND: (id: string) => `/invoices/${id}/send`,
    MARK_PAID: (id: string) => `/invoices/${id}/mark-paid`,
  },
};

// Environment detection
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Debug logging for API configuration
if (IS_DEVELOPMENT) {
  console.log('🔧 API Configuration:', {
    BASE_URL: API_CONFIG.BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  });
}
