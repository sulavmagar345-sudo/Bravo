import React from 'react';
import PageBanner from '../components/PageBanner/PageBanner';
import Contact from '../components/Contact/Contact';
import FAQ from '../components/FAQ/FAQ';
import { IMAGES } from '../data/images';
import './ContactPage.css';

const ContactPage: React.FC = () => {
 return (
  <div className="contact-page">
   <PageBanner
    icon=""
    badge="Admissions Office"
    title="Contact &amp; Campus Admissions"
    subtitle="Reserve your seat in our next batch, ask questions about course schedules and fees, or drop by Bravo Café &amp; Bar."
    bgImage={IMAGES.cafeEvent2}
    breadcrumbs={[{ label: 'Contact' }]}
   />

   {/* Main Contact & Enrollment form */}
   <Contact />

   {/* FAQs Section */}
   <FAQ />
  </div>
 );
};

export default ContactPage;
