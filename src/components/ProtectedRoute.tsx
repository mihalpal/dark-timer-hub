
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// This is a placeholder until we connect with Supabase
// For development purposes, we'll bypass authentication
// In production, this would be replaced with Supabase auth check
const isAuthenticated = true;

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // For development, let's bypass authentication
  // In production with Supabase, this will check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
