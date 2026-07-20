import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '@/components/shared/layouts/AuthLayout';
import MainLayout from '@/components/shared/layouts/MainLayout';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import CreatePlanPage from '@/pages/planning/CreatePlanPage';
import PlansPage from '@/pages/planning/PlansPage';
import FocusPage from '@/pages/focus/FocusPage';
import InterviewPage from '@/pages/verify/InterviewPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from root to dashboard (if authenticated, else login). Defaulting to dashboard for demo. */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Application Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/plan/new" element={<CreatePlanPage />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/interview" element={<InterviewPage />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
