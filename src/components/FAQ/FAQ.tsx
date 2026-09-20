import React, { useState } from 'react';
import './FAQ.css';

interface FAQItem {
 question: string;
 answer: string;
 category: 'barista' | 'certification' | 'general' | 'cafe';
}

const FAQS: FAQItem[] = [
 {
  category: 'barista',
  question: 'Do I need any prior coffee or hospitality experience to enroll?',
  answer:
   'No prior experience is necessary! Our courses start from core fundamentals — including coffee bean origins, milk science, and grinder adjustment — before moving into advanced espresso extraction, latte art patterns, and high-speed bar operations.',
 },
 {
  category: 'barista',
  question: 'How long do the courses take, and what are the class timings?',
  answer:
   'We run intensive 2-week, 4-week, and comprehensive 6-week programs. Classes are held in convenient morning, afternoon, and weekend slots so you can study alongside work or college commitments.',
 },
 {
  category: 'certification',
  question: 'Is the Bravo Barista Certificate recognized internationally?',
  answer:
   'Yes. Our certificates are industry-valued and document verified hours of commercial machine operation. Bravo alumni are actively employed in specialty coffee shops and luxury hotel properties across the UAE, Qatar, Australia, Canada, and Europe.',
 },
 {
  category: 'barista',
  question: 'What kind of machines and grinders will I practice on?',
  answer:
   'You will train on commercial multi-group espresso machines (including FAEMA machines), professional on-demand flat and conical burr grinders, precision milk steaming wands, and standard café POS and bar equipment.',
 },
 {
  category: 'certification',
  question: 'Do you provide job placement support after graduation?',
  answer:
   'Yes! We partner with leading cafés, restaurants, and resorts across Nepal to help place graduates. For students planning to work or study abroad, we provide trade test training and reference letters.',
 },
 {
  category: 'cafe',
  question: 'Can I visit Bravo Café & Bar to see the setup before joining?',
  answer:
   'Absolutely! We warmly welcome prospective students to drop by our café in person. You can enjoy a coffee, tour the training stations, talk to current students, and meet our head trainers.',
 },
 {
  category: 'general',
  question: 'When will the Professional Chef & Culinary Arts course launch?',
  answer:
   'Our commercial culinary kitchen is currently undergoing final commissioning. Pre-registration is open, and priority waitlist applicants will receive early bird discounts and first choice of batch schedules.',
 },
];

const FAQ: React.FC = () => {
 const [openIdx, setOpenIdx] = useState<number | null>(0);

 const toggle = (idx: number) => {
  setOpenIdx(openIdx === idx ? null : idx);
 };

 return (
  <section id="faq" className="faq section section--white" aria-labelledby="faq-heading">
   <div className="container">
    <div className="section-header text-center reveal">
     <span className="eyebrow">Got Questions?</span>
     <h2 id="faq-heading">
      Frequently Asked <em className="faq__highlight">Questions</em>
     </h2>
     <div className="divider divider--center" />
     <p className="faq__sub">
      Everything you need to know about our courses, certifications, schedules, and career guidance.
     </p>
    </div>

    <div className="faq__accordion-wrap reveal reveal-delay-2">
     {FAQS.map((item, idx) => {
      const isOpen = openIdx === idx;
      return (
       <div
        key={idx}
        className={`faq__item ${isOpen ? 'is-open' : ''}`}
       >
        <button
         className="faq__question"
         onClick={() => toggle(idx)}
         aria-expanded={isOpen}
        >
         <span className="faq__q-text">{item.question}</span>
         <span className="faq__icon">{isOpen ? '−' : '+'}</span>
        </button>
        {isOpen && (
         <div className="faq__answer">
          <p>{item.answer}</p>
         </div>
        )}
       </div>
      );
     })}
    </div>

    <div className="faq__footer-help text-center reveal">
     <p>Still have questions? We are always happy to chat.</p>
     <a
      href="https://wa.me/9779802004823?text=Hi%20Bravo,%20I%20have%20a%20question%20about%20your%20training%20courses"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn--outline-dark"
     >
       Chat with Our Counselor on WhatsApp
     </a>
    </div>
   </div>
  </section>
 );
};

export default FAQ;
