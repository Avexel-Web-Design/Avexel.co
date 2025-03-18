import React, { useRef, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import useScrollReveal from '../hooks/useScrollReveal';

const Hero = () => {
  const svgRef = useRef(null);
  useScrollReveal(); // Add this to initialize the reveal animations

  // Combined floating animation with drawing effect
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll('path');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Apply floating animation to each path with different timings
    paths.forEach((path, index) => {
      const delayClass = path.classList.contains('delay-1') ? 1 : 
                         path.classList.contains('delay-2') ? 2 :
                         path.classList.contains('delay-3') ? 3 : 0;
      
      if (prefersReducedMotion) {
        // Just show the paths immediately for users who prefer reduced motion
        path.style.strokeDashoffset = "0";
      } else {
        // Start floating after drawing completes
        path.style.animation = `draw 2s ease forwards, floatElement ${3 + index * 0.2}s ease-in-out infinite alternate`;
        path.style.animationDelay = `${delayClass * 0.3}s, ${delayClass * 0.3 + 2}s`;
      }
    });
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden pt-28 sm:pt-32 md:pt-28 pb-8 sm:pb-12" aria-label="Hero section">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/3 to-primary-500/5 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.08),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 mt-6 sm:mt-0">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-8 items-center">
          {/* Hero Text - improved mobile-first approach */}
          <div className="max-w-md sm:max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 tracking-tight opacity-100 leading-tight">
              <span className="block">Websites that</span>
              <span className="block bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Make a Difference
              </span>
            </h1>
            
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-md sm:max-w-2xl mx-auto lg:mx-0 opacity-100">
              Student developers creating modern web solutions while powering the next generation of STEM innovation through FRC Team 7790.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center lg:justify-start gap-3 sm:gap-4 opacity-100">
              <HashLink 
                smooth 
                to="#contact" 
                className="w-full sm:w-auto px-5 xs:px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Start Your Project
              </HashLink>
              
              <HashLink 
                smooth 
                to="#work" 
                className="w-full sm:w-auto px-5 xs:px-6 sm:px-8 py-3 sm:py-4 bg-white/5 rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300 mt-3 sm:mt-0"
              >
                View Our Work
              </HashLink>
            </div>
          </div>

          {/* SVG Wireframe - better mobile display with proper sizing */}
          <div className="flex justify-center items-center mt-0 md:-mt-4 lg:mt-0">
            <div className="w-[85%] xs:w-[80%] sm:w-[70%] md:w-[75%] lg:w-[115%] max-w-md lg:max-w-none mx-auto">
              <svg ref={svgRef} viewBox="0 0 400 300" className="w-full h-auto" aria-hidden="true">
                <defs>
                  <linearGradient id="gradStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#a78bfa', stopOpacity: 0.8 }} />
                    <stop offset="50%" style={{ stopColor: '#60a5fa', stopOpacity: 0.9 }} />
                    <stop offset="100%" style={{ stopColor: '#818cf8', stopOpacity: 0.8 }} />
                  </linearGradient>
                </defs>
                
                {/* Main container */}
                <path 
                  d="M40 20 H360 V280 H40 Z" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  strokeDasharray="1400" 
                  strokeDashoffset="1400"
                  className="draw-path"
                />
                
                {/* Navigation bar wireframe */}
                <path 
                  d="M40 20 H360 V60 H40 Z M280 30 H340 M200 30 H260 M120 30 H180" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="1.5"
                  strokeDasharray="1000" 
                  strokeDashoffset="1000"
                  className="draw-path delay-1"
                />
                
                {/* Content blocks */}
                <path 
                  d="M60 100 H200 M60 120 H180 M60 140 H160" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="1.5"
                  strokeDasharray="600" 
                  strokeDashoffset="600"
                  className="draw-path delay-2"
                />
                
                {/* Image placeholder with simplified design */}
                <path 
                  d="M240 90 H340 V190 H240 Z" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="1.5"
                  strokeDasharray="800" 
                  strokeDashoffset="800"
                  className="draw-path delay-2"
                />
                
                {/* Footer elements */}
                <path 
                  d="M60 240 H340 M60 260 H340" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="1.5"
                  strokeDasharray="600" 
                  strokeDashoffset="600"
                  className="draw-path delay-3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-friendly scroll indicator with better positioning */}
      <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 left-0 w-full flex justify-center animate-bounce-slow" aria-hidden="true">
        <HashLink smooth to="#work" aria-label="Scroll down" className="text-white/50 hover:text-white/80 transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </HashLink>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-16 sm:h-20 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      
      {/* Animation keyframes */}
      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes floatElement {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(2px, -2px);
          }
        }
        
        .draw-path {
          animation: draw 2s forwards;
          will-change: stroke-dashoffset;
          filter: drop-shadow(0 0 3px rgba(139, 92, 246, 0.4));
        }
        
        .delay-1 {
          animation-delay: 0.5s;
        }
        
        .delay-2 {
          animation-delay: 1s;
        }
        
        .delay-3 {
          animation-delay: 1.5s;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1s forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Ensure reveal elements are visible */
        .reveal, .stagger-reveal {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </section>
  );
};

export default Hero;
