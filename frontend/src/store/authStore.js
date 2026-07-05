import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  error: null,

  initialize: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/auth/me');
        set({ user: response.data.user, isLoading: false });
      } catch (error) {
        localStorage.removeItem('token');
        set({ user: null, token: null, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: async (credentials) => {
    try {
      set({ error: null });
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, token });
      return user;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed' });
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ error: null });
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, token });
      return user;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed' });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  registerPharmacy: async (data) => {
    try {
      set({ error: null });
      const response = await api.post('/auth/register-pharmacy', data);
      // Update user role after pharmacy registration
      const userResponse = await api.get('/auth/me');
      set({ user: userResponse.data.user });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed' });
      throw error;
    }
  },

  sendVerificationEmail: async () => {
    try {
      await api.post('/auth/email/verification-notification');
      return true;
    } catch (error) {
      console.error('Send verification email error:', error);
      return false;
    }
  },

  clearError: () => set({ error: null }),

  // Helper functions
  isAuthenticated: () => !!get().user,
  isAdmin: () => get().user?.role === 'super_admin',
  isPharmacyOwner: () => get().user?.role === 'pharmacy_owner',
  isPharmacyStaff: () => get().user?.role === 'pharmacy_staff',
  isCustomer: () => get().user?.role === 'customer',
  isEmailVerified: () => !!get().user?.email_verified_at,
}));

export default useAuthStore;
