import api from './api';

export const authService = {
  register: (email, password) => {
    return api.post('/auth/register', { email, password });
  },

  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  getMe: () => {
    return api.get('/auth/me');
  },

  logout: () => {
    return api.post('/auth/logout');
  },
};