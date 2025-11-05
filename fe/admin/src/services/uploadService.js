/**
 * Upload Service - Handle file uploads
 */
import api from './api';

// Get base URL without /api suffix for static files
const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9532/api';
  // Remove /api suffix if present
  return apiUrl.replace(/\/api$/, '');
};

const BASE_URL = getBaseURL();

const uploadService = {
  /**
   * Upload an image file
   * @param {File} file - Image file to upload
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Upload result with URL
   */
  async uploadImage(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });

    // Return full URL (BASE_URL already excludes /api)
    return {
      ...response.data,
      url: `${BASE_URL}${response.data.url}`,
    };
  },

  /**
   * Upload a video file
   * @param {File} file - Video file to upload
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Upload result with URL
   */
  async uploadVideo(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });

    // Return full URL (BASE_URL already excludes /api)
    return {
      ...response.data,
      url: `${BASE_URL}${response.data.url}`,
    };
  },

  /**
   * Delete an uploaded file
   * @param {string} fileType - 'images' or 'videos'
   * @param {string} filename - File name to delete
   * @returns {Promise<Object>}
   */
  async deleteFile(fileType, filename) {
    const response = await api.delete(`/upload/${fileType}/${filename}`);
    return response.data;
  },
};

export default uploadService;
