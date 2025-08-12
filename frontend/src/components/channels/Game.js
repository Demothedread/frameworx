import { useEffect, useState } from 'react';
import useParticleEngine from '../../hooks/useParticleEngine';
import { getGamificationSystem } from '../../utils/GamificationSystem';
import BelleEpoqueArcade from './BelleEpoqueArcade';

/**
 * Enhanced Belle Époque-Futuristic Gaming Platform
 * 
 * Transforms the traditional gaming experience into an immersive arcade that blends:
 * - Victorian carnival aesthetics with cyberpunk gaming interfaces
 * - Vintage slot machine game selection with holographic displays
 * - Belle Époque aristocratic gaming culture with futuristic leaderboards
 * - Ornate brass and mahogany styling with neon particle effects
 * - Classic French salon entertainment with digital neural interfaces
 */

import { useContext } from 'react';
import { SharedStateContext } from '../../context/SharedStateContext';

export default function Game() {
  const [theme, setTheme] = useState('light');
  const gamificationSystem = getGamificationSystem();
  const sharedState = useContext(SharedStateContext);
  const eventBus = sharedState?.eventBus;

  useEffect(() => {
    eventBus?.emit('user-action', { type: 'visit-channel', value: 'game' });
  }, [eventBus]);

  // Particle system for arcade gaming effects
  const particleConfig = {
    maxParticles: 250,
    ornamentDensity: 0.4,
    cursorTrailIntensity: 0.7,
    matrixRainDensity: theme === 'dark' ? 0.12 : 0.03,
    clockworkDensity: 0.25,
    vineDensity: 0.08,
    enableGlow: true,
    enableHolographic: theme === 'dark',
    belleEpoqueColors: ['#FFD700', '#B8860B', '#CD853F', '#DEB887', '#F4A460', '#DAA520'],
    futuristicColors: ['#00FFFF', '#FF1493', '#8A2BE2', '#32CD32', '#FF4500', '#1E90FF']
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

  // Track game channel access
  useEffect(() => {
    gamificationSystem.interactWithChannel('game', 'arcade-access');
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Game Arcade Particle Canvas */}
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

      {/* Main Arcade Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <BelleEpoqueArcade 
          theme={theme}
          particleEngine={engine}
        />
      </div>
    </div>
  );
}
