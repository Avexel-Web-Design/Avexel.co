import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden pt-36 pb-20 bg-black">
      {/* Decorative Elements */}
      <div className="absolute top-32 left-12 w-64 h-64 bg-gradient-radial from-primary-500/10 to-transparent opacity-60 blur-2xl"></div>
      <div className="absolute bottom-20 right-12 w-64 h-64 bg-gradient-radial from-secondary-500/10 to-transparent opacity-60 blur-2xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Main Text Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-6">
              <h4 className={`inline-block text-md md:text-lg uppercase tracking-widest text-primary-400 font-light border-b border-primary-500/30 pb-2 transition-all duration-700 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ 
                  transitionDelay: '100ms',
                  willChange: 'transform, opacity'
                }}
              >
                Avexel Digital
              </h4>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <div className="overflow-hidden">
                  <span 
                    className={`inline-block transition-all duration-700 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                    style={{ 
                      transitionDelay: '300ms',
                      willChange: 'transform, opacity'
                    }}
                  >
                    We Create
                  </span>
                </div>
                
                <div className="overflow-hidden mt-2">
                  <span 
                    className={`inline-block bg-gradient-to-r from-secondary-400 via-primary-400 to-secondary-400 bg-clip-text text-transparent transition-all duration-700 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} color-shift-text`}
                    style={{ 
                      backgroundSize: '200% auto',
                      transitionDelay: '500ms',
                      willChange: 'transform, opacity'
                    }}
                  >
                    Digital Experiences
                  </span>
                </div>
              </h1>
            </div>
            
            <p 
              className={`text-xl md:text-2xl text-gray-300 max-w-xl transition-all duration-700 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ 
                transitionDelay: '700ms',
                willChange: 'transform, opacity'
              }}
            >
              Our team brings stories to life through thoughtful design and development, creating seamless digital journeys that captivate and convert.
            </p>
            
            <div className={`flex flex-wrap gap-6 transition-all duration-700 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ 
                transitionDelay: '900ms',
                willChange: 'transform, opacity'
              }}
            >
              <HashLink 
                smooth 
                to="#work" 
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full text-white font-semibold overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                <span className="relative">See Our Work</span>
                <svg className="w-5 h-5 relative transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
                  <path d="M13 5L20 12M20 12L13 19M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </HashLink>
              
              <HashLink 
                smooth 
                to="#about" 
                className="group relative inline-flex items-center gap-2 px-8 py-4 border border-secondary-500 text-secondary-400 rounded-full font-semibold overflow-hidden"
              >
                <span className="absolute inset-0 bg-secondary-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                <span className="relative">Meet The Team</span>
                <svg className="w-5 h-5 relative transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
                  <path d="M17 8L21 12M21 12L17 16M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </HashLink>
            </div>
          </div>
          
          {/* Creative Visual Element */}
          <div className="lg:w-1/2 relative">
            <div className={`w-full h-[500px] relative transition-all duration-1000 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-12 opacity-0 rotate-6'}`}
              style={{ 
                transitionDelay: '600ms',
                willChange: 'transform, opacity'
              }}
            >
              {/* Abstract creative elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80">
                <div className="absolute inset-0 border-2 border-primary-500/20 rounded-full transform animate-spin-slow"></div>
                <div className="absolute inset-4 border-2 border-secondary-500/20 rounded-full transform animate-spin-slow-reverse"></div>
                <div className="absolute inset-8 border-2 border-white/10 rounded-full transform animate-pulse-slow"></div>
                
                {/* Hero image/avatar */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full overflow-hidden border-2 border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 mix-blend-overlay"></div>
                  <img 
                    src="/src/assets/images/Logo-nobg-sm.png" 
                    alt="Avexel" 
                    className="w-full h-full object-cover animate-float-up-down"
                  />
                </div>
                
                {/* Team badges */}
                <div className="absolute top-0 left-1/4 transform -translate-x-1/2 bg-dark/80 backdrop-blur-sm p-3 rounded-lg border border-white/10 font-mono text-xs text-primary-400 animate-float-left-right">
                  Design
                </div>
                <div className="absolute bottom-8 right-0 transform translate-x-1/2 bg-dark/80 backdrop-blur-sm p-3 rounded-lg border border-white/10 font-mono text-xs text-secondary-400 animate-float-up-down" style={{animationDelay: '1s'}}>
                  Development
                </div>
                <div className="absolute bottom-0 left-8 transform translate-y-1/2 bg-dark/80 backdrop-blur-sm p-3 rounded-lg border border-white/10 font-mono text-xs text-primary-400 animate-float-left-right" style={{animationDelay: '1.5s'}}>
                  Innovation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden">
        <svg viewBox="0 0 1200 120" className="absolute bottom-0 w-full h-24" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.92,130.83,141.49,195.07,153.86Z" className="fill-black/90"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
