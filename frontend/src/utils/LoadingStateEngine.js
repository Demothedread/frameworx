/**
 * Belle Époque-Futuristic Loading State Engine
 * 
 * Creates immersive loading animations that morph between classical and digital aesthetics:
 * - Belle Époque pocket watch mechanisms with authentic clockwork movements
 * - Futuristic loading rings with holographic particle dissolution effects
 * - Vintage Roman numerals transforming into digital progress indicators
 * - Art Nouveau ornamental frames morphing into neon wireframe boundaries
 * - Context-aware loading styles adapted to different channel types
 * - Smooth morphing transitions with particle system integration
 */

class LoadingStateEngine {
  constructor() {
    this.isActive = false;
    this.activeLoadings = new Map();
    this.loadingId = 0;
    this.theme = 'light';
    this.transformationMode = 'auto'; // 'auto' | 'pocket-watch' | 'futuristic'
    this.particleEngine = null;
    this.defaultDuration = 3000;
    
    // Loading animation types
    this.loadingStyles = {
      pocketWatch: {
        vintage: {
          clockFace: this.createPocketWatchFace,
          hands: this.createPocketWatchHands,
          chain: this.createPocketWatchChain,
          gears: this.createPocketWatchGears,
          romanNumerals: this.createRomanNumerals
        },
        modern: {
          digitalRing: this.createDigitalRing,
          progressBar: this.createProgressBar,
          holographicFrame: this.createHolographicFrame,
          particleDissolve: this.createParticleDissolve,
          matrixLoad: this.createMatrixLoad
        }
      },
      channelSpecific: {
        gallery: {
          vintage: 'ornate-frame',
          futuristic: 'holographic-viewer'
        },
        mindmap: {
          vintage: 'thought-bubble',
          futuristic: 'neural-network'
        },
        game: {
          vintage: 'mechanical-spinner',
          futuristic: 'energy-orb'
        },
        atelier: {
          vintage: 'artist-palette',
          futuristic: 'digital-brush'
        }
      }
    };
    
    // Animation configurations
    this.animationConfigs = {
      pocketWatch: {
        size: 120,
        chainLength: 40,
        handSpeed: 2,
        tickInterval: 1000,
        romanNumerals: ['XII', 'III', 'VI', 'IX'],
        belleEpoqueColors: ['#FFD700', '#B8860B', '#CD853F', '#DEB887'],
        ornamentDetails: true
      },
      futuristicRing: {
        size: 100,
        ringWidth: 8,
        glowIntensity: 15,
        rotationSpeed: 1,
        particleCount: 30,
        cyberpunkColors: ['#00FFFF', '#FF1493', '#8A2BE2', '#32CD32'],
        holographicEffects: true
      },
      transformation: {
        morphDuration: 2000,
        dissolveDelay: 1000,
        particleLifetime: 3000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    };
    
    // Loading contexts
    this.loadingContexts = {
      channelTransition: {
        minDuration: 800,
        style: 'pocket-watch-to-ring',
        particles: true
      },
      dataLoading: {
        minDuration: 1500,
        style: 'progressive-ring',
        particles: false
      },
      imageLoading: {
        minDuration: 1000,
        style: 'ornate-frame',
        particles: true
      },
      initialization: {
        minDuration: 2500,
        style: 'full-transformation',
        particles: true
      }
    };
  }

  /**
   * Initialize the loading state engine
   */
  initialize(particleEngine = null, theme = 'light') {
    this.particleEngine = particleEngine;
    this.theme = theme;
    this.setupLoadingStyles();
    console.log('LoadingStateEngine initialized');
    return true;
  }

  /**
   * Setup CSS styles for loading animations
   */
  setupLoadingStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes pocket-watch-tick {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(6deg); }
        100% { transform: rotate(0deg); }
      }
      
      @keyframes watch-hand-hour {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes watch-hand-minute {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes watch-chain-swing {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(5deg); }
      }
      
      @keyframes roman-numeral-glow {
        0%, 100% { 
          opacity: 0.7; 
          text-shadow: 0 0 5px currentColor;
        }
        50% { 
          opacity: 1; 
          text-shadow: 0 0 15px currentColor;
        }
      }
      
      @keyframes futuristic-ring-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes ring-glow-pulse {
        0%, 100% { 
          filter: drop-shadow(0 0 10px currentColor);
          opacity: 0.8;
        }
        50% { 
          filter: drop-shadow(0 0 25px currentColor);
          opacity: 1;
        }
      }
      
      @keyframes progress-fill {
        from { stroke-dashoffset: 314; }
        to { stroke-dashoffset: 0; }
      }
      
      @keyframes holographic-flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
        51% { opacity: 1; }
        52% { opacity: 0.8; }
        53% { opacity: 1; }
      }
      
      @keyframes particle-dissolve {
        0% { 
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
        50% { 
          transform: scale(1.2) rotate(180deg);
          opacity: 0.5;
        }
        100% { 
          transform: scale(0) rotate(360deg);
          opacity: 0;
        }
      }
      
      @keyframes matrix-cascade {
        0% { transform: translateY(-20px); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(100px); opacity: 0; }
      }
      
      .loading-state {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        pointer-events: none;
      }
      
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 9998;
        pointer-events: all;
      }
      
      .pocket-watch {
        color: ${this.theme === 'dark' ? '#FFD700' : '#B8860B'};
        filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
      }
      
      .futuristic-ring {
        color: ${this.theme === 'dark' ? '#00FFFF' : '#1E90FF'};
        filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.7));
      }
      
      .loading-transform {
        transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    
    // Remove existing loading styles
    const existingStyle = document.getElementById('loading-state-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    styleSheet.id = 'loading-state-styles';
    document.head.appendChild(styleSheet);
  }

  /**
   * Create a new loading state
   */
  createLoadingState(context = 'initialization', options = {}) {
    if (!this.isActive) {
      this.isActive = true;
    }

    const loadingId = this.loadingId++;
    const config = {
      ...this.loadingContexts[context],
      ...options
    };

    const loading = {
      id: loadingId,
      context,
      config,
      startTime: Date.now(),
      progress: 0,
      element: null,
      overlay: null
    };

    // Create loading elements
    this.createLoadingElements(loading);
    
    // Store loading state
    this.activeLoadings.set(loadingId, loading);
    
    // Start animation
    this.animateLoading(loading);
    
    return loadingId;
  }

  /**
   * Create loading DOM elements
   */
  createLoadingElements(loading) {
    // Create overlay
    loading.overlay = document.createElement('div');
    loading.overlay.className = 'loading-overlay';
    document.body.appendChild(loading.overlay);

    // Create main loading container
    loading.element = document.createElement('div');
    loading.element.className = 'loading-state';
    
    // Create loading animation based on style
    this.createLoadingAnimation(loading);
    
    document.body.appendChild(loading.element);
  }

  /**
   * Create specific loading animation
   */
  createLoadingAnimation(loading) {
    const { config } = loading;
    
    switch (config.style) {
      case 'pocket-watch-to-ring':
        this.createPocketWatchToRingAnimation(loading);
        break;
      case 'progressive-ring':
        this.createProgressiveRingAnimation(loading);
        break;
      case 'ornate-frame':
        this.createOrnateFrameAnimation(loading);
        break;
      case 'full-transformation':
        this.createFullTransformationAnimation(loading);
        break;
      default:
        this.createPocketWatchToRingAnimation(loading);
    }
  }

  /**
   * Create pocket watch to ring transformation animation
   */
  createPocketWatchToRingAnimation(loading) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '160');
    svg.setAttribute('height', '200');
    svg.setAttribute('viewBox', '0 0 160 200');
    
    // Pocket watch container
    const watchGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    watchGroup.className = 'pocket-watch loading-transform';
    
    // Watch face
    const watchFace = this.createPocketWatchFace(svg, 80, 100, 50);
    watchGroup.appendChild(watchFace);
    
    // Watch hands
    const hands = this.createPocketWatchHands(svg, 80, 100);
    watchGroup.appendChild(hands);
    
    // Roman numerals
    const numerals = this.createRomanNumerals(svg, 80, 100, 40);
    watchGroup.appendChild(numerals);
    
    // Watch chain
    const chain = this.createPocketWatchChain(svg, 80, 50);
    watchGroup.appendChild(chain);
    
    svg.appendChild(watchGroup);
    
    // Create futuristic ring (initially hidden)
    const ringGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    ringGroup.className = 'futuristic-ring loading-transform';
    ringGroup.style.opacity = '0';
    
    const ring = this.createFuturisticRing(svg, 80, 100, 45);
    ringGroup.appendChild(ring);
    
    svg.appendChild(ringGroup);
    loading.element.appendChild(svg);
    
    // Schedule transformation
    setTimeout(() => {
      this.transformPocketWatchToRing(watchGroup, ringGroup, loading);
    }, 1500);
  }

  /**
   * Create pocket watch face
   */
  createPocketWatchFace(svg, cx, cy, radius) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Outer rim
    const outerRim = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerRim.setAttribute('cx', cx);
    outerRim.setAttribute('cy', cy);
    outerRim.setAttribute('r', radius + 5);
    outerRim.setAttribute('fill', 'none');
    outerRim.setAttribute('stroke', 'currentColor');
    outerRim.setAttribute('stroke-width', '3');
    
    // Face
    const face = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    face.setAttribute('cx', cx);
    face.setAttribute('cy', cy);
    face.setAttribute('r', radius);
    face.setAttribute('fill', this.theme === 'dark' ? '#F5F5DC' : '#FFFAF0');
    face.setAttribute('stroke', 'currentColor');
    face.setAttribute('stroke-width', '2');
    
    // Hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const x1 = cx + Math.cos(angle) * (radius - 8);
      const y1 = cy + Math.sin(angle) * (radius - 8);
      const x2 = cx + Math.cos(angle) * (radius - 3);
      const y2 = cy + Math.sin(angle) * (radius - 3);
      
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      marker.setAttribute('x1', x1);
      marker.setAttribute('y1', y1);
      marker.setAttribute('x2', x2);
      marker.setAttribute('y2', y2);
      marker.setAttribute('stroke', 'currentColor');
      marker.setAttribute('stroke-width', i % 3 === 0 ? '2' : '1');
      
      group.appendChild(marker);
    }
    
    group.appendChild(outerRim);
    group.appendChild(face);
    
    return group;
  }

  /**
   * Create pocket watch hands
   */
  createPocketWatchHands(svg, cx, cy) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Hour hand
    const hourHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hourHand.setAttribute('x1', cx);
    hourHand.setAttribute('y1', cy);
    hourHand.setAttribute('x2', cx);
    hourHand.setAttribute('y2', cy - 25);
    hourHand.setAttribute('stroke', 'currentColor');
    hourHand.setAttribute('stroke-width', '3');
    hourHand.setAttribute('stroke-linecap', 'round');
    hourHand.style.animation = 'watch-hand-hour 12s linear infinite';
    hourHand.style.transformOrigin = `${cx}px ${cy}px`;
    
    // Minute hand
    const minuteHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    minuteHand.setAttribute('x1', cx);
    minuteHand.setAttribute('y1', cy);
    minuteHand.setAttribute('x2', cx);
    minuteHand.setAttribute('y2', cy - 35);
    minuteHand.setAttribute('stroke', 'currentColor');
    minuteHand.setAttribute('stroke-width', '2');
    minuteHand.setAttribute('stroke-linecap', 'round');
    minuteHand.style.animation = 'watch-hand-minute 1s linear infinite';
    minuteHand.style.transformOrigin = `${cx}px ${cy}px`;
    
    // Center pin
    const centerPin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerPin.setAttribute('cx', cx);
    centerPin.setAttribute('cy', cy);
    centerPin.setAttribute('r', '3');
    centerPin.setAttribute('fill', 'currentColor');
    
    group.appendChild(hourHand);
    group.appendChild(minuteHand);
    group.appendChild(centerPin);
    
    return group;
  }

  /**
   * Create Roman numerals
   */
  createRomanNumerals(svg, cx, cy, radius) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const numerals = ['XII', 'III', 'VI', 'IX'];
    const positions = [0, 90, 180, 270]; // degrees
    
    numerals.forEach((numeral, index) => {
      const angle = (positions[index] - 90) * Math.PI / 180;
      const x = cx + Math.cos(angle) * radius * 0.7;
      const y = cy + Math.sin(angle) * radius * 0.7;
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-family', 'serif');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', 'currentColor');
      text.textContent = numeral;
      text.style.animation = `roman-numeral-glow 2s ease-in-out infinite ${index * 0.5}s`;
      
      group.appendChild(text);
    });
    
    return group;
  }

  /**
   * Create pocket watch chain
   */
  createPocketWatchChain(svg, cx, startY) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Chain links
    for (let i = 0; i < 5; i++) {
      const y = startY + i * 8;
      
      const link = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      link.setAttribute('cx', cx);
      link.setAttribute('cy', y);
      link.setAttribute('rx', '3');
      link.setAttribute('ry', '5');
      link.setAttribute('fill', 'none');
      link.setAttribute('stroke', 'currentColor');
      link.setAttribute('stroke-width', '2');
      
      group.appendChild(link);
    }
    
    group.style.animation = 'watch-chain-swing 3s ease-in-out infinite';
    group.style.transformOrigin = `${cx}px ${startY}px`;
    
    return group;
  }

  /**
   * Create futuristic loading ring
   */
  createFuturisticRing(svg, cx, cy, radius) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Background ring
    const bgRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgRing.setAttribute('cx', cx);
    bgRing.setAttribute('cy', cy);
    bgRing.setAttribute('r', radius);
    bgRing.setAttribute('fill', 'none');
    bgRing.setAttribute('stroke', 'rgba(0, 255, 255, 0.2)');
    bgRing.setAttribute('stroke-width', '8');
    
    // Progress ring
    const progressRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progressRing.setAttribute('cx', cx);
    progressRing.setAttribute('cy', cy);
    progressRing.setAttribute('r', radius);
    progressRing.setAttribute('fill', 'none');
    progressRing.setAttribute('stroke', 'currentColor');
    progressRing.setAttribute('stroke-width', '8');
    progressRing.setAttribute('stroke-linecap', 'round');
    progressRing.setAttribute('stroke-dasharray', '314');
    progressRing.setAttribute('stroke-dashoffset', '314');
    progressRing.style.animation = 'progress-fill 3s ease-out forwards, ring-glow-pulse 2s ease-in-out infinite';
    progressRing.style.transform = 'rotate(-90deg)';
    progressRing.style.transformOrigin = `${cx}px ${cy}px`;
    
    // Spinning outer ring
    const spinRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    spinRing.setAttribute('cx', cx);
    spinRing.setAttribute('cy', cy);
    spinRing.setAttribute('r', radius + 15);
    spinRing.setAttribute('fill', 'none');
    spinRing.setAttribute('stroke', 'rgba(255, 20, 147, 0.6)');
    spinRing.setAttribute('stroke-width', '2');
    spinRing.setAttribute('stroke-dasharray', '10 5');
    spinRing.style.animation = 'futuristic-ring-spin 2s linear infinite';
    spinRing.style.transformOrigin = `${cx}px ${cy}px`;
    
    // Inner glow
    const innerGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerGlow.setAttribute('cx', cx);
    innerGlow.setAttribute('cy', cy);
    innerGlow.setAttribute('r', radius - 20);
    innerGlow.setAttribute('fill', 'rgba(0, 255, 255, 0.1)');
    innerGlow.style.animation = 'holographic-flicker 3s ease-in-out infinite';
    
    group.appendChild(bgRing);
    group.appendChild(innerGlow);
    group.appendChild(progressRing);
    group.appendChild(spinRing);
    
    return group;
  }

  /**
   * Transform pocket watch to futuristic ring
   */
  transformPocketWatchToRing(watchGroup, ringGroup, loading) {
    // Fade out pocket watch
    watchGroup.style.opacity = '0';
    watchGroup.style.transform = 'scale(0.8) rotate(45deg)';
    
    // Fade in futuristic ring
    setTimeout(() => {
      ringGroup.style.opacity = '1';
      ringGroup.style.transform = 'scale(1) rotate(0deg)';
      
      // Create particle dissolution effect
      if (loading.config.particles && this.particleEngine) {
        this.createTransformationParticles(loading);
      }
    }, 500);
  }

  /**
   * Create transformation particle effects
   */
  createTransformationParticles(loading) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Clockwork particles dissolving
    this.particleEngine.createEffect('clockwork', centerX, centerY, {
      count: 15,
      style: 'dissolving'
    });
    
    // Holographic particles forming
    setTimeout(() => {
      this.particleEngine.createEffect('holographicPulse', centerX, centerY, {
        count: 20,
        style: 'materializing'
      });
    }, 800);
  }

  /**
   * Create progressive ring animation
   */
  createProgressiveRingAnimation(loading) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '120');
    svg.setAttribute('height', '120');
    svg.setAttribute('viewBox', '0 0 120 120');
    
    const ring = this.createFuturisticRing(svg, 60, 60, 45);
    svg.appendChild(ring);
    loading.element.appendChild(svg);
  }

  /**
   * Create ornate frame animation
   */
  createOrnateFrameAnimation(loading) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '200');
    svg.setAttribute('height', '140');
    svg.setAttribute('viewBox', '0 0 200 140');
    
    // Ornate frame
    const frame = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    frame.setAttribute('x', '10');
    frame.setAttribute('y', '10');
    frame.setAttribute('width', '180');
    frame.setAttribute('height', '120');
    frame.setAttribute('fill', 'none');
    frame.setAttribute('stroke', 'currentColor');
    frame.setAttribute('stroke-width', '3');
    frame.setAttribute('rx', '10');
    frame.className = 'pocket-watch';
    
    // Loading text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '100');
    text.setAttribute('y', '75');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-family', 'Cinzel, serif');
    text.setAttribute('font-size', '16');
    text.setAttribute('fill', 'currentColor');
    text.textContent = 'Loading...';
    text.style.animation = 'roman-numeral-glow 2s ease-in-out infinite';
    
    svg.appendChild(frame);
    svg.appendChild(text);
    loading.element.appendChild(svg);
  }

  /**
   * Create full transformation animation
   */
  createFullTransformationAnimation(loading) {
    this.createPocketWatchToRingAnimation(loading);
    
    // Add matrix effects
    setTimeout(() => {
      this.addMatrixLoadingEffect(loading);
    }, 3000);
  }

  /**
   * Add matrix loading effect
   */
  addMatrixLoadingEffect(loading) {
    const matrixContainer = document.createElement('div');
    matrixContainer.style.position = 'absolute';
    matrixContainer.style.top = '0';
    matrixContainer.style.left = '0';
    matrixContainer.style.width = '100%';
    matrixContainer.style.height = '100%';
    matrixContainer.style.pointerEvents = 'none';
    
    // Create matrix characters
    const characters = '01アイウエオカキクケコ';
    for (let i = 0; i < 10; i++) {
      const char = document.createElement('div');
      char.textContent = characters[Math.floor(Math.random() * characters.length)];
      char.style.position = 'absolute';
      char.style.left = Math.random() * 100 + '%';
      char.style.top = '0';
      char.style.color = '#00FF00';
      char.style.fontFamily = 'monospace';
      char.style.fontSize = '12px';
      char.style.animation = `matrix-cascade 2s linear infinite ${i * 0.2}s`;
      
      matrixContainer.appendChild(char);
    }
    
    loading.element.appendChild(matrixContainer);
  }

  /**
   * Update loading progress
   */
  updateProgress(loadingId, progress) {
    const loading = this.activeLoadings.get(loadingId);
    if (!loading) return;
    
    loading.progress = Math.max(0, Math.min(100, progress));
    
    // Update visual progress
    const progressRing = loading.element.querySelector('circle[stroke-dasharray="314"]');
    if (progressRing) {
      const offset = 314 - (314 * loading.progress / 100);
      progressRing.setAttribute('stroke-dashoffset', offset);
    }
  }

  /**
   * Complete loading state
   */
  completeLoading(loadingId, callback = null) {
    const loading = this.activeLoadings.get(loadingId);
    if (!loading) return;
    
    // Final particle burst
    if (loading.config.particles && this.particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      this.particleEngine.createEffect('holographicPulse', centerX, centerY, {
        count: 25,
        style: 'completion-burst'
      });
    }
    
    // Fade out animation
    loading.element.style.transition = 'all 0.5s ease-out';
    loading.element.style.opacity = '0';
    loading.element.style.transform = 'scale(0.8)';
    
    loading.overlay.style.transition = 'all 0.5s ease-out';
    loading.overlay.style.opacity = '0';
    
    setTimeout(() => {
      this.removeLoading(loadingId);
      if (callback) callback();
    }, 500);
  }

  /**
   * Remove loading state
   */
  removeLoading(loadingId) {
    const loading = this.activeLoadings.get(loadingId);
    if (!loading) return;
    
    if (loading.element && loading.element.parentNode) {
      loading.element.parentNode.removeChild(loading.element);
    }
    
    if (loading.overlay && loading.overlay.parentNode) {
      loading.overlay.parentNode.removeChild(loading.overlay);
    }
    
    this.activeLoadings.delete(loadingId);
    
    // Deactivate if no more loading states
    if (this.activeLoadings.size === 0) {
      this.isActive = false;
    }
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    this.theme = theme;
    this.setupLoadingStyles();
  }

  /**
   * Set transformation mode
   */
  setTransformationMode(mode) {
    this.transformationMode = mode;
  }

  /**
   * Get active loading states
   */
  getActiveLoadings() {
    return Array.from(this.activeLoadings.values());
  }

  /**
   * Clear all loading states
   */
  clearAllLoadings() {
    this.activeLoadings.forEach((loading, id) => {
      this.removeLoading(id);
    });
  }
}

// Singleton instance
let loadingStateEngine = null;

export function getLoadingStateEngine() {
  if (!loadingStateEngine) {
    loadingStateEngine = new LoadingStateEngine();
  }
  return loadingStateEngine;
}

export default LoadingStateEngine;