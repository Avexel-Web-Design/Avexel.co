import React, { useEffect } from 'react';
import '../js/particles.js'; // Import the advanced particle system

const ParticleBackground = () => {
  useEffect(() => {
    // The initialization of the particle system is handled in the imported particles.js file
    // with its document.addEventListener('DOMContentLoaded') hook
  }, []);

  return (
    <canvas 
      id="particle-background"
      className="fixed top-0 left-0 w-full h-full z-0"
    />
  );
};

export default ParticleBackground;
