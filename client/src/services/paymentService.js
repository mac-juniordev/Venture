import api from './api';

export const paymentService = {
  payWithCard: (data) => api.post('/payments/card', data),
  payWithMtnMoney: (data) => api.post('/payments/mtn-money', data),
  payWithOrangeMoney: (data) => api.post('/payments/orange-money', data),
  getHistory: () => api.get('/payments/history'),
};