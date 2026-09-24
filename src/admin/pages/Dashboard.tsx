import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { fetchEnquiryCounts } from '../services/enquiries';
import { fetchAllBanners } from '../services/banners';
import { fetchAllProgramStatuses } from '../services/programs';
import { fetchBookingCounts } from '../services/bookings';
import { fetchResourcesByType } from '../services/resources';

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
    availableTables: 0,
    occupiedTables: 0,
    totalTables: 0,
    availableNetflixRooms: 0,
    occupiedNetflixRooms: 0,
    totalNetflixRooms: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [counts, banners, { fetchAllProgramStatuses }, bookingStats, tables, rooms] = await Promise.all([
          fetchEnquiryCounts(),
          fetchAllBanners(),
          import('../services/programs'),
          fetchBookingCounts(),
          fetchResourcesByType('table'),
          fetchResourcesByType('netflix_room'),
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

        const availT = tables.filter(t => t.status === 'available').length;
        const occT = tables.filter(t => t.status === 'occupied').length;
        const availR = rooms.filter(r => r.status === 'available').length;
        const occR = rooms.filter(r => r.status === 'occupied').length;

        setStats({
          enquiriesNew: counts['new'] || 0,
          enquiriesTotal: totalEnq,
          bannersActive: activeBanners,
          programsOpen: openPrograms,
          bookingsToday: bookingStats.today,
          bookingsPending: bookingStats.pending,
          availableTables: availT,
          occupiedTables: occT,
          totalTables: tables.length,
          availableNetflixRooms: availR,
          occupiedNetflixRooms: occR,
          totalNetflixRooms: rooms.length,
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
        subtitle="Overview of your website's performance and physical resource availability."
      />

      <div className="admin-stats-grid">
        <div className={`admin-stat-card ${stats.availableTables > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">Available Tables</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : `${stats.availableTables} / ${stats.totalTables}`}
          </div>
        </div>
        <div className={`admin-stat-card ${stats.occupiedTables > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">Occupied Tables</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : `${stats.occupiedTables} / ${stats.totalTables}`}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Available Netflix Rooms</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : `${stats.availableNetflixRooms} / ${stats.totalNetflixRooms}`}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Occupied Netflix Rooms</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : `${stats.occupiedNetflixRooms} / ${stats.totalNetflixRooms}`}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__label">Today's Bookings</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : stats.bookingsToday}
          </div>
        </div>
        <div className={`admin-stat-card ${stats.bookingsPending > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">Pending Bookings</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : stats.bookingsPending}
          </div>
        </div>
        <div className={`admin-stat-card ${stats.enquiriesNew > 0 ? 'admin-stat-card--highlight' : ''}`}>
          <div className="admin-stat-card__label">New Enquiries</div>
          <div className="admin-stat-card__value">
            {loading ? '-' : stats.enquiriesNew}
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
            <Link to="/admin/007/table-reservations" className="admin-btn admin-btn--secondary">
              Table Reservations
            </Link>
            <Link to="/admin/007/netflix-room" className="admin-btn admin-btn--secondary">
              Netflix Room
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
