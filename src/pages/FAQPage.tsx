import React from 'react';
import PageBanner from '../components/PageBanner/PageBanner';
import FAQ from '../components/FAQ/FAQ';
import { IMAGES } from '../data/images';
import './FAQPage.css';

const FAQPage: React.FC = () => {
 return (
  <div className="faq-page">
   <PageBanner
    icon="?"
    badge="Help & Guidance"
    title="Frequently Asked Questions"
    subtitle="Answers to common queries regarding course prerequisites, fees, equipment, certifications, and café visits."
    bgImage={IMAGES.cafeInterior}
    breadcrumbs={[{ label: 'FAQs' }]}
   />

   <FAQ />
  </div>
 );
};

export default FAQPage;
