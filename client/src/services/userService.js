import api from './api';

export const userService = {
  getMyProfile: () => {
    return api.get('/users/profile');
  },

  updateProfile: (profileData) => {
    return api.put('/users/profile', profileData);
  },

  getPublicProfile: (username) => {
    return api.get(`/users/profile/${username}`);
  },

  updateSettings: (settingsData) => {
    return api.put('/users/settings', settingsData);
  },

  uploadAvatar: (formData) => {
    return api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};