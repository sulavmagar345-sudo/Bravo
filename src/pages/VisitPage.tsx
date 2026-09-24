import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../data/images';
import { fetchBookingSettingsMap } from '../admin/services/booking-settings';
import './VisitPage.css';

/* ── Inline Netflix wordmark — avoids external fetch ─────────────────────── */
const NetflixWordmark: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 276.742"
    aria-label="Netflix"
    focusable="false"
  >
    <path
      d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
      fill="#E50914"
    />
  </svg>
);

/* ── Helper: IntersectionObserver hook for data-vp elements ─────────────── */
function useVpReveal(rootRef?: React.RefObject<Element | null>) {
  useEffect(() => {
    const t = setTimeout(() => {
      const targets = document.querySelectorAll('[data-vp]');
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('vp-in');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
      );
      targets.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }, 80);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ═══════════════════════════════════════════════════════════════════════════
   VISIT PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
const VisitPage: React.FC = () => {
  // Page title
  useEffect(() => {
    const prev = document.title;
    document.title = 'Visit Bravo | Café, Bar, Private Netflix Room & More';
    return () => { document.title = prev; };
  }, []);

  // Hero entrance
  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setHeroIn(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Dynamic Netflix price
  const [price, setPrice] = useState<number>(300);
  useEffect(() => {
    fetchBookingSettingsMap()
      .then((map) => {
        const raw = (map as Record<string, string>).netflix_price_per_hour;
        if (raw && !isNaN(parseInt(raw, 10))) setPrice(parseInt(raw, 10));
      })
      .catch(() => {/* use default */});
  }, []);

  // Scroll reveals
  useVpReveal();

  return (
    <div className="vp">

      {/* ════════════════════════════════════════════════
          1. HERO
          ════════════════════════════════════════════════ */}
      <section className="vp-hero" aria-labelledby="vp-hero-title">
        <img
          className="vp-hero__photo"
          src={IMAGES.cafeInterior}
          alt="Inside Bravo Café & Bar — light-filled space with specialty coffee"
          fetchPriority="high"
        />
        <div className="vp-hero__shade" aria-hidden="true" />

        <div className="vp-hero__content container">
          <span
            className={`vp-hero__pre${heroIn ? ' vp-in' : ''}`}
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'none' : 'translateY(1rem)',
              transition: 'opacity 700ms ease-out, transform 700ms ease-out',
            }}
          >
            Bravo Barista School &amp; Café — Kathmandu
          </span>

          <h1
            id="vp-hero-title"
            className="vp-hero__heading"
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'none' : 'translateY(2rem)',
              transition: 'opacity 900ms cubic-bezier(0.16,1,0.3,1) 120ms, transform 900ms cubic-bezier(0.16,1,0.3,1) 120ms',
            }}
          >
            More than
            <em>training.</em>
          </h1>

          <p
            className="vp-hero__intro"
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'none' : 'translateY(1.5rem)',
              transition: 'opacity 800ms ease-out 320ms, transform 800ms cubic-bezier(0.16,1,0.3,1) 320ms',
            }}
          >
            Bravo began as a place for learning coffee and hospitality. Today, it is also
            a place to spend time — over coffee, food, drinks, conversation,
            or a private movie session. Come to learn, or simply come to visit.
          </p>

          <div
            className="vp-hero__actions"
            style={{
              opacity: heroIn ? 1 : 0,
              transform: heroIn ? 'none' : 'translateY(1rem)',
              transition: 'opacity 600ms ease-out 520ms, transform 600ms ease-out 520ms',
            }}
          >
            <Link to="/book" className="btn btn--cream btn--lg">
              Reserve Now
            </Link>
            <Link to="/cafe-bar" className="vp-text-link vp-text-link--light">
              Explore Café &amp; Bar →
            </Link>
          </div>
        </div>

        {/* Vertical scroll cue */}
        <span className="vp-hero__scroll" aria-hidden="true">Scroll</span>
      </section>


      {/* ════════════════════════════════════════════════
          2. WHAT IS BRAVO TODAY
          ════════════════════════════════════════════════ */}
      <section className="vp-what section" aria-labelledby="vp-what-title">
        <div className="container">
          <div className="vp-what__grid">

            <div data-vp>
              <span className="vp-eyebrow">Bravo, beyond the classroom</span>
              <div className="vp-mask" aria-hidden="false">
                <h2 id="vp-what-title" className="vp-what__heading">
                  A school.<br />
                  A café.<br />
                  A bar.<br />
                  A room<br />
                  all your own.
                </h2>
              </div>
            </div>

            <div className="vp-what__body" data-vp data-d="2">
              <p>
                When Bravo opened, the idea was simple: build a real hospitality training
                environment where people could learn to make coffee, work a bar, and
                develop professional skills in a genuine setting.
              </p>
              <p>
                That environment — the café, the bar, the culture around them — became
                something visitors began to seek out on its own terms. Not only students,
                but people looking for a good coffee, a relaxed evening, a place to meet
                friends, or a private space to enjoy a film.
              </p>
              <p>
                Today, Bravo runs both as a school and as a visitor destination. You can
                arrive to study, or to spend time. Often both happen at once. That is the
                character of the place.
              </p>

              <div className="vp-what__facts" role="list" aria-label="Bravo highlights">
                <div className="vp-what__fact" role="listitem">
                  <strong>2019</strong>
                  <span>Established</span>
                </div>
                <div className="vp-what__fact" role="listitem">
                  <strong>Daily</strong>
                  <span>Open 8 AM – 10 PM</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <hr className="vp-divider" />


      {/* ════════════════════════════════════════════════
          3. CAFÉ & BAR
          ════════════════════════════════════════════════ */}
      <section className="vp-cafe" aria-labelledby="vp-cafe-title">
        <div className="container">
          <div className="vp-cafe__grid">

            <figure className="vp-cafe__photo vp-img-wrap" data-vp>
              <img
                src={IMAGES.latteArt}
                alt="Handcrafted latte at Bravo Café — the coffee is made by trained baristas"
                loading="lazy"
              />
            </figure>

            <div className="vp-cafe__copy" data-vp data-d="2">
              <span className="vp-section-num" aria-hidden="true">01</span>
              <span className="vp-eyebrow">Come for the coffee</span>

              <h2 id="vp-cafe-title" className="vp-cafe__heading">
                A café built around craft.<br />
                Open to everyone.
              </h2>

              <div className="vp-cafe__body">
                <p>
                  Bravo Café &amp; Bar is not a canteen attached to a school. It is the
                  centre of the operation. From eight in the morning, trained baristas
                  and students working alongside them produce specialty espresso-based
                  coffee, drinks, and food in a space designed for real hospitality.
                </p>
                <p>
                  You can arrive for a quiet morning coffee, stay for the afternoon with
                  your laptop and the Wi-Fi, or return in the evening when the bar comes
                  alive, the mood shifts, and the cocktails begin. The space accommodates
                  both. It is a working café and a working bar, and on some evenings a
                  live music venue.
                </p>
                <p>
                  Everything served here — the coffee, the drinks, the food — comes out
                  of a culture of learning. The people making it are either experienced
                  professionals or students training under them. Either way, the care is
                  the same.
                </p>
              </div>

              <dl className="vp-cafe__details">
                <div className="vp-cafe__detail-item">
                  <dt>Daily hours</dt>
                  <dd>8:00 AM – 10:00 PM<br />Open every day</dd>
                </div>
                <div className="vp-cafe__detail-item">
                  <dt>Amenities</dt>
                  <dd>High-speed Wi-Fi<br />Work-friendly tables<br />Outdoor seating</dd>
                </div>
              </dl>

              <div className="vp-cafe__menu-preview">
                <span className="vp-cafe__menu-label">Available at the café</span>
                <ul className="vp-cafe__menu-items">
                  {[
                    'Specialty Espresso', 'Lattes & Cappuccinos',
                    'Cold Drinks', 'Milkshakes',
                    'Cocktails & Bar Drinks', 'Food',
                  ].map((item) => (
                    <li key={item} className="vp-cafe__menu-item">{item}</li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link to="/cafe-bar" className="vp-text-link">
                  Explore Café &amp; Bar →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════
          FULLWIDTH STRIP — drinks atmosphere
          ════════════════════════════════════════════════ */}
      <div className="vp-strip vp-img-wrap" data-vp aria-hidden="true">
        <img
          src={IMAGES.milkshakes}
          alt="Drinks at Bravo Café"
          loading="lazy"
        />
      </div>


      {/* ════════════════════════════════════════════════
          4. PRIVATE NETFLIX ROOM
          ════════════════════════════════════════════════ */}
      <section className="vp-netflix" aria-labelledby="vp-netflix-title">
        <div className="container">
          <div className="vp-netflix__grid">

            <div className="vp-netflix__copy" data-vp>
              <NetflixWordmark className="vp-netflix__logo" />

              <span className="vp-section-num" aria-hidden="true" style={{ color: 'var(--color-gold-soft)' }}>02</span>
              <span className="vp-eyebrow vp-eyebrow--light">Stay for the movie</span>

              <h2 id="vp-netflix-title" className="vp-netflix__heading">
                Private room.<br />
                Big screen.<br />
                Just your people.
              </h2>

              <blockquote className="vp-netflix__quote">
                <p>
                  Sometimes you don't need a loud venue or a crowded cinema.
                  You need a comfortable, private room, a good screen, something
                  worth watching, and a little time with the people you're with.
                </p>
              </blockquote>

              <div className="vp-netflix__body">
                <p>
                  Bravo's private Netflix room is a dedicated space you book by the hour.
                  It's separate from the café, designed for groups who want their own
                  setting. When you arrive, the room is ready. Netflix is on the big
                  screen. Popcorn is included.
                </p>
                <p>
                  There is no complicated process. You choose a date and time, make
                  your reservation, and show up. The room is yours for the duration
                  of your booking.
                </p>
              </div>

              <div className="vp-netflix__offer" role="region" aria-label="Netflix room offer details">
                <div className="vp-netflix__offer-lines">
                  <div className="vp-netflix__offer-row">
                    <span className="vp-netflix__offer-label">Rate</span>
                    <span className="vp-netflix__offer-value">
                      Rs.&nbsp;{price.toLocaleString()} / hour
                    </span>
                  </div>
                  <div className="vp-netflix__offer-row">
                    <span className="vp-netflix__offer-label">Includes</span>
                    <span className="vp-netflix__offer-value">Free popcorn</span>
                  </div>
                  <div className="vp-netflix__offer-row">
                    <span className="vp-netflix__offer-label">Setting</span>
                    <span className="vp-netflix__offer-value">Private room</span>
                  </div>
                  <div className="vp-netflix__offer-row">
                    <span className="vp-netflix__offer-label">Screen</span>
                    <span className="vp-netflix__offer-value">Big screen</span>
                  </div>
                </div>
              </div>

              <Link to="/book/netflix" className="btn btn--cream btn--lg">
                Book the Netflix Room
              </Link>
            </div>

            <figure className="vp-netflix__photo vp-img-wrap" data-vp data-d="2">
              <img
                src={IMAGES.cafeEvent2}
                alt="A private atmosphere at Bravo — your own space to spend time"
                loading="lazy"
              />
            </figure>

          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════
          5. TABLE RESERVATION
          ════════════════════════════════════════════════ */}
      <section className="vp-table section" aria-labelledby="vp-table-title">
        <div className="container">
          <div className="vp-table__grid">

            <div className="vp-table__copy" data-vp>
              <span className="vp-section-num" aria-hidden="true">03</span>
              <span className="vp-eyebrow">Make it yours</span>

              <h2 id="vp-table-title" className="vp-table__heading">
                Your table,<br />
                ready when you arrive.
              </h2>

              <div className="vp-table__body">
                <p>
                  Whether you are meeting someone for coffee, catching up with friends
                  over food and drinks, or simply want to know your spot is waiting —
                  reserving a table at Bravo takes a few minutes and means you arrive
                  to find the space already yours.
                </p>
                <p>
                  The reservation goes through in real time. You choose your date, your
                  preferred time, and how many guests are joining. No deposit. No
                  complicated requirements.
                </p>
              </div>

              <div className="vp-table__steps" role="list" aria-label="How to reserve a table">
                {[
                  { n: '01', text: 'Choose a date and time that works for your group.' },
                  { n: '02', text: 'Tell us how many guests are joining.' },
                  { n: '03', text: 'Add your name and phone number. Any special request, note it there.' },
                  { n: '04', text: 'Confirm. Your table is reserved. We will see you then.' },
                ].map((step) => (
                  <div key={step.n} className="vp-table__step" role="listitem">
                    <span className="vp-table__step-n">{step.n}</span>
                    <span className="vp-table__step-text">{step.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link to="/book/table" className="btn btn--primary btn--lg">
                  Reserve a Table
                </Link>
              </div>
            </div>

            <figure className="vp-table__photo vp-img-wrap" data-vp data-d="2">
              <img
                src={IMAGES.cafeBar}
                alt="Inside Bravo Bar — bar setting with warm lighting and crafted drinks"
                loading="lazy"
              />
            </figure>

          </div>
        </div>
      </section>

      <hr className="vp-divider" />


      {/* ════════════════════════════════════════════════
          6. A DAY AT BRAVO — typographic story
          ════════════════════════════════════════════════ */}
      <section className="vp-day" aria-labelledby="vp-day-title">
        <div className="container">

          <div className="vp-day__header" data-vp>
            <span className="vp-eyebrow">Come for one thing. Stay for the rest.</span>
            <h2 id="vp-day-title" className="vp-day__heading">
              A day at Bravo.
            </h2>
            <p className="vp-day__sub">
              There is no fixed order. Some people arrive for morning coffee and stay through
              lunch. Some book the Netflix room for an evening. Some come specifically
              to meet, to work, or to celebrate. Bravo accommodates all of it.
            </p>
          </div>

          <figure className="vp-day__photo vp-img-wrap" data-vp>
            <img
              src={IMAGES.cafeLive}
              alt="An evening event at Bravo Café & Bar"
              loading="lazy"
            />
          </figure>

          <div className="vp-day__moments" role="list" aria-label="Moments at Bravo">
            {[
              {
                time: 'Morning',
                word: 'Arrive.',
                desc: 'Come in for the first coffee of the day. Espresso from trained baristas, space to settle, Wi-Fi if you need it.',
              },
              {
                time: 'Afternoon',
                word: 'Meet.',
                desc: 'Reserve a table or arrive and find a seat. Catch up with someone. Work. Take a longer break than usual.',
              },
              {
                time: 'Evening',
                word: 'Stay.',
                desc: 'The mood at Bravo shifts toward evening. The bar comes alive. Cocktails, drinks, food, music on some evenings.',
              },
              {
                time: 'Anytime',
                word: 'Watch.',
                desc: 'Book the private Netflix room by the hour. Bring your people. Take the space. Popcorn is included.',
              },
            ].map((m) => (
              <div key={m.word} className="vp-day__moment" role="listitem" data-vp>
                <span className="vp-day__moment-time">{m.time}</span>
                <span className="vp-day__moment-word">{m.word}</span>
                <p className="vp-day__moment-desc">{m.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════════════
          FULLWIDTH STRIP — bar/cocktail
          ════════════════════════════════════════════════ */}
      <div className="vp-strip vp-img-wrap" data-vp aria-hidden="true">
        <img
          src={IMAGES.barCocktail}
          alt="Bar at Bravo"
          loading="lazy"
        />
      </div>


      {/* ════════════════════════════════════════════════
          7. TRAINING CONNECTION
          ════════════════════════════════════════════════ */}
      <section className="vp-training section" aria-labelledby="vp-training-title">
        <div className="container">
          <div className="vp-training__grid">

            <figure className="vp-training__photo vp-img-wrap" data-vp>
              <img
                src={IMAGES.baristaTraining1}
                alt="Barista training in progress at Bravo — a student at the espresso machine"
                loading="lazy"
              />
            </figure>

            <div className="vp-training__copy" data-vp data-d="2">
              <span className="vp-section-num" aria-hidden="true">04</span>
              <span className="vp-eyebrow">Learn here too</span>

              <h2 id="vp-training-title" className="vp-training__heading">
                Learning in a real hospitality environment.
              </h2>

              <div className="vp-training__body">
                <p>
                  Bravo is built around the idea that hospitality is best learned in
                  a real setting. Not in a replica classroom, but in a working café and
                  bar where real customers arrive and real standards apply.
                </p>
                <p>
                  The same environment that helps students understand espresso,
                  flair bartending, and the culture of service is also the environment
                  you walk into when you come as a visitor. The coffee you receive,
                  the hospitality extended to you — it comes out of that same
                  commitment to craft.
                </p>
                <p>
                  If you want to be on the other side of the bar, Bravo's training
                  programs are open. Barista training, café and bar courses, and
                  practical certifications for people at every level.
                </p>
              </div>

              <Link to="/programs" className="vp-text-link">
                Explore Training Programs →
              </Link>
            </div>

          </div>
        </div>
      </section>

      <hr className="vp-divider" />


      {/* ════════════════════════════════════════════════
          8. PRACTICAL VISITOR INFORMATION
          ════════════════════════════════════════════════ */}
      <section className="vp-info" aria-labelledby="vp-info-title">
        <div className="container">
          <div data-vp style={{ marginBottom: 'clamp(2.5rem,6vw,4.5rem)' }}>
            <span className="vp-eyebrow">Before you arrive</span>
            <h2 id="vp-info-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem,4vw,2.75rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 'var(--space-2)' }}>
              What you can reserve. How it works.
            </h2>
          </div>

          <div className="vp-info__grid">

            {/* What can you reserve */}
            <div data-vp>
              <h3 className="vp-info__block-title">What you can reserve</h3>
              <ul className="vp-info__list">
                <li>
                  <span>
                    <strong style={{ display: 'block', color: 'var(--color-coffee-soft)', fontWeight: 700 }}>Table at the café &amp; bar</strong>
                    Reserve a table ahead of time. Choose your date, time, and guest count. No deposit required.
                  </span>
                </li>
                <li>
                  <span>
                    <strong style={{ display: 'block', color: 'var(--color-coffee-soft)', fontWeight: 700 }}>Private Netflix room</strong>
                    Book the private room by the hour. Netflix on the big screen. Free popcorn included. Rs.&nbsp;{price}/hour.
                  </span>
                </li>
              </ul>
            </div>

            {/* How reservations work */}
            <div data-vp data-d="1">
              <h3 className="vp-info__block-title">How to reserve</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { n: '1', text: 'Choose your experience — table or Netflix room.' },
                  { n: '2', text: 'Select your date and time from available slots.' },
                  { n: '3', text: 'Enter your name, phone number, and guest count.' },
                  { n: '4', text: 'Add any special request if needed.' },
                  { n: '5', text: 'Submit. Your reservation is confirmed immediately.' },
                ].map((s) => (
                  <div key={s.n} className="vp-info__step">
                    <span className="vp-info__step-n">{s.n}</span>
                    <span className="vp-info__step-text">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div data-vp data-d="2">
              <h3 className="vp-info__block-title">When to visit</h3>
              <div className="vp-info__hours">
                <div className="vp-info__hours-row">
                  <span className="vp-info__hours-day">Every day</span>
                  <span className="vp-info__hours-time">8:00 AM – 10:00 PM</span>
                </div>
                <div className="vp-info__hours-row">
                  <span className="vp-info__hours-day">Morning</span>
                  <span className="vp-info__hours-time">Coffee, breakfast, quiet work time</span>
                </div>
                <div className="vp-info__hours-row">
                  <span className="vp-info__hours-day">Afternoon</span>
                  <span className="vp-info__hours-time">Café, lunch, meetings</span>
                </div>
                <div className="vp-info__hours-row">
                  <span className="vp-info__hours-day">Evening</span>
                  <span className="vp-info__hours-time">Bar, cocktails, food, live music on select evenings</span>
                </div>
                <div className="vp-info__hours-row">
                  <span className="vp-info__hours-day">Netflix room</span>
                  <span className="vp-info__hours-time">Available by reservation during opening hours</span>
                </div>
              </div>
            </div>

          </div>

          {/* CTA row */}
          <div
            data-vp
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              marginTop: 'clamp(2.5rem,6vw,4.5rem)',
              paddingTop: 'clamp(2rem,5vw,3.5rem)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <Link to="/book/table" className="btn btn--primary">Reserve a Table</Link>
            <Link to="/book/netflix" className="btn btn--outline">Book Netflix Room</Link>
            <Link to="/programs" className="btn btn--outline">Explore Training</Link>
          </div>

        </div>
      </section>


      {/* ════════════════════════════════════════════════
          9. FINAL CTA
          ════════════════════════════════════════════════ */}
      <section className="vp-cta" aria-labelledby="vp-cta-title">
        <div className="vp-cta__inner" data-vp>
          <span className="vp-cta__pre">Your time at Bravo starts here</span>

          <h2 id="vp-cta-title" className="vp-cta__heading">
            Come for one thing.<br />
            <em>Stay for everything.</em>
          </h2>

          <p className="vp-cta__body">
            Choose a table, book the private room, explore the café and bar,
            or find out what we teach. Bravo is open every day from 8&nbsp;AM.
          </p>

          <div className="vp-cta__actions">
            <Link to="/book/table" className="btn btn--cream btn--lg">
              Reserve a Table
            </Link>
            <Link to="/book/netflix" className="btn btn--outline-light btn--lg">
              Book Netflix Room
            </Link>
            <Link to="/programs" className="btn btn--outline-light">
              Explore Training
            </Link>
          </div>

          <p className="vp-cta__note">
            Questions before you come?{' '}
            <a
              href="https://wa.me/9779802004823"
              target="_blank"
              rel="noopener noreferrer"
            >
              Send us a message on WhatsApp
            </a>
            {' '}or{' '}
            <Link to="/contact">use our contact page</Link>.
          </p>
        </div>
      </section>

    </div>
  );
};

export default VisitPage;
