import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../data/images';
import './CertificationPage.css';

/* ─── DATA ──────────────────────────────────────────────── */

const REVIEWS = [
  {
    name: 'Aayush Shrestha',
    location: 'Dubai, UAE',
    text: 'Bravo gave me the skills and confidence to land a job at a 5-star hotel in Dubai. The live café practice made all the difference.',
  },
  {
    name: 'Pooja Thapa',
    location: 'Pokhara, Nepal',
    text: 'Bravo taught me machine maintenance, bean extraction science, menu pricing, and customer service. Everything I needed to open my own café.',
  },
  {
    name: 'Bikash Gurung',
    location: 'Kathmandu, Nepal',
    text: 'The flair bartending training at Bravo is unmatched in Nepal. Individual attention with cocktail science and real performance showmanship.',
  },
  {
    name: 'Roshani KC',
    location: 'Sydney, Australia',
    text: "Bravo's training on sensory evaluation, grind calibration, and free-pour art helped me land a job in Sydney within my first week.",
  },
];

const FAQS = [
  {
    question: 'What programs include certification?',
    answer: 'Certification is awarded upon successful completion of our Barista Training and Café & Bar Training programs.'
  },
  {
    question: 'How is certification awarded?',
    answer: 'Certificates are awarded based on practical demonstration of skills, attendance, and successful completion of the training curriculum.'
  },
  {
    question: 'When do students receive their certificate?',
    answer: 'Students receive their official certificate on the final day of their training program, provided all practical requirements have been met.'
  },
  {
    question: 'Can a certificate be verified?',
    answer: 'Yes. While we do not expose student records publicly, any employer can contact Bravo Barista School directly to verify the authenticity of a certificate.'
  },
  {
    question: 'Does certification require successful course completion?',
    answer: 'Yes. Certification is a testament to the practical skills you have learned. It is only awarded to students who complete the hands-on requirements.'
  }
];

/* ─── COMPONENT ─────────────────────────────────────────── */

const CertificationPage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [marqueeReviews, setMarqueeReviews] = useState<typeof REVIEWS>([]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Animation Observer
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('cp-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    root.querySelectorAll<HTMLElement>('[data-cp-reveal]').forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  // Marquee Duplication for infinite scroll
  useEffect(() => {
    setMarqueeReviews([...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS]);
  }, []);

  // Keyboard support for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    if (lightboxImg) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImg]);

  return (
    <div className="cert-page" ref={rootRef}>
      {/* 1. HERO */}
      <section className="cp-hero">
        <div className="container cp-hero__inner">
          <div className="cp-hero__content">
            <span className="cp-hero__eyebrow" data-cp-reveal>Certification</span>
            <h1 className="cp-hero__title" data-cp-reveal>
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">Proof of</span>
              </span>
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">Practical Skill</span>
              </span>
            </h1>
            <div className="cp-hero__body" data-cp-reveal>
              <p className="cp-hero__lead">
                A professional certificate that marks the completion of hands-on hospitality training at Bravo Barista School.
              </p>
              <div className="cp-hero__actions">
                <Link to="/programs" className="brutal-btn">
                  Explore Programs <span className="btn-arrow">→</span>
                </Link>
                <Link to="/contact" className="brutal-btn brutal-btn--outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
          <div className="cp-hero__media" data-cp-reveal>
            <div className="cp-hero__cert-wrapper">
              <img src={IMAGES.certificates} alt="Bravo Barista School Certificate" loading="eager" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IT REPRESENTS */}
      <section className="cp-represents section section--cream">
        <div className="container">
          <div className="cp-section-header" data-cp-reveal>
            <h2 className="cp-section-title">
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">What It Represents</span>
              </span>
            </h2>
          </div>
          <div className="cp-represents__rows">
            <div className="cp-rep-row" data-cp-reveal>
              <h3 className="cp-rep-row__label">Practical Skills</h3>
              <p className="cp-rep-row__text">
                Demonstrates that you have completed hands-on training in a real, commercial training environment, not just a classroom.
              </p>
            </div>
            <div className="cp-rep-row" data-cp-reveal>
              <h3 className="cp-rep-row__label">Professional Preparation</h3>
              <p className="cp-rep-row__text">
                Validates the development of core competencies required for real hospitality work, from machine operation to workflow management.
              </p>
            </div>
            <div className="cp-rep-row" data-cp-reveal>
              <h3 className="cp-rep-row__label">Training Completion</h3>
              <p className="cp-rep-row__text">
                Serves as a formal, tangible record of successfully completing the relevant Bravo Barista School curriculum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PATH TO CERTIFICATION */}
      <section className="cp-path">
        <div className="container">
          <div className="cp-section-header" data-cp-reveal>
            <h2 className="cp-section-title">
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">The Path to</span>
              </span>
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">Certification</span>
              </span>
            </h2>
          </div>
          
          <div className="cp-path__process" data-cp-reveal>
            <div className="cp-path__line"></div>
            <div className="cp-path__step">
              <span className="cp-path__num">01</span>
              <h3 className="cp-path__label">Train</h3>
              <p className="cp-path__desc">Learn the fundamentals through hands-on instruction from experienced mentors.</p>
            </div>
            <div className="cp-path__step">
              <span className="cp-path__num">02</span>
              <h3 className="cp-path__label">Practice</h3>
              <p className="cp-path__desc">Build muscle memory and skill through repeated practical work on commercial equipment.</p>
            </div>
            <div className="cp-path__step">
              <span className="cp-path__num">03</span>
              <h3 className="cp-path__label">Demonstrate</h3>
              <p className="cp-path__desc">Successfully complete the required practical and theoretical components of your course.</p>
            </div>
            <div className="cp-path__step">
              <span className="cp-path__num">04</span>
              <h3 className="cp-path__label">Certify</h3>
              <p className="cp-path__desc">Receive your official certificate recognizing your commitment and new skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CERTIFICATE SHOWCASE */}
      <section className="cp-showcase section section--cream">
        <div className="container">
          <div className="cp-section-header" data-cp-reveal>
            <h2 className="cp-section-title">
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">Official</span>
              </span>
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">Certificates</span>
              </span>
            </h2>
            <p className="cp-section-sub">Click to enlarge</p>
          </div>
          
          <div className="cp-showcase__grid">
            <div className="cp-cert-card" data-cp-reveal>
              <button 
                className="cp-cert-card__btn" 
                onClick={() => setLightboxImg(IMAGES.certificates)}
                aria-label="Enlarge Barista Certificate"
              >
                <img src={IMAGES.certificates} alt="Bravo Barista Certificate" loading="lazy" />
                <div className="cp-cert-card__overlay">
                  <span className="cp-cert-card__icon">🔍</span>
                </div>
              </button>
              <h3 className="cp-cert-card__label">Barista Training Certificate</h3>
            </div>

            <div className="cp-cert-card" data-cp-reveal>
              <button 
                className="cp-cert-card__btn" 
                onClick={() => setLightboxImg(IMAGES.certificateIndividual)}
                aria-label="Enlarge Café & Bar Certificate"
              >
                <img src={IMAGES.certificateIndividual} alt="Bravo Café & Bar Certificate" loading="lazy" />
                <div className="cp-cert-card__overlay">
                  <span className="cp-cert-card__icon">🔍</span>
                </div>
              </button>
              <h3 className="cp-cert-card__label">Café & Bar Training Certificate</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MORE THAN A CERTIFICATE */}
      <section className="cp-more">
        <div className="container cp-more__inner">
          <div className="cp-more__copy" data-cp-reveal>
            <h2 className="cp-more__title">More Than a Certificate</h2>
            <p className="cp-more__text">
              A Bravo certificate represents more than just attendance. It is a symbol of the practical confidence gained through hours of hands-on experience, understanding commercial hospitality workflows, and preparing yourself for real-world service. 
            </p>
            <p className="cp-more__text">
              It is a tangible record of the foundational skills required to step behind the bar and begin your hospitality journey.
            </p>
          </div>
          <div className="cp-more__media" data-cp-reveal>
            <img src={IMAGES.baristaTraining1} alt="Student training at Bravo Barista School" loading="lazy" />
          </div>
        </div>
      </section>

      {/* 6. STUDENT EXPERIENCES (Marquee) */}
      <section className="cp-experiences section section--cream">
        <div className="container">
          <div className="cp-section-header" data-cp-reveal>
            <h2 className="cp-section-title">
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">Student Experiences</span>
              </span>
            </h2>
          </div>
        </div>
        
        <div className="cp-marquee-wrap" data-cp-reveal>
          <div className="cp-marquee">
            <div className="cp-marquee__track" aria-hidden="true">
              {marqueeReviews.map((review, i) => (
                <div key={i} className="cp-marquee__item">
                  <p className="cp-marquee__text">"{review.text}"</p>
                  <div className="cp-marquee__meta">
                    <strong>{review.name}</strong>
                    <span>{review.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. VERIFICATION / TRUST */}
      <section className="cp-verification">
        <div className="container">
          <div className="cp-verify-box" data-cp-reveal>
            <h2 className="cp-verify-box__title">Certificate Verification</h2>
            <p className="cp-verify-box__text">
              To protect student privacy, we do not expose our student records publicly. If you are an employer and need to confirm the validity of a Bravo Barista School certificate, please contact us directly.
            </p>
            <Link to="/contact" className="brutal-btn">
              Contact for Verification <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="cp-faq section section--cream">
        <div className="container">
          <div className="cp-section-header" data-cp-reveal>
            <h2 className="cp-section-title">
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">Frequently Asked</span>
              </span>
              <span className="cp-heading-mask">
                <span className="cp-heading-mask__inner">Questions</span>
              </span>
            </h2>
          </div>
          
          <div className="cp-faq__list" data-cp-reveal>
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={`cp-faq__item ${isOpen ? 'cp-faq__item--open' : ''}`}>
                  <button 
                    className="cp-faq__question"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    {faq.question}
                    <span className="cp-faq__icon" aria-hidden="true"></span>
                  </button>
                  <div className="cp-faq__answer-wrapper" aria-hidden={!isOpen}>
                    <p className="cp-faq__answer">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="cp-cta">
        <div className="container text-center" data-cp-reveal>
          <h2 className="cp-cta__title">
            <span className="cp-heading-mask">
              <span className="cp-heading-mask__inner">Ready to Earn</span>
            </span>
            <span className="cp-heading-mask">
              <span className="cp-heading-mask__inner">Your Next Milestone?</span>
            </span>
          </h2>
          <p className="cp-cta__text">Build practical skills and take the next step in your hospitality journey.</p>
          <div className="cp-cta__actions">
            <Link to="/programs" className="brutal-btn">
              Explore Programs <span className="btn-arrow">→</span>
            </Link>
            <Link to="/contact" className="brutal-btn brutal-btn--outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div 
          className="cp-lightbox" 
          role="dialog" 
          aria-modal="true" 
          aria-label="Certificate Image Enlarge"
          onClick={() => setLightboxImg(null)}
        >
          <button 
            className="cp-lightbox__close" 
            aria-label="Close dialog"
            onClick={() => setLightboxImg(null)}
          >
            ×
          </button>
          <div className="cp-lightbox__content" onClick={e => e.stopPropagation()}>
            <img src={lightboxImg} alt="Enlarged Certificate" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationPage;
