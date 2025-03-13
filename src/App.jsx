import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import About from './components/About';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Footer from './components/Footer';
import Contact from './components/Contact';
import ParticleBackground from './components/ParticleBackground';
import './App.css';
import './assets/styles/main.css';

function HomePage() {
  return (
    <>
      <div className="relative min-h-screen">
        <ParticleBackground />
        <div className="relative z-10">
          <Hero />
          <Capabilities />
          <About />
          <Services />
          <Portfolio />
          <Contact />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="relative bg-dark text-white overflow-x-hidden">
      <div className="relative z-50">
        <Navbar />
      </div>
      <main className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default App;