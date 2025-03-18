import React, { useEffect, useRef } from 'react';
import { HashLink } from 'react-router-hash-link';

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

      {/* Menu Content */}
      <div 
        ref={menuRef}
        className={`relative h-full flex flex-col items-center justify-center p-8 transition-all duration-500 ${
          isOpen ? 'translate-y-0' : '-translate-y-8'
        }`}
      >
        {/* Logo */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <div className="w-10 h-10 relative">
            <img 
              src="/src/assets/images/Logo-nobg-sm.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            Avexel
          </span>
        </div>

        {/* Menu Links */}
        <nav className="w-full max-w-md">
          <ul className="space-y-4">
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
                  className={`relative flex items-center gap-3 px-4 py-3 text-xl font-medium transition-all duration-300 rounded-xl ${
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

        {/* Team Contact */}
        <div className={`absolute bottom-8 transition-all duration-500 delay-500 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <p className="text-center text-sm text-white/70 mb-2">Contact the team:</p>
          <div className="flex justify-center items-center gap-6">
            <SocialLink icon="fa-envelope" href="mailto:contact@avexel.co" text="Email" />
            <SocialLink icon="fa-github" href="https://github.com/avexel" />
            <SocialLink icon="fa-linkedin" href="https://linkedin.com/company/avexel" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({ icon, href, text }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
  >
    <i className={`fab ${icon} text-lg`}></i>
    {text && <span className="text-sm">{text}</span>}
  </a>
);

export default MobileMenu;
