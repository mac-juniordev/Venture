import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/ui/Spinner';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import PublicProfilePage from './pages/profile/PublicProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import CheckInPage from './pages/growth/CheckInPage';
import TimelinePage from './pages/growth/TimelinePage';
import ChallengesPage from './pages/challenges/ChallengesPage';
import CreateChallengePage from './pages/challenges/CreateChallengePage';
import ChallengeDetailPage from './pages/challenges/ChallengeDetailPage';
import MyChallengesPage from './pages/challenges/MyChallengesPage';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import AchievementsPage from './pages/achievements/AchievementsPage';
import CommunityPage from './pages/community/CommunityPage';
import UpgradePage from './pages/upgrade/UpgradePage';
import ArchitectLoginPage from './pages/admin/ArchitectLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBuildersPage from './pages/admin/AdminBuildersPage';
import AdminChallengesPage from './pages/admin/AdminChallengesPage';
import AdminAchievementsPage from './pages/admin/AdminAchievementsPage';
import AdminMotivationsPage from './pages/admin/AdminMotivationsPage';
import AdminCampaignsPage from './pages/admin/AdminCampaignsPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import { Settings } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"><Spinner size="lg" /></div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"><Spinner size="lg" /></div>;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const LandingRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"><Spinner size="lg" /></div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-100 dark:bg-[#060a13] flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!isAuthenticated) return <Navigate to="/architect/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingRoute><LandingPage /></LandingRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/architect/login" element={<ArchitectLoginPage />} />

      {/* Builder Protected Routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username" element={<PublicProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/challenges/create" element={<CreateChallengePage />} />
        <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
        <Route path="/my-challenges" element={<MyChallengesPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/upgrade" element={<UpgradePage />} />
      </Route>

      {/* Architect Protected Routes */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/architect" element={<AdminDashboardPage />} />
        <Route path="/architect/profile" element={<AdminProfilePage />} />
        <Route path="/architect/builders" element={<AdminBuildersPage />} />
        <Route path="/architect/challenges" element={<AdminChallengesPage />} />
        <Route path="/architect/achievements" element={<AdminAchievementsPage />} />
        <Route path="/architect/motivations" element={<AdminMotivationsPage />} />
        <Route path="/architect/campaigns" element={<AdminCampaignsPage />} />
        <Route path="/architect/announcements" element={<AdminAnnouncementsPage />} />
        <Route path="/architect/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/architect/notifications" element={<AdminNotificationsPage />} />
        <Route path="/architect/settings" element={
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
            <div className="bg-white dark:bg-[#0a0f1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
              <Settings className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Platform settings coming soon.</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Configure branding, features, and platform defaults.</p>
            </div>
          </div>
        } />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;