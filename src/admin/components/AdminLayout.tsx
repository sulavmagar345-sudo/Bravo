import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useAdminAuth();

  return (
    <div className="admin-root">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button 
              className="admin-topbar__menu-btn" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <div className="admin-topbar__title">Administration</div>
          </div>
          <div className="admin-topbar__right">
            <span className="admin-topbar__email">{auth.email}</span>
          </div>
        </header>
        
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
