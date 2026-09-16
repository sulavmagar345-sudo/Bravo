import React, { useState } from 'react';
import PageBanner from '../components/PageBanner/PageBanner';
import { IMAGES } from '../data/images';
import './CafeBarPage.css';

const MENU_CATEGORIES = [
 {
  category: 'Specialty Coffee',
  items: [
   { name: 'Espresso (Single / Double)', price: 'Rs. 120 / 180', desc: 'Freshly ground premium blend with thick golden crema' },
   { name: 'Caffè Latte / Flat White', price: 'Rs. 220', desc: 'Silky microfoam over double espresso ristretto with free-pour art' },
   { name: 'Cappuccino', price: 'Rs. 200', desc: 'Equal parts espresso, steamed milk, and airy velvety froth with cocoa dust' },
   { name: 'Manual V60 Pour-Over', price: 'Rs. 250', desc: 'Single-origin beans highlighting floral and fruity notes' },
   { name: 'Cold Brew on Ice', price: 'Rs. 240', desc: '16-hour slow steeped, remarkably smooth and naturally sweet' },
  ],
 },
 {
  category: 'Artisan Shakes & Refreshers',
  items: [
   { name: 'Bravo Loaded Chocolate Freakshake', price: 'Rs. 380', desc: 'Rich chocolate shake topped with brownie bites, fudge & whipped cream' },
   { name: 'Caramel Hazelnut Frappé', price: 'Rs. 320', desc: 'Blended espresso, roasted hazelnut syrup, milk and caramel drizzle' },
   { name: 'Fresh Mint & Berry Mojito (Virgin)', price: 'Rs. 260', desc: 'Muddled fresh mint, wild berries, lime wedges, sparkling soda' },
   { name: 'Tropical Mango Passion Soda', price: 'Rs. 240', desc: 'Real mango pulp, passion fruit puree, and crushed ice' },
  ],
 },
 {
  category: 'Signature Cocktails & Bar',
  items: [
   { name: 'Bravo Espresso Martini', price: 'Rs. 550', desc: 'Fresh hot espresso, vodka, coffee liqueur, shaken with velvety head' },
   { name: 'Smoked Old Fashioned', price: 'Rs. 650', desc: 'Bourbon, aromatic bitters, sugar cube, flamed orange peel smoke' },
   { name: 'Classic Mojito & Variants', price: 'Rs. 480', desc: 'White rum, lime juice, mint leaves, soda water, raw cane sugar' },
   { name: 'Live Flair Cocktail of the Night', price: 'Rs. 590', desc: 'Special cocktail prepared live by our flair bartenders' },
  ],
 },
];

const CafeBarPage: React.FC = () => {
 const [reserved, setReserved] = useState(false);
 const [reserveInfo, setReserveInfo] = useState({ name: '', phone: '', date: '', guests: '2' });

 const handleReserve = (e: React.FormEvent) => {
  e.preventDefault();
  setReserved(true);
 };

 return (
  <div className="cafebar-page">
   <PageBanner
    icon="🍺"
    badge="Est. 2019"
    title="Bravo Café &amp; Bar"
    subtitle="Where specialty coffee culture meets vibrant nightlife. Enjoy artisan roasts by day and hand-crafted cocktails by night."
    bgImage={IMAGES.cafeInterior}
    breadcrumbs={[{ label: 'Café & Bar' }]}
   />

   {/* Intro Story */}
   <section className="section section--white">
    <div className="container">
     <div className="cb-intro reveal">
      <div className="cb-intro__text">
       <span className="eyebrow">A Welcoming Sanctuary</span>
       <h2>A Café Born from Passion for Craft</h2>
       <div className="divider" />
       <p className="lead">
        Bravo Café &amp; Bar is not an ordinary commercial venue. It is the heart of our community,
        where master baristas, talented trainees, coffee aficionados, and friends gather.
       </p>
       <p>
        From 8:00 AM every morning, the air fills with the aroma of freshly roasted beans and
        steaming milk. In the evenings, the lighting dims, mellow acoustic music gives way to energetic
        playlists, and our mixologists step up to shake, stir, and ignite spectacular flair performances.
       </p>

       <div className="cb-info-grid">
        <div className="cb-info-box">
         <strong>Daily Hours</strong>
         <span>8:00 AM – 10:00 PM (Everyday)</span>
        </div>
        <div className="cb-info-box">
         <strong>Amenities</strong>
         <span>High-speed Wi-Fi, Work-friendly tables, Outdoor seating</span>
        </div>
       </div>
      </div>

      <div className="cb-intro__img-wrap reveal reveal-delay-2">
       <img
        src={IMAGES.cafeInterior}
        alt="Inside Bravo Café & Bar"
        className="cb-intro-img"
       />
      </div>
     </div>
    </div>
   </section>

   {/* Ambiance Gallery */}
   <section className="section section--gray">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Atmosphere &amp; Moments</span>
      <h2>Day to Night Experience</h2>
      <div className="divider divider--center" />
     </div>

     <div className="cb-ambiance-grid reveal">
      <div className="cb-ambiance-card">
       <img src={IMAGES.latteArt} alt="Latte Art at Cafe" />
       <div className="cb-ambiance-label">
        <strong>Morning Coffee Routine</strong>
        <span>Specialty espresso &amp; quiet workspace</span>
       </div>
      </div>
      <div className="cb-ambiance-card">
       <img src={IMAGES.milkshakes} alt="Sweet Shakes" />
       <div className="cb-ambiance-label">
        <strong>Afternoon Treats</strong>
        <span>Artisan shakes &amp; cool sips</span>
       </div>
      </div>
      <div className="cb-ambiance-card">
       <img src={IMAGES.cafeEvent1} alt="Live Music Night" />
       <div className="cb-ambiance-label">
        <strong>Live Music Nights</strong>
        <span>Acoustic vibes &amp; community jams</span>
       </div>
      </div>
      <div className="cb-ambiance-card">
       <img src={IMAGES.cafeBar} alt="Bar Show" />
       <div className="cb-ambiance-label">
        <strong>Evening Flair Shows</strong>
        <span>World-class bartending performance</span>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Menu Showcase */}
   <section className="section section--white">
    <div className="container">
     <div className="section-header text-center reveal">
      <span className="eyebrow">Curated Menu</span>
      <h2>Taste the Bravo Standard</h2>
      <div className="divider divider--center" />
      <p className="section-subtitle">
       Every drink is crafted with fresh ingredients, balanced recipes, and barista pride.
      </p>
     </div>

     <div className="cb-menu-grid">
      {MENU_CATEGORIES.map((cat, idx) => (
       <div key={idx} className="cb-menu-card reveal">
        <h3 className="cb-menu-cat-title">{cat.category}</h3>
        <div className="cb-menu-items">
         {cat.items.map((item, i) => (
          <div key={i} className="cb-menu-item">
           <div className="cb-item-header">
            <span className="cb-item-name">{item.name}</span>
            <span className="cb-item-price">{item.price}</span>
           </div>
           <p className="cb-item-desc">{item.desc}</p>
          </div>
         ))}
        </div>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Table Reservation & Events */}
   <section className="section section--dark">
    <div className="container">
     <div className="cb-reserve-layout reveal">
      <div className="cb-reserve-info">
       <span className="eyebrow eyebrow--light">Reservations &amp; Gatherings</span>
       <h2 className="text-light">Book a Table or Host an Event</h2>
       <p>
        Planning a birthday celebration, coffee tasting meetup, or private social gathering?
        Reserve your spot ahead of time or request full venue booking.
       </p>
       <div className="cb-reserve-benefits">
        <div> Custom drink menus &amp; group packages available</div>
        <div> Live music &amp; acoustic performance staging</div>
        <div> Barista demonstrations for your guests</div>
       </div>
      </div>

      <div className="cb-reserve-form-card">
       {!reserved ? (
        <form onSubmit={handleReserve} className="cb-reserve-form">
         <h3>Table Reservation</h3>
         <div className="form-group">
          <label>Your Name *</label>
          <input
           type="text"
           required
           placeholder="e.g. Suman Thapa"
           value={reserveInfo.name}
           onChange={(e) => setReserveInfo({ ...reserveInfo, name: e.target.value })}
          />
         </div>
         <div className="form-row">
          <div className="form-group">
           <label>Contact Phone *</label>
           <input
            type="tel"
            required
            placeholder="98XXXXXXXX"
            value={reserveInfo.phone}
            onChange={(e) => setReserveInfo({ ...reserveInfo, phone: e.target.value })}
           />
          </div>
          <div className="form-group">
           <label>Number of Guests</label>
           <select
            value={reserveInfo.guests}
            onChange={(e) => setReserveInfo({ ...reserveInfo, guests: e.target.value })}
           >
            <option value="1-2">1 - 2 People</option>
            <option value="3-4">3 - 4 People</option>
            <option value="5-8">5 - 8 People</option>
            <option value="10+">10+ Group Booking</option>
           </select>
          </div>
         </div>
         <div className="form-group">
          <label>Date &amp; Time</label>
          <input
           type="text"
           placeholder="e.g. Tomorrow 6:00 PM"
           value={reserveInfo.date}
           onChange={(e) => setReserveInfo({ ...reserveInfo, date: e.target.value })}
          />
         </div>
         <button type="submit" className="btn btn--primary btn--full">
          Reserve Table Now <span className="btn-arrow">→</span>
         </button>
        </form>
       ) : (
        <div className="cb-reserve-success">
         <div className="b-success-icon"></div>
         <h4>Table Request Submitted!</h4>
         <p>
          Thank you, <strong>{reserveInfo.name}</strong>! We will verify availability and confirm with you on WhatsApp.
         </p>
         <a
          href="https://wa.me/9779800000000?text=Hi%20Bravo%20Café,%20I%20would%20like%20to%20confirm%20my%20table%20reservation."
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary"
         >
          Chat on WhatsApp to Confirm
         </a>
        </div>
       )}
      </div>
     </div>
    </div>
   </section>
  </div>
 );
};

export default CafeBarPage;

