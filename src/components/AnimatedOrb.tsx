import React, { useEffect, useRef } from "react";

interface AnimatedOrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AnimatedOrb: React.FC<AnimatedOrbProps> = ({
  hue = 240, // Blue-purple default
  hoverIntensity = 0.3,
  rotateOnHover = true,
  forceHoverState = false,
  className = "",
  size = "md"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false });

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32", 
    lg: "w-48 h-48",
    xl: "w-64 h-64"
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    let targetHover = 0;
    let currentHover = 0;
    let rotation = 0;

    const animate = () => {
      time += 0.016;
      
      const effectiveHover = forceHoverState ? 1 : targetHover;
      currentHover += (effectiveHover - currentHover) * 0.1;
      
      if (rotateOnHover && currentHover > 0.5) {
        rotation += 0.01;
      }

      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      const centerX = canvas.width / window.devicePixelRatio / 2;
      const centerY = canvas.height / window.devicePixelRatio / 2;
      const radius = Math.min(centerX, centerY) * 0.8;

      // Create animated orb effect
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );

      // Adjust colors based on hue
      const hueRad = (hue * Math.PI) / 180;
      const r1 = Math.floor(127 + 127 * Math.cos(hueRad));
      const g1 = Math.floor(127 + 127 * Math.cos(hueRad + 2 * Math.PI / 3));
      const b1 = Math.floor(127 + 127 * Math.cos(hueRad + 4 * Math.PI / 3));

      gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${0.8 + currentHover * 0.2})`);
      gradient.addColorStop(0.4, `rgba(${Math.floor(r1 * 0.8)}, ${Math.floor(g1 * 0.8)}, ${Math.floor(b1 * 0.8)}, ${0.4 + currentHover * 0.3})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      // Add hover distortion
      if (currentHover > 0) {
        ctx.scale(1 + currentHover * hoverIntensity * 0.1, 1 + Math.sin(time * 2) * currentHover * hoverIntensity * 0.05);
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius * (0.6 + Math.sin(time * 0.5) * 0.1), 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Add inner glow
      const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.3);
      innerGradient.addColorStop(0, `rgba(255, 255, 255, ${0.3 + currentHover * 0.2})`);
      innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = innerGradient;
      ctx.fill();

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(mouseRef.current.x - centerX, 2) + 
        Math.pow(mouseRef.current.y - centerY, 2)
      );
      
      targetHover = distance < Math.min(centerX, centerY) ? 1 : 0;
    };

    const handleMouseLeave = () => {
      targetHover = 0;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState]);

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-full"
        style={{ filter: 'blur(0.5px)' }}
      />
    </div>
  );
};

export default AnimatedOrb;
