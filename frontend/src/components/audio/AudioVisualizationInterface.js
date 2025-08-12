import React, { useState, useEffect, useRef } from 'react';
import { getAudioReactiveEngine } from '../../utils/AudioReactiveEngine';

/**
 * Audio Visualization Interface Component
 * 
 * Provides visual controls and displays for the Belle Époque-Futuristic audio reactive system:
 * - Vintage gramophone control panel with ornate brass details
 * - Cyberpunk spectrum analyzer display with holographic overlays
 * - Real-time frequency visualization with particle synchronization
 * - Audio source selection and sensitivity controls
 * - Mode switching between classical and digital visualizations
 */

export default function AudioVisualizationInterface({ 
  isActive, 
  onAudioDataUpdate, 
  particleEngine,
  theme = 'light',
  channelContext = 'default'
}) {
  const [audioEngine] = useState(() => getAudioReactiveEngine());
  const [isEnabled, setIsEnabled] = useState(false);
  const [visualizationMode, setVisualizationMode] = useState('gramophone');
  const [audioData, setAudioData] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.7);
  const [isInitialized, setIsInitialized] = useState(false);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      initializeAudioVisualization();
    } else {
      audioEngine.stop();
      setIsEnabled(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (isEnabled) {
      audioEngine.start(channelContext);
    }
  }, [isEnabled, channelContext]);

  const initializeAudioVisualization = async () => {
    try {
      await audioEngine.initialize(particleEngine, theme);
      
      // Setup visualization callback
      audioEngine.onVisualization((data) => {
        setAudioData(data);
        onAudioDataUpdate?.(data);
        updateCanvas(data);
      });
      
      audioEngine.setTheme(theme);
      audioEngine.setVisualizationMode(visualizationMode);
      
      setIsInitialized(true);
    } catch (error) {
      console.warn('Failed to initialize audio visualization:', error);
    }
  };

  const requestAudioPermission = async () => {
    try {
      await audioEngine.addAudioSource('microphone');
      setHasPermission(true);
      setIsEnabled(true);
    } catch (error) {
      console.warn('Microphone permission denied, using ambient mode:', error);
      await audioEngine.addAudioSource('ambient');
      setHasPermission(false);
      setIsEnabled(true);
    }
  };

  const toggleVisualizationMode = () => {
    const newMode = visualizationMode === 'gramophone' ? 'spectrum-analyzer' : 'gramophone';
    setVisualizationMode(newMode);
    audioEngine.setVisualizationMode(newMode);
  };

  const updateSensitivity = (newSensitivity) => {
    setSensitivity(newSensitivity);
    audioEngine.sensitivity = newSensitivity;
  };

  const updateCanvas = (data) => {
    if (!canvasRef.current || !data) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { frequencyData, timeData } = data;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (visualizationMode === 'gramophone') {
      drawGramophoneVisualization(ctx, frequencyData, timeData);
    } else {
      drawSpectrumAnalyzerVisualization(ctx, frequencyData, timeData);
    }
  };

  const drawGramophoneVisualization = (ctx, frequencyData, timeData) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 20;
    
    // Calculate average amplitude
    const avgAmplitude = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;
    const normalizedAmplitude = avgAmplitude / 255;
    
    // Draw vinyl record base
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = theme === 'dark' ? '#2a1a0a' : '#1a0f05';
    ctx.fill();
    
    // Draw grooves
    for (let i = 0; i < 12; i++) {
      const radius = (maxRadius * 0.2) + (i / 12) * (maxRadius * 0.6);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 + normalizedAmplitude * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    
    // Draw frequency visualization as ornamental patterns
    const time = Date.now() / 1000;
    for (let i = 0; i < frequencyData.length; i += 4) {
      const amplitude = frequencyData[i] / 255;
      const angle = (i / frequencyData.length) * Math.PI * 2 + time * 0.5;
      const radius = maxRadius * 0.3 + amplitude * maxRadius * 0.4;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, 2 + amplitude * 3, 0, Math.PI * 2);
      ctx.fillStyle = visualizationMode === 'gramophone' 
        ? `hsla(${45 + amplitude * 30}, 70%, 60%, ${0.6 + amplitude * 0.4})`
        : `hsla(${180 + amplitude * 60}, 80%, 50%, ${0.6 + amplitude * 0.4})`;
      ctx.fill();
    }
    
    // Draw needle
    const needleAngle = time * 0.3;
    const needleLength = maxRadius * 0.7;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(needleAngle) * needleLength,
      centerY + Math.sin(needleAngle) * needleLength
    );
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const drawSpectrumAnalyzerVisualization = (ctx, frequencyData, timeData) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const barCount = Math.min(64, frequencyData.length);
    const barWidth = width / barCount;
    
    // Draw spectrum bars
    for (let i = 0; i < barCount; i++) {
      const amplitude = frequencyData[i] / 255;
      const barHeight = amplitude * height * 0.8;
      
      const x = i * barWidth;
      const y = height - barHeight;
      
      // Create gradient for cyberpunk effect
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, `hsla(${180 + i * 3}, 100%, 50%, 0.8)`);
      gradient.addColorStop(0.5, `hsla(${200 + i * 2}, 100%, 60%, 0.9)`);
      gradient.addColorStop(1, `hsla(${220 + i}, 100%, 70%, 1)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 2, barHeight);
      
      // Add glow effect
      if (amplitude > 0.3) {
        ctx.shadowColor = `hsl(${180 + i * 3}, 100%, 50%)`;
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        ctx.shadowBlur = 0;
      }
    }
    
    // Draw waveform overlay
    ctx.beginPath();
    ctx.strokeStyle = theme === 'dark' ? '#00FFFF' : '#FF1493';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < timeData.length; i++) {
      const amplitude = (timeData[i] - 128) / 128;
      const x = (i / timeData.length) * width;
      const y = height / 2 + amplitude * height * 0.3;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  if (!isActive) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '320px',
      height: '240px',
      zIndex: 1000,
      fontFamily: 'Cinzel, serif'
    }}>
      
      {/* Main Visualization Panel */}
      <div style={{
        background: visualizationMode === 'gramophone'
          ? 'linear-gradient(135deg, rgba(139,69,19,0.95), rgba(205,133,63,0.95))'
          : 'linear-gradient(135deg, rgba(26,26,58,0.95), rgba(42,42,74,0.95))',
        border: visualizationMode === 'gramophone'
          ? '3px solid #FFD700'
          : '3px solid #00FFFF',
        borderRadius: '15px',
        padding: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <h4 style={{
            margin: 0,
            fontSize: '14px',
            color: visualizationMode === 'gramophone' ? '#FFD700' : '#00FFFF'
          }}>
            {visualizationMode === 'gramophone' ? '🎼 Gramophone' : '📊 Spectrum'}
          </h4>
          
          <button
            onClick={toggleVisualizationMode}
            style={{
              background: 'transparent',
              border: `1px solid ${visualizationMode === 'gramophone' ? '#FFD700' : '#00FFFF'}`,
              color: visualizationMode === 'gramophone' ? '#FFD700' : '#00FFFF',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            Switch
          </button>
        </div>

        {/* Visualization Canvas */}
        <canvas
          ref={canvasRef}
          width={280}
          height={140}
          style={{
            width: '100%',
            height: '140px',
            background: visualizationMode === 'gramophone'
              ? 'radial-gradient(circle, rgba(26,13,5,0.8), rgba(52,26,13,0.8))'
              : 'radial-gradient(circle, rgba(0,0,0,0.9), rgba(26,26,58,0.8))',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        />

        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '10px',
          gap: '10px'
        }}>
          
          {/* Enable/Disable Button */}
          {!isEnabled ? (
            <button
              onClick={requestAudioPermission}
              style={{
                background: visualizationMode === 'gramophone'
                  ? 'linear-gradient(135deg, #32CD32, #228B22)'
                  : 'linear-gradient(135deg, #00FFFF, #0080FF)',
                border: 'none',
                color: '#FFF',
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif'
              }}
            >
              🎵 Enable Audio
            </button>
          ) : (
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              style={{
                background: isEnabled
                  ? 'linear-gradient(135deg, #FF6B6B, #FF4757)'
                  : 'linear-gradient(135deg, #32CD32, #228B22)',
                border: 'none',
                color: '#FFF',
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif'
              }}
            >
              {isEnabled ? '🔊 ON' : '🔇 OFF'}
            </button>
          )}

          {/* Sensitivity Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              fontSize: '10px',
              color: visualizationMode === 'gramophone' ? '#FFD700' : '#00FFFF'
            }}>
              Sensitivity
            </span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={sensitivity}
              onChange={(e) => updateSensitivity(parseFloat(e.target.value))}
              style={{
                width: '60px',
                height: '4px',
                background: visualizationMode === 'gramophone' ? '#B8860B' : '#8A2BE2',
                borderRadius: '2px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Audio Data Display */}
      {audioData && isEnabled && (
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '0',
          background: 'rgba(0,0,0,0.8)',
          color: '#FFF',
          padding: '5px 10px',
          borderRadius: '8px',
          fontSize: '10px',
          fontFamily: 'monospace'
        }}>
          <div>Low: {Math.round(audioData.lowFreqEnergy * 100)}%</div>
          <div>Mid: {Math.round(audioData.midFreqEnergy * 100)}%</div>
          <div>High: {Math.round(audioData.highFreqEnergy * 100)}%</div>
        </div>
      )}

      {/* Permission Status */}
      {!hasPermission && isEnabled && (
        <div style={{
          position: 'absolute',
          bottom: '-25px',
          left: '0',
          fontSize: '10px',
          color: '#FFA500',
          fontStyle: 'italic'
        }}>
          Using ambient audio simulation
        </div>
      )}
    </div>
  );
}