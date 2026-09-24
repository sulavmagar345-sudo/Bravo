import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import FloatingCTA from './components/FloatingCTA/FloatingCTA';
import ScrollToTop from './components/ScrollToTop';
import { useScrollReveal } from './hooks/useScrollReveal';

// Public Pages
import HomePage from './pages/HomePage';
import BaristaPage from './pages/BaristaPage';
import CafeBarTrainingPage from './pages/CafeBarTrainingPage';
import CafeBarPage from './pages/CafeBarPage';
import ChefPage from './pages/ChefPage';
import ProgramsPage from './pages/ProgramsPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import CertificationPage from './pages/CertificationPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import BookPage from './pages/BookPage';
import BookTablePage from './pages/BookTablePage';
import BookNetflixPage from './pages/BookNetflixPage';
import VisitPage from './pages/VisitPage';

// Admin Imports
import { useAdminAuth } from './admin/hooks/useAdminAuth';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AccessDenied from './admin/pages/AccessDenied';
import Dashboard from './admin/pages/Dashboard';
import Banners from './admin/pages/Banners';
import Gallery from './admin/pages/Gallery';
import Videos from './admin/pages/Videos';
import Enquiries from './admin/pages/Enquiries';
import Programs from './admin/pages/Programs';
import SiteSettings from './admin/pages/SiteSettings';
import Bookings from './admin/pages/Bookings';
import BookingDetail from './admin/pages/BookingDetail';
import BookingSettings from './admin/pages/BookingSettings';
import './admin/admin.css';

const PublicLayout: React.FC = () => {
  useScrollReveal();

  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main id="main-content">
        <Routes>
          {/* Home Overview */}
          <Route path="/" element={<HomePage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/barista-training" element={<BaristaPage />} />
          <Route path="/cafe-bar-training" element={<CafeBarTrainingPage />} />
          <Route path="/cafe-bar" element={<CafeBarPage />} />
          <Route path="/chef-training" element={<ChefPage />} />
          <Route path="/certification" element={<CertificationPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/book/table" element={<BookTablePage />} />
          <Route path="/book/netflix" element={<BookNetflixPage />} />
          <Route path="/visit" element={<VisitPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};

const AdminRoutes: React.FC = () => {
  const auth = useAdminAuth();

  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/denied" element={<AccessDenied />} />
      <Route element={<ProtectedRoute auth={auth}><AdminLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/banners" element={<Banners />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/enquiries" element={<Enquiries />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/settings" element={<SiteSettings />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/booking-settings" element={<BookingSettings />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/007/*" element={<AdminRoutes />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
