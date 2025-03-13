// src/App.jsx
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
import './assets/styles/main.css'; // Import custom styles

function HomePage() {
  return (
    <>
      <ParticleBackground />
      <Hero />
      <Capabilities />
      <About />
      <Services />
      <Portfolio />
      <Contact />
    </>
  );
}
function App() {
  return (
    <div className="App bg-black text-white overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </div>
  );
}
export default App;