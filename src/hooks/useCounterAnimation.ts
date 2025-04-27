import { useEffect } from "react";

/**
 * Hook to animate counter elements
 */
const useCounterAnimation = () => {
  useEffect(() => {
    const counterElements = document.querySelectorAll(".counter");

    const animateCounter = () => {
      counterElements.forEach((counterElement) => {
        const target = parseInt(counterElement.getAttribute("data-target"));
        const startValue = parseInt(counterElement.textContent);
        const duration = 2000; // Animation duration in ms
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);

          // Apply easing function for smooth animation
          const easedProgress =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const currentValue = Math.round(
            startValue + easedProgress * (target - startValue)
          );
          counterElement.textContent = currentValue;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counterElement.textContent = target;
          }
        };

        requestAnimationFrame(updateCounter);
      });
    };

    // Create an Intersection Observer to trigger counter animation when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe the first counter element
    if (counterElements.length > 0) {
      observer.observe(
        counterElements[0].closest("section") || counterElements[0]
      );
    }

    return () => {
      observer.disconnect();
    };
  }, []);
};

export default useCounterAnimation;
