import React from 'react';
import './ChefSection.css';
import { IMAGES } from '../../data/images';

interface ChefSectionProps {
 onOpenWaitlist?: (courseName: string) => void;
}

const CHEF_MODULES = [
 {
  icon: '',
  title: 'Culinary Fundamentals & Knife Skills',
  desc: 'Master classic knife cuts, station organization, mise-en-place, and kitchen safety protocols.',
 },
 {
  icon: '',
  title: 'Commercial Cookery & Hot Kitchen',
  desc: 'Continental, Asian, and Mediterranean cooking methods, sauce bases, grilling, and sautéing.',
 },
 {
  icon: '🥗',
  title: 'Food Safety, Hygiene & HACCP',
  desc: 'International hygiene standards, food handling certifications, temperature control, and cross-contamination prevention.',
 },
 {
  icon: '',
  title: 'Plating Artistry & Presentation',
  desc: 'Modern aesthetics, color theory, texture pairing, and restaurant-quality presentation standards.',
 },
];

const ChefSection: React.FC<ChefSectionProps> = ({ onOpenWaitlist }) => {
 const handleWaitlistClick = () => {
  if (onOpenWaitlist) {
   onOpenWaitlist('Professional Chef Training');
  } else {
   const el = document.querySelector('#contact');
   if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
 };

 return (
  <section id="chef-training" className="chef-section section section--dark" aria-labelledby="chef-heading">
   <div className="container">
    <div className="chef__grid">
     {/* Content side */}
     <div className="chef__content reveal">
      <div className="chef__badge-row">
       <span className="badge badge--gold">Coming Soon</span>
       <span className="badge badge--outline-light">Pre-Registration Open</span>
      </div>

      <h2 id="chef-heading" className="chef__title">
       Professional <br />
       <span className="chef__title-gold">Chef &amp; Culinary Arts</span> Training
      </h2>

      <p className="chef__desc">
       Following the massive success of Bravo Barista School, we are launching our fully equipped
       commercial culinary department. Learn kitchen craftsmanship, international cuisines, and kitchen
       management from professional head chefs.
      </p>

      <div className="chef__modules">
       {CHEF_MODULES.map((mod, i) => (
        <div key={i} className="chef__mod-item">
         <span className="chef__mod-icon">{mod.icon}</span>
         <div>
          <h4 className="chef__mod-title">{mod.title}</h4>
          <p className="chef__mod-desc">{mod.desc}</p>
         </div>
        </div>
       ))}
      </div>

      <div className="chef__cta-box">
       <div className="chef__cta-info">
        <strong>Be the First in Line</strong>
        <p>Limited seats per batch for personalized, intensive kitchen station training.</p>
       </div>
       <button className="btn btn--primary" onClick={handleWaitlistClick}>
        Join the Priority Waitlist <span className="btn-arrow">→</span>
       </button>
      </div>
     </div>

     {/* Visual Showcase side */}
     <div className="chef__visual reveal reveal-delay-2">
      <div className="chef__card-feature">
       <div className="chef__img-wrap">
        <img
         src={IMAGES.cafeInterior}
         alt="Bravo Culinary Arts and Kitchen Training Space"
         className="chef__img"
         loading="lazy"
        />
        <div className="chef__img-overlay" />
       </div>

       <div className="chef__floating-card">
        <div className="chef__floating-header">
         <span className="chef__floating-dot" />
         <span className="chef__floating-tag">Curriculum Preview</span>
        </div>
        <ul className="chef__floating-list">
         <li> 8-Week Intensive Hands-on Program</li>
         <li> Global Commercial Kitchen Equipment</li>
         <li> Industry Certificate &amp; Internship Placement</li>
         <li> Pre-booking discount for the first 15 students</li>
        </ul>
       </div>
      </div>
     </div>
    </div>
   </div>
  </section>
 );
};

export default ChefSection;
