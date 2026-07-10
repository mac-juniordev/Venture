import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/ui/Spinner';
import AppLayout from './components/layout/AppLayout';
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
import ChallengeDetailPage from './pages/challenges/ChallengeDetailPage';
import MyChallengesPage from './pages/challenges/MyChallengesPage';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import AchievementsPage from './pages/achievements/AchievementsPage';
import CommunityPage from './pages/community/CommunityPage';
import UpgradePage from './pages/upgrade/UpgradePage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const LandingRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          <LandingRoute>
            <LandingPage />
          </LandingRoute>
        }
      />
      
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes with AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username" element={<PublicProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
        <Route path="/my-challenges" element={<MyChallengesPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/upgrade" element={<UpgradePage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;