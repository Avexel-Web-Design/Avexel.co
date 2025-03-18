import React, { useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';
import logo from '../assets/images/Logo-nobg-sm.png';

const MobileMenu = ({ isOpen, closeMenu, activeTab, setActiveTab }) => {
  const menuRef = useRef(null);
  const menuLinks = [
    { to: "#", text: "Home", id: "home" },
    { to: "#capabilities", text: "Skills", id: "capabilities" },
    { to: "#about", text: "Team", id: "about" },
    { to: "#services", text: "Services", id: "services" },
    { to: "#work", text: "Work", id: "work" },
    { to: "#contact", text: "Contact", id: "contact" }
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
        <div className="absolute inset-0 backdrop-blur-lg bg-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-secondary-500/5 to-primary-500/5"></div>
      </div>

      {/* Mobile Menu Content - enhanced for all screen sizes */}
      <div 
        ref={menuRef}
        className={`relative h-full flex flex-col items-center justify-between p-4 xs:p-6 pt-20 xs:pt-20 pb-8 xs:pb-12 sm:p-8 sm:pb-12 transition-all duration-500 overflow-y-auto ${
          isOpen ? 'translate-y-0' : '-translate-y-8'
        }`}
      >
        {/* Enhanced close button - more visible and better positioned */}
        <button 
          onClick={closeMenu}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center hover:bg-primary-500/40 transition-colors duration-300 z-50 shadow-lg"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo - adjusted positioning with better spacing */}
        <div className="w-full flex justify-center items-center mb-8 xs:mb-6 sm:absolute sm:top-8 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:mb-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 relative">
              <img 
                src={logo}
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Avexel
            </span>
          </div>
        </div>

        {/* Menu Links - enhanced for better touch targets */}
        <nav className="w-full max-w-md mt-0 sm:mt-0 flex-1 flex items-center">
          <ul className="space-y-3 xs:space-y-3 sm:space-y-4 w-full">
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
                  onClick={() => {
                    closeMenu();
                    setActiveTab(link.id);
                  }}
                  className={`relative flex items-center gap-3 px-4 py-3 text-lg sm:text-xl font-medium transition-all duration-300 rounded-xl ${
                    activeTab === link.id 
                      ? 'text-white bg-gradient-to-r from-primary-500/20 to-secondary-500/20'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {activeTab === link.id && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-primary-400 to-secondary-400 rounded-r"></div>
                  )}
                  <span>{link.text}</span>
                </HashLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Team Contact - better positioning for all screen sizes */}
        <div className={`w-full mt-6 sm:mt-0 px-0 sm:absolute sm:bottom-8 sm:left-0 sm:px-4 transition-all duration-500 delay-500 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <p className="text-center text-xs sm:text-sm text-white/70 mb-2">Contact the team:</p>
          <div className="flex justify-center items-center gap-6 sm:gap-6">
            <SocialLink 
              icon="fa-envelope-open-text" 
              href="mailto:contact@avexel.co" 
              iconOnly 
            />
            <SocialLink 
              icon="fa-github" 
              href="https://github.com/avexel-webdesign" 
              iconOnly 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({ icon, href, iconOnly = false }) => {
  // Special handling for email links
  const finalHref = href.startsWith('mailto:') ? 
    (href.includes('?') ? href : `${href}?subject=Website%20Inquiry&body=Hello%20Avexel%20Team,%0A%0AI'm%20interested%20in%20learning%20more%20about%20your%20web%20development%20services.%0A%0ARegards,%0A`) : 
    href;
    
  return (
    <a 
      href={finalHref} 
      target={href.startsWith('mailto:') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300"
    >
      <i className={`fab ${icon} text-lg text-white/70 group-hover:text-white transition-colors duration-300`}></i>
    </a>
  );
};

export default MobileMenu;
