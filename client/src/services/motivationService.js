import api from './api';

export const motivationService = {
  getDailyMotivation: () => api.get('/motivation/daily'),
  getMotivations: (category) => api.get('/motivation', { params: { category } }),
};