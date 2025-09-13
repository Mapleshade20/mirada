import { Spin } from "antd";
import type React from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredStatus?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredStatus,
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Remove redundant fetchUserProfile call - App.tsx initializeAuth() handles this

  // Show loading spinner while checking authentication or fetching user data
  if (isLoading || (isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user status meets requirements
  if (requiredStatus && user) {
    if (!requiredStatus.includes(user.status)) {
      // Redirect based on user status
      switch (user.status) {
        case "unverified":
          return <Navigate to="/dashboard" replace />;
        case "verification_pending":
          return <Navigate to="/dashboard" replace />;
        case "verified":
          return <Navigate to="/dashboard" replace />;
        case "form_completed":
          return <Navigate to="/dashboard" replace />;
        case "matched":
          return <Navigate to="/dashboard" replace />;
        case "confirmed":
          return <Navigate to="/dashboard" replace />;
        default:
          return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
