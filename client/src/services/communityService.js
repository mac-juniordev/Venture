import api from './api';

export const communityService = {
  getFeed: (page = 1) => api.get(`/community/feed?page=${page}`),
  addReaction: (data) => api.post('/community/react', data),
  getReactions: (targetType, targetId) => api.get(`/community/reactions/${targetType}/${targetId}`),
  addComment: (data) => api.post('/community/comment', data),
  getComments: (targetType, targetId) => api.get(`/community/comments/${targetType}/${targetId}`),
  deleteComment: (id) => api.delete(`/community/comment/${id}`),
};