import React from 'react';
import './Certification.css';
import { IMAGES } from '../../data/images';

const CAREER_DESTINATIONS = [
 { flag: '🇳🇵', country: 'Nepal', role: 'Head Barista, Specialty Café Owner, Trainer' },
 { flag: '🇦🇪', country: 'Dubai & UAE', role: 'Luxury Hotel Barista, Beverage Specialist' },
 { flag: '🇶🇦', country: 'Qatar & Gulf', role: 'Resort Barista, Bartender, Mixologist' },
 { flag: '🇦🇺', country: 'Australia', role: 'Specialty Café Barista (High Hourly Pay)' },
 { flag: '🇨🇦', country: 'Canada', role: 'Café Lead, Hospitality Professional' },
 { flag: '🇯🇵', country: 'Japan', role: 'Artisanal Coffee Barista & Service' },
];

const CERT_BENEFITS = [
 {
  title: 'Recognized by Employers Worldwide',
  desc: 'Our certificates verify rigorous hands-on operational hours on commercial espresso machines and bar stations.',
 },
 {
  title: 'Lifetime Alumni Network & Job Board',
  desc: 'Get exclusive access to hospitality openings across Nepal and recommendations for overseas visa work opportunities.',
 },
 {
  title: 'Skill Portability & Practical Mastery',
  desc: 'We train on international standard ratios, sensory evaluation, latte art pouring, and bar ergonomics.',
 },
 {
  title: 'Post-Graduation Refresher Practice',
  desc: 'Alumni are always welcome back to practice on our machines before major interviews or trade tests.',
 },
];

const Certification: React.FC = () => {
 const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
 };

 return (
  <section id="certification" className="cert section section--cream" aria-labelledby="cert-heading">
   <div className="container">
    {/* Section Header */}
    <div className="section-header text-center reveal">
     <span className="eyebrow">Credentials &amp; Career Impact</span>
     <h2 id="cert-heading">
      Your Passport to a <em className="cert__highlight">Global Career</em>
     </h2>
     <div className="divider divider--center" />
     <p className="cert__lead-text">
      A Bravo certificate is respected across the hospitality sector. Whether your goal is to launch
      your own dream café in Nepal or land a high-paying barista role in Dubai, Australia, or Canada,
      we equip you with real, verified credentials.
     </p>
    </div>

    {/* Certificate Display Grid */}
    <div className="cert__showcase reveal">
     <div className="cert__img-col">
      <div className="cert__img-card">
       <img
        src={IMAGES.certificates}
        alt="Bravo Barista School Graduation and Official Certificates"
        className="img-cover"
        loading="lazy"
       />
       <div className="cert__caption">
        <strong>Barista Certificate</strong>
        <span>Awarded after completing Barista Training</span>
       </div>
      </div>
      <div className="cert__img-card">
       <img
        src={IMAGES.certificateIndividual}
        alt="Proud student receiving Barista Certificate from Bravo"
        className="img-cover"
        loading="lazy"
       />
       <div className="cert__caption">
        <strong>Café &amp; Bar Certificate</strong>
        <span>Awarded after completing Café &amp; Bar Training</span>
       </div>
      </div>
     </div>

     <div className="cert__details-col">
      <div className="cert__card-box">
       <span className="cert__badge-icon">🎖️</span>
       <h3>What Your Bravo Certificate Validates</h3>
       <ul className="cert__list">
        {CERT_BENEFITS.map((b, i) => (
         <li key={i}>
          <strong>{b.title}:</strong> {b.desc}
         </li>
        ))}
       </ul>

       <div className="cert__guarantee">
        <span className="cert__check"></span>
        <div>
         <strong>Interview &amp; Trade-Test Preparation</strong>
         <p>We train students on simulated practical tests required by international employers and cruise lines.</p>
        </div>
       </div>
      </div>
     </div>
    </div>

    {/* Global Destinations */}
    <div className="cert__destinations reveal reveal-delay-2">
     <h3 className="cert__dest-title text-center">Where Our Alumni Work &amp; Thrive</h3>
     <p className="cert__dest-sub text-center">
      Bravo graduates are powering premium coffee shops, hotel chains, and cocktail bars around the globe.
     </p>

     <div className="cert__dest-grid">
      {CAREER_DESTINATIONS.map((dest, i) => (
       <div key={i} className="cert__dest-card">
        <div className="cert__dest-header">
         <span className="cert__dest-flag">{dest.flag}</span>
         <strong className="cert__dest-country">{dest.country}</strong>
        </div>
        <span className="cert__dest-role">{dest.role}</span>
       </div>
      ))}
     </div>

     <div className="cert__enroll-cta text-center">
      <p>Ready to start your certification journey?</p>
      <button className="brutal-btn" onClick={() => scrollTo('#enrollment')}>
       Enroll in Upcoming Batch <span className="btn-arrow">→</span>
      </button>
     </div>
    </div>
   </div>
  </section>
 );
};

export default Certification;
