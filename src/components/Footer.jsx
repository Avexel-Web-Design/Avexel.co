// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Bluesky Link */}
          <div className="mb-4 md:mb-0">
            <a href="https://avexel.bsky.social" className="hover:text-purple-400 flex items-center" target="_blank" rel="noreferrer">
            <img src="/src/assets/images/Bluesky_Logo.png" alt="Bluesky Logo" className="w-5 h-5 mr-2 object-contain" />
              Find us on Bluesky
            </a>
          </div>
          {/* Copyright info */}
          <div className="text-gray-400 text-sm">
            © 2025 Avexel. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;