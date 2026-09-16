import React, { useState } from 'react';
import PageBanner from '../components/PageBanner/PageBanner';
import { IMAGES } from '../data/images';
import './BaristaPage.css';

const SYLLABUS_MODULES = [
 {
  num: '01',
  title: 'Coffee Science & Bean Botany',
  topics: [
   'Arabica vs. Robusta species and processing methods (Washed, Natural, Honey)',
   'Roast profiles and flavor characteristics',
   'Bean freshness, degassing, and storage standards',
   'Sensory tasting and cupping methodology',
  ],
 },
 {
  num: '02',
  title: 'Espresso Calibration & Extraction',
  topics: [
   'Dosing, distribution, and level tamping technique',
   'Dialing in commercial on-demand burr grinders',
   'Brew ratios, extraction yields, water temperature and TDS',
   'Diagnosing under-extraction (sour) vs. over-extraction (bitter)',
  ],
 },
 {
  num: '03',
  title: 'Milk Chemistry & Velvety Microfoam',
  topics: [
   'Milk composition: proteins, fats, and temperature thresholds (60-65°C)',
   'Aeration vs. texturing technique with high-pressure steam wands',
   'Creating glossy, wet-paint consistency microfoam',
   'Alternative plant-based milks (Oat, Almond, Soy) foaming science',
  ],
 },
 {
  num: '04',
  title: 'Latte Art Mastery',
  topics: [
   'Pitcher ergonomics, cup angle, and pour height dynamics',
   'Core free-pour designs: Monk’s Head, Heart, Solid Tulip',
   'Advanced multi-tier designs: Winged Tulip, Rosetta, Swan',
   'Speed pouring under high-pressure café orders',
  ],
 },
 {
  num: '05',
  title: 'Manual & Filter Brewing Methods',
  topics: [
   'Pour-over mechanics using Hario V60 & Chemex',
   'Immersion brewing: French Press & Aeropress variables',
   'Cold brew extraction and nitro infusion techniques',
   'Water chemistry, filtration, and grind sizing for filter coffee',
  ],
 },
 {
  num: '06',
  title: 'Commercial Machine Care & Bar Speed',
  topics: [
   'Daily group head backflushing, shower screen and gasket cleaning',
   'Grinder burr inspection and deep cleaning protocol',
   'Workflow ergonomics for 50+ drinks per hour peak rushes',
   'Hospitality service etiquette and order sequencing',
  ],
 },
];

const COURSE_TIERS = [
 {
  name: 'Foundation Barista',
  duration: '2 Weeks (Intensive)',
  hours: '30+ Practical Hours',
  badge: 'Popular',
  desc: 'Ideal for coffee lovers, beginners, or candidates seeking quick job entry in local cafés.',
  features: [
   'Espresso calibration basics',
   'Milk texturing fundamentals',
   'Heart & basic tulip latte art',
   'Classic espresso drink menu',
   'Bravo Foundation Certificate',
  ],
 },
 {
  name: 'Professional Barista Diploma',
  duration: '4 Weeks (Comprehensive)',
  hours: '70+ Practical Hours',
  badge: 'Most Recommended',
  desc: 'Our flagship complete program designed for overseas work (Dubai, Australia, Europe) or future café owners.',
  features: [
   'Everything in Foundation course',
   'Advanced multi-tier latte art (Rosetta, Swan)',
   'Manual pour-over & filter bar brewing',
   'Commercial machine troubleshooting',
   'Live café shifts serving real customers',
   'Official Bravo Professional Diploma',
   'Job placement & trade-test interview prep',
  ],
 },
 {
  name: 'Latte Art Masterclass',
  duration: '1 Week (Advanced)',
  hours: '15 Focused Hours',
  badge: 'Specialist',
  desc: 'Designed for working baristas wanting to level up their competition-grade pouring skills.',
  features: [
   'Intensive pouring drills',
   'Pattern symmetry and contrast tuning',
   'High-tier designs: Winged swans, sea horses',
   'Speed and competition routine coaching',
   'Masterclass Certification',
  ],
 },
];

const BaristaPage: React.FC = () => {
 const [enrolledTier, setEnrolledTier] = useState('Professional Barista Diploma');
 const [formSent, setFormSent] = useState(false);
 const [studentInfo, setStudentInfo] = useState({ name: '', phone: '', slot: 'morning' });

 const handleEnrollSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setFormSent(true);
 };

 return (
  <div className="barista-page">
   <PageBanner
    icon=""
    badge="Accredited Training"
    title="Professional Barista Training"
    subtitle="Learn the art and science of specialty coffee from master baristas inside an active commercial café. 100% practical, globally recognized."
    bgImage={IMAGES.hero}
    breadcrumbs={[{ label: 'Programs', path: '/programs' }, { label: 'Barista Training' }]}
   />

   {/* Overview & Highlights */}
   <section className="section section--white">
    <div className="container">
     <div className="barista-overview reveal">
      <div className="barista-overview__content">
       <span className="eyebrow">Real Skills. Real Coffee.</span>
       <h2>Why Train at Bravo Barista School?</h2>
       <div className="divider" />
       <p className="lead">
        Unlike ordinary classroom-based institutes that teach on domestic machines, Bravo trains
        you inside a live café environment using commercial FAEMA multi-group espresso machines
        and high-precision conical/flat burr grinders.
       </p>
       <p>
        You won't just memorize drink recipes. You will calibrate grinder micron settings to match
        atmospheric humidity, taste espresso extraction sweet spots, steam milk to silky microfoam
        perfection, and pour intricate latte art with muscle memory.
       </p>

       <div className="barista-highlights-grid">
        <div className="b-high-card">
         <span className="b-high-num">1:1</span>
         <strong>Machine Access</strong>
         <span>Dedicated commercial workstation time for every student</span>
        </div>
        <div className="b-high-card">
         <span className="b-high-num">500+</span>
         <strong>Graduates Placed</strong>
         <span>Working in Nepal, UAE, Qatar, Australia &amp; beyond</span>
        </div>
        <div className="b-high-card">
         <span className="b-high-num">100%</span>
         <strong>Hands-on Practice</strong>
         <span>Unlimited beans and milk supplied for practice</span>
        </div>
       </div>
      </div>

      <div className="barista-overview__img-col reveal reveal-delay-2">
       <div className="b-img-stack">
        <img
         src={IMAGES.baristaTraining3}
         alt="Student practicing milk steaming at Bravo"
         className="b-img-main"
        />
        <img
         src={IMAGES.latteArt}
         alt="Latte art creation"
         className="b-img-sub"
        />
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Course Tiers */}
   <section className="section section--gray">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Select Your Level</span>
      <h2>Available Barista Programs</h2>
      <div className="divider divider--center" />
      <p className="section-subtitle">
       Choose the program that best matches your timeline, budget, and career goals.
      </p>
     </div>

     <div className="course-tiers-grid">
      {COURSE_TIERS.map((tier, i) => (
       <div
        key={i}
        className={`tier-card ${tier.badge === 'Most Recommended' ? 'tier-card--featured' : ''} reveal`}
       >
        {tier.badge && <span className="tier-badge">{tier.badge}</span>}
        <h3 className="tier-title">{tier.name}</h3>
        <div className="tier-meta">
         <span className="tier-duration">{tier.duration}</span>
         <span className="tier-hours">{tier.hours}</span>
        </div>
        <p className="tier-desc">{tier.desc}</p>
        <ul className="tier-features">
         {tier.features.map((f, fi) => (
          <li key={fi}> {f}</li>
         ))}
        </ul>
        <a
         href="#enroll-now"
         className={`btn ${tier.badge === 'Most Recommended' ? 'btn--primary' : 'btn--outline-dark'} btn--full`}
         onClick={() => setEnrolledTier(tier.name)}
        >
         Choose {tier.name}
        </a>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Curriculum Syllabus */}
   <section className="section section--white">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Step-by-Step Curriculum</span>
      <h2>What You Will Master</h2>
      <div className="divider divider--center" />
      <p className="section-subtitle">
       Structured modules designed to take you from foundational basics to expert commercial barista.
      </p>
     </div>

     <div className="syllabus-grid">
      {SYLLABUS_MODULES.map((mod, i) => (
       <div key={i} className="syllabus-card reveal">
        <span className="syllabus-num">{mod.num}</span>
        <h4 className="syllabus-title">{mod.title}</h4>
        <ul className="syllabus-list">
         {mod.topics.map((t, ti) => (
          <li key={ti}>{t}</li>
         ))}
        </ul>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Practice Gallery Showcase */}
   <section className="section section--cream">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Real Photos from Our Bar</span>
      <h2>Students in Action</h2>
      <div className="divider divider--center" />
     </div>

     <div className="barista-photo-grid reveal">
      <img src={IMAGES.baristaTraining1} alt="Barista training session" className="b-grid-img" />
      <img src={IMAGES.baristaTraining2} alt="Espresso machine practice" className="b-grid-img" />
      <img src={IMAGES.latteArtRow} alt="Latte art row display" className="b-grid-img" />
      <img src={IMAGES.certificateIndividual} alt="Graduate with certificate" className="b-grid-img" />
     </div>
    </div>
   </section>

   {/* Enrollment Form Section */}
   <section id="enroll-now" className="section section--dark">
    <div className="container">
     <div className="barista-enroll-box reveal">
      <div className="b-enroll-info">
       <span className="eyebrow eyebrow--light">Upcoming Batch Registration</span>
       <h2 className="text-light">Reserve Your Spot Today</h2>
       <p>
        Our batches maintain a strict maximum limit of 6 to 8 students per station to ensure
        sufficient individual hands-on machine practice.
       </p>
       <div className="b-enroll-perks">
        <div>All ingredients (coffee & milk) included</div>
        <div>Official Certificate issued upon completion</div>
        <div>Free WhatsApp consultation & course syllabus PDF</div>
       </div>
      </div>

      <div className="b-enroll-form-wrap">
       {!formSent ? (
        <form onSubmit={handleEnrollSubmit} className="b-enroll-form">
         <h3>Quick Application</h3>
         <div className="form-group">
          <label>Selected Program</label>
          <select
           value={enrolledTier}
           onChange={(e) => setEnrolledTier(e.target.value)}
          >
           {COURSE_TIERS.map((t, i) => (
            <option key={i} value={t.name}>
             {t.name} ({t.duration})
            </option>
           ))}
          </select>
         </div>

         <div className="form-group">
          <label>Your Full Name *</label>
          <input
           type="text"
           required
           placeholder="e.g. Anil Shrestha"
           value={studentInfo.name}
           onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
          />
         </div>

         <div className="form-group">
          <label>Phone / WhatsApp Number *</label>
          <input
           type="tel"
           required
           placeholder="e.g. 98XXXXXXXX"
           value={studentInfo.phone}
           onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
          />
         </div>

         <div className="form-group">
          <label>Preferred Batch Slot</label>
          <select
           value={studentInfo.slot}
           onChange={(e) => setStudentInfo({ ...studentInfo, slot: e.target.value })}
          >
           <option value="morning">Morning (7:30 AM - 10:30 AM)</option>
           <option value="midday">Afternoon (11:30 AM - 2:30 PM)</option>
           <option value="evening">Evening (3:30 PM - 6:30 PM)</option>
           <option value="weekend">Weekend Special</option>
          </select>
         </div>

         <button type="submit" className="btn btn--primary btn--full">
          Confirm Seat Reservation <span className="btn-arrow">→</span>
         </button>
        </form>
       ) : (
        <div className="b-enroll-success">
         <div className="b-success-icon"></div>
         <h4>Reservation Received!</h4>
         <p>
          Thank you, <strong>{studentInfo.name}</strong>! We will contact you at{' '}
          <strong>{studentInfo.phone}</strong> with batch dates and fee details.
         </p>
         <a
          href={`https://wa.me/9779800000000?text=Hi%20Bravo,%20I%20just%20applied%20for%20${encodeURIComponent(
           enrolledTier
          )}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary"
         >
          Direct WhatsApp Chat
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

export default BaristaPage;
