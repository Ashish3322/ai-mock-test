import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Common Route Guards
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { McqPage } from './pages/public/McqPage';
import { InterviewQuestionsPage } from './pages/public/InterviewQuestionsPage';

// Student Pages
import { DashboardPage } from './pages/student/DashboardPage';
import { StartInterviewPage } from './pages/student/StartInterviewPage';
import { InterviewPage } from './pages/student/InterviewPage';
import { ReportPage } from './pages/student/ReportPage';
import { HistoryPage } from './pages/student/HistoryPage';
import { ProgressPage } from './pages/student/ProgressPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminQuestionsPage } from './pages/admin/AdminQuestionsPage';
import { AdminMcqPage } from './pages/admin/AdminMcqPage';
import { AdminRolesPage } from './pages/admin/AdminRolesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminInterviewsPage } from './pages/admin/AdminInterviewsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Layout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/questions" element={<InterviewQuestionsPage />} />
              <Route path="/interview-questions" element={<InterviewQuestionsPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/mcqs" element={<McqPage />} />
              <Route path="/mcq" element={<McqPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Student Protected Portal */}
            <Route element={<ProtectedRoute />}>
              <Route element={<StudentLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/start-interview" element={<StartInterviewPage />} />
                <Route path="/interview/:id" element={<InterviewPage />} />
                <Route path="/report/:id" element={<ReportPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Admin Protected Portal */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/questions" element={<AdminQuestionsPage />} />
                <Route path="/admin/mcqs" element={<AdminMcqPage />} />
                <Route path="/admin/roles" element={<AdminRolesPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/interviews" element={<AdminInterviewsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
