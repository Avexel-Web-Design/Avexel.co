import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav 
        id="navbar" 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-dark/85 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        }`}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <HashLink 
              smooth 
              to="#" 
              className="flex items-center space-x-3 group"
              aria-label="Go to homepage"
            >
              <img 
                src="/src/assets/images/Logo-nobg-sm.png" 
                alt="" 
                className="w-12 h-12 lg:w-16 lg:h-16 transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="flex items-center space-x-2">
                <img 
                  src="/src/assets/images/Bluesky_Logo.png" 
                  alt="Bluesky Logo" 
                  className="w-5 h-5 object-contain" 
                />
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Avexel
                </span>
              </div>
            </HashLink>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink to="#capabilities">Capabilities</NavLink>
              <NavLink to="#about">About</NavLink>
              <NavLink to="#services">Services</NavLink>
              <NavLink to="#work">Portfolio</NavLink>
              <HashLink 
                smooth 
                to="#contact"
                className="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium hover:shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300"
              >
                Contact
              </HashLink>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              id="menu-btn" 
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 w-6 h-0.5 bg-white transition-transform duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2.5' : ''
                }`}></span>
                <span className={`absolute inset-0 w-6 h-0.5 bg-white transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : 'translate-y-2'
                }`}></span>
                <span className={`absolute inset-0 w-6 h-0.5 bg-white transition-transform duration-300 ${
                  menuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>
      
      <MobileMenu isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
    </>
  );
};

// NavLink component for consistent styling
const NavLink = ({ to, children }) => (
  <HashLink 
    smooth 
    to={to} 
    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/10"
  >
    {children}
  </HashLink>
);

export default Navbar;
