import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import './App.css';
import './assets/styles/main.css';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const Capabilities = lazy(() => import('./components/Capabilities'));
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function HomePage() {
  return (
    <>
      <div className="relative min-h-screen bg-dark">
        <div className="relative z-10">
          <Suspense fallback={<div className="min-h-screen" />}>
            <Hero />
            <Capabilities />
            <About />
            <Services />
            <Portfolio />
            <Contact />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="relative bg-dark text-white overflow-x-hidden">
      <Loader />
      <div className="relative z-50">
        <Navbar />
      </div>
      <main className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      <Suspense fallback={<div className="h-64" />}>
        <div className="relative z-10">
          <Footer />
        </div>
      </Suspense>
    </div>
  );
}

export default App;