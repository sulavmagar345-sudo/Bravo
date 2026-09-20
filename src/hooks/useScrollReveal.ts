import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    // Small delay so DOM has time to paint
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      els.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);
}
