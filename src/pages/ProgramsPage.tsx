import React from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner/PageBanner';
import { IMAGES } from '../data/images';
import './ProgramsPage.css';

const PROGRAMS_DATA = [
 {
  num: '01',
  title: 'Barista Professional Training',
  path: '/barista-training',
  tag: 'Flagship Course',
  duration: '2 to 4 Weeks',
  hours: '30 - 70+ Practical Hours',
  cert: 'Certified Barista Diploma',
  desc: 'Master espresso extraction, grinder calibration, milk texturing, latte art, and manual brewing inside our active café.',
  highlights: ['Commercial FAEMA machine training', 'Unlimited practice milk & beans', 'Free-pour latte art mastery', 'International job placement prep'],
  img: IMAGES.baristaTraining3,
 },
 {
  num: '02',
  title: 'Café & Bar Bartending',
  path: '/cafe-bar-training',
  tag: 'Hospitality & Mixology',
  duration: '4 Weeks',
  hours: '50+ Practical Hours',
  cert: 'Professional Bartender Certificate',
  desc: 'Learn classic & signature cocktail mixology, speed bar ergonomics, craft mocktails, and live bottle flair showmanship.',
  highlights: ['Operating behind a real live bar', 'Working flair & bottle tricks', 'Coffee & spirit cocktail infusion', 'Cruise line & resort trade-test prep'],
  img: IMAGES.barAction,
 },
 {
  num: '03',
  title: 'Professional Chef & Culinary Arts',
  path: '/chef-training',
  tag: 'Pre-Registration Open',
  duration: '8 Weeks',
  hours: '120+ Practical Hours',
  cert: 'Commercial Culinary Diploma',
  desc: 'Step into our commercial kitchen for intensive knife training, stock & sauce foundations, continental cookery, and HACCP food safety.',
  highlights: ['Individual burner & prep station', 'Continental & Asian hot kitchens', 'Food hygiene & temperature safety', 'Early bird 15% discount waitlist'],
  img: IMAGES.cafeInterior,
 },
];

const COMPARISON_ROWS = [
 { feature: 'Core Focus', barista: 'Espresso, Latte Art & Brewing', cafebar: 'Cocktails, Mixology & Flair', chef: 'Commercial Cookery & Hot Kitchen' },
 { feature: 'Practical Training %', barista: '100% Hands-On', cafebar: '100% Hands-On', chef: '100% Commercial Kitchen' },
 { feature: 'Class Duration', barista: '2 - 4 Weeks', cafebar: '4 Weeks', chef: '8 Weeks' },
 { feature: 'Equipment Used', barista: 'Multi-group commercial espresso machines', cafebar: 'Live bar speed rails & shakers', chef: 'Commercial ranges, combi ovens' },
 { feature: 'Batch Size Limit', barista: 'Max 8 students', cafebar: 'Max 8 students', chef: 'Max 10 students' },
 { feature: 'Target Careers', barista: 'Cafés, Specialty Roasteries, Australia/Dubai', cafebar: 'Lounges, Luxury Hotels, Cruise Ships', chef: 'Fine Dining, Resort Kitchens, Culinary Abroad' },
];

const ProgramsPage: React.FC = () => {
 return (
  <div className="programs-page">
   <PageBanner
    icon=""
    badge="Career Pathways"
    title="Training Programs &amp; Diplomas"
    subtitle="Compare our specialized hospitality tracks. Built around real-world commercial equipment and dedicated individual practice."
    bgImage={IMAGES.groupTraining2}
    breadcrumbs={[{ label: 'Programs' }]}
   />

   {/* Program Cards */}
   <section className="section section--white">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Find Your Path</span>
      <h2>Choose Your Specialty</h2>
      <div className="divider divider--center" />
      <p className="section-subtitle">
       Every course at Bravo is designed with career mobility, verified credentials, and high practical standards in mind.
      </p>
     </div>

     <div className="program-cards-grid">
      {PROGRAMS_DATA.map((p, i) => (
       <div key={i} className="prog-detail-card reveal">
        <div className="prog-detail-img-wrap">
         <img src={p.img} alt={p.title} />
         <span className="prog-detail-tag">{p.tag}</span>
        </div>
        <div className="prog-detail-body">
         <span className="prog-detail-num">{p.num}</span>
         <h3>{p.title}</h3>
         <p className="prog-detail-desc">{p.desc}</p>

         <div className="prog-detail-meta">
          <div>
           <small>Duration</small>
           <strong>{p.duration}</strong>
          </div>
          <div>
           <small>Practice</small>
           <strong>{p.hours}</strong>
          </div>
         </div>

         <ul className="prog-detail-features">
          {p.highlights.map((h, hi) => (
           <li key={hi}>— {h}</li>
          ))}
         </ul>

         <Link to={p.path} className="btn btn--primary btn--full">
          View Course Details <span className="btn-arrow">→</span>
         </Link>
        </div>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Comparison Table */}
   <section className="section section--gray">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Side-by-Side Comparison</span>
      <h2>Program Feature Comparison</h2>
      <div className="divider divider--center" />
     </div>

     <div className="table-responsive reveal">
      <table className="comp-table">
       <thead>
        <tr>
         <th>Feature</th>
         <th> Barista Training</th>
         <th> Café &amp; Bar Training</th>
         <th> Chef Training</th>
        </tr>
       </thead>
       <tbody>
        {COMPARISON_ROWS.map((row, i) => (
         <tr key={i}>
          <td className="comp-feature-name">{row.feature}</td>
          <td>{row.barista}</td>
          <td>{row.cafebar}</td>
          <td>{row.chef}</td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>

     <div className="comp-cta text-center reveal">
      <p>Not sure which track is the best fit for your background?</p>
      <a
       href="https://wa.me/9779800000000?text=Hi%20Bravo,%20can%20you%20guide%20me%20on%20which%20program%20is%20best%20for%20me?"
       target="_blank"
       rel="noopener noreferrer"
       className="btn btn--primary"
      >
       Free Counselor Consultation on WhatsApp
      </a>
     </div>
    </div>
   </section>
  </div>
 );
};

export default ProgramsPage;
