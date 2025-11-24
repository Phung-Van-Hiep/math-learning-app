/**
 * Admin Service - Manage Admin APIs
 */
import api from './api';

const adminService = {
  // ----- STUDENT MANAGEMENT -----
  async getStudents() {
    const response = await api.get('/admin/students');
    return response.data;
  },
  async createStudent(studentData) {
    const response = await api.post('/admin/students', studentData);
    return response.data;
  },
  async updateStudent(studentId, studentData) {
    const response = await api.put(`/admin/students/${studentId}`, studentData);
    return response.data;
  },
  async deleteStudent(studentId) {
    await api.delete(`/admin/students/${studentId}`);
  },

  // ----- ACADEMIC RESULTS -----
  async getLessonProgress() {
    const response = await api.get('/admin/results/lesson-progress');
    return response.data;
  },
  async getQuizAttempts() {
    const response = await api.get('/admin/results/quiz-attempts');
    return response.data;
  },

  // ----- FEEDBACK MANAGEMENT -----
  async getFeedback() {
    const response = await api.get('/admin/feedback');
    return response.data;
  },
  async markFeedbackRead(feedbackId) {
    const response = await api.patch(`/admin/feedback/${feedbackId}/read`);
    return response.data;
  },
  async deleteFeedback(feedbackId) {
    await api.delete(`/admin/feedback/${feedbackId}`);
  },

  // ----- SETTINGS -----
  async getSettings() {
    const response = await api.get('/admin/settings');
    return response.data;
  },
  async updateSettings(settingsData) {
    const response = await api.put('/admin/settings', settingsData);
    return response.data;
  },
  async changePassword(passwordData) {
    const response = await api.post('/admin/settings/change-password', passwordData);
    return response.data;
  }
};

export default adminService;