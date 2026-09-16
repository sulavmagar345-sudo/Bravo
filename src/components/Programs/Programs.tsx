import React, { useState } from 'react';
import './Programs.css';
import { IMAGES } from '../../data/images';

interface ProgramFeature {
 icon: string;
 text: string;
}

interface Program {
 id: string;
 icon: string;
 category: string;
 title: string;
 subtitle: string;
 desc: string;
 features: ProgramFeature[];
 image: string;
 imagePosition?: string;
 badge?: string;
 badgeType?: 'active' | 'coming-soon';
 cta: string;
 ctaTarget: string;
 duration?: string;
 level?: string;
}

const PROGRAMS: Program[] = [
 {
  id: 'barista-training',
  icon: '',
  category: 'Program 01',
  title: 'Barista Training',
  subtitle: 'Professional Coffee Certification',
  desc: 'Learn espresso extraction, milk steaming, latte art, and manual brew methods in a live café setting. Our hands-on curriculum takes you from coffee fundamentals to professional barista techniques used in top specialty coffee shops.',
  features: [
   { icon: '', text: 'Espresso theory & extraction science' },
   { icon: '', text: 'Milk steaming, texturing & latte art' },
   { icon: '', text: 'Manual brewing: V60, AeroPress, Chemex' },
   { icon: '', text: 'Coffee tasting & sensory skills' },
   { icon: '', text: 'Menu creation & café operations' },
   { icon: '', text: 'Industry-recognized certificate' },
  ],
  image: IMAGES.baristaTraining2,
  imagePosition: 'center 30%',
  badgeType: 'active',
  badge: 'Enrolling Now',
  cta: 'Enroll in Barista Training',
  ctaTarget: '#enrollment',
  duration: '2–4 Weeks',
  level: 'Beginner to Advanced',
 },
 {
  id: 'cafe-bar-training',
  icon: '',
  category: 'Program 02',
  title: 'Café & Bar Training',
  subtitle: 'Hospitality & Bar Operations',
  desc: 'Experience real café and bar service from the inside. Learn cocktail and mocktail preparation, bar operations, customer service, and the hospitality skills required to excel in the F&B industry.',
  features: [
   { icon: '', text: 'Cocktail & mocktail preparation' },
   { icon: '', text: 'Bar setup, operations & inventory' },
   { icon: '', text: 'Customer interaction & service standards' },
   { icon: '', text: 'Flair bartending fundamentals' },
   { icon: '', text: 'Café management principles' },
   { icon: '', text: 'Practical bar shift experience' },
  ],
  image: IMAGES.cafeLive,
  imagePosition: 'center center',
  badgeType: 'active',
  badge: 'Enrolling Now',
  cta: 'Enroll in Café & Bar',
  ctaTarget: '#enrollment',
  duration: '2–4 Weeks',
  level: 'Beginner to Intermediate',
 },
 {
  id: 'chef-training',
  icon: '',
  category: 'Program 03',
  title: 'Chef Training',
  subtitle: 'Culinary Arts & Kitchen Operations',
  desc: 'Our upcoming chef training program will cover culinary fundamentals, kitchen operations, food safety, and creative plating — preparing you for a successful career in the culinary arts.',
  features: [
   { icon: '', text: 'Culinary fundamentals & knife skills' },
   { icon: '', text: 'Kitchen operations & food safety' },
   { icon: '', text: 'Baking, pastry & dessert basics' },
   { icon: '', text: 'Menu planning & recipe development' },
   { icon: '', text: 'Food presentation & plating' },
   { icon: '', text: 'Professional kitchen experience' },
  ],
  image: IMAGES.groupTraining2,
  imagePosition: 'center 20%',
  badgeType: 'coming-soon',
  badge: 'Coming Soon',
  cta: 'Notify Me When Available',
  ctaTarget: '#enrollment',
  duration: 'TBA',
  level: 'Beginner to Intermediate',
 },
];

const Programs: React.FC = () => {
 const [activeTab, setActiveTab] = useState<string>('barista-training');
 const active = PROGRAMS.find(p => p.id === activeTab)!;

 const scrollTo = (target: string) => {
  const el = document.querySelector(target);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
 };

 return (
  <section id="programs" className="programs section section--cream" aria-labelledby="programs-heading">
   <div className="container">
    {/* Heading */}
    <div className="section-heading reveal">
     <span className="eyebrow">Our Programs</span>
     <h2 id="programs-heading">Three Pathways to Your Dream Career</h2>
     <div className="divider divider--center" />
     <p>
      Whether you want to craft world-class coffee, run a vibrant café, or lead a kitchen —
      Bravo has the training pathway for you.
     </p>
    </div>

    {/* Tab Navigation */}
    <div className="programs__tabs reveal" role="tablist" aria-label="Programs">
     {PROGRAMS.map((prog) => (
      <button
       key={prog.id}
       role="tab"
       aria-selected={activeTab === prog.id}
       aria-controls={`panel-${prog.id}`}
       id={`tab-${prog.id}`}
       className={`programs__tab${activeTab === prog.id ? ' programs__tab--active' : ''}${prog.badgeType === 'coming-soon' ? ' programs__tab--soon' : ''}`}
       onClick={() => setActiveTab(prog.id)}
      >
       <span className="programs__tab-icon">{prog.icon}</span>
       <span className="programs__tab-label">{prog.title}</span>
       {prog.badge && (
        <span className={`badge badge--${prog.badgeType === 'active' ? 'active' : 'coming-soon'} programs__tab-badge`}>
         {prog.badge}
        </span>
       )}
      </button>
     ))}
    </div>

    {/* Active Program Detail */}
    <div
     key={active.id}
     id={active.id}
     className="programs__detail reveal"
     role="tabpanel"
     aria-labelledby={`tab-${active.id}`}
    >
     <div className="programs__detail-content">
      {/* Left: text */}
      <div className="programs__detail-text">
       <span className="eyebrow">{active.category}</span>
       <h3>{active.title}</h3>
       <p className="programs__detail-subtitle">{active.subtitle}</p>
       <p className="programs__detail-desc">{active.desc}</p>

       {/* Meta pills */}
       <div className="programs__meta">
        {active.duration && (
         <span className="programs__meta-pill">
          Duration: <strong>{active.duration}</strong>
         </span>
        )}
        {active.level && (
         <span className="programs__meta-pill">
          Level: <strong>{active.level}</strong>
         </span>
        )}
       </div>

       {/* Features */}
       <ul className="programs__features">
        {active.features.map((f, i) => (
         <li key={i} className="programs__feature">
          <span className="programs__feature-num">{String(i + 1).padStart(2, '0')}</span>
          <span>{f.text}</span>
         </li>
        ))}
       </ul>

       {/* CTAs */}
       <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
         className={`brutal-btn ${active.badgeType === 'coming-soon' ? 'brutal-btn--dark' : ''}`}
         onClick={() => scrollTo(active.ctaTarget)}
        >
         {active.cta} <span className="btn-arrow">→</span>
        </button>
        <a
         href={`#/${active.id}`}
         className="brutal-btn brutal-btn--white"
        >
         Full Syllabus Page ↗
        </a>
       </div>
      </div>

      {/* Right: image */}
      <div className="programs__detail-img-wrap">
       <img
        src={active.image}
        alt={`${active.title} at Bravo`}
        className="programs__detail-img"
        style={{ objectPosition: active.imagePosition || 'center' }}
        loading="lazy"
       />
       {active.badgeType === 'coming-soon' && (
        <div className="programs__img-overlay">
         <span className="badge badge--coming-soon">Coming Soon</span>
        </div>
       )}
      </div>
     </div>
    </div>
   </div>
  </section>
 );
};

export default Programs;
