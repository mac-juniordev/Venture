import api from './api';

export const challengeService = {
  createChallenge: (data) => api.post('/challenges', data),
  getChallenges: (params) => api.get('/challenges', { params }),
  getChallenge: (id) => api.get(`/challenges/${id}`),
  joinChallenge: (id) => api.post(`/challenges/${id}/join`),
  getMyChallenges: () => api.get('/challenges/my'),
};