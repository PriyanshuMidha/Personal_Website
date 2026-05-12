import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ProjectsPage from "../pages/ProjectsPage";
import ProjectDetailsPage from "../pages/ProjectDetailsPage";
import ExperiencePage from "../pages/ExperiencePage";
import AchievementsPage from "../pages/AchievementsPage";
import SkillsPage from "../pages/SkillsPage";
import EducationPage from "../pages/EducationPage";
import ContactPage from "../pages/ContactPage";
import PublicResumePage from "../pages/ResumePage";
import NotFoundPage from "../pages/NotFoundPage";
import AdminLoginPage from "../admin/AdminLoginPage";
import DashboardPage from "../admin/DashboardPage";
import ProfilePage from "../admin/ProfilePage";
import ResourceManagerPage from "../admin/ResourceManagerPage";
import MessagesPage from "../admin/MessagesPage";
import AdminResumePage from "../admin/ResumePage";
import SettingsPage from "../admin/SettingsPage";
import AdminLayout from "../layouts/AdminLayout";
import { adminResourceConfigs } from "../constants/adminResources";
import useAuth from "../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "../components/Loader";
import { getToken } from "../utils/storage";

const AppRoutes = () => {
  const auth = useAuth();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/resume" element={<PublicResumePage />} />
      </Route>
      <Route path="/cms" element={<Navigate to={getToken() ? "/admin/dashboard" : "/admin/login"} replace />} />

      <Route
        path="/admin/login"
        element={
          auth.loading && getToken() ? (
            <Loader label="Restoring admin session..." />
          ) : auth.isAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AdminLoginPage auth={auth} />
          )
        }
      />
      <Route element={<ProtectedRoute auth={auth} />}>
        <Route element={<AdminLayout auth={auth} />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
          <Route path="/admin/projects" element={<ResourceManagerPage config={adminResourceConfigs.projects} />} />
          <Route path="/admin/experience" element={<ResourceManagerPage config={adminResourceConfigs.experience} />} />
          <Route path="/admin/achievements" element={<ResourceManagerPage config={adminResourceConfigs.achievements} />} />
          <Route path="/admin/skills" element={<ResourceManagerPage config={adminResourceConfigs.skills} />} />
          <Route path="/admin/education" element={<ResourceManagerPage config={adminResourceConfigs.education} />} />
          <Route path="/admin/messages" element={<MessagesPage />} />
          <Route path="/admin/resume" element={<AdminResumePage />} />
          <Route path="/admin/settings" element={<SettingsPage auth={auth} />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
