import api from './api';

export const adminService = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),

  // Notifications
  getNotifications: (page, category) => api.get(`/admin/notifications?page=${page || 1}${category ? `&category=${category}` : ''}`),
  markNotificationRead: (id) => api.put(`/admin/notifications/${id}/read`),

  // Builders
  getBuilders: (params) => api.get('/admin/builders', { params }),
  getBuilderDetail: (id) => api.get(`/admin/builders/${id}`),
  suspendBuilder: (id) => api.put(`/admin/builders/${id}/suspend`),
  restoreBuilder: (id) => api.put(`/admin/builders/${id}/restore`),
  deleteBuilder: (id) => api.delete(`/admin/builders/${id}`),

  // Challenges
  getChallenges: () => api.get('/admin/challenges'),
  createChallenge: (data) => api.post('/admin/challenges', data),
  updateChallenge: (id, data) => api.put(`/admin/challenges/${id}`, data),
  deleteChallenge: (id) => api.delete(`/admin/challenges/${id}`),

  // Achievements
  getAchievements: () => api.get('/admin/achievements'),
  createAchievement: (data) => api.post('/admin/achievements', data),
  updateAchievement: (id, data) => api.put(`/admin/achievements/${id}`, data),
  deleteAchievement: (id) => api.delete(`/admin/achievements/${id}`),

  // Motivation
  getMotivations: () => api.get('/admin/motivations'),
  createMotivation: (data) => api.post('/admin/motivations', data),
  updateMotivation: (id, data) => api.put(`/admin/motivations/${id}`, data),
  deleteMotivation: (id) => api.delete(`/admin/motivations/${id}`),

  // Campaigns
  getCampaigns: () => api.get('/admin/campaigns'),
  createCampaign: (data) => api.post('/admin/campaigns', data),
  updateCampaign: (id, data) => api.put(`/admin/campaigns/${id}`, data),
  deleteCampaign: (id) => api.delete(`/admin/campaigns/${id}`),

  // Announcements
  getAnnouncements: () => api.get('/admin/announcements'),
  createAnnouncement: (data) => api.post('/admin/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/admin/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`),

  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),
};