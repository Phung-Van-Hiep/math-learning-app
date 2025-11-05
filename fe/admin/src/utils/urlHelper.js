/**
 * URL Helper - Normalize image and video URLs
 */

/**
 * Get the base URL for the API
 * Removes /api suffix if present
 */
export const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9532/api';
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Get the default thumbnail URL
 * @returns {string} - The default thumbnail URL
 */
export const getDefaultThumbnail = () => {
  const baseURL = getBaseURL();
  return `${baseURL}/default/thumbnail.png`;
};

/**
 * Normalize media URL to ensure it points to the correct location
 * Handles both relative and absolute URLs
 *
 * @param {string} url - The URL to normalize
 * @returns {string} - The normalized URL
 */
export const normalizeMediaURL = (url) => {
  if (!url) return '';

  // If it's already a full external URL (http://, https://, //), return as is
  if (url.match(/^(https?:)?\/\//)) {
    // Fix URLs that incorrectly include /api in the path
    url = url.replace(/\/api\/uploads\//, '/uploads/');
    return url;
  }

  // If it's a relative URL, prepend the base URL
  const baseURL = getBaseURL();

  // Remove any /api prefix from the relative URL
  url = url.replace(/^\/api\//, '/');

  // Ensure the URL starts with /
  if (!url.startsWith('/')) {
    url = '/' + url;
  }

  return `${baseURL}${url}`;
};

/**
 * Check if a URL is a valid media URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidMediaURL = (url) => {
  if (!url) return false;

  // Check if it's a valid URL format
  try {
    // If it starts with http or https, validate as URL
    if (url.match(/^https?:\/\//)) {
      new URL(url);
      return true;
    }
    // If it's a relative URL, check if it has a valid path format
    return url.startsWith('/');
  } catch (e) {
    return false;
  }
};

/**
 * Get thumbnail URL with default fallback
 * @param {string} thumbnail - The thumbnail URL (can be null/empty)
 * @returns {string} - The thumbnail URL or default thumbnail
 */
export const getThumbnailURL = (thumbnail) => {
  if (!thumbnail || thumbnail.trim() === '') {
    return getDefaultThumbnail();
  }
  return normalizeMediaURL(thumbnail);
};
