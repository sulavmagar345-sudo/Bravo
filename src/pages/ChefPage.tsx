import React, { useState } from 'react';
import PageBanner from '../components/PageBanner/PageBanner';
import { IMAGES } from '../data/images';
import './ChefPage.css';

const CHEF_CURRICULUM = [
 {
  num: '01',
  title: 'Knife Techniques & Mise-en-Place',
  desc: 'Julienne, brunoise, chiffonade, tourne, knife sharpening on whetstones, kitchen station setup, and ergonomic cutting speed.',
 },
 {
  num: '02',
  title: 'The 5 Mother Sauces & Stocks',
  desc: 'Béchamel, Velouté, Espagnole, Tomato, and Hollandaise. Brown veal stock, white chicken stock, fish fumet, and reduction glazes.',
 },
 {
  num: '03',
  title: 'Hot Kitchen & Pan Mechanics',
  desc: 'Sautéing, pan-searing, braising, poaching, grilling, temperature control, resting meats, and timing complex multi-component tickets.',
 },
 {
  num: '04',
  title: 'Continental & Global Cuisines',
  desc: 'Classic French foundations, Italian pasta and risotto, modern Mediterranean grill, and pan-Asian wok cookery.',
 },
 {
  num: '05',
  title: 'HACCP, Food Safety & Hygiene',
  desc: 'Cross-contamination protocols, food microbiology, walk-in refrigerator temperatures, labeling, sanitization, and regulatory audits.',
 },
 {
  num: '06',
  title: 'Modern Plating Artistry & Plating',
  desc: 'Color contrast, negative space, height architecture, purée swooshes, micro-herb placement, and restaurant service standards.',
 },
];

const ChefPage: React.FC = () => {
 const [waitlistSent, setWaitlistSent] = useState(false);
 const [chefData, setChefData] = useState({ name: '', phone: '', email: '', exp: 'beginner' });

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setWaitlistSent(true);
 };

 return (
  <div className="chef-page">
   <PageBanner
    icon=""
    badge="Coming Soon • Pre-Registration Open"
    title="Professional Chef &amp; Culinary Arts"
    subtitle="Step into our commercial kitchen stations. Learn knife mastery, global cooking techniques, kitchen management, and food hygiene from seasoned head chefs."
    bgImage={IMAGES.cafeInterior}
    breadcrumbs={[{ label: 'Programs', path: '/programs' }, { label: 'Chef Training' }]}
   />

   {/* Vision Split */}
   <section className="section section--white">
    <div className="container">
     <div className="chef-split reveal">
      <div className="chef-split__text">
       <span className="eyebrow">The Culinary Evolution</span>
       <h2>Commercial Kitchen Training in Nepal</h2>
       <div className="divider" />
       <p className="lead">
        After certifying hundreds of successful baristas and bartenders, Bravo is expanding its
        proven hands-on training model to the culinary arts.
       </p>
       <p>
        Professional cooking requires more than recipes — it demands muscle memory, speed, timing,
        heat control, and immaculate hygiene. Our purpose-built commercial kitchen features individual
        burner ranges, stainless steel prep stations, combi ovens, and commercial refrigeration to simulate
        the intensity of real restaurant lines.
       </p>

       <div className="chef-stats">
        <div className="chef-stat-card">
         <span className="chef-stat-val">8 Weeks</span>
         <strong>Intensive Diploma</strong>
         <span>Comprehensive practical training</span>
        </div>
        <div className="chef-stat-card">
         <span className="chef-stat-val">1:1</span>
         <strong>Station Access</strong>
         <span>Individual burner and prep counter</span>
        </div>
        <div className="chef-stat-card">
         <span className="chef-stat-val">100%</span>
         <strong>Kitchen Ready</strong>
         <span>HACCP &amp; Commercial standards</span>
        </div>
       </div>
      </div>

      <div className="chef-split__visual reveal reveal-delay-2">
       <div className="chef-visual-card">
        <img
         src={IMAGES.cafeInterior}
         alt="Bravo Culinary Training Space"
         className="chef-visual-img"
        />
        <div className="chef-visual-badge">
         <span>Commercial Kitchen Facility</span>
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Curriculum Grid */}
   <section className="section section--gray">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Curriculum Outline</span>
      <h2>What You Will Master in the Kitchen</h2>
      <div className="divider divider--center" />
      <p className="section-subtitle">
       Structured modules designed by executive chefs to prepare you for international resort and restaurant kitchens.
      </p>
     </div>

     <div className="chef-curriculum-grid">
      {CHEF_CURRICULUM.map((item, i) => (
       <div key={i} className="chef-curr-card reveal">
        <span className="chef-curr-num">{item.num}</span>
        <h4>{item.title}</h4>
        <p>{item.desc}</p>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Waitlist Form */}
   <section className="section section--dark">
    <div className="container">
     <div className="chef-waitlist-wrap reveal">
      <div className="chef-waitlist-info">
       <span className="badge badge--gold">Limited Seats</span>
       <h2 className="text-light">Join the Priority Batch Waitlist</h2>
       <p>
        To maintain our high standard of individual attention, each culinary batch will be capped at
        just 10 students. Pre-registered candidates receive:
       </p>
       <ul className="chef-perk-list">
        <li>15% Early Bird Tuition Discount</li>
        <li> Professional Chef Knife Starter Set</li>
        <li>First priority on morning/evening batch selection</li>
        <li>Direct internship placement assistance</li>
       </ul>
      </div>

      <div className="chef-waitlist-form-card">
       {!waitlistSent ? (
        <form onSubmit={handleSubmit} className="chef-form">
         <h3>Pre-Register Today</h3>
         <div className="form-group">
          <label>Full Name *</label>
          <input
           type="text"
           required
           placeholder="Your full name"
           value={chefData.name}
           onChange={(e) => setChefData({ ...chefData, name: e.target.value })}
          />
         </div>
         <div className="form-row">
          <div className="form-group">
           <label>Phone / WhatsApp *</label>
           <input
            type="tel"
            required
            placeholder="98XXXXXXXX"
            value={chefData.phone}
            onChange={(e) => setChefData({ ...chefData, phone: e.target.value })}
           />
          </div>
          <div className="form-group">
           <label>Email</label>
           <input
            type="email"
            placeholder="name@email.com"
            value={chefData.email}
            onChange={(e) => setChefData({ ...chefData, email: e.target.value })}
           />
          </div>
         </div>
         <div className="form-group">
          <label>Culinary Background</label>
          <select
           value={chefData.exp}
           onChange={(e) => setChefData({ ...chefData, exp: e.target.value })}
          >
           <option value="beginner">Total Beginner / Home Cook</option>
           <option value="some">Some Kitchen / Restaurant Experience</option>
           <option value="hospitality">Hospitality Student / Graduate</option>
           <option value="abroad">Preparing for Abroad Cookery Studies</option>
          </select>
         </div>
         <button type="submit" className="btn btn--primary btn--full">
          Join Priority Waitlist <span className="btn-arrow">→</span>
         </button>
        </form>
       ) : (
        <div className="chef-waitlist-success">
         <div className="b-success-icon"></div>
         <h4>You're on the Priority List!</h4>
         <p>
          Thank you, <strong>{chefData.name}</strong>! You are registered for early-bird admission.
          We will notify you on WhatsApp as soon as kitchen commissioning dates are announced.
         </p>
         <a
          href="https://wa.me/9779800000000?text=Hi%20Bravo,%20I%20just%20joined%20the%20Chef%20Training%20waitlist."
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary"
         >
          Ask Questions on WhatsApp
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

export default ChefPage;
