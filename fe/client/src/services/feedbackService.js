/**
 * Feedback Service
 */
import api from './api';

const feedbackService = {
  /**
   * Create or update feedback for a lesson
   * @param {number} lessonId
   * @param {number} rating - 1-5 stars
   * @param {string} comment - Optional comment
   * @returns {Promise<Object>}
   */
  async createFeedback(lessonId, rating, comment = '') {
    const response = await api.post('/feedback/', {
      lesson_id: lessonId,
      rating,
      comment
    });
    return response.data;
  },

  /**
   * Get all my feedback
   * @param {number} lessonId - Optional lesson filter
   * @returns {Promise<Array>}
   */
  async getMyFeedback(lessonId = null) {
    const params = lessonId ? { lesson_id: lessonId } : {};
    const response = await api.get('/feedback/my-feedback', { params });
    return response.data;
  },

  /**
   * Get feedback for a lesson
   * @param {number} lessonId
   * @returns {Promise<Array>}
   */
  async getLessonFeedback(lessonId) {
    const response = await api.get(`/feedback/lesson/${lessonId}`);
    return response.data;
  },

  /**
   * Update feedback
   * @param {number} feedbackId
   * @param {number} rating
   * @param {string} comment
   * @returns {Promise<Object>}
   */
  async updateFeedback(feedbackId, rating, comment) {
    const response = await api.put(`/feedback/${feedbackId}`, {
      rating,
      comment
    });
    return response.data;
  },

  /**
   * Delete feedback
   * @param {number} feedbackId
   * @returns {Promise<void>}
   */
  async deleteFeedback(feedbackId) {
    await api.delete(`/feedback/${feedbackId}`);
  }
};

export default feedbackService;
