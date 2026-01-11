import React, { useEffect, useRef, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

// Lazy load below-fold components
const Capabilities = lazy(() => import("./components/Capabilities"));
const About = lazy(() => import("./components/About"));
const Services = lazy(() => import("./components/Services"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const GetQuote = lazy(() => import("./components/GetQuote"));
const Contact = lazy(() => import("./components/Contact"));
const CommunicationsGuide = lazy(() => import("./components/CommunicationsGuide"));

// Minimal loading fallback
const SectionFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function HomePage() {
  return (
    <>
      <div className="relative min-h-screen">
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <Services />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Capabilities />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Portfolio />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <GetQuote />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </div>
    </>
  );
}

function App() {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      wheelMultiplier: 0.8,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Scroll to top on route change, but not on hash change
    if (!location.hash) {
      lenisRef.current?.scrollTo(0, { immediate: true });
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
          <Route path="/communications" element={
            <Suspense fallback={<SectionFallback />}>
              <CommunicationsGuide />
            </Suspense>
          } />
        </Routes>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default App;
