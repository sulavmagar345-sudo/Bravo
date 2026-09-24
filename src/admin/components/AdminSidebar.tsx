import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { signOut } from '../services/auth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`admin-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <Link to="/admin/007/dashboard" className="admin-sidebar__brand" onClick={onClose}>
          <div className="admin-sidebar__brand-text">
            <span className="admin-sidebar__brand-name">BRAVO</span>
            <span className="admin-sidebar__brand-tag">Admin Panel</span>
          </div>
        </Link>
        
        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-label">Overview</div>
          <NavLink to="/admin/007/dashboard" className="admin-sidebar__link" end onClick={onClose}>
            <span className="admin-sidebar__link-icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/admin/007/bookings" className="admin-sidebar__link" onClick={onClose}>
            <span className="admin-sidebar__link-icon">📅</span> Bookings
          </NavLink>
          <NavLink to="/admin/007/enquiries" className="admin-sidebar__link" onClick={onClose}>
            <span className="admin-sidebar__link-icon">📩</span> Enquiries
          </NavLink>
          
          <div className="admin-sidebar__section-label">Content</div>
          <NavLink to="/admin/007/banners" className="admin-sidebar__link" onClick={onClose}>
            <span className="admin-sidebar__link-icon">🖼️</span> Banners
          </NavLink>
          <NavLink to="/admin/007/gallery" className="admin-sidebar__link" onClick={onClose}>
            <span className="admin-sidebar__link-icon">📸</span> Gallery
          </NavLink>
          <NavLink to="/admin/007/videos" className="admin-sidebar__link" onClick={onClose}>
            <span className="admin-sidebar__link-icon">🎥</span> Videos
          </NavLink>
          
          <div className="admin-sidebar__section-label">Configuration</div>
          <NavLink to="/admin/007/programs" className="admin-sidebar__link" onClick={onClose}>
            <span className="admin-sidebar__link-icon">🎓</span> Programs
          </NavLink>
          <NavLink to="/admin/007/settings" className="admin-sidebar__link" onClick={onClose}>
            <span className="admin-sidebar__link-icon">⚙️</span> Settings
          </NavLink>
        </nav>
        
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" className="admin-sidebar__link">
            <span className="admin-sidebar__link-icon">🌐</span> View Site
          </a>
          <button 
            onClick={() => { signOut(); onClose(); }}
            className="admin-sidebar__link" 
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span className="admin-sidebar__link-icon">🚪</span> Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
