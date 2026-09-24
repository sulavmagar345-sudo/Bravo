import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BookingSuccess from '../components/BookingSuccess/BookingSuccess';
import { createBookingRpc, getAvailableSlots } from '../admin/services/bookings';
import { fetchSettingsMap } from '../admin/services/settings';
import type { Booking, AvailableSlot } from '../admin/types';
import './BookForm.css';

const BookNetflixPage: React.FC = () => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [durationHours, setDurationHours] = useState('2');
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [request, setRequest] = useState('');

  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchSettingsMap().then(map => {
      setSettings(map as Record<string, string>);
    }).catch(console.error);

    // Set min date to today
    const today = new Date().toLocaleDateString('en-CA');
    const dateInput = document.getElementById('b-date') as HTMLInputElement;
    if (dateInput) dateInput.min = today;
  }, []);

  // Fetch availability when date or duration changes
  useEffect(() => {
    async function checkAvailability() {
      if (!date || !durationHours) {
        setAvailableSlots([]);
        return;
      }
      setCheckingAvailability(true);
      setTime(''); // Reset time selection
      try {
        const { data: resources } = await supabase.from('resources').select('id').eq('type', 'netflix_room').eq('active', true);
        if (!resources || resources.length === 0) {
           setAvailableSlots([]);
           return;
        }

        const durationMin = parseInt(durationHours, 10) * 60;
        const allSlots = await Promise.all(resources.map(r => getAvailableSlots(r.id, date, durationMin)));
        
        // Merge: a slot is available if ANY room has it available
        const merged: Record<string, AvailableSlot> = {};
        for (const resourceSlots of allSlots) {
          for (const slot of resourceSlots) {
            const key = slot.slot_start;
            if (!merged[key]) {
              merged[key] = { ...slot };
            } else if (slot.available) {
              merged[key].available = true;
            }
          }
        }
        
        const finalSlots = Object.values(merged).sort((a, b) => new Date(a.slot_start).getTime() - new Date(b.slot_start).getTime());
        setAvailableSlots(finalSlots);

      } catch (err) {
        console.error(err);
      } finally {
        setCheckingAvailability(false);
      }
    }
    
    checkAvailability();
  }, [date, durationHours]);

  const pricePerHour = parseInt(settings.netflix_price_per_hour || '300', 10);
  const totalAmount = parseInt(durationHours, 10) * pricePerHour;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !name || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
        const durationMin = parseInt(durationHours, 10) * 60;

        const res = await createBookingRpc({
            booking_type: 'netflix_room',
            customer_name: name,
            phone: phone,
            email: email || undefined,
            guest_count: parseInt(guests, 10),
            starts_at: time,
            duration_minutes: durationMin,
            special_request: request || undefined
        });

        if (!res.success) {
            throw new Error(res.error || "Failed to create booking.");
        }

        setBooking(res.booking!);
        setStep('success');

    } catch (err: any) {
        setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleBookAnother = () => {
    setStep('form');
    setDate('');
    setTime('');
    setName('');
    setPhone('');
    setEmail('');
    setRequest('');
    setGuests('2');
    setDurationHours('2');
    setBooking(null);
  };

  return (
    <main className="book-flow-page" id="main-content">
      <div className="container book-flow__container">
        {step === 'form' ? (
          <div className="book-form-wrapper">
            <div className="book-form__header" style={{ textAlign: 'center' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" style={{ height: '32px', marginBottom: '1rem', display: 'inline-block' }} />
              <h1 className="book-form__title">Book Netflix Room</h1>
              <p className="book-form__intro">
                Enjoy a private room, big screen, and free popcorn. Rate is Rs. {pricePerHour}/hour.
              </p>
            </div>

            {error && <div className="book-alert book-alert--error">{error}</div>}

            <form onSubmit={handleSubmit} className="book-form">
              <fieldset className="book-fieldset">
                <legend>Reservation Details</legend>
                <div className="form-group">
                  <label htmlFor="b-date">Date *</label>
                  <input
                    type="date"
                    id="b-date"
                    className="form-input"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="b-guests">Number of Guests *</label>
                  <select
                    id="b-guests"
                    className="form-select"
                    required
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group form-group--full">
                  <label>Duration (Hours) *</label>
                  <div className="book-duration-tabs">
                    {[1, 2, 3, 4].map(h => (
                       <button
                         key={h}
                         type="button"
                         className={`book-duration-tab ${durationHours === h.toString() ? 'is-active' : ''}`}
                         onClick={() => setDurationHours(h.toString())}
                       >
                         {h} hr{h > 1 ? 's' : ''}
                       </button>
                    ))}
                  </div>
                </div>

                <div className="form-group form-group--full">
                  <label>Available Times *</label>
                  {checkingAvailability ? (
                    <div className="book-times__loading">Checking availability...</div>
                  ) : !date ? (
                    <div className="book-times__empty">Please select a date first.</div>
                  ) : availableSlots.length === 0 ? (
                    <div className="book-times__empty">No availability found for this date. Please try another date or a shorter duration.</div>
                  ) : (
                    <div className="book-times__grid">
                      {availableSlots.map((slot) => {
                         const timeLabel = new Date(slot.slot_start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                         return (
                            <label 
                              key={slot.slot_start} 
                              className={`book-time-btn ${!slot.available ? 'is-disabled' : ''} ${time === slot.slot_start ? 'is-selected' : ''}`}
                            >
                               <input 
                                 type="radio" 
                                 name="time_slot" 
                                 value={slot.slot_start}
                                 disabled={!slot.available}
                                 checked={time === slot.slot_start}
                                 onChange={(e) => setTime(e.target.value)}
                                 required
                               />
                               <span>{timeLabel}</span>
                            </label>
                         );
                      })}
                    </div>
                  )}
                </div>
              </fieldset>

              <fieldset className="book-fieldset">
                <legend>Your Details</legend>
                <div className="form-group">
                  <label htmlFor="b-name">Full Name *</label>
                  <input
                    type="text"
                    id="b-name"
                    className="form-input"
                    required
                    placeholder="e.g. Suman Thapa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="b-phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="b-phone"
                    className="form-input"
                    required
                    placeholder="98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="b-email">Email Address (Optional)</label>
                  <input
                    type="email"
                    id="b-email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="b-request">Special Request (Optional)</label>
                  <textarea
                    id="b-request"
                    className="form-textarea"
                    placeholder="Any special movies or occasions?"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    maxLength={500}
                  />
                </div>
              </fieldset>

              <div className="book-form__summary">
                <div className="book-form__summary-row">
                  <span>Netflix Room ({durationHours} hr{parseInt(durationHours) > 1 ? 's' : ''})</span>
                  <span>Rs. {totalAmount}</span>
                </div>
                <div className="book-form__summary-total">
                  <span>Total Due at Counter</span>
                  <span>Rs. {totalAmount}</span>
                </div>
              </div>

              <div className="book-form__actions">
                <Link to="/book" className="btn btn--outline">Cancel</Link>
                <button type="submit" className="btn btn--primary" disabled={loading || !time}>
                  {loading ? 'Checking...' : 'Check Availability & Book'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          booking && <BookingSuccess booking={booking} whatsappNumber={settings.whatsapp || ''} onBookAnother={handleBookAnother} />
        )}
      </div>
    </main>
  );
};

export default BookNetflixPage;
