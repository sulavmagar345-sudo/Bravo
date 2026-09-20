import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSettingsMap } from '../../admin/services/settings';
import type { SiteSettingsMap } from '../../admin/types';
import './Footer.css';

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

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<Partial<SiteSettingsMap>>(FALLBACK_SETTINGS);

  useEffect(() => {
    fetchSettingsMap().then(data => {
      setSettings(prev => ({ ...prev, ...data }));
    }).catch(console.error);
  }, []);

  // Compute whatsapp link
  const waNumber = (settings.whatsapp || '').replace(/[^0-9]/g, '');

  return (
  <footer className="footer" role="contentinfo">
    <div className="container">
      <div className="footer__top">
        <div>
          <Link to="/" className="footer__brand">
            <div>
              <span className="footer__brand-name">Bravo</span>
              <span className="footer__brand-tag">Barista School · Café & Bar</span>
            </div>
          </Link>
          <p className="footer__about-text">
            Nepal's premier hands-on barista training school and operational café & bar.
            Empowering hospitality careers since 2019.
          </p>
          <div className="footer__socials">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">F</a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
            )}
            {waNumber && (
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WA</a>
            )}
          </div>
        </div>

        <div>
          <h4 className="footer__col-title">Navigate</h4>
          <ul className="footer__links">
            <li><Link to="/" className="footer__link">Home</Link></li>
            <li><Link to="/about" className="footer__link">About Us</Link></li>
            <li><Link to="/programs" className="footer__link">Programs</Link></li>
            <li><Link to="/certification" className="footer__link">Certifications</Link></li>
            <li><Link to="/gallery" className="footer__link">Gallery</Link></li>
            <li><Link to="/contact" className="footer__link">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__col-title">Programs</h4>
          <ul className="footer__links">
            <li><Link to="/barista-training" className="footer__link">Barista Training</Link></li>
            <li><Link to="/cafe-bar-training" className="footer__link">Café & Bar Training</Link></li>
            <li><Link to="/chef-training" className="footer__link">Chef Training</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__col-title">Visit & Contact</h4>
          <p className="footer__contact-line">{settings.address}</p>
          <p className="footer__contact-line">{settings.phone}</p>
          <p className="footer__contact-line">{settings.email}</p>
          <div className="footer__hours-box">
            <strong>Hours</strong>
            <span>School: {settings.hours_school}</span>
            <span>Café & Bar: {settings.hours_cafe}</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          © {new Date().getFullYear()} Bravo Barista School & Café. All rights reserved.
        </p>
        <button className="footer__back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top ↑
        </button>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
