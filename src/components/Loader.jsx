import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate loading progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setVisible(false), 300); // Delay hiding loader
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      return () => clearInterval(interval);
    }, 500); // Initial delay

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[60] bg-dark transition-opacity duration-500 ${
      progress === 100 ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/10 to-primary-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 text-center">
          {/* Logo */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 animate-pulse-slow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-lg"></div>
            </div>
            <img 
              src="/src/assets/images/Logo-nobg-sm.png" 
              alt="Logo"
              className="relative w-24 h-24 mx-auto animate-float"
            />
          </div>
          
          {/* Progress bar */}
          <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Progress text */}
          <div className="mt-4 text-sm font-medium text-white/70">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;