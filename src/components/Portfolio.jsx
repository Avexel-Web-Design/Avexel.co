import React, { useState, useEffect } from "react";
import useScrollReveal from "../hooks/useScrollReveal";

const ProjectCard = ({
  title,
  description,
  image,
  tags,
  websiteUrl,
  caseStudyUrl,
  orientation = "right",
  teamName = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Observer effect to detect when card comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    const currentElement = document.getElementById(
      `project-${title.replace(/\s+/g, "-").toLowerCase()}`
    );
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.disconnect();
    };
  }, [title]);

  return (
    <div
      id={`project-${title.replace(/\s+/g, "-").toLowerCase()}`}
      className={`group relative reveal transition-all duration-1000 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced border glow effect with pulsing animation */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-30 group-hover:opacity-100 group-hover:blur-md transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-2xl opacity-70 animate-pulse-slow"></div>
      </div>

      <div className="relative bg-dark/70 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl group-hover:border-white/20 transition-all duration-500">
        <div className="flex flex-col md:flex-row md:items-stretch gap-6 md:gap-10 p-6 sm:p-8 lg:p-10">
          {/* Enhanced image section - improved image display */}
          <div
            className={`relative w-full md:w-5/12 ${
              orientation === "left" ? "md:order-1" : "md:order-2"
            }`}
          >
            <div className="relative aspect-video md:aspect-square overflow-hidden rounded-xl shadow-xl">
              {/* Improved gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 group-hover:opacity-0 transition-opacity duration-700 z-10"></div>
              <div
                className={`absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent ${
                  isHovered ? "opacity-0" : "opacity-70"
                } transition-opacity duration-700 z-10`}
              ></div>

              {/* Enhanced image presentation with better object-fit handling */}
              <div className="absolute inset-0 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={image}
                  alt={title}
                  className={`max-w-full max-h-full w-auto h-auto object-contain transition-all duration-1000 ease-out ${
                    isHovered
                      ? "scale-110 filter saturate-100"
                      : "scale-100 filter saturate-75"
                  }`}
                />
              </div>

              {/* Enhanced corner accents with gradients */}
              <div
                className={`absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary-400/70 rounded-tl opacity-0 group-hover:opacity-100 transition-all duration-700 ${
                  isHovered ? "scale-100" : "scale-50"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-transparent rounded-tl"></div>
              </div>
              <div
                className={`absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-secondary-400/70 rounded-br opacity-0 group-hover:opacity-100 transition-all duration-700 ${
                  isHovered ? "scale-100" : "scale-50"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-tl from-secondary-400/20 to-transparent rounded-br"></div>
              </div>

              {/* Team name overlay with improved styling */}
              {teamName && (
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-dark to-transparent flex flex-col justify-end p-6 ${
                    isHovered ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-700 z-20`}
                >
                  <span className="text-white/90 text-sm font-medium bg-dark/60 backdrop-blur-sm px-3 py-1 rounded-full inline-block w-fit">
                    <span className="mr-1 opacity-70">by</span> {teamName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced content section with improved typography and spacing */}
          <div
            className={`flex flex-col justify-center w-full md:w-7/12 ${
              orientation === "left" ? "md:order-2" : "md:order-1"
            }`}
          >
            <div className="mb-4">
              {/* Enhanced title with stronger gradient */}
              <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent group-hover:scale-105 origin-left transition-transform duration-500 mb-4 drop-shadow-sm">
                {title}
              </h3>

              {/* Enhanced tag styling with sequential animation */}
              <div className="flex flex-wrap gap-2 my-4">
                {tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-primary-500/10 text-primary-300 rounded-full border border-primary-500/20 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 transition-all duration-500"
                    style={{
                      transitionDelay: `${index * 70}ms`,
                      transform: isHovered
                        ? "translateY(-3px)"
                        : "translateY(0)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Enhanced description with better typography */}
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors duration-500 mb-6 text-base sm:text-lg">
              {description}
            </p>

            {/* Enhanced buttons with improved hover effects */}
            <div className="flex flex-wrap gap-4 mt-auto pt-2">
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold overflow-hidden shadow-lg hover:shadow-primary-500/40"
                >
                  {/* Enhanced gradient overlay with smoother transition */}
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out"></span>

                  {/* Enhanced light reflection effect */}
                  <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-40 transition-opacity duration-300">
                    <span className="absolute inset-0 translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent group-hover/btn:animate-shimmer"></span>
                  </span>

                  <span className="relative">Visit Website</span>
                  <svg
                    className="w-4 h-4 relative transition-transform duration-300 group-hover/btn:translate-x-1"
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
                </a>
              )}

              {caseStudyUrl && (
                <a
                  href={caseStudyUrl}
                  className="group/btn relative inline-flex items-center gap-2 px-6 py-3 border border-secondary-500 text-secondary-400 rounded-full font-semibold overflow-hidden hover:text-white transition-colors duration-300"
                >
                  <span className="absolute inset-0 bg-secondary-500/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></span>
                  <span className="relative">Case Study</span>
                  <svg
                    className="w-4 h-4 relative transition-transform duration-300 group-hover/btn:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M17 8L21 12M21 12L17 16M21 12H3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
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
    <section
      id="work"
      className="py-24 bg-black relative overflow-hidden scroll-mt-16"
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 border border-white/5 rounded-full animate-spin-slow"></div>
      <div className="absolute bottom-1/3 left-1/5 w-64 h-64 border border-white/5 animate-spin-slow-reverse"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 reveal">
          <span className="inline-block text-xs uppercase tracking-widest text-primary-400 font-medium border-b border-primary-500/30 pb-1 mb-4">
            Our Work
          </span>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Take a look at some of the websites we've crafted for local
            businesses while supporting our robotics journey.
          </p>
        </div>

        <div className="grid gap-12 reveal">
          
          <ProjectCard
            title="FRC Team 7790 Website"
            description="An interactive website for Baywatch Robotics showcasing our team, robot designs, competition history, and STEM outreach programs. Features include a team member directory, sponsorship information, and resources for aspiring robotics enthusiasts."
            tags={[]}
            image="/baywatchLogo.png"
            websiteUrl="https://frc7790.com"
            teamName="Baywatch Robotics"
          />
          {/* Placeholder for future projects */}
          <div className="relative glass-morphism p-10 rounded-xl border border-white/5 text-center reveal">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Your Project Could Be Next
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We're constantly expanding our portfolio with new projects.
              Contact us to discuss how we can bring your vision to life.
            </p>
          </div>
        </div>

        <div className="text-center mt-16 reveal">
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Every project supports our robotics team while delivering value to
            local businesses. Want to be our next success story?
          </p>
          <a
            href="#contact"
            className="inline-block px-10 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-primary-500/10"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
