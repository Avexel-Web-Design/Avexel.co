// src/components/Footer.jsx
import React from 'react';
import { HashLink } from 'react-router-hash-link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 bg-dark border-t border-white/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/src/assets/images/Logo-nobg-sm.png" alt="Avexel" className="w-10 h-10" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Avexel
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Our team transforms ideas into stunning digital experiences through creative design and thoughtful development.
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
                  Portfolio
                </HashLink>
              </li>
              <li>
                <HashLink 
                  smooth 
                  to="#contact" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  Contact
                </HashLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <i className="fas fa-envelope-open text-primary-400 mt-1"></i>
                <a href="mailto:contact@avexel.co" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                  contact@avexel.co
                </a>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-primary-400 mt-1"></i>
                <span className="text-gray-400">
                  Michigan, United States
                </span>
              </li>
              <li>
                <div className="flex items-center gap-4 pt-2">
                  <a 
                    href="https://github.com/avexel" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                    aria-label="GitHub"
                  >
                    <i className="fab fa-github text-xl"></i>
                  </a>
                  <a 
                    href="https://linkedin.com/company/avexel" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                    aria-label="LinkedIn"
                  >
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
                  <a 
                    href="https://avexel.bsky.social" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                    aria-label="BlueSky"
                  >
                    <img 
                      src="/src/assets/images/Bluesky_Logo.png" 
                      alt="BlueSky" 
                      className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
                    />
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
              © {currentYear} Avexel. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">Made with</span>
              <span className="text-primary-400">
                <i className="fas fa-heart text-xs"></i>
              </span>
              <span className="text-gray-500">by our team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;