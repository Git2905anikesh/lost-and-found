import axios from 'axios';

// Create a custom axios instance
// This ensures every API call we make points to our backend automatically using the Vite Env Variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Add an "interceptor" to automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // 1. Look for the token in localStorage
    const token = localStorage.getItem('token');
    
    // 2. If we have a token, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
