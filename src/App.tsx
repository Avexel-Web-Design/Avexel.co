import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Capabilities from "./components/Capabilities";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import GetQuote from "./components/GetQuote";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CommunicationsGuide from "./components/CommunicationsGuide";
import "./App.css";
import "./assets/styles/main.css";

function HomePage() {
  return (
    <>
      <div className="relative min-h-screen">
        <Hero />
        <Services />
        <About />
        <Capabilities />
        <Portfolio />
        <GetQuote />
        <Contact />
      </div>
    </>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change, but not on hash change
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="relative bg-[#050505] text-white min-h-screen selection:bg-primary-500 selection:text-white">
      {/* Global Background Elements */}

      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/communications" element={<CommunicationsGuide />} />
        </Routes>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default App;
