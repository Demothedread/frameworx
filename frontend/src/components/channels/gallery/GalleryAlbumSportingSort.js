import React, { useEffect, useState } from 'react';
import { fetchAlbumImages } from './GalleryData';
import Immersive3DPhotoViewer from './Immersive3DPhotoViewer';
import { getGamificationSystem } from '../../../utils/GamificationSystem';

/**
 * Enhanced Sporting Sort album with 3D photo viewing capabilities
 * Features Belle Époque-Futurism design with scoreboard aesthetics
 * @param {object} props
 * @param {string} [props.source] Image source identifier.
 * @param {string} [props.theme] Current theme (light/dark).
 * @param {object} [props.particleEngine] Particle engine instance.
 */
export default function GalleryAlbumSportySports({ source, theme = 'light', particleEngine }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const gamificationSystem = getGamificationSystem();

  useEffect(() => {
    fetchAlbumImages(source, 'sporting-sort').then(setImages);
    // Track album interaction
    gamificationSystem.interactWithChannel('gallery', 'sporting-sort-album');
  }, [source]);

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    gamificationSystem.interactWithChannel('gallery', '3d-viewer-open');
    
    // Create particle effects
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      particleEngine.createEffect('ornamentBurst', centerX, centerY);
    }
  };

  return (
    <div className="sporting-sort-enhanced">
      <div style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
          : 'linear-gradient(135deg, #f5f5f5, #e8e8e8)',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'Cinzel, serif'
      }}>
        
        {/* Enhanced Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <h2 style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '2.5rem',
            background: theme === 'dark'
              ? 'linear-gradient(45deg, #FFD700, #FF1493)'
              : 'linear-gradient(45deg, #8B4513, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            borderBottom: `4px double ${theme === 'dark' ? '#FFD700' : '#8B4513'}`,
            paddingBottom: '1rem',
            margin: '0 auto',
            display: 'inline-block'
          }}>
            ⚽ Sporting Sort Championship ⚽
          </h2>
          
          <div style={{
            marginTop: '1rem',
            color: theme === 'dark' ? '#CCCCCC' : '#666666',
            fontSize: '1.1rem',
            fontStyle: 'italic'
          }}>
            {theme === 'dark'
              ? 'Digital Sports Archive - Holographic Enhancement Available'
              : 'Collection Sportive Classique - Vue Stéréoscopique Disponible'
            }
          </div>
        </div>

        {/* Enhanced Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {images.map((img, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                cursor: 'pointer',
                transform: hoveredIndex === i ? 'scale(1.05) translateY(-5px)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                filter: hoveredIndex === i
                  ? 'drop-shadow(0 10px 25px rgba(255,215,0,0.4))'
                  : 'drop-shadow(0 5px 15px rgba(0,0,0,0.2))'
              }}
              onClick={() => handleImageClick(img, i)}
              onMouseEnter={() => {
                setHoveredIndex(i);
                if (particleEngine) {
                  const rect = document.elementFromPoint(0, 0);
                  particleEngine.createEffect('holographicPulse',
                    window.innerWidth * 0.2 + (i % 4) * window.innerWidth * 0.2,
                    window.innerHeight * 0.4,
                    { count: 5 }
                  );
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              
              {/* Scoreboard-style Frame */}
              <div style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #2a2a4e, #1e1e3a)'
                  : 'linear-gradient(135deg, #f0f0f0, #d4d4d4)',
                border: `4px solid ${theme === 'dark' ? '#FFD700' : '#8B4513'}`,
                borderRadius: '15px',
                padding: '15px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                
                {/* Competition Number */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: theme === 'dark' ? '#FF1493' : '#e53935',
                  color: '#FFF',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  zIndex: 2
                }}>
                  {i + 1}
                </div>

                {/* 3D View Indicator */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: theme === 'dark'
                    ? 'linear-gradient(45deg, #00FFFF, #FF1493)'
                    : 'linear-gradient(45deg, #1E90FF, #8A2BE2)',
                  color: '#FFF',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  zIndex: 2,
                  opacity: hoveredIndex === i ? 1 : 0.7,
                  transform: hoveredIndex === i ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}>
                  3D
                </div>

                {/* Image Container */}
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  aspectRatio: '4/3'
                }}>
                  <img
                    src={img.src}
                    alt={img.caption}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      border: `2px solid ${theme === 'dark' ? '#444' : '#ccc'}`,
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      filter: hoveredIndex === i
                        ? 'brightness(1.1) contrast(1.1) saturate(1.2)'
                        : 'brightness(1) contrast(1) saturate(1)'
                    }}
                  />
                  
                  {/* Overlay Effects */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: hoveredIndex === i
                      ? theme === 'dark'
                        ? 'linear-gradient(45deg, rgba(0,255,255,0.1), rgba(255,20,147,0.1))'
                        : 'linear-gradient(45deg, rgba(255,215,0,0.1), rgba(184,134,11,0.1))'
                      : 'transparent',
                    transition: 'background 0.3s ease',
                    borderRadius: '8px'
                  }} />

                  {/* Holographic Scan Line */}
                  {hoveredIndex === i && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)',
                      animation: 'scanLine 1s ease-out',
                      borderRadius: '8px'
                    }} />
                  )}
                </div>

                {/* Caption */}
                <div style={{
                  background: theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(0,255,255,0.05))'
                    : 'linear-gradient(135deg, rgba(184,134,11,0.1), rgba(255,215,0,0.1))',
                  padding: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255,215,0,0.3)' : 'rgba(184,134,11,0.3)'}`,
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: theme === 'dark' ? '#FFD700' : '#8B4513',
                    marginBottom: '4px'
                  }}>
                    {img.caption || `Sport Event ${i + 1}`}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: theme === 'dark' ? '#CCCCCC' : '#666666',
                    fontStyle: 'italic'
                  }}>
                    Click for 3D Immersion
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          <div>Click any image to enter immersive 3D viewing mode</div>
          <div>Experience vintage stereoscope effects or futuristic holographic projection</div>
        </div>
      </div>

      {/* 3D Photo Viewer */}
      {selectedImage && (
        <Immersive3DPhotoViewer
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          theme={theme}
          particleEngine={particleEngine}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes scanLine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
