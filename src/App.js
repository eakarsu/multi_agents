import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Landing page components
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Problem from './components/Problem/Problem';
import CraftAgents from './components/CraftAgents/CraftAgents';
import Hybrid from './components/Hybrid/Hybrid';
import ROI from './components/ROI/ROI';
import Pricing from './components/Pricing/Pricing';
import Integration from './components/Integration/Integration';
import Demo from './components/Demo/Demo';
import Trust from './components/Trust/Trust';
import CTA from './components/CTA/CTA';

// Auth pages
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ChangePassword from './components/Auth/ChangePassword';
import Profile from './components/Auth/Profile';

// Dashboard
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './components/Dashboard/Dashboard';

// Entity pages
import UsersPage from './components/Pages/UsersPage';
import AgentsPage from './components/Pages/AgentsPage';
import TasksPage from './components/Pages/TasksPage';
import TemplatesPage from './components/Pages/TemplatesPage';
import ConversationsPage from './components/Pages/ConversationsPage';
import ReportsPage from './components/Pages/ReportsPage';
import IntegrationsPage from './components/Pages/IntegrationsPage';
import NotificationsPage from './components/Pages/NotificationsPage';
import DebatePage from './components/Pages/DebatePage';

function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      <main>
        <Hero />
        <Problem />
        <CraftAgents />
        <Hybrid />
        <ROI />
        <Pricing />
        <Integration />
        <Demo />
        <Trust />
        <CTA />
      </main>
    </Box>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected dashboard routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="conversations" element={<ConversationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
