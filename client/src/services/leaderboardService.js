import api from './api';

export const leaderboardService = {
  getGlobalLeaderboard: (type = 'streak') => api.get(`/leaderboard?type=${type}`),
  getChallengeLeaderboard: (challengeId) => api.get(`/leaderboard/challenge/${challengeId}`),
};