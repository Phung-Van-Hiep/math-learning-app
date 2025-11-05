/**
 * Quiz Service
 */
import api from './api';

const quizService = {
  /**
   * Get quiz for a lesson (student view - no correct answers shown)
   * @param {number} lessonId
   * @returns {Promise<Quiz>}
   */
  async getLessonQuiz(lessonId) {
    const response = await api.get(`/quizzes/lesson/${lessonId}/quiz`);
    return response.data;
  },

  /**
   * Submit quiz answers
   * @param {number} quizId
   * @param {Object} submitData - { answers: {questionId: answerId}, time_spent: number }
   * @returns {Promise<QuizSubmitResponse>}
   */
  async submitQuiz(quizId, submitData) {
    const response = await api.post(`/quizzes/${quizId}/submit`, submitData);
    return response.data;
  },

  /**
   * Get all quiz attempts for current user
   * @param {number} quizId - Optional: filter by quiz
   * @returns {Promise<QuizAttempt[]>}
   */
  async getMyAttempts(quizId = null) {
    const params = quizId ? { quiz_id: quizId } : {};
    const response = await api.get('/quizzes/attempts/my-attempts', { params });
    return response.data;
  },

  /**
   * Get specific attempt details
   * @param {number} attemptId
   * @returns {Promise<QuizAttempt>}
   */
  async getAttempt(attemptId) {
    const response = await api.get(`/quizzes/attempts/${attemptId}`);
    return response.data;
  },

  /**
   * Get best attempt for a quiz
   * @param {number} quizId
   * @returns {Promise<QuizAttempt>}
   */
  async getBestAttempt(quizId) {
    const response = await api.get(`/quizzes/${quizId}/best-attempt`);
    return response.data;
  },

  // Admin/Teacher endpoints

  /**
   * Create a new quiz (admin/teacher only)
   * @param {Object} quizData
   * @returns {Promise<Quiz>}
   */
  async createQuiz(quizData) {
    const response = await api.post('/quizzes/', quizData);
    return response.data;
  },

  /**
   * Get all quizzes (admin/teacher only)
   * @param {number} lessonId - Optional: filter by lesson
   * @returns {Promise<Quiz[]>}
   */
  async getAllQuizzes(lessonId = null) {
    const params = lessonId ? { lesson_id: lessonId } : {};
    const response = await api.get('/quizzes/', { params });
    return response.data;
  },

  /**
   * Get quiz by ID with correct answers (admin/teacher only)
   * @param {number} quizId
   * @returns {Promise<Quiz>}
   */
  async getQuizById(quizId) {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  /**
   * Update quiz (admin/teacher only)
   * @param {number} quizId
   * @param {Object} quizData
   * @returns {Promise<Quiz>}
   */
  async updateQuiz(quizId, quizData) {
    const response = await api.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  },

  /**
   * Delete quiz (admin/teacher only)
   * @param {number} quizId
   * @returns {Promise<void>}
   */
  async deleteQuiz(quizId) {
    await api.delete(`/quizzes/${quizId}`);
  },
};

export default quizService;
