import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { fetchBookingById, updateBookingStatus, formatBookingDate, formatBookingTime } from '../services/bookings';
import type { Booking, BookingStatus } from '../types';

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<BookingStatus>('pending');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadBooking(id);
  }, [id]);

  async function loadBooking(bookingId: string) {
    setLoading(true);
    try {
      const data = await fetchBookingById(bookingId);
      if (!data) throw new Error("Booking not found");
      setBooking(data);
      setStatus(data.status);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async () => {
    if (!booking) return;
    setSaving(true);
    try {
      await updateBookingStatus(booking.id, status);
      setBooking({ ...booking, status });
      alert('Status updated successfully');
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading booking details...</div>;
  if (error || !booking) return <div className="admin-alert admin-alert--error">{error || 'Booking not found'}</div>;

  return (
    <div className="admin-booking-detail">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/admin/007/bookings" className="admin-btn admin-btn--secondary admin-btn--sm">
          &larr; Back to Bookings
        </Link>
      </div>
      
      <PageHeader 
        title={`Booking ${booking.booking_reference}`}
        subtitle={booking.booking_type === 'netflix_room' ? 'Netflix Room' : 'Table Reservation'}
      />

      <div className="admin-card">
        <div className="admin-card__header">
          <h3 className="admin-card__title">Status & Actions</h3>
        </div>
        <div className="admin-card__body" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            className="admin-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus)}
            style={{ width: '200px' }}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No-Show</option>
          </select>
          <button 
            className="admin-btn admin-btn--primary"
            onClick={handleStatusUpdate}
            disabled={saving || status === booking.status}
          >
            {saving ? 'Saving...' : 'Update Status'}
          </button>
          
          <a 
            href={`https://wa.me/${booking.phone.replace(/\D/g,'')}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="admin-btn admin-btn--secondary"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Customer Details</h3>
          </div>
          <div className="admin-card__body">
            <dl className="admin-dl">
              <dt>Name</dt>
              <dd>{booking.customer_name}</dd>
              
              <dt>Phone</dt>
              <dd>{booking.phone}</dd>
              
              <dt>Email</dt>
              <dd>{booking.email || 'N/A'}</dd>
              
              <dt>Special Request</dt>
              <dd>{booking.special_request || 'None'}</dd>
            </dl>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Reservation Details</h3>
          </div>
          <div className="admin-card__body">
            <dl className="admin-dl">
              <dt>Type</dt>
              <dd>{booking.booking_type === 'netflix_room' ? 'Netflix Room' : 'Table Reservation'}</dd>
              
              <dt>Date</dt>
              <dd>{formatBookingDate(booking.starts_at)}</dd>
              
              <dt>Time</dt>
              <dd>{formatBookingTime(booking.starts_at)} – {formatBookingTime(booking.ends_at)}</dd>
              
              <dt>Duration</dt>
              <dd>{booking.duration_minutes} minutes</dd>
              
              <dt>Guests</dt>
              <dd>{booking.guest_count}</dd>
              
              {booking.booking_type === 'netflix_room' && (
                <>
                  <dt>Total Amount</dt>
                  <dd>Rs. {booking.total_amount.toFixed(2)}</dd>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
