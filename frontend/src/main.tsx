import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';

import { AppLayout } from './components/AppLayout';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { QuizCategoriesPage } from './pages/QuizCategoriesPage';
import { QuizListingPage } from './pages/QuizListingPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';
import {
  LeaderboardPage,
  QuizHistoryPage,
  QuizInstructionsPage,
  QuizResultPage,
  QuizTakePage,
} from './pages/StudentQuizPages';
import {
  AdminCategoriesPage,
  AdminDashboardPage,
  AdminQuestionsPage,
  AdminQuizzesPage,
  AdminStudentsPage,
} from './pages/AdminPages';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<AppLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboardPage />} />
              <Route path="/student/categories" element={<QuizCategoriesPage />} />
              <Route path="/student/quizzes" element={<QuizListingPage />} />
              <Route path="/student/quizzes/:quizId/instructions" element={<QuizInstructionsPage />} />
              <Route path="/student/quizzes/:quizId/take" element={<QuizTakePage />} />
              <Route path="/student/results/:attemptId" element={<QuizResultPage />} />
              <Route path="/student/history" element={<QuizHistoryPage />} />
              <Route path="/student/leaderboard" element={<LeaderboardPage />} />
              <Route path="/student/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
              <Route path="/admin/questions" element={<AdminQuestionsPage />} />
              <Route path="/admin/students" element={<AdminStudentsPage />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
