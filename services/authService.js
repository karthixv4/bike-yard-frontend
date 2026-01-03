import { apiClient } from './apiClient';

// Mock delay to simulate network latency for demo purposes
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials) => {
    // REPLACE with: return apiClient.post('/auth/login', credentials);
    const response = await apiClient.post('/auth/login', {
      email: credentials?.email,
      password: credentials?.password,
    });

    return response.data;
  },

  register: async (userData) => {
    console.log('register', userData);
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    // REPLACE with: return apiClient.post('/auth/logout');
    await delay(500);
    return true;
  },
  updateProfile: async (data) => {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },
};
