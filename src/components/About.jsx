import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const TeamMember = ({ name, role, description }) => (
  <div className="text-center">
    <h3 className="text-xl font-bold">{name}</h3>
    <p className="text-gray-400">{role}</p>
    <p className="mt-2 text-sm">{description}</p>
  </div>
);

const TimelineItem = ({ year, description }) => (
  <div className="mb-10 ml-6">
    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-purple-500 rounded-full ring-8 ring-black"></span>
    <h4 className="font-medium text-lg">{year}</h4>
    <p className="text-gray-400">{description}</p>
  </div>
);

const About = () => {
  useScrollReveal();
  
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black to-gray-900 scroll-mt-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-center">About Us</h2>
        <p className="text-gray-400 text-lg mb-12 text-center max-w-3xl mx-auto reveal">
          We're a creative team of high school students dedicated to creating functional, beautiful websites and applications. 
          Our focus on web design, development, and user experience enables us to exceed client expectations.
          Our team works to create sites that serve to enhance your business, expand your outreach and visibility, and increase your online presence. 
          We are dedicated to providing the best possible service to our clients ensuring that your website works for your business.
        </p>
        
        {/* Team Members Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 reveal">
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
          <div className="text-center md:col-span-2 mx-auto">
            <TeamMember 
              name="Conner Breckenfeld"
              role="Designer"
              description="Conner Breckenfeld is a creative designer with an exceptional eye for aesthetics, bringing visual excellence and innovative design concepts to our projects."
            />
          </div>
        </div>
        
        {/* Timeline */}
        <div className="mb-16 reveal">
          <h3 className="text-3xl font-bold text-center mb-8">Our Journey</h3>
          <div className="relative border-l-2 border-gray-700">
            <TimelineItem 
              year="Founded in 2024"
              description="Started our journey with a passion for digital innovation."
            />
            <TimelineItem 
              year={
                <>
                  First Major Project - <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">FRC7790.com</span>
                </>
              }
              description="Created our first website, a side project to build up the online prcesence of our FIRST Robotics team."
            />
            <TimelineItem 
              year="Expansion & Growth"
              description="Expanded our service offerings and reach to a multitude of local businesses."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
