import React from 'react';
import './Stats.css';

const STATS = [
 { value: '500+', label: 'Graduates', desc: 'Certified baristas & hospitality professionals' },
 { value: '6+', label: 'Years', desc: 'Of quality training since 2019' },
 { value: '3', label: 'Programs', desc: 'Barista, café & bar, and culinary training' },
 { value: '100%', label: 'Hands-On', desc: 'Real café environment training' },
];

const Stats: React.FC = () => (
 <section className="stats section--dark" aria-label="Key statistics">
  <div className="container">
   <div className="stats__grid">
    {STATS.map((s, i) => (
     <div key={i} className="stats__item reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
      <span className="stats__value">{s.value}</span>
      <span className="stats__label">{s.label}</span>
      <span className="stats__desc">{s.desc}</span>
     </div>
    ))}
   </div>
  </div>
 </section>
);

export default Stats;
