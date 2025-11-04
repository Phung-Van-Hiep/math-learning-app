import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9532/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  verifyToken: () => api.get('/auth/verify'),
}

// Student APIs
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  changePassword: (data) => api.put('/students/change-password', data),
  updateSettings: (data) => api.put('/students/settings', data),
  deleteAccount: () => api.delete('/students/account'),
}

// Content APIs
export const contentAPI = {
  getIntroduction: () => api.get('/content/introduction'),
  getVideos: () => api.get('/content/videos'),
  getVideoById: (id) => api.get(`/content/videos/${id}`),
  getMathContent: () => api.get('/content/math'),
  getInteractiveTools: () => api.get('/content/interactive'),
}

// Assessment APIs
export const assessmentAPI = {
  getAssessments: () => api.get('/assessments'),
  getAssessmentById: (id) => api.get(`/assessments/${id}`),
  submitAssessment: (id, answers) => api.post(`/assessments/${id}/submit`, answers),
  getResults: () => api.get('/assessments/results'),
  getResultById: (id) => api.get(`/assessments/results/${id}`),
}

// Assignment APIs
export const assignmentAPI = {
  getAssignments: (status) => api.get('/assignments', { params: { status } }),
  getAssignmentById: (id) => api.get(`/assignments/${id}`),
  saveProgress: (id, progress) => api.put(`/assignments/${id}/progress`, progress),
  deleteAssignment: (id) => api.delete(`/assignments/${id}`),
}

// Feedback APIs
export const feedbackAPI = {
  submitFeedback: (data) => api.post('/feedback', data),
  getFAQ: () => api.get('/feedback/faq'),
}

export default api
