import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const VALUES = [
 {
  num: '01',
  title: '100% PRACTICAL IMMERSION',
  desc: 'No dry textbook memorization. Every student practices directly on commercial multi-group machines in our active café.',
 },
 {
  num: '02',
  title: 'GLOBAL RECOGNITION',
  desc: 'Our certificates open doors in Nepal, the UAE, Qatar, Australia, Canada, and international luxury hospitality lines.',
 },
 {
  num: '03',
  title: 'MASTER MENTORSHIP',
  desc: 'Trained by seasoned baristas and champion mixologists with real competition and commercial bar experience.',
 },
 {
  num: '04',
  title: 'LIFELONG ALUMNI NETWORK',
  desc: 'Access to refresher practice hours before job interviews, job placement referrals, and mentorship.',
 },
];

const TRAINERS = [
 {
  name: 'Mr. Chandra Wagle',
  role: 'Head Barista Mentor',
  exp: '8+ Years Industry Experience',
  desc: 'Focuses on espresso extraction physics, grind calibration, sensory cupping, and competition latte art.',
 },
 {
  name: 'Master Mixologist',
  role: 'Bar & Flair Beverage Instructor',
  exp: '10+ Years Industry Experience',
  desc: 'Luxury hotel background, cocktail chemistry, live bottle flair showmanship, and bar operations.',
 },
 {
  name: 'Executive Culinary Lead',
  role: 'Commercial Kitchen Instructor',
  exp: '12+ Years Industry Experience',
  desc: 'Continental and Asian cookery expert, station discipline, HACCP food hygiene, and knife mastery.',
 },
];

const AboutPage: React.FC = () => {
 return (
  <div className="brutal-about-page">
   {/* 1. TOP OF ABOUT ICON: THE VIDEO */}
   <section className="about-video-hero">
    <div className="container">
     <div className="about-meta-row">
      <span className="brutal-badge">ABOUT BRAVO</span>
      <span className="brutal-badge brutal-badge--white">ESTABLISHED 2019</span>
      <span className="brutal-badge">KATHMANDU, NEPAL</span>
     </div>

     <h1 className="about-main-title">
      <span className="extrude-text">ABOUT</span> BRAVO
     </h1>

     <div className="brutal-hairline" />

     {/* THE VIDEO FRAME AT THE VERY TOP */}
     <div className="about-video-container">
      <div className="about-video-header">
       <span className="about-video-tag"> BRAVO IN ACTION (PRACTICAL TRAINING)</span>
       <span className="about-video-res">1080P HD</span>
      </div>
      <div className="about-video-frame">
       <video
        controls
        autoPlay
        muted
        loop
        playsInline
        className="about-video-element"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
       >
        <source
         src="/assets/AQMMqaPfj01ksylGcqLS_dIJNYi5oHxrzMI-ZmQyJ0KAOH95JilAIPO9Ruy3gukWc1ORwiUwbP8UmkBD0_nPDIsJrz_38RN6aBEwZKtrzV1g8w.mp4"
         type="video/mp4"
        />
        Your browser does not support HTML5 video.
       </video>
      </div>
     </div>

     {/* 2. DIRECTLY UNDER THE VIDEO: THE PARAGRAPH & STORY */}
     <div className="about-story-block">
      <span className="brutal-badge">OUR MISSION</span>
      <h2 className="about-story-heading">SHAPING NEPAL'S COFFEE TALENTS SINCE 2019</h2>

      <p className="about-story-lead">
       Bravo was founded in 2019 to bridge the massive gap between traditional hospitality
       classrooms and the high-energy reality of commercial specialty cafés and cocktail bars.
      </p>

      <p className="about-story-text">
       Too many institutes teach students on small domestic appliances in empty classrooms. When students
       land interviews in Dubai, Qatar, Australia, or high-volume local roasteries, they often struggle with
       speed and commercial machinery. Bravo combines an accredited academy with an active, bustling café
       and bar right on campus. Every student extracts on commercial FAEMA multi-group espresso machines,
       dials in commercial conical burr grinders, and works real customer rushes.
      </p>

      <div className="about-metrics-bar">
       <div className="about-metric">
        <span className="metric-num">500+</span>
        <span className="metric-label">Graduates Certified</span>
       </div>
       <div className="about-metric">
        <span className="metric-num">6+</span>
        <span className="metric-label">Years of Excellence</span>
       </div>
       <div className="about-metric">
        <span className="metric-num">100%</span>
        <span className="metric-label">Hands-on Practice</span>
       </div>
       <div className="about-metric">
        <span className="metric-num">95%</span>
        <span className="metric-label">Placement Support</span>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* 3. UNDER THE STORY: OTHER THINGS (VALUES, TRAINERS, EQUIPMENT) */}
   <section className="brutal-section brutal-section--white">
    <div className="container">
     <div className="section-header-brutal">
      <span className="brutal-badge">CORE PRINCIPLES</span>
      <h2>THE BRAVO CODE</h2>
     </div>

     <div className="about-values-grid">
      {VALUES.map((v, i) => (
       <div key={i} className="brutal-card">
        <span className="about-val-num">{v.num}</span>
        <h3>{v.title}</h3>
        <p>{v.desc}</p>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Trainers */}
   <section className="brutal-section brutal-section--paper">
    <div className="container">
     <div className="section-header-brutal">
      <span className="brutal-badge">FACULTY</span>
      <h2>MEET YOUR MENTORS</h2>
     </div>

     <div className="about-trainers-grid">
      {TRAINERS.map((t, i) => (
       <div key={i} className="brutal-card brutal-card--lavender">
        <div className="trainer-badge-row">
         <span className="brutal-badge">{t.exp}</span>
        </div>
        <h3>{t.name}</h3>
        <strong className="trainer-sub">{t.role}</strong>
        <p>{t.desc}</p>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Equipment Spec Box */}
   <section className="brutal-section brutal-section--dark">
    <div className="container">
     <div className="about-equipment-box">
      <span className="brutal-badge">COMMERCIAL GEAR</span>
      <h2>PRACTICE ON HEAVYWEIGHT EQUIPMENT</h2>
      <p className="equipment-lead">
       We train you on the exact industrial equipment standard across the world:
      </p>

      <div className="equipment-grid">
       <div className="equip-item">
        <strong>FAEMA Multi-Group Machines</strong>
        <span>Rotary pump pressure, independent saturated boilers &amp; precision steam wands.</span>
       </div>
       <div className="equip-item">
        <strong>On-Demand Burr Grinders</strong>
        <span>Micrometric step calibration for dialing in extraction times.</span>
       </div>
       <div className="equip-item">
        <strong>Specialty Pour-Over Bar</strong>
        <span>Hario V60, Chemex, Aeropress &amp; digital precision scales.</span>
       </div>
       <div className="equip-item">
        <strong>Commercial Bar Speed Rails</strong>
        <span>Boston shakers, jiggers, muddlers &amp; flair practice bottles.</span>
       </div>
      </div>

      <div className="about-cta-row">
       <Link to="/contact" className="brutal-btn">
        Enroll for Upcoming Batch ↗
       </Link>
       <a
        href="https://wa.me/9779800000000?text=Hi%20Bravo,%20I%20would%20like%20to%20visit%20the%20training%20school."
        target="_blank"
        rel="noopener noreferrer"
        className="brutal-btn brutal-btn--white"
       >
        WhatsApp Us to Visit School
       </a>
      </div>
     </div>
    </div>
   </section>
  </div>
 );
};

export default AboutPage;
