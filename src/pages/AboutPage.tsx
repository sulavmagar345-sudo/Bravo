import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../data/images';
import './AboutPage.css';

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

const MILESTONES = [
  {
    year: '2019',
    title: 'Founded in Kathmandu',
    description:
      'Bravo Barista School opens with a clear mission: bridge the gap between classroom theory and commercial café reality. Commercial FAEMA machines, real service conditions, 100% hands-on from day one.',
  },
  { 
    year: '2020', 
    title: 'Navigating New Challenges', 
    description: 'Adapted our training models to meet new industry standards while maintaining our commitment to hands-on, practical learning during a challenging global period.' 
  },
  { 
    year: '2021', 
    title: 'Advanced Barista Curriculum', 
    description: 'Expanded our core curriculum to include advanced sensory evaluation, precise grind calibration, and competition-level latte art modules.' 
  },
  { 
    year: '2022', 
    title: 'Mixology & Bar Operations', 
    description: 'Launched our dedicated mixology and flair bartending program, bringing in experienced bar mentors to teach classic cocktails and high-volume bar management.' 
  },
  { 
    year: '2023', 
    title: 'Industry Partnerships', 
    description: 'Forged strong connections with top 5-star hotels and specialty cafés, ensuring our graduates step directly from our live service environment into rewarding careers.' 
  },
  { 
    year: '2024', 
    title: 'Alumni Global Success', 
    description: 'Celebrated the growing footprint of Bravo graduates securing roles not just in Nepal, but across the Gulf, Australia, and Europe as highly skilled hospitality professionals.' 
  },
  {
    year: '2025',
    title: 'Culinary Arts Expansion',
    description:
      'Chef Training announced — commercial kitchen stations, individual burners, and executive chef mentorship. Pre-registration opens for the first culinary cohort.',
  },
  { 
    year: '2026', 
    title: 'Setting the Future Standard', 
    description: 'Looking ahead with a renewed commitment to elevating the hospitality industry through rigorous, mentor-led, and career-focused education.' 
  },
];

/* ─── COMPONENT ─────────────────────────────────────────── */

const AboutPage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [marqueeReviews, setMarqueeReviews] = useState<typeof REVIEWS>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ap-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    root.querySelectorAll<HTMLElement>('[data-ap-reveal]').forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMarqueeReviews([...REVIEWS, ...REVIEWS]);
  }, []);

  return (
    <div className="about-page" ref={rootRef}>

      {/* 01 — WELCOME / INTRODUCTION VIDEO */}
      <section className="ap-welcome" aria-labelledby="ap-welcome-heading">
        <div className="container">
          <div className="ap-welcome__inner">
            <div className="ap-welcome__copy" data-ap-reveal>
              <span className="ap-eyebrow">About Bravo</span>
              <div className="ap-welcome__heading-mask">
                <h1 id="ap-welcome-heading" className="ap-welcome__heading">
                  More Than Training
                </h1>
              </div>
              <div className="ap-rule" aria-hidden="true" />
              <p className="ap-welcome__lead">
                Bravo combines an accredited barista and mixology academy
                with an active, operational café and cocktail bar under one
                roof in Kathmandu, Nepal.
              </p>
              <p className="ap-welcome__body">
                Our philosophy is simple: hospitality skills are built through
                repetition on real equipment, in real service environments,
                guided by mentors who have worked the line. Students train on
                commercial FAEMA machines during live service — building speed,
                consistency and professional confidence under real conditions.
              </p>
            </div>

            <figure className="ap-welcome__media" data-ap-reveal>
              <div className="ap-welcome__video-wrap">
                <video
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  poster={IMAGES.teamCafe}
                  aria-label="Welcome to Bravo Barista School — training in session"
                >
                  <source src={IMAGES.welcomeVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <figcaption className="ap-welcome__caption">
                Training in session — Bravo Barista School, Kathmandu
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 02 — HOW BRAVO STARTED */}
      <section className="ap-origin section--ap-alt" aria-labelledby="ap-origin-heading">
        <div className="container">
          <div className="ap-origin__grid">
            <figure className="ap-origin__media" data-ap-reveal>
              <img
                src={IMAGES.teamGroup}
                alt="Early Bravo training cohort gathered around the FAEMA espresso machine"
                loading="lazy"
              />
            </figure>
            <div className="ap-origin__copy" data-ap-reveal>
              <span className="ap-eyebrow">01 — How Bravo Started</span>
              <div className="ap-origin__heading-mask">
                <h2 id="ap-origin-heading" className="ap-origin__heading">
                  Born Out of a Real Gap
                </h2>
              </div>
              <div className="ap-rule" aria-hidden="true" />
              <p className="ap-origin__lead">
                In 2019, a group of hospitality professionals in Kathmandu
                recognised a persistent problem: graduates entered the
                workforce with theoretical knowledge but lacked the practical
                speed, consistency, and equipment fluency that commercial
                employers demand.
              </p>
              <p>
                Bravo was founded to close that gap — not as a standalone
                classroom, but as a hybrid: an accredited academy integrated
                with a working café and bar. From day one, students pulled
                shots on commercial FAEMA machines during live service,
                steamed milk to order for paying guests, and learned the
                rhythm of a real hospitality floor.
              </p>
              <p>
                The founding vision was specific: small batches, unlimited
                ingredients for practice, and instructors who had spent years
                on the line. That foundation remains unchanged today. The
                goal was never just to teach recipes — it was to build the
                muscle memory, judgment, and professional habits that only
                come from doing the work, day after day, under real conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — OUR JOURNEY / TIMELINE */}
      <section className="ap-journey section--ap-white" aria-labelledby="ap-journey-heading">
        <div className="container">
          <header className="ap-section-header" data-ap-reveal>
            <span className="ap-eyebrow">02 — Our Journey</span>
            <div className="ap-section-heading-mask">
              <h2 id="ap-journey-heading" className="ap-section-heading">
                Years of Purpose
              </h2>
            </div>
            <div className="ap-rule" aria-hidden="true" />
            <p className="ap-section-sub">
              A timeline of steady, purposeful expansion — driven by student
              outcomes and industry demand.
            </p>
          </header>

          <div className="ap-timeline" data-ap-reveal>
            <div className="ap-timeline__spine" aria-hidden="true">
              <div className="ap-timeline__spine-track" />
            </div>
            <ol className="ap-timeline__list" role="list">
              {(() => {
                let activeCount = 0;
                return MILESTONES.map((m) => {
                  // Alternate active milestones: 1st → LEFT, 2nd → RIGHT, 3rd → LEFT …
                  let side = 'right';
                  if (m.title) {
                    side = activeCount % 2 === 0 ? 'left' : 'right';
                    activeCount++;
                  }
                  return (
                    <li key={m.year} className={`ap-timeline__item${m.title ? ' ap-timeline__item--active' : ''}`}>
                      <div className="ap-timeline__node">
                        <span className="ap-timeline__year">{m.year}</span>
                        <span className={`ap-timeline__dot${m.title ? ' ap-timeline__dot--gold' : ''}`} aria-hidden="true" />
                      </div>
                      <div className={`ap-timeline__content ap-timeline__content--${side}${!m.title ? ' ap-timeline__content--empty' : ''}`}>
                        {m.title && (
                          <>
                            <h3 className="ap-timeline__title">{m.title}</h3>
                            <p className="ap-timeline__desc">{m.description}</p>
                          </>
                        )}
                      </div>
                    </li>
                  );
                });
              })()}
            </ol>
          </div>
        </div>
      </section>

      {/* 04 — WHAT MAKES BRAVO DIFFERENT */}
      <section className="ap-different section--ap-alt" aria-labelledby="ap-different-heading">
        <div className="container">
          <div className="ap-different__grid">
            <div className="ap-different__copy">
              <header data-ap-reveal>
                <span className="ap-eyebrow">03 — What Makes Bravo Different</span>
                <div className="ap-section-heading-mask">
                  <h2 id="ap-different-heading" className="ap-section-heading">
                    Four Principles.<br />One Standard.
                  </h2>
                </div>
                <div className="ap-rule" aria-hidden="true" />
              </header>
              <dl className="ap-different__list">
                <div className="ap-different__entry" data-ap-reveal>
                  <dt className="ap-different__label">Real Equipment, Not Simulations</dt>
                  <dd className="ap-different__text">
                    Every student trains on commercial FAEMA multi-group espresso
                    machines, on-demand conical burr grinders, and professional bar
                    speed rails — the same equipment found in specialty cafés and
                    five-star hotels worldwide. There are no consumer machines, no
                    toy grinders, no shortcuts.
                  </dd>
                </div>
                <div className="ap-different__divider" aria-hidden="true" />
                <div className="ap-different__entry" data-ap-reveal>
                  <dt className="ap-different__label">Live Service Environment</dt>
                  <dd className="ap-different__text">
                    Training happens inside an operational café and bar. Students
                    work real customer rushes, manage tickets under pressure, and
                    build the speed and composure that only real service conditions
                    can teach — not empty classrooms or simulated scenarios.
                  </dd>
                </div>
                <div className="ap-different__divider" aria-hidden="true" />
                <div className="ap-different__entry" data-ap-reveal>
                  <dt className="ap-different__label">Mentor-Led Learning</dt>
                  <dd className="ap-different__text">
                    Instruction from seasoned baristas, mixologists, and culinary
                    leads with competition and commercial hospitality experience.
                    Small batches — typically 6 to 8 per station — ensure each
                    student receives real individual attention and correction
                    throughout every session.
                  </dd>
                </div>
                <div className="ap-different__divider" aria-hidden="true" />
                <div className="ap-different__entry" data-ap-reveal>
                  <dt className="ap-different__label">Career-Focused Outcomes</dt>
                  <dd className="ap-different__text">
                    Programs are designed for employability from the first day.
                    That means trade-test preparation, interview coaching, CV
                    guidance, and direct support for students pursuing
                    international hospitality roles in the Gulf, Australia,
                    and beyond.
                  </dd>
                </div>
              </dl>
            </div>
            <figure className="ap-different__image" data-ap-reveal aria-hidden="true">
              <img
                src={IMAGES.groupTraining2}
                alt="Trainer-led session inside Bravo Café & Bar"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* 05 — THE TRAINING ENVIRONMENT */}
      <section className="ap-environment section--ap-white" aria-labelledby="ap-environment-heading">
        <div className="container">
          <header className="ap-section-header" data-ap-reveal>
            <span className="ap-eyebrow">04 — The Training Environment</span>
            <div className="ap-section-heading-mask">
              <h2 id="ap-environment-heading" className="ap-section-heading">
                Where Practice Becomes Fluency
              </h2>
            </div>
            <div className="ap-rule" aria-hidden="true" />
          </header>
          <div className="ap-environment__rows">
            <div className="ap-environment__row" data-ap-reveal>
              <figure className="ap-environment__media">
                <img
                  src={IMAGES.groupTraining1}
                  alt="Students at the FAEMA espresso bar during a live training session"
                  loading="lazy"
                />
              </figure>
              <div className="ap-environment__text">
                <p className="ap-environment__intro">
                  Bravo is not a training centre that happens to have a café.
                  It is an operational café and bar — and the training happens
                  inside it, during real service.
                </p>
                <p>
                  Students enter the floor from their first day: handling FAEMA
                  machines under load, steaming milk to microfoam standard,
                  sequencing orders during a real morning rush. There is no
                  separate beginner area. The environment is the curriculum.
                </p>
              </div>
            </div>
            <div className="ap-environment__divider" aria-hidden="true" />
            <div className="ap-environment__row ap-environment__row--reverse" data-ap-reveal>
              <figure className="ap-environment__media">
                <img
                  src={IMAGES.baristaTraining2}
                  alt="Barista student practicing espresso technique at Bravo"
                  loading="lazy"
                />
              </figure>
              <div className="ap-environment__text">
                <p className="ap-environment__intro">
                  Professional equipment. Real service rhythms.
                  Unlimited practice time.
                </p>
                <p>
                  Every student has access to commercial equipment throughout
                  the duration of their program. Ingredients are not rationed.
                  Repetition is encouraged until technique becomes instinct —
                  whether that is espresso extraction, cocktail preparation,
                  or mise en place in the commercial kitchen.
                </p>
                <p>
                  Students graduate with a Bravo certificate that documents
                  what they have actually learned to do — recognised by
                  hospitality employers across Nepal, the Gulf, Australia,
                  and Europe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — OUR TRAINERS */}
      <section className="ap-trainers section--ap-alt" aria-labelledby="ap-trainers-heading">
        <div className="container">
          <header className="ap-section-header" data-ap-reveal>
            <span className="ap-eyebrow">05 — Our Trainers</span>
            <div className="ap-section-heading-mask">
              <h2 id="ap-trainers-heading" className="ap-section-heading">
                Guided by People Who Know the Work
              </h2>
            </div>
            <div className="ap-rule" aria-hidden="true" />
            <p className="ap-section-sub">
              Bravo's practical learning is guided by a team of experienced
              trainers and hospitality mentors.
            </p>
          </header>

          {/* Featured Trainer */}
          <div className="ap-featured-trainer" data-ap-reveal>
            <figure className="ap-featured-trainer__media">
              <img
                src={IMAGES.hotChocolate}
                alt="Chandrakanta Wagle — Star Trainer at Bravo Barista School"
                loading="lazy"
              />
            </figure>
            <div className="ap-featured-trainer__copy">
              <span className="ap-eyebrow ap-eyebrow--gold">Featured Trainer</span>
              <div className="ap-featured-heading-mask">
                <h3 className="ap-featured-trainer__name">Chandrakanta Wagle</h3>
              </div>
              <p className="ap-featured-trainer__role">Star Trainer</p>
              <div className="ap-rule" aria-hidden="true" />
              <p className="ap-featured-trainer__bio">
                Chandrakanta is Bravo's lead barista trainer — a coffee and
                hospitality professional with hands-on commercial experience
                working at Starbucks in London. He brings that international
                standard directly to the Bravo floor: precise technique,
                high-volume service discipline, and the kind of mentorship
                that comes from training inside one of the world's most
                recognised coffee operations.
              </p>
              <p className="ap-featured-trainer__bio">
                At Bravo, Chandrakanta leads barista curriculum from espresso
                fundamentals through advanced extraction and latte art — and
                he trains with the same standard he was held to on a
                commercial floor.
              </p>
            </div>
          </div>

          {/* Training Team */}
          <div className="ap-training-team">
            <div className="ap-training-team__header" data-ap-reveal>
              <span className="ap-eyebrow">Training Team</span>
              <div className="ap-full-rule" aria-hidden="true" />
            </div>

            <div className="ap-trainer-row" data-ap-reveal>
              <figure className="ap-trainer-row__media">
                <img
                  src={IMAGES.baristaTraining3}
                  alt="Head Barista Trainer demonstrating technique at Bravo"
                  loading="lazy"
                />
              </figure>
              <div className="ap-trainer-row__copy">
                <span className="ap-eyebrow">Head Barista Trainer</span>
                <p className="ap-trainer-row__text">
                  Leads the core barista curriculum — espresso extraction,
                  milk texturing, latte art, manual brewing, sensory
                  evaluation, and equipment calibration. Training runs across
                  the full Bravo machine station under live service conditions.
                </p>
              </div>
            </div>

            <div className="ap-trainer-divider" aria-hidden="true" />

            <div className="ap-trainer-row ap-trainer-row--reverse" data-ap-reveal>
              <figure className="ap-trainer-row__media">
                <img
                  src={IMAGES.cafeBar}
                  alt="Mixology and bar operations training at Bravo"
                  loading="lazy"
                />
              </figure>
              <div className="ap-trainer-row__copy">
                <span className="ap-eyebrow">Mixology &amp; Bar Operations Lead</span>
                <p className="ap-trainer-row__text">
                  Leads the café and bar program — classic cocktails, working
                  flair, mocktail preparation, high-volume bar management, and
                  hospitality service standards. Training happens behind a
                  fully operational bar serving real customers.
                </p>
              </div>
            </div>

            <div className="ap-trainer-divider" aria-hidden="true" />

            <div className="ap-trainer-row" data-ap-reveal>
              <figure className="ap-trainer-row__media">
                <img
                  src={IMAGES.groupTraining3}
                  alt="Executive culinary mentor instructing at Bravo"
                  loading="lazy"
                />
              </figure>
              <div className="ap-trainer-row__copy">
                <span className="ap-eyebrow">Executive Culinary Mentor</span>
                <p className="ap-trainer-row__text">
                  Oversees the culinary curriculum — professional knife skills,
                  the five mother sauces, hot kitchen technique, HACCP food
                  safety, and modern plating. Leads instruction across
                  individual commercial kitchen stations in the Chef Training
                  program.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 07 — STUDENT EXPERIENCES */}
      <section className="ap-reviews section--ap-white" aria-labelledby="ap-reviews-heading">
        <div className="container">
          <header className="ap-section-header" data-ap-reveal>
            <span className="ap-eyebrow">06 — Student Experiences</span>
            <div className="ap-section-heading-mask">
              <h2 id="ap-reviews-heading" className="ap-section-heading">
                From Our Graduates
              </h2>
            </div>
            <div className="ap-rule" aria-hidden="true" />
            <p className="ap-section-sub">
              Real testimonials from graduates working in hospitality.
            </p>
          </header>
        </div>

        <div className="ap-marquee" aria-label="Student testimonials">
          <div className="ap-marquee__track">
            {marqueeReviews.map((review, index) => (
              <blockquote
                key={`${review.name}-${index}`}
                className="ap-marquee__item"
                aria-hidden={index >= REVIEWS.length}
              >
                <p>"{review.text}"</p>
                <cite>
                  {review.name}
                  <span> · {review.location}</span>
                </cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — FINAL BRAND STATEMENT + CTA */}
      <section className="ap-closing section--ap-deep" aria-labelledby="ap-closing-heading">
        <div className="container">
          <div className="ap-closing__inner" data-ap-reveal>
            <div className="ap-closing__heading-mask">
              <h2 id="ap-closing-heading" className="ap-closing__heading">
                We Don't Just Teach Coffee.
              </h2>
            </div>
            <p className="ap-closing__statement">
              We prepare people for real careers in hospitality — with the
              skills, discipline, and professional confidence to perform
              anywhere in the world.
            </p>
            <div className="ap-closing__actions">
              <Link to="/programs" className="btn btn--cream btn--lg">
                Explore Programs
              </Link>
              <Link to="/contact" className="btn btn--outline-light btn--lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;