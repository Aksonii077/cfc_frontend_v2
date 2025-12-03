import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MentorsSection } from "../components/MentorsSection";
import { useUserRole } from "../stores/userStore";
import { ApplicationManagement } from "../components/mentor/ApplicationProcess";

// Lazy load components for code splitting
const PortfolioManagementWrapper = lazy(() => import("../components/mentor/PortfolioManagementWrapper"));
const AIAssistantWrapper = lazy(() => import("../components/AIAssistant").then(module => ({ default: module.AIAssistantWrapper })));
const ApplyMentorshipWrapper = lazy(() => import("../components/ApplyMentorship").then(module => ({ default: module.ApplyMentorshipWrapper })));
const WorkspaceSectionWrapper = lazy(() => import("../components/LaunchPad").then(module => ({ default: module.WorkspaceSectionWrapper })));
const SaasToolsSection = lazy(() => import("../components/LaunchPad").then(module => ({ default: module.SaasToolsSection })));
const ConnectionsWrapper = lazy(() => import("../components/GrowthHub").then(module => ({ default: module.ConnectionsWrapper })));
const NeedsLeadsWrapper = lazy(() => import("../components/GrowthHub").then(module => ({ default: module.NeedsLeadsWrapper })));
const PartnersWrapper = lazy(() => import("../components/GrowthHub").then(module => ({ default: module.PartnersWrapper })));
const MentorsWrapper = lazy(() => import("../components/Mentors").then(module => ({ default: module.MentorsWrapper })));
const ProfilePageWrapper = lazy(() => import("../components/Profile").then(module => ({ default: module.ProfilePageWrapper })));
const MyProfileWrapper = lazy(() => import("../components/Profile").then(module => ({ default: module.MyProfileWrapper })));
const SettingsWrapper = lazy(() => import("../components/Settings").then(module => ({ default: module.SettingsWrapper })));
const JobPortalWrapper = lazy(() => import("../components/Jobs").then(module => ({ default: module.JobPortalWrapper })));
const RaceAIDashboardWrapper = lazy(() => import("../components/Dashboard").then(module => ({ default: module.RaceAIDashboardWrapper })));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// Role-based redirect for dashboard index
function DashboardRoleBasedRedirect() {
  const userRole = useUserRole();
  
  const getDefaultRoute = () => {
    switch (userRole) {
      case 'founder':
        // Founders default to Find a Mentor section
        return 'mentors';
      case 'mentor':
        return 'mentor';
      default:
        return 'race-ai';
    }
  };

  return <Navigate to={getDefaultRoute()} replace />;
}

export function DashboardRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Main Dashboard - defaults based on user role */}
        <Route index element={<DashboardRoleBasedRedirect />} />
        <Route path="race-ai" element={<AIAssistantWrapper />} />

        {/* Apply Mentorship Route */}
        <Route path="apply-mentorship" element={<ApplyMentorshipWrapper />} />

        {/* Launch Pad Section Routes */}
        <Route path="ai-assistant" element={<AIAssistantWrapper />} />
        <Route path="workspace" element={<WorkspaceSectionWrapper />} />
        <Route path="tools" element={<SaasToolsSection />} />

        {/* Growth Hub Section Routes */}
        <Route path="partners" element={<PartnersWrapper />} />
        <Route path="needs-leads" element={<NeedsLeadsWrapper />} />
        <Route path="connections" element={<ConnectionsWrapper />} />

        {/* Mentors Section Routes */}
        <Route path="mentors" element={<MentorsWrapper />} />
        <Route
          path="my-applications"
          element={<MentorsSection subSection="my-applications" />}
        />
        <Route
          path="my-mentors"
          element={<MentorsSection subSection="my-mentors" />}
        />

        {/* My Account Section Routes */}
        <Route path="profile" element={<MyProfileWrapper />} />
        <Route path="settings" element={<SettingsWrapper />} />

        {/* Profile Routes (for viewing other users) */}
        <Route path="profile/:userId" element={<ProfilePageWrapper />} />

        {/* Job Portal Route */}
        <Route path="jobs" element={<JobPortalWrapper />} />

        {/* Mentor Application Center */}
        <Route path="mentor" element={<ApplicationManagement />} />

        {/* Startup Portfolio */}
        <Route
          path="startup-portfolio"
          element={<PortfolioManagementWrapper />}
        />

        {/* Legacy/Additional Routes */}
        <Route path="resources" element={<RaceAIDashboardWrapper />} />

        {/* Catch all redirect inside /dashboard uses role-based default */}
        <Route path="*" element={<DashboardRoleBasedRedirect />} />
      </Routes>
    </Suspense>
  );
}