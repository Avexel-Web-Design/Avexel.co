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
    <section id="about" className="py-20 bg-black relative overflow-hidden scroll-mt-16">
      {/* Reduced py-32 to py-20 and scroll-mt-24 to scroll-mt-16 */}
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/5 rounded-full animate-spin-slow-reverse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 border border-white/5 animate-spin-slow"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 reveal stagger-reveal">
          {/* Reduced mb-16 to mb-12 */}
          <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">Our Story</span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            About Us
          </h2>
          <p className="text-lg text-gray-300">
            High school students passionate about robotics and web development
          </p>
        </div>
        
        {/* Team Section */}
        <div className="mb-16 reveal">
          {/* Reduced mb-24 to mb-16 */}
          <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Meet the Team</h3>
          {/* Reduced mb-12 to mb-8 */}
          <div className="grid md:grid-cols-3 gap-8">
            <TeamMemberCard 
              name="Ryan Latimer"
              role="Student Developer"
              image="/src/assets/images/team/ryan.jpg"
              description="FRC Team 7790 member with a passion for coding and creating responsive websites that make an impact."
              socialLinks={[
                { icon: "fab fa-github", url: "https://github.com/ryanlatimer", label: "GitHub" },
                { icon: "fab fa-linkedin-in", url: "https://linkedin.com/in/ryanlatimer", label: "LinkedIn" },
                { icon: "fas fa-envelope", url: "mailto:ryan@avexel.co", label: "Email" }
              ]}
            />
            
            <TeamMemberCard 
              name="Gavin Moceri"
              role="Student Developer"
              image="/src/assets/images/team/gavin.jpg"
              description="Robotics enthusiast who enjoys problem-solving and building cool websites to help local businesses shine online."
              socialLinks={[
                { icon: "fab fa-github", url: "https://github.com/gavinmoceri", label: "GitHub" },
                { icon: "fab fa-linkedin-in", url: "https://linkedin.com/in/gavinmoceri", label: "LinkedIn" },
                { icon: "fas fa-envelope", url: "mailto:gavin@avexel.co", label: "Email" }
              ]}
            />
            
            <TeamMemberCard 
              name="Conner Breckenfeld"
              role="Student Designer"
              image="/src/assets/images/team/conner.jpg"
              description="Creative member of Team 7790 who loves making websites look good and work even better for users of all types."
              socialLinks={[
                { icon: "fab fa-dribbble", url: "https://dribbble.com/connerbreckenfeld", label: "Dribbble" },
                { icon: "fab fa-linkedin-in", url: "https://linkedin.com/in/connerbreckenfeld", label: "LinkedIn" },
                { icon: "fas fa-envelope", url: "mailto:conner@avexel.co", label: "Email" }
              ]}
            />
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center mb-12 reveal">
          {/* Reduced mb-16 to mb-12 */}
          <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Mission
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            We started Avexel as a side project to support our FRC Team 7790 while helping businesses in our community establish their online presence. As high school students passionate about technology, we're using our skills to make websites that matter.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center mt-1 ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
                <i className="fas fa-paint-brush text-xs bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
              </div>
              <div className="flex-1 glass-morphism p-4 rounded-xl group-hover:shadow-neon transition-all duration-300">
                <p className="text-gray-300">We create simple, user-friendly websites that help businesses connect with their customers.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center mt-1 ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
                <i className="fas fa-code text-xs bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
              </div>
              <div className="flex-1 glass-morphism p-4 rounded-xl group-hover:shadow-neon transition-all duration-300">
                <p className="text-gray-300">We apply the problem-solving skills we've learned in robotics to build effective digital solutions.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center mt-1 ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300">
                <i className="fas fa-users text-xs bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
              </div>
              <div className="flex-1 glass-morphism p-4 rounded-xl group-hover:shadow-neon transition-all duration-300">
                <p className="text-gray-300">A portion of our proceeds goes directly to supporting Team 7790 Baywatch Robotics.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline Section */}
        <div className="mt-20 reveal">
          {/* Reduced mt-32 to mt-20 */}
          <h3 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Our Journey</h3>
          <div className="max-w-3xl mx-auto">
            <TimelineItem 
              year="2022"
              title="Robotics Team Experience"
              description="We joined FRC Team 7790 Baywatch Robotics and discovered our shared passion for technology and problem-solving."
            />
            <TimelineItem 
              year="2023"
              title="The Idea Forms"
              description="While brainstorming fundraising ideas for our robotics team, we realized we could use our web development skills to help local businesses."
            />
            <TimelineItem 
              year="2023"
              title="Avexel is Born"
              description="We officially launched Avexel as a student-led initiative to create websites while supporting our robotics team's activities."
            />
            <TimelineItem 
              year="Present"
              title="Growing & Learning"
              description="We continue to balance school, robotics competitions, and building our skills to deliver better websites for our clients."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
