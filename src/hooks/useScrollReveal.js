import { useEffect } from 'react';

const useScrollReveal = () => {
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll('.reveal');

      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', reveal);
    reveal(); // Initial check

    return () => window.removeEventListener('scroll', reveal);
  }, []);
};

export default useScrollReveal;
