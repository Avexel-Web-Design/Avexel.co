import React from "react";
import { Routes, Route } from "react-router-dom";
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
      <div id="home" className="relative min-h-screen bg-black">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Subtle gradient orbs */}
          <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-radial from-primary-500/10 to-transparent opacity-40"></div>
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-radial from-secondary-500/10 to-transparent opacity-40"></div>

          {/* Geometric shapes */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 border border-white/5 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 border border-white/5 rounded-full animate-spin-slow-reverse"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 border border-white/5 animate-pulse-slow"></div>
        </div>        <div className="relative z-10">
          <Hero />
          <Services />
          <About />
          <Capabilities />
          <Portfolio />
          <GetQuote />
          <Contact />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="relative bg-black text-white overflow-x-hidden">
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/communications" element={<CommunicationsGuide />} />
        </Routes>
      </main>      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default App;
