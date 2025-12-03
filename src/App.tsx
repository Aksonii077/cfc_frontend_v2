// React & Hooks
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Analytics
import { initializeAnalytics, initializePerformanceMonitoring } from "./utils/analytics";

// API Utils
import { initializeAccessToken } from "./utils/api";


// Components
import { OAuthCallback } from "./components/OAuthCallback";
import { RootDashboardLayout } from "./layouts/RootDashboardLayout";
import { DashboardRoutes } from "./routes/DashboardRoutes";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { AccessibilityProvider } from "./components/common/AccessibilityProvider";

// UI Components
import { Toaster } from "./components/ui/sonner";

// Auth
import { AuthWrapper } from "./components/AuthWrapper";

// Store
import { useUserRole } from "./stores/userStore";

// Role-based redirect component
function RoleBasedRedirect() {
  const userRole = useUserRole();
  
  // Default dashboard route based on role
  const getDefaultRoute = () => {
    switch (userRole) {
      case 'founder':
        // Founders land on Find a Mentor by default
        return '/dashboard/mentors';
      case 'mentor':
        return '/dashboard/mentor';
      default:
        // Fallback to RACE AI for unknown roles
        return '/dashboard/race-ai';
    }
  };

  return <Navigate to={getDefaultRoute()} replace />;
}

export default function App() {
  // Initialize analytics, performance monitoring, and access token
  useEffect(() => {
    initializeAnalytics();
    initializePerformanceMonitoring();
    initializeAccessToken();
  }, []);

  // Cookie-based auth bootstrap: read server-set cookie and hydrate localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!localStorage.getItem('token')) {
          const tokenRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google/token`, {
            credentials: 'include',
          });
          if (tokenRes.ok) {
            const tokenData = await tokenRes.json();
            if (tokenData && tokenData.token) {
              localStorage.setItem('token', tokenData.token);

              // Optionally fetch user using cookie session
              const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
                credentials: 'include',
              });
              if (userRes.ok) {
                const userData = await userRes.json();
                localStorage.setItem('user', JSON.stringify(userData));
              }
            }
          }
        }
      } catch (e) {
        // Silent fail; AuthWrapper and axios interceptors will continue flow
        console.error('initAuth (cookie) failed', e);
      }
    };
    initAuth();
  }, []);

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <AuthWrapper>
          <BrowserRouter>
            <Routes>
            {/* Default route redirects to dashboard based on user role */}
            <Route path="/" element={<RoleBasedRedirect />} />
            
            {/* Auth callback route */}
            <Route path="/auth/callback" element={<OAuthCallback />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard/*" element={
              <ErrorBoundary>
                <RootDashboardLayout>
                  <DashboardRoutes />
                </RootDashboardLayout>
              </ErrorBoundary>
            } />
            
            {/* Legacy redirect for race-ai */}
            <Route path="/race-ai" element={<Navigate to="/dashboard/race-ai" replace />} />
            <Route path="/race-ai/*" element={<Navigate to="/dashboard/race-ai" replace />} />
            
            {/* Catch all redirect to default dashboard based on user role */}
            <Route path="*" element={<RoleBasedRedirect />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthWrapper>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}