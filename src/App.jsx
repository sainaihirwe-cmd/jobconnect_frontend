import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import PostJobPage from './pages/PostJobPage';
import ApplicantsPage from './pages/ApplicantsPage';
import ApplicantDetailPage from './pages/ApplicantDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ForbiddenPage from './pages/ForbiddenPage';
import ServerErrorPage from './pages/ServerErrorPage';
import { translations } from './utils/translations';

export default function App() {
  const [language, setLanguage] = useState('en');
  const t = translations[language] || translations.en;

  return (
    <Routes>
      <Route element={<Layout language={language} setLanguage={setLanguage} t={t} />}>
        <Route path="/" element={<HomePage t={t} />} />
        <Route path="/jobs" element={<JobsPage t={t} />} />
        <Route path="/jobs/:id" element={<JobDetailPage t={t} />} />
        <Route path="/login" element={<LoginPage t={t} />} />
        <Route path="/register" element={<RegisterPage t={t} />} />
        <Route path="/about" element={<AboutPage t={t} />} />
        <Route path="/how-it-works" element={<HowItWorksPage t={t} />} />
        <Route path="/contact" element={<ContactPage t={t} />} />
        <Route path="/dashboard" element={<DashboardPage t={t} />} />
        <Route path="/admin" element={<AdminDashboard t={t} />} />
        <Route path="/post-job" element={<PostJobPage t={t} />} />
        <Route path="/applicants" element={<ApplicantsPage t={t} />} />
        <Route path="/applicant/:id" element={<ApplicantDetailPage t={t} />} />
        <Route path="/401" element={<UnauthorizedPage t={t} />} />
        <Route path="/403" element={<ForbiddenPage t={t} />} />
        <Route path="/500" element={<ServerErrorPage t={t} />} />
        <Route path="*" element={<NotFoundPage t={t} />} />
      </Route>
    </Routes>
  );
}
