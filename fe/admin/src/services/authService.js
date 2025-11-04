/**
 * Authentication Service
 */
import api from './api';

const authService = {
  /**
   * Login user
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{access_token, user}>}
   */
  async login(username, password) {
    const response = await api.post('/auth/login', {
      username,
      password,
    });

    const { access_token, user } = response.data;

    // Store token and user in localStorage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  },

  /**
   * Register new user
   * @param {Object} userData
   * @returns {Promise<User>}
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user info
   * @returns {Promise<User>}
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Verify token
   * @returns {Promise<boolean>}
   */
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get stored user from localStorage
   * @returns {User|null}
   */
  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Get stored token from localStorage
   * @returns {string|null}
   */
  getStoredToken() {
    return localStorage.getItem('access_token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getStoredToken();
  },
};

export default authService;
