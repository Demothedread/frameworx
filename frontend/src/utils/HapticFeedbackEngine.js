/**
 * Belle Époque-Futuristic Haptic Feedback Engine
 * 
 * Creates immersive tactile experiences that blend classical and digital sensations:
 * - Vintage texture overlays simulating Belle Époque materials and surfaces
 * - Futuristic vibration patterns with precise haptic control and timing
 * - Context-aware feedback for different UI interactions and channel types
 * - Visual texture simulation with particle effects and visual feedback
 * - Audio-tactile synchronization for multi-sensory engagement
 * - Adaptive intensity based on user preferences and device capabilities
 */

class HapticFeedbackEngine {
  constructor() {
    this.isActive = false;
    this.isEnabled = true;
    this.intensity = 0.7; // 0.0 to 1.0
    this.theme = 'light';
    this.particleEngine = null;
    
    // Device capability detection
    this.hasVibration = 'vibrate' in navigator;
    this.hasGamepad = 'getGamepads' in navigator;
    this.hasTouch = 'ontouchstart' in window;
    
    // Haptic pattern libraries
    this.hapticPatterns = {
      belleEpoque: {
        velvet: { 
          vibration: [50, 30, 70, 20, 90], 
          visual: 'soft-fabric',
          audio: 'subtle-brush'
        },
        leather: { 
          vibration: [100, 50, 120, 40, 80], 
          visual: 'leather-grain',
          audio: 'material-creak'
        },
        brass: { 
          vibration: [150, 20, 180, 15, 200], 
          visual: 'metallic-shine',
          audio: 'metal-chime'
        },
        mahogany: { 
          vibration: [80, 60, 100, 50, 90], 
          visual: 'wood-grain',
          audio: 'wood-tap'
        },
        crystal: { 
          vibration: [200, 10, 220, 8, 250], 
          visual: 'crystal-facets',
          audio: 'crystal-ring'
        },
        silk: { 
          vibration: [30, 40, 35, 45, 40], 
          visual: 'silk-flow',
          audio: 'fabric-rustle'
        }
      },
      futuristic: {
        hologram: { 
          vibration: [20, 20, 40, 20, 60, 20, 80], 
          visual: 'holographic-interference',
          audio: 'digital-hum'
        },
        plasma: { 
          vibration: [300, 5, 320, 5, 340, 5], 
          visual: 'plasma-arc',
          audio: 'energy-crackle'
        },
        neural: { 
          vibration: [25, 25, 50, 25, 75, 25, 100], 
          visual: 'neural-pulse',
          audio: 'synaptic-fire'
        },
        quantum: { 
          vibration: [10, 10, 20, 10, 30, 10, 40, 10], 
          visual: 'quantum-field',
          audio: 'quantum-whisper'
        },
        matrix: { 
          vibration: [100, 100, 200, 100, 300], 
          visual: 'matrix-code',
          audio: 'data-stream'
        },
        cyber: { 
          vibration: [150, 30, 180, 25, 200, 20], 
          visual: 'neon-pulse',
          audio: 'cyber-beep'
        }
      }
    };
    
    // Context-specific haptic mappings
    this.contextualHaptics = {
      buttons: {
        hover: { pattern: 'silk', intensity: 0.3 },
        click: { pattern: 'brass', intensity: 0.8 },
        focus: { pattern: 'velvet', intensity: 0.2 }
      },
      navigation: {
        forward: { pattern: 'crystal', intensity: 0.6 },
        backward: { pattern: 'mahogany', intensity: 0.6 },
        select: { pattern: 'leather', intensity: 0.7 }
      },
      channels: {
        gallery: { pattern: 'velvet', intensity: 0.5 },
        mindmap: { pattern: 'neural', intensity: 0.6 },
        game: { pattern: 'plasma', intensity: 0.8 },
        atelier: { pattern: 'silk', intensity: 0.4 }
      },
      interactions: {
        success: { pattern: 'crystal', intensity: 0.9 },
        error: { pattern: 'matrix', intensity: 1.0 },
        loading: { pattern: 'quantum', intensity: 0.3 },
        completion: { pattern: 'hologram', intensity: 0.7 }
      },
      gestures: {
        swipe: { pattern: 'silk', intensity: 0.5 },
        tap: { pattern: 'brass', intensity: 0.6 },
        hold: { pattern: 'leather', intensity: 0.4 },
        release: { pattern: 'velvet', intensity: 0.3 }
      }
    };
    
    // Visual texture overlays
    this.textureOverlays = new Map();
    this.activeTextures = new Set();
    
    // Audio feedback integration
    this.audioContext = null;
    this.audioEnabled = true;
    
    // Performance tracking
    this.feedbackQueue = [];
    this.maxConcurrentFeedbacks = 5;
    this.lastFeedbackTime = 0;
    this.feedbackCooldown = 50; // milliseconds
  }

  /**
   * Initialize the haptic feedback engine
   */
  initialize(particleEngine = null, theme = 'light') {
    this.particleEngine = particleEngine;
    this.theme = theme;
    
    // Initialize audio context for tactile audio feedback
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not available for haptic feedback');
    }
    
    // Setup visual texture styles
    this.setupTextureStyles();
    
    // Bind interaction listeners
    this.bindHapticTriggers();
    
    console.log('HapticFeedbackEngine initialized', {
      vibration: this.hasVibration,
      gamepad: this.hasGamepad,
      touch: this.hasTouch
    });
    
    return true;
  }

  /**
   * Setup CSS styles for visual texture overlays
   */
  setupTextureStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .haptic-texture-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .texture-soft-fabric {
        background: radial-gradient(circle at 50% 50%, 
          rgba(255, 240, 220, 0.1) 0%, 
          rgba(255, 228, 196, 0.05) 50%, 
          transparent 100%);
        animation: fabric-wave 2s ease-in-out infinite;
      }
      
      .texture-leather-grain {
        background: 
          repeating-linear-gradient(45deg, 
            rgba(139, 69, 19, 0.1) 0px, 
            rgba(139, 69, 19, 0.05) 2px, 
            transparent 4px),
          repeating-linear-gradient(-45deg, 
            rgba(160, 82, 45, 0.1) 0px, 
            rgba(160, 82, 45, 0.05) 2px, 
            transparent 4px);
        animation: leather-texture 1s ease-in-out;
      }
      
      .texture-metallic-shine {
        background: linear-gradient(45deg, 
          rgba(255, 215, 0, 0.2) 0%, 
          rgba(255, 215, 0, 0.1) 25%, 
          rgba(255, 215, 0, 0.3) 50%, 
          rgba(255, 215, 0, 0.1) 75%, 
          rgba(255, 215, 0, 0.2) 100%);
        animation: metallic-gleam 0.8s ease-out;
      }
      
      .texture-wood-grain {
        background: 
          repeating-linear-gradient(90deg, 
            rgba(139, 69, 19, 0.1) 0px, 
            rgba(160, 82, 45, 0.15) 3px, 
            rgba(139, 69, 19, 0.1) 6px);
        animation: wood-grain-shift 1.5s ease-in-out;
      }
      
      .texture-crystal-facets {
        background: 
          conic-gradient(from 0deg at 50% 50%, 
            rgba(255, 255, 255, 0.3) 0deg,
            rgba(173, 216, 230, 0.2) 60deg,
            rgba(255, 255, 255, 0.3) 120deg,
            rgba(173, 216, 230, 0.2) 180deg,
            rgba(255, 255, 255, 0.3) 240deg,
            rgba(173, 216, 230, 0.2) 300deg,
            rgba(255, 255, 255, 0.3) 360deg);
        animation: crystal-refraction 1s ease-out;
      }
      
      .texture-silk-flow {
        background: 
          radial-gradient(ellipse at 30% 40%, 
            rgba(255, 182, 193, 0.15) 0%, 
            transparent 50%),
          radial-gradient(ellipse at 70% 60%, 
            rgba(255, 192, 203, 0.1) 0%, 
            transparent 50%);
        animation: silk-ripple 2s ease-in-out;
      }
      
      .texture-holographic-interference {
        background: 
          linear-gradient(0deg, 
            rgba(0, 255, 255, 0.1) 0%, 
            rgba(255, 20, 147, 0.1) 25%, 
            rgba(138, 43, 226, 0.1) 50%, 
            rgba(50, 205, 50, 0.1) 75%, 
            rgba(0, 255, 255, 0.1) 100%);
        animation: hologram-flicker 0.6s ease-in-out;
      }
      
      .texture-plasma-arc {
        background: 
          radial-gradient(circle at 50% 50%, 
            rgba(255, 20, 147, 0.3) 0%, 
            rgba(138, 43, 226, 0.2) 30%, 
            rgba(0, 255, 255, 0.1) 60%, 
            transparent 100%);
        animation: plasma-pulse 0.4s ease-out;
      }
      
      .texture-neural-pulse {
        background: 
          repeating-radial-gradient(circle at 50% 50%, 
            rgba(50, 205, 50, 0.2) 0px, 
            rgba(50, 205, 50, 0.1) 20px, 
            transparent 40px);
        animation: neural-wave 1s ease-in-out;
      }
      
      .texture-quantum-field {
        background: 
          radial-gradient(circle at 25% 25%, 
            rgba(138, 43, 226, 0.1) 0%, 
            transparent 30%),
          radial-gradient(circle at 75% 75%, 
            rgba(0, 255, 255, 0.1) 0%, 
            transparent 30%),
          radial-gradient(circle at 50% 50%, 
            rgba(255, 20, 147, 0.05) 0%, 
            transparent 50%);
        animation: quantum-fluctuation 3s ease-in-out infinite;
      }
      
      .texture-matrix-code {
        background: 
          repeating-linear-gradient(0deg, 
            rgba(0, 255, 0, 0.1) 0px, 
            rgba(0, 255, 0, 0.05) 2px, 
            transparent 4px);
        animation: matrix-rain 0.8s linear;
      }
      
      .texture-neon-pulse {
        background: 
          radial-gradient(circle at 50% 50%, 
            rgba(0, 255, 255, 0.2) 0%, 
            rgba(255, 20, 147, 0.1) 50%, 
            transparent 100%);
        animation: neon-glow 0.5s ease-out;
      }
      
      @keyframes fabric-wave {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.02) rotate(1deg); }
      }
      
      @keyframes leather-texture {
        0% { opacity: 0; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes metallic-gleam {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes wood-grain-shift {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.05); }
      }
      
      @keyframes crystal-refraction {
        0% { transform: rotate(0deg) scale(0.8); opacity: 0; }
        100% { transform: rotate(360deg) scale(1); opacity: 1; }
      }
      
      @keyframes silk-ripple {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      @keyframes hologram-flicker {
        0%, 100% { opacity: 1; }
        25% { opacity: 0.3; }
        50% { opacity: 1; }
        75% { opacity: 0.7; }
      }
      
      @keyframes plasma-pulse {
        0% { transform: scale(0); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
      
      @keyframes neural-wave {
        0% { transform: scale(1); }
        100% { transform: scale(1.2); opacity: 0; }
      }
      
      @keyframes quantum-fluctuation {
        0%, 100% { opacity: 0.5; }
        33% { opacity: 0.8; }
        66% { opacity: 0.3; }
      }
      
      @keyframes matrix-rain {
        0% { transform: translateY(-20px); opacity: 0; }
        100% { transform: translateY(20px); opacity: 1; }
      }
      
      @keyframes neon-glow {
        0% { opacity: 0; filter: brightness(1); }
        50% { opacity: 1; filter: brightness(1.5); }
        100% { opacity: 0; filter: brightness(1); }
      }
      
      .haptic-visual-feedback {
        position: absolute;
        pointer-events: none;
        border-radius: 50%;
        animation: haptic-ripple 0.6s ease-out forwards;
      }
      
      @keyframes haptic-ripple {
        0% {
          width: 0;
          height: 0;
          opacity: 0.8;
        }
        100% {
          width: 100px;
          height: 100px;
          opacity: 0;
        }
      }
    `;
    
    // Remove existing haptic styles
    const existingStyle = document.getElementById('haptic-feedback-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    styleSheet.id = 'haptic-feedback-styles';
    document.head.appendChild(styleSheet);
  }

  /**
   * Bind haptic triggers to DOM interactions
   */
  bindHapticTriggers() {
    // Button interactions
    document.addEventListener('mouseenter', (e) => {
      if (e.target.tagName === 'BUTTON') {
        this.triggerHapticFeedback('buttons', 'hover', e.target);
      }
    }, true);

    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        this.triggerHapticFeedback('buttons', 'click', e.target);
      }
    }, true);

    // Navigation interactions
    document.addEventListener('click', (e) => {
      if (e.target.closest('.tv-nav-btn')) {
        this.triggerHapticFeedback('navigation', 'select', e.target);
      } else if (e.target.closest('.channel-indicator')) {
        this.triggerHapticFeedback('navigation', 'select', e.target);
      }
    }, true);

    // Touch interactions for mobile
    if (this.hasTouch) {
      document.addEventListener('touchstart', (e) => {
        this.triggerHapticFeedback('gestures', 'tap', e.target);
      }, true);

      document.addEventListener('touchend', (e) => {
        this.triggerHapticFeedback('gestures', 'release', e.target);
      }, true);
    }

    // Keyboard interactions
    document.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        this.triggerHapticFeedback('navigation', 'forward');
      } else if (e.key === 'Enter' || e.key === ' ') {
        this.triggerHapticFeedback('buttons', 'click');
      }
    });
  }

  /**
   * Trigger haptic feedback for specific context and action
   */
  triggerHapticFeedback(context, action, element = null) {
    if (!this.isEnabled || !this.isActive) return;
    
    // Throttle feedback to prevent overwhelming
    const now = Date.now();
    if (now - this.lastFeedbackTime < this.feedbackCooldown) return;
    this.lastFeedbackTime = now;
    
    const hapticConfig = this.contextualHaptics[context]?.[action];
    if (!hapticConfig) return;
    
    const patternType = this.theme === 'dark' ? 'futuristic' : 'belleEpoque';
    const pattern = this.hapticPatterns[patternType][hapticConfig.pattern];
    
    if (pattern) {
      this.executeHapticFeedback(pattern, hapticConfig.intensity, element);
    }
  }

  /**
   * Execute haptic feedback with vibration, visual, and audio components
   */
  executeHapticFeedback(pattern, intensity, element = null) {
    const adjustedIntensity = intensity * this.intensity;
    
    // Physical vibration
    this.triggerVibration(pattern.vibration, adjustedIntensity);
    
    // Visual texture overlay
    this.showTextureOverlay(pattern.visual, adjustedIntensity);
    
    // Audio feedback
    if (this.audioEnabled) {
      this.playHapticAudio(pattern.audio, adjustedIntensity);
    }
    
    // Visual ripple effect at interaction point
    if (element) {
      this.createVisualRipple(element, pattern.visual, adjustedIntensity);
    }
    
    // Particle system integration
    if (this.particleEngine && adjustedIntensity > 0.5) {
      this.triggerParticleHaptics(pattern.visual, adjustedIntensity);
    }
  }

  /**
   * Trigger device vibration
   */
  triggerVibration(vibrationPattern, intensity) {
    if (!this.hasVibration) return;
    
    // Scale vibration pattern by intensity
    const scaledPattern = vibrationPattern.map(duration => 
      Math.round(duration * intensity)
    );
    
    try {
      navigator.vibrate(scaledPattern);
    } catch (error) {
      console.warn('Vibration failed:', error);
    }
  }

  /**
   * Show visual texture overlay
   */
  showTextureOverlay(textureType, intensity) {
    // Remove existing overlays
    this.clearTextureOverlays();
    
    const overlay = document.createElement('div');
    overlay.className = `haptic-texture-overlay texture-${textureType}`;
    overlay.style.opacity = intensity * 0.8;
    
    document.body.appendChild(overlay);
    this.activeTextures.add(overlay);
    
    // Fade in
    requestAnimationFrame(() => {
      overlay.style.opacity = intensity * 0.8;
    });
    
    // Auto-remove after animation
    setTimeout(() => {
      this.removeTextureOverlay(overlay);
    }, 2000);
  }

  /**
   * Play haptic audio feedback
   */
  playHapticAudio(audioType, intensity) {
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Configure audio based on type
      switch (audioType) {
        case 'subtle-brush':
          oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
          oscillator.type = 'sine';
          break;
        case 'material-creak':
          oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
          oscillator.type = 'sawtooth';
          break;
        case 'metal-chime':
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
          oscillator.type = 'triangle';
          break;
        case 'wood-tap':
          oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
          oscillator.type = 'square';
          break;
        case 'crystal-ring':
          oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
          oscillator.type = 'sine';
          break;
        case 'fabric-rustle':
          oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
          oscillator.type = 'sawtooth';
          break;
        case 'digital-hum':
          oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
          oscillator.type = 'square';
          break;
        case 'energy-crackle':
          oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime);
          oscillator.type = 'sawtooth';
          break;
        case 'synaptic-fire':
          oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
          oscillator.type = 'triangle';
          break;
        case 'quantum-whisper':
          oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime);
          oscillator.type = 'sine';
          break;
        case 'data-stream':
          oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
          oscillator.type = 'square';
          break;
        case 'cyber-beep':
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
          oscillator.type = 'triangle';
          break;
        default:
          oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
          oscillator.type = 'sine';
      }
      
      // Configure gain
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(intensity * 0.1, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
      
      // Connect and play
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
      
    } catch (error) {
      console.warn('Haptic audio failed:', error);
    }
  }

  /**
   * Create visual ripple effect at interaction point
   */
  createVisualRipple(element, textureType, intensity) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const ripple = document.createElement('div');
    ripple.className = 'haptic-visual-feedback';
    ripple.style.left = centerX + 'px';
    ripple.style.top = centerY + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.background = this.getTextureColor(textureType, intensity);
    
    document.body.appendChild(ripple);
    
    // Remove after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  /**
   * Get color for texture type
   */
  getTextureColor(textureType, intensity) {
    const colors = {
      'soft-fabric': `rgba(255, 228, 196, ${intensity})`,
      'leather-grain': `rgba(139, 69, 19, ${intensity})`,
      'metallic-shine': `rgba(255, 215, 0, ${intensity})`,
      'wood-grain': `rgba(160, 82, 45, ${intensity})`,
      'crystal-facets': `rgba(173, 216, 230, ${intensity})`,
      'silk-flow': `rgba(255, 182, 193, ${intensity})`,
      'holographic-interference': `rgba(0, 255, 255, ${intensity})`,
      'plasma-arc': `rgba(255, 20, 147, ${intensity})`,
      'neural-pulse': `rgba(50, 205, 50, ${intensity})`,
      'quantum-field': `rgba(138, 43, 226, ${intensity})`,
      'matrix-code': `rgba(0, 255, 0, ${intensity})`,
      'neon-pulse': `rgba(0, 255, 255, ${intensity})`
    };
    
    return colors[textureType] || `rgba(255, 255, 255, ${intensity})`;
  }

  /**
   * Trigger particle effects for haptic feedback
   */
  triggerParticleHaptics(textureType, intensity) {
    if (!this.particleEngine) return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    if (textureType.includes('metallic') || textureType.includes('crystal')) {
      this.particleEngine.createEffect('ornamentBurst', centerX, centerY, {
        count: Math.ceil(intensity * 5),
        style: 'haptic-shimmer'
      });
    } else if (textureType.includes('holographic') || textureType.includes('plasma')) {
      this.particleEngine.createEffect('holographicPulse', centerX, centerY, {
        count: Math.ceil(intensity * 8),
        style: 'haptic-digital'
      });
    } else if (textureType.includes('neural') || textureType.includes('quantum')) {
      this.particleEngine.createEffect('vineGrowth', centerX, centerY, {
        segments: Math.ceil(intensity * 6),
        style: 'haptic-neural'
      });
    }
  }

  /**
   * Clear all texture overlays
   */
  clearTextureOverlays() {
    this.activeTextures.forEach(overlay => {
      this.removeTextureOverlay(overlay);
    });
    this.activeTextures.clear();
  }

  /**
   * Remove specific texture overlay
   */
  removeTextureOverlay(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }
    this.activeTextures.delete(overlay);
  }

  /**
   * Manual haptic feedback trigger
   */
  triggerManualFeedback(patternName, intensity = 0.7) {
    const patternType = this.theme === 'dark' ? 'futuristic' : 'belleEpoque';
    const pattern = this.hapticPatterns[patternType][patternName];
    
    if (pattern) {
      this.executeHapticFeedback(pattern, intensity);
    }
  }

  /**
   * Enable/disable haptic feedback
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.clearTextureOverlays();
    }
  }

  /**
   * Set haptic intensity
   */
  setIntensity(intensity) {
    this.intensity = Math.max(0, Math.min(1, intensity));
  }

  /**
   * Set theme
   */
  setTheme(theme) {
    this.theme = theme;
  }

  /**
   * Start haptic feedback engine
   */
  start() {
    this.isActive = true;
    console.log('HapticFeedbackEngine started');
  }

  /**
   * Stop haptic feedback engine
   */
  stop() {
    this.isActive = false;
    this.clearTextureOverlays();
    console.log('HapticFeedbackEngine stopped');
  }

  /**
   * Get capability information
   */
  getCapabilities() {
    return {
      vibration: this.hasVibration,
      gamepad: this.hasGamepad,
      touch: this.hasTouch,
      audio: !!this.audioContext,
      enabled: this.isEnabled,
      intensity: this.intensity
    };
  }
}

// Singleton instance
let hapticFeedbackEngine = null;

export function getHapticFeedbackEngine() {
  if (!hapticFeedbackEngine) {
    hapticFeedbackEngine = new HapticFeedbackEngine();
  }
  return hapticFeedbackEngine;
}

export default HapticFeedbackEngine;