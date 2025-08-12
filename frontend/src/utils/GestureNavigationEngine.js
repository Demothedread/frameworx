/**
 * Belle Époque-Futuristic Gesture Navigation Engine
 * 
 * Implements hand tracking and gesture recognition for immersive channel switching:
 * - Victorian conductor baton movements for elegant navigation
 * - Futuristic hand tracking with digital interface projections
 * - Belle Époque conducting gestures triggering cyberpunk transitions
 * - Graceful fallback to mouse/keyboard when camera unavailable
 * - Particle effect integration for visual feedback
 */

class GestureNavigationEngine {
  constructor() {
    this.isActive = false;
    this.isHandTrackingEnabled = false;
    this.gestureMode = 'conductor'; // 'conductor' | 'digital-interface'
    this.hands = null;
    this.camera = null;
    this.lastGesture = null;
    this.gestureThreshold = 0.8;
    this.conductorPosition = { x: 0, y: 0, z: 0 };
    this.gestureHistory = [];
    this.gestureCallbacks = new Map();
    this.particleEngine = null;
    this.isInitialized = false;
    
    // Gesture patterns for Belle Époque conductor movements
    this.conductorGestures = {
      'swipe-right': {
        name: 'Elegant Right Flourish',
        description: 'Graceful conductor movement to advance',
        pattern: 'horizontal-right',
        action: 'next-channel',
        belleEpoqueStyle: 'flowing-crescendo',
        futuristicStyle: 'holographic-advance'
      },
      'swipe-left': {
        name: 'Distinguished Left Sweep',
        description: 'Refined conductor gesture to retreat',
        pattern: 'horizontal-left',
        action: 'prev-channel',
        belleEpoqueStyle: 'diminuendo-retreat',
        futuristicStyle: 'digital-rewind'
      },
      'upward-flourish': {
        name: 'Triumphant Ascension',
        description: 'Uplifting baton movement for elevation',
        pattern: 'vertical-up',
        action: 'theme-toggle',
        belleEpoqueStyle: 'orchestral-climax',
        futuristicStyle: 'matrix-elevation'
      },
      'circular-motion': {
        name: 'Mystical Circle Casting',
        description: 'Circular conductor pattern for special actions',
        pattern: 'circular-clockwise',
        action: 'fortune-wheel',
        belleEpoqueStyle: 'waltz-tempo',
        futuristicStyle: 'hologram-rotation'
      },
      'downward-strike': {
        name: 'Decisive Downbeat',
        description: 'Commanding downward gesture for selection',
        pattern: 'vertical-down',
        action: 'select-action',
        belleEpoqueStyle: 'forte-command',
        futuristicStyle: 'digital-execute'
      },
      'double-tap': {
        name: 'Refined Double Touch',
        description: 'Elegant double gesture for confirmation',
        pattern: 'double-point',
        action: 'confirm-selection',
        belleEpoqueStyle: 'staccato-precision',
        futuristicStyle: 'binary-confirm'
      }
    };

    // Futuristic gesture patterns
    this.digitalGestures = {
      'open-palm': {
        name: 'Interface Activation',
        description: 'Open palm to activate digital interface',
        pattern: 'palm-open',
        action: 'activate-interface',
        effect: 'holographic-bloom'
      },
      'pinch-zoom': {
        name: 'Zoom Manipulation',
        description: 'Pinch gestures for zoom control',
        pattern: 'pinch-dynamic',
        action: 'zoom-interface',
        effect: 'perspective-shift'
      },
      'finger-point': {
        name: 'Precision Selection',
        description: 'Point to select interface elements',
        pattern: 'index-point',
        action: 'point-select',
        effect: 'targeting-beam'
      }
    };
  }

  /**
   * Initialize the gesture navigation system
   */
  async initialize(particleEngine = null) {
    if (this.isInitialized) return true;

    this.particleEngine = particleEngine;

    try {
      // Check if MediaPipe Hands is available
      if (typeof window !== 'undefined' && window.Hands) {
        await this.initializeHandTracking();
      } else {
        console.log('MediaPipe Hands not available, using fallback gesture simulation');
        this.initializeFallbackGestures();
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn('Failed to initialize gesture navigation:', error);
      this.initializeFallbackGestures();
      this.isInitialized = true;
      return false;
    }
  }

  /**
   * Initialize MediaPipe hand tracking
   */
  async initializeHandTracking() {
    try {
      // Initialize MediaPipe Hands
      this.hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      this.hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.hands.onResults((results) => {
        this.processHandResults(results);
      });

      // Initialize camera
      this.camera = new window.Camera(document.createElement('video'), {
        onFrame: async () => {
          if (this.hands) {
            await this.hands.send({ image: this.camera.video });
          }
        },
        width: 640,
        height: 480
      });

      this.isHandTrackingEnabled = true;
    } catch (error) {
      console.warn('Hand tracking initialization failed:', error);
      this.initializeFallbackGestures();
    }
  }

  /**
   * Initialize fallback gesture simulation using mouse movements
   */
  initializeFallbackGestures() {
    this.isHandTrackingEnabled = false;
    
    // Simulate gestures with mouse movements and keyboard shortcuts
    document.addEventListener('mousemove', (e) => {
      if (this.isActive) {
        this.simulateHandPosition(e.clientX, e.clientY);
      }
    });

    // Keyboard shortcuts for gesture simulation
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) return;

      switch (e.key) {
        case 'ArrowRight':
          if (e.ctrlKey) {
            e.preventDefault();
            this.triggerGesture('swipe-right');
          }
          break;
        case 'ArrowLeft':
          if (e.ctrlKey) {
            e.preventDefault();
            this.triggerGesture('swipe-left');
          }
          break;
        case 'ArrowUp':
          if (e.ctrlKey) {
            e.preventDefault();
            this.triggerGesture('upward-flourish');
          }
          break;
        case 'ArrowDown':
          if (e.ctrlKey) {
            e.preventDefault();
            this.triggerGesture('downward-strike');
          }
          break;
        case ' ':
          if (e.ctrlKey) {
            e.preventDefault();
            this.triggerGesture('circular-motion');
          }
          break;
        case 'Enter':
          if (e.ctrlKey) {
            e.preventDefault();
            this.triggerGesture('double-tap');
          }
          break;
      }
    });
  }

  /**
   * Simulate hand position for fallback mode
   */
  simulateHandPosition(mouseX, mouseY) {
    const normalizedX = (mouseX / window.innerWidth) * 2 - 1;
    const normalizedY = (mouseY / window.innerHeight) * 2 - 1;
    
    this.conductorPosition = {
      x: normalizedX,
      y: -normalizedY, // Invert Y for conductor-like movement
      z: 0
    };

    // Create subtle particle effects for mouse tracking
    if (this.particleEngine && Math.random() < 0.1) {
      this.particleEngine.createEffect('clockwork', mouseX, mouseY);
    }
  }

  /**
   * Process hand tracking results from MediaPipe
   */
  processHandResults(results) {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return;
    }

    const hand = results.multiHandLandmarks[0];
    const landmarks = hand;

    // Calculate hand position and orientation
    const wrist = landmarks[0];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];

    this.conductorPosition = {
      x: (wrist.x * 2) - 1,
      y: (wrist.y * 2) - 1,
      z: wrist.z || 0
    };

    // Detect conductor gestures
    this.detectConductorGestures(landmarks);
  }

  /**
   * Detect conductor-style gestures from hand landmarks
   */
  detectConductorGestures(landmarks) {
    if (!landmarks || landmarks.length < 21) return;

    const wrist = landmarks[0];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const thumbTip = landmarks[4];

    // Calculate gesture vectors
    const handVector = {
      x: indexTip.x - wrist.x,
      y: indexTip.y - wrist.y,
      z: (indexTip.z || 0) - (wrist.z || 0)
    };

    // Add to gesture history
    this.gestureHistory.push({
      timestamp: Date.now(),
      position: this.conductorPosition,
      vector: handVector
    });

    // Keep only recent history (last 1 second)
    const cutoff = Date.now() - 1000;
    this.gestureHistory = this.gestureHistory.filter(g => g.timestamp > cutoff);

    // Analyze gesture patterns
    this.analyzeGesturePattern();
  }

  /**
   * Analyze gesture patterns to detect conductor movements
   */
  analyzeGesturePattern() {
    if (this.gestureHistory.length < 10) return;

    const recent = this.gestureHistory.slice(-10);
    const deltaX = recent[recent.length - 1].position.x - recent[0].position.x;
    const deltaY = recent[recent.length - 1].position.y - recent[0].position.y;

    const threshold = 0.3;
    let detectedGesture = null;

    // Horizontal movements (conductor left/right)
    if (Math.abs(deltaX) > threshold && Math.abs(deltaY) < threshold * 0.5) {
      detectedGesture = deltaX > 0 ? 'swipe-right' : 'swipe-left';
    }
    // Vertical movements (conductor up/down)
    else if (Math.abs(deltaY) > threshold && Math.abs(deltaX) < threshold * 0.5) {
      detectedGesture = deltaY > 0 ? 'downward-strike' : 'upward-flourish';
    }
    // Circular movements
    else if (this.detectCircularMotion(recent)) {
      detectedGesture = 'circular-motion';
    }

    if (detectedGesture && detectedGesture !== this.lastGesture) {
      this.triggerGesture(detectedGesture);
      this.lastGesture = detectedGesture;
      
      // Clear history to prevent repeated detection
      setTimeout(() => {
        this.lastGesture = null;
      }, 1000);
    }
  }

  /**
   * Detect circular motion patterns
   */
  detectCircularMotion(points) {
    if (points.length < 8) return false;

    let angles = [];
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].position.x - points[i-1].position.x;
      const dy = points[i].position.y - points[i-1].position.y;
      angles.push(Math.atan2(dy, dx));
    }

    // Check if angles progress in a circular pattern
    let totalRotation = 0;
    for (let i = 1; i < angles.length; i++) {
      let angleDiff = angles[i] - angles[i-1];
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
      totalRotation += angleDiff;
    }

    return Math.abs(totalRotation) > Math.PI; // At least half circle
  }

  /**
   * Trigger a gesture and execute associated actions
   */
  triggerGesture(gestureId) {
    const gesture = this.conductorGestures[gestureId] || this.digitalGestures[gestureId];
    if (!gesture) return;

    console.log(`Gesture detected: ${gesture.name} - ${gesture.description}`);

    // Create visual feedback
    this.createGestureVisualFeedback(gesture);

    // Execute gesture callbacks
    const callback = this.gestureCallbacks.get(gesture.action);
    if (callback) {
      callback(gesture);
    }

    // Track gesture for analytics
    this.trackGestureUsage(gestureId, gesture);
  }

  /**
   * Create visual feedback for gestures
   */
  createGestureVisualFeedback(gesture) {
    if (!this.particleEngine) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    switch (gesture.action) {
      case 'next-channel':
        this.particleEngine.createEffect('holographicPulse', centerX + 100, centerY, { count: 20 });
        break;
      case 'prev-channel':
        this.particleEngine.createEffect('ornamentBurst', centerX - 100, centerY);
        break;
      case 'theme-toggle':
        this.particleEngine.createEffect('vineGrowth', centerX, centerY - 50, { segments: 15 });
        break;
      case 'fortune-wheel':
        this.particleEngine.createEffect('clockwork', centerX, centerY);
        break;
      case 'select-action':
        this.particleEngine.createEffect('holographicPulse', centerX, centerY + 50, { count: 10 });
        break;
      default:
        this.particleEngine.createEffect('ornamentBurst', centerX, centerY);
    }
  }

  /**
   * Register gesture callbacks
   */
  onGesture(action, callback) {
    this.gestureCallbacks.set(action, callback);
  }

  /**
   * Start gesture navigation
   */
  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    this.isActive = true;

    if (this.isHandTrackingEnabled && this.camera) {
      await this.camera.start();
    }

    console.log('Gesture navigation started');
    return true;
  }

  /**
   * Stop gesture navigation
   */
  stop() {
    this.isActive = false;

    if (this.camera) {
      this.camera.stop();
    }

    console.log('Gesture navigation stopped');
  }

  /**
   * Toggle gesture mode between conductor and digital interface
   */
  toggleGestureMode() {
    this.gestureMode = this.gestureMode === 'conductor' ? 'digital-interface' : 'conductor';
    console.log(`Gesture mode switched to: ${this.gestureMode}`);
  }

  /**
   * Get current gesture capabilities info
   */
  getCapabilities() {
    return {
      isHandTrackingEnabled: this.isHandTrackingEnabled,
      isActive: this.isActive,
      gestureMode: this.gestureMode,
      availableGestures: Object.keys(this.conductorGestures),
      fallbackMode: !this.isHandTrackingEnabled
    };
  }

  /**
   * Track gesture usage for analytics
   */
  trackGestureUsage(gestureId, gesture) {
    // This could integrate with the gamification system
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gesture_used', {
        gesture_id: gestureId,
        gesture_name: gesture.name,
        gesture_mode: this.gestureMode
      });
    }
  }

  /**
   * Get gesture tutorials for user onboarding
   */
  getGestureTutorials() {
    return {
      conductor: {
        title: 'Belle Époque Conductor Navigation',
        description: 'Navigate like a distinguished orchestra conductor',
        gestures: this.conductorGestures
      },
      digital: {
        title: 'Futuristic Interface Control',
        description: 'Control the digital interface with natural hand movements',
        gestures: this.digitalGestures
      },
      fallback: {
        title: 'Keyboard Gesture Simulation',
        description: 'Use Ctrl + Arrow keys to simulate conductor gestures',
        shortcuts: [
          'Ctrl + → : Next Channel (Right Flourish)',
          'Ctrl + ← : Previous Channel (Left Sweep)',
          'Ctrl + ↑ : Toggle Theme (Upward Flourish)',
          'Ctrl + ↓ : Select Action (Downward Strike)',
          'Ctrl + Space : Fortune Wheel (Circular Motion)',
          'Ctrl + Enter : Confirm (Double Tap)'
        ]
      }
    };
  }
}

// Singleton instance
let gestureNavigationEngine = null;

export function getGestureNavigationEngine() {
  if (!gestureNavigationEngine) {
    gestureNavigationEngine = new GestureNavigationEngine();
  }
  return gestureNavigationEngine;
}

export default GestureNavigationEngine;