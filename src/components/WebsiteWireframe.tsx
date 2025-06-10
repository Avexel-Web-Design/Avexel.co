import React from "react";

const WebsiteWireframe: React.FC = () => {
  return (    <svg
      viewBox="0 0 400 300"
      className="absolute inset-0 w-full h-full opacity-15 text-primary-400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Browser window frame */}
      <rect
        x="20"
        y="40"
        width="360"
        height="240"
        rx="8"
        stroke="currentColor"
        strokeWidth="1"
        className="animate-pulse-slow"
      />
      
      {/* Browser top bar */}
      <rect
        x="20"
        y="40"
        width="360"
        height="30"
        rx="8"
        fill="currentColor"
        fillOpacity="0.1"
      />
      
      {/* Browser dots */}
      <circle cx="35" cy="55" r="3" fill="currentColor" fillOpacity="0.3" />
      <circle cx="50" cy="55" r="3" fill="currentColor" fillOpacity="0.3" />
      <circle cx="65" cy="55" r="3" fill="currentColor" fillOpacity="0.3" />
      
      {/* Address bar */}
      <rect
        x="90"
        y="48"
        width="280"
        height="14"
        rx="7"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.5"
      />
      
      {/* Header section */}
      <rect
        x="40"
        y="90"
        width="320"
        height="40"
        rx="4"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2,2"
        className="animate-draw-path"
      />
      
      {/* Navigation */}
      <rect x="40" y="95" width="60" height="8" rx="2" fill="currentColor" fillOpacity="0.2" />
      <rect x="110" y="95" width="40" height="8" rx="2" fill="currentColor" fillOpacity="0.2" />
      <rect x="160" y="95" width="50" height="8" rx="2" fill="currentColor" fillOpacity="0.2" />
      <rect x="220" y="95" width="45" height="8" rx="2" fill="currentColor" fillOpacity="0.2" />
      
      {/* Hero title placeholder */}
      <rect x="40" y="110" width="200" height="12" rx="2" fill="currentColor" fillOpacity="0.3" />
      <rect x="40" y="115" width="150" height="8" rx="2" fill="currentColor" fillOpacity="0.2" />
      
      {/* Content sections */}
      <g className="animate-fade-in delay-1">
        <rect
          x="40"
          y="150"
          width="100"
          height="60"
          rx="4"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="1,1"
        />
        <rect
          x="150"
          y="150"
          width="100"
          height="60"
          rx="4"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="1,1"
        />
        <rect
          x="260"
          y="150"
          width="100"
          height="60"
          rx="4"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="1,1"
        />
      </g>
      
      {/* Content placeholders */}
      <g className="animate-fade-in delay-2">
        <rect x="50" y="160" width="30" height="6" rx="1" fill="currentColor" fillOpacity="0.25" />
        <rect x="50" y="170" width="70" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
        <rect x="50" y="177" width="60" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
        
        <rect x="160" y="160" width="35" height="6" rx="1" fill="currentColor" fillOpacity="0.25" />
        <rect x="160" y="170" width="75" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
        <rect x="160" y="177" width="65" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
        
        <rect x="270" y="160" width="32" height="6" rx="1" fill="currentColor" fillOpacity="0.25" />
        <rect x="270" y="170" width="68" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
        <rect x="270" y="177" width="55" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
      </g>
      
      {/* Footer */}
      <g className="animate-fade-in delay-3">
        <rect
          x="40"
          y="230"
          width="320"
          height="30"
          rx="4"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="3,3"
        />
        <rect x="50" y="240" width="80" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
        <rect x="140" y="240" width="60" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
        <rect x="210" y="240" width="70" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />
      </g>
      
      {/* Floating elements for dynamism */}
      <circle
        cx="350"
        cy="120"
        r="8"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        className="animate-float"
      />
      <rect
        x="30"
        y="220"
        width="6"
        height="6"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        className="animate-float delay-1"
        transform="rotate(45 33 223)"
      />
    </svg>
  );
};

export default WebsiteWireframe;
