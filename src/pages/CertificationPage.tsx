import React from 'react';
import PageBanner from '../components/PageBanner/PageBanner';
import Certification from '../components/Certification/Certification';
import Testimonials from '../components/Testimonials/Testimonials';
import { IMAGES } from '../data/images';
import './CertificationPage.css';

const CertificationPage: React.FC = () => {
 return (
  <div className="certification-page">
   <PageBanner
    icon="🎖️"
    badge="Accredited & Verified"
    title="Official Certifications &amp; Careers"
    subtitle="Discover how a Bravo credential unlocks rewarding careers in Nepal, the Gulf, Europe, and Australia."
    bgImage={IMAGES.certificates}
    breadcrumbs={[{ label: 'Certifications' }]}
   />

   <Certification />
   <Testimonials />
  </div>
 );
};

export default CertificationPage;
