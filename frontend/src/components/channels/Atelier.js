import React, { useState, useEffect, useRef } from 'react';
import { getGamificationSystem } from '../../utils/GamificationSystem';
import useParticleEngine from '../../hooks/useParticleEngine';

/**
 * Belle Époque Art Atelier with Futuristic Tools
 * 
 * A creative studio that seamlessly blends traditional French artistic practices
 * with cutting-edge digital creation tools:
 * - Classical artist's studio with easels, palettes, and vintage materials
 * - Holographic collaborative canvas with real-time particle brush effects
 * - Traditional oil painting tools morphing into digital light brushes
 * - Art Nouveau ornamental frames transforming into neon wireframes
 * - Vintage color theory with cyberpunk RGB spectrum manipulation
 * - Collaborative features for multiple artists working simultaneously
 */

export default function Atelier() {
  // Get theme and setup particle engine within component
  const [theme, setTheme] = useState('light');
  const [atelierMode, setAtelierMode] = useState('traditional'); // 'traditional' | 'holographic'
  const [selectedTool, setSelectedTool] = useState('brush');
  const [brushColor, setBrushColor] = useState('#FFD700');
  const [brushSize, setBrushSize] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasHistory, setCanvasHistory] = useState([]);
  const canvasRef = useRef(null);
  const gamificationSystem = getGamificationSystem();
  
  // Particle system for atelier effects
  const particleConfig = {
    maxParticles: 200,
    ornamentDensity: 0.3,
    cursorTrailIntensity: 0.5,
    matrixRainDensity: theme === 'dark' ? 0.08 : 0.02,
    clockworkDensity: 0.2,
    vineDensity: 0.05,
    enableGlow: true,
    enableHolographic: theme === 'dark',
    belleEpoqueColors: ['#FFD700', '#B8860B', '#CD853F', '#DEB887', '#F4A460'],
    futuristicColors: ['#00FFFF', '#FF1493', '#8A2BE2', '#32CD32', '#FF4500']
  };

  const { canvasRef: particleCanvasRef, engine: particleEngine } = useParticleEngine(particleConfig, true);

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

  // Belle Époque artistic tools with futuristic variants
  const artisticTools = {
    traditional: [
      { 
        id: 'brush', 
        name: 'Pinceau Artistique', 
        icon: '🖌️', 
        description: 'Elegant horsehair brush for refined strokes',
        effects: ['smooth', 'textured']
      },
      { 
        id: 'palette-knife', 
        name: 'Couteau à Palette', 
        icon: '🎨', 
        description: 'Ivory-handled knife for impasto technique',
        effects: ['thick', 'sculptural']
      },
      { 
        id: 'charcoal', 
        name: 'Fusain Parisien', 
        icon: '✏️', 
        description: 'Premium willow charcoal for sketching',
        effects: ['soft', 'blended']
      },
      { 
        id: 'watercolor', 
        name: 'Aquarelle Fine', 
        icon: '💧', 
        description: 'Transparent watercolor pigments',
        effects: ['flowing', 'luminous']
      }
    ],
    holographic: [
      { 
        id: 'light-brush', 
        name: 'Neural Light Brush', 
        icon: '✨', 
        description: 'Photon-based drawing tool with AI assistance',
        effects: ['glow', 'particle-trail']
      },
      { 
        id: 'quantum-spray', 
        name: 'Quantum Spray Tool', 
        icon: '🌌', 
        description: 'Multi-dimensional color application',
        effects: ['holographic', 'shimmer']
      },
      { 
        id: 'data-pen', 
        name: 'Data Stream Pen', 
        icon: '🖊️', 
        description: 'Precision vector tool with real-time rendering',
        effects: ['crisp', 'vector']
      },
      { 
        id: 'emotion-sampler', 
        name: 'Emotion Color Sampler', 
        icon: '🎭', 
        description: 'AI-powered mood-to-color translator',
        effects: ['dynamic', 'expressive']
      }
    ]
  };

  // Belle Époque color palette with futuristic extensions
  const colorPalettes = {
    traditional: {
      name: 'Palette Classique',
      colors: ['#8B4513', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#A0522D', '#FFD700', '#B8860B']
    },
    impressionist: {
      name: 'Impressionniste',
      colors: ['#E6E6FA', '#D8BFD8', '#DDA0DD', '#DA70D6', '#BA55D3', '#9370DB', '#8A2BE2', '#9400D3']
    },
    artNouveau: {
      name: 'Art Nouveau',
      colors: ['#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF7F', '#00FA9A', '#7CFC00', '#7FFF00']
    },
    holographic: {
      name: 'Holographic Spectrum',
      colors: ['#00FFFF', '#FF1493', '#8A2BE2', '#32CD32', '#FF4500', '#1E90FF', '#FFD700', '#FF69B4']
    },
    cyberpunk: {
      name: 'Cyber RGB',
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#FFFF00', '#00FFFF', '#FF8000', '#8000FF']
    }
  };

  useEffect(() => {
    gamificationSystem.interactWithChannel('atelier', 'studio-enter');
    
    // Initialize canvas
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Set canvas background
      ctx.fillStyle = atelierMode === 'traditional' ? '#F5F5DC' : '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [atelierMode]);

  const toggleAtelierMode = () => {
    const newMode = atelierMode === 'traditional' ? 'holographic' : 'traditional';
    setAtelierMode(newMode);
    
    gamificationSystem.interactWithChannel('atelier', `mode-${newMode}`);
    
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      if (newMode === 'holographic') {
        particleEngine.createEffect('holographicPulse', centerX, centerY, { count: 30 });
      } else {
        particleEngine.createEffect('ornamentBurst', centerX, centerY);
      }
    }
  };

  const selectTool = (toolId) => {
    setSelectedTool(toolId);
    gamificationSystem.interactWithChannel('atelier', `tool-${toolId}`);
    
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      particleEngine.createEffect('clockwork', centerX, centerY);
    }
  };

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Create particle effect at brush touch
    if (particleEngine && atelierMode === 'holographic') {
      particleEngine.createEffect('vineGrowth', e.clientX, e.clientY, { segments: 5 });
    }
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;
    
    // Apply tool-specific effects
    const currentTools = artisticTools[atelierMode];
    const tool = currentTools.find(t => t.id === selectedTool);
    
    if (tool) {
      switch (tool.id) {
        case 'light-brush':
          ctx.shadowColor = brushColor;
          ctx.shadowBlur = 15;
          ctx.globalCompositeOperation = 'screen';
          break;
        case 'quantum-spray':
          ctx.globalCompositeOperation = 'multiply';
          ctx.globalAlpha = 0.7;
          break;
        case 'watercolor':
          ctx.globalAlpha = 0.5;
          ctx.globalCompositeOperation = 'multiply';
          break;
        default:
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
      }
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Continuous particle effects for holographic mode
    if (particleEngine && atelierMode === 'holographic' && Math.random() < 0.3) {
      particleEngine.createEffect('holographicPulse', e.clientX, e.clientY, { count: 3 });
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL();
      setCanvasHistory(prev => [...prev, imageData]);
      
      gamificationSystem.interactWithChannel('atelier', 'artwork-created');
      
      if (particleEngine) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        particleEngine.createEffect('ornamentBurst', centerX, centerY);
      }
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = atelierMode === 'traditional' ? '#F5F5DC' : '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveArtwork = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `atelier-artwork-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    gamificationSystem.awardXP(50, 25, 'Artwork saved');
    
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      particleEngine.createEffect('holographicPulse', centerX, centerY, { count: 20 });
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Atelier Particle Canvas */}
      <canvas
        ref={particleCanvasRef}
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

      {/* Main Atelier Content */}
      <div style={{
        background: atelierMode === 'traditional'
          ? (theme === 'dark' 
            ? 'radial-gradient(circle at center, #3a2a1a, #2a1a0a, #1a0f05)'
            : 'radial-gradient(circle at center, #f8f4e6, #f0e68c, #e6d8b5)')
          : (theme === 'dark'
            ? 'radial-gradient(circle at center, #1a1a3a, #0a0a2a, #05051a)'
            : 'radial-gradient(circle at center, #e8e8ff, #d0d0f0, #b8b8e0)'),
        minHeight: '100vh',
        fontFamily: 'Cinzel, serif',
        padding: '1rem',
        position: 'relative',
        zIndex: 2
      }}>
        
        {/* Atelier Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            background: atelierMode === 'traditional'
              ? 'linear-gradient(45deg, #8B4513, #FFD700, #CD853F)'
              : 'linear-gradient(45deg, #00FFFF, #FF1493, #8A2BE2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem'
          }}>
            {atelierMode === 'traditional' ? '🎨 L\'Atelier Parisien 🎨' : '🌟 Digital Art Studio 🌟'}
          </h1>
          
          <p style={{
            color: theme === 'dark' ? '#CCCCCC' : '#666666',
            fontStyle: 'italic',
            marginBottom: '1rem'
          }}>
            {atelierMode === 'traditional'
              ? 'Un espace de création artistique traditionnel et raffiné'
              : 'An advanced holographic creative environment'
            }
          </p>

          <button
            onClick={toggleAtelierMode}
            style={{
              background: atelierMode === 'traditional'
                ? 'linear-gradient(135deg, #8A2BE2, #FF1493)'
                : 'linear-gradient(135deg, #B8860B, #FFD700)',
              border: 'none',
              color: '#FFF',
              padding: '12px 25px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'Cinzel, serif'
            }}
          >
            {atelierMode === 'traditional' ? '🚀 Enter Digital Mode' : '🎭 Return to Traditional'}
          </button>
        </div>

        {/* Studio Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '250px 1fr 200px',
          gap: '1rem',
          height: 'calc(100vh - 180px)'
        }}>
          
          {/* Tool Palette */}
          <div style={{
            background: atelierMode === 'traditional'
              ? 'linear-gradient(135deg, rgba(139,69,19,0.9), rgba(205,133,63,0.9))'
              : 'linear-gradient(135deg, rgba(26,26,58,0.9), rgba(42,42,74,0.9))',
            border: atelierMode === 'traditional'
              ? '3px solid #FFD700'
              : '3px solid #00FFFF',
            borderRadius: '15px',
            padding: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: atelierMode === 'traditional' ? '#FFD700' : '#00FFFF',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {atelierMode === 'traditional' ? 'Outils Classiques' : 'Digital Tools'}
            </h3>

            {/* Tools */}
            <div style={{ marginBottom: '1.5rem' }}>
              {artisticTools[atelierMode].map(tool => (
                <button
                  key={tool.id}
                  onClick={() => selectTool(tool.id)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    margin: '5px 0',
                    background: selectedTool === tool.id
                      ? (atelierMode === 'traditional' ? '#FFD700' : '#00FFFF')
                      : 'transparent',
                    border: atelierMode === 'traditional' 
                      ? '2px solid #B8860B' 
                      : '2px solid #8A2BE2',
                    borderRadius: '8px',
                    color: selectedTool === tool.id 
                      ? '#000' 
                      : (theme === 'dark' ? '#FFF' : '#333'),
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Cinzel, serif',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: '3px' }}>
                    {tool.icon}
                  </div>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                    {tool.name}
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>
                    {tool.description}
                  </div>
                </button>
              ))}
            </div>

            {/* Color Palettes */}
            <div>
              <h4 style={{
                color: atelierMode === 'traditional' ? '#FFD700' : '#00FFFF',
                marginBottom: '0.5rem',
                fontSize: '14px'
              }}>
                Palettes
              </h4>
              
              {Object.entries(colorPalettes).map(([key, palette]) => {
                if (atelierMode === 'traditional' && ['holographic', 'cyberpunk'].includes(key)) return null;
                if (atelierMode === 'holographic' && ['traditional', 'impressionist', 'artNouveau'].includes(key)) return null;
                
                return (
                  <div key={key} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '11px', marginBottom: '3px', color: '#CCC' }}>
                      {palette.name}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
                      {palette.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setBrushColor(color)}
                          style={{
                            width: '20px',
                            height: '20px',
                            background: color,
                            border: brushColor === color ? '2px solid #FFF' : '1px solid #666',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Brush Size */}
            <div style={{ marginTop: '1rem' }}>
              <label style={{
                color: atelierMode === 'traditional' ? '#FFD700' : '#00FFFF',
                fontSize: '12px',
                display: 'block',
                marginBottom: '5px'
              }}>
                Brush Size: {brushSize}px
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '5px',
                  background: atelierMode === 'traditional' ? '#B8860B' : '#8A2BE2',
                  borderRadius: '5px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Main Canvas Area */}
          <div style={{
            background: atelierMode === 'traditional'
              ? 'linear-gradient(135deg, #8B4513, #CD853F)'
              : 'linear-gradient(135deg, #1a1a3a, #2a2a4a)',
            border: atelierMode === 'traditional'
              ? '5px solid #FFD700'
              : '5px solid #00FFFF',
            borderRadius: '20px',
            padding: '1rem',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            
            {/* Ornate Frame Decorations */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              bottom: '10px',
              border: atelierMode === 'traditional'
                ? '2px solid #B8860B'
                : '2px solid #FF1493',
              borderRadius: '15px',
              pointerEvents: 'none'
            }} />

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              style={{
                background: atelierMode === 'traditional' ? '#F5F5DC' : '#000',
                border: '2px solid #666',
                borderRadius: '10px',
                cursor: 'crosshair',
                maxWidth: '100%',
                maxHeight: '100%',
                width: '600px',
                height: '400px'
              }}
            />

            {/* Holographic Overlay Effects */}
            {atelierMode === 'holographic' && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                right: '1rem',
                bottom: '1rem',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.05) 3px)',
                pointerEvents: 'none',
                borderRadius: '15px'
              }} />
            )}
          </div>

          {/* Action Panel */}
          <div style={{
            background: atelierMode === 'traditional'
              ? 'linear-gradient(135deg, rgba(139,69,19,0.9), rgba(205,133,63,0.9))'
              : 'linear-gradient(135deg, rgba(26,26,58,0.9), rgba(42,42,74,0.9))',
            border: atelierMode === 'traditional'
              ? '3px solid #FFD700'
              : '3px solid #00FFFF',
            borderRadius: '15px',
            padding: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              color: atelierMode === 'traditional' ? '#FFD700' : '#00FFFF',
              marginBottom: '1rem',
              textAlign: 'center',
              fontSize: '16px'
            }}>
              Actions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={clearCanvas}
                style={{
                  background: atelierMode === 'traditional' 
                    ? 'linear-gradient(135deg, #CD853F, #DEB887)'
                    : 'linear-gradient(135deg, #8A2BE2, #FF1493)',
                  border: 'none',
                  color: '#FFF',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'Cinzel, serif'
                }}
              >
                🗑️ Clear Canvas
              </button>

              <button
                onClick={saveArtwork}
                style={{
                  background: atelierMode === 'traditional' 
                    ? 'linear-gradient(135deg, #32CD32, #228B22)'
                    : 'linear-gradient(135deg, #00FFFF, #0080FF)',
                  border: 'none',
                  color: '#FFF',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'Cinzel, serif'
                }}
              >
                💾 Save Artwork
              </button>

              {canvasHistory.length > 0 && (
                <div style={{
                  marginTop: '1rem',
                  fontSize: '11px',
                  color: theme === 'dark' ? '#CCC' : '#666'
                }}>
                  <div style={{ marginBottom: '5px' }}>History: {canvasHistory.length} versions</div>
                  <button
                    onClick={() => setCanvasHistory([])}
                    style={{
                      background: 'transparent',
                      border: '1px solid #666',
                      color: theme === 'dark' ? '#CCC' : '#666',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    Clear History
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: '#FFF',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <div>Mode: {atelierMode === 'traditional' ? 'Traditional Atelier' : 'Holographic Studio'}</div>
          <div>Tool: {selectedTool}</div>
          <div>Color: {brushColor}</div>
          <div>Size: {brushSize}px</div>
        </div>
      </div>
    </div>
  );
}