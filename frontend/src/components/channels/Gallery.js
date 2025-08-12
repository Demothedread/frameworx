import { useEffect, useState } from 'react';
import useParticleEngine from '../../hooks/useParticleEngine';
import { getGamificationSystem } from '../../utils/GamificationSystem';
import GalleryAlbumAuteurMonsieur from './gallery/GalleryAlbumAuteurMonsieur';
import GalleryAlbumGlobetrotter from './gallery/GalleryAlbumGlobetrotter';
import GalleryAlbumNewsJunket from './gallery/GalleryAlbumNewsJunket';
import GalleryAlbumSportingSort from './gallery/GalleryAlbumSportingSort';
import GalleryHome from './gallery/GalleryHome';

/**
 * Enhanced Gallery channel with Belle Époque-Futurism 3D photo viewing
 * Features immersive stereoscope to holographic transitions
 */
import { useContext } from 'react';
import { SharedStateContext } from '../../context/SharedStateContext';

export default function Gallery() {
  const [active, setActive] = useState(null);
  const [source] = useState('local'); // default image source
  const [theme, setTheme] = useState('light');
  const gamificationSystem = getGamificationSystem();
  const sharedState = useContext(SharedStateContext);
  const eventBus = sharedState?.eventBus;

  useEffect(() => {
    eventBus?.emit('user-action', { type: 'visit-channel', value: 'gallery' });
  }, [eventBus]);

  // Particle system for gallery-specific effects
  const particleConfig = {
    maxParticles: 200,
    ornamentDensity: 0.2,
    cursorTrailIntensity: 0.6,
    matrixRainDensity: 0.05,
    clockworkDensity: 0.1,
    vineDensity: 0.04,
    enableGlow: true,
    enableHolographic: theme === 'dark',
    belleEpoqueColors: ['#FFD700', '#B8860B', '#CD853F', '#DEB887'],
    futuristicColors: ['#00FFFF', '#FF1493', '#8A2BE2', '#32CD32']
  };

  const { canvasRef, engine } = useParticleEngine(particleConfig, true);

  // Detect theme from CSS variables or system preference
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

  // Track gallery interactions
  useEffect(() => {
    gamificationSystem.interactWithChannel('gallery', 'gallery-home');
  }, []);

  const albums = [
    { key: 'sporty-sports', name: 'Worker Sports Parade', color: '#e53935', preview: 'https://via.placeholder.com/400/ff4444' },
    { key: 'globetrotter', name: 'Globetrotter (Dreams of American Travel)', color: '#43a047', preview: 'https://via.placeholder.com/400/44ff44' },
    { key: 'auteur-monsieur', name: 'Auteur Comrade', color: '#1e88e5', preview: 'https://via.placeholder.com/400/4444ff' },
    { key: 'news-junket', name: 'State News Album', color: '#fdd835', preview: 'https://via.placeholder.com/400/ffff44' }
  ];

  const albumComponents = {
    'sporty-sports': GalleryAlbumSportySports,
    globetrotter: GalleryAlbumGlobetrotter,
    'auteur-monsieur': GalleryAlbumAuteurMonsieur,
    'news-junket': GalleryAlbumNewsJunket
  };

  const Album = active ? albumComponents[active] : null;

  const handleAlbumOpen = (albumKey) => {
    setActive(albumKey);
    gamificationSystem.interactWithChannel('gallery', `album-${albumKey}`);
    
    // Create transition effect
    if (engine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      engine.createEffect('ornamentBurst', centerX, centerY);
    }
  };

  const handleBackToHome = () => {
    setActive(null);
    
    // Create back transition effect
    if (engine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      engine.createEffect('vineGrowth', centerX, centerY - 50, { segments: 10, length: 100 });
    }
  };

  return (
    <section style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Gallery Particle Canvas */}
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

      {/* Gallery Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {Album ? (
          <div>
            <button
              onClick={handleBackToHome}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #FFD700, #FF1493)'
                  : 'linear-gradient(135deg, #B8860B, #FFD700)',
                border: 'none',
                color: theme === 'dark' ? '#000' : '#FFF',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Cinzel, serif',
                transition: 'all 0.3s ease',
                zIndex: 3,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(255,215,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              ← Back to Gallery
            </button>
            <Album
              source={source}
              theme={theme}
              particleEngine={engine}
            />
          </div>
        ) : (
          <GalleryHome
            albums={albums}
            onOpen={handleAlbumOpen}
            theme={theme}
            particleEngine={engine}
          />
        )}
      </div>
    </section>
  );
}
