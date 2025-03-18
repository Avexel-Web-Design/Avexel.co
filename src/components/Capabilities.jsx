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
            Skills & Capabilities
          </h2>
          <p className="text-lg text-gray-300">
            Delivering excellence through our core competencies and technical expertise
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
          <CapabilityCard 
            icon="fa-mobile-alt"
            title="Responsive Design"
            description="Fluid layouts that adapt seamlessly to any device or screen size, ensuring a consistent experience across all platforms."
            target="100"
            suffix="%"
          />
          
          <CapabilityCard 
            icon="fa-code"
            title="Customer Satisfaction"
            description="Exceeding expectations through careful attention to detail and client-focused development approach."
            target="100"
            suffix="%"
          />
          
          <CapabilityCard 
            icon="fa-tachometer-alt"
            title="Rapid Development"
            description="Swift prototyping and efficient delivery without compromising on quality or attention to detail."
            target="7"
            suffix="Days"
            startValue={0}
          />
          
          <CapabilityCard 
            icon="fa-paint-brush"
            title="UI/UX Design"
            description="Creating intuitive, engaging interfaces that delight users and drive conversions."
            target="100"
            suffix="%"
          />
        </div>
        
        {/* Skills Showcase */}
        <div className="mt-24 relative reveal">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30"></div>
          <div className="relative glass-morphism p-8 lg:p-12 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Our Tech Stack
            </h3>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {['React', 'Next.js', 'TailwindCSS', 'JavaScript', 'TypeScript', 'Node.js', 'Firebase', 'MongoDB'].map((tech, index) => (
                <div 
                  key={tech} 
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative px-5 py-3 bg-dark rounded-lg border border-white/10 group-hover:border-primary-500/30 transition-colors duration-300">
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      {tech}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Angled section divider */}
      <div className="section-divider mt-24"></div>
    </section>
  );
};

export default Capabilities;
