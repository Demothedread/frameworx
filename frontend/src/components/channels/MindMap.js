import React, { useState, useEffect } from 'react';
import MindMapSalon from './MindMapSalon';
import useParticleEngine from '../../hooks/useParticleEngine';
import { getGamificationSystem } from '../../utils/GamificationSystem';

/**
 * Enhanced MindMap Channel - Belle Époque Social Salon
 * Transforms the traditional mind map into an interactive salon experience
 * with floating conversation bubbles and golden particle connections
 */
export default function MindMap() {
  const [theme, setTheme] = useState('light');
  const gamificationSystem = getGamificationSystem();

  // Particle system for mind map salon effects
  const particleConfig = {
    maxParticles: 150,
    ornamentDensity: 0.3,
    cursorTrailIntensity: 0.4,
    matrixRainDensity: theme === 'dark' ? 0.08 : 0.02,
    clockworkDensity: 0.15,
    vineDensity: 0.06,
    enableGlow: true,
    enableHolographic: theme === 'dark',
    belleEpoqueColors: ['#FFD700', '#B8860B', '#CD853F', '#DEB887', '#F4A460'],
    futuristicColors: ['#00FFFF', '#FF1493', '#8A2BE2', '#32CD32', '#FF6347']
  };

  const { canvasRef, engine } = useParticleEngine(particleConfig, true);

  // Detect theme changes
  useEffect(() => {
    const detectTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    };
    
    detectTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener(detectTheme);
    
    return () => mediaQuery.removeListener(detectTheme);
  }, []);

  // Track mindmap access
  useEffect(() => {
    gamificationSystem.interactWithChannel('mindmap', 'salon-access');
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Mind Map Salon Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Main Salon Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <MindMapSalon 
          theme={theme}
          particleEngine={engine}
        />
      </div>
    </div>
  );
}
