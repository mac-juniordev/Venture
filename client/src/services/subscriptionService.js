import api from './api';

export const subscriptionService = {
  getPlans: () => api.get('/subscription/plans'),
  getMySubscription: () => api.get('/subscription/my'),
  updateSubscription: (data) => api.put('/subscription/update', data),
  cancelSubscription: () => api.post('/subscription/cancel'),
};