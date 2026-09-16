import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { IMAGES } from '../../data/images';

interface NavItem {
 label: string;
 path: string;
 submenu?: { label: string; path: string; badge?: string }[];
}

const NAV_ITEMS: NavItem[] = [
 { label: 'Home', path: '/' },
 {
  label: 'Programs',
  path: '/programs',
  submenu: [
   { label: 'Barista Training', path: '/barista-training' },
   { label: 'Café & Bar Training', path: '/cafe-bar-training' },
   { label: 'Chef Training', path: '/chef-training', badge: 'Soon' },
  ],
 },
 { label: 'Café & Bar', path: '/cafe-bar' },
 { label: 'About', path: '/about' },
 { label: 'Certifications', path: '/certification' },
 { label: 'Gallery', path: '/gallery' },
 { label: 'Contact', path: '/contact' },
];

const Header: React.FC = () => {
 const [drawerOpen, setDrawerOpen] = useState(false);
 const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
 const location = useLocation();

 useEffect(() => {
  setDrawerOpen(false);
  setActiveDropdown(null);
 }, [location.pathname]);

 useEffect(() => {
  if (drawerOpen) {
   document.body.style.overflow = 'hidden';
  } else {
   document.body.style.overflow = '';
  }
  return () => {
   document.body.style.overflow = '';
  };
 }, [drawerOpen]);

 return (
  <>
   <header className="brutal-header" role="banner">
    <div className="container brutal-header__inner">
     {/* Logo & Brand */}
     <Link to="/" className="brutal-logo" aria-label="Bravo Home">
      <div className="brutal-logo__avatar">
       <img src={IMAGES.logo} alt="Bravo Logo" />
      </div>
      <div className="brutal-logo__text-group">
       <span className="brutal-logo__title">BRAVO</span>
       <span className="brutal-badge brutal-badge--sm">EST. 2019</span>
      </div>
     </Link>

     {/* Desktop Nav */}
     <nav className="brutal-nav" aria-label="Main navigation">
      <ul className="brutal-nav__list">
       {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
         <li
          key={item.label}
          className={`brutal-nav__item ${item.submenu ? 'has-sub' : ''}`}
          onMouseEnter={() => item.submenu && setActiveDropdown(item.label)}
          onMouseLeave={() => setActiveDropdown(null)}
         >
          <Link
           to={item.path}
           className={`brutal-nav__link ${isActive ? 'active' : ''}`}
          >
           <span>{item.label}</span>
           {item.submenu && <span className="brutal-nav__arrow"></span>}
          </Link>

          {item.submenu && activeDropdown === item.label && (
           <div className="brutal-dropdown">
            {item.submenu.map((sub) => (
             <Link
              key={sub.label}
              to={sub.path}
              className="brutal-dropdown__link"
             >
              <span className="brutal-dropdown__label">{sub.label}</span>
              {sub.badge && (
               <span className="brutal-badge brutal-badge--white">{sub.badge}</span>
              )}
             </Link>
            ))}
           </div>
          )}
         </li>
        );
       })}
      </ul>
     </nav>

     {/* Action CTA */}
     <div className="brutal-header__actions">
      <Link to="/contact" className="brutal-btn brutal-btn--sm">
       Enroll Now ↗
      </Link>

      {/* Mobile Toggle */}
      <button
       className={`brutal-hamburger${drawerOpen ? ' is-open' : ''}`}
       onClick={() => setDrawerOpen(!drawerOpen)}
       aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
      >
       <span className="hbg-bar" />
       <span className="hbg-bar" />
       <span className="hbg-bar" />
      </button>
     </div>
    </div>
   </header>

   {/* Mobile Drawer */}
   {drawerOpen && (
    <div
     className="brutal-drawer-backdrop"
     onClick={() => setDrawerOpen(false)}
    />
   )}

   <div className={`brutal-drawer ${drawerOpen ? 'open' : ''}`}>
    <div className="brutal-drawer__header">
     <div className="brutal-logo">
      <div className="brutal-logo__avatar">
       <img src={IMAGES.logo} alt="Bravo Logo" />
      </div>
      <span className="brutal-logo__title">BRAVO</span>
     </div>
     <button
      className="brutal-drawer__close"
      onClick={() => setDrawerOpen(false)}
     >
      [ X ]
     </button>
    </div>

    <ul className="brutal-drawer__list">
     {NAV_ITEMS.map((item) => (
      <React.Fragment key={item.label}>
       <li>
        <Link
         to={item.path}
         className={`brutal-drawer__link ${location.pathname === item.path ? 'active' : ''}`}
        >
         <span>{item.label}</span>
        </Link>
       </li>
       {item.submenu && item.submenu.map((sub) => (
        <li key={sub.label} className="brutal-drawer__sub-item">
         <Link
          to={sub.path}
          className={`brutal-drawer__link sub ${location.pathname === sub.path ? 'active' : ''}`}
         >
          <span>{sub.label}</span>
          {sub.badge && <span className="brutal-badge brutal-badge--sm">{sub.badge}</span>}
         </Link>
        </li>
       ))}
      </React.Fragment>
     ))}
     <li>
      <Link
       to="/faq"
       className={`brutal-drawer__link ${location.pathname === '/faq' ? 'active' : ''}`}
      >
       <span>FAQs</span>
      </Link>
     </li>
    </ul>

    <div className="brutal-drawer__footer">
     <Link to="/contact" className="brutal-btn brutal-btn--full">
      Enroll Now ↗
     </Link>
    </div>
   </div>
  </>
 );
};

export default Header;
