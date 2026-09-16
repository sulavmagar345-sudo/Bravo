import React from 'react';
import Hero from '../components/Hero/Hero';
import Stats from '../components/Stats/Stats';
import About from '../components/About/About';
import Programs from '../components/Programs/Programs';
import BaristaSection from '../components/BaristaSection/BaristaSection';
import CafeBar from '../components/CafeBar/CafeBar';
import ChefSection from '../components/ChefSection/ChefSection';

import FAQ from '../components/FAQ/FAQ';
import Contact from '../components/Contact/Contact';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
 const navigate = useNavigate();

 const handleOpenWaitlist = () => {
  navigate('/chef-training');
 };

 return (
  <div className="home-page">
   <Hero />
   <Stats />
   <About />
   <Programs />
   <BaristaSection />
   <CafeBar />
   <ChefSection onOpenWaitlist={handleOpenWaitlist} />
   <FAQ />
   <Contact />
  </div>
 );
};

export default HomePage;
