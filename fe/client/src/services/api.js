/**
 * API Configuration and Axios Instance
 */
import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9532/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Lấy URL của yêu cầu bị lỗi
    const originalRequestUrl = error.config.url;

    if (error.response?.status === 401) {
      // ⚠️ CHỈ REDIRECT NẾU KHÔNG PHẢI LÀ YÊU CẦU ĐĂNG NHẬP
      if (!originalRequestUrl.includes('/auth/login')) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Nếu là yêu cầu đăng nhập, cho phép lỗi (Promise.reject(error)) 
      // được đẩy lên để AuthContext.jsx xử lý.
    }
    return Promise.reject(error);
  }
);

export default api;
