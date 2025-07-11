import React from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import AnimatedStepper from "./AnimatedStepper";
import PixelCard from "./PixelCard";
import AnimatedOrb from "./AnimatedOrb";

// Updated glowing border with positioning fixes and reduced blur
const glowingBorderStyles = `
  @property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes spin {
    from {
      --angle: 0deg;
    }
    to {
      --angle: 360deg;
    }
  }

  .service-card {
    position: relative;
  }

  .service-card::after, 
  .service-card::before {
    content: '';
    position: absolute;
    height: calc(100% + 6px);
    width: calc(100% + 6px);
    background-image: conic-gradient(from var(--angle), 
      #1902a4, /* blue-500 */
      #ba60dc, /* indigo-600 */
      #1902a4  /* blue-500 */
    );
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    z-index: -1;
    border-radius: 12px;
    animation: 3s spin linear infinite;
  }

  .service-card::before {
    filter: blur(0.5rem);
    opacity: 0.5;
  }
  
  /* Glass morphism styling - without glowing borders */
  .glass-morphism {
    position: relative;
    background-color: rgba(0, 0, 0, 0.75);
  }
  
  .glass-morphism > div {
    position: relative;
    z-index: 1;
  }
`;

const ServiceCard = ({ icon, title, description, comingSoon = false }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: glowingBorderStyles }} />
      <PixelCard className="group service-card h-full">
        <div className="relative flex flex-col h-full bg-dark backdrop-blur-sm p-8 rounded-xl border border-white/5 transition-colors duration-300">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 animate-pulse-slow transition-opacity duration-300"></div>
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <i
                className={`fas ${icon} text-3xl bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
              ></i>
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                {title}
              </h3>
              {comingSoon && (
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-secondary-500/10 text-secondary-400 rounded-full border border-secondary-500/20 animate-pulse">
                  Coming Soon
                </span>
              )}
            </div>
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {description}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center text-primary-400 group-hover:text-primary-300 transition-colors duration-300">
              <span className="mr-2 font-medium">Learn more</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M13 5L20 12M20 12L13 19M20 12H4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </PixelCard>
    </>
  );
};

const ProcessStep = ({ number, title, description }) => (
  <div className="relative group">
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500"></div>
        <div className="relative w-16 h-16 rounded-full bg-dark flex items-center justify-center ring-1 ring-primary-500/30 group-hover:ring-primary-500/70 transition-all duration-300">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            {number}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          {title}
        </h4>
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>
    </div>
    {number < 4 && (
      <div className="hidden md:block absolute left-8 top-16 bottom-0 w-px bg-gradient-to-b from-primary-500/50 to-secondary-500/50"></div>
    )}
  </div>
);

const Services = () => {
  useScrollReveal();

  return (
    <section
      id="services"
      className="py-20 bg-black relative overflow-hidden scroll-mt-16"
    >      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/6 w-64 h-64 border border-white/5 animate-spin-slow"></div>
      <div className="absolute bottom-1/3 left-1/5 w-48 h-48 border border-white/5 rounded-full animate-spin-slow-reverse"></div>

      {/* Floating Orbs */}
      <div className="absolute top-1/3 left-1/12 opacity-15">
        <AnimatedOrb size="sm" hue={220} hoverIntensity={0.1} />
      </div>
      <div className="absolute bottom-1/4 right-1/8 opacity-20">
        <AnimatedOrb size="md" hue={260} hoverIntensity={0.15} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 reveal stagger-reveal">
          <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">
            Our Expertise
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Services We Provide
          </h2>
          <p className="text-lg text-gray-300">
            Professional web solutions crafted by passionate student developers, for the lowest prices and of the highest quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 reveal">
          <ServiceCard
            icon="fa-laptop-code"
            title="Website Creation"
            description="From concept to launch, we craft tailored websites that capture your unique vision. Our expertise ensures your site not only looks great but delivers an exceptional user experience across all devices, helping you establish a strong digital presence."
          />

          <ServiceCard
            icon="fa-paint-brush"
            title="Web Design"
            description="Every pixel matters. We create distinctive, purpose-driven designs that align with your brand identity and business goals. Our approach ensures that your website is meaningful to you and to your audience, ensuring commitment to what matters most to you."
          />

          <ServiceCard
            icon="fa-mobile-alt"
            title="Mobile App Development"
            description="Ready to take your business mobile? We're expanding into native iOS and Android development, helping you reach customers wherever they are. From concept validation to App Store launch, we'll guide you through the entire process."
            comingSoon={true}
          />

          <ServiceCard
            icon="fa-tools"
            title="Website Maintenance"
            description="Not everyone has the time or expertise to be a programmer. We offer ongoing support and maintenance services to keep your website up to date. We also provide an easy way for you to make changes to your site in seconds without ever touching code."
          />
        </div>        {/* Process Section with Enhanced Stepper */}
        <div className="mt-20 reveal">
          <h3 className="text-3xl font-bold mb-16 text-center bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Our Approach
          </h3>

          <div className="relative">            <AnimatedStepper
              autoPlay={false}
              steps={[
                {
                  title: "Discovery & Planning",
                  content: (
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        We begin by getting to know you and your business. We are people, and we value personal connections. We want to make sure that our partnership is everything you want it to be.
                      </p>
                      <div className="flex items-center gap-2 text-primary-400">
                        <i className="fas fa-lightbulb"></i>
                        <span className="text-sm">Understanding your vision and goals</span>
                      </div>
                    </div>
                  )
                },
                {
                  title: "Design & Collaboration",
                  content: (
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        We'll prototype an idea of a design, and initiate an ongoing dialogue with you to ensure that what we do fits with what you want. We value your input, and will never say no to your ideas.
                      </p>
                      <div className="flex items-center gap-2 text-primary-400">
                        <i className="fas fa-palette"></i>
                        <span className="text-sm">Collaborative design process</span>
                      </div>
                    </div>
                  )
                },
                {
                  title: "Development & Quality Assurance",
                  content: (
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        We are addicted to quality and perfection. Our team will work tirelessly to bring you a website that is not only functional and fitting for your business, but one that is flawless and long-lasting.
                      </p>
                      <div className="flex items-center gap-2 text-primary-400">
                        <i className="fas fa-code"></i>
                        <span className="text-sm">Clean, efficient, and tested code</span>
                      </div>
                    </div>
                  )
                },
                {
                  title: "Launch & Ongoing Support",
                  content: (
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        Once your website is ready and live, we don't just disappear. We offer ongoing support to ensure your site remains up-to-date, and provide ways for you to make changes without needing to know how to code.
                      </p>
                      <div className="flex items-center gap-2 text-primary-400">
                        <i className="fas fa-rocket"></i>
                        <span className="text-sm">Continued partnership and support</span>
                      </div>
                    </div>
                  )
                }
              ]}
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>

        {/* FRC Support Section */}
        <div className="mt-20 reveal">
          <div className="relative glass-morphism p-8 lg:p-12 rounded-xl border border-white/5">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Supporting FIRST Robotics
              </h3>
              <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
                Your partnership with us directly supports Baywatch Robotics
                (FRC Team 7790), a competitive high school robotics team from
                Harbor Springs, Michigan. Your project helps fund our robot
                parts, competition registration fees, travel expenses, and STEM
                outreach activities in our community. Our team is comprised solely of members of this team. Members who know that your support is what allows us to excel, and what has allowed us in the past to compete at an international level.
              </p>
            </div>

            <div className="flex justify-center mt-6">
              <a
                href="https://frc7790.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Visit Our Robotics Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
