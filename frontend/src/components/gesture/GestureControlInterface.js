import React, { useState, useEffect, useRef } from 'react';
import { getGestureNavigationEngine } from '../../utils/GestureNavigationEngine';

/**
 * Gesture Control Interface Component
 * 
 * Provides visual feedback and controls for the Belle Époque-Futuristic gesture navigation:
 * - Victorian conductor visualization with particle trails
 * - Futuristic hand tracking overlay with neon feedback
 * - Gesture tutorial system with elegant animations
 * - Real-time gesture recognition status display
 * - Mode switching between conductor and digital interface styles
 */

export default function GestureControlInterface({ 
  isActive, 
  onGestureDetected, 
  particleEngine,
  theme = 'light' 
}) {
  const [gestureEngine] = useState(() => getGestureNavigationEngine());
  const [gestureMode, setGestureMode] = useState('conductor');
  const [isEnabled, setIsEnabled] = useState(false);
  const [capabilities, setCapabilities] = useState({});
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentGesture, setCurrentGesture] = useState(null);
  const [conductorPosition, setConductorPosition] = useState({ x: 0, y: 0 });
  const interfaceRef = useRef(null);
  const conductorTrailRef = useRef([]);

  useEffect(() => {
    if (isActive) {
      initializeGestureControl();
    } else {
      gestureEngine.stop();
      setIsEnabled(false);
    }
  }, [isActive]);

  const initializeGestureControl = async () => {
    try {
      await gestureEngine.initialize(particleEngine);
      
      // Register gesture callbacks
      gestureEngine.onGesture('next-channel', (gesture) => {
        setCurrentGesture(gesture);
        onGestureDetected?.('next-channel', gesture);
        setTimeout(() => setCurrentGesture(null), 2000);
      });

      gestureEngine.onGesture('prev-channel', (gesture) => {
        setCurrentGesture(gesture);
        onGestureDetected?.('prev-channel', gesture);
        setTimeout(() => setCurrentGesture(null), 2000);
      });

      gestureEngine.onGesture('theme-toggle', (gesture) => {
        setCurrentGesture(gesture);
        onGestureDetected?.('theme-toggle', gesture);
        setTimeout(() => setCurrentGesture(null), 2000);
      });

      gestureEngine.onGesture('fortune-wheel', (gesture) => {
        setCurrentGesture(gesture);
        onGestureDetected?.('fortune-wheel', gesture);
        setTimeout(() => setCurrentGesture(null), 2000);
      });

      gestureEngine.onGesture('select-action', (gesture) => {
        setCurrentGesture(gesture);
        onGestureDetected?.('select-action', gesture);
        setTimeout(() => setCurrentGesture(null), 2000);
      });

      gestureEngine.onGesture('confirm-selection', (gesture) => {
        setCurrentGesture(gesture);
        onGestureDetected?.('confirm-selection', gesture);
        setTimeout(() => setCurrentGesture(null), 2000);
      });

      const caps = gestureEngine.getCapabilities();
      setCapabilities(caps);
      setGestureMode(caps.gestureMode);
      
      await gestureEngine.start();
      setIsEnabled(true);
    } catch (error) {
      console.warn('Failed to initialize gesture control:', error);
    }
  };

  const toggleGestureMode = () => {
    gestureEngine.toggleGestureMode();
    const newMode = gestureMode === 'conductor' ? 'digital-interface' : 'conductor';
    setGestureMode(newMode);
    setCapabilities(gestureEngine.getCapabilities());
  };

  const updateConductorPosition = (x, y) => {
    setConductorPosition({ x, y });
    
    // Add to trail
    conductorTrailRef.current.push({ x, y, timestamp: Date.now() });
    
    // Keep trail history limited
    const cutoff = Date.now() - 1000;
    conductorTrailRef.current = conductorTrailRef.current.filter(p => p.timestamp > cutoff);
  };

  // Simulate conductor position updates (in real implementation, this would come from gesture engine)
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      if (gestureEngine.conductorPosition) {
        const { x, y } = gestureEngine.conductorPosition;
        updateConductorPosition(x, y);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isEnabled]);

  const renderConductorInterface = () => (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: gestureMode === 'conductor'
        ? 'radial-gradient(circle at center, rgba(139,69,19,0.1), rgba(255,215,0,0.05))'
        : 'radial-gradient(circle at center, rgba(0,255,255,0.1), rgba(255,20,147,0.05))',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      
      {/* Ornate Frame */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        right: '10px',
        bottom: '10px',
        border: gestureMode === 'conductor' 
          ? '2px solid rgba(255,215,0,0.6)'
          : '2px solid rgba(0,255,255,0.6)',
        borderRadius: '15px',
        pointerEvents: 'none'
      }}>
        
        {/* Corner Ornaments */}
        {gestureMode === 'conductor' && (
          <>
            <div style={{
              position: 'absolute',
              top: '-5px',
              left: '-5px',
              width: '15px',
              height: '15px',
              background: '#FFD700',
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              borderRadius: '3px 0 0 0'
            }} />
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '15px',
              height: '15px',
              background: '#FFD700',
              clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
              borderRadius: '0 3px 0 0'
            }} />
          </>
        )}
      </div>

      {/* Conductor Baton Trail */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        {conductorTrailRef.current.length > 1 && (
          <path
            d={`M ${conductorTrailRef.current.map((p, i) => {
              const x = ((p.x + 1) / 2) * 100;
              const y = ((p.y + 1) / 2) * 100;
              return i === 0 ? `${x} ${y}` : `L ${x} ${y}`;
            }).join(' ')}`}
            stroke={gestureMode === 'conductor' ? '#FFD700' : '#00FFFF'}
            strokeWidth="3"
            fill="none"
            strokeOpacity="0.7"
            strokeDasharray="5,5"
            style={{
              filter: `drop-shadow(0 0 5px ${gestureMode === 'conductor' ? '#FFD700' : '#00FFFF'})`
            }}
          />
        )}
      </svg>

      {/* Current Hand Position */}
      {conductorPosition.x !== 0 || conductorPosition.y !== 0 ? (
        <div style={{
          position: 'absolute',
          left: `${((conductorPosition.x + 1) / 2) * 100}%`,
          top: `${((conductorPosition.y + 1) / 2) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          background: gestureMode === 'conductor' 
            ? 'radial-gradient(circle, #FFD700, #B8860B)'
            : 'radial-gradient(circle, #00FFFF, #FF1493)',
          borderRadius: '50%',
          boxShadow: `0 0 15px ${gestureMode === 'conductor' ? '#FFD700' : '#00FFFF'}`,
          animation: 'pulse 2s ease-in-out infinite',
          zIndex: 10
        }}>
          {/* Baton Icon */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '12px',
            color: '#000'
          }}>
            {gestureMode === 'conductor' ? '🎼' : '⚡'}
          </div>
        </div>
      ) : null}

      {/* Gesture Zones */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '25%',
        height: '20%',
        border: '2px dashed rgba(255,255,255,0.3)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center'
      }}>
        ← Previous<br/>Channel
      </div>

      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '25%',
        height: '20%',
        border: '2px dashed rgba(255,255,255,0.3)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center'
      }}>
        Next →<br/>Channel
      </div>

      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '25%',
        height: '15%',
        border: '2px dashed rgba(255,255,255,0.3)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center'
      }}>
        ↑ Theme<br/>Toggle
      </div>

      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '25%',
        height: '15%',
        border: '2px dashed rgba(255,255,255,0.3)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center'
      }}>
        ↓ Select<br/>Action
      </div>
    </div>
  );

  const renderDigitalInterface = () => (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, rgba(26,26,58,0.8), rgba(42,42,74,0.8))',
      borderRadius: '20px',
      border: '2px solid #00FFFF',
      overflow: 'hidden'
    }}>
      
      {/* Digital Grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(0deg, transparent 98%, rgba(0,255,255,0.1) 100%),
          linear-gradient(90deg, transparent 98%, rgba(0,255,255,0.1) 100%)
        `,
        backgroundSize: '30px 30px',
        opacity: 0.3
      }} />

      {/* Digital Interface Elements */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '24px',
        color: '#00FFFF',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '10px' }}>🤖</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>
          Digital Interface Mode
        </div>
      </div>
    </div>
  );

  if (!isActive) return null;

  return (
    <div
      ref={interfaceRef}
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        width: '300px',
        height: '200px',
        zIndex: 1000,
        fontFamily: 'Cinzel, serif'
      }}
    >
      
      {/* Main Interface */}
      {gestureMode === 'conductor' ? renderConductorInterface() : renderDigitalInterface()}

      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '10px',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        
        {/* Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '12px',
          color: isEnabled ? '#00FF00' : '#FF6B6B'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isEnabled ? '#00FF00' : '#FF6B6B',
            animation: isEnabled ? 'pulse 2s ease-in-out infinite' : 'none'
          }} />
          {isEnabled ? 'Active' : 'Inactive'}
        </div>

        {/* Mode Toggle */}
        <button
          onClick={toggleGestureMode}
          style={{
            background: gestureMode === 'conductor' 
              ? 'linear-gradient(135deg, #8A2BE2, #FF1493)'
              : 'linear-gradient(135deg, #B8860B, #FFD700)',
            border: 'none',
            color: '#FFF',
            padding: '5px 10px',
            borderRadius: '15px',
            fontSize: '10px',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif'
          }}
        >
          {gestureMode === 'conductor' ? '🎭→🤖' : '🤖→🎭'}
        </button>

        {/* Tutorial Toggle */}
        <button
          onClick={() => setShowTutorial(!showTutorial)}
          style={{
            background: 'transparent',
            border: '1px solid #666',
            color: '#CCC',
            padding: '5px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          ?
        </button>
      </div>

      {/* Current Gesture Display */}
      {currentGesture && (
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: gestureMode === 'conductor'
            ? 'linear-gradient(135deg, #FFD700, #B8860B)'
            : 'linear-gradient(135deg, #00FFFF, #FF1493)',
          color: '#000',
          padding: '8px 15px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          animation: 'fadeInOut 2s ease-in-out'
        }}>
          {currentGesture.name}
        </div>
      )}

      {/* Fallback Mode Indicator */}
      {capabilities.fallbackMode && (
        <div style={{
          position: 'absolute',
          top: '-25px',
          right: 0,
          background: 'rgba(255,165,0,0.9)',
          color: '#000',
          padding: '3px 8px',
          borderRadius: '10px',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          Keyboard Mode
        </div>
      )}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <GestureTutorial
          gestureMode={gestureMode}
          capabilities={capabilities}
          onClose={() => setShowTutorial(false)}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          20% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        }
      `}</style>
    </div>
  );
}

// Tutorial Component
function GestureTutorial({ gestureMode, capabilities, onClose }) {
  const gestureEngine = getGestureNavigationEngine();
  const tutorials = gestureEngine.getGestureTutorials();
  const currentTutorial = capabilities.fallbackMode 
    ? tutorials.fallback 
    : tutorials[gestureMode];

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0,0,0,0.95)',
      color: '#FFF',
      padding: '30px',
      borderRadius: '20px',
      border: '2px solid #FFD700',
      maxWidth: '500px',
      zIndex: 2000,
      fontFamily: 'Cinzel, serif'
    }}>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          background: 'linear-gradient(45deg, #FFD700, #FF1493)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {currentTutorial.title}
        </h3>
        
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '2px solid #FFD700',
            color: '#FFD700',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      </div>

      <p style={{
        fontSize: '14px',
        opacity: 0.9,
        marginBottom: '20px',
        fontStyle: 'italic'
      }}>
        {currentTutorial.description}
      </p>

      {currentTutorial.gestures && (
        <div>
          <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#FFD700' }}>
            Available Gestures:
          </h4>
          {Object.entries(currentTutorial.gestures).map(([key, gesture]) => (
            <div key={key} style={{
              marginBottom: '10px',
              padding: '10px',
              background: 'rgba(255,215,0,0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255,215,0,0.3)'
            }}>
              <strong>{gesture.name}</strong>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '3px' }}>
                {gesture.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {currentTutorial.shortcuts && (
        <div>
          <h4 style={{ fontSize: '16px', marginBottom: '15px', color: '#FFD700' }}>
            Keyboard Shortcuts:
          </h4>
          {currentTutorial.shortcuts.map((shortcut, index) => (
            <div key={index} style={{
              marginBottom: '8px',
              padding: '8px',
              background: 'rgba(255,165,0,0.1)',
              borderRadius: '5px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              {shortcut}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}