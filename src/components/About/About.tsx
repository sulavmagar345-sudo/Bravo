import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About: React.FC = () => {
 return (
  <section id="about" className="brutal-section brutal-section--paper" aria-labelledby="about-heading">
   <div className="container">
    <div className="about-home-header">
     <div className="badge-row">
      <span className="brutal-badge">ABOUT BRAVO</span>
      <span className="brutal-badge brutal-badge--white">ESTABLISHED 2019</span>
     </div>
     <h2 id="about-heading">
      CRAFTED WITH PURPOSE <span className="extrude-text-dark">SINCE 2019</span>
     </h2>
     <div className="brutal-hairline" />
    </div>

    {/* Video at top of About section */}
    <div className="about-home-video-wrap">
     <div className="about-home-video-bar">
      <span>WATCH BRAVO IN ACTION — REAL COMMERCIAL TRAINING</span>
      <span className="brutal-badge brutal-badge--sm">HD VIDEO</span>
     </div>
     <div className="about-home-video-frame">
      <video
       controls
       muted
       loop
       playsInline
      >
       {/* Man with glasses video */}
       <source
        src="/assets/AQOymab3-Qdbxu7asAI6dRbZ8iP44xQBqmIsg6FLeqXEiedcuXinGkxKBb3PJNHGFgtfLZeqfsQDsgwdGNBWtwDLiZZIEx8Jsfn8m5eSVbbSMQ.mp4"
        type="video/mp4"
       />
       Your browser does not support HTML5 video.
      </video>
     </div>
    </div>

    {/* Story paragraph directly under video */}
    <div className="about-home-story brutal-card">
     <h3>PRACTICAL COFFEE EDUCATION MEETS LIVE HOSPITALITY</h3>
     <p className="lead">
      Bravo combines an accredited barista and mixology academy with an active, operational café and cocktail bar under one roof in Nepal.
     </p>
     <p>
      Our students do not just study in theory. They extract on commercial multi-group FAEMA machines, calibrate commercial conical burr grinders, and steam velvety microfoam during active café rush hours.
     </p>

     <div className="about-home-footer-row">
      <div className="about-quick-stats">
       <div><strong>500+</strong> <span>Certified Graduates</span></div>
       <div><strong>6+</strong> <span>Years Active</span></div>
       <div><strong>100%</strong> <span>Practical Training</span></div>
      </div>
      <Link to="/about" className="brutal-btn">
       Read Full Story &amp; Mentors ↗
      </Link>
     </div>
    </div>
   </div>
  </section>
 );
};

export default About;
