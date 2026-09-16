import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import { IMAGES } from '../../data/images';

const Hero: React.FC = () => {
 return (
  <section className="brutal-hero">
   {/* Top technical line */}
   <div className="container">
    <div className="brutal-hero__meta-header">
     <span>BRAVO BARISTA SCHOOL &amp; CAFÉ</span>
     <span className="brutal-hero__year">2019 — 2025</span>
    </div>
    <div className="brutal-hairline" />
   </div>

   <div className="container brutal-hero__main">
    {/* Giant Extruded Headline */}
    <div className="brutal-hero__title-area">
     <div className="brutal-hero__badge-row">
      <span className="brutal-badge">MADE WITH PASSION</span>
      <span className="brutal-badge brutal-badge--white">KATHMANDU, NEPAL</span>
      <span className="brutal-badge">100% PRACTICAL</span>
     </div>

     <h1 className="brutal-hero__h1">
      <span className="extrude-text">COFFEE</span>
      <span className="extrude-text-dark">CRAFT</span>
     </h1>

     <div className="brutal-hero__sub-row">
      <p className="brutal-hero__lead">
       Nepal’s premier hands-on barista school, operational café &amp; mixology bar, and commercial culinary academy.
      </p>
      <div className="brutal-hero__buttons">
       <Link to="/programs" className="brutal-btn">
        Explore Programs <span className="arrow">→</span>
       </Link>
       <Link to="/about" className="brutal-btn brutal-btn--white">
        Our Story ↗
       </Link>
      </div>
     </div>
    </div>

    {/* High-Impact Focal Image in Neo-Brutalist Frame */}
    <div className="brutal-hero__visual">
     <div className="brutal-hero__img-frame">
      <img
       src={IMAGES.hero}
       alt="Barista practicing latte art at Bravo"
       className="brutal-hero__img"
      />
      <div className="brutal-hero__floating-sticker">
       <span className="brutal-badge"> PURE ESPRESSO</span>
      </div>
      <div className="brutal-hero__floating-sticker-bottom">
       <span className="brutal-badge brutal-badge--white">FAEMA GEAR</span>
      </div>
     </div>
    </div>
   </div>

   {/* Marquee Ticker */}
   <div className="brutal-ticker">
    <div className="brutal-ticker__track">
     <span>BRAVO BARISTA SCHOOL SPECIALTY COFFEE WORKING FLAIR BARTENDING CULINARY ARTS 500+ CERTIFIED ALUMNI EST. 2019 KATHMANDU LEARN. CREATE. GROW. </span>
     <span>BRAVO BARISTA SCHOOL SPECIALTY COFFEE WORKING FLAIR BARTENDING CULINARY ARTS 500+ CERTIFIED ALUMNI EST. 2019 KATHMANDU LEARN. CREATE. GROW. </span>
    </div>
   </div>

   {/* 3 Pathway Cards in Neo-Brutalist Style */}
   <div className="container brutal-hero__pathways">
    <div className="brutal-pathways-grid">
     {/* Card 1: Barista */}
     <Link to="/barista-training" className="brutal-path-card">
      <div className="brutal-path-card__badge-bar">
       <span className="brutal-badge"> PROGRAM 01</span>
       <span className="brutal-path-arrow">↗</span>
      </div>
      <div className="brutal-path-img-wrap">
       <img src={IMAGES.baristaTraining1} alt="Barista Training" />
      </div>
      <h3>BARISTA TRAINING</h3>
      <p>Master espresso extraction, milk microfoam, and latte art on commercial FAEMA machines.</p>
      <span className="brutal-path-link">View Full Syllabus →</span>
     </Link>

     {/* Card 2: Café & Bar */}
     <Link to="/cafe-bar" className="brutal-path-card brutal-path-card--lime">
      <div className="brutal-path-card__badge-bar">
       <span className="brutal-badge brutal-badge--white">🍺 DESTINATION</span>
       <span className="brutal-path-arrow">↗</span>
      </div>
      <div className="brutal-path-img-wrap">
       <img src={IMAGES.cafeInterior} alt="Bravo Café & Bar" />
      </div>
      <h3>CAFÉ &amp; BAR</h3>
      <p>Artisan coffee, loaded shakes, cocktails, live acoustic music, and flair bartending shows.</p>
      <span className="brutal-path-link">Explore Café Experience →</span>
     </Link>

     {/* Card 3: Chef Training */}
     <Link to="/chef-training" className="brutal-path-card">
      <div className="brutal-path-card__badge-bar">
       <span className="brutal-badge"> COMING SOON</span>
       <span className="brutal-path-arrow">↗</span>
      </div>
      <div className="brutal-path-img-wrap">
       <img src={IMAGES.groupTraining1} alt="Chef Training Waitlist" />
      </div>
      <h3>CHEF TRAINING</h3>
      <p>Commercial kitchen training, knife skills, 5 mother sauces, and HACCP food hygiene.</p>
      <span className="brutal-path-link">Join Priority Waitlist →</span>
     </Link>
    </div>
   </div>
  </section>
 );
};

export default Hero;
