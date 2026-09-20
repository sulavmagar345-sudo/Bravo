import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { GALLERY_IMAGES, IMAGES } from '../data/images';
import { fetchVideoBySlot, getVideoUrl } from '../admin/services/videos';
import './HomePage.css';

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
      'Manual brewing: V60, AeroPress, Chemex'
    ], 
    image: IMAGES.baristaTraining3, 
    alt: 'Student practising espresso preparation during barista training', 
    path: '/barista-training' 
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
      'Speed rail workflows and order sequencing'
    ], 
    image: IMAGES.barAction, 
    alt: 'Bar training and flair performance at Bravo', 
    path: '/cafe-bar-training' 
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
      'Modern plating and presentation techniques'
    ], 
    image: IMAGES.groupTraining2, 
    alt: 'Bravo students in hands-on training session', 
    path: '/chef-training' 
  },
];

const REVIEWS = [
  { name: 'Suman Thapa', location: 'Dubai, UAE', text: 'Bravo gave me the skills and confidence to land a job at a 5-star hotel in Dubai within 3 months of graduating.' },
  { name: 'Priya Shrestha', location: 'Kathmandu, Nepal', text: 'I came in knowing nothing about espresso. I left with a certificate and the knowledge to open my own café.' },
  { name: 'Rajan Gurung', location: 'Melbourne, Australia', text: 'The specialty coffee curriculum here rivals international standards. I use everything I learned at Bravo every single day.' },
  { name: 'Anjali Tamang', location: 'Pokhara, Nepal', text: 'The hands-on practice with real customers made all the difference. I felt job-ready from day one.' },
  { name: 'Bikash Rai', location: 'Singapore', text: "The instructors genuinely care about your growth. It's more than a school — it's a community." },
];

const VIDEO_SRC = '/assets/AQMc8AXPZcoYSBYQjfRbHUAv5_M0fX7UZ_bQviBTR7TPPtgG0cKqpu9QxJax39ISQAWaoP9P46qq3keIxBh9XT2mIUWasllppmatyRFh8aW8Lg.mp4';

const Counter: React.FC<{ value: number; suffix: string; label: string }> = ({ value, suffix, label }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(element);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(value); return; }
      let current = 0;
      const step = Math.max(1, Math.ceil(value / 42));
      const timer = window.setInterval(() => {
        current += step;
        if (current >= value) { setCount(value); window.clearInterval(timer); } else setCount(current);
      }, 24);
    }, { threshold: 0.45 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);
  return <div className="home-stat" ref={ref}><strong>{count}{suffix}</strong><span>{label}</span></div>;
};

const HomePage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState(VIDEO_SRC);

  useEffect(() => {
    // Fetch video from Supabase
    fetchVideoBySlot('welcome')
      .then(video => {
        if (video) setVideoUrl(getVideoUrl(video.video_path));
      })
      .catch(console.error);

    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.25, rootMargin: '0px 0px -10px' });
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const marqueeReviews = [...REVIEWS, ...REVIEWS];
  const gallery = [GALLERY_IMAGES[0], GALLERY_IMAGES[6], GALLERY_IMAGES[12], GALLERY_IMAGES[15]];

  return (
    <div className="home-page" ref={rootRef}>
      <section className="home-hero" aria-labelledby="home-title">
        <img className="home-hero__image" src={IMAGES.team} alt="Bravo Barista School team and students" />
        <div className="home-hero__shade" />
        <div className="home-hero__content container">
          <p className="home-kicker home-kicker--light">Est. 2019 · Kathmandu, Nepal</p>
          <h1 id="home-title">The Art of<br /><em>Coffee &amp; Craft</em></h1>
          <p className="home-hero__lede">Hands-on hospitality training inside a working café and bar.</p>
          <div className="home-hero__actions"><Link className="btn btn--cream" to="/programs">Explore Programs</Link><Link className="home-text-link home-text-link--light" to="/about">Our Story <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      <section className="home-quote" aria-label="Our philosophy"><div className="container" data-reveal><p className="home-kicker">Our philosophy</p><blockquote><span className="home-quote__line"><span>"Every great barista was once a beginner</span></span><span className="home-quote__line"><span>who refused to give up."</span></span></blockquote><cite>Bravo Philosophy</cite></div></section>

      <section className="home-welcome section section--white" aria-labelledby="welcome-title">
        <div className="container home-welcome__grid">
          <figure className="home-welcome__media" data-reveal>
            <video controls muted playsInline preload="metadata" key={videoUrl}>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <figcaption>Welcome to Bravo — training in session</figcaption>
          </figure>
          <div className="home-welcome__copy" data-reveal>
            <p className="home-kicker">Welcome to Bravo</p>
            <h2 id="welcome-title">A Real Training Environment</h2>
            <p>See our students learning inside an active café and bar. This is where theory meets practice — with commercial equipment, real service rhythms, and working hospitality standards.</p>
          </div>
        </div>
      </section>

      <section className="home-programs section" aria-labelledby="programs-title"><div className="container">
        <header className="home-section-head" data-reveal><p className="home-kicker">What we teach</p><h2 id="programs-title">Our Programs</h2><p>Practical training for people building a career in coffee, bar service and hospitality.</p></header>
        <div className="home-program-list">{PROGRAMS.map((program, index) => <article className={`home-program ${index % 2 ? 'home-program--reverse' : ''}`} key={program.number} data-reveal>
          <div className="home-program__copy"><span className="home-program__number">{program.number}</span><h3>{program.title}</h3><p className="home-program__meta">{program.meta}</p><p>{program.description}</p><p className="home-program__label">{program.label}</p><ul>{program.points.map((point) => <li key={point}>{point}</li>)}</ul><Link className="home-text-link" to={program.path}>Want to know more <span aria-hidden="true">→</span></Link></div>
          <figure className="home-program__image"><img src={program.image} alt={program.alt} loading="lazy" /></figure>
        </article>)}</div>
        <Link className="home-text-link home-programs__all" to="/programs">View all programs <span aria-hidden="true">→</span></Link>
      </div></section>

      <section className="home-quote" aria-label="Graduate story"><div className="container" data-reveal><p className="home-kicker">A graduate’s perspective</p><blockquote><span>“Bravo gave me the skills and confidence</span><span>to land a job at a 5-star hotel in Dubai.”</span></blockquote><cite>Suman Thapa <span>· Dubai, UAE</span></cite></div></section>


      <section className="home-stats" aria-label="Bravo by the numbers"><div className="container"><p className="home-kicker home-kicker--light">By the numbers</p><div className="home-stats__grid"><Counter value={500} suffix="+" label="Certified graduates" /><Counter value={6} suffix="+" label="Years teaching" /><Counter value={3} suffix="" label="Programs" /><Counter value={95} suffix="%" label="Job placement" /></div></div></section>

      <section className="home-testimonials section" aria-labelledby="stories-title"><div className="container"><header className="home-section-head" data-reveal><p className="home-kicker">Beyond the classroom</p><h2 id="stories-title">Stories From Our Students</h2></header></div><div className="home-marquee" aria-label="Student testimonials"><div className="home-marquee__track">{marqueeReviews.map((review, index) => <blockquote className="home-marquee__item" key={`${review.name}-${index}`} aria-hidden={index >= REVIEWS.length}><p>“{review.text}”</p><cite>{review.name} <span>· {review.location}</span></cite></blockquote>)}</div></div></section>

      <section className="home-gallery section" aria-labelledby="gallery-title"><div className="container"><header className="home-gallery__head" data-reveal><div><p className="home-kicker">From the floor</p><h2 id="gallery-title">A Glimpse of Bravo</h2></div><Link className="home-text-link" to="/gallery">View Gallery <span aria-hidden="true">→</span></Link></header><div className="home-gallery__grid" data-reveal>{gallery.map((image, index) => <figure className={`home-gallery__image home-gallery__image--${index + 1}`} key={image.src}><img src={image.src} alt={image.alt} loading="lazy" /></figure>)}</div></div></section>

      <section className="home-certificate section" aria-labelledby="certificate-title"><div className="container home-certificate__grid"><figure className="home-certificate__image" data-reveal><img src={IMAGES.certificates} alt="Bravo course completion certificate" loading="lazy" /></figure><div className="home-certificate__copy" data-reveal><p className="home-kicker">Recognition that travels</p><h2 id="certificate-title">A Certificate You Can Carry Forward</h2><p>Complete your training with a Bravo certificate that records the skills and commitment behind your next hospitality role.</p><Link className="home-text-link" to="/certification">View Certification <span aria-hidden="true">→</span></Link></div></div></section>

      <section className="home-closing"><div className="container home-closing__inner" data-reveal><p className="home-kicker home-kicker--light">Your next chapter</p><h2>Ready to Start Your Journey?</h2><p>Explore the program that fits your goals.</p><div><Link className="btn btn--cream" to="/programs">Explore Programs</Link><Link className="btn btn--outline-light" to="/contact">Contact Us</Link></div></div></section>
    </div>
  );
};

export default HomePage;
