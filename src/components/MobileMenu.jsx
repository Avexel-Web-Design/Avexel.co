import React, { useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';

const MobileMenu = ({ isOpen, closeMenu }) => {
  const menuRef = useRef(null);
  const menuLinks = [
    { to: "#capabilities", text: "Capabilities" },
    { to: "#about", text: "About" },
    { to: "#services", text: "Services" },
    { to: "#work", text: "Portfolio" },
    { to: "#contact", text: "Contact" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeMenu]);

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop with blur and gradient */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 backdrop-blur-lg bg-dark/90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-secondary-500/5 to-primary-500/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)]"></div>
      </div>

      {/* Menu Content */}
      <div 
        ref={menuRef}
        className={`relative h-full flex flex-col items-center justify-center p-8 transition-all duration-500 ${
          isOpen ? 'translate-y-0' : '-translate-y-8'
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-300"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <div className="relative w-full h-full">
            <span className="absolute top-1/2 left-1/2 w-5 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45"></span>
            <span className="absolute top-1/2 left-1/2 w-5 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></span>
          </div>
        </button>

        {/* Menu Links */}
        <nav className="w-full max-w-md">
          <ul className="space-y-6">
            {menuLinks.map((link, index) => (
              <li 
                key={link.to}
                className={`transform transition-all duration-500 delay-${index * 100} ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <HashLink 
                  smooth 
                  to={link.to}
                  onClick={closeMenu}
                  className="relative block text-2xl md:text-3xl font-bold text-white/90 hover:text-white transition-all duration-300 group"
                >
                  <div className="relative inline-block">
                    {link.text}
                    <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-primary-500 to-secondary-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
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
            href="https://avexel.bsky.social" 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
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
