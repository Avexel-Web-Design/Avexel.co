import React from 'react';
import { HashLink } from 'react-router-hash-link';

const Hero = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 animate-pulse" style={{ animationDuration: '5s' }}></div>
      <div className="container mx-auto px-6 pt-32 relative z-10 flex flex-col md:flex-row items-center justify-between">
        {/* Hero Text */}
        <div className="md:w-1/2">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            <span className="inline-block animate__animated animate__fadeInUp" style={{ animationDelay: '0s' }}>We</span>
            <span className="inline-block animate__animated animate__fadeInUp" style={{ animationDelay: '0.5s' }}>Create</span>
            <br />
            <span>
              <span className="inline-block mr-4 animate__animated animate__fadeInUp bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-normal pb-1" style={{ animationDelay: '1.25s' }}>
                Digital
              </span>
              <span className="inline-block animate__animated animate__fadeInUp bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-normal pb-1" style={{ animationDelay: '1.5s' }}>
                Magic
              </span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl animate__animated animate__fadeIn" style={{ animationDelay: '1.75s' }}>
            Transforming ideas into stunning digital experiences through creative web design and development.
          </p>
          <div className="flex flex-wrap gap-4">
            <HashLink 
              smooth 
              to="#work" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-semibold hover:scale-105 transition-transform animate__animated animate__fadeInUp" 
              style={{ animationDelay: '2s' }}
            >
              View Our Work
            </HashLink>
            <HashLink 
              smooth 
              to="#about" 
              className="inline-block px-8 py-4 border border-purple-500 text-purple-500 rounded-full font-semibold hover:bg-purple-500 hover:text-white transition-colors animate__animated animate__fadeInUp" 
              style={{ animationDelay: '2.25s' }}
            >
              Learn More
            </HashLink>
          </div>
        </div>
        
        {/* Animated SVG Wireframe */}
        <div className="md:w-1/2 flex justify-center p-4">
          <svg viewBox="0 0 400 300" className="w-full h-auto">
            <defs>
              <linearGradient id="gradStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            {/* Main container */}
            <path d="M40 20 H360 V280 H40 Z" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  strokeDasharray="1400" 
                  strokeDashoffset="1400"
                  className="draw-path" />
            {/* Navigation bar wireframe */}
            <path d="M40 20 H360 V60 H40 Z M280 30 H340 M200 30 H260 M120 30 H180" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  strokeDasharray="1000" 
                  strokeDashoffset="1000"
                  className="draw-path delay-1" />
            {/* Content blocks */}
            <path d="M60 100 H200 M60 120 H180 M60 140 H160 M60 180 H140 V200 H60 Z M240 90 H340 V190 H240 Z" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  strokeDasharray="1200" 
                  strokeDashoffset="1200"
                  className="draw-path delay-2" />
            {/* Decorative elements */}
            <path d="M70 240 H120 M150 240 H200 M230 240 H280 M60 260 H340" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  strokeDasharray="800" 
                  strokeDashoffset="800"
                  className="draw-path delay-3" />
            {/* Button/interactive elements */}
            <path d="M260 140 H320 V160 H260 Z M280 220 H340 V240 H280 Z" 
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  strokeDasharray="400" 
                  strokeDashoffset="400"
                  className="draw-path delay-4" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};

export default Hero;
