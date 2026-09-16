import React, { useState, useEffect } from 'react';
import './Gallery.css';
import { GALLERY_IMAGES, GalleryImage } from '../../data/images';

type CategoryFilter = 'all' | 'barista' | 'cafe' | 'bar' | 'training' | 'events';

const CATEGORIES: { label: string; value: CategoryFilter }[] = [
 { label: 'All Moments', value: 'all' },
 { label: 'Barista Craft', value: 'barista' },
 { label: 'Café Vibes', value: 'cafe' },
 { label: 'Bar & Flair', value: 'bar' },
 { label: 'Classroom & Training', value: 'training' },
 { label: 'Certifications & Events', value: 'events' },
];

const Gallery: React.FC = () => {
 const [filter, setFilter] = useState<CategoryFilter>('all');
 const [activeIdx, setActiveIdx] = useState<number | null>(null);

 const filteredImages = filter === 'all'
  ? GALLERY_IMAGES
  : GALLERY_IMAGES.filter((img) => img.category === filter);

 // Close lightbox on Escape, arrows to navigate
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
  <section id="gallery" className="gallery section section--white" aria-labelledby="gallery-heading">
   <div className="container">
    {/* Header */}
    <div className="section-header text-center reveal">
     <span className="eyebrow">Visual Tour</span>
     <h2 id="gallery-heading">
      Life at <em className="gallery__highlight">Bravo</em>
     </h2>
     <div className="divider divider--center" />
     <p className="gallery__sub">
      From intense espresso extraction to latte art competitions, flair bartending, and proud graduation days.
      Here is what our everyday looks like.
     </p>
    </div>

    {/* Filter Tabs */}
    <div className="gallery__filters reveal">
     {CATEGORIES.map((cat) => (
      <button
       key={cat.value}
       className={`gallery__filter-btn ${filter === cat.value ? 'active' : ''}`}
       onClick={() => {
        setFilter(cat.value);
        setActiveIdx(null);
       }}
      >
       {cat.label}
      </button>
     ))}
    </div>

    {/* Masonry-Style Grid */}
    <div className="gallery__grid">
     {filteredImages.map((img: GalleryImage, idx: number) => (
      <div
       key={`${img.src}-${idx}`}
       className="gallery__item reveal"
       onClick={() => setActiveIdx(idx)}
       role="button"
       tabIndex={0}
       onKeyDown={(e) => e.key === 'Enter' && setActiveIdx(idx)}
      >
       <div className="gallery__img-wrapper">
        <img
         src={img.src}
         alt={img.alt}
         className="gallery__img"
         loading="lazy"
        />
        <div className="gallery__overlay">
         <span className="gallery__zoom-icon"></span>
         <div className="gallery__info">
          <span className="gallery__tag">{img.category}</span>
          <p className="gallery__caption">{img.alt}</p>
         </div>
        </div>
       </div>
      </div>
     ))}
    </div>
   </div>

   {/* Lightbox Modal */}
   {activeIdx !== null && (
    <div
     className="gallery__lightbox"
     onClick={() => setActiveIdx(null)}
     role="dialog"
     aria-modal="true"
    >
     <button
      className="gallery__lb-close"
      onClick={() => setActiveIdx(null)}
      aria-label="Close image preview"
     >
      
     </button>

     <button
      className="gallery__lb-arrow gallery__lb-arrow--prev"
      onClick={(e) => {
       e.stopPropagation();
       handlePrev();
      }}
      aria-label="Previous image"
     >
      ‹
     </button>

     <div className="gallery__lb-content" onClick={(e) => e.stopPropagation()}>
      <img
       src={filteredImages[activeIdx].src}
       alt={filteredImages[activeIdx].alt}
       className="gallery__lb-img"
      />
      <div className="gallery__lb-footer">
       <span className="gallery__lb-counter">
        {activeIdx + 1} / {filteredImages.length}
       </span>
       <span className="gallery__lb-caption">
        {filteredImages[activeIdx].alt}
       </span>
       <span className="gallery__lb-badge">
        {filteredImages[activeIdx].category}
       </span>
      </div>
     </div>

     <button
      className="gallery__lb-arrow gallery__lb-arrow--next"
      onClick={(e) => {
       e.stopPropagation();
       handleNext();
      }}
      aria-label="Next image"
     >
      ›
     </button>
    </div>
   )}
  </section>
 );
};

export default Gallery;
