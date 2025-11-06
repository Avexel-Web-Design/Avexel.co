import React from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import Monogram from "./Monogram";
import PixelCard from "./PixelCard";
import AnimatedOrb from "./AnimatedOrb";
import AnimatedStepper from "./AnimatedStepper";

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
    <PixelCard className="relative flex flex-col h-full p-6 transition-all duration-500 group-hover:translate-y-[-4px]">
      {/* Use Monogram instead of image */}
      <div className="relative mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
        <Monogram name={name} size="lg" className="mx-auto" />
        {/* Add floating orb behind monogram */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <AnimatedOrb size="lg" hue={Math.random() * 60 + 220} hoverIntensity={0.1} forceHoverState={false} />
        </div>
      </div>

      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
          {name}
        </h3>
        <p className="text-gray-400 mt-1 group-hover:text-gray-300 transition-colors duration-300">{role}</p>
      </div>

      <p className="text-gray-300 text-center flex-grow group-hover:text-gray-200 transition-colors duration-300">{description}</p>
      
      {/* Add subtle animated accent */}
      <div className="mt-4 w-12 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100"></div>
    </PixelCard>
  </div>
);

const About = () => {
  useScrollReveal();

  return (
    <section
      id="about"
      className="py-20 bg-black relative overflow-hidden scroll-mt-16"
    >      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/5 rounded-full animate-spin-slow-reverse"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 border border-white/5 animate-spin-slow"></div>

      {/* Floating Orbs */}
      <div className="absolute top-1/6 right-1/8 opacity-15">
        <AnimatedOrb size="sm" hue={240} hoverIntensity={0.1} />
      </div>
      <div className="absolute bottom-1/4 left-1/12 opacity-20">
        <AnimatedOrb size="md" hue={280} hoverIntensity={0.15} />
      </div>

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
              passionate about technology and innovation.
            </p>
          </div>

          {/* Story & Mission sections */}
          <div className="grid md:grid-cols-2 gap-8 reveal">
            <div className="glass-morphism p-8 rounded-xl border border-white/5">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Our Story
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Our business began as a way to raise money to further our local FIRST® Robotics Team. Now its become so much more. From building charity websites for local causes to creating innovative solutions to businesses who otherwise would not have the oppurtunity to create a website, we are dedicated to making a difference in our community through technology.
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
                purpose. Everything we do it so serve you and further your business and to support our local robotics team. Our mission is to build websites better, faster, and cheaper than anyone else, while doing it with a passion and real cause behind it. We aren't a corporation who wants your money and your data, trapping you into subscriptions and fees. We are people who want to help you and your business succeed.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                When you partner with Avexel, you're not just launching a
                website—you're supporting real causes, and partnering with a team of people who care.
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
                    We leverage cutting-edge tools so that your website is up to date, and stays that way. We work to ensure that even though our end may be complicated, your website is easy to use and maintain so that you can focus on your business.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <i className="fas fa-heart text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"></i>
                  </div>
                  <h4 className="font-bold mb-2">Low Cost</h4>
                  <p className="text-gray-400">
                    The web development industry has become bloated by high costs that are justified by arbitrary ideas. We don't do that. This isn't for the money. This is to make a difference. Our websites are and always will be affordable to anyone who wants one, because a web presence shouldn't only be for those who can afford it.
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
        </div>        {/* Timeline Section - Enhanced with Stepper */}
        <div className="mt-20 reveal">
          <h3 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Journey
          </h3>
          
          <div className="max-w-4xl mx-auto">            <AnimatedStepper
              autoPlay={true}
              autoPlayInterval={5000}
              steps={[
                {
                  title: "The Beginning",
                  content: (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-primary-400">2024</span>
                        <div className="h-px bg-gradient-to-r from-primary-500 to-transparent flex-1"></div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        As team members of FRC Team 7790, we wanted to find a way to support our robotics team while making use of our web development skills. Avexel was conceptualized as more than just a business—it's our way of giving back.
                      </p>
                      <div className="flex items-center gap-2 text-primary-400 text-sm">
                        <i className="fas fa-lightbulb"></i>
                        <span>Conceptualization & Vision</span>
                      </div>
                    </div>
                  )
                },
                {
                  title: "First Success",
                  content: (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-primary-400">2025</span>
                        <div className="h-px bg-gradient-to-r from-primary-500 to-transparent flex-1"></div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        Our opening website, FRC7790.com, was created to build a platform for our robotics team to showcase our accomplishments, attract sponsors, and provide a useful repository of information on FRC Events, Teams, and more.
                      </p>
                      <div className="flex items-center gap-2 text-primary-400 text-sm">
                        <i className="fas fa-rocket"></i>
                        <span>First Major Project Launch</span>
                      </div>
                    </div>
                  )
                },
                {
                  title: "Expansion",
                  content: (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-primary-400">Present</span>
                        <div className="h-px bg-gradient-to-r from-primary-500 to-transparent flex-1"></div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        We are continuing to expand our robotics team's website, our business capabilities, and our impact on meaningful projects. Each new website we create helps fund our STEM education while serving our community.
                      </p>
                      <div className="flex items-center gap-2 text-primary-400 text-sm">
                        <i className="fas fa-chart-line"></i>
                        <span>Growing Impact & Reach</span>
                      </div>
                    </div>
                  )
                },
                {
                  title: "The Future",
                  content: (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-primary-400">Beyond</span>
                        <div className="h-px bg-gradient-to-r from-primary-500 to-transparent flex-1"></div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        Our vision extends beyond just creating websites. We aim to be a bridge between technology and community, helping local businesses thrive while inspiring the next generation of innovators and problem-solvers.
                      </p>
                      <div className="flex items-center gap-2 text-primary-400 text-sm">
                        <i className="fas fa-star"></i>
                        <span>Vision & Innovation</span>
                      </div>
                    </div>
                  )
                }
              ]}
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
