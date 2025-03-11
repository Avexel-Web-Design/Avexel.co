import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <nav id="navbar" className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/75 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <HashLink smooth to="#" className="flex items-center space-x-1">
            <img src="/src/assets/images/Logo-nobg-sm.png" alt="Avexel Logo" className="w-16 h-16" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Avexel</span>
          </HashLink>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            <li><HashLink smooth to="#capabilities" className="hover:text-purple-400 transition-colors">Capabilities</HashLink></li>
            <li><HashLink smooth to="#about" className="hover:text-purple-400 transition-colors">About</HashLink></li>
            <li><HashLink smooth to="#services" className="hover:text-purple-400 transition-colors">Services</HashLink></li>
            <li><HashLink smooth to="#work" className="hover:text-purple-400 transition-colors">Portfolio</HashLink></li>
          </ul>
          
          {/* Hamburger Button */}
          <button id="menu-btn" className="md:hidden focus:outline-none text-white" onClick={toggleMenu}>
            <i className={`fas ${menuOpen ? 'fa-times rotate-180' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </nav>
      
      <MobileMenu isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
