import React, { useState, useEffect } from 'react';
import PageBanner from '../components/PageBanner/PageBanner';
import { GALLERY_IMAGES, GalleryImage, IMAGES } from '../data/images';
import { fetchPublishedGalleryItems, getGalleryImageUrl } from '../admin/services/gallery';
import { fetchActiveVideos, getVideoUrl } from '../admin/services/videos';
import type { Video } from '../admin/types';
import './GalleryPage.css';

type CategoryFilter = 'all' | 'barista' | 'cafe' | 'bar' | 'training' | 'events';

const CATEGORIES: { label: string; value: CategoryFilter }[] = [
 { label: 'All Photos', value: 'all' },
 { label: 'Barista Craft', value: 'barista' },
 { label: 'Café Vibes', value: 'cafe' },
 { label: 'Bar & Flair', value: 'bar' },
 { label: 'Training & Classes', value: 'training' },
 { label: 'Events & Certifications', value: 'events' },
];

const FALLBACK_VIDEOS = [
 {
  title: 'Hands-on Barista Training in Action',
  desc: 'Watch our students steam microfoam and practice commercial machine workflows.',
  src: '/assets/AQMMqaPfj01ksylGcqLS_dIJNYi5oHxrzMI-ZmQyJ0KAOH95JilAIPO9Ruy3gukWc1ORwiUwbP8UmkBD0_nPDIsJrz_38RN6aBEwZKtrzV1g8w.mp4',
 },
 {
  title: 'Café & Bar Atmosphere & Hospitality',
  desc: 'Behind the scenes at Bravo Café & Bar, where students gain real customer service experience.',
  src: '/assets/AQMc8AXPZcoYSBYQjfRbHUAv5_M0fX7UZ_bQviBTR7TPPtgG0cKqpu9QxJax39ISQAWaoP9P46qq3keIxBh9XT2mIUWasllppmatyRFh8aW8Lg.mp4',
 },
];

const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  
  // Dynamic data state
  const [dynamicImages, setDynamicImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState(FALLBACK_VIDEOS);

  // Combine static fallback + dynamic from DB
  const allImages = [...dynamicImages, ...GALLERY_IMAGES];
  
  const filteredImages = filter === 'all'
   ? allImages
   : allImages.filter((img) => img.category === filter);

  useEffect(() => {
    // Fetch dynamic gallery items
    fetchPublishedGalleryItems().then(items => {
      const mapped = items.map(i => ({
        src: getGalleryImageUrl(i.image_path),
        category: i.category as any,
        alt: i.title || 'Bravo Gallery Image'
      }));
      setDynamicImages(mapped);
    }).catch(console.error);

    // Fetch dynamic videos
    fetchActiveVideos().then(vids => {
      if (vids.length > 0) {
        setVideos(vids.map(v => ({
          title: v.display_name,
          desc: v.description || '',
          src: getVideoUrl(v.video_path)
        })));
      }
    }).catch(console.error);
  }, []);

 useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
   if (activeIdx === null) return;
   if (e.key === 'Escape') setActiveIdx(null);
   if (e.key === 'ArrowRight') handleNext();
   if (e.key === 'ArrowLeft') handlePrev();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
 }, [activeIdx, filteredImages.length]);

 const handleNext = () => {
  if (activeIdx === null) return;
  setActiveIdx((prev) => (prev! + 1) % filteredImages.length);
 };

 const handlePrev = () => {
  if (activeIdx === null) return;
  setActiveIdx((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
 };

 return (
  <div className="gallery-page">
   <PageBanner
    icon="📸"
    badge="Over 35+ Real Assets"
    title="Visual Showcase &amp; Videos"
    subtitle="Step inside Bravo Barista School & Café & Bar through our candid photos and live training videos."
    bgImage={IMAGES.latteArtRow}
    breadcrumbs={[{ label: 'Gallery' }]}
   />

   {/* Video Section */}
   <section className="section section--white">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Real Action Videos</span>
      <h2>Watch Bravo in Motion</h2>
      <div className="divider divider--center" />
      <p className="section-subtitle">
       See the hands-on energy and technique our students practice every single day.
      </p>
     </div>

      <div className="video-showcase-grid reveal">
       {videos.map((v, i) => (
         <figure className="video-figure">
          <video
           controls
           preload="metadata"
           playsInline
           className="video-player"
           key={v.src}
          >
           <source src={v.src} type="video/mp4" />
           Your browser does not support the video tag.
          </video>
          <figcaption className="video-caption">
           <span className="video-caption__icon">▶</span> {v.title}
          </figcaption>
         </figure>
       ))}
      </div>
    </div>
   </section>

   {/* Photo Gallery */}
   <section className="section section--gray">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Photo Archive</span>
      <h2>Moments Across the Years</h2>
      <div className="divider divider--center" />
     </div>

     {/* Filter Tabs */}
     <div className="g-page-filters reveal">
      {CATEGORIES.map((cat) => (
       <button
        key={cat.value}
        className={`g-filter-btn ${filter === cat.value ? 'active' : ''}`}
        onClick={() => {
         setFilter(cat.value);
         setActiveIdx(null);
        }}
       >
        {cat.label}
       </button>
      ))}
     </div>

     {/* Photos Grid */}
     <div className="g-page-grid reveal">
      {filteredImages.map((img: GalleryImage, idx: number) => (
       <div
        key={`${img.src}-${idx}`}
        className="g-page-item"
        onClick={() => setActiveIdx(idx)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setActiveIdx(idx)}
       >
        <div className="g-page-thumb-wrap">
         <img src={img.src} alt={img.alt} className="g-page-thumb" loading="lazy" />
         <div className="g-page-overlay">
          <span className="g-page-zoom">View</span>
          <span className="g-page-caption">{img.alt}</span>
         </div>
        </div>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Lightbox Modal */}
   {activeIdx !== null && (
    <div className="gallery__lightbox" onClick={() => setActiveIdx(null)} role="dialog">
     <button className="gallery__lb-close" onClick={() => setActiveIdx(null)}></button>
     <button className="gallery__lb-arrow gallery__lb-arrow--prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>‹</button>
     <div className="gallery__lb-content" onClick={(e) => e.stopPropagation()}>
      <img src={filteredImages[activeIdx].src} alt={filteredImages[activeIdx].alt} className="gallery__lb-img" />
      <div className="gallery__lb-footer">
       <span className="gallery__lb-counter">{activeIdx + 1} / {filteredImages.length}</span>
       <span className="gallery__lb-caption">{filteredImages[activeIdx].alt}</span>
       <span className="gallery__lb-badge">{filteredImages[activeIdx].category}</span>
      </div>
     </div>
     <button className="gallery__lb-arrow gallery__lb-arrow--next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>›</button>
    </div>
   )}
  </div>
 );
};

export default GalleryPage;
