import React, { useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';

const Hero = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = svg.querySelectorAll('path');
    
    const handleMouseMove = (e) => {
      const { left, top, width, height } = svg.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      paths.forEach((path, index) => {
        const translateX = (x - 0.5) * (10 + index * 2);
        const translateY = (y - 0.5) * (10 + index * 2);
        path.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };

    svg.addEventListener('mousemove', handleMouseMove);
    return () => svg.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
      {/* Subtle background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/3 to-primary-500/5 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.05),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center">
          <div className="space-y-8">
            <h1 className="space-y-4">
              <div className="flex flex-wrap gap-x-4 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                <span className="animate-slide-up inline-block" style={{ animationDelay: '0.2s' }}>We</span>
                <span className="animate-slide-up inline-block" style={{ animationDelay: '0.4s' }}>Create</span>
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                <span className="inline-block animate-slide-up bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_100%] animate-flowing-gradient" style={{ animationDelay: '0.6s' }}>
                  Digital Magic
                </span>
              </div>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl animate-fade-in" style={{ animationDelay: '0.8s' }}>
              Transforming ideas into stunning digital experiences through creative web design and development.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '1s' }}>
              <HashLink 
                smooth 
                to="#work" 
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold overflow-hidden shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="relative z-10">View Our Work</span>
                <span className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform relative z-10"></i>
              </HashLink>
              <HashLink 
                smooth 
                to="#about" 
                className="group px-8 py-4 border-2 border-primary-500/30 text-primary-400 rounded-full font-semibold hover:bg-primary-500/10 hover:border-primary-400 transition-colors duration-300"
              >
                Learn More
                <i className="fas fa-chevron-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
              </HashLink>
            </div>
          </div>

          <div className="relative lg:h-[600px] animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <svg ref={svgRef} viewBox="0 0 400 300" className="w-full h-full filter drop-shadow-lg">
              <defs>
                <linearGradient id="gradStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: 'var(--tw-color-primary-400)', stopOpacity: 1 }}>
                    <animate 
                      attributeName="offset" 
                      values="0;1;0"
                      dur="5s" 
                      repeatCount="indefinite" 
                    />
                  </stop>
                  <stop offset="50%" style={{ stopColor: 'var(--tw-color-secondary-400)', stopOpacity: 1 }}>
                    <animate 
                      attributeName="offset" 
                      values="0.5;1.5;0.5"
                      dur="5s" 
                      repeatCount="indefinite" 
                    />
                  </stop>
                  <stop offset="100%" style={{ stopColor: 'var(--tw-color-primary-400)', stopOpacity: 1 }}>
                    <animate 
                      attributeName="offset" 
                      values="1;2;1"
                      dur="5s" 
                      repeatCount="indefinite" 
                    />
                  </stop>
                </linearGradient>
                
                {/* Add glow effect */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Grid background */}
              <path 
                d="M20 20 h360 v260 h-360 Z" 
                fill="none" 
                stroke="url(#gradStroke)" 
                strokeWidth="0.5"
                strokeDasharray="4 4"
                className="animate-[drawPath_3s_ease-out_forwards]"
                filter="url(#glow)"
              >
                <animate
                  attributeName="strokeDashoffset"
                  from="1000"
                  to="0"
                  dur="20s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Dynamic wireframe elements */}
              <g filter="url(#glow)">
                {/* Header section */}
                <path 
                  d="M40 40 H360 M40 60 H200 M220 60 H300"
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  className="animate-[drawPath_2s_ease-out_0.5s_forwards]"
                >
                  <animate
                    attributeName="d"
                    dur="8s"
                    repeatCount="indefinite"
                    values="
                      M40 40 H360 M40 60 H200 M220 60 H300;
                      M40 45 H360 M40 65 H180 M220 65 H280;
                      M40 40 H360 M40 60 H200 M220 60 H300
                    "
                  />
                </path>

                {/* Content blocks */}
                <path 
                  d="M60 100 L160 100 L160 180 L60 180 Z"
                  fill="none" 
                  stroke="url(#gradStroke)" 
                  strokeWidth="2"
                  className="animate-[drawPath_2s_ease-out_1s_forwards]"
                >
                  <animate
                    attributeName="d"
                    dur="6s"
                    repeatCount="indefinite"
                    values="
                      M60 100 L160 100 L160 180 L60 180 Z;
                      M70 110 L170 110 L170 190 L70 190 Z;
                      M60 100 L160 100 L160 180 L60 180 Z
                    "
                  />
                </path>

                {/* Interactive elements */}
                <g className="animate-[drawPath_2s_ease-out_1.5s_forwards]">
                  <circle cx="200" cy="140" r="20" fill="none" stroke="url(#gradStroke)" strokeWidth="2">
                    <animate
                      attributeName="r"
                      values="20;22;20"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="260" cy="140" r="15" fill="none" stroke="url(#gradStroke)" strokeWidth="2">
                    <animate
                      attributeName="r"
                      values="15;17;15"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-dark to-transparent"></div>
    </section>
  );
};

export default Hero;
