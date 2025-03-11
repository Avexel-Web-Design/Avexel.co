import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const ServiceCard = ({ icon, title, description, comingSoon = false }) => {
  return (
    <div className="relative group overflow-hidden rounded-lg transition-transform duration-500 hover:scale-105">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-75 transition-opacity rounded-lg"></div>
      <div className="flex gap-6 bg-gray-800 p-6 rounded-lg relative">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 glass-icon flex items-center justify-center">
            <i className={`fas ${icon} text-3xl`}></i>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-2xl font-bold">{title}</h3>
            {comingSoon && <span className="inline-block bg-gray-700 text-xs text-white px-2 py-1 rounded">COMING SOON</span>}
          </div>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  useScrollReveal();
  
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-900 to-black scroll-mt-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center reveal">Our Services & Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 reveal">
          {/* Service Card 1 */}
          <ServiceCard 
            icon="fa-laptop-code"
            title="Web Design & Development"
            description="Creating visually stunning and highly functional websites, from conceptualization to launch. We work directly with our business clients to ensure perfect alignment with their brand and goals."
          />
          
          {/* Service Card 2 */}
          <ServiceCard 
            icon="fa-mobile-alt"
            title="Mobile App Development"
            description="Developing intuitive, high-performance mobile applications tailored to your business needs. Engage your customers on the go with seamless and responsive apps."
            comingSoon={true}
          />
          
          {/* Process Description Card */}
          <div className="md:col-span-2 mt-12 bg-gray-800 p-6 rounded-lg text-center duration-500 hover:scale-105 reveal">
            <h3 className="text-3xl font-bold mb-4">Our Process</h3>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              From ideation and design through development and deployment, we work collaboratively with our clients to transform ideas into digital solutions. Our agile process ensures timely delivery and continuous improvement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
