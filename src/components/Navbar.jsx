import React, { useState, useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const navRef = useRef(null);

  // Detect active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 50);
      
      // Determine active section based on scroll position
      const sections = ['home', 'capabilities', 'about', 'services', 'work', 'contact'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && window.scrollY >= section.offsetTop - 200) {
          setActiveTab(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <div className={`fixed top-0 left-0 w-full flex justify-center z-50 transition-all duration-500 ${
        scrolled ? 'pt-4' : 'pt-8'
      }`}>
        <div 
          ref={navRef}
          className={`relative glass-morphism-nav rounded-full border border-white/10 transition-all duration-500 ${
            scrolled ? 'px-4 py-3 shadow-lg' : 'px-6 py-4'
          }`}
        >
          {/* Logo - Always displayed */}
          <div className="flex items-center justify-between">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <HashLink 
                smooth 
                to="#" 
                className="flex items-center space-x-3 group"
                onClick={() => setActiveTab('home')}
              >
                <div className="relative w-10 h-10 transition-all duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/30 to-secondary-500/30 animate-pulse-slow"></div>
                  <img 
                    src="/src/assets/images/Logo-nobg-sm.png" 
                    alt="" 
                    className="relative w-full h-full drop-shadow-glow" 
                  />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Avexel
                </span>
              </HashLink>
              
              <div className="ml-8 flex items-center gap-1">
                <TabLink to="#" label="Home" isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                <TabLink to="#capabilities" label="Skills" isActive={activeTab === 'capabilities'} onClick={() => setActiveTab('capabilities')} />
                <TabLink to="#about" label="Team" isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
                <TabLink to="#services" label="Services" isActive={activeTab === 'services'} onClick={() => setActiveTab('services')} />
                <TabLink to="#work" label="Work" isActive={activeTab === 'work'} onClick={() => setActiveTab('work')} />
                <TabLink to="#contact" label="Contact" isActive={activeTab === 'contact'} onClick={() => setActiveTab('contact')} />
              </div>
            </div>
            
            {/* Mobile Logo and Menu Button */}
            <div className="md:hidden flex items-center justify-between w-full px-2">
              <HashLink 
                smooth 
                to="#" 
                className="flex items-center space-x-2 group"
                onClick={closeMenu}
              >
                <div className="relative w-8 h-8 transition-all duration-500 group-hover:scale-110">
                  <img 
                    src="/src/assets/images/Logo-nobg-sm.png" 
                    alt="" 
                    className="relative w-full h-full drop-shadow-glow" 
                  />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Avexel
                </span>
              </HashLink>
              
              {/* Mobile Menu Button */}
              <button 
                className="relative w-10 h-10 focus:outline-none group"
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  document.body.style.overflow = !menuOpen ? 'hidden' : '';
                }}
                aria-label="Toggle menu"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-5">
                  <span className={`absolute w-6 h-0.5 bg-gradient-to-r from-primary-400 to-secondary-400 transform transition-all duration-300 ${
                    menuOpen ? 'top-2 -rotate-45' : 'top-0'
                  }`}></span>
                  <span className={`absolute w-6 h-0.5 bg-white top-2 transition-all duration-300 ${
                    menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                  }`}></span>
                  <span className={`absolute w-6 h-0.5 bg-gradient-to-r from-secondary-400 to-primary-400 transform transition-all duration-300 ${
                    menuOpen ? 'top-2 rotate-45' : 'top-4'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <MobileMenu isOpen={menuOpen} closeMenu={closeMenu} activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

// Tab link component with improved pill design
const TabLink = ({ to, label, isActive, onClick }) => (
  <HashLink 
    smooth 
    to={to} 
    className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive 
        ? 'text-white' 
        : 'text-white/70 hover:text-white'
    }`}
    onClick={onClick}
  >
    <span className="relative z-10">{label}</span>
    {isActive && (
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/80 to-secondary-500/80 shadow-lg animate-fade-in"></span>
    )}
    <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 transform scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 -z-10"></span>
  </HashLink>
);

export default Navbar;
