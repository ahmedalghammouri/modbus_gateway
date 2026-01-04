// Dynamic API configuration that works with remote access
const getApiBaseUrl = () => {
  // Use current window location for remote access
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  // Default to port 8000 for the backend
  const port = '8000';
  
  return `${protocol}//${hostname}:${port}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, options);
};