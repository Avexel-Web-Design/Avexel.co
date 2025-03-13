import { useEffect } from 'react';

const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

const useCounterAnimation = () => {
  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(animationDuration / frameDuration);

    const animateCounter = (counter, endValue) => {
      let frame = 0;
      
      const startValue = parseInt(counter.innerText, 10) || 0;
      const countTo = parseInt(endValue, 10);
      const range = countTo - startValue;
      
      const animate = () => {
        frame++;
        const progress = easeOutExpo(frame / totalFrames);
        const currentValue = Math.round(startValue + (range * progress));
        
        if (countTo > startValue) {
          counter.textContent = Math.min(currentValue, countTo);
        } else {
          counter.textContent = Math.max(currentValue, countTo);
        }

        if (frame < totalFrames) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = counter.dataset.target;
          
          animateCounter(counter, target);
          observer.unobserve(counter);
        }
      });
    };

    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    counters.forEach(counter => observer.observe(counter));

    return () => {
      if (observer) {
        counters.forEach(counter => observer.unobserve(counter));
      }
    };
  }, []);
};

export default useCounterAnimation;
