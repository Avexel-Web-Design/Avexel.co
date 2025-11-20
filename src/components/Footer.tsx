// src/components/Footer.jsx
import React from "react";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 bg-black border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-neon-purple/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/Logo-nobg-sm.png" alt="Avexel" className="w-12 h-12" />
              <span className="text-2xl font-bold text-white font-outfit tracking-wide">
                Avexel
              </span>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              A Harbor Springs student-led initiative by FRC Team 7790 members creating
              websites to fund our robotics activities while helping Northern Michigan
              businesses build their online presence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white font-outfit">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <HashLink
                  smooth
                  to="#about"
                  className="text-gray-400 hover:text-neon-purple transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-neon-purple transition-colors duration-300"></span>
                  Our Team
                </HashLink>
              </li>
              <li>
                <HashLink
                  smooth
                  to="#services"
                  className="text-gray-400 hover:text-neon-blue transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-neon-blue transition-colors duration-300"></span>
                  Services
                </HashLink>
              </li>
              <li>
                <HashLink
                  smooth
                  to="#work"
                  className="text-gray-400 hover:text-neon-purple transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-neon-purple transition-colors duration-300"></span>
                  Projects
                </HashLink>
              </li>
              <li>
                <a
                  href="https://FRC7790.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-blue transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-neon-blue transition-colors duration-300"></span>
                  FRC Team 7790
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white font-outfit">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-neon-purple/20 transition-colors duration-300">
                  <i className="fas fa-envelope-open text-gray-400 group-hover:text-neon-purple transition-colors duration-300 text-sm"></i>
                </div>
                <a
                  href="mailto:contact@avexel.co"
                  className="text-gray-400 hover:text-neon-purple transition-colors duration-300 mt-1"
                >
                  contact@avexel.co
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-neon-blue/20 transition-colors duration-300">
                  <i className="fas fa-phone-alt text-gray-400 group-hover:text-neon-blue transition-colors duration-300 text-sm"></i>
                </div>
                <a
                  href="tel:+12313738360"
                  className="text-gray-400 hover:text-neon-blue transition-colors duration-300 mt-1"
                >
                  +1 (231) 373-8360
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-neon-purple/20 transition-colors duration-300">
                  <i className="fas fa-map-marker-alt text-gray-400 group-hover:text-neon-purple transition-colors duration-300 text-sm"></i>
                </div>
                <span className="text-gray-400 mt-1">
                  Harbor Springs High School, 327 E Bluff Dr, Harbor Springs, MI 49740
                </span>
              </li>
              <li>
                <div className="flex items-center gap-4 pt-2">
                  <a
                    href="https://github.com/avexel-web-design"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-110"
                    aria-label="GitHub"
                  >
                    <i className="fab fa-github text-xl"></i>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © {currentYear} Avexel Web Design
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Created by</span>
              <span className="text-neon-blue font-medium">Harbor Springs FRC Team 7790</span>
              <span className="text-gray-500">students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
