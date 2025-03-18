import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const ServiceCard = ({ icon, title, description, comingSoon = false }) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative flex flex-col h-full bg-dark backdrop-blur-sm p-8 rounded-xl border border-white/5 transition-all duration-500 group-hover:translate-y-[-2px]">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 animate-pulse-slow transition-opacity duration-300"></div>
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
            <i className={`fas ${icon} text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent`}></i>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-4">
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
        
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center text-primary-400 group-hover:text-primary-300 transition-colors duration-300">
            <span className="mr-2 font-medium">Learn more</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
              <path d="M13 5L20 12M20 12L13 19M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessStep = ({ number, title, description }) => (
  <div className="relative group">
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
        <div className="relative w-16 h-16 rounded-full bg-dark flex items-center justify-center ring-1 ring-primary-500/30 group-hover:ring-primary-500/70 transition-all duration-300">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">{number}</span>
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">{title}</h4>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{description}</p>
      </div>
    </div>
    {number < 4 && (
      <div className="hidden md:block absolute left-8 top-16 bottom-0 w-px bg-gradient-to-b from-primary-500/50 to-secondary-500/50"></div>
    )}
  </div>
);

const Services = () => {
  useScrollReveal();
  
  return (
    <section id="services" className="py-32 bg-black relative overflow-hidden scroll-mt-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/6 w-64 h-64 border border-white/5 animate-spin-slow"></div>
      <div className="absolute bottom-1/3 left-1/5 w-48 h-48 border border-white/5 rounded-full animate-spin-slow-reverse"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal stagger-reveal">
          <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">What We Offer</span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Services & Process
          </h2>
          <p className="text-lg text-gray-300">
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
          
          <ServiceCard 
            icon="fa-paint-brush"
            title="UI/UX Design"
            description="Crafting beautiful, intuitive interfaces that guide users through meaningful interactions with your brand. Our designs focus on usability while maintaining visual appeal."
          />
          
          <ServiceCard 
            icon="fa-rocket"
            title="Performance Optimization"
            description="Enhancing your existing web applications for speed and efficiency. We fine-tune your digital assets to provide lightning-fast experiences to your users."
          />
        </div>
        
        {/* Process Section */}
        <div className="mt-32 reveal">
          <h3 className="text-3xl font-bold mb-16 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Process
          </h3>
          
          <div className="relative glass-morphism p-8 lg:p-12 rounded-xl border border-white/5">
            {/* Decorative background for process section */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-primary-500/5 to-transparent opacity-60 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-secondary-500/5 to-transparent opacity-60 blur-xl"></div>
            </div>
            
            <div className="relative z-10 space-y-12">
              <ProcessStep 
                number="1"
                title="Discovery & Planning"
                description="We begin by understanding your goals, target audience, and specific requirements to create a strategic roadmap for your project."
              />
              
              <ProcessStep 
                number="2"
                title="Design & Prototyping"
                description="Our designers craft beautiful mockups and interactive prototypes to visualize the final product before any development begins."
              />
              
              <ProcessStep 
                number="3"
                title="Development & Testing"
                description="Our development team brings the designs to life with clean, efficient code while ensuring quality through rigorous testing."
              />
              
              <ProcessStep 
                number="4"
                title="Deployment & Support"
                description="We handle the launch process and provide ongoing support to ensure your digital solution continues to perform optimally."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
