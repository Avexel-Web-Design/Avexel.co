import React, { useEffect } from "react";
import { HashLink } from "react-router-hash-link";
import { motion, AnimatePresence } from "framer-motion";

const MobileMenu = ({ isOpen, closeMenu, activeTab, setActiveTab }) => {
  // Add keyboard event listener to close on escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Prevent scrolling when menu is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, closeMenu]);

  const menuLinks = [
    { to: "#", label: "Home", id: "home", icon: "fas fa-home" },
    { to: "#capabilities", label: "Skills", id: "capabilities", icon: "fas fa-tools" },
    { to: "#about", label: "Team", id: "about", icon: "fas fa-users" },
    { to: "#services", label: "Services", id: "services", icon: "fas fa-cogs" },
    { to: "#work", label: "Work", id: "work", icon: "fas fa-briefcase" },
    { to: "#contact", label: "Contact", id: "contact", icon: "fas fa-envelope" },
  ];

  const handleLinkClick = (tabId) => {
    setActiveTab(tabId);
    closeMenu();
  };

  // Add a console log to verify when closeMenu is called
  const handleCloseMenu = (e) => {
    // Stop propagation to prevent conflicts with backdrop click
    if (e) e.stopPropagation();
    console.log("Closing menu");
    closeMenu();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur and gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-black/95 to-gray-900/90 backdrop-blur-lg" 
            onClick={handleCloseMenu} // Allow clicking backdrop to close menu
          />
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-500/20 rounded-full blur-3xl" />
          
          {/* Enhanced Close button */}
          <motion.button
            onClick={handleCloseMenu}
            className="absolute top-6 right-6 text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close menu"
            title="Close menu"
          >
            <i className="fas fa-times text-xl"></i>
          </motion.button>
          
          {/* Close overlay - adds another way to close the menu by clicking anywhere */}
          <div 
            className="absolute inset-0 z-0"
            onClick={handleCloseMenu}
            aria-hidden="true"
          ></div>
          
          <div className="h-full flex flex-col items-center justify-center p-8 relative z-10">
            <motion.nav 
              className="flex flex-col items-center gap-8 w-full max-w-md"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {menuLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  variants={itemVariants}
                  className="w-full"
                >
                  <HashLink
                    smooth
                    to={link.to}
                    className={`group relative flex items-center justify-center w-full px-6 py-3 text-2xl font-medium transition-all duration-300 overflow-hidden rounded-lg
                      ${activeTab === link.id
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                      }`}
                    onClick={() => handleLinkClick(link.id)}
                  >
                    {/* Background effect */}
                    {activeTab === link.id && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg"
                        layoutId="activeBackground"
                      />
                    )}
                    
                    {/* Icon */}
                    <i className={`${link.icon} mr-3 text-lg ${activeTab === link.id ? "text-primary-400" : "text-white/50 group-hover:text-primary-400"} transition-colors`}></i>
                    
                    {/* Text with gradient on active */}
                    <span className={activeTab === link.id 
                      ? "bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent" 
                      : ""
                    }>
                      {link.label}
                    </span>
                    
                    {/* Line indicator */}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary-400 to-secondary-400 transition-all duration-300 ${
                      activeTab === link.id ? "w-1/2" : "w-0 group-hover:w-1/4"
                    }`}></span>
                  </HashLink>
                </motion.div>
              ))}
            </motion.nav>

            <motion.div 
              className="mt-16 flex gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="https://github.com/avexel-web-design"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300"
                aria-label="GitHub"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fab fa-github text-xl"></i>
              </motion.a>
              
              {/* Additional social links can be added here */}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
