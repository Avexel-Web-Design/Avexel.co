import React from "react";
import { HashLink } from "react-router-hash-link";
import useScrollReveal from "../hooks/useScrollReveal";

const Hero = () => {
  useScrollReveal();

  return (
    <section
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-28 sm:pt-32 md:pt-28 pb-8 sm:pb-12"
      aria-label="Hero section"
    >
      {/* Enhanced background gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-secondary-500/3 to-primary-500/5 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.08),transparent_50%)]"></div>
      </div>

      {/* Centered content with improved impact */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 tracking-tight leading-tight">
            <span className="block mb-2">Websites that</span>
            <span className="block bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Make a Difference
            </span>
          </h1>

          <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto">
            Harbor Springs student developers creating websites while powering the
            next generation of STEM innovation through FIRST® Robotics Team
            7790.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <HashLink
              smooth
              to="#contact"
              className="w-full sm:w-auto px-6 xs:px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Start Your Project
            </HashLink>

            <HashLink
              smooth
              to="#work"
              className="w-full sm:w-auto px-6 xs:px-8 sm:px-10 py-3 sm:py-4 bg-white/5 rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300 mt-3 sm:mt-0"
            >
              View Our Work
            </HashLink>
          </div>
        </div>
      </div>

      {/* Mobile-friendly scroll indicator with better positioning */}
      <div
        className="absolute bottom-4 xs:bottom-6 sm:bottom-8 left-0 w-full flex justify-center animate-bounce-slow"
        aria-hidden="true"
      >
        <HashLink
          smooth
          to="#work"
          aria-label="Scroll down"
          className="text-white/50 hover:text-white/80 transition-colors p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </HashLink>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-16 sm:h-20 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
