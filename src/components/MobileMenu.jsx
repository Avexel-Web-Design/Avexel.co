import React from 'react';
import { HashLink } from 'react-router-hash-link';

const MobileMenu = ({ isOpen, closeMenu, activeTab, setActiveTab }) => {
  if (!isOpen) return null;
  
  const menuLinks = [
    { to: '#', label: 'Home', id: 'home' },
    { to: '#capabilities', label: 'Skills', id: 'capabilities' },
    { to: '#about', label: 'Team', id: 'about' },
    { to: '#services', label: 'Services', id: 'services' },
    { to: '#work', label: 'Work', id: 'work' },
    { to: '#contact', label: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (tabId) => {
    setActiveTab(tabId);
    closeMenu();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg">
      <div className="h-full flex flex-col items-center justify-center p-8">
        <nav className="flex flex-col items-center gap-6">
          {menuLinks.map(link => (
            <HashLink
              key={link.id}
              smooth
              to={link.to}
              className={`text-2xl font-medium ${
                activeTab === link.id
                ? 'text-white bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent'
                : 'text-white/70'
              }`}
              onClick={() => handleLinkClick(link.id)}
            >
              {link.label}
            </HashLink>
          ))}
        </nav>

        <div className="mt-16 flex gap-6">
          <a 
            href="https://github.com/avexel-web-design" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white transition-colors duration-300"
            aria-label="GitHub"
          >
            <i className="fab fa-github text-xl"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
