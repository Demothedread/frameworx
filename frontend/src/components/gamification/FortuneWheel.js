import React, { useState, useRef, useEffect } from 'react';
import { getGamificationSystem } from '../../utils/GamificationSystem';

/**
 * Belle Époque Fortune Wheel with Cyberpunk Elements
 * 
 * An mystical interface that combines Victorian spiritualism
 * with futuristic probability matrices, featuring:
 * - Ornate spinning wheel with Art Nouveau patterns
 * - Holographic overlays and digital glitch effects
 * - Vintage fortune cards with neon accents
 * - Particle effects during fortune revelation
 * - Voice-like text animations for mystical atmosphere
 */

export default function FortuneWheel({ isOpen, onClose, onFortuneResult, theme, particleEngine }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [fortune, setFortune] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const wheelRef = useRef(null);
  const gamificationSystem = getGamificationSystem();

  // Fortune wheel segments
  const segments = [
    { 
      id: 'wisdom', 
      label: 'Ancient Wisdom', 
      color: '#FFD700', 
      icon: '📜',
      belleEpoque: 'Sagesse Ancienne',
      futuristic: 'DATA_ARCHIVE'
    },
    { 
      id: 'discovery', 
      label: 'New Discovery', 
      color: '#00FFFF', 
      icon: '🔍',
      belleEpoque: 'Nouvelle Découverte',
      futuristic: 'SCAN_PROTOCOL'
    },
    { 
      id: 'fortune', 
      label: 'Great Fortune', 
      color: '#FF1493', 
      icon: '💎',
      belleEpoque: 'Grande Fortune',
      futuristic: 'LUCK_MATRIX'
    },
    { 
      id: 'mystery', 
      label: 'Hidden Mystery', 
      color: '#8A2BE2', 
      icon: '🗝️',
      belleEpoque: 'Mystère Caché',
      futuristic: 'ENCRYPTED_DATA'
    },
    { 
      id: 'power', 
      label: 'Inner Power', 
      color: '#FF4500', 
      icon: '⚡',
      belleEpoque: 'Pouvoir Intérieur',
      futuristic: 'ENERGY_CORE'
    },
    { 
      id: 'journey', 
      label: 'New Journey', 
      color: '#32CD32', 
      icon: '🗺️',
      belleEpoque: 'Nouveau Voyage',
      futuristic: 'PATH_ALGORITHM'
    },
    { 
      id: 'connection', 
      label: 'Sacred Connection', 
      color: '#FF69B4', 
      icon: '🔗',
      belleEpoque: 'Lien Sacré',
      futuristic: 'NETWORK_NODE'
    },
    { 
      id: 'transformation', 
      label: 'Transformation', 
      color: '#9370DB', 
      icon: '🦋',
      belleEpoque: 'Métamorphose',
      futuristic: 'SYSTEM_UPGRADE'
    }
  ];

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setFortune(null);

    // Create particle effects
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      particleEngine.createEffect('ornamentBurst', centerX, centerY);
    }

    // Calculate spin
    const spins = 3 + Math.random() * 3; // 3-6 full rotations
    const finalAngle = Math.random() * 360;
    const totalRotation = currentRotation + (spins * 360) + finalAngle;
    
    setCurrentRotation(totalRotation);

    // Glitch effect during spin
    setTimeout(() => setGlitchEffect(true), 1000);
    setTimeout(() => setGlitchEffect(false), 1500);

    // Calculate which segment was selected
    setTimeout(() => {
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const segmentAngle = 360 / segments.length;
      const selectedIndex = Math.floor(normalizedAngle / segmentAngle);
      const selected = segments[selectedIndex];
      
      setSelectedSegment(selected);
      
      // Generate fortune result
      const fortuneResult = gamificationSystem.useFortuneWheel();
      fortuneResult.segment = selected;
      setFortune(fortuneResult);
      
      setIsSpinning(false);
      setShowResult(true);
      
      // Particle effect for result
      if (particleEngine) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        particleEngine.createEffect('holographicPulse', centerX, centerY, { count: 30 });
      }
      
      // Notify parent
      if (onFortuneResult) {
        onFortuneResult(fortuneResult);
      }
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(10px)'
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
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#FFD700';
          e.target.style.color = '#000';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = '#FFD700';
        }}
      >
        ✕
      </button>

      {/* Main Container */}
      <div style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, rgba(20,20,40,0.95), rgba(40,20,60,0.95))'
          : 'linear-gradient(135deg, rgba(245,245,220,0.95), rgba(255,248,220,0.9))',
        border: `3px solid ${theme === 'dark' ? '#00FFFF' : '#B8860B'}`,
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        position: 'relative',
        maxWidth: '600px',
        width: '90%',
        boxShadow: theme === 'dark'
          ? '0 0 40px rgba(0,255,255,0.3), inset 0 0 40px rgba(255,215,0,0.1)'
          : '0 0 30px rgba(184,134,11,0.4), inset 0 0 30px rgba(255,215,0,0.2)'
      }}>
        
        {/* Title */}
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '28px',
          marginBottom: '30px',
          background: theme === 'dark'
            ? 'linear-gradient(45deg, #FFD700, #FF1493, #00FFFF)'
            : 'linear-gradient(45deg, #8B4513, #FFD700, #B8860B)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          {theme === 'dark' ? 'Quantum Fortune Matrix' : 'La Roue de Fortune'}
        </h2>

        {/* Subtitle */}
        <p style={{
          fontStyle: 'italic',
          color: theme === 'dark' ? '#CCCCCC' : '#666666',
          marginBottom: '40px',
          fontSize: '16px'
        }}>
          {theme === 'dark' 
            ? 'Consult the probability algorithms of destiny...'
            : 'Consultez les mystères de votre destinée...'
          }
        </p>

        {/* Fortune Wheel */}
        <div style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          margin: '0 auto 30px',
          filter: glitchEffect ? 'hue-rotate(180deg) saturate(2)' : 'none',
          transition: 'filter 0.2s ease'
        }}>
          
          {/* Wheel SVG */}
          <svg
            ref={wheelRef}
            width="300"
            height="300"
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
              filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))'
            }}
          >
            {/* Draw wheel segments */}
            {segments.map((segment, index) => {
              const angle = 360 / segments.length;
              const startAngle = index * angle;
              const endAngle = (index + 1) * angle;
              
              const x1 = 150 + 140 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 150 + 140 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 150 + 140 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 150 + 140 * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 150 150`,
                `L ${x1} ${y1}`,
                `A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');

              return (
                <g key={segment.id}>
                  <path
                    d={pathData}
                    fill={segment.color}
                    stroke={theme === 'dark' ? '#000' : '#FFF'}
                    strokeWidth="2"
                    opacity={selectedSegment?.id === segment.id ? 1 : 0.8}
                  />
                  
                  {/* Segment Icon */}
                  <text
                    x={150 + 80 * Math.cos(((startAngle + endAngle) / 2 * Math.PI) / 180)}
                    y={150 + 80 * Math.sin(((startAngle + endAngle) / 2 * Math.PI) / 180)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="24"
                  >
                    {segment.icon}
                  </text>
                </g>
              );
            })}
            
            {/* Center hub */}
            <circle
              cx="150"
              cy="150"
              r="25"
              fill={theme === 'dark' ? '#1a1a2e' : '#F5F5DC'}
              stroke={theme === 'dark' ? '#00FFFF' : '#B8860B'}
              strokeWidth="3"
            />
            
            {/* Center decoration */}
            <text
              x="150"
              y="150"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
            >
              🔮
            </text>
          </svg>

          {/* Pointer */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: `25px solid ${theme === 'dark' ? '#FF1493' : '#8B4513'}`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            zIndex: 10
          }} />
        </div>

        {/* Spin Button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            fontFamily: 'Cinzel, serif',
            fontWeight: 'bold',
            background: isSpinning
              ? 'linear-gradient(135deg, #666, #999)'
              : theme === 'dark'
                ? 'linear-gradient(135deg, #8A2BE2, #FF1493)'
                : 'linear-gradient(135deg, #DDA0DD, #FF69B4)',
            color: '#FFF',
            border: 'none',
            borderRadius: '10px',
            cursor: isSpinning ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '20px'
          }}
          onMouseEnter={(e) => {
            if (!isSpinning) {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 5px 20px rgba(138,43,226,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSpinning) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {isSpinning ? 'Consulting the Fates...' : 'Spin the Wheel of Destiny'}
        </button>

        {/* Fortune Result */}
        {showResult && fortune && (
          <div style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(0,255,255,0.1))'
              : 'linear-gradient(135deg, rgba(184,134,11,0.1), rgba(255,215,0,0.1))',
            border: `2px solid ${selectedSegment?.color || '#FFD700'}`,
            borderRadius: '15px',
            padding: '20px',
            marginTop: '20px',
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            <h3 style={{
              fontSize: '20px',
              color: selectedSegment?.color || '#FFD700',
              marginBottom: '10px',
              fontFamily: 'Cinzel, serif'
            }}>
              {fortune.title}
            </h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              marginBottom: '15px',
              color: theme === 'dark' ? '#CCCCCC' : '#666666'
            }}>
              <span style={{ fontStyle: 'italic' }}>
                {theme === 'dark' 
                  ? fortune.segment?.futuristic 
                  : fortune.segment?.belleEpoque
                }
              </span>
              <span>{fortune.segment?.icon}</span>
            </div>
            
            <p style={{
              fontSize: '16px',
              lineHeight: '1.5',
              color: theme === 'dark' ? '#FFF' : '#333',
              marginBottom: '15px'
            }}>
              {fortune.message}
            </p>
            
            <div style={{
              fontSize: '14px',
              color: theme === 'dark' ? '#00FFFF' : '#8B4513',
              fontWeight: 'bold'
            }}>
              Effect: {fortune.effect}
            </div>
          </div>
        )}

        {/* Mystical Text */}
        <div style={{
          fontSize: '12px',
          color: theme === 'dark' ? '#888' : '#999',
          fontStyle: 'italic',
          marginTop: '20px'
        }}>
          {theme === 'dark' 
            ? 'Algorithm powered by quantum probability matrices'
            : 'Guidé par les esprits anciens et la sagesse éternelle'
          }
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}