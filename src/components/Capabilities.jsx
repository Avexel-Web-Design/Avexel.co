import React from 'react';
import useCounterAnimation from '../hooks/useCounterAnimation';
import useScrollReveal from '../hooks/useScrollReveal';

const CapabilityCard = ({ icon, title, description, target, suffix, startValue = 0 }) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative h-full bg-dark backdrop-blur-sm p-8 rounded-xl border border-white/5 transition-all duration-500 group-hover:translate-y-[-2px]">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
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
          
          {/* Statistics */}
          <div className="pt-4">
            <div className="flex items-center justify-center gap-1">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent counter" data-target={target}>
                {startValue}
              </span>
              <span className="text-lg text-primary-400">{suffix}</span>
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
    <section id="capabilities" className="py-24 bg-dark scroll-mt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Skills & Capabilities
          </h2>
          <p className="text-lg text-gray-400">
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
      </div>
    </section>
  );
};

export default Capabilities;
