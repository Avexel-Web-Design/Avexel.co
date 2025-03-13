import React from 'react';
import { HashLink } from 'react-router-hash-link';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/10 to-primary-500/20 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <h1 className="space-y-4">
              <div className="flex flex-wrap gap-x-4 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                <span className="animate-slide-up" style={{ animationDelay: '0.2s' }}>We</span>
                <span className="animate-slide-up" style={{ animationDelay: '0.4s' }}>Create</span>
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                <span className="inline-block animate-slide-up bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent" style={{ animationDelay: '0.6s' }}>
                  Digital Magic
                </span>
              </div>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl animate-fade-in" style={{ animationDelay: '0.8s' }}>
              Transforming ideas into stunning digital experiences through creative web design and development.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '1s' }}>
              <HashLink 
                smooth 
                to="#work" 
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                View Our Work
              </HashLink>
              <HashLink 
                smooth 
                to="#about" 
                className="px-8 py-4 border-2 border-primary-500/50 text-primary-400 rounded-full font-semibold hover:bg-primary-500/10 hover:border-primary-400 transition-colors duration-300"
              >
                Learn More
              </HashLink>
            </div>
          </div>

          {/* Animated SVG */}
          <div className="relative lg:h-[600px] animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <svg viewBox="0 0 400 300" className="w-full h-full filter drop-shadow-lg">
              <defs>
                <linearGradient id="gradStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'var(--tw-color-primary-400)', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: 'var(--tw-color-secondary-400)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--tw-color-primary-400)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              {/* Main container */}
              <path 
                d="M40 20 H360 V280 H40 Z" 
                fill="none" 
                stroke="url(#gradStroke)" 
                strokeWidth="2"
                className="animate-[drawPath_2s_ease-out_forwards]" 
              />
              {/* Navigation bar wireframe */}
              <path 
                d="M40 20 H360 V60 H40 Z M280 30 H340 M200 30 H260 M120 30 H180" 
                fill="none" 
                stroke="url(#gradStroke)" 
                strokeWidth="2"
                className="animate-[drawPath_2s_ease-out_0.5s_forwards]" 
              />
              {/* Content blocks with animated drawing */}
              <path 
                d="M60 100 H200 M60 120 H180 M60 140 H160 M60 180 H140 V200 H60 Z M240 90 H340 V190 H240 Z" 
                fill="none" 
                stroke="url(#gradStroke)" 
                strokeWidth="2"
                className="animate-[drawPath_2s_ease-out_1s_forwards]" 
              />
              {/* Additional UI elements */}
              <path 
                d="M70 240 H120 M150 240 H200 M230 240 H280 M60 260 H340" 
                fill="none" 
                stroke="url(#gradStroke)" 
                strokeWidth="2"
                className="animate-[drawPath_2s_ease-out_1.5s_forwards]" 
              />
              <path 
                d="M260 140 H320 V160 H260 Z M280 220 H340 V240 H280 Z" 
                fill="none" 
                stroke="url(#gradStroke)" 
                strokeWidth="2"
                className="animate-[drawPath_2s_ease-out_2s_forwards]" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-dark via-dark/80 to-transparent"></div>
    </section>
  );
};

export default Hero;
