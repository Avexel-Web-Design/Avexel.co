import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const ServiceCard = ({ icon, title, description, comingSoon = false }) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative flex flex-col h-full bg-dark backdrop-blur-sm p-8 rounded-xl border border-white/5 transition-all duration-500 group-hover:translate-y-[-2px]">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
            <i className={`fas ${icon} text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent`}></i>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              {title}
            </h3>
            {comingSoon && (
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-secondary-500/10 text-secondary-400 rounded-full border border-secondary-500/20">
                Coming Soon
              </span>
            )}
          </div>
          <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  useScrollReveal();
  
  return (
    <section id="services" className="py-24 bg-dark scroll-mt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Services & Process
          </h2>
          <p className="text-lg text-gray-400">
            Delivering exceptional digital solutions through innovative design and development
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 reveal">
          <ServiceCard 
            icon="fa-laptop-code"
            title="Web Design & Development"
            description="Creating visually stunning and highly functional websites, from conceptualization to launch. We work directly with our business clients to ensure perfect alignment with their brand and goals."
          />
          
          <ServiceCard 
            icon="fa-mobile-alt"
            title="Mobile App Development"
            description="Developing intuitive, high-performance mobile applications tailored to your business needs. Engage your customers on the go with seamless and responsive apps."
            comingSoon={true}
          />
        </div>
        
        <div className="mt-16 reveal">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-dark backdrop-blur-sm p-8 lg:p-12 rounded-xl border border-white/5 text-center">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Our Process
              </h3>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-gray-400 leading-relaxed">
                  From ideation and design through development and deployment, we work collaboratively with our clients to transform ideas into digital solutions. Our agile process ensures timely delivery and continuous improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
