import React, { useState } from 'react';
import PageBanner from '../components/PageBanner/PageBanner';
import { IMAGES } from '../data/images';
import './CafeBarTrainingPage.css';

const BAR_MODULES = [
 {
  num: '01',
  title: 'Mixology & Cocktail Foundations',
  desc: 'Spirit classification (Vodka, Gin, Rum, Tequila, Whiskey, Brandy), bitters, liqueurs, dilution ratios, and balance of sweet vs. sour.',
 },
 {
  num: '02',
  title: 'Live Flair Bartending & Showmanship',
  desc: 'Working flair for fast service, bottle spins, tin catches, pour precision without jiggers, and exhibition stage routines.',
 },
 {
  num: '03',
  title: 'Coffee & Alcohol Fusion',
  desc: 'Crafting premium coffee-based cocktails: signature Espresso Martinis, Irish Coffee, Coffee Negroni, and liqueur frappes.',
 },
 {
  num: '04',
  title: 'Ice Carving & Glassware Science',
  desc: 'Types of clear ice, chilling glassware, smoking guns, garnish dehydration, and Instagram-worthy modern presentations.',
 },
 {
  num: '05',
  title: 'Bar Inventory & Profit Costing',
  desc: 'Managing spirits inventory, reducing pour shrinkage, POS system management, beverage menu engineering, and hygiene standards.',
 },
 {
  num: '06',
  title: 'Hospitality Service & Career Prep',
  desc: 'Customer psychology, responsible service of alcohol (RSA), working high-volume shifts, and preparing for overseas bar contracts.',
 },
];

const isValidName = (v: string) => {
  const t = v.trim();
  if (t.length < 2 || t.length > 60) return false;
  if (!/[\p{L}]/u.test(t)) return false;
  if (!/^[\p{L}\s'.-]+$/u.test(t)) return false;
  return true;
};
const isValidPhone = (v: string) => {
  const digits = v.replace(/[\s\-()]/g, '');
  const stripped = digits.startsWith('+') ? digits.slice(1) : digits;
  if (!/^\d+$/.test(stripped)) return false;
  if (stripped.length < 7 || stripped.length > 15) return false;
  return true;
};

const CafeBarTrainingPage: React.FC = () => {
  const [formSent, setFormSent] = useState(false);
  const [info, setInfo] = useState({ name: '', phone: '', timing: 'evening' });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    const trimmedName = info.name.trim();
    const trimmedPhone = info.phone.trim();
    if (!isValidName(trimmedName)) nextErrors.name = 'Please enter a valid name (2–60 letters, spaces, hyphen or apostrophe).';
    if (!isValidPhone(trimmedPhone)) nextErrors.phone = 'Please enter a valid phone number (7–15 digits, may start with +).';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setInfo({ ...info, name: trimmedName, phone: trimmedPhone });
    setFormSent(true);
  };

  return (
    <div className="cafebar-training-page">
      <PageBanner
        icon=""
        badge="Mixology & Hospitality"
        title="Café & Bar Bartending Course"
        subtitle="Learn from champion mixologists inside our operational bar. Master classic cocktails, working flair, mocktails, and high-energy bar service."
        breadcrumbs={[{ label: 'Programs', path: '/programs' }, { label: 'Café & Bar Training' }]}
      />

   {/* Hero Split Section */}
   <section className="section section--white">
    <div className="container">
     <div className="cb-split reveal">
      <div className="cb-split__text">
       <span className="eyebrow">Beyond Ordinary Bartending</span>
       <h2>Step Behind an Authentic Operational Bar</h2>
       <div className="divider" />
       <p className="lead">
        Bravo is proud to house one of the only hospitality institutes in Nepal with an active,
        nightly operational café and cocktail bar.
       </p>
       <p>
        Our students don't practice with water-filled colored bottles in empty rooms. You train on
        real bar rails, working with commercial shaker sets, glassware, fruit purées, and mock/real
        spirits. From crafting the silky foam of a whiskey sour to performing crowd-pleasing bottle
        flairs, you will graduate with true stage confidence.
       </p>

       <div className="cb-stats-row">
        <div className="cb-stat-pill">
         <strong>4 Weeks</strong>
         <span>Intensive Hands-On</span>
        </div>
        <div className="cb-stat-pill">
         <strong>40+ Drinks</strong>
         <span>Mastery Catalog</span>
        </div>
        <div className="cb-stat-pill">
         <strong>Global Ready</strong>
         <span>Cruise &amp; Resort Standard</span>
        </div>
       </div>
      </div>

      <div className="cb-split__media reveal reveal-delay-2">
       <div className="cb-media-card">
        <img
         src={IMAGES.cafeBar}
         alt="Bravo Bartender performing live flair"
         className="cb-media-img"
        />
        <div className="cb-media-tag">
         <span>Live Flair Practice</span>
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Modules Grid */}
   <section className="section section--gray">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Comprehensive Syllabus</span>
      <h2>What You Will Learn</h2>
      <div className="divider divider--center" />
      <p className="section-subtitle">
       Every technique needed to thrive as a bartender or beverage specialist worldwide.
      </p>
     </div>

     <div className="cb-modules-grid">
      {BAR_MODULES.map((mod, i) => (
       <div key={i} className="cb-module-card reveal">
        <span className="cb-mod-num">{mod.num}</span>
        <h4>{mod.title}</h4>
        <p>{mod.desc}</p>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Drinks Showcase */}
   <section className="section section--cream">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Signature Creations</span>
      <h2>From Classic Cocktails to Modern Mocktails</h2>
      <div className="divider divider--center" />
     </div>

     <div className="cb-gallery-grid reveal">
      <div className="cb-gallery-item">
       <img src={IMAGES.barCocktail} alt="Craft Cocktail" />
       <span>Craft Cocktails</span>
      </div>
      <div className="cb-gallery-item">
       <img src={IMAGES.shakes2} alt="Specialty Café Drinks" />
       <span>Artisan Shakes &amp; Frappes</span>
      </div>
      <div className="cb-gallery-item">
       <img src={IMAGES.barTraining} alt="Bar Training station" />
       <span>Pour &amp; Speed Stations</span>
      </div>
      <div className="cb-gallery-item">
       <img src={IMAGES.cafeLive} alt="Live Bar Event" />
       <span>Live Event Hospitality</span>
      </div>
     </div>
    </div>
   </section>

   {/* Quick Application */}
   <section className="section section--dark">
    <div className="container">
     <div className="cb-cta-box reveal">
      <div className="cb-cta-text">
       <span className="eyebrow eyebrow--light">Upcoming Bartending Batch</span>
       <h2 className="text-light">Start Your Bar Career Today</h2>
       <p>
        Seats are strictly limited to ensure every trainee has individual speed rail and bar station access.
        Reserve your slot or message us on WhatsApp for fee structures and class timings.
       </p>
       <div className="cb-perk-checks">
        <span> Complete bar kit &amp; practice ingredients provided</span>
        <span> Internationally recognized bartending certificate</span>
        <span> Direct links to hotel, lounge &amp; resort employers</span>
       </div>
      </div>

      <div className="cb-cta-form">
       {!formSent ? (
        <form onSubmit={handleSubmit}>
         <h3>Reserve Your Slot</h3>
          <div className="form-group">
            <label htmlFor="cafebar-name">Full Name *</label>
            <input
              id="cafebar-name"
              type="text"
              required
              placeholder="Your name"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
              autoComplete="name"
              inputMode="text"
              maxLength={60}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'cafebar-name-error' : undefined}
            />
            {errors.name && <span id="cafebar-name-error" className="form-error" role="alert">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="cafebar-phone">Phone / WhatsApp *</label>
            <input
              id="cafebar-phone"
              type="tel"
              required
              placeholder="e.g. 98XXXXXXXX"
              value={info.phone}
              onChange={(e) => setInfo({ ...info, phone: e.target.value })}
              autoComplete="tel"
              inputMode="numeric"
              maxLength={20}
              pattern="\+?[0-9\s\-()]{7,20}"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'cafebar-phone-error' : undefined}
            />
            {errors.phone && <span id="cafebar-phone-error" className="form-error" role="alert">{errors.phone}</span>}
          </div>
         <div className="form-group">
          <label>Preferred Shift</label>
          <select
           value={info.timing}
           onChange={(e) => setInfo({ ...info, timing: e.target.value })}
          >
           <option value="morning">Morning (8:00 AM - 11:00 AM)</option>
           <option value="afternoon">Afternoon (1:00 PM - 4:00 PM)</option>
           <option value="evening">Evening / Weekend Special</option>
          </select>
         </div>
         <button type="submit" className="btn btn--primary btn--full">
          Apply for Bartending Course <span className="btn-arrow">→</span>
         </button>
        </form>
       ) : (
        <div className="cb-form-success">
         <div className="b-success-icon"></div>
         <h4>Application Submitted!</h4>
         <p>
          Thank you, <strong>{info.name}</strong>! We will message you on WhatsApp to confirm your batch.
         </p>
         <a
          href={`https://wa.me/9779802004823?text=Hi%20Bravo,%20I%20am%20interested%20in%20the%20Café%20and%20Bar%20Bartending%20course.`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary"
         >
          Chat on WhatsApp Now
         </a>
        </div>
       )}
      </div>
     </div>
    </div>
   </section>
  </div>
 );
};

export default CafeBarTrainingPage;
