import React, { useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';

const MobileMenu = ({ isOpen, closeMenu }) => {
  const menuLinks = [
    { to: "#capabilities", text: "Capabilities" },
    { to: "#about", text: "About" },
    { to: "#services", text: "Services" },
    { to: "#work", text: "Portfolio" }
  ];

  useEffect(() => {
    // This effect handles the animation of links when menu opens/closes
    const links = document.querySelectorAll('.mobile-link');
    
    if (isOpen) {
      links.forEach((link, index) => {
        setTimeout(() => {
          link.classList.remove('opacity-0', 'translate-y-8');
          link.classList.add('animate__animated', 'animate__fadeInUp');
        }, 150 + (index * 100));
      });
    } else {
      links.forEach(link => {
        link.classList.add('opacity-0', 'translate-y-8');
        link.classList.remove('animate__animated', 'animate__fadeInUp');
      });
    }
  }, [isOpen]);

  return (
    <div 
      id="mobile-menu" 
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center transform transition-all duration-500 ease-in-out ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-black/95 to-blue-500/30 backdrop-blur-lg animate-gradient"></div>
      
      {/* Menu content with enhanced animations */}
      <ul className="text-center space-y-8 relative z-10">
        {menuLinks.map((link, index) => (
          <li key={index}>
            <HashLink 
              smooth 
              to={link.to} 
              className="text-4xl text-white opacity-0 transition-all duration-300 hover:text-purple-400 transform translate-y-8 mobile-link group"
              onClick={closeMenu}
            >
              <span className="bg-left-bottom bg-gradient-to-r from-purple-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                {link.text}
              </span>
            </HashLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileMenu;
