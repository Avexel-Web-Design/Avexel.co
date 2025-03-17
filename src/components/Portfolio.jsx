import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const Portfolio = () => {
  useScrollReveal();
  
  return (
    <section id="work" className="py-24 bg-dark scroll-mt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Portfolio
          </h2>
          <p className="text-lg text-gray-400">
            Showcasing our latest projects and digital innovations
          </p>
        </div>
        
        {/* Portfolio Items */}
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Baywatch Robotics Website */}
          <div className="group relative reveal">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-dark backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-8 lg:p-12">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                    Baywatch Robotics
                  </h3>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    We encountered challenges with integrating modern design with advanced robotics technology. Our solution included a complete redesign, improved UX/UI and robust backend integration. The result was increased performance and client satisfaction.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <a 
                      href="https://FRC7790.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Visit Website
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M14 5l7 7m0 0l-7 7m7-7H3" 
                        />
                      </svg>
                    </a>
                    <a 
                      href="#"
                      className="inline-flex items-center px-6 py-3 border-2 border-primary-500/50 text-primary-400 rounded-full font-semibold hover:bg-primary-500/10 hover:border-primary-400 transition-colors duration-300"
                    >
                      Case Study
                    </a>
                  </div>
                </div>
                <div className="relative aspect-video md:aspect-auto overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 group-hover:opacity-75 transition-opacity duration-500 z-10"></div>
                  <img 
                    src="/src/assets/images/baywatchLogo.png" 
                    alt="Baywatch Robotics Website Preview" 
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Add more portfolio items here with the same structure */}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
