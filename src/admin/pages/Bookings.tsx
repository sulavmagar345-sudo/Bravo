import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { fetchAllBookings, updateBookingStatus } from '../services/bookings';
import type { Booking, BookingStatus } from '../types';
import { formatBookingDateShort, formatBookingTime } from '../services/bookings';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'table' | 'netflix_room'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | BookingStatus>('all');

  useEffect(() => {
    loadBookings();
  }, [filterType, filterStatus]);

  async function loadBookings() {
    setLoading(true);
    try {
      const data = await fetchAllBookings({
        type: filterType,
        status: filterStatus,
      });
      setBookings(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-bookings">
      <PageHeader 
        title="Bookings" 
        subtitle="Manage table reservations and Netflix room bookings."
        action={
          <Link to="/admin/007/booking-settings" className="admin-btn admin-btn--primary">
            Settings & Resources
          </Link>
        }
      />

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <select 
          className="admin-select" 
          value={filterType} 
          onChange={e => setFilterType(e.target.value as any)}
        >
          <option value="all">All Types</option>
          <option value="table">Table Reservations</option>
          <option value="netflix_room">Netflix Room</option>
        </select>
        <select 
          className="admin-select" 
          value={filterStatus} 
          onChange={e => setFilterStatus(e.target.value as any)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-Show</option>
        </select>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="admin-empty-state">
            <p>No bookings found matching the selected filters.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td><strong>{booking.booking_reference}</strong></td>
                  <td>
                    <span className="admin-badge admin-badge--neutral">
                      {booking.booking_type === 'netflix_room' ? 'Netflix' : 'Table'}
                    </span>
                  </td>
                  <td>
                    <div>{booking.customer_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#687771' }}>{booking.phone}</div>
                  </td>
                  <td>
                    <div>{formatBookingDateShort(booking.starts_at)}</div>
                    <div style={{ fontSize: '0.8rem', color: '#687771' }}>
                      {formatBookingTime(booking.starts_at)} ({booking.duration_minutes}m)
                    </div>
                  </td>
                  <td>{booking.guest_count}</td>
                  <td>
                    <select
                      className={`admin-status-select status-${booking.status}`}
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No-Show</option>
                    </select>
                  </td>
                  <td>
                    <Link to={`/admin/007/bookings/${booking.id}`} className="admin-btn admin-btn--sm admin-btn--secondary">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Bookings;
