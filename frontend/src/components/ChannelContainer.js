import React, { useState, useRef, useEffect } from 'react';

import Admin from './channels/Admin';
import Atelier from './channels/Atelier';
import Blog from './channels/Blog';
import Chatbot from './channels/Chatbot';
import Gallery from './channels/Gallery';
import Game from './channels/Game';
import Landing from './channels/Landing';
import LiveVideo from './channels/LiveVideo';
import MindMap from './channels/MindMap';
import Productivity from './channels/Productivity'; 
import ThreeGame from './channels/ThreeGame';
import UploadAndSort from './channels/UploadAndSort';

import channelThemes from './channelThemes';
import useParticleEngine from '../hooks/useParticleEngine';
import GamificationHUD from './gamification/GamificationHUD';
import FortuneWheel from './gamification/FortuneWheel';
import GestureControlInterface from './gesture/GestureControlInterface';
import AudioVisualizationInterface from './audio/AudioVisualizationInterface';
import { getGamificationSystem } from '../utils/GamificationSystem';
import { getMicroAnimationEngine } from '../utils/MicroAnimationEngine';
import { getLoadingStateEngine } from '../utils/LoadingStateEngine';
import { getHapticFeedbackEngine } from '../utils/HapticFeedbackEngine';

const CHANNELS = [
  { key: 'admin', name: 'Admin', Component: Admin },
  { key: 'atelier', name: 'Art Atelier', Component: Atelier },
  { key: 'blog', name: 'Blog (CMS)', Component: Blog },
  { key: 'chatbot', name: 'Chatbot', Component: Chatbot },
  { key: 'gallery', name: 'Image Gallery', Component: Gallery },
  { key: 'game', name: 'Game (Sample)', Component: Game },
  { key: 'landing', name: 'Landing', Component: Landing },
  { key: 'livevideo', name: 'Live Video', Component: LiveVideo },
  { key: 'mindmap', name: 'Mind Map', Component: MindMap },
  { key: 'productivity', name: 'Productivity', Component: Productivity },
  { key: 'threegame', name: 'Three.js Game', Component: ThreeGame },
  { key: 'uploadandsort', name: 'Upload & Sort', Component: UploadAndSort },
];

// Enhanced Animation CSS with Belle Époque-Futurism styling
const tvAnimStyles = `
.channel-flip-outer {
  position: relative;
  width: 100vw;
  min-height: 360px;
  background: var(--primary-color, #141519);
  overflow: hidden;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: all;
  z-index: 1;
}

.tv-channel-inner {
  position: relative;
  z-index: 2;
  transition: transform 0.8s cubic-bezier(.25,.46,.45,.94), opacity 0.6s cubic-bezier(.55,0,.5,1);
  will-change: transform, opacity;
}

.tv-flip {
  animation: belle-epoque-transition 0.8s 1;
}

@keyframes belle-epoque-transition {
  0% {
    opacity: 0;
    transform: perspective(1000px) rotateY(90deg) scale(1.2);
    filter: brightness(2) grayscale(.8) sepia(0.3) hue-rotate(30deg);
  }
  25% {
    opacity: 0.3;
    filter: contrast(1.5) brightness(1.5) blur(3px) sepia(0.5) hue-rotate(45deg);
    transform: perspective(1000px) rotateY(45deg) scale(1.1);
  }
  50% {
    filter: brightness(0.7) contrast(0.3) saturate(3) grayscale(0.9) drop-shadow(0 0 20px gold);
    transform: perspective(1000px) rotateY(15deg) scale(1.05);
  }
  75% {
    filter: contrast(1.2) brightness(1.1) drop-shadow(0 0 10px cyan);
    transform: perspective(1000px) rotateY(5deg) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: perspective(1000px) rotateY(0deg) scale(1);
    filter: none;
  }
}

.tv-static {
  animation: art-nouveau-static 0.3s 1;
}

@keyframes art-nouveau-static {
  0% {
    background:
      repeating-linear-gradient(90deg, #FFD700 1px, #B8860B 3px, #CD853F 5px),
      radial-gradient(circle, transparent 20%, rgba(255,215,0,0.1) 50%);
  }
  25% {
    background:
      repeating-linear-gradient(45deg, #00FFFF 2px, #FF1493 4px, #8A2BE2 6px),
      conic-gradient(from 0deg, transparent, rgba(0,255,255,0.2), transparent);
  }
  50% {
    background:
      repeating-linear-gradient(135deg, #FFD700 1px, #00FFFF 3px, #FF1493 5px),
      radial-gradient(ellipse, rgba(255,215,0,0.3) 30%, transparent 70%);
  }
  75% {
    background:
      repeating-linear-gradient(0deg, #B8860B 2px, #8A2BE2 6px, #CD853F 12px),
      linear-gradient(45deg, transparent, rgba(138,43,226,0.2), transparent);
  }
  100% {
    background: inherit;
  }
}

.tv-channel-nav {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  margin: 14px 0 8px 0;
  font-family: 'Cinzel', serif, sans-serif;
  font-weight: bold;
  z-index: 3;
}

.tv-nav-btn {
  padding: 8px 24px;
  background: linear-gradient(135deg, var(--secondary-color, #222c36), var(--tertiary-color, #2a3d4a));
  color: var(--tertiary-color, #fff);
  border-radius: 2em;
  border: 2px solid transparent;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(.25,.46,.45,.94);
  box-shadow:
    0 4px 15px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.1);
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.tv-nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent);
  transition: left 0.5s;
}

.tv-nav-btn:hover {
  background: linear-gradient(135deg, var(--tertiary-color, #5569a1), #FFD700);
  color: var(--primary-color, #000);
  border-color: #FFD700;
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 8px 25px rgba(255,215,0,0.4),
    inset 0 1px 0 rgba(255,255,255,0.2);
}

.tv-nav-btn:hover::before {
  left: 100%;
}

.tv-nav-btn:active {
  transform: translateY(0) scale(1.02);
}

.channel-title {
  background: linear-gradient(45deg, #FFD700, #FF1493, #00FFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 4px 4px rgba(0,0,0,0.3);
  font-size: 1.6em;
  font-weight: bold;
  letter-spacing: 1px;
  animation: title-glow 3s ease-in-out infinite alternate;
}

@keyframes title-glow {
  0% { filter: drop-shadow(0 0 5px rgba(255,215,0,0.5)); }
  100% { filter: drop-shadow(0 0 20px rgba(0,255,255,0.8)); }
}

.ornamental-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  border: 3px solid transparent;
  border-image: linear-gradient(45deg, #FFD700, transparent, #00FFFF, transparent, #FF1493) 1;
  border-radius: 12px;
  z-index: 1;
}

.ornamental-border::before,
.ornamental-border::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #FFD700;
}

.ornamental-border::before {
  top: -10px;
  left: -10px;
  border-right: none;
  border-bottom: none;
  border-radius: 0 0 0 8px;
}

.ornamental-border::after {
  bottom: -10px;
  right: -10px;
  border-left: none;
  border-top: none;
  border-radius: 8px 0 0 0;
}
`;

/**
 * Enhanced Channel Container with Belle Époque-Futurism Design
 * Features particle system, advanced transitions, and immersive interactions
 * @returns {JSX.Element} The themed channel container with particle effects
 */
export default function ChannelContainer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [flipDir, setFlipDir] = useState(''); // '' | 'fwd' | 'bwd'
  const [theme, setTheme] = useState('light');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFortuneWheel, setShowFortuneWheel] = useState(false);
  const [gestureControlEnabled, setGestureControlEnabled] = useState(false);
  const [audioVisualizationEnabled, setAudioVisualizationEnabled] = useState(false);
  const [microAnimationsEnabled, setMicroAnimationsEnabled] = useState(true);
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = useState(true);
  const animTimeoutRef = useRef();
  const Channel = CHANNELS[activeIdx].Component;
  const gamificationSystem = getGamificationSystem();
  const microAnimationEngine = getMicroAnimationEngine();
  const loadingStateEngine = getLoadingStateEngine();
  const hapticFeedbackEngine = getHapticFeedbackEngine();

  // Particle system configuration based on current channel and theme
  const particleConfig = {
    maxParticles: 300,
    ornamentDensity: theme === 'light' ? 0.4 : 0.2,
    cursorTrailIntensity: 0.9,
    matrixRainDensity: theme === 'dark' ? 0.15 : 0.05,
    clockworkDensity: 0.3,
    vineDensity: 0.08,
    enableGlow: true,
    enableHolographic: theme === 'dark',
    belleEpoqueColors: theme === 'light'
      ? ['#FFD700', '#B8860B', '#CD853F', '#DEB887', '#F4A460']
      : ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B'],
    futuristicColors: theme === 'dark'
      ? ['#00FFFF', '#FF1493', '#00FF00', '#8A2BE2', '#FF4500']
      : ['#1E90FF', '#FF69B4', '#32CD32', '#9370DB', '#FF6347']
  };

  const { canvasRef, engine, createEffect } = useParticleEngine(particleConfig, true);

  function flip(toIdx, dir) {
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    
    // Track current channel exit for gamification
    if (activeIdx !== toIdx) {
      gamificationSystem.leaveChannel();
      gamificationSystem.trackFastNavigation();
    }
    
    setIsTransitioning(true);
    setFlipDir(dir);
    setAnimKey(k=>k+1);

    // Create immersive loading state for channel transition
    const loadingId = loadingStateEngine.createLoadingState('channelTransition', {
      style: 'pocket-watch-to-ring',
      particles: true,
      minDuration: 800
    });

    // Create transition particle effects
    if (engine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      if (dir === 'fwd') {
        createEffect('holographicPulse', centerX + 100, centerY, { count: 25 });
      } else {
        createEffect('ornamentBurst', centerX - 100, centerY);
      }
    }

    setTimeout(() => {
      setActiveIdx(toIdx);
      setAnimKey(k=>k+1);
      setFlipDir('');
      
      // Track new channel visit for gamification
      const newChannelKey = CHANNELS[toIdx].key;
      gamificationSystem.visitChannel(newChannelKey);
      
      // Create arrival particle effects
      if (engine) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        createEffect('vineGrowth', centerX, centerY - 50, { segments: 20, length: 150 });
      }
      
      // Complete the loading state
      setTimeout(() => {
        loadingStateEngine.completeLoading(loadingId, () => {
          setIsTransitioning(false);
        });
      }, 200);
    }, 800); // matches enhanced transition duration
  }

  const nextChannel = () => {
    if (!isTransitioning) {
      flip((activeIdx + 1) % CHANNELS.length, 'fwd');
      
      // Trigger contextual micro-animation
      if (microAnimationsEnabled && microAnimationEngine) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        microAnimationEngine.createManualAnimation('clockwork.springs', centerX + 50, centerY);
      }
    }
  };

  const prevChannel = () => {
    if (!isTransitioning) {
      flip((activeIdx - 1 + CHANNELS.length) % CHANNELS.length, 'bwd');
      
      // Trigger contextual micro-animation
      if (microAnimationsEnabled && microAnimationEngine) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        microAnimationEngine.createManualAnimation('ornamental.vines', centerX - 50, centerY);
      }
    }
  };

  const handleChannelClick = (index) => {
    if (!isTransitioning && index !== activeIdx) {
      const direction = index > activeIdx ? 'fwd' : 'bwd';
      flip(index, direction);
      
      // Trigger contextual micro-animation for channel selection
      if (microAnimationsEnabled && microAnimationEngine) {
        const indicators = document.querySelectorAll('.channel-indicator');
        const targetIndicator = indicators[index];
        if (targetIndicator) {
          const rect = targetIndicator.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          microAnimationEngine.createManualAnimation('ornamental.filigree', x, y);
        }
      }
    }
  };

  // Gesture Control Handler
  const handleGestureDetected = (action, gesture) => {
    if (isTransitioning) return;

    switch (action) {
      case 'next-channel':
        nextChannel();
        gamificationSystem.trackGesture('conductor-next', gesture.name);
        break;
      case 'prev-channel':
        prevChannel();
        gamificationSystem.trackGesture('conductor-prev', gesture.name);
        break;
      case 'theme-toggle':
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
        gamificationSystem.trackGesture('conductor-theme', gesture.name);
        break;
      case 'fortune-wheel':
        setShowFortuneWheel(true);
        gamificationSystem.trackGesture('conductor-fortune', gesture.name);
        break;
      case 'select-action':
        // Could trigger channel-specific actions
        gamificationSystem.trackGesture('conductor-select', gesture.name);
        break;
      case 'confirm-selection':
        // Could confirm pending actions
        gamificationSystem.trackGesture('conductor-confirm', gesture.name);
        break;
      default:
        console.log(`Unhandled gesture action: ${action}`);
    }
  };

  // Toggle gesture control
  const toggleGestureControl = () => {
    setGestureControlEnabled(!gestureControlEnabled);
    gamificationSystem.trackInteraction('gesture-control-toggle');
  };

  // Audio Visualization Handler
  const handleAudioDataUpdate = (audioData) => {
    // Use audio data to enhance particle effects
    if (engine && audioData) {
      const { lowFreqEnergy, midFreqEnergy, highFreqEnergy } = audioData;
      
      // Create audio-synchronized particle effects occasionally
      if (Math.random() < 0.05) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        if (lowFreqEnergy > 0.6) {
          engine.createEffect('ornamentBurst', centerX, centerY, {
            count: Math.ceil(lowFreqEnergy * 8),
            style: 'bass-pulse'
          });
        }
        
        if (midFreqEnergy > 0.5) {
          engine.createEffect('vineGrowth', centerX, centerY, {
            segments: Math.ceil(midFreqEnergy * 12),
            style: 'audio-reactive'
          });
        }
        
        if (highFreqEnergy > 0.7) {
          engine.createEffect('holographicPulse', centerX, centerY, {
            count: Math.ceil(highFreqEnergy * 10),
            style: 'treble-sparkle'
          });
        }
      }
    }
    
    gamificationSystem.trackInteraction('audio-reactive');
  };

  // Toggle audio visualization
  const toggleAudioVisualization = () => {
    setAudioVisualizationEnabled(!audioVisualizationEnabled);
    gamificationSystem.trackInteraction('audio-visualization-toggle');
  };

  // Toggle micro-animations
  const toggleMicroAnimations = () => {
    setMicroAnimationsEnabled(!microAnimationsEnabled);
    gamificationSystem.trackInteraction('micro-animations-toggle');
    
    // Create a manual animation to demonstrate the toggle
    if (!microAnimationsEnabled && microAnimationEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      microAnimationEngine.createManualAnimation('clockwork.gears', centerX, centerY);
    }
  };

  // Demonstrate loading states
  const demonstrateLoadingStates = () => {
    // Create a demo loading state
    const loadingId = loadingStateEngine.createLoadingState('initialization', {
      style: 'full-transformation',
      particles: true,
      minDuration: 4000
    });
    
    // Simulate progress updates
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      loadingStateEngine.updateProgress(loadingId, progress);
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          loadingStateEngine.completeLoading(loadingId);
        }, 500);
      }
    }, 200);
    
    gamificationSystem.trackInteraction('loading-demo');
  };

  // Toggle haptic feedback
  const toggleHapticFeedback = () => {
    setHapticFeedbackEnabled(!hapticFeedbackEnabled);
    gamificationSystem.trackInteraction('haptic-feedback-toggle');
    
    // Demonstrate haptic feedback when enabling
    if (!hapticFeedbackEnabled && hapticFeedbackEngine) {
      setTimeout(() => {
        hapticFeedbackEngine.triggerManualFeedback('crystal', 0.8);
      }, 100);
    }
  };

  // Demonstrate haptic feedback patterns
  const demonstrateHapticFeedback = () => {
    if (!hapticFeedbackEnabled || !hapticFeedbackEngine) return;
    
    const patterns = theme === 'dark'
      ? ['hologram', 'plasma', 'neural', 'quantum']
      : ['velvet', 'brass', 'crystal', 'silk'];
    
    patterns.forEach((pattern, index) => {
      setTimeout(() => {
        hapticFeedbackEngine.triggerManualFeedback(pattern, 0.7);
      }, index * 800);
    });
    
    gamificationSystem.trackInteraction('haptic-demo');
  };

  const scheme = channelThemes[CHANNELS[activeIdx].key][theme];
  const rootStyle = {
    '--primary-color': scheme.primary,
    '--secondary-color': scheme.secondary,
    '--tertiary-color': scheme.tertiary,
    background: 'var(--primary-color, #000)',
    color: 'var(--secondary-color, #fff)',
    position: 'relative',
    minHeight: '100vh'
  };

  // Initialize gamification system
  useEffect(() => {
    // Visit the initial channel
    const initialChannelKey = CHANNELS[activeIdx].key;
    gamificationSystem.visitChannel(initialChannelKey);
    
    // Initialize micro-animation engine
    microAnimationEngine.initialize(theme);
    if (microAnimationsEnabled) {
      microAnimationEngine.start();
    }
    
    // Initialize loading state engine
    loadingStateEngine.initialize(engine, theme);
    
    // Initialize haptic feedback engine
    hapticFeedbackEngine.initialize(engine, theme);
    if (hapticFeedbackEnabled) {
      hapticFeedbackEngine.start();
    }
    
    // Cleanup on unmount
    return () => {
      gamificationSystem.endSession();
      microAnimationEngine.stop();
      loadingStateEngine.clearAllLoadings();
      hapticFeedbackEngine.stop();
    };
  }, []);

  // Update micro-animation engine when theme changes
  useEffect(() => {
    microAnimationEngine.setTheme(theme);
    // Set transformation mode based on theme
    microAnimationEngine.setTransformationMode(theme === 'dark' ? 'auto' : 'belle-epoque');
    
    // Update loading state engine theme
    loadingStateEngine.setTheme(theme);
    loadingStateEngine.setTransformationMode(theme === 'dark' ? 'auto' : 'pocket-watch');
    
    // Update haptic feedback engine theme
    hapticFeedbackEngine.setTheme(theme);
  }, [theme]);

  // Handle haptic feedback state
  useEffect(() => {
    if (hapticFeedbackEnabled) {
      hapticFeedbackEngine.start();
    } else {
      hapticFeedbackEngine.stop();
    }
  }, [hapticFeedbackEnabled]);

  // Handle micro-animations state
  useEffect(() => {
    if (microAnimationsEnabled) {
      microAnimationEngine.start();
    } else {
      microAnimationEngine.stop();
    }
  }, [microAnimationsEnabled]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevChannel();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextChannel();
          break;
        case ' ':
          e.preventDefault();
          if (engine) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            createEffect('ornamentBurst', centerX, centerY);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          setShowFortuneWheel(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, isTransitioning, engine]);

  return (
    <main style={rootStyle}>
      <style>{tvAnimStyles}</style>
      
      {/* Particle System Canvas */}
      <canvas
        ref={canvasRef}
        className="particle-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Enhanced Navigation */}
      <div className="tv-channel-nav">
        <button
          className="tv-nav-btn"
          onClick={prevChannel}
          disabled={isTransitioning}
          style={{ opacity: isTransitioning ? 0.6 : 1 }}
        >
          ◀ Prev
        </button>
        
        <span className="channel-title">
          {CHANNELS[activeIdx].name}
        </span>
        
        <button
          className="tv-nav-btn"
          onClick={nextChannel}
          disabled={isTransitioning}
          style={{ opacity: isTransitioning ? 0.6 : 1 }}
        >
          Next ▶
        </button>
        
        <button
          className="tv-nav-btn"
          onClick={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
            gamificationSystem.changeTheme();
            if (engine) {
              const centerX = window.innerWidth / 2;
              const centerY = 100;
              createEffect('holographicPulse', centerX, centerY, { count: 15 });
            }
          }}
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, #FFD700, #FF1493)'
              : 'linear-gradient(135deg, #1E90FF, #8A2BE2)'
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        
        <button
          className="tv-nav-btn"
          onClick={demonstrateLoadingStates}
          style={{
            background: 'linear-gradient(135deg, #8A2BE2, #4B0082)',
            marginLeft: '10px'
          }}
        >
          ⏰ Demo Loading
        </button>
        
        <button
          className="tv-nav-btn"
          onClick={demonstrateHapticFeedback}
          style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
            marginLeft: '10px'
          }}
        >
          🤚 Demo Haptic
        </button>
      </div>

      {/* Channel Indicator */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 3,
        display: 'flex',
        gap: '8px'
      }}>
        {CHANNELS.map((_, index) => (
          <div
            key={index}
            onClick={() => handleChannelClick(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: index === activeIdx
                ? 'linear-gradient(45deg, #FFD700, #FF1493)'
                : 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: index === activeIdx ? '2px solid #00FFFF' : '1px solid rgba(255,255,255,0.5)',
              boxShadow: index === activeIdx ? '0 0 10px #00FFFF' : 'none'
            }}
          />
        ))}
      </div>

      {/* Main Channel Content */}
      <div className={`channel-flip-outer ${flipDir && 'tv-static'}`}
           style={{
             padding: '10px 0 32px 0',
             minHeight: 350,
             borderRadius: 12,
             boxShadow: `0 3px 28px var(--secondary-color, #353860)`,
             position: 'relative',
             zIndex: 2
           }}>
        
        <div className="ornamental-border" />
        
        <div key={animKey}
          className={`tv-channel-inner${flipDir ? ' tv-flip' : ''}`}
          style={{
            transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}
        >
          <Channel />
        </div>
      </div>

      {/* Gamification HUD */}
      <GamificationHUD
        theme={theme}
        onFortuneWheelOpen={() => setShowFortuneWheel(true)}
      />

      {/* Fortune Wheel Modal */}
      <FortuneWheel
        isOpen={showFortuneWheel}
        onClose={() => setShowFortuneWheel(false)}
        onFortuneResult={(result) => {
          console.log('Fortune result:', result);
          // Handle fortune results (could trigger particle effects, navigation, etc.)
          if (result.type === 'channel' && engine) {
            // Suggest a random channel
            const randomChannel = Math.floor(Math.random() * CHANNELS.length);
            if (randomChannel !== activeIdx) {
              setTimeout(() => {
                flip(randomChannel, 'fwd');
              }, 1000);
            }
          }
        }}
        theme={theme}
        particleEngine={engine}
      />

      {/* Gesture Control Interface */}
      <GestureControlInterface
        isActive={gestureControlEnabled}
        onGestureDetected={handleGestureDetected}
        particleEngine={engine}
        theme={theme}
      />

      {/* Audio Visualization Interface */}
      <AudioVisualizationInterface
        isActive={audioVisualizationEnabled}
        onAudioDataUpdate={handleAudioDataUpdate}
        particleEngine={engine}
        theme={theme}
        channelContext={CHANNELS[activeIdx].key}
      />

      {/* Gesture Control Toggle Button */}
      <button
        onClick={toggleGestureControl}
        style={{
          position: 'fixed',
          top: '20px',
          left: gestureControlEnabled ? '340px' : '20px',
          zIndex: 1001,
          background: gestureControlEnabled
            ? 'linear-gradient(135deg, #32CD32, #228B22)'
            : 'linear-gradient(135deg, #8A2BE2, #FF1493)',
          border: 'none',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Cinzel, serif',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {gestureControlEnabled ? '🎭 Gesture ON' : '🎭 Gesture OFF'}
      </button>

      {/* Audio Visualization Toggle Button */}
      <button
        onClick={toggleAudioVisualization}
        style={{
          position: 'fixed',
          top: '70px',
          left: gestureControlEnabled ? '340px' : '20px',
          zIndex: 1001,
          background: audioVisualizationEnabled
            ? 'linear-gradient(135deg, #FFD700, #FF8C00)'
            : 'linear-gradient(135deg, #4B0082, #9932CC)',
          border: 'none',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Cinzel, serif',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {audioVisualizationEnabled ? '🎵 Audio ON' : '🎵 Audio OFF'}
      </button>

      {/* Micro-Animation Toggle Button */}
      <button
        onClick={toggleMicroAnimations}
        style={{
          position: 'fixed',
          top: '120px',
          left: gestureControlEnabled ? '340px' : '20px',
          zIndex: 1001,
          background: microAnimationsEnabled
            ? 'linear-gradient(135deg, #32CD32, #228B22)'
            : 'linear-gradient(135deg, #CD853F, #8B4513)',
          border: 'none',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Cinzel, serif',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          // Create hover micro-animation
          if (microAnimationsEnabled && microAnimationEngine) {
            const rect = e.target.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            microAnimationEngine.createManualAnimation('clockwork.escapement', x + 40, y);
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {microAnimationsEnabled ? '⚙️ Micro ON' : '⚙️ Micro OFF'}
      </button>

      {/* Haptic Feedback Toggle Button */}
      <button
        onClick={toggleHapticFeedback}
        style={{
          position: 'fixed',
          top: '170px',
          left: gestureControlEnabled ? '340px' : '20px',
          zIndex: 1001,
          background: hapticFeedbackEnabled
            ? 'linear-gradient(135deg, #FF6B6B, #FF8E53)'
            : 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
          border: 'none',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Cinzel, serif',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          // Create hover haptic feedback
          if (hapticFeedbackEnabled && hapticFeedbackEngine) {
            hapticFeedbackEngine.triggerManualFeedback('velvet', 0.3);
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {hapticFeedbackEnabled ? '🤚 Haptic ON' : '🤚 Haptic OFF'}
      </button>

      {/* Ambient Interactive Elements */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 3,
        fontSize: '0.9em',
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'monospace'
      }}>
        <div>Channel {activeIdx + 1}/{CHANNELS.length}</div>
        <div>Use ← → or click indicators to navigate</div>
        <div>Press SPACE for particle burst</div>
        <div>Click HUD fortune button for mystical guidance</div>
        {gestureControlEnabled && (
          <div style={{ color: '#FFD700', marginTop: '5px' }}>
            🎭 Gesture navigation active - wave like a conductor!
          </div>
        )}
        {audioVisualizationEnabled && (
          <div style={{ color: '#FF69B4', marginTop: '5px' }}>
            🎵 Audio visualization active - sounds create visual magic!
          </div>
        )}
        {microAnimationsEnabled && (
          <div style={{ color: '#32CD32', marginTop: '5px' }}>
            ⚙️ Micro-animations active - clockwork becomes digital matrices!
          </div>
        )}
        {hapticFeedbackEnabled && (
          <div style={{ color: '#FF6B6B', marginTop: '5px' }}>
            🤚 Haptic feedback active - feel the Belle Époque textures!
          </div>
        )}
      </div>
    </main>
  );
}
