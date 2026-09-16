import React from 'react';
import './CafeBar.css';
import { IMAGES } from '../../data/images';

const HIGHLIGHTS = [
 {
  img: IMAGES.latteArt,
  imgPos: 'center 60%',
  icon: '',
  title: 'Specialty Coffee',
  desc: 'Expertly crafted espresso drinks, lattes, cold brews and seasonal specials.',
 },
 {
  img: IMAGES.milkshakes,
  imgPos: 'center center',
  icon: '🧋',
  title: 'Café Drinks',
  desc: 'Milkshakes, frappes, mocktails and refreshing iced beverages made fresh.',
 },
 {
  img: IMAGES.barCocktail,
  imgPos: 'center 30%',
  icon: '',
  title: 'Bar Cocktails',
  desc: 'A curated selection of cocktails, mocktails and spirits served in style.',
 },
 {
  img: IMAGES.cafeBar,
  imgPos: 'center center',
  icon: '',
  title: 'Flair Bar Shows',
  desc: 'Spectacular live flair bartending that brings the bar to life.',
 },
];

const CafeBar: React.FC = () => {
 const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
 };

 return (
  <section id="cafe-bar" className="cafebar section section--gray" aria-labelledby="cafebar-heading">
   <div className="container">
    {/* Header */}
    <div className="cafebar__header reveal">
     <div className="cafebar__header-text">
      <span className="eyebrow">Café &amp; Bar</span>
      <h2 id="cafebar-heading">
       More Than a School —<br />
       <em className="cafebar__highlight">A Destination</em>
      </h2>
      <div className="divider" />
      <p>
       Bravo Café &amp; Bar is a fully operating café and bar where training meets
       real hospitality. Sit down for a perfect cup, sip a crafted cocktail, or watch
       our flair bartenders at work. Established since 2019, it's the heartbeat of
       everything we do.
      </p>
     </div>
     <div className="cafebar__header-img reveal reveal-delay-2">
      <img
       src={IMAGES.cafeInterior}
       alt="Bravo Café & Bar interior atmosphere"
       className="cafebar__hero-img"
       loading="lazy"
      />
     </div>
    </div>

    {/* Highlights grid */}
    <div className="cafebar__grid">
     {HIGHLIGHTS.map((h, i) => (
      <div
       key={i}
       className="cafebar__card card reveal"
       style={{ transitionDelay: `${i * 0.1}s` }}
      >
       <div className="cafebar__card-img-wrap">
        <img
         src={h.img}
         alt={h.title}
         className="img-cover"
         style={{ objectPosition: h.imgPos }}
         loading="lazy"
        />
       </div>
       <div className="cafebar__card-body">
        <span className="cafebar__card-icon">{h.icon}</span>
        <h4 className="cafebar__card-title">{h.title}</h4>
        <p className="cafebar__card-desc">{h.desc}</p>
       </div>
      </div>
     ))}
    </div>

    {/* CTA Banner */}
    <div className="cafebar__cta-banner reveal">
     <div className="cafebar__cta-img-wrap">
      <img
       src={IMAGES.teamCafe}
       alt="Bravo Café & Bar team"
       className="cafebar__cta-img"
       loading="lazy"
      />
     </div>
     <div className="cafebar__cta-text">
      <h3>Train. Serve. Experience.</h3>
      <p>
       Our students don't just study in a classroom — they work in our live café and bar,
       serving real customers, under the mentorship of professional baristas and bartenders.
      </p>
      <div className="cafebar__cta-btns">
       <button
        className="btn btn--primary"
        onClick={() => scrollTo('#cafe-bar-training')}
       >
        Café &amp; Bar Training <span className="btn-arrow">→</span>
       </button>
       <button
        className="btn btn--outline-dark"
        onClick={() => scrollTo('#contact')}
       >
        Find Us
       </button>
      </div>
     </div>
    </div>
   </div>
  </section>
 );
};

export default CafeBar;
