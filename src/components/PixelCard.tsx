import React from "react";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
}

const PixelCard: React.FC<PixelCardProps> = ({ children, className = "" }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .pixel-canvas {
            width: 100%;
            height: 100%;
            display: block;
          }

          .pixel-card {
            position: relative;
            overflow: hidden;
            border: 1px solid #27272a;
            border-radius: 1rem;
            isolation: isolate;
            transition: border-color 200ms cubic-bezier(0.5, 1, 0.89, 1);
            user-select: none;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(12px);
          }

          .pixel-card::before {
            content: "";
            position: absolute;
            inset: 0;
            margin: auto;
            aspect-ratio: 1;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 85%);
            opacity: 0;
            transition: opacity 800ms cubic-bezier(0.5, 1, 0.89, 1);
          }

          .pixel-card:hover::before,
          .pixel-card:focus-within::before {
            opacity: 1;
          }

          .pixel-card:hover {
            border-color: rgba(139, 92, 246, 0.5);
            transform: translateY(-2px);
          }
        `
      }} />
      <div className={`pixel-card ${className}`}>
        {children}
      </div>
    </>
  );
};

export default PixelCard;
