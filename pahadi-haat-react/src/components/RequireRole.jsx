import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user || user.role !== role) {
    return <Navigate to="/login" replace state={{ requiredRole: role }} />;
  }
  return children;
}
