import React, { useState } from 'react';
import './Testimonials.css';
import { IMAGES } from '../../data/images';

interface Testimonial {
 name: string;
 role: string;
 currentWork: string;
 img: string;
 quote: string;
 rating: number;
 course: string;
 batch: string;
}

const TESTIMONIALS: Testimonial[] = [
 {
  name: 'Aayush Shrestha',
  role: 'Senior Barista',
  currentWork: 'Dubai Marina Luxury Resort, UAE',
  img: IMAGES.baristaTraining1,
  quote:
   'Joining Bravo was the turning point for my hospitality career. The live café practice made all the difference. When I had my practical trade test for Dubai, pulling shots and steaming velvety milk was second nature to me.',
  rating: 5,
  course: 'Barista Professional Course',
  batch: 'Batch of 2022',
 },
 {
  name: 'Pooja Thapa',
  role: 'Specialty Café Founder',
  currentWork: 'The Daily Grind, Pokhara',
  img: IMAGES.certificateIndividual,
  quote:
   'I wanted to open my own boutique coffee shop in Lakeside Pokhara. Bravo did not just teach me latte art; the mentors taught me machine maintenance, bean extraction science, menu pricing, and customer service.',
  rating: 5,
  course: 'Barista & Café Operations',
  batch: 'Batch of 2021',
 },
 {
  name: 'Bikash Gurung',
  role: 'Head Mixologist & Flair Bartender',
  currentWork: 'Sky Lounge Kathmandu',
  img: IMAGES.barAction,
  quote:
   'The flair bartending training at Bravo is unmatched in Nepal. The trainers give individual attention, pushing your boundaries with cocktail science and performance showmanship.',
  rating: 5,
  course: 'Café & Bar Bartending',
  batch: 'Batch of 2023',
 },
 {
  name: 'Roshani KC',
  role: 'Barista & Shift Supervisor',
  currentWork: 'Specialty Roastery, Sydney, Australia',
  img: IMAGES.baristaTraining3,
  quote:
   'Australian coffee standards are extremely competitive. Bravo’s intensive training on sensory evaluation, grind calibration, and free-pour art helped me land a job in Sydney within my first week of landing!',
  rating: 5,
  course: 'Comprehensive Barista Program',
  batch: 'Batch of 2023',
 },
];

const Testimonials: React.FC = () => {
 const [activeIdx, setActiveIdx] = useState(0);

 return (
  <section id="testimonials" className="testimonials section section--gray" aria-labelledby="testimonials-heading">
   <div className="container">
    {/* Header */}
    <div className="section-header text-center reveal">
     <span className="eyebrow">Alumni Success</span>
     <h2 id="testimonials-heading">
      Stories From Our <em className="testimonials__highlight">Graduates</em>
     </h2>
     <div className="divider divider--center" />
     <p className="testimonials__sub">
      Over 500 graduates have launched rewarding careers around the world. Hear what our alumni have to say.
     </p>
    </div>

    {/* Featured Testimonial Slider / Spotlight */}
    <div className="testimonials__spotlight reveal">
     <div className="testimonials__spotlight-card">
      <div className="testimonials__avatar-col">
       <div className="testimonials__avatar-wrap">
        <img
         src={TESTIMONIALS[activeIdx].img}
         alt={TESTIMONIALS[activeIdx].name}
         className="testimonials__avatar-img"
        />
       </div>
       <div className="testimonials__batch-badge">
        {TESTIMONIALS[activeIdx].batch}
       </div>
      </div>

      <div className="testimonials__content-col">
       <div className="testimonials__stars">
        {''.repeat(TESTIMONIALS[activeIdx].rating)}
       </div>

       <blockquote className="testimonials__quote">
        "{TESTIMONIALS[activeIdx].quote}"
       </blockquote>

       <div className="testimonials__author-info">
        <strong className="testimonials__author-name">
         {TESTIMONIALS[activeIdx].name}
        </strong>
        <span className="testimonials__author-role">
         {TESTIMONIALS[activeIdx].role} • {TESTIMONIALS[activeIdx].currentWork}
        </span>
        <span className="testimonials__author-course">
         Completed: {TESTIMONIALS[activeIdx].course}
        </span>
       </div>
      </div>
     </div>

     {/* Navigation Dots */}
     <div className="testimonials__nav">
      {TESTIMONIALS.map((_, i) => (
       <button
        key={i}
        className={`testimonials__nav-dot ${i === activeIdx ? 'active' : ''}`}
        onClick={() => setActiveIdx(i)}
        aria-label={`Show testimonial ${i + 1}`}
       />
      ))}
     </div>
    </div>

    {/* Grid cards for quick review */}
    <div className="testimonials__grid reveal reveal-delay-2">
     {TESTIMONIALS.map((item, i) => (
      <div
       key={i}
       className={`testimonials__mini-card ${i === activeIdx ? 'selected' : ''}`}
       onClick={() => setActiveIdx(i)}
      >
       <div className="testimonials__mini-header">
        <img
         src={item.img}
         alt={item.name}
         className="testimonials__mini-thumb"
        />
        <div>
         <strong>{item.name}</strong>
         <span>{item.currentWork}</span>
        </div>
       </div>
       <p className="testimonials__mini-snippet">
        "{item.quote.slice(0, 90)}..."
       </p>
      </div>
     ))}
    </div>
   </div>
  </section>
 );
};

export default Testimonials;
