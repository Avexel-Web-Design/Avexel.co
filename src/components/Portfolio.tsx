import React from "react";
import useScrollReveal from "../hooks/useScrollReveal";

const ProjectCard = ({ title, description, image, tags, websiteUrl, caseStudyUrl }) => (
  <div className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-neon-purple/50 transition-all duration-500">
    <div className="grid md:grid-cols-2 gap-0">
      {/* Image Side */}
      <div className="relative h-64 md:h-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 md:hidden"></div>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content Side */}
      <div className="p-8 md:p-10 flex flex-col justify-center relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/70 bg-white/5 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-neon-purple transition-colors">
            {title}
          </h3>

          <p className="text-gray-400 leading-relaxed mb-8">
            {description}
          </p>

          <div className="flex flex-wrap gap-4">
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-neon-purple hover:text-white transition-colors"
              >
                Visit Website
              </a>
            )}
            {caseStudyUrl && (
              <a
                href={caseStudyUrl}
                className="px-6 py-3 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                View Case Study
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Portfolio = () => {
  useScrollReveal();

  return (
    <section id="work" className="py-32 relative">
      <div className="container mx-auto px-6">

        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="text-neon-purple font-bold tracking-widest text-sm uppercase mb-4 block">Portfolio</span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-white">Projects</span>
          </h2>
          <p className="text-gray-400 text-lg">
            A collection of digital experiences we've crafted.
          </p>
        </div>

        <div className="space-y-12">
          <ProjectCard
            title="FRC Team 7790"
            description="An interactive website for Baywatch Robotics showcasing our team, robot designs, competition history, and STEM outreach programs."
            tags={["Charity", "STEM", "Robotics"]}
            image="/baywatchLogo.png"
            websiteUrl="https://frc7790.com"
            caseStudyUrl=""
          />
          <ProjectCard
            title="Nadia Elmagrabi"
            description="A transformative spiritual wellness website offering Human Design readings and Past Life Regression therapy."
            tags={["Wellness", "Design", "E-Commerce"]}
            image="/Nadia.jpg"
            websiteUrl="https://nadia-elmagrabi.pages.dev"
            caseStudyUrl=""
          />
          <ProjectCard
            title="Harbor Soccer Inc."
            description="A comprehensive website for Harbor Springs' youth soccer organization, featuring registration systems and event calendars."
            tags={["Non-Profit", "Sports", "Community"]}
            image="/HarborSoccerLogo.png"
            websiteUrl="https://harborsoccerinc.com"
            caseStudyUrl=""
          />
          <ProjectCard
            title="Northland Surveying"
            description="A professional website for Northern Michigan's trusted surveying company, showcasing services and credentials."
            tags={["Professional", "Business"]}
            image="/NorthlandLogo.png"
            websiteUrl="https://northlandsm.com"
            caseStudyUrl=""
          />
        </div>

        <div className="mt-24 text-center">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue">
            <div className="bg-black rounded-full px-8 py-4">
              <p className="text-white text-lg font-medium">
                Want to see your project here? <a href="#contact" className="text-neon-blue hover:underline ml-2">Let's talk.</a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Portfolio;
