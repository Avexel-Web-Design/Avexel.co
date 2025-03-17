// src/components/Footer.jsx
import React from 'react';
import { HashLink } from 'react-router-hash-link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/src/assets/images/Logo-nobg-sm.png" alt="" className="w-10 h-10" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Avexel
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Crafting exceptional digital experiences through innovative web design and development.
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
                  About Us
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

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
            <div className="flex items-center gap-4">
              <a 
                href="https://avexel.bsky.social" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors duration-300"
              >
                <img 
                  src="/src/assets/images/Bluesky_Logo.png" 
                  alt="Bluesky" 
                  className="w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span>Bluesky</span>
              </a>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                aria-label="GitHub"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
              <a 
                href="https://linkedin.com/in/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} Avexel. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;