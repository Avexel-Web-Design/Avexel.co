import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const TeamMember = ({ name, role, description }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-20 group-hover:opacity-75 transition duration-500"></div>
    <div className="relative bg-dark backdrop-blur-sm p-8 rounded-xl border border-white/5 text-center transition-all duration-500 group-hover:translate-y-[-2px]">
      <div className="mb-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            {name.charAt(0)}
          </span>
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">{name}</h3>
      <p className="text-secondary-400 font-medium mb-4">{role}</p>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{description}</p>
    </div>
  </div>
);

const TimelineItem = ({ year, description }) => (
  <div className="relative pl-8 pb-12 group">
    <div className="absolute left-[-5px] w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
      <div className="absolute -inset-2 rounded-full border border-primary-500/30 group-hover:border-primary-500/60 transition-colors duration-300"></div>
      <div className="absolute -inset-4 rounded-full border border-primary-500/20 group-hover:border-primary-500/40 transition-colors duration-300"></div>
    </div>
    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 to-secondary-500/50"></div>
    <div className="group-hover:translate-x-1 transition-transform duration-300">
      <h4 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">{year}</h4>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{description}</p>
    </div>
  </div>
);

const About = () => {
  useScrollReveal();
  
  return (
    <section id="about" className="py-24 bg-dark scroll-mt-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            About Us
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            We're a creative team of high school students dedicated to creating functional, beautiful websites and applications. 
            Our focus on web design, development, and user experience enables us to exceed client expectations.
            Our team works to create sites that serve to enhance your business, expand your outreach and visibility, and increase your online presence.
          </p>
        </div>
        
        {/* Team Members Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 reveal">
          <TeamMember 
            name="Gavin Moceri"
            role="Developer"
            description="Gavin Moceri is a talented frontend developer with skills in design, interactivity, and clarity."
          />
          <TeamMember 
            name="Ryan Latimer"
            role="Developer"
            description="Ryan Latimer is a skilled frontend developer with skills in dynamic, engaging content and styling."
          />
          <div className="md:col-span-2">
            <TeamMember 
              name="Conner Breckenfeld"
              role="Designer"
              description="Conner Breckenfeld is a creative designer with an exceptional eye for aesthetics, bringing visual excellence and innovative design concepts to our projects."
            />
          </div>
        </div>
        
        {/* Timeline */}
        <div className="max-w-2xl mx-auto reveal">
          <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Journey
          </h3>
          <div className="relative">
            <TimelineItem 
              year="Founded in 2024"
              description="Started our journey with a passion for digital innovation and a vision to create impactful web solutions."
            />
            <TimelineItem 
              year="First Major Project - FRC7790.com"
              description="Created our first website, a side project to build up the online presence of our FIRST Robotics team, showcasing our ability to create engaging and functional web experiences."
            />
            <TimelineItem 
              year="Expansion & Growth"
              description="Expanded our service offerings and reach to a multitude of local businesses, helping them establish and enhance their digital presence."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
