import React, { useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';

const MobileMenu = ({ isOpen, closeMenu }) => {
  const menuLinks = [
    { to: "#capabilities", text: "Capabilities" },
    { to: "#about", text: "About" },
    { to: "#services", text: "Services" },
    { to: "#work", text: "Portfolio" },
    { to: "#contact", text: "Contact" }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-dark/90 backdrop-blur-xl transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeMenu}
      />

      {/* Content */}
      <div className={`relative h-full flex flex-col items-center justify-center p-8 transition-all duration-500 ${
        isOpen ? 'translate-y-0' : '-translate-y-8'
      }`}>
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-primary-500/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)]"></div>
        </div>

        {/* Menu Items */}
        <nav className="relative z-10 w-full max-w-md">
          <ul className="space-y-6">
            {menuLinks.map((link, index) => (
              <li 
                key={index}
                className={`transform transition-all duration-500 delay-${index * 100} ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <HashLink 
                  smooth 
                  to={link.to}
                  onClick={closeMenu}
                  className="relative block text-2xl md:text-3xl font-bold text-white/90 hover:text-white transition-colors duration-300 group"
                >
                  <span className="relative">
                    {link.text}
                    <span className="absolute left-0 right-0 bottom-0 h-px transform scale-x-0 transition-transform duration-300 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:scale-x-100"></span>
                  </span>
                </HashLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Links */}
        <div className={`absolute bottom-8 flex items-center gap-6 transition-all duration-500 delay-500 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <a 
            href="https://github.com/yourusername" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors duration-300"
            aria-label="GitHub"
          >
            <i className="fab fa-github text-2xl"></i>
          </a>
          <a 
            href="https://linkedin.com/in/yourusername" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin text-2xl"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
