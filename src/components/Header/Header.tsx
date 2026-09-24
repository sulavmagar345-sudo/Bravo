import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const NAV_LINKS = [
  { label: 'Home',          path: '/' },
  { label: 'Programs',      path: '/programs',
    sub: [
      { label: 'Barista Training',    path: '/barista-training' },
      { label: 'Café & Bar Training', path: '/cafe-bar-training' },
      { label: 'Chef Training',       path: '/chef-training', badge: 'Soon' },
    ]
  },
  { label: 'About',         path: '/about' },
  { label: 'Certification', path: '/certification' },
  { label: 'Gallery',       path: '/gallery' },
  { label: 'Contact',       path: '/contact' },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdown(null);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Scrolled state for header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click / Escape + keyboard support
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdown(null);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const openDropdown = (label: string) => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setDropdown(label);
  };
  const scheduleClose = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setDropdown(null), 160);
  };
  const cancelClose = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  };

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container site-header__inner">
          {/* Logo */}
          <Link to="/" className="site-logo" aria-label="Bravo Home">
            <img src="/assets/bravo Logo.jpg" alt="Bravo Logo" className="site-logo__img" />
            <div className="site-logo__text-group">
              <span className="site-logo__name">Bravo</span>
              <span className="site-logo__tag">Barista School</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="site-nav" aria-label="Main navigation" ref={dropdownRef}>
            <ul className="site-nav__list">
              {NAV_LINKS.map((item) => (
                <li
                  key={item.label}
                  className={`site-nav__item${item.sub ? ' has-sub' : ''}`}
                  onMouseEnter={() => item.sub && openDropdown(item.label)}
                  onMouseLeave={() => item.sub && scheduleClose()}
                  onFocusCapture={() => item.sub && openDropdown(item.label)}
                  onBlurCapture={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) scheduleClose();
                  }}
                >
                  <Link
                    to={item.path}
                    className={`site-nav__link${location.pathname === item.path ? ' active' : ''}`}
                    aria-haspopup={item.sub ? 'true' : undefined}
                    aria-expanded={item.sub ? dropdown === item.label : undefined}
                    onFocus={() => item.sub && openDropdown(item.label)}
                  >
                    {item.label}
                    {item.sub && <span className="nav-arrow">›</span>}
                  </Link>

                  {item.sub && (
                    <div
                      className={`site-dropdown${dropdown === item.label ? ' open' : ''}`}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      {item.sub.map((s) => (
                        <Link key={s.label} to={s.path} className="site-dropdown__item">
                          {s.label}
                          {s.badge && <span className="nav-badge">{s.badge}</span>}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA + Hamburger */}
          <div className="site-header__actions">
            <Link to="/book" className="btn btn--outline btn--sm header-cta">
              Book Now
            </Link>
            <Link to="/contact" className="btn btn--primary btn--sm header-cta">
              Enroll Now
            </Link>
            <button
              className={`hamburger${menuOpen ? ' is-open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div className={`mobile-drawer${menuOpen ? ' open' : ''}`} aria-modal="true" role="dialog">
        <div className="mobile-drawer__header">
          <Link to="/" className="site-logo" onClick={() => setMenuOpen(false)}>
            <span className="site-logo__name">Bravo</span>
            <span className="site-logo__tag">Barista School</span>
          </Link>
          <button className="mobile-drawer__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="mobile-drawer__nav">
          {NAV_LINKS.map((item) => (
            <React.Fragment key={item.label}>
              <Link
                to={item.path}
                className={`mobile-nav-link${location.pathname === item.path ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
              {item.sub && item.sub.map((s) => (
                <Link
                  key={s.label}
                  to={s.path}
                  className={`mobile-nav-link mobile-nav-link--sub${location.pathname === s.path ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {s.label}
                  {s.badge && <span className="nav-badge">{s.badge}</span>}
                </Link>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="mobile-drawer__footer" style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/book" className="btn btn--outline btn--full" onClick={() => setMenuOpen(false)}>
            Book Now
          </Link>
          <Link to="/contact" className="btn btn--primary btn--full" onClick={() => setMenuOpen(false)}>
            Enroll
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
