import { useEffect } from "react";

/**
 * Hook to add scroll reveal animations to elements with the 'reveal' class
 */
const useScrollReveal = () => {
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      revealElements.forEach((element) => {
        const revealTop = element.getBoundingClientRect().top;

        if (revealTop < windowHeight - revealPoint) {
          element.classList.add("active");
        } else {
          // Uncomment the line below if you want elements to hide again when scrolled away
          // element.classList.remove('active');
        }
      });
    };

    // Run once on mount to reveal elements already in view
    revealOnScroll();

    window.addEventListener("scroll", revealOnScroll);

    return () => {
      window.removeEventListener("scroll", revealOnScroll);
    };
  }, []);
};

export default useScrollReveal;
