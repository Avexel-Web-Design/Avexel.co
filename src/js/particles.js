// Enhanced particle animation with smoother movement and dramatic parallax scrolling

class ParticleBackground {
  constructor() {
    this.canvas = document.getElementById('particle-background');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 120; // Increased particle count
    this.connectDistance = 150;
    this.mouse = {
      x: null,
      y: null,
      radius: 150
    };
    this.scrollY = 0; // Track scroll position
    this.lastScrollY = 0; // For smooth scroll transitions
    this.targetScrollY = 0; // Target scroll position for smooth easing
    this.parallaxFactor = 0.35; // Increased parallax factor for more dramatic effect
    this.basePositions = []; // Store original particle positions
    this.colorOptions = [
      {r: 155, g: 155, b: 255}, // Blue
      {r: 200, g: 155, b: 255}, // Purple
      {r: 155, g: 200, b: 255}, // Light blue
    ];
    this.lastTime = 0;
    
    this.resizeCanvas();
    this.initParticles();
    this.setupEventListeners();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    this.basePositions = [];
    
    for (let i = 0; i < this.particleCount; i++) {
      // Assign each particle a depth layer (0.3 to 1.0)
      // This will make some particles move faster than others for a more dynamic effect
      const depthLayer = Math.random() * 0.7 + 0.3;
      
      const size = Math.random() * 3 + 0.5; // Keep the same size range
      const x = Math.random() * (this.canvas.width - size * 2) + size;
      const y = Math.random() * (this.canvas.height - size * 2) + size;
      
      // Slower base movement for smoother animation
      const directionX = (Math.random() * 0.4 - 0.2) * depthLayer;
      const directionY = (Math.random() * 0.4 - 0.2) * depthLayer;
      
      // Smooth velocity tracking
      const vx = directionX;
      const vy = directionY;
      
      // More controlled opacity based on depth
      const opacity = Math.random() * 0.3 + 0.1 * depthLayer;
      
      // Select a color from our options and apply random variation
      const colorBase = this.colorOptions[Math.floor(Math.random() * this.colorOptions.length)];
      const colorVariation = 30; // How much to vary the base color
      
      const color = `rgba(
        ${colorBase.r + Math.random() * colorVariation - colorVariation/2}, 
        ${colorBase.g + Math.random() * colorVariation - colorVariation/2}, 
        ${colorBase.b + Math.random() * colorVariation - colorVariation/2}, 
        ${opacity})`;

      // Store the base position for parallax effect
      this.basePositions.push({ x, y });
      
      this.particles.push({
        x, 
        y, 
        size, 
        directionX, 
        directionY,
        vx,
        vy, 
        color,
        baseX: x, 
        baseY: y,
        depthLayer, // Store the depth layer for varied parallax effect
        brightness: 0.7 + Math.random() * 0.3 // Random brightness factor
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.initParticles();
    });

    window.addEventListener('mousemove', (event) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
    
    // Enhanced scroll event with smoother transitions
    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    });
  }

  // Smoother scroll transition using easing
  updateScrollPosition() {
    // Ease towards target scroll position for smoother effect
    const scrollDiff = this.targetScrollY - this.scrollY;
    this.scrollY += scrollDiff * 0.1; // Adjust the 0.1 value for faster/slower easing
  }

  // Apply enhanced parallax effect with depth layers
  applyParallaxEffect() {
    this.particles.forEach((particle, index) => {
      // Apply depth-based parallax - deeper particles move more dramatically
      const depthEffect = particle.depthLayer * this.parallaxFactor;
      
      // Calculate vertical offset with enhanced parallax
      const offsetY = this.scrollY * depthEffect;
      
      // Apply vertical parallax with wrapping
      particle.y = (this.basePositions[index].y - offsetY) % this.canvas.height;
      
      // Wrap particles if they go off screen
      if (particle.y < -50) {
        particle.y = this.canvas.height + particle.y;
      } else if (particle.y > this.canvas.height + 50) {
        particle.y = particle.y - this.canvas.height;
      }
      
      // More pronounced horizontal drift based on scroll position
      // Use sine wave for smooth oscillation
      const horizontalAmplitude = 15 * particle.depthLayer; // More movement for particles with higher depth
      const horizontalDrift = Math.sin((this.scrollY / 800) + index) * horizontalAmplitude;
      
      particle.x = this.basePositions[index].x + horizontalDrift;
    });
  }

  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.beginPath();
      
      // Add a subtle glow effect to particles
      const glow = particle.size * 2;
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, glow
      );
      
      // Extract color components for the glow
      const baseColor = particle.color.replace('rgba(', '').replace(')', '').split(',');
      const r = baseColor[0].trim();
      const g = baseColor[1].trim();
      const b = baseColor[2].trim();
      const a = baseColor[3].trim();
      
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Add a brighter center to each particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 0.7, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, parseFloat(a) * 2)})`;
      this.ctx.fill();
    });
  }

  updateParticles(deltaTime) {
    // Time-based movement factor for consistent speed across different frame rates
    const timeSpeed = deltaTime / 16; // normalized to 60fps
    
    this.particles.forEach((particle, index) => {
      // Apply physics with easing for smoother movement
      // Target velocity with slight acceleration/deceleration
      const easing = 0.05 * timeSpeed;
      
      // Adjust velocity towards direction with easing
      particle.vx += (particle.directionX - particle.vx) * easing;
      particle.vy += (particle.directionY - particle.vy) * easing;
      
      // Update position with smoother velocity
      particle.baseX += particle.vx * timeSpeed;
      particle.baseY += particle.vy * timeSpeed;
      
      // Check for boundary collisions with smoother rebounds
      if (particle.baseX + particle.size > this.canvas.width || particle.baseX - particle.size < 0) {
        particle.directionX = -particle.directionX;
        // Dampen collision impact for smoother appearance
        particle.vx *= 0.6;
      }
      
      if (particle.baseY + particle.size > this.canvas.height || particle.baseY - particle.size < 0) {
        particle.directionY = -particle.directionY;
        // Dampen collision impact for smoother appearance
        particle.vy *= 0.6;
      }
      
      // Update base positions for parallax reference
      this.basePositions[index].x = particle.baseX;
      this.basePositions[index].y = particle.baseY;

      // Enhanced mouse interaction with smoothing
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const pushFactor = ((this.mouse.radius - distance) / this.mouse.radius) * particle.depthLayer;
          
          // Smoother push reaction
          const pushX = Math.cos(angle) * pushFactor * 2;
          const pushY = Math.sin(angle) * pushFactor * 2;
          
          particle.x -= pushX * timeSpeed;
          particle.y -= pushY * timeSpeed;
          
          // Slight adjustment to base position to prevent snapping back
          this.basePositions[index].x -= pushX * 0.05;
          this.basePositions[index].y -= pushY * 0.05;
        }
      }
    });
    
    // Apply enhanced parallax effect after updating particle positions
    this.applyParallaxEffect();
  }

  connectParticles() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectDistance) {
          // Calculate opacity based on distance with a smoother falloff curve
          const opacity = Math.pow(1 - (distance / this.connectDistance), 2) * 0.25;
          
          // Enhanced connection lines with color gradient based on particles
          const p1 = this.particles[i];
          const p2 = this.particles[j];
          
          // Extract color components
          const p1Color = p1.color.replace('rgba(', '').replace(')', '').split(',');
          const p2Color = p2.color.replace('rgba(', '').replace(')', '').split(',');
          
          // Average the colors for the connection
          const avgR = (parseInt(p1Color[0]) + parseInt(p2Color[0])) / 2;
          const avgG = (parseInt(p1Color[1]) + parseInt(p2Color[1])) / 2;
          const avgB = (parseInt(p1Color[2]) + parseInt(p2Color[2])) / 2;
          
          // Create gradient for smoother connections
          const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          gradient.addColorStop(0, `rgba(${p1Color[0]}, ${p1Color[1]}, ${p1Color[2]}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${p2Color[0]}, ${p2Color[1]}, ${p2Color[2]}, ${opacity})`);
          
          this.ctx.strokeStyle = gradient;
          
          // Line width based on particle sizes for more varied connections
          const avgSize = (p1.size + p2.size) / 2;
          this.ctx.lineWidth = Math.min(1, avgSize * 0.5);
          
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate(timestamp = 0) {
    // Calculate delta time for smooth animation regardless of frame rate
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update scroll position with smooth easing
    this.updateScrollPosition();
    
    // Update and draw everything
    this.updateParticles(Math.min(deltaTime, 32)); // Cap delta time to avoid jumps
    this.connectParticles();
    this.drawParticles();
    
    // Request next frame
    requestAnimationFrame(this.animate.bind(this));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if the canvas element exists
  if (document.getElementById('particle-background')) {
    new ParticleBackground();
  }
});
