import React from 'react';
import useCounterAnimation from '../hooks/useCounterAnimation';
import useScrollReveal from '../hooks/useScrollReveal';

const CapabilityCard = ({ icon, title, description, target, suffix, startValue = 0 }) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative h-full bg-dark backdrop-blur-sm p-8 rounded-xl border border-white/5 transition-all duration-500 group-hover:translate-y-[-2px]">
        {/* Icon with animated background */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent rounded-xl animate-pulse-slow"></div>
          <div className="relative w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
            <i className={`fas ${icon} text-2xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent`}></i>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
          
          {/* Statistics with animated counter */}
          <div className="pt-6">
            <div className="flex items-center justify-center gap-1">
              <span className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent counter" data-target={target}>
                {startValue}
              </span>
              <span className="text-xl text-primary-400">{suffix}</span>
            </div>
            <div className="w-full h-1 mt-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Capabilities = () => {
  useScrollReveal();
  useCounterAnimation();

  return (
    <section id="capabilities" className="py-32 bg-black relative overflow-hidden scroll-mt-24">
      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/3 right-1/5 w-72 h-72 border border-white/5 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-1/4 left-1/6 w-48 h-48 border border-white/5 animate-spin-slow-reverse"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal stagger-reveal">
          <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">What We Do Best</span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Skills
          </h2>
          <p className="text-lg text-gray-300">
            We apply the same determination and teamwork from robotics to our web projects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
          <CapabilityCard 
            icon="fa-mobile-alt"
            title="Mobile-Friendly"
            description="We make sure all our websites work perfectly on phones and tablets, just like they do on computers."
            target="100"
            suffix="%"
          />
          
          <CapabilityCard 
            icon="fa-smile"
            title="Happy Clients"
            description="Our focus on communication and meeting your needs ensures you'll be satisfied with the final result."
            target="100"
            suffix="%"
          />
          
          <CapabilityCard 
            icon="fa-robot"
            title="FRC Experience"
            description="Years of problem-solving in FIRST Robotics competitions has taught us how to tackle challenges creatively."
            target="3"
            suffix="Years"
            startValue={0}
          />
          
          <CapabilityCard 
            icon="fa-paint-brush"
            title="Clean Design"
            description="We create simple, effective designs that make it easy for visitors to find what they're looking for."
            target="100"
            suffix="%"
          />
        </div>
        
        {/* FRC connection section */}
        <div className="mt-32 relative glass-morphism p-8 lg:p-12 rounded-xl border border-white/5 reveal">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              From Robotics to Websites
            </h3>
            <p className="text-gray-300 mb-8">
              In FRC Team 7790, we learn to solve complex problems under pressure, work as a team, and adapt to challenges. We bring these same skills to our web design projects, creating effective solutions for our clients while having fun along the way.
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <img src="/src/assets/images/baywatchLogo.png" alt="Team 7790 Baywatch Robotics" className="h-24 object-contain" />
              <div className="w-px h-16 bg-gradient-to-b from-primary-500/0 via-primary-500/30 to-primary-500/0"></div>
              <div className="flex items-center">
                <span className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent counter" data-target="7790">
                  7790
                </span>
                <span className="text-xl text-white ml-2">Baywatch Robotics</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Angled section divider */}
        <div className="section-divider mt-24"></div>
      </div>
    </section>
  );
};

export default Capabilities;
