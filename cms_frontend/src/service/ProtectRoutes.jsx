import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from './AdminApi';

export default function ProtectedRoute({ requiredRole }) {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Minimal role check on client; rely primarily on backend permissions
  if (requiredRole) {
    // If you store role in localStorage, check it here. Otherwise let backend enforce.
  }

  return <Outlet />;
}


