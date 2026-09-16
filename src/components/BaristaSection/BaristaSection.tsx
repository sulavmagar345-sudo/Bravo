import React from 'react';
import './BaristaSection.css';
import { IMAGES } from '../../data/images';

const BaristaSection: React.FC = () => {
 const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
 };

 return (
  <section id="barista-training" className="barista section section--dark" aria-labelledby="barista-heading">
   <div className="container">
    <div className="barista__layout">
     {/* Images grid */}
     <div className="barista__imgs reveal">
      <div className="barista__img-main">
       <img
        src={IMAGES.baristaTraining3}
        alt="Student learning milk steaming technique at Bravo"
        className="barista__img"
        loading="lazy"
       />
      </div>
      <div className="barista__img-side">
       <div className="barista__img-top">
        <img
         src={IMAGES.latteArt}
         alt="Beautiful latte art cups at Bravo Barista School"
         className="barista__img"
         style={{ objectPosition: 'center 60%' }}
         loading="lazy"
        />
       </div>
       <div className="barista__img-bottom">
        <img
         src={IMAGES.certificateIndividual}
         alt="Graduate holding certificate at Bravo Barista School"
         className="barista__img"
         style={{ objectPosition: 'center 20%' }}
         loading="lazy"
        />
       </div>
      </div>
     </div>

     {/* Text */}
     <div className="barista__text text-light reveal reveal-delay-2">
      <span className="eyebrow eyebrow--light">Barista Training</span>
      <h2 id="barista-heading">
       Become a <br />
       <em className="barista__highlight">Certified Barista</em>
      </h2>
      <div className="divider" />
      <p>
       Bravo Barista School offers Nepal's most practical, hands-on barista training — taught
       inside our own café with professional-grade equipment. Learn from experienced baristas
       and walk away with a certificate, real skills, and the confidence to work anywhere in
       the world.
      </p>

      <div className="barista__perks">
       {[
        { title: 'Professional Equipment', desc: 'FAEMA commercial machines, pro grinders' },
        { title: 'Recognized Certificate', desc: 'Industry-valued barista certification' },
        { title: 'Specialty Coffee Focus', desc: 'Espresso, pour-over, cold brew & more' },
        { title: 'Global Career Ready', desc: 'Skills accepted by international cafés' },
       ].map((perk, i) => (
        <div key={i} className="barista__perk">
         <strong>{perk.title}</strong>
         <span>{perk.desc}</span>
        </div>
       ))}
      </div>

      <div className="barista__ctas">
       <button
        className="btn btn--primary"
        onClick={() => scrollTo('#enrollment')}
       >
        Enroll Now <span className="btn-arrow">→</span>
       </button>
       <button
        className="btn btn--outline"
        onClick={() => scrollTo('#gallery')}
       >
        See Student Work
       </button>
      </div>
     </div>
    </div>
   </div>
  </section>
 );
};

export default BaristaSection;
