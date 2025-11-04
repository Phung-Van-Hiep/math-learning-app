import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9532/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Admin Auth APIs
export const adminAuthAPI = {
  login: (credentials) => api.post('/admin/auth/login', credentials),
  logout: () => api.post('/admin/auth/logout'),
  verifyToken: () => api.get('/admin/auth/verify'),
}

// Admin Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getRecentActivity: () => api.get('/admin/dashboard/activity'),
  getRecentFeedback: () => api.get('/admin/dashboard/feedback'),
}

// Introduction Management APIs
export const introductionAPI = {
  get: () => api.get('/admin/introduction'),
  update: (data) => api.put('/admin/introduction', data),
  uploadImage: (formData) => api.post('/admin/introduction/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// Video Management APIs
export const videoAPI = {
  getAll: () => api.get('/admin/videos'),
  getById: (id) => api.get(`/admin/videos/${id}`),
  create: (data) => api.post('/admin/videos', data),
  update: (id, data) => api.put(`/admin/videos/${id}`, data),
  delete: (id) => api.delete(`/admin/videos/${id}`),
  upload: (formData) => api.post('/admin/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// Content Management APIs
export const contentAPI = {
  getAll: () => api.get('/admin/content'),
  getById: (id) => api.get(`/admin/content/${id}`),
  create: (data) => api.post('/admin/content', data),
  update: (id, data) => api.put(`/admin/content/${id}`, data),
  delete: (id) => api.delete(`/admin/content/${id}`),
}

// Interactive Management APIs
export const interactiveAPI = {
  getAll: () => api.get('/admin/interactive'),
  create: (data) => api.post('/admin/interactive', data),
  update: (id, data) => api.put(`/admin/interactive/${id}`, data),
  delete: (id) => api.delete(`/admin/interactive/${id}`),
}

// Assessment Management APIs
export const assessmentAPI = {
  getAll: () => api.get('/admin/assessments'),
  getById: (id) => api.get(`/admin/assessments/${id}`),
  create: (data) => api.post('/admin/assessments', data),
  update: (id, data) => api.put(`/admin/assessments/${id}`, data),
  delete: (id) => api.delete(`/admin/assessments/${id}`),
  getResults: (assessmentId) => api.get(`/admin/assessments/${assessmentId}/results`),
  exportResults: (assessmentId) => api.get(`/admin/assessments/${assessmentId}/export`),
}

// Feedback Management APIs
export const feedbackAPI = {
  getAll: (params) => api.get('/admin/feedback', { params }),
  getById: (id) => api.get(`/admin/feedback/${id}`),
  reply: (id, message) => api.post(`/admin/feedback/${id}/reply`, { message }),
  markAsRead: (id) => api.put(`/admin/feedback/${id}/read`),
  updateFAQ: (data) => api.put('/admin/feedback/faq', data),
  updateContactInfo: (data) => api.put('/admin/feedback/contact', data),
}

export default api
