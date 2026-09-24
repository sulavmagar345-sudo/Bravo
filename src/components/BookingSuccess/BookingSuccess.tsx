import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './BookingSuccess.css';

interface Props {
  booking: {
    booking_reference: string;
    booking_type: 'table' | 'netflix_room';
    customer_name: string;
    starts_at: string;
    ends_at: string;
    guest_count: number;
    total_amount: number;
    duration_minutes: number;
  };
  whatsappNumber: string;
  onBookAnother?: () => void;
}

const TZ = 'Asia/Kathmandu';

function fmt(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleString('en-NP', { ...opts, timeZone: TZ });
}

const BookingSuccess: React.FC<Props> = ({ booking, whatsappNumber, onBookAnother }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);   // ring draws
    const t2 = setTimeout(() => setPhase(2), 700);   // check appears
    const t3 = setTimeout(() => setPhase(3), 1100);  // steam
    const t4 = setTimeout(() => setPhase(4), 1600);  // text reveals
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const dateStr = fmt(booking.starts_at, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const startTime = fmt(booking.starts_at, { hour: '2-digit', minute: '2-digit', hour12: true });
  const endTime   = fmt(booking.ends_at,   { hour: '2-digit', minute: '2-digit', hour12: true });

  const waMsg = encodeURIComponent(
    `Hello Bravo, I have a booking with reference ${booking.booking_reference}.`
  );
  const waUrl = `https://wa.me/${whatsappNumber.replace(/\D/g,'')}?text=${waMsg}`;

  return (
    <div className={`bsuccess bsuccess--phase-${phase}`} role="status" aria-live="polite" aria-label="Booking confirmed">
      {/* Animation seal */}
      <div className="bsuccess__seal" aria-hidden="true">
        <svg className="bsuccess__ring" viewBox="0 0 80 80" fill="none">
          <circle className="bsuccess__ring-track" cx="40" cy="40" r="36" />
          <circle className="bsuccess__ring-fill"  cx="40" cy="40" r="36" />
        </svg>
        <svg className="bsuccess__check" viewBox="0 0 32 32" fill="none">
          <polyline className="bsuccess__check-line" points="6,17 13,24 26,8" />
        </svg>
        <div className="bsuccess__steam">
          <span /><span /><span />
        </div>
      </div>

      {/* Accessible text even without animation */}
      <div className={`bsuccess__body ${phase >= 4 ? 'bsuccess__body--visible' : ''}`}>
        <p className="bsuccess__eyebrow">
          {booking.booking_type === 'netflix_room' ? 'Netflix Room' : 'Table Reservation'}
        </p>
        <h2 className="bsuccess__heading">Booking Confirmed</h2>
        <p className="bsuccess__sub">Thank you, <strong>{booking.customer_name}</strong>.</p>

        <div className="bsuccess__ref">
          <span className="bsuccess__ref-label">Booking ID</span>
          <span className="bsuccess__ref-code">{booking.booking_reference}</span>
        </div>

        <div className="bsuccess__details">
          <div className="bsuccess__detail-row">
            <span>Date</span>
            <span>{dateStr}</span>
          </div>
          <div className="bsuccess__detail-row">
            <span>Time</span>
            <span>{startTime} – {endTime}</span>
          </div>
          <div className="bsuccess__detail-row">
            <span>Guests</span>
            <span>{booking.guest_count} {booking.guest_count === 1 ? 'person' : 'people'}</span>
          </div>
          {booking.booking_type === 'netflix_room' && booking.total_amount > 0 && (
            <div className="bsuccess__detail-row bsuccess__detail-row--total">
              <span>Total</span>
              <span>Rs. {booking.total_amount.toFixed(0)}</span>
            </div>
          )}
        </div>

        <div className="bsuccess__actions">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
            WhatsApp Bravo
          </a>
          {onBookAnother ? (
            <button className="btn btn--outline" onClick={onBookAnother}>
              Book Again
            </button>
          ) : (
            <Link to="/" className="btn btn--outline">Back to Home</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
