/**
 * Belle Époque-Futurism Particle System Engine
 * 
 * A sophisticated particle system that blends ornate Belle Époque aesthetics
 * with early 2000s Japanese futurism, featuring:
 * - Floating golden filigree ornaments with physics-based movement
 * - Holographic shimmer effects with RGB chromatic aberration
 * - Reactive cursor trails with decay physics
 * - Art Nouveau vine tendrils that grow organically
 * - Digital matrix rain in vintage gold/copper colors
 * - Clockwork gears and mechanical elements
 */

class Particle {
  constructor(x, y, type, config = {}) {
    this.x = x;
    this.y = y;
    this.vx = config.vx || (Math.random() - 0.5) * 2;
    this.vy = config.vy || (Math.random() - 0.5) * 2;
    this.type = type;
    this.life = config.life || 1.0;
    this.maxLife = this.life;
    this.size = config.size || Math.random() * 3 + 1;
    this.rotation = config.rotation || 0;
    this.rotationSpeed = config.rotationSpeed || (Math.random() - 0.5) * 0.1;
    this.color = config.color || '#FFD700';
    this.opacity = config.opacity || 1.0;
    this.gravity = config.gravity || 0;
    this.friction = config.friction || 0.98;
    this.glow = config.glow || false;
    this.shimmer = config.shimmer || false;
    this.holographic = config.holographic || false;
    
    // Belle Époque ornament properties
    this.ornamentType = config.ornamentType || 'filigree';
    this.swayAmplitude = config.swayAmplitude || 5;
    this.swaySpeed = config.swaySpeed || 0.02;
    this.swayOffset = Math.random() * Math.PI * 2;
    
    // Futuristic properties
    this.digitalNoise = config.digitalNoise || 0;
    this.chromaShift = config.chromaShift || 0;
    this.pulseSpeed = config.pulseSpeed || 0.05;
    this.pulseOffset = Math.random() * Math.PI * 2;
  }

  update(deltaTime, mouseX, mouseY) {
    // Physics update
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    
    // Belle Époque gentle sway for ornaments
    if (this.type === 'ornament') {
      const swayX = Math.sin(Date.now() * this.swaySpeed + this.swayOffset) * this.swayAmplitude;
      const swayY = Math.cos(Date.now() * this.swaySpeed * 0.7 + this.swayOffset) * this.swayAmplitude * 0.5;
      this.x += this.vx + swayX * 0.01;
      this.y += this.vy + swayY * 0.01;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }
    
    // Rotation update
    this.rotation += this.rotationSpeed;
    
    // Life decay
    this.life -= deltaTime * 0.001;
    this.opacity = Math.max(0, this.life / this.maxLife);
    
    // Cursor attraction for trail particles
    if (this.type === 'cursorTrail' && mouseX !== undefined && mouseY !== undefined) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        const force = (100 - distance) / 100;
        this.vx += dx * force * 0.001;
        this.vy += dy * force * 0.001;
      }
    }
    
    // Holographic pulse effect
    if (this.holographic) {
      const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset);
      this.chromaShift = pulse * 2;
      this.digitalNoise = Math.abs(pulse) * 0.3;
    }
    
    return this.life > 0;
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    // Apply holographic effects
    if (this.holographic && this.chromaShift > 0) {
      this.drawHolographicEffect(ctx);
    } else {
      this.drawParticle(ctx);
    }
    
    ctx.restore();
  }

  drawParticle(ctx) {
    switch (this.type) {
      case 'ornament':
        this.drawOrnament(ctx);
        break;
      case 'cursorTrail':
        this.drawCursorTrail(ctx);
        break;
      case 'matrixRain':
        this.drawMatrixRain(ctx);
        break;
      case 'clockwork':
        this.drawClockwork(ctx);
        break;
      case 'vine':
        this.drawVine(ctx);
        break;
      default:
        this.drawDefault(ctx);
    }
  }

  drawOrnament(ctx) {
    // Belle Époque filigree ornament
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;
    
    if (this.glow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
    }
    
    const size = this.size;
    
    if (this.ornamentType === 'filigree') {
      // Ornate filigree pattern
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = Math.cos(angle) * size;
        const y1 = Math.sin(angle) * size;
        const x2 = Math.cos(angle + Math.PI / 8) * size * 0.6;
        const y2 = Math.sin(angle + Math.PI / 8) * size * 0.6;
        
        if (i === 0) {
          ctx.moveTo(x1, y1);
        } else {
          ctx.lineTo(x1, y1);
        }
        ctx.quadraticCurveTo(x2, y2, 
          Math.cos(angle + Math.PI / 4) * size, 
          Math.sin(angle + Math.PI / 4) * size);
      }
      ctx.closePath();
      ctx.stroke();
      
      // Central ornament
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawCursorTrail(ctx) {
    // Futuristic neon trail
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.color + '80');
    gradient.addColorStop(1, this.color + '00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    if (this.glow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawMatrixRain(ctx) {
    // Digital matrix rain in vintage colors
    ctx.fillStyle = this.color;
    ctx.font = `${this.size * 6}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const char = chars[Math.floor(Math.random() * chars.length)];
    
    if (this.glow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
    }
    
    ctx.fillText(char, 0, 0);
  }

  drawClockwork(ctx) {
    // Belle Époque clockwork gears
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color + '40';
    ctx.lineWidth = 1.5;
    
    if (this.glow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
    }
    
    const size = this.size;
    const teeth = 12;
    
    // Gear outer circle
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      const outerRadius = size;
      const innerRadius = size * 0.8;
      const toothWidth = Math.PI / teeth * 0.4;
      
      const x1 = Math.cos(angle - toothWidth) * outerRadius;
      const y1 = Math.sin(angle - toothWidth) * outerRadius;
      const x2 = Math.cos(angle + toothWidth) * outerRadius;
      const y2 = Math.sin(angle + toothWidth) * outerRadius;
      const x3 = Math.cos(angle + toothWidth) * innerRadius;
      const y3 = Math.sin(angle + toothWidth) * innerRadius;
      const x4 = Math.cos(angle - toothWidth) * innerRadius;
      const y4 = Math.sin(angle - toothWidth) * innerRadius;
      
      if (i === 0) {
        ctx.moveTo(x1, y1);
      } else {
        ctx.lineTo(x1, y1);
      }
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Center hub
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawVine(ctx) {
    // Art Nouveau vine tendril
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    
    if (this.glow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 5;
    }
    
    const length = this.size * 3;
    const segments = 8;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const x = t * length;
      const y = Math.sin(t * Math.PI * 3) * 10 * (1 - t);
      
      if (i === 1) {
        ctx.lineTo(x, y);
      } else {
        const prevT = (i - 1) / segments;
        const prevX = prevT * length;
        const prevY = Math.sin(prevT * Math.PI * 3) * 10 * (1 - prevT);
        
        ctx.quadraticCurveTo(
          (prevX + x) / 2,
          (prevY + y) / 2 - 5,
          x, y
        );
      }
    }
    ctx.stroke();
    
    // Add small leaves
    for (let i = 2; i < segments; i += 2) {
      const t = i / segments;
      const x = t * length;
      const y = Math.sin(t * Math.PI * 3) * 10 * (1 - t);
      
      ctx.beginPath();
      ctx.ellipse(x, y - 3, 3, 6, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawDefault(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  drawHolographicEffect(ctx) {
    // RGB chromatic aberration effect
    const shift = this.chromaShift;
    
    // Red channel
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = '#ff0000';
    ctx.globalAlpha = this.opacity * 0.7;
    ctx.save();
    ctx.translate(-shift, 0);
    this.drawParticle(ctx);
    ctx.restore();
    
    // Green channel
    ctx.fillStyle = '#00ff00';
    this.drawParticle(ctx);
    
    // Blue channel
    ctx.fillStyle = '#0000ff';
    ctx.save();
    ctx.translate(shift, 0);
    this.drawParticle(ctx);
    ctx.restore();
    
    ctx.globalCompositeOperation = 'source-over';
  }
}

export class BelleEpoqueParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastTime = 0;
    this.running = false;
    
    // Configuration
    this.config = {
      maxParticles: 500,
      ornamentDensity: 0.3,
      cursorTrailIntensity: 0.8,
      matrixRainDensity: 0.1,
      clockworkDensity: 0.2,
      vineDensity: 0.05,
      enableGlow: true,
      enableHolographic: true,
      belleEpoqueColors: ['#FFD700', '#B8860B', '#CD853F', '#DEB887', '#F4A460'],
      futuristicColors: ['#00FFFF', '#FF1493', '#00FF00', '#8A2BE2', '#FF4500']
    };
    
    this.setupEventListeners();
    this.setupResizeHandler();
  }

  setupEventListeners() {
    // Mouse tracking for cursor trails
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      
      // Create cursor trail particles
      if (Math.random() < this.config.cursorTrailIntensity) {
        this.addCursorTrailParticle(this.mouseX, this.mouseY);
      }
    });
    
    // Click to create ornament burst
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.createOrnamentBurst(x, y);
    });
  }

  setupResizeHandler() {
    const resizeObserver = new ResizeObserver(() => {
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    });
    resizeObserver.observe(this.canvas);
  }

  start() {
    this.running = true;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.lastTime = performance.now();
    this.animate();
    this.startAmbientEffects();
  }

  stop() {
    this.running = false;
  }

  animate() {
    if (!this.running) return;
    
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    requestAnimationFrame(() => this.animate());
  }

  update(deltaTime) {
    // Update all particles
    this.particles = this.particles.filter(particle => 
      particle.update(deltaTime, this.mouseX, this.mouseY)
    );
    
    // Maintain particle count with ambient effects
    if (this.particles.length < this.config.maxParticles * 0.3) {
      this.addAmbientParticles();
    }
  }

  render() {
    // Clear canvas with slight trail effect for better visual continuity
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Sort particles by type for proper layering
    const sortedParticles = [...this.particles].sort((a, b) => {
      const order = { vine: 0, ornament: 1, clockwork: 2, matrixRain: 3, cursorTrail: 4 };
      return (order[a.type] || 5) - (order[b.type] || 5);
    });
    
    // Render all particles
    sortedParticles.forEach(particle => particle.draw(this.ctx));
  }

  addCursorTrailParticle(x, y) {
    const colors = [...this.config.belleEpoqueColors, ...this.config.futuristicColors];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const particle = new Particle(x, y, 'cursorTrail', {
      size: Math.random() * 4 + 2,
      life: 2.0,
      color: color,
      glow: this.config.enableGlow,
      holographic: this.config.enableHolographic && Math.random() < 0.3,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      friction: 0.95
    });
    
    this.particles.push(particle);
  }

  createOrnamentBurst(x, y) {
    const count = 8 + Math.random() * 12;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const speed = Math.random() * 3 + 1;
      const color = this.config.belleEpoqueColors[Math.floor(Math.random() * this.config.belleEpoqueColors.length)];
      
      const particle = new Particle(x, y, 'ornament', {
        size: Math.random() * 8 + 4,
        life: 4.0 + Math.random() * 2,
        color: color,
        glow: this.config.enableGlow,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        ornamentType: Math.random() < 0.7 ? 'filigree' : 'medallion',
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        gravity: 0.02
      });
      
      this.particles.push(particle);
    }
  }

  addAmbientParticles() {
    // Add floating ornaments
    if (Math.random() < this.config.ornamentDensity) {
      this.addFloatingOrnament();
    }
    
    // Add matrix rain
    if (Math.random() < this.config.matrixRainDensity) {
      this.addMatrixRainParticle();
    }
    
    // Add clockwork elements
    if (Math.random() < this.config.clockworkDensity) {
      this.addClockworkParticle();
    }
    
    // Add vine growth
    if (Math.random() < this.config.vineDensity) {
      this.addVineParticle();
    }
  }

  addFloatingOrnament() {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    const color = this.config.belleEpoqueColors[Math.floor(Math.random() * this.config.belleEpoqueColors.length)];
    
    const particle = new Particle(x, y, 'ornament', {
      size: Math.random() * 6 + 3,
      life: 8.0 + Math.random() * 4,
      color: color,
      glow: this.config.enableGlow,
      ornamentType: 'filigree',
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      swayAmplitude: Math.random() * 10 + 5,
      swaySpeed: 0.01 + Math.random() * 0.02
    });
    
    this.particles.push(particle);
  }

  addMatrixRainParticle() {
    const x = Math.random() * this.canvas.width;
    const y = -20;
    const color = this.config.futuristicColors[Math.floor(Math.random() * this.config.futuristicColors.length)];
    
    const particle = new Particle(x, y, 'matrixRain', {
      size: Math.random() * 2 + 1,
      life: 6.0,
      color: color,
      glow: this.config.enableGlow,
      holographic: this.config.enableHolographic && Math.random() < 0.5,
      vy: Math.random() * 3 + 2,
      gravity: 0.01
    });
    
    this.particles.push(particle);
  }

  addClockworkParticle() {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    const color = this.config.belleEpoqueColors[Math.floor(Math.random() * this.config.belleEpoqueColors.length)];
    
    const particle = new Particle(x, y, 'clockwork', {
      size: Math.random() * 10 + 5,
      life: 6.0 + Math.random() * 3,
      color: color,
      glow: this.config.enableGlow,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      friction: 0.99
    });
    
    this.particles.push(particle);
  }

  addVineParticle() {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    const color = '#228B22'; // Forest green for vines
    
    const particle = new Particle(x, y, 'vine', {
      size: Math.random() * 3 + 2,
      life: 10.0,
      color: color,
      glow: this.config.enableGlow,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    });
    
    this.particles.push(particle);
  }

  startAmbientEffects() {
    // Periodic ornament creation
    setInterval(() => {
      if (this.running && this.particles.length < this.config.maxParticles) {
        this.addAmbientParticles();
      }
    }, 200);
    
    // Special effects bursts
    setInterval(() => {
      if (this.running && Math.random() < 0.1) {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        this.createOrnamentBurst(x, y);
      }
    }, 5000);
  }

  // Public API for external effects
  createEffect(type, x, y, config = {}) {
    switch (type) {
      case 'ornamentBurst':
        this.createOrnamentBurst(x, y);
        break;
      case 'holographicPulse':
        this.createHolographicPulse(x, y, config);
        break;
      case 'vineGrowth':
        this.createVineGrowth(x, y, config);
        break;
    }
  }

  createHolographicPulse(x, y, config) {
    const count = config.count || 20;
    const colors = this.config.futuristicColors;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const particle = new Particle(x, y, 'cursorTrail', {
        size: Math.random() * 6 + 3,
        life: 3.0,
        color: color,
        glow: true,
        holographic: true,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        friction: 0.92
      });
      
      this.particles.push(particle);
    }
  }

  createVineGrowth(x, y, config) {
    const segments = config.segments || 15;
    const length = config.length || 100;
    
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const segmentX = x + t * length;
      const segmentY = y + Math.sin(t * Math.PI * 2) * 20;
      
      setTimeout(() => {
        const particle = new Particle(segmentX, segmentY, 'vine', {
          size: 3,
          life: 8.0,
          color: '#228B22',
          glow: true
        });
        this.particles.push(particle);
      }, i * 100);
    }
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

export default BelleEpoqueParticleEngine;