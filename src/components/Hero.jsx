import React, { useRef, useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';

const Hero = () => {
  const svgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Mouse move effect for interactive SVG with improved responsiveness
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll('path');
    
    const handleMouseMove = (e) => {
      const { left, top, width, height } = svg.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      paths.forEach((path, index) => {
        // Enhanced movements for better visual effect
        const translateX = (x - 0.5) * (6 + index * 1.5);
        const translateY = (y - 0.5) * (6 + index * 1.5);
        path.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };

    svg.addEventListener('mousemove', handleMouseMove);
    return () => svg.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/3 to-primary-500/5 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.08),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Hero Text */}
          <div className="md:w-full lg:pr-12 mt-8 md:mt-0">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6">
              <span className="inline-block animate-slide-up" style={{ animationDelay: '0s' }}>We</span>{' '}
              <span className="inline-block animate-slide-up" style={{ animationDelay: '0.5s' }}>Create</span>
            </h1>
            
            {/* "Digital Magic" text with gradient but no glow */}
            <div className={`relative mb-8 md:mb-10 transform ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
              <div className="flex flex-col md:flex-row items-start md:items-center">
                <span className="text-6xl md:text-8xl lg:text-9xl font-bold animate-slide-up leading-none pb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500" 
                  style={{ animationDelay: '1.25s' }}>
                  Digital
                </span>
                
                <span className="text-6xl md:text-8xl lg:text-9xl font-bold animate-slide-up leading-none ml-1 pb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500" 
                  style={{ animationDelay: '1.5s' }}>
                  Magic
                </span>
              </div>
            </div>

            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 md:mb-10 max-w-2xl animate-fade-in" style={{ animationDelay: '1.75s' }}>
              Transforming ideas into stunning digital experiences through creative web design and development.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8 md:mb-0">
              <HashLink 
                smooth 
                to="#work" 
                className="inline-block px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold hover:scale-105 transition-transform animate-fade-in" 
                style={{ animationDelay: '2s' }}
              >
                View Our Work
              </HashLink>
              <HashLink 
                smooth 
                to="#about" 
                className="inline-block px-6 py-3 md:px-8 md:py-4 border border-purple-500 text-purple-500 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-colors animate-fade-in" 
                style={{ animationDelay: '2.25s' }}
              >
                Learn More
              </HashLink>
            </div>
          </div>

          {/* Improved Animated SVG Wireframe */}
          <div className="md:w-full flex justify-center items-center lg:justify-end relative">
            <div className="w-[110%] md:w-[115%] lg:w-[130%] xl:w-[125%] transform -translate-y-4 md:translate-y-0">
              <svg ref={svgRef} viewBox="0 0 400 300" className="w-full h-auto">
                <defs>
                  <linearGradient id="gradStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#a78bfa', stopOpacity: 0.8 }} />
                    <stop offset="50%" style={{ stopColor: '#60a5fa', stopOpacity: 0.9 }} />
                    <stop offset="100%" style={{ stopColor: '#818cf8', stopOpacity: 0.8 }} />
                  </linearGradient>
                  <filter id="svgSoftGlow" height="130%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                    <feComposite in="blur" in2="SourceGraphic" operator="over" />
                  </filter>
                </defs>
                
                {/* Decorative background elements */}
                <g opacity="0.1" filter="url(#svgSoftGlow)">
                  <circle cx="100" cy="150" r="50" fill="url(#gradStroke)" />
                  <circle cx="300" cy="100" r="40" fill="url(#gradStroke)" />
                  <circle cx="200" cy="250" r="35" fill="url(#gradStroke)" />
                </g>
                
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
                  strokeWidth="2"
                  strokeDasharray="1000" 
                  strokeDashoffset="1000"
                  className="draw-path delay-1"
                />
                
                {/* Content blocks with improved details */}
                <path 
                  d="M60 100 H200 M60 120 H180 M60 140 H160 M60 180 H140 V200 H60 Z M240 90 H340 V190 H240 Z" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  strokeDasharray="1200" 
                  strokeDashoffset="1200"
                  className="draw-path delay-2"
                />
                
                {/* Image placeholder in the right block */}
                <path 
                  d="M260 110 H320 V170 H260 Z" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="1.5"
                  strokeDasharray="400" 
                  strokeDashoffset="400"
                  className="draw-path delay-2"
                />
                
                {/* Cross pattern in image placeholder */}
                <path 
                  d="M260 110 L320 170 M260 170 L320 110" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="1"
                  strokeDasharray="200" 
                  strokeDashoffset="200"
                  className="draw-path delay-3"
                />
                
                {/* Decorative elements */}
                <path 
                  d="M70 240 H120 M150 240 H200 M230 240 H280 M60 260 H340" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  strokeDasharray="800" 
                  strokeDashoffset="800"
                  className="draw-path delay-3"
                />
                
                {/* Button/interactive elements */}
                <path 
                  d="M260 140 H320 V160 H260 Z M280 220 H340 V240 H280 Z" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  strokeDasharray="400" 
                  strokeDashoffset="400"
                  className="draw-path delay-4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};

export default Hero;
