import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../services/auth';

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/007');
  };

  return (
    <div className="admin-root">
      <div className="admin-denied">
        <div className="admin-denied__card">
          <div className="admin-denied__icon">🔒</div>
          <h1 className="admin-denied__title">Access Denied</h1>
          <p className="admin-denied__text">
            You are signed in but your account does not have administrator privileges for the Bravo Control Panel.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button className="admin-btn admin-btn--secondary" onClick={handleSignOut}>
              Sign Out
            </button>
            <a href="/#/" className="admin-btn admin-btn--primary">
              Return to Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
