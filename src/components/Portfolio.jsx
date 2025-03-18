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
      {/* Enhanced border glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 group-hover:blur-md transition-all duration-700"></div>
      
      {/* Added animated particle effects on hover */}
      <div className={`absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.3)',
              animation: `float-particle ${2 + Math.random() * 3}s linear infinite`,
              opacity: 0.7,
              transform: 'scale(0)',
            }}
          />
        ))}
      </div>
      
      <div className="relative bg-dark backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-2xl group-hover:border-white/20 transition-all duration-500">
        <div className="grid md:grid-cols-2 gap-8 p-8 lg:p-12">
          {/* Content Section */}
          <div className={`space-y-6 ${orientation === 'left' ? 'md:order-2' : 'md:order-1'}`}>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent group-hover:scale-105 origin-left transition-transform duration-500">
              {title}
            </h3>
            
            {/* Enhanced tag styling */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span 
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all duration-500"
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
              {description}
            </p>
            
            {/* Enhanced button styling */}
            <div className="flex flex-wrap gap-4 pt-4">
              {websiteUrl && (
                <a 
                  href={websiteUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold overflow-hidden shadow-lg hover:shadow-primary-500/30"
                >
                  {/* Moving gradient overlay */}
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></span>
                  
                  {/* Subtle light reflection effect */}
                  <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300">
                    <span className="absolute inset-0 translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover/btn:animate-shimmer"></span>
                  </span>
                  
                  <span className="relative">Visit Website</span>
                  <svg className="w-4 h-4 relative transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="none">
                    <path d="M13 5L20 12M20 12L13 19M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
              
              {caseStudyUrl && (
                <a 
                  href={caseStudyUrl}
                  className="group/btn relative inline-flex items-center gap-2 px-6 py-3 border border-secondary-500 text-secondary-400 rounded-full font-semibold overflow-hidden hover:text-white transition-colors duration-300"
                >
                  <span className="absolute inset-0 bg-secondary-500/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></span>
                  <span className="relative">Case Study</span>
                  <svg className="w-4 h-4 relative transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 24 24" fill="none">
                    <path d="M17 8L21 12M21 12L17 16M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
          
          {/* Image Section with enhanced effects */}
          <div className={`relative ${orientation === 'left' ? 'md:order-1' : 'md:order-2'}`}>
            <div className="relative aspect-video md:aspect-square overflow-hidden rounded-xl shadow-xl">
              {/* Radial gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 group-hover:opacity-0 transition-opacity duration-700 z-10"></div>
              
              {/* Dynamic shadow effect */}
              <div className={`absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent ${isHovered ? 'opacity-0' : 'opacity-50'} transition-opacity duration-700 z-10`}></div>
              
              {/* Enhanced image presentation */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
              </div>
              
              {/* Animated corner accents */}
              <div className={`absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-primary-400/70 rounded-tl opacity-0 group-hover:opacity-100 transition-all duration-700 ${isHovered ? 'scale-100' : 'scale-50'}`}></div>
              <div className={`absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-secondary-400/70 rounded-br opacity-0 group-hover:opacity-100 transition-all duration-700 ${isHovered ? 'scale-100' : 'scale-50'}`}></div>
              
              {/* Team name overlay with improved styling */}
              {teamName && (
                <div className={`absolute inset-0 bg-gradient-to-t from-dark to-transparent flex flex-col justify-end p-6 ${isHovered ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700 z-20`}>
                  <span className="text-white/90 text-sm font-medium bg-dark/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block w-fit">{teamName}</span>
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
            title="FRC Team 7790 Website"
            description="An interactive website for Baywatch Robotics showcasing our team, robot designs, competition history, and STEM outreach programs. Features include a team member directory, sponsorship information, and resources for aspiring robotics enthusiasts."
            tags={["React", "TailwindCSS", "JavaScript"]}
            image="/src/assets/images/baywatchLogo.png"
            websiteUrl="https://frc7790.com"
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
