/**
 * Belle Époque-Futuristic Audio Reactive Engine
 * 
 * Creates dynamic visual effects that respond to ambient channel sounds:
 * - Vintage gramophone visualizations with golden ornamental patterns
 * - Cyberpunk spectrum analyzers with neon holographic displays
 * - Belle Époque phonograph cylinder animations with Art Nouveau styling
 * - Futuristic waveform analyzers with matrix-style particle cascades
 * - Adaptive frequency response tuned to different channel contexts
 * - Seamless blending between classical and digital visualization modes
 */

class AudioReactiveEngine {
  constructor() {
    this.isActive = false;
    this.audioContext = null;
    this.analyser = null;
    this.frequencyData = null;
    this.timeData = null;
    this.bufferLength = 0;
    this.visualizationMode = 'gramophone'; // 'gramophone' | 'spectrum-analyzer'
    this.theme = 'light';
    this.particleEngine = null;
    this.channelContext = 'default';
    this.sensitivity = 0.7;
    this.smoothing = 0.8;
    
    // Audio source types
    this.audioSources = new Map();
    this.currentSource = null;
    this.isMuted = false;
    
    // Visualization parameters
    this.visualizationConfig = {
      gramophone: {
        centerRadius: 80,
        maxRadius: 200,
        ornamentCount: 12,
        rotationSpeed: 0.02,
        vinylGrooves: 24,
        needlePosition: 0.7,
        belleEpoqueColors: ['#FFD700', '#B8860B', '#CD853F', '#DEB887'],
        artNouveauPatterns: true
      },
      spectrumAnalyzer: {
        barCount: 64,
        barWidth: 8,
        barSpacing: 2,
        maxHeight: 150,
        glowIntensity: 0.8,
        matrixCascade: true,
        cyberpunkColors: ['#00FFFF', '#FF1493', '#8A2BE2', '#32CD32'],
        holographicEffects: true
      }
    };
    
    // Channel-specific audio contexts
    this.channelAudioProfiles = {
      gallery: {
        ambientFreq: [20, 200],
        responseType: 'smooth',
        visualStyle: 'artistic',
        particleSync: 'gentle'
      },
      mindmap: {
        ambientFreq: [100, 1000],
        responseType: 'intellectual',
        visualStyle: 'neural',
        particleSync: 'thought-waves'
      },
      game: {
        ambientFreq: [200, 4000],
        responseType: 'dynamic',
        visualStyle: 'energetic',
        particleSync: 'explosive'
      },
      atelier: {
        ambientFreq: [50, 500],
        responseType: 'creative',
        visualStyle: 'flowing',
        particleSync: 'brush-strokes'
      }
    };
    
    // Animation state
    this.animationFrame = null;
    this.startTime = Date.now();
    this.lastFrameTime = 0;
    
    // Event callbacks
    this.visualizationCallbacks = new Set();
  }

  /**
   * Initialize the audio reactive engine
   */
  async initialize(particleEngine = null, theme = 'light') {
    this.particleEngine = particleEngine;
    this.theme = theme;
    
    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      
      // Configure analyser
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = this.smoothing;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.frequencyData = new Uint8Array(this.bufferLength);
      this.timeData = new Uint8Array(this.bufferLength);
      
      // Connect to audio destination for monitoring
      this.analyser.connect(this.audioContext.destination);
      
      console.log('AudioReactiveEngine initialized successfully');
      return true;
    } catch (error) {
      console.warn('Failed to initialize AudioReactiveEngine:', error);
      this.initializeFallbackMode();
      return false;
    }
  }

  /**
   * Initialize fallback mode with simulated audio data
   */
  initializeFallbackMode() {
    console.log('AudioReactiveEngine running in fallback mode with simulated audio');
    this.bufferLength = 128;
    this.frequencyData = new Uint8Array(this.bufferLength);
    this.timeData = new Uint8Array(this.bufferLength);
    
    // Generate simulated audio data
    this.simulateAudioData();
  }

  /**
   * Generate simulated audio data for fallback mode
   */
  simulateAudioData() {
    const time = (Date.now() - this.startTime) / 1000;
    
    for (let i = 0; i < this.bufferLength; i++) {
      // Create realistic frequency distribution
      const freq = (i / this.bufferLength) * 22050; // Nyquist frequency
      let amplitude = 0;
      
      // Low frequencies (bass) - more prominent
      if (freq < 200) {
        amplitude = 120 + Math.sin(time * 2 + i * 0.1) * 30;
      }
      // Mid frequencies
      else if (freq < 2000) {
        amplitude = 80 + Math.sin(time * 3 + i * 0.05) * 40;
      }
      // High frequencies - less prominent
      else {
        amplitude = 40 + Math.sin(time * 5 + i * 0.02) * 20;
      }
      
      // Add channel-specific variations
      amplitude *= this.getChannelMultiplier(freq);
      
      // Add some randomness
      amplitude += (Math.random() - 0.5) * 20;
      
      this.frequencyData[i] = Math.max(0, Math.min(255, amplitude));
      this.timeData[i] = Math.sin(time * 10 + i * 0.1) * 128 + 128;
    }
  }

  /**
   * Get channel-specific frequency multipliers
   */
  getChannelMultiplier(frequency) {
    const profile = this.channelAudioProfiles[this.channelContext];
    if (!profile) return 1;
    
    const [minFreq, maxFreq] = profile.ambientFreq;
    if (frequency >= minFreq && frequency <= maxFreq) {
      return 1.5; // Boost channel-relevant frequencies
    }
    return 0.8;
  }

  /**
   * Add audio source (microphone, ambient sounds, etc.)
   */
  async addAudioSource(sourceType = 'microphone') {
    if (!this.audioContext) return null;
    
    try {
      let source = null;
      
      switch (sourceType) {
        case 'microphone':
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: { 
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false
            } 
          });
          source = this.audioContext.createMediaStreamSource(stream);
          break;
          
        case 'ambient':
          // Create oscillator for ambient sound simulation
          source = this.audioContext.createOscillator();
          source.frequency.setValueAtTime(220, this.audioContext.currentTime);
          source.type = 'sine';
          break;
          
        default:
          console.warn(`Unknown audio source type: ${sourceType}`);
          return null;
      }
      
      // Connect source to analyser
      source.connect(this.analyser);
      this.audioSources.set(sourceType, source);
      this.currentSource = source;
      
      console.log(`Audio source '${sourceType}' added successfully`);
      return source;
    } catch (error) {
      console.warn(`Failed to add audio source '${sourceType}':`, error);
      return null;
    }
  }

  /**
   * Start audio reactive visualizations
   */
  start(channelContext = 'default') {
    if (this.isActive) return;
    
    this.isActive = true;
    this.channelContext = channelContext;
    this.startTime = Date.now();
    
    // Resume audio context if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    // Start animation loop
    this.animate();
    
    console.log(`AudioReactiveEngine started for channel: ${channelContext}`);
  }

  /**
   * Stop audio reactive visualizations
   */
  stop() {
    if (!this.isActive) return;
    
    this.isActive = false;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    console.log('AudioReactiveEngine stopped');
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isActive) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    // Update audio data
    if (this.audioContext) {
      this.analyser.getByteFrequencyData(this.frequencyData);
      this.analyser.getByteTimeDomainData(this.timeData);
    } else {
      this.simulateAudioData();
    }
    
    // Generate visualizations
    this.generateVisualizations(deltaTime);
    
    // Create particle effects
    this.createAudioParticleEffects();
    
    // Schedule next frame
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Generate audio visualizations
   */
  generateVisualizations(deltaTime) {
    switch (this.visualizationMode) {
      case 'gramophone':
        this.generateGramophoneVisualization(deltaTime);
        break;
      case 'spectrum-analyzer':
        this.generateSpectrumAnalyzerVisualization(deltaTime);
        break;
    }
    
    // Notify callbacks
    this.notifyVisualizationCallbacks({
      frequencyData: this.frequencyData,
      timeData: this.timeData,
      mode: this.visualizationMode,
      theme: this.theme,
      channelContext: this.channelContext
    });
  }

  /**
   * Generate Belle Époque gramophone visualization
   */
  generateGramophoneVisualization(deltaTime) {
    const config = this.visualizationConfig.gramophone;
    const time = (Date.now() - this.startTime) / 1000;
    
    // Calculate average amplitude for vinyl rotation speed
    const avgAmplitude = this.frequencyData.reduce((sum, val) => sum + val, 0) / this.bufferLength;
    const rotationSpeed = config.rotationSpeed * (1 + avgAmplitude / 255);
    
    // Create vintage gramophone particle effects
    if (this.particleEngine && avgAmplitude > 50) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Vinyl record grooves
      for (let i = 0; i < config.ornamentCount; i++) {
        const angle = (time * rotationSpeed + (i / config.ornamentCount) * Math.PI * 2);
        const radius = config.centerRadius + (avgAmplitude / 255) * (config.maxRadius - config.centerRadius);
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (Math.random() < 0.1) {
          this.particleEngine.createEffect('ornamentBurst', x, y, {
            count: 2,
            colors: config.belleEpoqueColors,
            style: 'vintage-notes'
          });
        }
      }
      
      // Art Nouveau ornamental patterns
      if (config.artNouveauPatterns && Math.random() < 0.05) {
        this.particleEngine.createEffect('vineGrowth', centerX, centerY, {
          segments: 8,
          length: avgAmplitude * 2,
          colors: config.belleEpoqueColors
        });
      }
    }
  }

  /**
   * Generate cyberpunk spectrum analyzer visualization
   */
  generateSpectrumAnalyzerVisualization(deltaTime) {
    const config = this.visualizationConfig.spectrumAnalyzer;
    
    if (!this.particleEngine) return;
    
    const centerX = window.innerWidth / 2;
    const bottomY = window.innerHeight - 100;
    const barWidth = (window.innerWidth * 0.8) / config.barCount;
    
    // Generate spectrum bars with particle effects
    for (let i = 0; i < Math.min(config.barCount, this.bufferLength); i++) {
      const amplitude = this.frequencyData[i];
      const normalizedAmplitude = amplitude / 255;
      const barHeight = normalizedAmplitude * config.maxHeight;
      
      if (amplitude > 30) {
        const x = centerX - (config.barCount * barWidth) / 2 + i * barWidth;
        const y = bottomY - barHeight;
        
        // Create cyberpunk spectrum particles
        if (Math.random() < normalizedAmplitude * 0.3) {
          this.particleEngine.createEffect('holographicPulse', x, y, {
            count: Math.ceil(normalizedAmplitude * 5),
            colors: config.cyberpunkColors,
            style: 'spectrum-bar'
          });
        }
        
        // Matrix cascade effect for high frequencies
        if (config.matrixCascade && i > config.barCount * 0.7 && amplitude > 100) {
          this.particleEngine.createEffect('matrixRain', x, y - 50, {
            density: normalizedAmplitude * 0.1,
            colors: ['#00FF00', '#00FFFF']
          });
        }
      }
    }
    
    // Holographic scan line effect
    if (config.holographicEffects && Math.random() < 0.02) {
      this.particleEngine.createEffect('holographicPulse', centerX, bottomY - 50, {
        count: 20,
        colors: config.cyberpunkColors,
        style: 'scan-line'
      });
    }
  }

  /**
   * Create audio-synchronized particle effects
   */
  createAudioParticleEffects() {
    if (!this.particleEngine) return;
    
    const profile = this.channelAudioProfiles[this.channelContext];
    if (!profile) return;
    
    // Calculate frequency domain energy
    const lowFreqEnergy = this.getFrequencyBandEnergy(0, 0.1);
    const midFreqEnergy = this.getFrequencyBandEnergy(0.1, 0.6);
    const highFreqEnergy = this.getFrequencyBandEnergy(0.6, 1.0);
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Channel-specific particle synchronization
    switch (profile.particleSync) {
      case 'gentle':
        if (lowFreqEnergy > 0.3 && Math.random() < 0.1) {
          this.particleEngine.createEffect('ornamentBurst', centerX, centerY, {
            count: Math.ceil(lowFreqEnergy * 5),
            style: 'gentle-waves'
          });
        }
        break;
        
      case 'thought-waves':
        if (midFreqEnergy > 0.4 && Math.random() < 0.15) {
          this.particleEngine.createEffect('vineGrowth', centerX, centerY, {
            segments: Math.ceil(midFreqEnergy * 10),
            style: 'neural-network'
          });
        }
        break;
        
      case 'explosive':
        if (highFreqEnergy > 0.5 && Math.random() < 0.2) {
          this.particleEngine.createEffect('holographicPulse', centerX, centerY, {
            count: Math.ceil(highFreqEnergy * 15),
            style: 'explosive-burst'
          });
        }
        break;
        
      case 'brush-strokes':
        if (midFreqEnergy > 0.3 && Math.random() < 0.12) {
          const randomX = centerX + (Math.random() - 0.5) * 400;
          const randomY = centerY + (Math.random() - 0.5) * 300;
          this.particleEngine.createEffect('clockwork', randomX, randomY, {
            style: 'artistic-brush'
          });
        }
        break;
    }
  }

  /**
   * Get energy level for a frequency band
   */
  getFrequencyBandEnergy(startRatio, endRatio) {
    const startIndex = Math.floor(startRatio * this.bufferLength);
    const endIndex = Math.floor(endRatio * this.bufferLength);
    
    let sum = 0;
    for (let i = startIndex; i < endIndex; i++) {
      sum += this.frequencyData[i];
    }
    
    return (sum / (endIndex - startIndex)) / 255;
  }

  /**
   * Switch visualization mode
   */
  setVisualizationMode(mode) {
    if (mode !== this.visualizationMode) {
      this.visualizationMode = mode;
      console.log(`AudioReactiveEngine visualization mode changed to: ${mode}`);
    }
  }

  /**
   * Update theme
   */
  setTheme(theme) {
    this.theme = theme;
    
    // Adjust visualization parameters based on theme
    if (theme === 'dark') {
      this.visualizationConfig.gramophone.belleEpoqueColors = ['#FFD700', '#FFA500', '#FF8C00', '#DAA520'];
      this.visualizationConfig.spectrumAnalyzer.cyberpunkColors = ['#00FFFF', '#FF1493', '#8A2BE2', '#32CD32'];
    } else {
      this.visualizationConfig.gramophone.belleEpoqueColors = ['#B8860B', '#CD853F', '#DEB887', '#F4A460'];
      this.visualizationConfig.spectrumAnalyzer.cyberpunkColors = ['#1E90FF', '#FF69B4', '#9370DB', '#228B22'];
    }
  }

  /**
   * Add visualization callback
   */
  onVisualization(callback) {
    this.visualizationCallbacks.add(callback);
  }

  /**
   * Remove visualization callback
   */
  offVisualization(callback) {
    this.visualizationCallbacks.delete(callback);
  }

  /**
   * Notify visualization callbacks
   */
  notifyVisualizationCallbacks(data) {
    this.visualizationCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.warn('Error in visualization callback:', error);
      }
    });
  }

  /**
   * Get current audio analysis data
   */
  getAudioData() {
    return {
      frequencyData: this.frequencyData,
      timeData: this.timeData,
      isActive: this.isActive,
      mode: this.visualizationMode,
      channelContext: this.channelContext,
      lowFreqEnergy: this.getFrequencyBandEnergy(0, 0.1),
      midFreqEnergy: this.getFrequencyBandEnergy(0.1, 0.6),
      highFreqEnergy: this.getFrequencyBandEnergy(0.6, 1.0)
    };
  }

  /**
   * Cleanup and dispose
   */
  dispose() {
    this.stop();
    
    // Stop all audio sources
    this.audioSources.forEach(source => {
      if (source.stop) source.stop();
      if (source.disconnect) source.disconnect();
    });
    this.audioSources.clear();
    
    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    
    this.visualizationCallbacks.clear();
    console.log('AudioReactiveEngine disposed');
  }
}

// Singleton instance
let audioReactiveEngine = null;

export function getAudioReactiveEngine() {
  if (!audioReactiveEngine) {
    audioReactiveEngine = new AudioReactiveEngine();
  }
  return audioReactiveEngine;
}

export default AudioReactiveEngine;