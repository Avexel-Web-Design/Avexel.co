import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import Monogram from './Monogram';

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

const TeamMemberCard = ({ name, role, description }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
    <div className="relative flex flex-col h-full glass-morphism p-6 rounded-xl border border-white/5 transition-all duration-500 group-hover:translate-y-[-2px]">
      {/* Use Monogram instead of image */}
      <div className="relative mb-6 mx-auto">
        <Monogram 
          name={name} 
          size="lg" 
          className="mx-auto"
        />
      </div>
      
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">{name}</h3>
        <p className="text-gray-400 mt-1">{role}</p>
      </div>
      
      <p className="text-gray-300 text-center flex-grow">{description}</p>
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">Who We Are</span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Student Developers. Real Solutions.
            </h2>
            <p className="text-lg text-gray-300">
              We're more than just a web development team – we're students passionate about technology and innovation, putting our skills to work while supporting STEM education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 reveal">
            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Our Story
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Born from the innovative spirit of FRC Team 7790, we bridge the gap between robotics and web development. Our journey began with a simple idea: to transform our coding passion into meaningful projects while generating support for our robotics program.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Today, we're proud to offer professional web development services that not only meet our clients' needs but also fuel the next generation of STEM leaders.
              </p>
            </div>

            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Our Mission
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We're committed to delivering exceptional web solutions while fostering STEM education. Each project we undertake serves a dual purpose: providing value to our clients and supporting our robotics team's growth and development.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                By choosing us, you're not just getting a website – you're investing in the future of technology and education.
              </p>
            </div>
          </div>

          <div className="mt-12 reveal">
            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Why Choose Us
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="mb-4">
                    <i className="fas fa-code text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
                  </div>
                  <h4 className="font-bold mb-2">Modern Technology</h4>
                  <p className="text-gray-400">
                    We leverage cutting-edge tools and frameworks to build fast, responsive, and secure websites that stand out.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <i className="fas fa-heart text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
                  </div>
                  <h4 className="font-bold mb-2">Passion for Excellence</h4>
                  <p className="text-gray-400">
                    Our competitive robotics background drives us to pursue perfection in every project we undertake.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <i className="fas fa-hands-helping text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
                  </div>
                  <h4 className="font-bold mb-2">Impact</h4>
                  <p className="text-gray-400">
                    Your project directly supports STEM education and helps cultivate tomorrow's technology leaders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Team Section */}
        <div className="mb-16 reveal">
          {/* Reduced mb-24 to mb-16 */}
          <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Our Team</h3>
          {/* Reduced mb-12 to mb-8 */}
          <div className="grid md:grid-cols-3 gap-8">
            <TeamMemberCard 
              name="Ryan Latimer"
              role="Lead Developer"
              description="Specializing in React and modern JavaScript frameworks. Focused on building scalable web applications and mentoring fellow team members in software development best practices."
            />
            
            <TeamMemberCard 
              name="Gavin Moceri"
              role="Backend Developer"
              description="Experienced in Node.js and database architecture. Passionate about creating efficient server-side solutions and implementing secure authentication systems."
            />
            
            <TeamMemberCard 
              name="Conner Breckenfeld"
              role="UI/UX Designer"
              description="Brings a detail-oriented approach to user interface design. Skilled in Figma and modern design systems, focusing on creating intuitive and accessible web experiences."
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
