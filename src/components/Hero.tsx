import React from "react";
import { HashLink } from "react-router-hash-link";
import useScrollReveal from "../hooks/useScrollReveal";

const Hero = () => {
  useScrollReveal();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      aria-label="Hero section"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[120px] animate-pulse-glow"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tighter leading-[0.9]">
            <span className="block text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">Websites that</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-white to-neon-blue neon-text">
              Make a Difference
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Local Harbor Springs students creating innovative web experiences.
            We transform your digital presence while supporting the future of STEM.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <HashLink
              smooth
              to="#quote"
              className="btn-primary group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Your Quote
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </HashLink>

            <HashLink
              smooth
              to="#work"
              className="px-8 py-3 rounded-full font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              View Our Work
            </HashLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
