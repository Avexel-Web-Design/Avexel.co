// src/components/Footer.jsx
import React from "react";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 bg-black border-t border-white/5 overflow-hidden snap-start">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Content - Centered */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <img src="/Logo-nobg-sm.png" alt="Avexel" className="w-12 h-12" />
            <span className="text-2xl font-bold text-white font-outfit tracking-wide">
              Avexel
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Student-led web design initiative by FRC Team 7790 members, creating websites for Northern Michigan businesses.
          </p>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a
              href="mailto:contact@avexel.co"
              className="text-gray-400 hover:text-neon-purple transition-colors duration-300"
            >
              contact@avexel.co
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="tel:+12313738360"
              className="text-gray-400 hover:text-neon-blue transition-colors duration-300"
            >
              +1 (231) 373-8360
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://github.com/avexel-web-design"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-neon-purple transition-colors duration-300"
            >
              GitHub
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://FRC7790.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-neon-blue transition-colors duration-300"
            >
              FRC Team 7790
            </a>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/5">
            <p className="text-gray-500 text-sm">
              © {currentYear} Avexel Web Design
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
