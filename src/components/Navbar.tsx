import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashLink } from "react-router-hash-link";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0, transition: 'all 0.3s ease-out' });
  const navRef = useRef<HTMLDivElement>(null);
  const isManualScroll = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);

    const sections = ["home", "services", "about", "capabilities", "work", "contact"];
    const scrollY = window.scrollY;

    // Find current section index
    let currentIndex = -1;
    for (let i = 0; i < sections.length; i++) {
      const element = document.getElementById(sections[i]);
      if (element) {
        // Use a small offset (e.g. 100px) to trigger the transition slightly before the section hits the very top
        if (element.offsetTop - 100 <= scrollY) {
          currentIndex = i;
        } else {
          break;
        }
      }
    }

    if (currentIndex !== -1) {
      // Update active tab for text highlighting
      setActiveTab(sections[currentIndex]);

      if (isManualScroll.current) {
        // Reset the scroll timeout on every scroll event during manual scroll
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          isManualScroll.current = false;
          // Trigger one last update to snap to the final position
          handleScroll();
        }, 150);

        // Continuous interpolation for click-initiated scroll
        if (currentIndex < sections.length - 1) {
          const currentSection = document.getElementById(sections[currentIndex]);
          const nextSection = document.getElementById(sections[currentIndex + 1]);

          if (currentSection && nextSection && navRef.current) {
            const start = currentSection.offsetTop - 100;
            const end = nextSection.offsetTop - 100;
            const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);

            const currentLink = navRef.current.querySelector(`[data-tab-id="${sections[currentIndex]}"]`) as HTMLElement;
            const nextLink = navRef.current.querySelector(`[data-tab-id="${sections[currentIndex + 1]}"]`) as HTMLElement;

            if (currentLink && nextLink) {
              const newLeft = currentLink.offsetLeft + (nextLink.offsetLeft - currentLink.offsetLeft) * progress;
              const newWidth = currentLink.offsetWidth + (nextLink.offsetWidth - currentLink.offsetWidth) * progress;

              setIndicatorStyle({
                left: newLeft,
                width: newWidth,
                opacity: 1,
                transition: 'none' // No transition for continuous update
              });
            }
          }
        } else {
          // Last section - just snap
          if (navRef.current) {
            const currentLink = navRef.current.querySelector(`[data-tab-id="${sections[currentIndex]}"]`) as HTMLElement;
            if (currentLink) {
              setIndicatorStyle({
                left: currentLink.offsetLeft,
                width: currentLink.offsetWidth,
                opacity: 1,
                transition: 'none'
              });
            }
          }
        }
      } else {
        // Discrete snapping for manual scroll
        if (navRef.current) {
          const currentLink = navRef.current.querySelector(`[data-tab-id="${sections[currentIndex]}"]`) as HTMLElement;
          if (currentLink) {
            setIndicatorStyle({
              left: currentLink.offsetLeft,
              width: currentLink.offsetWidth,
              opacity: 1,
              transition: 'all 0.3s ease-out' // Smooth transition for snap
            });
          }
        }
      }
    } else if (scrollY < 100) {
      // At the very top
      setActiveTab("home");
      if (navRef.current) {
        const homeLink = navRef.current.querySelector(`[data-tab-id="home"]`) as HTMLElement;
        if (homeLink) {
          setIndicatorStyle({
            left: homeLink.offsetLeft,
            width: homeLink.offsetWidth,
            opacity: 1,
            transition: 'all 0.3s ease-out'
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Initial call to set position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Sync with URL hash on mount
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setActiveTab(id);
    }
  }, [location]);

  // Update indicator position on resize or initial load
  useEffect(() => {
    const handleResize = () => {
      window.dispatchEvent(new Event('scroll'));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = (id: string) => {
    isManualScroll.current = true;
    setMenuOpen(false);

    // Set a safety timeout to reset manual scroll if no scroll events fire (e.g. already at target)
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isManualScroll.current = false;
      handleScroll();
    }, 1000);
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "about", label: "Team" },
    { id: "capabilities", label: "Skills" },
    { id: "work", label: "Work" },
    // { id: "quote", label: "Quote" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? "w-[90%] md:w-auto" : "w-[95%] md:w-auto"}`}>
        <div className="glass-panel rounded-full px-6 py-3 flex items-center justify-between md:justify-center gap-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl bg-black/40">

          {/* Logo */}
          <HashLink
            smooth
            to="#"
            className="flex items-center gap-3 group"
            onClick={() => handleLinkClick('home')}
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple to-neon-blue rounded-full blur opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img src="/Logo-nobg-sm.png" alt="Avexel" className="relative w-full h-full object-contain" />
            </div>
            <span className="hidden md:block font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Avexel
            </span>
          </HashLink>

          {/* Desktop Links */}
          <div
            ref={navRef}
            className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5 relative"
          >
            {/* Sliding Indicator */}
            <div
              className="absolute top-1 bottom-1 bg-white/10 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
                transition: indicatorStyle.transition
              }}
            ></div>

            {navLinks.map((link) => (
              <HashLink
                key={link.id}
                data-tab-id={link.id}
                smooth
                to={link.id === "home" ? "#" : `#${link.id}`}
                className={`relative z-10 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${activeTab === link.id
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
                  }`}
                onClick={() => handleLinkClick(link.id)}
              >
                {link.label}
              </HashLink>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl transition-transform duration-500 ${menuOpen ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <HashLink
              key={link.id}
              smooth
              to={link.id === "home" ? "#" : `#${link.id}`}
              className="text-3xl font-bold text-white/80 hover:text-white hover:scale-110 transition-all duration-300"
              onClick={() => handleLinkClick(link.id)}
            >
              {link.label}
            </HashLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
