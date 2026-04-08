import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const authUser = localStorage.getItem('auth_user');

  if (!authUser) {
    // Kicks unauthenticated users strictly to the login page
    return <Navigate to="/auth" replace />;
  }

  // Returns child routes safely
  return <Outlet />;
}
