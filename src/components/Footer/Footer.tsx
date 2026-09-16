import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { IMAGES } from '../../data/images';

const Footer: React.FC = () => {
 const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 return (
  <footer className="footer" role="contentinfo">
   <div className="container">
    <div className="footer__top">
     {/* Col 1: Brand */}
     <div className="footer__brand-col">
      <Link to="/" className="footer__brand" aria-label="Bravo Home">
       <img
        src={IMAGES.logo}
        alt="Bravo Barista School & Café Logo"
        className="footer__logo"
       />
       <div className="footer__brand-text">
        <span className="footer__brand-name">BRAVO</span>
        <span className="footer__brand-tag">Barista School · Café &amp; Bar</span>
       </div>
      </Link>

      <p className="footer__about-text">
       Nepal's premier practical barista and hospitality training institute. Empowering aspiring
       baristas and mixologists with world-class skills, recognized certifications, and a vibrant
       café community since 2019.
      </p>

      <div className="footer__socials">
       <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <span>F</span>
       </a>
       <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <span>IG</span>
       </a>
       <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
        <span>TK</span>
       </a>
       <a href="https://wa.me/9779800000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="footer__social--wa">
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
       </a>
      </div>
     </div>

     {/* Col 2: Navigation */}
     <div className="footer__links-col">
      <h4 className="footer__col-title">Quick Links</h4>
      <ul className="footer__links">
       <li><Link to="/" className="footer__link">Home</Link></li>
       <li><Link to="/about" className="footer__link">Our Story &amp; Legacy</Link></li>
       <li><Link to="/programs" className="footer__link">Training Courses</Link></li>
       <li><Link to="/barista-training" className="footer__link">Barista Mastery</Link></li>
       <li><Link to="/cafe-bar-training" className="footer__link">Café &amp; Bar Training</Link></li>
       <li><Link to="/cafe-bar" className="footer__link">Café &amp; Bar Destination</Link></li>
       <li><Link to="/chef-training" className="footer__link">Chef Training (Waitlist)</Link></li>
       <li><Link to="/certification" className="footer__link">Certifications &amp; Careers</Link></li>
       <li><Link to="/gallery" className="footer__link">Photo &amp; Video Gallery</Link></li>
       <li><Link to="/faq" className="footer__link">Frequently Asked Questions</Link></li>
       <li><Link to="/contact" className="footer__link">Contact &amp; Enrollment</Link></li>
      </ul>
     </div>

     {/* Col 3: Programs */}
     <div className="footer__links-col">
      <h4 className="footer__col-title">Our Programs</h4>
      <ul className="footer__links">
       <li><Link to="/barista-training" className="footer__link">Foundation Barista Course</Link></li>
       <li><Link to="/barista-training" className="footer__link">Professional Barista Diploma</Link></li>
       <li><Link to="/barista-training" className="footer__link">Latte Art &amp; Sensory Masterclass</Link></li>
       <li><Link to="/cafe-bar-training" className="footer__link">Bartending &amp; Cocktail Mixology</Link></li>
       <li><Link to="/cafe-bar-training" className="footer__link">Flair Bartending Showmanship</Link></li>
       <li><Link to="/chef-training" className="footer__link">Commercial Cookery &amp; Kitchen</Link></li>
      </ul>
     </div>

     {/* Col 4: Visit & Hours */}
     <div className="footer__links-col">
      <h4 className="footer__col-title">Visit &amp; Contact</h4>
      <p className="footer__contact-line">Bravo Barista School &amp; Café</p>
      <p className="footer__contact-line">+977 980-0000000</p>
      <p className="footer__contact-line">info@bravocafebar.com</p>
      <div className="footer__hours-box">
       <strong>Operational Timings:</strong>
       <span>Training: Mon–Sat 7:00 AM – 6:30 PM</span>
       <span>Café &amp; Bar: Everyday 8:00 AM – 10:00 PM</span>
      </div>
     </div>
    </div>

    {/* Bottom Bar */}
    <div className="footer__bottom">
     <p className="footer__copy">
      © {new Date().getFullYear()} Bravo Barista School &amp; Café &amp; Bar. All Rights Reserved. Built with pride in Nepal.
     </p>

     <button className="footer__back-top" onClick={scrollToTop} aria-label="Back to top of page">
      Back to Top ↑
     </button>
    </div>
   </div>
  </footer>
 );
};

export default Footer;
