import React from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import Monogram from "./Monogram";

const TimelineItem = ({ year, title, description }) => (
  <div className="relative pl-8 pb-12 group">
    <div className="absolute left-[-5px] w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
      <div className="absolute -inset-2 rounded-full border border-primary-500/30 group-hover:border-primary-500/60 transition-colors duration-300"></div>
      <div className="absolute -inset-4 rounded-full border border-primary-500/20 group-hover:border-primary-500/40 transition-colors duration-300"></div>
    </div>
    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 to-secondary-500/50"></div>
    <div className="group-hover:translate-x-1 transition-transform duration-300">
      <h4 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
        {year}
      </h4>
      <p className="text-xl font-medium text-white mb-1">{title}</p>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
        {description}
      </p>
    </div>
  </div>
);

const TeamMemberCard = ({ name, role, description }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
    <div className="relative flex flex-col h-full glass-morphism p-6 rounded-xl border border-white/5 transition-all duration-500 group-hover:translate-y-[-2px]">
      {/* Use Monogram instead of image */}
      <div className="relative mb-6 mx-auto">
        <Monogram name={name} size="lg" className="mx-auto" />
      </div>

      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          {name}
        </h3>
        <p className="text-gray-400 mt-1">{role}</p>
      </div>

      <p className="text-gray-300 text-center flex-grow">{description}</p>
    </div>
  </div>
);

const About = () => {
  useScrollReveal();

  return (
    <section
      id="about"
      className="py-20 bg-black relative overflow-hidden scroll-mt-16"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/5 rounded-full animate-spin-slow-reverse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 border border-white/5 animate-spin-slow"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Who We Are section */}
          <div className="text-center mb-12 reveal">
            <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">
              Who We Are
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Student Developers. Real Solutions.
            </h2>
            <p className="text-lg text-gray-300">
              We're more than just a web development team – we're Harbor Springs High School students
              passionate about technology and innovation, putting our skills to
              work while supporting STEM education in Northern Michigan.
            </p>
          </div>

          {/* Story & Mission sections */}
          <div className="grid md:grid-cols-2 gap-8 reveal">
            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Our Story
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Avexel represents the intersection of competitive robotics and
                professional web development. What began as a vision to channel
                our technical expertise into meaningful digital solutions has
                evolved into something greater.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Today, we blend our engineering mindset with creative design to
                deliver websites that truly perform. Each project we complete
                not only serves our clients but also helps sustain the STEM
                education around us.
              </p>
            </div>

            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Our Mission
              </h3>
              <p className="text-gray-400 leading-relaxed">
                We're dedicated to crafting exceptional digital experiences with
                purpose. Every line of code we write serves two essential goals:
                delivering outstanding value to our clients and supporting the
                next generation of technology innovators.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                When you partner with Avexel, you're not just launching a
                website—you're helping fuel technological education and
                innovation that extends far beyond your project.
              </p>
            </div>
          </div>

          {/* Why Choose Us section */}
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
                    We leverage cutting-edge tools and frameworks to build fast,
                    responsive, and secure websites that stand out.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <i className="fas fa-heart text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
                  </div>
                  <h4 className="font-bold mb-2">Passion for Excellence</h4>
                  <p className="text-gray-400">
                    Our competitive robotics background drives us to pursue
                    perfection in every project we undertake.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <i className="fas fa-hands-helping text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
                  </div>
                  <h4 className="font-bold mb-2">Impact</h4>
                  <p className="text-gray-400">
                    Your project directly supports STEM education and helps
                    cultivate tomorrow's technology leaders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16 reveal">
          <h3 className="text-3xl mt-5 font-bold mb-8 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Team
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

        {/* Timeline Section - Reverted to original */}
        <div className="mt-20 reveal">
          <h3 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Journey
          </h3>
          <div className="max-w-3xl mx-auto">
            <TimelineItem
              year="2024"
              title="Avexel is conceptualized"
              description="As team members of FRC Team 7790, we wanted to find a way to support our robotics team while making use of our web development skills."
            />
            <TimelineItem
              year="2025"
              title="FRC7790.com Is Created"
              description="Our opening website, created to build a platform for our robotics team to showcase our team, attract sponsors, and provide a useful reservoir of information on FRC Events, Teams, and more."
            />
            <TimelineItem
              year="Present"
              title="Expansion"
              description="We are continuing to expand our robotics teams website, our business, and our impact to meaningful ideas."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
