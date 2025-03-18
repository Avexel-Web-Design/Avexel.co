import React, { useRef, useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';

const Hero = () => {
  const svgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const fullText = "Digital\nMagic";  // Added line break

  // Handle visibility animation
  useEffect(() => {
    // Add a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (!isVisible) return;
    
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Set typing complete to true once animation is done
        setTypingComplete(true);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, [isVisible]);

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" aria-label="Hero section">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/3 to-primary-500/5 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.08),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight reveal stagger-reveal">
            <span className="block">Websites that</span>
            <span className="block bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Make a Difference
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto reveal stagger-reveal">
            Student developers creating modern web solutions while powering the next generation of STEM innovation through FRC Team 7790.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal stagger-reveal">
            <a 
              href="#contact" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Start Your Project
            </a>
            
            <a 
              href="#portfolio" 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              View Our Work
            </a>
          </div>
          
          <div className="mt-16 reveal">
            <p className="text-gray-400 mb-6">Trusted by local businesses</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Add your client logos here */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Hero Text */}
          <div className="md:w-full lg:pr-12 mt-8 md:mt-0">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6">
              <span className="inline-block animate-slide-up" style={{ animationDelay: '0s' }}>We</span>{' '}
              <span className="inline-block animate-slide-up" style={{ animationDelay: '0.3s' }}>Create</span>
            </h1>
            
            {/* "Digital Magic" text with typing animation - now on two lines */}
            <div className={`relative mb-8 md:mb-10 transform ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
              <div className="flex flex-col items-start">
                <span className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none pb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 typing-container whitespace-pre-line">
                  {typedText}
                  {!typingComplete && <span className="typing-cursor">|</span>}
                </span>
              </div>
            </div>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 md:mb-10 max-w-2xl animate-fade-in" style={{ animationDelay: '1.5s' }}>
              High school robotics enthusiasts making websites that matter. Supporting Team 7790 while helping businesses build their online presence.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8 md:mb-0">
              <HashLink 
                smooth 
                to="#work" 
                className="inline-block px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 animate-fade-in" 
                style={{ animationDelay: '1.8s' }}
                aria-label="View our portfolio work"
              >
                See Our Work
              </HashLink>
              
              <HashLink 
                smooth 
                to="#about" 
                className="inline-block px-6 py-3 md:px-8 md:py-4 border border-purple-500 text-purple-500 rounded-full font-semibold hover:bg-purple-500/10 hover:text-white transition-colors duration-300 animate-fade-in" 
                style={{ animationDelay: '2s' }}
                aria-label="Learn more about us"
              >
                Our Team
              </HashLink>
            </div>
          </div>

          {/* Simplified SVG Wireframe */}
          <div className="md:w-full flex justify-center items-center lg:justify-end relative">
            <div className="w-[110%] md:w-[115%] lg:w-[130%] xl:w-[125%] transform -translate-y-4 md:translate-y-0">
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center animate-bounce-slow" aria-hidden="true">
        <HashLink smooth to="#work" aria-label="Scroll down" className="text-white/50 hover:text-white/80 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </HashLink>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      
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
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .typing-container {
          display: inline-block;
          white-space: pre-line;
          overflow: visible;
          position: relative;
        }

        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 8px rgba(139, 92, 246, 0.4); }
          50% { text-shadow: 0 0 16px rgba(139, 92, 246, 0.7); }
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
        
        .typing-cursor {
          display: inline-block;
          animation: blink 1s step-end infinite;
          color: #9333ea;
          font-weight: 400;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1s forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
