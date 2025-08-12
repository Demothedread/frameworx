/**
 * Belle Époque-Futuristic Micro-Animation Engine
 * 
 * Creates contextual micro-animations that transform between classical and digital aesthetics:
 * - Vintage clockwork mechanisms morphing into digital matrices
 * - Art Nouveau ornaments becoming neon wireframes
 * - Belle Époque gears transitioning to cyberpunk circuits
 * - Ornamental filigree transforming into holographic patterns
 * - Context-aware animations triggered by user interactions
 * - Smooth morphing transitions between aesthetic modes
 */

class MicroAnimationEngine {
  constructor() {
    this.isActive = false;
    this.animations = new Map();
    this.animationId = 0;
    this.theme = 'light';
    this.transformationMode = 'auto'; // 'auto' | 'belle-epoque' | 'futuristic'
    this.globalSpeed = 1.0;
    this.contextualTriggers = new Set();
    
    // Animation categories
    this.animationLibrary = {
      clockwork: {
        vintage: {
          gears: this.createClockworkGears,
          springs: this.createClockworkSprings,
          pendulum: this.createClockworkPendulum,
          escapement: this.createClockworkEscapement
        },
        digital: {
          circuits: this.createDigitalCircuits,
          dataFlow: this.createDigitalDataFlow,
          matrix: this.createDigitalMatrix,
          nodes: this.createDigitalNodes
        }
      },
      ornamental: {
        artNouveau: {
          vines: this.createArtNouveauVines,
          flowers: this.createArtNouveauFlowers,
          filigree: this.createArtNouveauFiligree,
          borders: this.createArtNouveauBorders
        },
        neonWireframe: {
          wireframes: this.createNeonWireframes,
          holograms: this.createNeonHolograms,
          scanlines: this.createNeonScanlines,
          glitches: this.createNeonGlitches
        }
      }
    };
    
    // Context mappings for different UI elements
    this.contextualMappings = {
      buttons: ['clockwork.gears', 'ornamental.filigree'],
      navigation: ['clockwork.springs', 'ornamental.vines'],
      panels: ['clockwork.escapement', 'ornamental.borders'],
      interactive: ['clockwork.pendulum', 'ornamental.flowers'],
      transitions: ['clockwork.springs', 'ornamental.wireframes'],
      loading: ['clockwork.gears', 'ornamental.scanlines']
    };
    
    // Transformation states
    this.transformationStates = {
      clockworkToMatrix: 0, // 0 = pure clockwork, 1 = pure matrix
      ornamentToWireframe: 0, // 0 = pure ornament, 1 = pure wireframe
      globalTransformation: 0 // Overall transformation progress
    };
    
    // Performance optimization
    this.animationPool = [];
    this.maxConcurrentAnimations = 50;
    this.frameRate = 60;
    this.lastFrameTime = 0;
  }

  /**
   * Initialize the micro-animation engine
   */
  initialize(theme = 'light') {
    this.theme = theme;
    this.setupGlobalStyles();
    this.bindContextualTriggers();
    console.log('MicroAnimationEngine initialized');
    return true;
  }

  /**
   * Setup global CSS animations
   */
  setupGlobalStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes clockwork-tick {
        0%, 50% { transform: rotate(0deg); }
        51%, 100% { transform: rotate(6deg); }
      }
      
      @keyframes gear-rotation {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes spring-oscillation {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.2); }
      }
      
      @keyframes matrix-rain {
        0% { transform: translateY(-100%); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      
      @keyframes neon-pulse {
        0%, 100% { 
          opacity: 1; 
          filter: drop-shadow(0 0 5px currentColor);
        }
        50% { 
          opacity: 0.7; 
          filter: drop-shadow(0 0 15px currentColor);
        }
      }
      
      @keyframes wireframe-appear {
        0% { 
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          opacity: 0;
        }
        100% { 
          stroke-dasharray: 1000;
          stroke-dashoffset: 0;
          opacity: 1;
        }
      }
      
      @keyframes art-nouveau-grow {
        0% { 
          transform: scale(0) rotate(-45deg);
          opacity: 0;
        }
        100% { 
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
      }
      
      @keyframes hologram-flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
        51% { opacity: 1; }
        52% { opacity: 0.8; }
      }
      
      .micro-animation {
        pointer-events: none;
        position: absolute;
        z-index: 100;
      }
      
      .clockwork-element {
        color: ${this.theme === 'dark' ? '#FFD700' : '#B8860B'};
        filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
      }
      
      .digital-element {
        color: ${this.theme === 'dark' ? '#00FFFF' : '#1E90FF'};
        filter: drop-shadow(0 0 3px rgba(0, 255, 255, 0.5));
      }
      
      .transforming {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    
    // Remove existing micro-animation styles
    const existingStyle = document.getElementById('micro-animation-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    styleSheet.id = 'micro-animation-styles';
    document.head.appendChild(styleSheet);
  }

  /**
   * Bind contextual triggers to DOM elements
   */
  bindContextualTriggers() {
    // Button hover animations
    document.addEventListener('mouseenter', (e) => {
      if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('micro-animated')) {
        this.createContextualAnimation('buttons', e.target);
      }
    }, true);

    // Navigation animations
    document.addEventListener('click', (e) => {
      if (e.target.closest('.tv-nav-btn') || e.target.closest('.channel-indicator')) {
        this.createContextualAnimation('navigation', e.target);
      }
    }, true);

    // Panel animations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && this.shouldAnimate(node)) {
              this.createContextualAnimation('panels', node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Check if element should receive animations
   */
  shouldAnimate(element) {
    const animatableSelectors = [
      '.gamification-hud',
      '.gesture-control-interface',
      '.audio-visualization-interface',
      '.fortune-wheel',
      '.gallery-album',
      '.mind-map-salon',
      '.belle-epoque-arcade'
    ];
    
    return animatableSelectors.some(selector => 
      element.matches && element.matches(selector)
    );
  }

  /**
   * Create contextual animation for specific UI element
   */
  createContextualAnimation(context, targetElement) {
    if (!this.isActive || !targetElement) return null;

    const animationTypes = this.contextualMappings[context];
    if (!animationTypes) return null;

    const animationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
    const [category, variant] = animationType.split('.');
    
    const animationId = this.animationId++;
    const animation = this.createAnimation(category, variant, targetElement);
    
    if (animation) {
      this.animations.set(animationId, animation);
      targetElement.classList.add('micro-animated');
      
      // Cleanup after animation
      setTimeout(() => {
        this.removeAnimation(animationId);
        targetElement.classList.remove('micro-animated');
      }, animation.duration || 3000);
    }
    
    return animationId;
  }

  /**
   * Create specific animation based on category and variant
   */
  createAnimation(category, variant, targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    switch (category) {
      case 'clockwork':
        return this.createClockworkAnimation(variant, centerX, centerY, targetElement);
      case 'ornamental':
        return this.createOrnamentalAnimation(variant, centerX, centerY, targetElement);
      default:
        return null;
    }
  }

  /**
   * Create clockwork-style animations
   */
  createClockworkAnimation(variant, x, y, targetElement) {
    const container = document.createElement('div');
    container.className = 'micro-animation clockwork-element';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.transform = 'translate(-50%, -50%)';
    
    switch (variant) {
      case 'gears':
        return this.createClockworkGears(container, x, y);
      case 'springs':
        return this.createClockworkSprings(container, x, y);
      case 'pendulum':
        return this.createClockworkPendulum(container, x, y);
      case 'escapement':
        return this.createClockworkEscapement(container, x, y);
      default:
        return null;
    }
  }

  /**
   * Create ornamental-style animations
   */
  createOrnamentalAnimation(variant, x, y, targetElement) {
    const container = document.createElement('div');
    container.className = 'micro-animation';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.transform = 'translate(-50%, -50%)';
    
    switch (variant) {
      case 'vines':
        return this.createArtNouveauVines(container, x, y);
      case 'flowers':
        return this.createArtNouveauFlowers(container, x, y);
      case 'filigree':
        return this.createArtNouveauFiligree(container, x, y);
      case 'borders':
        return this.createArtNouveauBorders(container, x, y);
      default:
        return null;
    }
  }

  /**
   * Create clockwork gears animation
   */
  createClockworkGears(container, x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '60');
    svg.setAttribute('height', '60');
    svg.setAttribute('viewBox', '0 0 60 60');
    
    // Main gear
    const mainGear = this.createGearPath(30, 30, 20, 8);
    mainGear.style.animation = 'gear-rotation 2s linear infinite';
    mainGear.style.transformOrigin = '30px 30px';
    
    // Secondary gear
    const secondGear = this.createGearPath(15, 15, 10, 6);
    secondGear.style.animation = 'gear-rotation 1.5s linear infinite reverse';
    secondGear.style.transformOrigin = '15px 15px';
    
    svg.appendChild(mainGear);
    svg.appendChild(secondGear);
    container.appendChild(svg);
    document.body.appendChild(container);
    
    // Transform to digital after delay if in auto mode
    if (this.transformationMode === 'auto') {
      setTimeout(() => {
        this.transformToDigital(container, 'circuits');
      }, 1000);
    }
    
    return {
      element: container,
      duration: 3000,
      type: 'clockwork-gears'
    };
  }

  /**
   * Create gear path SVG element
   */
  createGearPath(cx, cy, radius, teeth) {
    const gear = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pathData = '';
    
    const toothHeight = radius * 0.2;
    const innerRadius = radius - toothHeight;
    
    for (let i = 0; i < teeth; i++) {
      const angle1 = (i / teeth) * Math.PI * 2;
      const angle2 = ((i + 0.5) / teeth) * Math.PI * 2;
      const angle3 = ((i + 1) / teeth) * Math.PI * 2;
      
      const x1 = cx + Math.cos(angle1) * innerRadius;
      const y1 = cy + Math.sin(angle1) * innerRadius;
      const x2 = cx + Math.cos(angle1) * radius;
      const y2 = cy + Math.sin(angle1) * radius;
      const x3 = cx + Math.cos(angle2) * radius;
      const y3 = cy + Math.sin(angle2) * radius;
      const x4 = cx + Math.cos(angle3) * radius;
      const y4 = cy + Math.sin(angle3) * radius;
      const x5 = cx + Math.cos(angle3) * innerRadius;
      const y5 = cy + Math.sin(angle3) * innerRadius;
      
      if (i === 0) {
        pathData += `M ${x1} ${y1}`;
      } else {
        pathData += `L ${x1} ${y1}`;
      }
      pathData += `L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4} L ${x5} ${y5}`;
    }
    pathData += ' Z';
    
    gear.setAttribute('d', pathData);
    gear.setAttribute('fill', 'none');
    gear.setAttribute('stroke', 'currentColor');
    gear.setAttribute('stroke-width', '2');
    
    return gear;
  }

  /**
   * Create clockwork springs animation
   */
  createClockworkSprings(container, x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '40');
    svg.setAttribute('height', '80');
    svg.setAttribute('viewBox', '0 0 40 80');
    
    // Create spring coil
    const spring = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let springPath = 'M 20 10';
    
    for (let i = 0; i < 15; i++) {
      const y = 10 + (i * 4);
      const x = 20 + Math.sin(i * 0.8) * 8;
      springPath += ` L ${x} ${y}`;
    }
    
    spring.setAttribute('d', springPath);
    spring.setAttribute('fill', 'none');
    spring.setAttribute('stroke', 'currentColor');
    spring.setAttribute('stroke-width', '2');
    spring.style.animation = 'spring-oscillation 0.8s ease-in-out infinite';
    
    svg.appendChild(spring);
    container.appendChild(svg);
    document.body.appendChild(container);
    
    return {
      element: container,
      duration: 2500,
      type: 'clockwork-springs'
    };
  }

  /**
   * Create clockwork pendulum animation
   */
  createClockworkPendulum(container, x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '60');
    svg.setAttribute('height', '100');
    svg.setAttribute('viewBox', '0 0 60 100');
    
    // Pendulum rod
    const rod = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    rod.setAttribute('x1', '30');
    rod.setAttribute('y1', '10');
    rod.setAttribute('x2', '30');
    rod.setAttribute('y2', '80');
    rod.setAttribute('stroke', 'currentColor');
    rod.setAttribute('stroke-width', '2');
    
    // Pendulum weight
    const weight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    weight.setAttribute('cx', '30');
    weight.setAttribute('cy', '80');
    weight.setAttribute('r', '8');
    weight.setAttribute('fill', 'currentColor');
    
    const pendulumGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pendulumGroup.appendChild(rod);
    pendulumGroup.appendChild(weight);
    pendulumGroup.style.animation = 'clockwork-tick 1.2s ease-in-out infinite';
    pendulumGroup.style.transformOrigin = '30px 10px';
    
    svg.appendChild(pendulumGroup);
    container.appendChild(svg);
    document.body.appendChild(container);
    
    return {
      element: container,
      duration: 4000,
      type: 'clockwork-pendulum'
    };
  }

  /**
   * Create clockwork escapement animation
   */
  createClockworkEscapement(container, x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '50');
    svg.setAttribute('height', '50');
    svg.setAttribute('viewBox', '0 0 50 50');
    
    // Escapement wheel
    const wheel = this.createGearPath(25, 25, 15, 12);
    wheel.style.animation = 'clockwork-tick 0.5s steps(12, end) infinite';
    wheel.style.transformOrigin = '25px 25px';
    
    // Escapement lever
    const lever = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lever.setAttribute('d', 'M 35 25 L 45 20 L 45 30 Z');
    lever.setAttribute('fill', 'currentColor');
    
    svg.appendChild(wheel);
    svg.appendChild(lever);
    container.appendChild(svg);
    document.body.appendChild(container);
    
    return {
      element: container,
      duration: 3000,
      type: 'clockwork-escapement'
    };
  }

  /**
   * Create Art Nouveau vines animation
   */
  createArtNouveauVines(container, x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '80');
    svg.setAttribute('height', '80');
    svg.setAttribute('viewBox', '0 0 80 80');
    
    // Create flowing vine path
    const vine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    vine.setAttribute('d', 'M 10 70 Q 20 50 30 40 Q 40 30 50 40 Q 60 50 70 30');
    vine.setAttribute('fill', 'none');
    vine.setAttribute('stroke', this.theme === 'dark' ? '#32CD32' : '#228B22');
    vine.setAttribute('stroke-width', '3');
    vine.style.animation = 'art-nouveau-grow 2s ease-out forwards';
    
    // Add leaves
    for (let i = 0; i < 3; i++) {
      const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      leaf.setAttribute('cx', 20 + i * 20);
      leaf.setAttribute('cy', 50 - i * 5);
      leaf.setAttribute('rx', '5');
      leaf.setAttribute('ry', '8');
      leaf.setAttribute('fill', this.theme === 'dark' ? '#90EE90' : '#32CD32');
      leaf.style.animation = `art-nouveau-grow 2s ease-out ${i * 0.3}s forwards`;
      leaf.style.opacity = '0';
      svg.appendChild(leaf);
    }
    
    svg.appendChild(vine);
    container.appendChild(svg);
    document.body.appendChild(container);
    
    // Transform to wireframe if in auto mode
    if (this.transformationMode === 'auto') {
      setTimeout(() => {
        this.transformToWireframe(container, 'wireframes');
      }, 1500);
    }
    
    return {
      element: container,
      duration: 4000,
      type: 'art-nouveau-vines'
    };
  }

  /**
   * Create Art Nouveau flowers animation
   */
  createArtNouveauFlowers(container, x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '60');
    svg.setAttribute('height', '60');
    svg.setAttribute('viewBox', '0 0 60 60');
    
    // Create flower petals
    for (let i = 0; i < 6; i++) {
      const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      const angle = (i / 6) * Math.PI * 2;
      const petalX = 30 + Math.cos(angle) * 12;
      const petalY = 30 + Math.sin(angle) * 12;
      
      petal.setAttribute('cx', petalX);
      petal.setAttribute('cy', petalY);
      petal.setAttribute('rx', '8');
      petal.setAttribute('ry', '4');
      petal.setAttribute('fill', this.theme === 'dark' ? '#FFB6C1' : '#FF69B4');
      petal.setAttribute('transform', `rotate(${angle * 180 / Math.PI} ${petalX} ${petalY})`);
      petal.style.animation = `art-nouveau-grow 1.5s ease-out ${i * 0.1}s forwards`;
      petal.style.opacity = '0';
      
      svg.appendChild(petal);
    }
    
    // Flower center
    const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    center.setAttribute('cx', '30');
    center.setAttribute('cy', '30');
    center.setAttribute('r', '5');
    center.setAttribute('fill', this.theme === 'dark' ? '#FFD700' : '#FFA500');
    center.style.animation = 'art-nouveau-grow 1s ease-out 0.8s forwards';
    center.style.opacity = '0';
    
    svg.appendChild(center);
    container.appendChild(svg);
    document.body.appendChild(container);
    
    return {
      element: container,
      duration: 3500,
      type: 'art-nouveau-flowers'
    };
  }

  /**
   * Create Art Nouveau filigree animation
   */
  createArtNouveauFiligree(container, x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '60');
    svg.setAttribute('viewBox', '0 0 100 60');
    
    // Create ornate filigree pattern
    const filigree = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    filigree.setAttribute('d', 'M 10 30 Q 25 10 50 30 Q 75 50 90 30 M 20 30 Q 30 20 40 30 Q 50 40 60 30 Q 70 20 80 30');
    filigree.setAttribute('fill', 'none');
    filigree.setAttribute('stroke', this.theme === 'dark' ? '#FFD700' : '#B8860B');
    filigree.setAttribute('stroke-width', '2');
    filigree.style.animation = 'wireframe-appear 2s ease-out forwards';
    
    svg.appendChild(filigree);
    container.appendChild(svg);
    document.body.appendChild(container);
    
    return {
      element: container,
      duration: 3000,
      type: 'art-nouveau-filigree'
    };
  }

  /**
   * Create Art Nouveau borders animation
   */
  createArtNouveauBorders(container, x, y) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '120');
    svg.setAttribute('height', '80');
    svg.setAttribute('viewBox', '0 0 120 80');
    
    // Create decorative border
    const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    border.setAttribute('x', '5');
    border.setAttribute('y', '5');
    border.setAttribute('width', '110');
    border.setAttribute('height', '70');
    border.setAttribute('fill', 'none');
    border.setAttribute('stroke', this.theme === 'dark' ? '#CD853F' : '#8B4513');
    border.setAttribute('stroke-width', '3');
    border.setAttribute('rx', '10');
    border.style.animation = 'wireframe-appear 1.5s ease-out forwards';
    
    // Add corner ornaments
    for (let i = 0; i < 4; i++) {
      const corner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const x = i % 2 === 0 ? 15 : 105;
      const y = i < 2 ? 15 : 65;
      corner.setAttribute('cx', x);
      corner.setAttribute('cy', y);
      corner.setAttribute('r', '4');
      corner.setAttribute('fill', this.theme === 'dark' ? '#FFD700' : '#B8860B');
      corner.style.animation = `art-nouveau-grow 1s ease-out ${0.5 + i * 0.2}s forwards`;
      corner.style.opacity = '0';
      svg.appendChild(corner);
    }
    
    svg.appendChild(border);
    container.appendChild(svg);
    document.body.appendChild(container);
    
    return {
      element: container,
      duration: 4000,
      type: 'art-nouveau-borders'
    };
  }

  /**
   * Transform clockwork animation to digital matrix
   */
  transformToDigital(container, digitalType) {
    const originalSvg = container.querySelector('svg');
    if (!originalSvg) return;
    
    // Create digital overlay
    const digitalSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    digitalSvg.setAttribute('width', originalSvg.getAttribute('width'));
    digitalSvg.setAttribute('height', originalSvg.getAttribute('height'));
    digitalSvg.setAttribute('viewBox', originalSvg.getAttribute('viewBox'));
    digitalSvg.style.position = 'absolute';
    digitalSvg.style.top = '0';
    digitalSvg.style.left = '0';
    digitalSvg.style.opacity = '0';
    
    switch (digitalType) {
      case 'circuits':
        this.createDigitalCircuits(digitalSvg);
        break;
      case 'matrix':
        this.createDigitalMatrix(digitalSvg);
        break;
      default:
        this.createDigitalCircuits(digitalSvg);
    }
    
    container.appendChild(digitalSvg);
    
    // Animate transformation
    originalSvg.style.transition = 'opacity 1s ease-out';
    digitalSvg.style.transition = 'opacity 1s ease-out';
    
    setTimeout(() => {
      originalSvg.style.opacity = '0';
      digitalSvg.style.opacity = '1';
    }, 100);
  }

  /**
   * Transform ornamental animation to neon wireframe
   */
  transformToWireframe(container, wireframeType) {
    const originalSvg = container.querySelector('svg');
    if (!originalSvg) return;
    
    // Create wireframe overlay
    const wireframeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    wireframeSvg.setAttribute('width', originalSvg.getAttribute('width'));
    wireframeSvg.setAttribute('height', originalSvg.getAttribute('height'));
    wireframeSvg.setAttribute('viewBox', originalSvg.getAttribute('viewBox'));
    wireframeSvg.style.position = 'absolute';
    wireframeSvg.style.top = '0';
    wireframeSvg.style.left = '0';
    wireframeSvg.style.opacity = '0';
    wireframeSvg.className = 'digital-element';
    
    this.createNeonWireframes(wireframeSvg);
    container.appendChild(wireframeSvg);
    
    // Animate transformation
    originalSvg.style.transition = 'opacity 1s ease-out, filter 1s ease-out';
    wireframeSvg.style.transition = 'opacity 1s ease-out';
    
    setTimeout(() => {
      originalSvg.style.opacity = '0';
      originalSvg.style.filter = 'hue-rotate(180deg)';
      wireframeSvg.style.opacity = '1';
    }, 100);
  }

  /**
   * Create digital circuits pattern
   */
  createDigitalCircuits(svg) {
    const width = parseInt(svg.getAttribute('width'));
    const height = parseInt(svg.getAttribute('height'));
    
    // Create circuit paths
    for (let i = 0; i < 5; i++) {
      const circuit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const endX = Math.random() * width;
      const endY = Math.random() * height;
      
      circuit.setAttribute('d', `M ${startX} ${startY} L ${endX} ${endY}`);
      circuit.setAttribute('stroke', this.theme === 'dark' ? '#00FFFF' : '#1E90FF');
      circuit.setAttribute('stroke-width', '1');
      circuit.style.animation = 'neon-pulse 2s ease-in-out infinite';
      circuit.style.animationDelay = `${i * 0.2}s`;
      
      svg.appendChild(circuit);
    }
    
    // Add nodes
    for (let i = 0; i < 3; i++) {
      const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      node.setAttribute('cx', Math.random() * width);
      node.setAttribute('cy', Math.random() * height);
      node.setAttribute('r', '2');
      node.setAttribute('fill', this.theme === 'dark' ? '#FF1493' : '#9370DB');
      node.style.animation = 'neon-pulse 1s ease-in-out infinite';
      node.style.animationDelay = `${i * 0.3}s`;
      
      svg.appendChild(node);
    }
  }

  /**
   * Create digital matrix pattern
   */
  createDigitalMatrix(svg) {
    const width = parseInt(svg.getAttribute('width'));
    const height = parseInt(svg.getAttribute('height'));
    
    // Create matrix characters
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    for (let i = 0; i < 8; i++) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (i / 8) * width);
      text.setAttribute('y', Math.random() * height);
      text.setAttribute('font-family', 'monospace');
      text.setAttribute('font-size', '8');
      text.setAttribute('fill', this.theme === 'dark' ? '#00FF00' : '#008000');
      text.textContent = characters[Math.floor(Math.random() * characters.length)];
      text.style.animation = 'matrix-rain 3s linear infinite';
      text.style.animationDelay = `${i * 0.3}s`;
      
      svg.appendChild(text);
    }
  }

  /**
   * Create neon wireframes
   */
  createNeonWireframes(svg) {
    const width = parseInt(svg.getAttribute('width'));
    const height = parseInt(svg.getAttribute('height'));
    
    // Create wireframe structure
    const wireframe = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Horizontal lines
    for (let i = 1; i < 4; i++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', (i / 4) * height);
      line.setAttribute('x2', width);
      line.setAttribute('y2', (i / 4) * height);
      line.setAttribute('stroke', this.theme === 'dark' ? '#00FFFF' : '#1E90FF');
      line.setAttribute('stroke-width', '1');
      line.style.animation = 'wireframe-appear 2s ease-out forwards';
      line.style.animationDelay = `${i * 0.2}s`;
      wireframe.appendChild(line);
    }
    
    // Vertical lines
    for (let i = 1; i < 4; i++) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', (i / 4) * width);
      line.setAttribute('y1', '0');
      line.setAttribute('x2', (i / 4) * width);
      line.setAttribute('y2', height);
      line.setAttribute('stroke', this.theme === 'dark' ? '#FF1493' : '#9370DB');
      line.setAttribute('stroke-width', '1');
      line.style.animation = 'wireframe-appear 2s ease-out forwards';
      line.style.animationDelay = `${0.5 + i * 0.2}s`;
      wireframe.appendChild(line);
    }
    
    wireframe.style.animation = 'hologram-flicker 4s ease-in-out infinite';
    svg.appendChild(wireframe);
  }

  /**
   * Start the micro-animation engine
   */
  start() {
    this.isActive = true;
    console.log('MicroAnimationEngine started');
  }

  /**
   * Stop the micro-animation engine
   */
  stop() {
    this.isActive = false;
    this.animations.forEach((animation, id) => {
      this.removeAnimation(id);
    });
    console.log('MicroAnimationEngine stopped');
  }

  /**
   * Remove animation
   */
  removeAnimation(animationId) {
    const animation = this.animations.get(animationId);
    if (animation && animation.element && animation.element.parentNode) {
      animation.element.parentNode.removeChild(animation.element);
    }
    this.animations.delete(animationId);
  }

  /**
   * Set transformation mode
   */
  setTransformationMode(mode) {
    this.transformationMode = mode;
    console.log(`MicroAnimationEngine transformation mode set to: ${mode}`);
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    this.theme = theme;
    this.setupGlobalStyles();
  }

  /**
   * Create manual animation
   */
  createManualAnimation(type, x, y) {
    const element = document.createElement('div');
    element.style.position = 'fixed';
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.pointerEvents = 'none';
    element.style.zIndex = '1000';
    
    const [category, variant] = type.split('.');
    return this.createAnimation(category, variant, element);
  }

  /**
   * Get active animation count
   */
  getActiveAnimationCount() {
    return this.animations.size;
  }
}

// Singleton instance
let microAnimationEngine = null;

export function getMicroAnimationEngine() {
  if (!microAnimationEngine) {
    microAnimationEngine = new MicroAnimationEngine();
  }
  return microAnimationEngine;
}

export default MicroAnimationEngine;