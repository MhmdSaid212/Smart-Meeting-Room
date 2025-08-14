import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ loggedIn, children, adminOnly = false, user }) {
  if (loggedIn === null) return null; // waiting for login check

  if (!loggedIn) return <Navigate to="/login" replace />;

  if (adminOnly && user?.role?.trim().toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
