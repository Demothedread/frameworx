import { useEffect, useRef } from 'react';
import { BelleEpoqueParticleEngine } from '../utils/ParticleEngine';

/**
 * React hook for integrating the Belle Époque-Futurism Particle Engine
 * 
 * @param {Object} config - Configuration options for the particle engine
 * @param {boolean} enabled - Whether the particle system should be active
 * @returns {Object} - Canvas ref and particle engine instance
 */
export function useParticleEngine(config = {}, enabled = true) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    // Initialize particle engine
    engineRef.current = new BelleEpoqueParticleEngine(canvasRef.current);
    
    // Apply custom configuration
    if (Object.keys(config).length > 0) {
      engineRef.current.updateConfig(config);
    }

    // Start the particle system
    engineRef.current.start();

    // Cleanup function
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, [enabled, config]);

  // Update configuration when it changes
  useEffect(() => {
    if (engineRef.current && Object.keys(config).length > 0) {
      engineRef.current.updateConfig(config);
    }
  }, [config]);

  const createEffect = (type, x, y, effectConfig = {}) => {
    if (engineRef.current) {
      engineRef.current.createEffect(type, x, y, effectConfig);
    }
  };

  return {
    canvasRef,
    engine: engineRef.current,
    createEffect
  };
}

export default useParticleEngine;