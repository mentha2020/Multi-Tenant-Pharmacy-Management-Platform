import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 if not during initial auth check
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      const isAuthRoute = error.config?.url?.includes('/auth/me') || 
                          error.config?.url?.includes('/auth/login') ||
                          error.config?.url?.includes('/auth/register');
      
      // If we have a token but /auth/me fails, clear it (token expired/invalid)
      if (token && error.config?.url?.includes('/auth/me')) {
        localStorage.removeItem('token');
      }
      
      // Don't redirect for auth check routes - let the store handle it
      // Only redirect for other 401 errors (protected routes)
      if (!isAuthRoute && token) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
