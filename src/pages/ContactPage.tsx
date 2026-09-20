import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../data/images';
import { submitEnquiry } from '../admin/services/enquiries';
import { fetchSettingsMap } from '../admin/services/settings';
import type { SiteSettingsMap } from '../admin/types';
import './ContactPage.css';

/* ─── DATA ──────────────────────────────────────────────── */
// Fallback settings if DB fails
const FALLBACK_SETTINGS: Partial<SiteSettingsMap> = {
  phone: '+977 980-2004823',
  email: 'info@bravocafebar.com',
  address: 'Bravo Barista School & Café, Kathmandu, Nepal',
  hours_school: 'Mon – Sat, 7:00 AM – 6:30 PM',
  hours_cafe: 'Everyday, 8:00 AM – 10:00 PM',
  whatsapp: '+9779802004823',
  facebook_url: 'https://www.facebook.com/share/1DG2ULoNwS/'
};

type FormStatus = 'idle' | 'preparing' | 'ready' | 'error';

/* ─── COMPONENT ─────────────────────────────────────────── */
const ContactPage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    message: ''
  });
  
  const [status, setStatus] = useState<FormStatus>('idle');
  const [settings, setSettings] = useState<Partial<SiteSettingsMap>>(FALLBACK_SETTINGS);

  useEffect(() => {
    fetchSettingsMap().then(data => {
      setSettings(prev => ({ ...prev, ...data }));
    }).catch(console.error);
  }, []);

  // Animation Observer
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cp-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    root.querySelectorAll<HTMLElement>('[data-cp-reveal]').forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'preparing') return;

    setStatus('preparing');

    // Small delay to let the coffee animation play
    setTimeout(async () => {
      try {
        await submitEnquiry({
          full_name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          program: formData.program,
          message: formData.message.trim(),
        });
        setStatus('ready');
      } catch (err: any) {
        console.error('Failed to submit enquiry:', err);
        setStatus('error');
      }
    }, 1200);
  };

  return (
    <div className="contact-page" ref={rootRef}>
      {/* 1. HERO */}
      <section className="contact-hero">
        <div className="container contact-hero__inner">
          <div className="contact-hero__content">
            <span className="contact-hero__eyebrow" data-cp-reveal>Get in Touch</span>
            <h1 className="contact-hero__title" data-cp-reveal>
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">Let's Talk</span>
              </span>
            </h1>
            <p className="contact-hero__lead" data-cp-reveal>
              Have a question about training, certification, or which program is right for you? Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTACT INFORMATION + ENQUIRY FORM */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-main__grid">
            
            {/* Left: Contact Info */}
            <div className="contact-info">
              <div className="contact-info__list">
                <div className="contact-info__row" data-cp-reveal style={{ transitionDelay: `0ms` }}>
                  <h3 className="contact-info__label">Phone</h3>
                  <p className="contact-info__value">{settings.phone}</p>
                </div>
                <div className="contact-info__row" data-cp-reveal style={{ transitionDelay: `100ms` }}>
                  <h3 className="contact-info__label">Email</h3>
                  <p className="contact-info__value">{settings.email}</p>
                </div>
                <div className="contact-info__row" data-cp-reveal style={{ transitionDelay: `200ms` }}>
                  <h3 className="contact-info__label">Location</h3>
                  <p className="contact-info__value">{settings.address}</p>
                </div>
                <div className="contact-info__row" data-cp-reveal style={{ transitionDelay: `300ms` }}>
                  <h3 className="contact-info__label">Opening Hours</h3>
                  <p className="contact-info__value">
                    School: {settings.hours_school}<br />
                    Café: {settings.hours_cafe}
                  </p>
                </div>
              </div>
              <div className="contact-info__socials" data-cp-reveal>
                <h3 className="contact-info__label">Follow Us</h3>
                <div className="contact-info__links">
                  {settings.facebook_url && (
                    <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="contact-social-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M24 12.07C24 5.41 18.63 0 12 0C5.37 0 0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24V15.56H7.08V12.07H10.13V9.41C10.13 6.38 11.93 4.73 14.65 4.73C15.95 4.73 17.33 4.96 17.33 4.96V7.9H15.82C14.33 7.9 13.88 8.83 13.88 9.78V12.07H17.2L16.67 15.56H13.88V24C19.61 23.1 24 18.1 24 12.07Z" />
                      </svg>
                      <span>Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="contact-form-wrapper" data-cp-reveal>
              <div className="contact-form__intro">
                <span className="contact-form__eyebrow">Send Us An Enquiry</span>
                <p className="contact-form__lead">
                  Have a question about our training or programs? Send us an enquiry and our team will get back to you as soon as possible.
                </p>
              </div>

              <form className="contact-form" onSubmit={handleSubmit}>
                {status !== 'ready' && (
                  <div className="contact-form__fields">
                    <div className="cp-input-group">
                      <label htmlFor="name">Full Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        maxLength={100}
                        value={formData.name}
                        onChange={handleInputChange}
                        autoComplete="name"
                      />
                    </div>
                    
                    <div className="cp-input-row">
                      <div className="cp-input-group">
                        <label htmlFor="email">Email Address *</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          required
                          maxLength={150}
                          value={formData.email}
                          onChange={handleInputChange}
                          autoComplete="email"
                        />
                      </div>
                      <div className="cp-input-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone" 
                          required 
                          maxLength={20}
                          inputMode="numeric"
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9+]/g, '');
                            setFormData(prev => ({ ...prev, phone: val }));
                          }}
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="cp-input-group">
                      <label htmlFor="program">Interested Program *</label>
                      <select 
                        id="program" 
                        name="program" 
                        required
                        value={formData.program}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>Select a program...</option>
                        <option value="Barista Training">Barista Training</option>
                        <option value="Café & Bar Training">Café & Bar Training</option>
                        <option value="Chef Training">Chef Training (Waitlist)</option>
                        <option value="General Enquiry">General Enquiry</option>
                      </select>
                    </div>

                    <div className="cp-input-group">
                      <label htmlFor="message">Message *</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        required 
                        maxLength={1000}
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>

                    {status === 'error' && (
                      <div className="cp-form-error" role="alert">
                        Something went wrong. Please try again or call us directly.
                      </div>
                    )}

                    <div className="contact-form__submit-row">
                      <button 
                        type="submit" 
                        className="btn btn--primary btn--full"
                        disabled={status === 'preparing'}
                      >
                        {status === 'preparing' ? 'Sending...' : 'Send Enquiry'}
                        {status !== 'preparing' && <span className="btn-arrow">→</span>}
                      </button>

                      {/* MICRO-ANIMATION: Preparing... */}
                      {status === 'preparing' && (
                        <div className="cp-mini-anim" aria-hidden="true">
                          <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Coffee stream */}
                            <path className="cp-svg-pour" d="M30 0L30 35" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
                            {/* Cup */}
                            <path className="cp-svg-cup" d="M15 25C15 25 20 50 30 50C40 50 45 25 45 25H15Z" fill="var(--color-canvas)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
                            {/* Handle */}
                            <path className="cp-svg-handle" d="M45 30C52 30 52 42 45 42" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
                            {/* Coffee level / Crema */}
                            <ellipse className="cp-svg-crema" cx="30" cy="25" rx="15" ry="3" fill="var(--color-ink)" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUCCESS STATE */}
                {status === 'ready' && (
                  <div className="cp-form-success" role="status">
                    <div className="cp-success-character">
                      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <g className="cp-ready-cup-group">
                          {/* Main Cup */}
                          <path className="cp-ready-cup" d="M25 40C25 40 33.3 81.6 50 81.6C66.6 81.6 75 40 75 40H25Z" fill="var(--color-canvas)" stroke="var(--color-ink)" strokeWidth="4" strokeLinejoin="round" />
                          {/* Handle */}
                          <path className="cp-ready-handle" d="M75 48.3C86.6 48.3 86.6 68.3 75 68.3" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
                          {/* Checkmark */}
                          <path className="cp-ready-check" d="M35 60L45 70L65 50" stroke="var(--color-gold)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        {/* Steam 1 */}
                        <path className="cp-ready-steam cp-ready-steam-1" d="M40 25C40 16.6 31.6 8.3 40 0" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
                        {/* Steam 2 */}
                        <path className="cp-ready-steam cp-ready-steam-2" d="M60 25C60 16.6 51.6 8.3 60 0" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                    <h3 className="cp-success-title">Enquiry sent successfully!</h3>
                    <p className="cp-success-text">
                      We've received your message and will get back to you as soon as possible.
                    </p>
                    <div className="cp-success-actions">
                      <button 
                        type="button" 
                        className="btn btn--outline"
                        onClick={() => {
                          setStatus('idle');
                          setFormData({ name: '', email: '', phone: '', program: '', message: '' });
                        }}
                      >
                        Send Another Enquiry
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOCATION */}
      <section className="contact-location section section--cream">
        <div className="container contact-location__inner">
          <div className="contact-location__copy" data-cp-reveal>
            <h2 className="contact-location__title">Visit Us</h2>
            <p className="contact-location__address">
              Bravo Barista School &amp; Café<br />
              Kathmandu, Nepal
            </p>
            <p className="contact-location__text">
              Our doors are always open. Come by for an artisan espresso, see our students at work, or discuss your learning plan with our instructors.
            </p>
          </div>
          <div className="contact-location__visual" data-cp-reveal>
            {/* Using a verified image to represent the location, since a real map embed requires an API key or iframe */}
            <img src={IMAGES.cafeInterior} alt="Bravo Café Interior" loading="lazy" />
          </div>
        </div>
      </section>

      {/* 4. QUICK PROGRAM HELP */}
      <section className="contact-help">
        <div className="container text-center" data-cp-reveal>
          <h2 className="contact-help__title">
            <span className="cp-heading-mask">
              <span className="cp-heading-mask__inner">Not Sure Where to Start?</span>
            </span>
          </h2>
          <p className="contact-help__text">Tell us what you're interested in and we'll help you find the right program.</p>
          <div className="contact-help__actions">
            <Link to="/programs" className="contact-help__link">
              Explore Programs <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="contact-cta">
        <div className="container text-center" data-cp-reveal>
          <h2 className="contact-cta__title">
            <span className="cp-heading-mask">
              <span className="cp-heading-mask__inner">Ready to Start</span>
            </span>
            <span className="cp-heading-mask">
              <span className="cp-heading-mask__inner">Your Journey?</span>
            </span>
          </h2>
          <p className="contact-cta__text">Let's find the right next step for your hospitality career.</p>
          <div className="contact-cta__actions">
            <Link to="/programs" className="btn btn--primary">
              Explore Programs <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
