import { useEffect } from 'react';

const useScrollReveal = () => {
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const delay = target.dataset.revealDelay || '0';
          const direction = target.dataset.revealDirection || 'up';
          
          // Add reveal direction class
          const directionClass = {
            up: 'reveal-up',
            down: 'reveal-down',
            left: 'reveal-left',
            right: 'reveal-right',
            scale: 'reveal-scale',
          }[direction];

          // Add base reveal class and direction-specific class
          requestAnimationFrame(() => {
            target.classList.add('revealing', directionClass);
            target.style.transitionDelay = `${delay}ms`;
            
            // Force a reflow to ensure the animation triggers
            target.offsetHeight;
            
            // Add active class after a frame to ensure transition happens
            requestAnimationFrame(() => {
              target.classList.add('active');
            });
          });

          observer.unobserve(target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    return () => {
      reveals.forEach(el => observer.unobserve(el));
    };
  }, []);
};

export default useScrollReveal;
