import React from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import Monogram from "./Monogram";

const TimelineItem = ({ year, title, description, icon }) => (
  <div className="relative pl-8 pb-12 group last:pb-0">
    {/* Vertical Line */}
    <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-neon-purple/50 to-neon-blue/50 group-last:hidden"></div>

    {/* Dot */}
    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-black border border-neon-purple/50 group-hover:border-neon-purple transition-colors duration-300 flex items-center justify-center z-10">
      <div className="w-2 h-2 rounded-full bg-neon-purple group-hover:animate-pulse-glow"></div>
    </div>

    <div className="group-hover:translate-x-2 transition-transform duration-300">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl font-bold text-neon-purple font-outfit">{year}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-neon-purple/30 to-transparent"></div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-white/5 hover:border-neon-purple/30 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-3">
          <i className={`fas ${icon} text-neon-blue`}></i>
          <h4 className="text-xl font-bold text-white font-outfit">{title}</h4>
        </div>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const TeamMemberCard = ({ name, role, description }) => (
  <div className="group relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-blue rounded-2xl blur opacity-20 group-hover:opacity-75 transition duration-500"></div>
    <div className="glass-card relative flex flex-col h-full p-8 rounded-2xl transition-all duration-500 group-hover:-translate-y-2">
      <div className="relative mb-8 mx-auto group-hover:scale-110 transition-transform duration-300">
        <Monogram name={name} size="lg" className="mx-auto ring-2 ring-neon-purple/30 group-hover:ring-neon-purple transition-all duration-300" />
        <div className="absolute inset-0 bg-neon-purple/20 blur-xl rounded-full -z-10 group-hover:opacity-100 transition-opacity duration-300 opacity-0"></div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white font-outfit mb-2 group-hover:text-neon-blue transition-colors duration-300">
          {name}
        </h3>
        <p className="text-neon-purple font-medium tracking-wide uppercase text-sm">{role}</p>
      </div>

      <p className="text-gray-400 text-center leading-relaxed flex-grow group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
);

const About = () => {
  useScrollReveal();

  return (
    <section id="about" className="py-32 bg-[#050505] relative overflow-hidden snap-start">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 reveal">
            <span className="inline-block text-sm font-bold text-neon-purple uppercase mb-4">
              Who We Are
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-outfit">
              Student Developers. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
                Real Solutions.
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We're more than just a web development team – we're Harbor Springs High School students
              passionate about technology and innovation.
            </p>
          </div>

          {/* Mission & Story Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-24 reveal">
            <div className="glass-panel p-10 rounded-2xl border border-white/5 hover:border-neon-purple/30 transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-white mb-4 font-outfit group-hover:text-neon-purple transition-colors duration-300">
                Our Story
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Our business began as a way to raise money to further our local FIRST® Robotics Team. Now it's become so much more. From building charity websites for local causes to creating innovative solutions for businesses, we are dedicated to making a difference.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Today, we blend our engineering mindset with creative design to deliver websites that truly perform.
              </p>
            </div>

            <div className="glass-panel p-10 rounded-2xl border border-white/5 hover:border-neon-blue/30 transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-white mb-4 font-outfit group-hover:text-neon-blue transition-colors duration-300">
                Our Mission
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                We're dedicated to crafting exceptional digital experiences with purpose. Our mission is to build websites better, faster, and cheaper than anyone else, while doing it with a passion and real cause behind it.
              </p>
              <p className="text-gray-400 leading-relaxed">
                When you partner with Avexel, you're not just launching a website—you're supporting real causes and partnering with a team that cares.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-32 reveal">
            <div className="glass-panel p-12 rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl"></div>

              <h3 className="text-3xl font-bold text-white text-center mb-12 font-outfit">Why Choose Us</h3>

              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                    <i className="fas fa-code text-3xl text-white"></i>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-outfit">Modern Technology</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Cutting-edge tools ensuring your website stays current, secure, and easy to maintain.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                    <i className="fas fa-heart text-3xl text-white"></i>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-outfit">Affordable Quality</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Premium web development made accessible. We believe a great web presence shouldn't break the bank.
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                    <i className="fas fa-hands-helping text-3xl text-white"></i>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-outfit">Community Impact</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Your project directly supports STEM education and cultivates tomorrow's technology leaders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-32 reveal">
            <h3 className="text-4xl font-bold text-center text-white mb-16 font-outfit">
              Meet The Team
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <TeamMemberCard
                name="Ryan Latimer"
                role="Lead Developer"
                description="Programming team lead on FRC 7790 with expertise in full-stack development. Specializes in React applications and creating responsive, intuitive user interfaces."
              />
              <TeamMemberCard
                name="Gavin Moceri"
                role="Technical Lead"
                description="Robotics software specialist with strong backend development skills. Experience with robot control systems translated into secure, efficient web architecture."
              />
              <TeamMemberCard
                name="Conner Breckenfeld"
                role="Design Specialist"
                description="Design team member bringing creative vision to both robot design and digital interfaces. Focused on creating accessible, visually engaging web experiences."
              />
            </div>
          </div>

          {/* Timeline Section */}
          <div className="reveal">
            <h3 className="text-4xl font-bold text-center text-white mb-16 font-outfit">
              Our Journey
            </h3>
            <div className="max-w-3xl mx-auto">
              <TimelineItem
                year="2024"
                title="The Beginning"
                icon="fa-lightbulb"
                description="As team members of FRC Team 7790, we wanted to find a way to support our robotics team while making use of our web development skills. Avexel was conceptualized as more than just a business—it's our way of giving back."
              />
              <TimelineItem
                year="2025"
                title="First Success"
                icon="fa-rocket"
                description="Our opening website, FRC7790.com, was created to build a platform for our robotics team to showcase our accomplishments, attract sponsors, and provide a useful repository of information."
              />
              <TimelineItem
                year="Present"
                title="Expansion"
                icon="fa-chart-line"
                description="We are continuing to expand our robotics team's website, our business capabilities, and our impact on meaningful projects. Each new website we create helps fund our STEM education."
              />
              <TimelineItem
                year="Beyond"
                title="The Future"
                icon="fa-star"
                description="Our vision extends beyond just creating websites. We aim to be a bridge between technology and community, helping local businesses thrive while inspiring the next generation of innovators."
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
