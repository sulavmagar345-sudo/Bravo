import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { fetchEnquiryCounts } from '../services/enquiries';
import { fetchAllBanners } from '../services/banners';
import { fetchAllProgramStatuses } from '../services/programs';
import { fetchBookingCounts } from '../services/bookings';

import type { EnquiryStatus } from '../types';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enquiriesNew: 0,
    enquiriesTotal: 0,
    bannersActive: 0,
    programsOpen: 0,
    bookingsToday: 0,
    bookingsPending: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [counts, banners, { fetchAllProgramStatuses }, bookingStats] = await Promise.all([
          fetchEnquiryCounts(),
          fetchAllBanners(),
          import('../services/programs'),
          fetchBookingCounts()
        ]);
        
        const programs = await fetchAllProgramStatuses();
        
        const totalEnq = Object.values(counts).reduce((a, b) => a + b, 0);
        
        const now = new Date();
        const activeBanners = banners.filter(b => 
          b.status === 'published' && 
          new Date(b.starts_at) <= now && 
          (!b.expires_at || new Date(b.expires_at) > now)
        ).length;
        
        const openPrograms = programs.filter(p => p.enrollment_status === 'open').length;

        setStats({
          enquiriesNew: counts['new'] || 0,
          enquiriesTotal: totalEnq,
          bannersActive: activeBanners,
          programsOpen: openPrograms,
          bookingsToday: bookingStats.today,
          bookingsPending: bookingStats.pending,
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your website's performance and status."
      />

      <div className="admin-stats-grid">
        <div className={`admin-stat-card ${stats.enquiriesNew > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">New Enquiries</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : stats.enquiriesNew}
          </div>
        </div>
        <div className={`admin-stat-card ${stats.bookingsPending > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">Pending Bookings</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : stats.bookingsPending}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Today's Bookings</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : stats.bookingsToday}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Total Enquiries</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : stats.enquiriesTotal}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Active Banners</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : stats.bannersActive}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Open Programs</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : stats.programsOpen}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Quick Actions</h3>
        </div>
        <div className="admin-card__body">
          <div className="admin-dashboard__quick-actions">
            <Link to="/admin/007/bookings" className="admin-btn admin-btn--secondary">
              View Bookings
            </Link>
            <Link to="/admin/007/enquiries" className="admin-btn admin-btn--secondary">
              View Enquiries
            </Link>
            <Link to="/admin/007/banners" className="admin-btn admin-btn--secondary">
              Update Banners
            </Link>
            <Link to="/admin/007/programs" className="admin-btn admin-btn--secondary">
              Change Enrollment Status
            </Link>
            <Link to="/admin/007/gallery" className="admin-btn admin-btn--secondary">
              Upload to Gallery
            </Link>
            <Link to="/admin/007/settings" className="admin-btn admin-btn--secondary">
              Edit Contact Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
