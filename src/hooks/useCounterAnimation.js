import { useEffect } from 'react';

const useCounterAnimation = () => {
  useEffect(() => {
    const counters = document.querySelectorAll('.counter');

    const runCounter = (counter) => {
      const target = +counter.dataset.target;
      let updateCount;

      // If target is less than 50, let's animate downward from 100.
      if (target < 50) {
        let count = 100;
        const decrement = (100 - target) / 100;

        updateCount = () => {
          if (count > target) {
            count -= decrement;
            counter.innerText = Math.floor(count);
            setTimeout(updateCount, 10);
          } else {
            counter.innerText = target;
          }
        };
      } else { // Regular count up for other counters
        let count = 0;
        const increment = target / 100;

        updateCount = () => {
          if (count < target) {
            count += increment;
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, 10);
          } else {
            counter.innerText = target;
          }
        };
      }

      updateCount();
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
        }
      });
    };

    const observerOptions = { threshold: 0.5 };
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
