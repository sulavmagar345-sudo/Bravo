import React, { useState } from 'react';
import './Contact.css';
import { IMAGES } from '../../data/images';

interface ContactProps {
 initialCourse?: string;
}

const Contact: React.FC<ContactProps> = ({ initialCourse = 'barista' }) => {
 const [formData, setFormData] = useState({
  name: '',
  phone: '',
  email: '',
  course: initialCourse,
  batchTime: 'morning',
  notes: '',
 });

 const [submitted, setSubmitted] = useState(false);

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name || !formData.phone) {
   alert('Please enter your name and phone number.');
   return;
  }
  // Set submitted state
  setSubmitted(true);
 };

 const handleWhatsAppRedirect = () => {
  const text = encodeURIComponent(
   `Hello Bravo! I would like to enroll/inquire:\n` +
   `• Name: ${formData.name}\n` +
   `• Course: ${formData.course}\n` +
   `• Preferred Timing: ${formData.batchTime}\n` +
   `• Phone: ${formData.phone}\n` +
   (formData.notes ? `• Notes: ${formData.notes}` : '')
  );
  window.open(`https://wa.me/9779802004823?text=${text}`, '_blank');
 };

 return (
  <section id="contact" className="contact section section--dark" aria-labelledby="contact-heading">
   <div className="container">
    {/* Section Header */}
    <div className="section-header text-center reveal">
     <span className="eyebrow eyebrow--light">Get in Touch</span>
     <h2 id="contact-heading" className="text-light">
      Enroll Today or <em className="contact__highlight">Visit Us</em>
     </h2>
     <div className="divider divider--center" />
     <p className="contact__sub">
      Take the first step toward your international barista or hospitality career. Fill out the form
      below or drop by our café to experience our classes live.
     </p>
    </div>

    <div className="contact__grid">
     {/* Enrollment Form */}
     <div id="enrollment" className="contact__form-card reveal">
      {!submitted ? (
       <form onSubmit={handleSubmit} className="contact__form">
        <div className="contact__form-header">
         <h3>Online Enrollment &amp; Inquiry</h3>
         <p>Reserve your seat for the next batch. Limited slots per session!</p>
        </div>

        <div className="form-group">
         <label htmlFor="student-name">Full Name *</label>
         <input
          id="student-name"
          type="text"
          required
          placeholder="e.g. Suman Sharma"
          value={formData.name}
          pattern="[A-Za-z\s]+" title="Only letters and spaces are allowed" onChange={(e) => { const val = e.target.value.replace(/[^A-Za-z\s]/g, ''); setFormData({ ...formData, name: val }); }}
         />
        </div>

        <div className="form-row">
         <div className="form-group">
          <label htmlFor="student-phone">Phone / WhatsApp *</label>
          <input
           id="student-phone"
           type="tel"
           required
           pattern="[0-9]+"
           title="Only numbers are allowed"
           placeholder="e.g. 98XXXXXXXX"
           value={formData.phone}
           onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, phone: val });
           }}
          />
         </div>

         <div className="form-group">
          <label htmlFor="student-email">Email Address</label>
          <input
           id="student-email"
           type="email"
           placeholder="name@example.com"
           value={formData.email}
           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
         </div>
        </div>

        <div className="form-row">
         <div className="form-group">
          <label htmlFor="course-select">Select Program *</label>
          <select
           id="course-select"
           value={formData.course}
           onChange={(e) => setFormData({ ...formData, course: e.target.value })}
          >
           <option value="barista">Barista Professional Training</option>
           <option value="cafebar">Café &amp; Bar Bartending Course</option>
           <option value="chef">Professional Chef Training (Waitlist)</option>
           <option value="latteart">Advanced Latte Art Masterclass</option>
          </select>
         </div>

         <div className="form-group">
          <label htmlFor="batch-select">Preferred Slot</label>
          <select
           id="batch-select"
           value={formData.batchTime}
           onChange={(e) => setFormData({ ...formData, batchTime: e.target.value })}
          >
           <option value="morning">Morning (7:30 AM - 10:30 AM)</option>
           <option value="midday">Afternoon (11:30 AM - 2:30 PM)</option>
           <option value="evening">Evening (3:30 PM - 6:30 PM)</option>
           <option value="weekend">Weekend Intensive</option>
          </select>
         </div>
        </div>

        <div className="form-group">
         <label htmlFor="student-notes">Questions or Special Requests</label>
         <textarea
          id="student-notes"
          rows={3}
          placeholder="Tell us about your goals (e.g. preparing for Dubai visa, starting a café, weekend only)..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
         />
        </div>

        <button type="submit" className="btn btn--primary btn--full">
         Submit Enrollment Request <span className="btn-arrow">→</span>
        </button>

        <p className="contact__privacy">
          We respect your privacy. Our admission officer will reach out within 24 hours.
        </p>
       </form>
      ) : (
       <div className="contact__success">
        <div className="contact__success-icon"></div>
        <h3>Enrollment Request Received!</h3>
        <p>
         Thank you, <strong>{formData.name}</strong>! We have recorded your interest for the{' '}
         <strong>{formData.course}</strong> course.
        </p>
        <div className="contact__success-actions">
         <button className="btn btn--primary" onClick={handleWhatsAppRedirect}>
           Chat Instantly on WhatsApp
         </button>
         <button
          className="btn btn--outline-dark"
          onClick={() => setSubmitted(false)}
         >
          Submit Another Inquiry
         </button>
        </div>
       </div>
      )}
     </div>

     {/* Info Card side */}
     <div className="contact__info-col reveal reveal-delay-2">
      <div className="contact__info-card">
       <h3>Visit Bravo</h3>
       <p className="contact__info-lead">
        Our doors are always open. Come by for an artisan espresso, see our students at work,
        or discuss your learning plan with our instructors.
       </p>

       <div className="contact__info-list">
        <div className="contact__info-item">
         <span className="contact__item-icon"></span>
         <div>
          <strong>Location</strong>
          <p>Bravo Barista School &amp; Café, Nepal</p>
          <small>Centrally accessible with parking available</small>
         </div>
        </div>

        <div className="contact__info-item">
         <span className="contact__item-icon"></span>
         <div>
          <strong>Phone &amp; Hotline</strong>
          <p>+977 980-2004823 / +977 01-4XXXXXX</p>
          <small>Direct counseling &amp; admissions line</small>
         </div>
        </div>

        <div className="contact__info-item">
         <span className="contact__item-icon"></span>
         <div>
          <strong>Operational Hours</strong>
          <p>School: Mon – Sat: 7:00 AM – 6:30 PM</p>
          <p>Café &amp; Bar: Everyday: 8:00 AM – 10:00 PM</p>
         </div>
        </div>

        <div className="contact__info-item">
         <span className="contact__item-icon"></span>
         <div>
          <strong>Direct WhatsApp</strong>
          <p>Message our admissions team 24/7 for quick fees &amp; syllabus brochures.</p>
         </div>
        </div>
       </div>


      </div>
     </div>
    </div>
   </div>
  </section>
 );
};

export default Contact;

