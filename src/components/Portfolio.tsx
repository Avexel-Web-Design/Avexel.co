import React from "react";
import useScrollReveal from "../hooks/useScrollReveal";

const ProjectCard = ({ title, description, image, tags, websiteUrl, caseStudyUrl }) => (
  <div className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-neon-purple/50 transition-all duration-500">
    {/* Image */}
    <div className="relative aspect-square overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    </div>

    {/* Content */}
    <div className="p-6 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white/70 bg-white/5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm bg-white text-black font-bold rounded-full hover:bg-neon-purple hover:text-white transition-colors"
            >
              Visit Website
            </a>
          )}
          {caseStudyUrl && (
            <a
              href={caseStudyUrl}
              className="px-4 py-2 text-sm border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
            >
              Case Study
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Portfolio = () => {
  useScrollReveal();

  return (
    <section id="work" className="py-32 relative snap-start">
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

        <div className="grid md:grid-cols-2 gap-8">
          <ProjectCard
            title="FRC Team 7790"
            description="An interactive website for Baywatch Robotics showcasing our team, robot designs, competition history, and STEM outreach programs."
            tags={["Charity", "STEM", "Robotics"]}
            image="/baywatchLogo.png"
            websiteUrl="https://frc7790.com"
            caseStudyUrl=""
          />
          <ProjectCard
            title="Detroit Rising Development"
            description="A professional website for Detroit Rising Development showcasing services and credentials."
            tags={["Professional", "Business", "Real Estate"]}
            image="/DetroitRising.png"
            websiteUrl="https://detroitrisingdevelopment.pages.dev"
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
            title="Nadia Elmagrabi"
            description="A comprehensive portfolio website for Nadia Elmagrabi, showcasing her portfolio and services."
            tags={["Portfolio"]}
            image="/Nadia.jpg"
            websiteUrl="https://nadia-elmagrabi.pages.dev"
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
