import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Types for our API responses
export interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - automatically add auth token and handle common headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if this is a Supabase function call
    const isSupabaseCall = config.url?.includes('.supabase.co/functions/v1/');
    
    if (isSupabaseCall) {
      // For Supabase calls, use Supabase session token if available
      const supabaseToken = (window as any).supabaseSession?.access_token;
      if (supabaseToken && config.headers) {
        config.headers.Authorization = `Bearer ${supabaseToken}`;
      }
    } else {
      // For our own API calls, use JWT token from localStorage
      const token = localStorage.getItem('token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Initialize token if environment variable exists
      const envToken = import.meta.env.VITE_ACCESS_TOKEN;
      if (envToken && !token && config.headers) {
        localStorage.setItem('token', envToken);
        config.headers.Authorization = `Bearer ${envToken}`;
      }
    }

    // Log request for development
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_LOGS === 'true') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle common response patterns and errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Log response for development
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_LOGS === 'true') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError): Promise<ApiError> => {
    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Extract error message from response
      if (data && typeof data === 'object') {
        const errorData = data as any;
        apiError.message = 
          errorData.detail || 
          errorData.message || 
          errorData.error || 
          `API call failed: ${status} ${error.response.statusText}`;
      } else {
        apiError.message = `API call failed: ${status} ${error.response.statusText}`;
      }

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear all auth data and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('checkUserResponse');
          apiError.message = 'Session expired. Please login again.';
          // Redirect to login page
          window.location.href = '/';
          break;
        case 403:
          apiError.message = 'You don\'t have permission to perform this action.';
          break;
        case 404:
          apiError.message = 'The requested resource was not found.';
          break;
        case 422:
          // Validation errors
          const errorData = data as any;
          if (errorData.detail && Array.isArray(errorData.detail)) {
            apiError.message = errorData.detail.map((err: any) => err.msg || err.message).join(', ');
          }
          break;
        case 500:
          apiError.message = 'Internal server error. Please try again later.';
          break;
        default:
          // Keep the extracted message
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      apiError.message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      apiError.message = error.message || 'An unexpected error occurred.';
    }

    // Log error for development
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_LOGS === 'true') {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: apiError.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(apiError);
  }
);

// Helper function to handle API responses consistently
export const handleApiResponse = <T>(response: AxiosResponse<T>): ApiResponse<T> => {
  return {
    data: response.data,
    success: true,
    message: 'Request successful',
  };
};

// Helper function to handle API errors consistently
export const handleApiError = (error: ApiError): ApiResponse => {
  return {
    success: false,
    error: error.message,
    message: error.message,
  };
};

// Utility functions for common HTTP methods
export const api = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.get<T>(url, config);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error as ApiError);
    }
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post<T>(url, data, config);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error as ApiError);
    }
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.put<T>(url, data, config);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error as ApiError);
    }
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.patch<T>(url, data, config);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error as ApiError);
    }
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.delete<T>(url, config);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error as ApiError);
    }
  },

  // Upload file (FormData)
  upload: async <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post<T>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error as ApiError);
    }
  },
};

// Token management utilities
export const tokenUtils = {
  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Set token in localStorage
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('checkUserResponse');
  },

  // Initialize token from environment
  initializeToken: (): void => {
    const envToken = import.meta.env.VITE_ACCESS_TOKEN;
    if (envToken && !localStorage.getItem('token')) {
      localStorage.setItem('token', envToken);
    }
  },

  // Set Supabase session for interceptor
  setSupabaseSession: (session: any): void => {
    (window as any).supabaseSession = session;
  },

  // Clear Supabase session
  clearSupabaseSession: (): void => {
    (window as any).supabaseSession = null;
  },
};

// Supabase API utilities
export const supabaseApi = {
  // Make Supabase function call with session auth
  callFunction: async <T = any>(
    functionPath: string, 
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      data?: any;
      session?: any;
    } = {}
  ): Promise<ApiResponse<T>> => {
    const { method = 'GET', data, session } = options;
    
    // Set session for interceptor if provided
    if (session) {
      tokenUtils.setSupabaseSession(session);
    }
    
    // Get project ID from environment or default
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'defaultproject';
    const url = `https://${projectId}.supabase.co/functions/v1/${functionPath}`;
    
    try {
      let response: ApiResponse<T>;
      
      switch (method) {
        case 'POST':
          response = await api.post<T>(url, data);
          break;
        case 'PUT':
          response = await api.put<T>(url, data);
          break;
        case 'PATCH':
          response = await api.patch<T>(url, data);
          break;
        case 'DELETE':
          response = await api.delete<T>(url);
          break;
        default:
          response = await api.get<T>(url);
      }
      
      return response;
    } finally {
      // Clear session after request
      if (session) {
        tokenUtils.clearSupabaseSession();
      }
    }
  },
};

// Export the configured axios instance for advanced usage
export { axiosInstance };
export default api;