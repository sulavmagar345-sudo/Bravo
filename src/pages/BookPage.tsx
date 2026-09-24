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
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="16" viewBox="0 0 1024 276.742">
              <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" fill="#E50914"/>
            </svg>
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
