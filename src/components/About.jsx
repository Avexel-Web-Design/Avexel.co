import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const TimelineItem = ({ year, title, description }) => (
  <div className="relative pl-8 pb-12 group">
    <div className="absolute left-[-5px] w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
      <div className="absolute -inset-2 rounded-full border border-primary-500/30 group-hover:border-primary-500/60 transition-colors duration-300"></div>
      <div className="absolute -inset-4 rounded-full border border-primary-500/20 group-hover:border-primary-500/40 transition-colors duration-300"></div>
    </div>
    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 to-secondary-500/50"></div>
    <div className="group-hover:translate-x-1 transition-transform duration-300">
      <h4 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">{year}</h4>
      <p className="text-xl font-medium text-white mb-1">{title}</p>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{description}</p>
    </div>
  </div>
);

const TeamMemberCard = ({ name, role, image, description, socialLinks = [] }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
    <div className="relative flex flex-col h-full glass-morphism p-6 rounded-xl border border-white/5 transition-all duration-500 group-hover:translate-y-[-2px]">
      {/* Image with decorative elements */}
      <div className="relative mb-6 mx-auto">
        <div className="absolute -inset-2 border border-primary-500/20 rounded-full"></div>
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 mix-blend-overlay"></div>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
      
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">{name}</h3>
        <p className="text-gray-400 mt-1">{role}</p>
      </div>
      
      <p className="text-gray-300 text-center mb-6 flex-grow">{description}</p>
      
      <div className="flex justify-center gap-4">
        {socialLinks.map((link, index) => (
          <a 
            key={index}
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-primary-500/20 hover:border-primary-500/30 transition-colors duration-300"
            aria-label={link.label}
          >
            <i className={`${link.icon} text-white`}></i>
          </a>
        ))}
      </div>
    </div>
  </div>
);

const About = () => {
  useScrollReveal();
  
  return (
    <section id="about" className="py-32 bg-black relative overflow-hidden scroll-mt-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/5 rounded-full animate-spin-slow-reverse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 border border-white/5 animate-spin-slow"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal stagger-reveal">
          <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">Our Story</span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            About Us
          </h2>
          <p className="text-lg text-gray-300">
            A passionate team turning ideas into beautiful digital experiences
          </p>
        </div>
        
        {/* Team Section */}
        <div className="mb-24 reveal">
          <h3 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Meet the Team</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <TeamMemberCard 
              name="Ryan Latimer"
              role="Lead Developer"
              image="/src/assets/images/team/ryan.jpg"
              description="Full-stack developer with expertise in creating responsive web applications and intuitive user interfaces."
              socialLinks={[
                { icon: "fab fa-github", url: "https://github.com/ryanlatimer", label: "GitHub" },
                { icon: "fab fa-linkedin-in", url: "https://linkedin.com/in/ryanlatimer", label: "LinkedIn" },
                { icon: "fas fa-envelope", url: "mailto:ryan@avexel.co", label: "Email" }
              ]}
            />
            
            <TeamMemberCard 
              name="Gavin Moceri"
              role="Backend Developer"
              image="/src/assets/images/team/gavin.jpg"
              description="Specialized in database architecture, API development, and ensuring optimal performance for all our projects."
              socialLinks={[
                { icon: "fab fa-github", url: "https://github.com/gavinmoceri", label: "GitHub" },
                { icon: "fab fa-linkedin-in", url: "https://linkedin.com/in/gavinmoceri", label: "LinkedIn" },
                { icon: "fas fa-envelope", url: "mailto:gavin@avexel.co", label: "Email" }
              ]}
            />
            
            <TeamMemberCard 
              name="Conner Breckenfeld"
              role="UI/UX Designer"
              image="/src/assets/images/team/conner.jpg"
              description="Creative designer focusing on crafting visually stunning interfaces that deliver exceptional user experiences."
              socialLinks={[
                { icon: "fab fa-dribbble", url: "https://dribbble.com/connerbreckenfeld", label: "Dribbble" },
                { icon: "fab fa-linkedin-in", url: "https://linkedin.com/in/connerbreckenfeld", label: "LinkedIn" },
                { icon: "fas fa-envelope", url: "mailto:conner@avexel.co", label: "Email" }
              ]}
            />
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Mission
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            We are dedicated to creating exceptional digital experiences that solve real problems. By combining our technical expertise, design skills, and innovative thinking, we deliver solutions that exceed expectations and drive tangible results for our clients.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center mt-1 ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
                <i className="fas fa-paint-brush text-xs bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
              </div>
              <div className="flex-1 glass-morphism p-4 rounded-xl group-hover:shadow-neon transition-all duration-300">
                <p className="text-gray-300">We craft visually stunning interfaces that engage users and communicate brand values effectively.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center mt-1 ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
                <i className="fas fa-code text-xs bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
              </div>
              <div className="flex-1 glass-morphism p-4 rounded-xl group-hover:shadow-neon transition-all duration-300">
                <p className="text-gray-300">We write clean, efficient code that brings designs to life while ensuring optimal performance and accessibility.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center mt-1 ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
                <i className="fas fa-users text-xs bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
              </div>
              <div className="flex-1 glass-morphism p-4 rounded-xl group-hover:shadow-neon transition-all duration-300">
                <p className="text-gray-300">We love collaborating with clients to understand their needs and deliver solutions that exceed expectations.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline Section */}
        <div className="mt-32 reveal">
          <h3 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Our Journey</h3>
          <div className="max-w-3xl mx-auto">
            <TimelineItem 
              year="2018"
              title="The Beginning"
              description="Our team began exploring design and development while working on personal projects and building our foundational skills."
            />
            <TimelineItem 
              year="2020"
              title="First Professional Projects"
              description="Worked with our first clients on web design and development projects, focusing on user experience and responsive design."
            />
            <TimelineItem 
              year="2021"
              title="Team Formation"
              description="Ryan, Gavin, and Conner officially joined forces, combining their expertise to deliver comprehensive digital solutions."
            />
            <TimelineItem 
              year="Present"
              title="Continuous Growth"
              description="Constantly learning and refining our craft, pushing creative boundaries and exploring new technologies to deliver exceptional digital experiences."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
