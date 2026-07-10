import api from './api';

export const achievementService = {
  getMyAchievements: () => api.get('/achievements/my'),
  getAllAchievements: () => api.get('/achievements'),
  checkNewAchievements: () => api.post('/achievements/check'),
  getPublicAchievements: (userId) => api.get(`/achievements/user/${userId}`),
};