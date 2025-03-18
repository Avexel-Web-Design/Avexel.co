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
            Our Services
          </h2>
          <p className="text-lg text-gray-300">
            Simple, affordable web solutions by students helping to fund FRC Team 7790
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 reveal">
          <ServiceCard 
            icon="fa-laptop-code"
            title="Website Creation"
            description="We build simple, effective websites for small businesses and organizations in our community. Our focus is on clean designs that are easy to navigate and work well on all devices."
          />
          
          <ServiceCard 
            icon="fa-paint-brush"
            title="Web Design"
            description="Need a fresh look for your online presence? We can create a design that reflects your brand and appeals to your customers, making sure your website stands out in the right way."
          />
          
          <ServiceCard 
            icon="fa-bullhorn"
            title="Social Media Setup"
            description="We'll help you get started on social media platforms that make sense for your business, creating profiles that connect with your website for a consistent online presence."
            comingSoon={true}
          />
          
          <ServiceCard 
            icon="fa-tools"
            title="Website Maintenance"
            description="Let us handle the technical details of keeping your website running smoothly, including updates, backups, and making small changes when you need them."
          />
        </div>
        
        {/* Process Section */}
        <div className="mt-32 reveal">
          <h3 className="text-3xl font-bold mb-16 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            How We Work
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
                title="Chat & Listen"
                description="We start by understanding your needs and goals. This meeting can be after school or on weekends to fit your schedule."
              />
              
              <ProcessStep 
                number="2"
                title="Design & Review"
                description="We'll create a simple design for your approval, making sure it represents your business the way you want."
              />
              
              <ProcessStep 
                number="3"
                title="Build & Test"
                description="Our team builds your website, testing it thoroughly to ensure everything works perfectly on all devices."
              />
              
              <ProcessStep 
                number="4"
                title="Launch & Support"
                description="Once you're happy with the site, we'll help you launch it and show you how to use it. And we're always available if you need help later!"
              />
            </div>
          </div>
        </div>
        
        {/* FRC Support Section */}
        <div className="mt-32 reveal">
          <div className="relative glass-morphism p-8 lg:p-12 rounded-xl border border-white/5">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Supporting FRC Team 7790
              </h3>
              <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                A portion of all proceeds from our web design projects directly supports Baywatch Robotics (FRC Team 7790), helping us fund competition fees, materials, and travel expenses.
              </p>
            </div>
            
            <div className="flex justify-center mt-6">
              <a 
                href="https://FRC7790.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Visit Our Robotics Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
