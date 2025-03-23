// src/components/Footer.jsx
import React from "react";
import { HashLink } from "react-router-hash-link";
// Import the logo image
import logoImage from "/Logo-nobg-sm.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 bg-black border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Avexel" className="w-10 h-10" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Avexel
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              A Harbor Springs student-led initiative by FRC Team 7790 members creating
              websites to fund our robotics activities while helping Northern Michigan
              businesses build their online presence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <HashLink
                  smooth
                  to="#about"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  Our Team
                </HashLink>
              </li>
              <li>
                <HashLink
                  smooth
                  to="#services"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  Services
                </HashLink>
              </li>
              <li>
                <HashLink
                  smooth
                  to="#work"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  Projects
                </HashLink>
              </li>
              <li>
                <a
                  href="https://FRC7790.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  FRC Team 7790
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <i className="fas fa-envelope-open text-primary-400 mt-1"></i>
                <a
                  href="mailto:contact@avexel.co"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  contact@avexel.co
                </a>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-primary-400 mt-1"></i>
                <span className="text-gray-400">
                  Harbor Springs High School, 327 E Bluff Dr, Harbor Springs, MI 49740
                </span>
              </li>
              <li>
                <div className="flex items-center gap-4 pt-2">
                  <a
                    href="https://github.com/avexel-web-design"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
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
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} Avexel Web Design
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">Created by</span>
              <span className="text-primary-400">Harbor Springs FRC Team 7790</span>
              <span className="text-gray-500">students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
