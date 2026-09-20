import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../data/images';
import { fetchAllProgramStatuses } from '../admin/services/programs';
import { ENROLLMENT_STATUS_LABELS } from '../admin/types';
import type { ProgramStatus } from '../admin/types';
import './ProgramsPage.css';

const PROGRAMS = [
  {
    number: '01',
    title: 'Barista Training',
    meta: '2–4 weeks · Beginner to advanced · Certificate',
    description: 'Master the art and science of specialty coffee on commercial FAEMA machines in a live café environment.',
    label: "What You'll Learn",
    points: [
      'Coffee bean science and roast profiles',
      'Espresso extraction and grinder calibration',
      'Milk texturing and microfoam technique',
      'Free-pour latte art (hearts, tulips, rosettas)',
      'Manual brewing: V60, AeroPress, Chemex',
    ],
    image: IMAGES.groupTraining1,
    alt: 'Students with FAEMA espresso machine and crafted lattes during barista training',
    path: '/barista-training',
    slug: 'barista-training',
  },
  {
    number: '02',
    title: 'Café & Bar Training',
    meta: '2–4 weeks · Beginner to intermediate · Certificate',
    description: 'Train behind a real operational bar serving live customers. Learn cocktails, mocktails, and hospitality service.',
    label: "What You'll Learn",
    points: [
      'Classic cocktails and mocktail preparation',
      'Working flair bartending and bottle techniques',
      'Bar operations and inventory management',
      'Customer service and hospitality standards',
      'Speed rail workflows and order sequencing',
    ],
    image: IMAGES.baristaTraining3,
    alt: 'Student preparing iced beverages at the bar during café and bar training',
    path: '/cafe-bar-training',
    slug: 'cafe-bar-training',
  },
  {
    number: '03',
    title: 'Chef Training',
    meta: 'Coming soon · Culinary foundations · Pre-registration',
    description: 'Commercial kitchen training with individual stations. Learn culinary fundamentals, food safety, and plating artistry.',
    label: "What You'll Learn",
    points: [
      'Professional knife skills and mise-en-place',
      'The 5 mother sauces and stock preparation',
      'Hot kitchen techniques: sauté, braise, grill',
      'HACCP food safety and hygiene protocols',
      'Modern plating and presentation techniques',
    ],
    image: IMAGES.cafeInterior,
    alt: 'Bravo hospitality interior — closest available real asset representing future kitchen training environment',
    path: '/chef-training',
    slug: 'chef-training',
  },
];

const ProgramsPage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [statuses, setStatuses] = useState<Record<string, ProgramStatus>>({});

  useEffect(() => {
    fetchAllProgramStatuses().then(data => {
      const map: Record<string, ProgramStatus> = {};
      data.forEach(p => { map[p.slug] = p; });
      setStatuses(map);
    }).catch(console.error);

    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="programs-page" ref={rootRef}>
      {/* Compact hero — editorial, not full-screen */}
      <section className="programs-hero" aria-labelledby="programs-hero-title">
        <div className="container">
          <div className="programs-hero__inner" data-reveal>
            <p className="home-kicker">What we teach</p>
            <h1 id="programs-hero-title">Our Programs</h1>
            <p className="programs-hero__lede">Professional hands-on training for coffee, café, bar and culinary careers.</p>
          </div>
        </div>
      </section>

      {/* Program directory — alternating editorial */}
      <section className="programs-directory" aria-labelledby="programs-directory-title">
        <h2 id="programs-directory-title" className="programs-sr-only">Program directory</h2>
        <div className="container">
          <div className="prog-list">
            {PROGRAMS.map((program, index) => (
              <article
                key={program.number}
                className={`prog ${index % 2 === 1 ? 'prog--reverse' : ''}`}
                data-reveal
              >
                {/* IMAGE FIRST in DOM for mobile order */}
                <figure className="prog__image">
                  <img src={program.image} alt={program.alt} loading="lazy" />
                </figure>
                <div className="prog__copy">
                  <span className="prog__number">{program.number}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0 }}>{program.title}</h3>
                    {statuses[program.slug] && statuses[program.slug].enrollment_status !== 'hidden' && (
                      <span className={`admin-badge admin-badge--${statuses[program.slug].enrollment_status}`} style={{ fontSize: '0.65rem' }}>
                        {ENROLLMENT_STATUS_LABELS[statuses[program.slug].enrollment_status]}
                      </span>
                    )}
                  </div>
                  <p className="prog__meta">{program.meta}</p>
                  <p className="prog__desc">{program.description}</p>
                  <p className="prog__label">{program.label}</p>
                  <ul className="prog__points">
                    {program.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <Link className="home-text-link prog__cta" to={program.path}>
                    Want to know more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA — compact, reuses homepage closing tokens */}
      <section className="programs-closing" aria-labelledby="programs-closing-title">
        <div className="container">
          <div className="programs-closing__inner" data-reveal>
            <p className="home-kicker home-kicker--light">Your next chapter</p>
            <h2 id="programs-closing-title">Ready to Start Your Journey?</h2>
            <p>Choose the program that fits your goals.</p>
            <div className="programs-closing__actions">
              <Link className="btn btn--cream" to="/barista-training">
                Explore a Program
              </Link>
              <Link className="btn btn--outline-light" to="/contact">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;
