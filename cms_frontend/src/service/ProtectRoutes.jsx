import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ requiredRole }) {
  const location = useLocation();
  
  // Check for demo user login
  const demoUser = localStorage.getItem('demo_user');
  
  if (!demoUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Parse demo user data
  let userData;
  try {
    userData = JSON.parse(demoUser);
  } catch (e) {
    localStorage.removeItem('demo_user');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role if required
  if (requiredRole && userData.role !== requiredRole.toLowerCase()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}


