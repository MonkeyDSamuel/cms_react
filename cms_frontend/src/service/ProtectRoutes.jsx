import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken, jwtDecode, checkTokenExpiration } from './AdminApi';

export default function ProtectedRoute({ requiredRole }) {
  const location = useLocation();
  const token = getAccessToken();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // First check if token is expired
      if (!checkTokenExpiration()) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      if (!token) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        // Decode JWT token to get user role
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role || decodedToken.role_code;
        
        // Fallback to localStorage if token doesn't have role
        const storedRole = localStorage.getItem('user_role');
        const finalUserRole = userRole || storedRole;
        
        console.log('Decoded token:', decodedToken);
        console.log('User role from token:', userRole);
        console.log('User role from localStorage:', storedRole);
        console.log('Final user role:', finalUserRole);
        console.log('Required role:', requiredRole);

        // Check if user has required role
        if (requiredRole && finalUserRole !== requiredRole) {
          console.log('Access denied: Role mismatch');
          setHasAccess(false);
        } else {
          console.log('Access granted');
          setHasAccess(true);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Fallback to localStorage check
        const storedRole = localStorage.getItem('user_role');
        if (requiredRole && storedRole !== requiredRole) {
          console.log('Access denied: Role mismatch (fallback)');
          setHasAccess(false);
        } else {
          console.log('Access granted (fallback)');
          setHasAccess(true);
        }
      }
      
      setIsLoading(false);
    };

    checkAccess();
  }, [token, requiredRole]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasAccess) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger text-center">
              <h4>Access Denied</h4>
              <p>You don't have permission to access this page.</p>
              <p>Required role: <strong>{requiredRole}</strong></p>
              <button 
                className="btn btn-primary" 
                onClick={() => window.location.href = '/login'}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}


