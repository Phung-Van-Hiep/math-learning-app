/**
 * Settings Service
 */
import api from './api';

const settingsService = {
  /**
   * Update user profile settings
   * @param {Object} settings - { full_name, email, grade, class_name }
   * @returns {Promise<Object>}
   */
  async updateSettings(settings) {
    const response = await api.put('/auth/settings', settings);
    return response.data;
  },

  /**
   * Change password
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<Object>}
   */
  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  },

  /**
   * Get current user info
   * @returns {Promise<Object>}
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default settingsService;
