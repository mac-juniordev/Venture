import api from './api';

export const growthService = {
  checkIn: (data) => {
    return api.post('/growth/check-in', data);
  },

  getTodayStatus: () => {
    return api.get('/growth/today');
  },

  getGrowthHistory: (page = 1) => {
    return api.get(`/growth/history?page=${page}&limit=30`);
  },
};