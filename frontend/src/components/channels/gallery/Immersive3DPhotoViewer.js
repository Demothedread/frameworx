import React, { useState, useRef, useEffect } from 'react';
import { getGamificationSystem } from '../../../utils/GamificationSystem';

/**
 * Immersive 3D Photo Viewer with Belle Époque-Futurism Design
 * 
 * Features vintage stereoscope effects transitioning to holographic display projection:
 * - Victorian stereoscope viewer with ornate brass styling
 * - Smooth transition to futuristic holographic projection mode
 * - 3D depth effects and parallax scrolling
 * - Particle effects integration
 * - Eye-tracking simulation for immersive viewing
 * - Belle Époque ornamental frames with cyberpunk hologram overlays
 */

export default function Immersive3DPhotoViewer({ 
  image, 
  onClose, 
  theme = 'light',
  particleEngine 
}) {
  const [viewMode, setViewMode] = useState('stereoscope'); // 'stereoscope' | 'holographic'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [depth, setDepth] = useState(0.1);
  const [hologramIntensity, setHologramIntensity] = useState(0);
  const viewerRef = useRef(null);
  const imageRef = useRef(null);
  const gamificationSystem = getGamificationSystem();

  useEffect(() => {
    // Track interaction for gamification
    gamificationSystem.interactWithChannel('gallery', '3d-viewer');
    
    // Create initial particle effects
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      particleEngine.createEffect('ornamentBurst', centerX, centerY);
    }
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!viewerRef.current) return;
      
      const rect = viewerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      
      setEyePosition({ x: x * 20, y: y * 20 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleViewMode = () => {
    setIsTransitioning(true);
    
    // Create transition effects
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      if (viewMode === 'stereoscope') {
        particleEngine.createEffect('holographicPulse', centerX, centerY, { count: 30 });
        setHologramIntensity(1);
      } else {
        particleEngine.createEffect('vineGrowth', centerX - 100, centerY, { segments: 15 });
        setHologramIntensity(0);
      }
    }

    setTimeout(() => {
      setViewMode(viewMode === 'stereoscope' ? 'holographic' : 'stereoscope');
      setIsTransitioning(false);
    }, 1000);
  };

  const adjustDepth = (delta) => {
    setDepth(Math.max(0, Math.min(1, depth + delta)));
  };

  if (!image) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      fontFamily: 'Cinzel, serif'
    }}>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          background: 'transparent',
          border: '2px solid #FFD700',
          color: '#FFD700',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 2001
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#FFD700';
          e.target.style.color = '#000';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = '#FFD700';
          e.target.style.transform = 'scale(1)';
        }}
      >
        ×
      </button>

      {/* Mode Toggle */}
      <button
        onClick={toggleViewMode}
        disabled={isTransitioning}
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          background: viewMode === 'holographic' 
            ? 'linear-gradient(135deg, #00FFFF, #FF1493)' 
            : 'linear-gradient(135deg, #B8860B, #FFD700)',
          border: 'none',
          color: '#000',
          padding: '12px 20px',
          borderRadius: '25px',
          cursor: isTransitioning ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Cinzel, serif',
          transition: 'all 0.3s ease',
          opacity: isTransitioning ? 0.6 : 1,
          zIndex: 2001
        }}
      >
        {viewMode === 'stereoscope' ? '🔮 Enter Hologram' : '🎭 Return to Stereoscope'}
      </button>

      {/* Depth Controls */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '15px 25px',
        borderRadius: '25px',
        border: '1px solid #FFD700',
        zIndex: 2001
      }}>
        <button
          onClick={() => adjustDepth(-0.1)}
          style={{
            background: 'transparent',
            border: '1px solid #FFD700',
            color: '#FFD700',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          -
        </button>
        <span style={{ color: '#FFD700', minWidth: '80px', textAlign: 'center' }}>
          Depth: {Math.round(depth * 100)}%
        </span>
        <button
          onClick={() => adjustDepth(0.1)}
          style={{
            background: 'transparent',
            border: '1px solid #FFD700',
            color: '#FFD700',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          +
        </button>
      </div>

      {/* Main Viewer Container */}
      <div
        ref={viewerRef}
        style={{
          position: 'relative',
          width: '80%',
          maxWidth: '800px',
          height: '70%',
          perspective: '1000px',
          filter: isTransitioning ? 'blur(5px)' : 'none',
          transition: 'filter 1s ease'
        }}
      >
        
        {/* Stereoscope Mode */}
        {viewMode === 'stereoscope' && (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #8B4513, #D4A574)',
            borderRadius: '20px',
            border: '4px solid #FFD700',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
            overflow: 'hidden'
          }}>
            
            {/* Ornate Frame */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: '3px solid #B8860B',
              borderRadius: '15px',
              background: 'linear-gradient(45deg, transparent, rgba(255,215,0,0.1), transparent)',
              zIndex: 1
            }}>
              
              {/* Corner Ornaments */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '-10px',
                width: '20px',
                height: '20px',
                background: '#FFD700',
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                borderRadius: '3px 0 0 0'
              }} />
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '20px',
                height: '20px',
                background: '#FFD700',
                clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                borderRadius: '0 3px 0 0'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                left: '-10px',
                width: '20px',
                height: '20px',
                background: '#FFD700',
                clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
                borderRadius: '0 0 0 3px'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-10px',
                right: '-10px',
                width: '20px',
                height: '20px',
                background: '#FFD700',
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                borderRadius: '0 0 3px 0'
              }} />
            </div>

            {/* Stereoscope Image Display */}
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '50px',
              right: '50px',
              bottom: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#000',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <img
                ref={imageRef}
                src={image.src}
                alt={image.caption || 'Stereoscope view'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  transform: `
                    translateX(${eyePosition.x * depth}px) 
                    translateY(${eyePosition.y * depth}px) 
                    scale(${1 + depth * 0.1})
                    rotateY(${eyePosition.x * depth * 0.1}deg)
                    rotateX(${eyePosition.y * depth * 0.1}deg)
                  `,
                  transition: 'transform 0.1s ease-out',
                  filter: `sepia(${depth * 30}%) contrast(${1 + depth * 0.3})`
                }}
              />
              
              {/* Vintage Vignette Effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, transparent 40%, rgba(139,69,19,0.3) 70%, rgba(139,69,19,0.7) 100%)',
                pointerEvents: 'none'
              }} />
            </div>

            {/* Brass Details */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '20px',
              background: 'linear-gradient(90deg, #B8860B, #FFD700, #B8860B)',
              borderRadius: '10px',
              border: '1px solid #8B4513'
            }} />
          </div>
        )}

        {/* Holographic Mode */}
        {viewMode === 'holographic' && (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(0,255,255,0.1), rgba(255,20,147,0.05), transparent)',
            borderRadius: '20px',
            border: '2px solid #00FFFF',
            boxShadow: '0 0 50px rgba(0, 255, 255, 0.5)',
            overflow: 'hidden'
          }}>
            
            {/* Holographic Grid */}
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
              backgroundSize: '20px 20px',
              opacity: 0.3,
              animation: 'gridPulse 3s ease-in-out infinite alternate'
            }} />

            {/* Holographic Image Display */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'translateZ(50px)',
              transformStyle: 'preserve-3d'
            }}>
              <img
                src={image.src}
                alt={image.caption || 'Holographic view'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  transform: `
                    translateX(${eyePosition.x * depth * 2}px) 
                    translateY(${eyePosition.y * depth * 2}px) 
                    translateZ(${depth * 100}px)
                    rotateY(${eyePosition.x * depth * 0.3}deg)
                    rotateX(${eyePosition.y * depth * 0.3}deg)
                  `,
                  transition: 'transform 0.1s ease-out',
                  filter: `
                    hue-rotate(${hologramIntensity * 180}deg) 
                    saturate(${1 + hologramIntensity}) 
                    brightness(${1 + hologramIntensity * 0.3})
                    drop-shadow(0 0 20px cyan)
                  `,
                  opacity: 0.9,
                  mixBlendMode: 'screen'
                }}
              />

              {/* Holographic Duplicate for Depth */}
              <img
                src={image.src}
                alt=""
                style={{
                  position: 'absolute',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  transform: `
                    translateX(${eyePosition.x * depth * 1.5}px) 
                    translateY(${eyePosition.y * depth * 1.5}px) 
                    translateZ(${depth * 50}px)
                    rotateY(${eyePosition.x * depth * 0.2}deg)
                    rotateX(${eyePosition.y * depth * 0.2}deg)
                  `,
                  transition: 'transform 0.1s ease-out',
                  filter: 'hue-rotate(90deg) opacity(0.3)',
                  mixBlendMode: 'screen'
                }}
              />
            </div>

            {/* Holographic Interference Patterns */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,255,255,0.03) 2px)',
              animation: 'hologramScan 2s linear infinite'
            }} />

            {/* Corner Holo-Elements */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              width: '30px',
              height: '30px',
              border: '2px solid #00FFFF',
              borderRight: 'none',
              borderBottom: 'none',
              opacity: 0.7
            }} />
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '30px',
              height: '30px',
              border: '2px solid #FF1493',
              borderLeft: 'none',
              borderBottom: 'none',
              opacity: 0.7
            }} />
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              width: '30px',
              height: '30px',
              border: '2px solid #00FFFF',
              borderRight: 'none',
              borderTop: 'none',
              opacity: 0.7
            }} />
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              width: '30px',
              height: '30px',
              border: '2px solid #FF1493',
              borderLeft: 'none',
              borderTop: 'none',
              opacity: 0.7
            }} />
          </div>
        )}

        {/* Image Caption */}
        {image.caption && (
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: viewMode === 'holographic' 
              ? 'linear-gradient(135deg, rgba(0,255,255,0.2), rgba(255,20,147,0.2))'
              : 'linear-gradient(135deg, rgba(184,134,11,0.9), rgba(255,215,0,0.9))',
            color: viewMode === 'holographic' ? '#00FFFF' : '#000',
            padding: '10px 20px',
            borderRadius: '15px',
            border: viewMode === 'holographic' ? '1px solid #00FFFF' : '1px solid #B8860B',
            fontSize: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px'
          }}>
            {image.caption}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '100px',
        right: '30px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        textAlign: 'right',
        fontFamily: 'monospace'
      }}>
        <div>Move mouse for parallax effect</div>
        <div>Adjust depth with +/- controls</div>
        <div>Toggle modes with top-left button</div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gridPulse {
          0% { opacity: 0.2; }
          100% { opacity: 0.4; }
        }
        
        @keyframes hologramScan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}