import React from 'react';
import { Link } from 'react-router-dom';
import './PageBanner.css';

interface PageBannerProps {
  icon: string;
  badge?: string;
  title: string;
  subtitle: string;
  bgImage?: string;
  breadcrumbs: { label: string; path?: string }[];
}

const PageBanner: React.FC<PageBannerProps> = ({
  icon,
  badge,
  title,
  subtitle,
  bgImage,
  breadcrumbs,
}) => {
  const isSolid = !bgImage;
  return (
    <div className={`page-banner${isSolid ? ' page-banner--solid' : ''}`}>
      {bgImage ? (
        <div className="page-banner__bg" aria-hidden="true">
          <img src={bgImage} alt="" className="page-banner__img" />
          <div className="page-banner__overlay" />
        </div>
      ) : null}

   <div className="container page-banner__container">
    <nav className="page-banner__breadcrumbs" aria-label="Breadcrumb">
     <Link to="/">Home</Link>
     {breadcrumbs.map((b, i) => (
      <React.Fragment key={i}>
       <span className="page-banner__crumb-sep">/</span>
       {b.path ? (
        <Link to={b.path}>{b.label}</Link>
       ) : (
        <span className="page-banner__crumb-current">{b.label}</span>
       )}
      </React.Fragment>
     ))}
    </nav>

    <div className="page-banner__content">
     {badge && <span className="page-banner__badge">{badge}</span>}

     <h1 className="page-banner__title">{title}</h1>
     <p className="page-banner__subtitle">{subtitle}</p>
    </div>
   </div>
  </div>
 );
};

export default PageBanner;
