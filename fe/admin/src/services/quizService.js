/**
 * Quiz Service - Handles all quiz-related API calls
 */
import api from './api';

const quizService = {
  // --- ADMIN METHODS (Quản lý) ---

  /**
   * Lấy danh sách quizzes (thường dùng cho Admin để quản lý)
   * Có thể lọc theo lesson_id
   */
  async getAllQuizzes(lessonId = null) {
    const params = lessonId ? { lesson_id: lessonId } : {};
    const response = await api.get('/quizzes/', { params });
    return response.data;
  },

  /**
   * Tạo bài kiểm tra mới
   */
  async createQuiz(quizData) {
    const response = await api.post('/quizzes/', quizData);
    return response.data;
  },

  /**
   * Cập nhật bài kiểm tra
   */
  async updateQuiz(quizId, quizData) {
    const response = await api.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  },

  /**
   * Xóa bài kiểm tra
   */
  async deleteQuiz(quizId) {
    const response = await api.delete(`/quizzes/${quizId}`);
    return response.data;
  },

  // --- STUDENT METHODS (Học sinh) ---

  /**
   * Lấy bài kiểm tra đang kích hoạt cho một bài học cụ thể
   * (Dùng cho QuizSection.jsx)
   */
  async getLessonQuiz(lessonId) {
    const response = await api.get(`/quizzes/lesson/${lessonId}`);
    return response.data;
  },

  /**
   * Lấy chi tiết một bài kiểm tra theo ID
   */
  async getQuizById(quizId) {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  /**
   * Nộp bài làm
   * @param {number} quizId 
   * @param {Object} submitData - { answers: {...}, time_spent: 120 }
   */
  async submitQuiz(quizId, submitData) {
    const response = await api.post(`/quizzes/${quizId}/submit`, submitData);
    return response.data;
  },

  /**
   * Lấy lịch sử làm bài của người dùng hiện tại
   */
  async getMyAttempts(quizId) {
    const response = await api.get(`/quizzes/${quizId}/attempts`);
    return response.data;
  }
};

export default quizService;