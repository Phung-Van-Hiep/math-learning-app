/**
 * Lesson Service
 */
import api from './api';

const lessonService = {
  /**
   * Get published lessons (for students)
   * @param {Object} params - Query parameters
   * @returns {Promise<Lesson[]>}
   */
  async getPublishedLessons(params = {}) {
    const response = await api.get('/lessons/published', { params });
    return response.data;
  },

  /**
   * Get lessons with progress (for logged-in students)
   * @param {Object} params - Query parameters
   * @returns {Promise<LessonWithProgress[]>}
   */
  async getMyLessons(params = {}) {
    const response = await api.get('/lessons/my-lessons', { params });
    return response.data;
  },

  /**
   * Get lesson by ID
   * @param {number} lessonId
   * @returns {Promise<Lesson>}
   */
  async getLessonById(lessonId) {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },

  /**
   * Get lesson by slug
   * @param {string} slug
   * @returns {Promise<Lesson>}
   */
  async getLessonBySlug(slug) {
    const response = await api.get(`/lessons/slug/${slug}`);
    return response.data;
  },

  /**
   * Update lesson progress
   * @param {number} lessonId
   * @param {number} progressPercentage - 0-100
   * @returns {Promise<Object>}
   */
  async updateProgress(lessonId, progressPercentage) {
    const response = await api.post(`/lessons/${lessonId}/progress`, null, {
      params: { progress_percentage: progressPercentage },
    });
    return response.data;
  },

  /**
   * Create lesson (admin/teacher only)
   * @param {Object} lessonData
   * @returns {Promise<Lesson>}
   */
  async createLesson(lessonData) {
    const response = await api.post('/lessons/', lessonData);
    return response.data;
  },

  /**
   * Update lesson (admin/teacher only)
   * @param {number} lessonId
   * @param {Object} lessonData
   * @returns {Promise<Lesson>}
   */
  async updateLesson(lessonId, lessonData) {
    const response = await api.put(`/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  /**
   * Delete lesson (admin/teacher only)
   * @param {number} lessonId
   * @returns {Promise<void>}
   */
  async deleteLesson(lessonId) {
    await api.delete(`/lessons/${lessonId}`);
  },

  /**
   * Get all lessons (admin/teacher only - includes unpublished)
   * @param {Object} params - Query parameters
   * @returns {Promise<Lesson[]>}
   */
  async getAllLessons(params = {}) {
    const response = await api.get('/lessons/', { params });
    return response.data;
  },
};

export default lessonService;
