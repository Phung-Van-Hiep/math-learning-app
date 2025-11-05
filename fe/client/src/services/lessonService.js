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
   * @param {Array<number>} completedSections - Optional array of completed section IDs
   * @param {number} timeSpent - Optional time spent in seconds
   * @returns {Promise<Object>}
   */
  async updateProgress(lessonId, progressPercentage, completedSections = null, timeSpent = null) {
    const params = {
      progress_percentage: progressPercentage
    };

    if (completedSections && completedSections.length > 0) {
      params.completed_sections = completedSections.join(',');
    }

    if (timeSpent !== null && timeSpent > 0) {
      params.time_spent = timeSpent;
    }

    const response = await api.post(`/lessons/${lessonId}/progress`, null, { params });
    return response.data;
  },

  /**
   * Get lesson with student progress
   * @param {string} slug - Lesson slug
   * @returns {Promise<Object>} Lesson with progress data
   */
  async getLessonWithProgress(slug) {
    try {
      // First get the lesson
      const lesson = await this.getLessonBySlug(slug);

      // Only fetch progress for students
      try {
        const lessonsWithProgress = await this.getMyLessons();
        const lessonWithProgress = lessonsWithProgress.find(l => l.id === lesson.id);

        // Merge the data
        if (lessonWithProgress) {
          return {
            ...lesson,
            progress: lessonWithProgress.progress || 0,
            is_completed: lessonWithProgress.is_completed || false,
            completed_sections: lessonWithProgress.completed_sections || []
          };
        }
      } catch (progressError) {
        // User is not a student or can't fetch progress, just return lesson
        console.log('Could not fetch progress (user might not be a student):', progressError.message);
      }

      // Return lesson without progress
      return {
        ...lesson,
        progress: 0,
        is_completed: false,
        completed_sections: []
      };
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
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
