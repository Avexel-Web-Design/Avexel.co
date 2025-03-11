import React, { useEffect } from 'react';
import useCounterAnimation from '../hooks/useCounterAnimation';
import useScrollReveal from '../hooks/useScrollReveal';

const CapabilityCard = ({ icon, title, description, target, suffix, startValue = 0 }) => {
  return (
    <div className="p-6 bg-gray-800/50 rounded-xl hover:transform hover:scale-105 transition-all duration-300 border border-transparent hover:border-purple-500/50 group">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 glass-icon flex items-center justify-center animate-float">
          <i className={`fas ${icon} text-2xl`}></i>
        </div>
      </div>
      <h3 className="text-xl font-bold text-center mb-4">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
      <div className="mt-4 text-center">
        <span className="text-3xl font-bold text-purple-500 counter" data-target={target}>{startValue}</span>
        <span className="text-purple-500">{suffix}</span>
      </div>
    </div>
  );
};

const Capabilities = () => {
  useScrollReveal();
  useCounterAnimation();

  return (
    <section id="capabilities" className="py-20 bg-black scroll-mt-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-16 text-center reveal">Skills & Capabilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CapabilityCard 
            icon="fa-mobile-alt"
            title="Responsive Design"
            description="Fluid layouts that adapt seamlessly to any device or screen size"
            target="100"
            suffix="% of designs"
          />
          
          <CapabilityCard 
            icon="fa-code"
            title="Customer Satisfaction"
            description="Designed with the customers goals in mind to perfectly fit expectaions"
            target="100"
            suffix="% of customers"
          />
          
          <CapabilityCard 
            icon="fa-tachometer-alt"
            title="Speedy Development"
            description="Fast prototyping and delivery of final product"
            target="7"
            suffix="Days"
            startValue={100}
          />
          
          <CapabilityCard 
            icon="fa-paint-brush"
            title="UI/UX Design"
            description="Intuitive interfaces with engaging user experiences"
            target="100"
            suffix="% of the time"
          />
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
