import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './BookPage.css';

const BookPage: React.FC = () => {
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Stagger reveal after mount
    const items = document.querySelectorAll('.book-reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('book-visible'); }),
      { threshold: 0.12 }
    );
    items.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main className="book-page" id="main-content">
      <div className="book-hero">
        <div className="container book-hero__inner">
          <span className="eyebrow book-reveal">Reserve Your Time at Bravo</span>
          <h1 className="book-hero__heading book-reveal book-reveal--d1">
            Make Yourself<br />at Home
          </h1>
          <p className="book-hero__intro book-reveal book-reveal--d2">
            Whether you're joining us for coffee and conversation, planning a meal with friends,
            or settling in for a private Netflix session — reserve your time at Bravo and
            we'll have your space ready.
          </p>
        </div>
      </div>

      <div className="book-choices container">
        <Link to="/book/table" className="book-choice book-reveal book-reveal--d3">
          <div className="book-choice__icon" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 28h24M4 20h32M12 20V14a8 8 0 0116 0v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 28v4M28 28v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="book-choice__body">
            <h2 className="book-choice__title">Reserve a Table</h2>
            <p className="book-choice__desc">
              For dining, coffee with friends, or a relaxed evening at Bravo.
            </p>
            <span className="book-choice__cta">Book a Table →</span>
          </div>
        </Link>

        <div className="book-choices__divider" aria-hidden="true" />

        <Link to="/book/netflix" className="book-choice book-reveal book-reveal--d4">
          <div className="book-choice__icon" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Netflix_2015_N_logo.svg" alt="Netflix" style={{ width: '40px', height: 'auto', objectFit: 'contain' }} />
          </div>
          <div className="book-choice__body">
            <h2 className="book-choice__title">Book Netflix Room</h2>
            <p className="book-choice__desc">
              Private room · Big screen · Rs. 300/hour · Free popcorn included
            </p>
            <span className="book-choice__cta">Book Netflix Room →</span>
          </div>
        </Link>
      </div>

      <div className="book-note container">
        <p>
          Have a question or need help booking?{' '}
          <a href="https://wa.me/9779802004823" target="_blank" rel="noopener noreferrer">
            Chat with us on WhatsApp
          </a>
          .
        </p>
      </div>
    </main>
  );
};

export default BookPage;
