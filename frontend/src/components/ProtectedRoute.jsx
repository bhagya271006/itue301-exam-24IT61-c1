import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute component
 * Required by Task 2 of ITUE301 Set F
 * 1. Missing token -> Redirects to '/' (LoginPage)
 * 2. Failed role check -> Redirects to '/events' (Preserves login session, distinct viva target!)
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Case 1: Unauthenticated user (missing token) -> Redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Case 2: Role check failed (e.g. attendee trying to access /organizer) -> Redirect to /events
  if (requiredRole && role !== requiredRole && role !== 'admin') {
    return (
      <Navigate
        to="/events"
        state={{ roleError: `Access Denied: '${requiredRole}' role required.` }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
