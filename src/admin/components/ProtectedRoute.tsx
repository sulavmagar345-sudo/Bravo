import React from 'react';
import { Navigate } from 'react-router-dom';
import type { AuthState } from '../types';

interface Props {
  auth: AuthState;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ auth, children }) => {
  if (auth.isLoading) {
    return (
      <div className="admin-root">
        <div className="admin-loading">
          <span className="admin-spinner" />
          Loading…
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/007" replace />;
  }

  if (!auth.isAdmin) {
    return <Navigate to="/admin/007/denied" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
