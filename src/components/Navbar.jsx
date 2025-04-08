import React, { useState, useEffect, useRef } from "react";
import { HashLink } from "react-router-hash-link";
import MobileMenu from "./MobileMenu";
// Import the logo image
import logoImage from "/Logo-nobg-sm.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [hoveredTab, setHoveredTab] = useState(null);
  const navRef = useRef(null);
  const tabRefs = useRef({
    home: useRef(null),
    capabilities: useRef(null),
    about: useRef(null),
    services: useRef(null),
    work: useRef(null),
    contact: useRef(null),
  });

  // Highlight position state
  const [highlightStyle, setHighlightStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Update highlight position based on active or hovered tab
  useEffect(() => {
    const currentTab = hoveredTab || activeTab;
    const tabElement = tabRefs.current[currentTab]?.current;

    if (tabElement) {
      setHighlightStyle({
        left: tabElement.offsetLeft,
        width: tabElement.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeTab, hoveredTab]);

  // Detect active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 50);

      // Determine active section based on scroll position
      const sections = [
        "home",
        "services",
        "about",
        "capabilities",
        "work",
        "contact",
      ];
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && window.scrollY >= section.offsetTop - 200) {
          setActiveTab(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full flex justify-center z-50 transition-all duration-500 ${
          scrolled ? "pt-4" : "pt-8"
        }`}
      >
        <div
          ref={navRef}
          className={`relative glass-morphism-nav rounded-full border border-white/10 transition-all duration-500 ${
            scrolled ? "px-4 py-3 shadow-lg" : "px-6 py-4"
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
                onClick={() => setActiveTab("home")}
              >
                <div className="relative w-10 h-10 transition-all duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/30 to-secondary-500/30 animate-pulse-slow"></div>
                  <img
                    src={logoImage}
                    alt="Avexel"
                    className="relative w-full h-full drop-shadow-glow"
                  />
                </div>
              </HashLink>

              <div className="ml-8 flex items-center gap-1 relative">
                {/* Moving highlight element */}
                <div
                  className="absolute top-0 rounded-full bg-gradient-to-r from-primary-500/80 to-secondary-500/80 h-10 shadow-lg transition-all duration-300 ease-out -z-0"
                  style={{
                    left: `${highlightStyle.left}px`,
                    width: `${highlightStyle.width}px`,
                    opacity: highlightStyle.opacity,
                  }}
                />

                {/* Tab links */}
                {[
                  "home",
                  "services",
                  "about",
                  "capabilities",
                  "work",
                  "contact",
                ].map((tab) => (
                  <TabLink
                    key={tab}
                    to={tab === "home" ? "#" : `#${tab}`}
                    label={
                      tab === "capabilities"
                        ? "Skills"
                        : tab === "about"
                        ? "Team"
                        : tab.charAt(0).toUpperCase() + tab.slice(1)
                    }
                    tabRef={tabRefs.current[tab]}
                    isActive={activeTab === tab}
                    onMouseEnter={() => setHoveredTab(tab)}
                    onMouseLeave={() => setHoveredTab(null)}
                    onClick={() => setActiveTab(tab)}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Logo and Menu Button */}
            <div className="md:hidden flex items-center justify-between w-full px-2">
              <HashLink
                smooth
                to="#"
                className="flex items-center space-x-2 group w-full justify-center"
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  document.body.style.overflow = !menuOpen ? "hidden" : "";
                }}
              >
                <div className="relative w-8 h-8 transition-all duration-500 group-hover:scale-110">
                  <img
                    src={logoImage}
                    alt="Avexel"
                    className="relative w-full h-full drop-shadow-glow"
                  />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Avexel
                </span>
              </HashLink>

              {/* Removed hamburger button */}
            </div>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={menuOpen}
        closeMenu={closeMenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
};

// Tab link component with improved design for sliding highlight
const TabLink = ({
  to,
  label,
  tabRef,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => (
  <HashLink
    ref={tabRef}
    smooth
    to={to}
    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
      isActive ? "text-white" : "text-white/70 hover:text-white"
    }`}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {label}
  </HashLink>
);

export default Navbar;
