import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../data/images';
import { fetchBookingSettingsMap } from '../admin/services/booking-settings';
import './VisitPage.css';

// ─── Netflix inline SVG logo ─────────────────────────────────────────────────
const NetflixLogo: React.FC<{ width?: number }> = ({ width = 80 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={Math.round(width * 0.27)}
    viewBox="0 0 1024 276.742"
    aria-label="Netflix"
  >
    <path
      d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
      fill="#E50914"
    />
  </svg>
);

// ─── Page component ───────────────────────────────────────────────────────────
const VisitPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const netflixRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [netflixPrice, setNetflixPrice] = useState<number>(300);

  // Hero entrance — fires once on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setHeroVisible(true));
    });
    return () => cancelAnimationFrame(t);
  }, []);

  // Fetch live Netflix price from booking_settings
  useEffect(() => {
    fetchBookingSettingsMap()
      .then((map) => {
        const raw = (map as Record<string, string>).netflix_price_per_hour;
        if (raw) setNetflixPrice(parseInt(raw, 10));
      })
      .catch(() => {/* keep default */});
  }, []);

  // Netflix masked-text reveal via IntersectionObserver
  useEffect(() => {
    const el = netflixRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('v-masked-active');
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="visit-page">
      {/* ── SEO metadata via document.title ── */}
      {/* Title set via useEffect to avoid extra dependency */}

      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <section
        className="visit-hero"
        aria-labelledby="visit-title"
        ref={heroRef}
      >
        <img
          className="visit-hero__img"
          src={IMAGES.cafeInterior}
          alt="Bravo Café & Bar — warm interior with specialty coffee"
        />
        <div className="visit-hero__shade" aria-hidden="true" />
        <div className="visit-hero__content container">
          <span className={`visit-hero__eyebrow v-fade-up${heroVisible ? ' v-visible' : ''}`}>
            More than training
          </span>
          <h1
            id="visit-title"
            className={`v-fade-up v-fade-up--d1${heroVisible ? ' v-visible' : ''}`}
          >
            A place to<br />
            <em>learn, meet,<br />eat &amp; unwind.</em>
          </h1>
          <p className={`visit-hero__lede v-fade-up v-fade-up--d2${heroVisible ? ' v-visible' : ''}`}>
            Bravo is a working barista school. It is also a café, a bar, a private cinema,
            and a place where great hospitality happens every day.
          </p>
          <div className={`visit-hero__actions v-fade-up v-fade-up--d3${heroVisible ? ' v-visible' : ''}`}>
            <Link to="/book" className="btn btn--cream">
              Reserve Now
            </Link>
            <Link to="/cafe-bar" className="visit-text-link" style={{ color: 'var(--color-on-dark-muted)', borderColor: 'var(--color-on-dark-muted)' }}>
              Explore Café &amp; Bar <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INTRO ICON STRIP
          ══════════════════════════════════════════ */}
      <div className="visit-intro" aria-label="What you can do at Bravo">
        <div className="container">
          <div className="visit-intro__grid">
            <div className="visit-intro__item reveal-up">
              <span className="visit-intro__icon" aria-hidden="true">☕</span>
              <span className="visit-intro__label">Specialty Coffee</span>
            </div>
            <div className="visit-intro__item reveal-up reveal-up--d1">
              <span className="visit-intro__icon" aria-hidden="true">🍹</span>
              <span className="visit-intro__label">Bar &amp; Cocktails</span>
            </div>
            <div className="visit-intro__item reveal-up reveal-up--d2">
              <span className="visit-intro__icon" aria-hidden="true">🎬</span>
              <span className="visit-intro__label">Private Netflix</span>
            </div>
            <div className="visit-intro__item reveal-up reveal-up--d3">
              <span className="visit-intro__icon" aria-hidden="true">📅</span>
              <span className="visit-intro__label">Table Reservations</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          01 — CAFÉ & BAR
          ══════════════════════════════════════════ */}
      <section className="visit-editorial" aria-labelledby="visit-cafe-title">
        <div className="container">
          <div className="visit-editorial__inner">
            <div className="visit-editorial__copy reveal-up">
              <span className="visit-editorial__num" aria-hidden="true">01</span>
              <span className="visit-eyebrow">Come for the coffee</span>
              <h2 id="visit-cafe-title">A Café Born from the Craft</h2>
              <p>
                From the first morning espresso to the last evening cocktail, Bravo Café &amp; Bar
                is open to everyone. Whether you come for a quiet coffee and your laptop,
                a meal with friends, or to watch our mixologists work flair behind the bar —
                you are welcome here.
              </p>
              <p>
                Specialty espresso, artisan shakes, hand-crafted cocktails, and a relaxed
                atmosphere that feels both professional and genuinely warm.
              </p>

              <div className="visit-hours-band">
                <div className="visit-hours-item">
                  <strong>Open Daily</strong>
                  <span>8:00 AM – 10:00 PM</span>
                </div>
                <div className="visit-hours-item">
                  <strong>Amenities</strong>
                  <span>Wi-Fi · Work tables · Outdoor seating</span>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link to="/cafe-bar" className="visit-text-link">
                  Explore Café &amp; Bar <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <figure className="visit-editorial__media visit-editorial__media--square reveal-img">
              <img
                src={IMAGES.latteArt}
                alt="Specialty coffee at Bravo — handcrafted latte art"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      <hr className="visit-hr" />

      {/* ══════════════════════════════════════════
          02 — PRIVATE NETFLIX ROOM
          ══════════════════════════════════════════ */}
      <section
        className="visit-editorial visit-editorial--dark"
        aria-labelledby="visit-netflix-title"
        ref={netflixRef}
      >
        <div className="container">
          <div className="visit-editorial__inner visit-editorial__inner--flip">
            <figure className="visit-editorial__media visit-editorial__media--square reveal-img">
              <img
                src={IMAGES.cafeEvent1}
                alt="Private space at Bravo — settle in with friends"
                loading="lazy"
              />
            </figure>

            <div className="visit-editorial__copy">
              <span className="visit-editorial__num" aria-hidden="true">02</span>
              <span className="visit-eyebrow">Stay for the movie</span>

              {/* Masked-text headline */}
              <h2 id="visit-netflix-title">
                <span className="v-masked-line"><span>Your own private</span></span>
                <span className="v-masked-line"><span>room, a big screen</span></span>
                <span className="v-masked-line"><span>&amp; free popcorn.</span></span>
              </h2>

              <div className="visit-netflix-badges" aria-label="Netflix room highlights">
                <span className="visit-netflix-badge">🎬 Private Room</span>
                <span className="visit-netflix-badge">
                  <NetflixLogo width={40} /> on Big Screen
                </span>
                <span className="visit-netflix-badge">🍿 Free Popcorn</span>
              </div>

              <p style={{ color: 'var(--color-on-dark-muted)' }}>
                Looking for a relaxed, private space to watch something with friends or
                family? Our Netflix room gives you your own space, a large screen, and
                complimentary popcorn — right inside Bravo.
              </p>

              <div className="visit-netflix-price" aria-label={`Rs. ${netflixPrice} per hour`}>
                Rs. {netflixPrice.toLocaleString()} <span>/ hour</span>
              </div>

              <Link to="/book/netflix" className="btn btn--cream">
                Book Netflix Room
              </Link>
            </div>
          </div>
        </div>
      </section>

      <hr className="visit-hr" />

      {/* ══════════════════════════════════════════
          03 — TABLE RESERVATION
          ══════════════════════════════════════════ */}
      <section className="visit-editorial visit-editorial--alt" aria-labelledby="visit-table-title">
        <div className="container">
          <div className="visit-editorial__inner">
            <div className="visit-editorial__copy reveal-up">
              <span className="visit-editorial__num" aria-hidden="true">03</span>
              <span className="visit-eyebrow">Make it a table</span>
              <h2 id="visit-table-title">Your table, ready when you arrive.</h2>
              <p>
                Planning to meet someone, celebrate an occasion, or simply settle in
                for a few hours? Reserve your table ahead of time and we'll have
                everything ready for you.
              </p>

              <div className="visit-table-info" aria-label="Table reservation details">
                <span className="visit-table-pill">Live availability</span>
                <span className="visit-table-pill">Instant confirmation</span>
                <span className="visit-table-pill">No deposit required</span>
              </div>

              <Link to="/book/table" className="visit-text-link">
                Reserve a Table <span aria-hidden="true">→</span>
              </Link>
            </div>

            <figure className="visit-editorial__media visit-editorial__media--square reveal-img">
              <img
                src={IMAGES.cafeBar}
                alt="Bravo Bar interior — ready for your evening"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          04 — TRAINING BRIDGE
          ══════════════════════════════════════════ */}
      <section className="visit-bridge" aria-labelledby="visit-training-title">
        <div className="container">
          <div className="visit-bridge__inner">
            <div className="visit-bridge__copy reveal-up">
              <span className="visit-eyebrow">Learn here too</span>
              <h2 id="visit-training-title">Bravo is still a barista school.</h2>
              <p>
                Everything in this café — the coffee you drink, the cocktails poured,
                the hospitality you receive — is delivered by people learning their craft
                in a live environment.
              </p>
              <p>
                If you want to become one of them, our training programs are open to
                beginners and experienced hospitality professionals alike.
              </p>
              <Link to="/programs" className="visit-text-link">
                Explore Training Programs <span aria-hidden="true">→</span>
              </Link>
            </div>

            <figure className="visit-bridge__media reveal-img">
              <img
                src={IMAGES.baristaTraining3}
                alt="Barista training in progress inside Bravo"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════ */}
      <section className="visit-cta" aria-labelledby="visit-cta-title">
        <div className="container">
          <span className="visit-cta__eyebrow reveal-up">Ready to visit?</span>
          <h2 id="visit-cta-title" className="reveal-up reveal-up--d1">
            Choose your<br />experience at Bravo.
          </h2>
          <p className="visit-cta__sub reveal-up reveal-up--d2">
            Reserve a table, book the Netflix room, or simply come in.
            Bravo is open every day from 8:00 AM.
          </p>
          <div className="visit-cta__actions reveal-up reveal-up--d3">
            <Link to="/book/table" className="btn btn--cream">
              Reserve a Table
            </Link>
            <Link to="/book/netflix" className="btn btn--outline-light">
              Book Netflix Room
            </Link>
            <Link to="/programs" className="btn btn--outline-light">
              Explore Training
            </Link>
          </div>
          <p className="visit-cta__note reveal-up reveal-up--d3">
            Questions?{' '}
            <a
              href="https://wa.me/9779802004823"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat with us on WhatsApp
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default VisitPage;
