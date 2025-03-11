import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const Portfolio = () => {
  useScrollReveal();
  
  return (
    <section id="work" className="py-20 bg-black scroll-mt-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent reveal">Our Portfolio</h2>
        
        {/* Baywatch Robotics Website */}
        <div className="max-w-5xl mx-auto mb-20 reveal">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Baywatch Robotics
                </h3>
                <p className="text-xl text-gray-300 leading-relaxed">
                  We encountered challenges with integrating modern design with advanced robotics technology. Our solution included a complete redesign, improved UX/UI and robust backend integration. The result was increased performance and client satisfaction.
                </p>
                <a href="https://FRC7790.com" 
                   className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-semibold hover:scale-105 transition-all">
                  Explore Project
                  <svg xmlns="https://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 group-hover:opacity-75 transition-opacity rounded-xl"></div>
                <img src="/src/assets/images/baywatchLogo.png" alt="Baywatch Robotics" className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-500"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
