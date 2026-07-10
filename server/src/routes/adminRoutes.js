import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import {
  getDashboard,
  getNotificationsList,
  markNotificationRead,
  getBuilders,
  getBuilderDetail,
  suspendBuilder,
  restoreBuilder,
  deleteBuilder,
  adminGetChallenges,
  adminCreateChallenge,
  adminUpdateChallenge,
  adminDeleteChallenge,
  adminGetAchievements,
  adminCreateAchievement,
  adminUpdateAchievement,
  adminDeleteAchievement,
  adminGetMotivations,
  adminCreateMotivation,
  adminUpdateMotivation,
  adminDeleteMotivation,
  adminGetCampaigns,
  adminCreateCampaign,
  adminUpdateCampaign,
  adminDeleteCampaign,
  adminGetAnnouncements,
  adminCreateAnnouncement,
  adminUpdateAnnouncement,
  adminDeleteAnnouncement,
  getAnalytics,
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require authentication AND admin role
router.use(protect);
router.use(adminOnly);

// Dashboard
router.get('/dashboard', getDashboard);

// System Pulse (Notifications)
router.get('/notifications', getNotificationsList);
router.put('/notifications/:id/read', markNotificationRead);

// Builders
router.get('/builders', getBuilders);
router.get('/builders/:id', getBuilderDetail);
router.put('/builders/:id/suspend', suspendBuilder);
router.put('/builders/:id/restore', restoreBuilder);
router.delete('/builders/:id', deleteBuilder);

// Challenges
router.get('/challenges', adminGetChallenges);
router.post('/challenges', adminCreateChallenge);
router.put('/challenges/:id', adminUpdateChallenge);
router.delete('/challenges/:id', adminDeleteChallenge);

// Achievements
router.get('/achievements', adminGetAchievements);
router.post('/achievements', adminCreateAchievement);
router.put('/achievements/:id', adminUpdateAchievement);
router.delete('/achievements/:id', adminDeleteAchievement);

// Motivation
router.get('/motivations', adminGetMotivations);
router.post('/motivations', adminCreateMotivation);
router.put('/motivations/:id', adminUpdateMotivation);
router.delete('/motivations/:id', adminDeleteMotivation);

// Campaigns
router.get('/campaigns', adminGetCampaigns);
router.post('/campaigns', adminCreateCampaign);
router.put('/campaigns/:id', adminUpdateCampaign);
router.delete('/campaigns/:id', adminDeleteCampaign);

// Announcements
router.get('/announcements', adminGetAnnouncements);
router.post('/announcements', adminCreateAnnouncement);
router.put('/announcements/:id', adminUpdateAnnouncement);
router.delete('/announcements/:id', adminDeleteAnnouncement);

// Analytics
router.get('/analytics', getAnalytics);

export default router;