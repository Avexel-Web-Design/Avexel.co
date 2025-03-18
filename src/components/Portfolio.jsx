import React, { useState } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const ProjectCard = ({ title, description, image, tags, websiteUrl, caseStudyUrl, orientation = 'right', teamName = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative reveal"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
      <div className="relative bg-dark backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8 lg:p-12">
          <div className={`space-y-6 ${orientation === 'left' ? 'md:order-2' : 'md:order-1'}`}>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              {title}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span 
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {websiteUrl && (
                <a 
                  href={websiteUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                  <span className="relative">Visit Website</span>
                  <svg className="w-4 h-4 relative transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
                    <path d="M13 5L20 12M20 12L13 19M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
              
              {caseStudyUrl && (
                <a 
                  href={caseStudyUrl}
                  className="group relative inline-flex items-center gap-2 px-6 py-3 border border-secondary-500 text-secondary-400 rounded-full font-semibold overflow-hidden"
                >
                  <span className="absolute inset-0 bg-secondary-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                  <span className="relative">Case Study</span>
                  <svg className="w-4 h-4 relative transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
                    <path d="M17 8L21 12M21 12L17 16M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
          
          <div className={`relative ${orientation === 'left' ? 'md:order-1' : 'md:order-2'}`}>
            {/* Project Image with interactive effects */}
            <div className="relative aspect-video md:aspect-square overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 group-hover:opacity-0 transition-opacity duration-500 z-10"></div>
              <div className={`absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-50 ${isHovered ? 'opacity-0' : 'opacity-50'} transition-opacity duration-500 z-10`}></div>
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Interactive overlay */}
              {teamName && (
                <div className={`absolute inset-0 bg-gradient-to-t from-dark to-transparent flex flex-col justify-end p-6 ${isHovered ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 z-20`}>
                  <span className="text-white/70 text-sm">{teamName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  useScrollReveal();
  
  return (
    <section id="work" className="py-20 bg-black relative overflow-hidden scroll-mt-16">
      {/* Reduced py-32 to py-20 and scroll-mt-24 to scroll-mt-16 */}
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 border border-white/5 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-1/3 left-1/5 w-64 h-64 border border-white/5 animate-spin-slow-reverse"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 reveal">
          <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">Our Work</span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-300">
            Take a look at some of the websites we've crafted for local businesses while supporting our robotics journey.
          </p>
        </div>

        <div className="grid gap-8 reveal">
          <ProjectCard
            title="Local Bakery Website"
            description="A modern, mobile-first website for a beloved local bakery. We implemented online ordering, a dynamic menu system, and integrated social media to help grow their digital presence and streamline customer orders."
            tags={["React", "TailwindCSS", "Firebase"]}
            image="/path/to/image.jpg"
            link="https://example.com"
          />

          <ProjectCard
            title="Community Sports Club"
            description="Revamped the digital home of a local sports club with a focus on event scheduling, membership management, and real-time facility booking. The new system helped increase member engagement by 40%."
            tags={["Next.js", "Stripe", "MongoDB"]}
            image="/path/to/image.jpg"
            link="https://example.com"
          />

          <ProjectCard
            title="Automotive Service Center"
            description="Created an intuitive website featuring online appointment booking, service history tracking, and automated maintenance reminders. The platform helped reduce phone calls by 60% while improving customer satisfaction."
            tags={["React", "Node.js", "PostgreSQL"]}
            image="/path/to/image.jpg"
            link="https://example.com"
          />
        </div>

        <div className="text-center mt-12 reveal">
          <p className="text-gray-300 mb-8">
            Every project supports our robotics team while delivering value to local businesses. Want to be our next success story?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
