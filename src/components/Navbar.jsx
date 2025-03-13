import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const scrollDelta = currentScroll - lastScroll;
      
      // Show/hide navbar based on scroll direction
      if (currentScroll > 50) {
        if (scrollDelta > 0 && !hidden) {
          setHidden(true);
        } else if (scrollDelta < 0 && hidden) {
          setHidden(false);
        }
      } else {
        setHidden(false);
      }
      
      setScrolled(currentScroll > 50);
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll, hidden]);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-dark/85 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
        } ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <HashLink 
              smooth 
              to="#" 
              className="flex items-center space-x-3 group"
              onClick={closeMenu}
            >
              <div className="relative w-12 h-12 lg:w-16 lg:h-16 transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 animate-pulse-slow"></div>
                <img 
                  src="/src/assets/images/Logo-nobg-sm.png" 
                  alt="" 
                  className="relative w-full h-full" 
                />
              </div>
              <div className="flex items-center space-x-2">
                <img 
                  src="/src/assets/images/Bluesky_Logo.png" 
                  alt="Bluesky Logo" 
                  className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
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
                className="ml-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium 
                  hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 
                  active:translate-y-0 active:shadow-none
                  transition-all duration-300"
              >
                Contact
              </HashLink>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden relative w-10 h-10 focus:outline-none group"
              onClick={() => {
                setMenuOpen(!menuOpen);
                document.body.style.overflow = !menuOpen ? 'hidden' : '';
              }}
              aria-label="Toggle menu"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-5">
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ${
                  menuOpen ? 'top-2 -rotate-45' : 'top-0'
                }`}></span>
                <span className={`absolute w-6 h-0.5 bg-white top-2 transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ${
                  menuOpen ? 'top-2 rotate-45' : 'top-4'
                }`}></span>
              </div>
              <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                menuOpen ? 'bg-white/10' : 'group-hover:bg-white/5'
              }`}></div>
            </button>
          </div>
        </div>
      </nav>
      
      <MobileMenu isOpen={menuOpen} closeMenu={closeMenu} />
    </>
  );
};

// NavLink component with enhanced hover effects
const NavLink = ({ to, children }) => (
  <HashLink 
    smooth 
    to={to} 
    className="relative px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors duration-300 group"
  >
    {children}
    <span className="absolute inset-x-3 bottom-1.5 h-px bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
  </HashLink>
);

export default Navbar;
