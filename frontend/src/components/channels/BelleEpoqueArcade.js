import React, { useState, useEffect, useRef } from 'react';
import { getGamificationSystem } from '../../utils/GamificationSystem';

/**
 * Belle Époque Retro-Futuristic Arcade
 * 
 * Transforms the gaming experience into a Victorian carnival meets cyberpunk arcade:
 * - Vintage slot machine-style game selection with ornate brass details
 * - Holographic leaderboards with neon particle effects  
 * - Belle Époque carnival booth aesthetics with futuristic overlays
 * - Golden filigree frames transitioning to digital wireframes
 * - Immersive particle effects for wins, achievements, and interactions
 */

export default function BelleEpoqueArcade({ theme = 'light', particleEngine }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [arcadeMode, setArcadeMode] = useState('carnival'); // 'carnival' | 'cyber-arcade'
  const [activeSlot, setActiveSlot] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [leaderboardMode, setLeaderboardMode] = useState('holographic');
  const [gameScores, setGameScores] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState({ name: 'Aristocrat', level: 1, score: 0 });
  const gamificationSystem = getGamificationSystem();
  const slotMachineRef = useRef(null);

  // Belle Époque carnival games with futuristic overlays
  const carnivalGames = [
    {
      id: 'mechanical-fortune',
      name: 'Mechanical Fortune Teller',
      icon: '🔮',
      description: 'Divine your luck with the mystical automaton',
      belleEpoqueStyle: 'Brass and crystal fortune machine',
      cyberStyle: 'Quantum probability calculator',
      difficulty: 'Mystical',
      maxScore: 1000,
      hologramColor: '#FFD700'
    },
    {
      id: 'aristocrat-puzzle',
      name: 'Aristocrat\'s Logic Engine',
      icon: '🧩',
      description: 'Solve intricate puzzles worthy of nobility',
      belleEpoqueStyle: 'Mahogany puzzle box with gold inlays',
      cyberStyle: 'Neural network puzzle matrix',
      difficulty: 'Sophisticated',
      maxScore: 2500,
      hologramColor: '#8A2BE2'
    },
    {
      id: 'steam-racer',
      name: 'Steam Velocipede Racing',
      icon: '🚲',
      description: 'Race through gaslit streets on mechanical steeds',
      belleEpoqueStyle: 'Ornate penny-farthing simulator',
      cyberStyle: 'Hover-bike neural interface',
      difficulty: 'Thrilling',
      maxScore: 5000,
      hologramColor: '#00FFFF'
    },
    {
      id: 'parlor-memory',
      name: 'Salon Memory Cards',
      icon: '🎭',
      description: 'Match elegant portraits in refined memory game',
      belleEpoqueStyle: 'Hand-painted portrait cards',
      cyberStyle: 'Digital consciousness fragments',
      difficulty: 'Refined',
      maxScore: 1800,
      hologramColor: '#FF1493'
    },
    {
      id: 'clockwork-dexterity',
      name: 'Clockwork Dexterity Test',
      icon: '⚙️',
      description: 'Master the intricate mechanical timing challenge',
      belleEpoqueStyle: 'Precision Swiss clockwork mechanism',
      cyberStyle: 'Temporal manipulation interface',
      difficulty: 'Precise',
      maxScore: 3200,
      hologramColor: '#32CD32'
    },
    {
      id: 'elegant-aim',
      name: 'Elegant Marksmanship',
      icon: '🎯',
      description: 'Demonstrate refined shooting skills',
      belleEpoqueStyle: 'Ivory-handled shooting gallery',
      cyberStyle: 'Laser targeting matrix',
      difficulty: 'Distinguished',
      maxScore: 4000,
      hologramColor: '#FF4500'
    }
  ];

  useEffect(() => {
    gamificationSystem.interactWithChannel('game', 'arcade-enter');
  }, []);

  // Slot machine animation for game selection
  const spinSlotMachine = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    gamificationSystem.interactWithChannel('game', 'slot-machine-spin');
    
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      particleEngine.createEffect('clockwork', centerX, centerY);
    }

    let spinCount = 0;
    const maxSpins = 20;
    const spinInterval = setInterval(() => {
      setActiveSlot(prev => (prev + 1) % carnivalGames.length);
      spinCount++;
      
      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        
        // Create win particle effect
        if (particleEngine) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          particleEngine.createEffect('ornamentBurst', centerX, centerY);
        }
      }
    }, 100);
  };

  const selectGame = (gameIndex) => {
    const game = carnivalGames[gameIndex];
    setSelectedGame(game);
    gamificationSystem.interactWithChannel('game', `game-${game.id}`);
    
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      particleEngine.createEffect('holographicPulse', centerX, centerY, { count: 15 });
    }
  };

  const toggleArcadeMode = () => {
    const newMode = arcadeMode === 'carnival' ? 'cyber-arcade' : 'carnival';
    setArcadeMode(newMode);
    
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      if (newMode === 'cyber-arcade') {
        particleEngine.createEffect('matrixRain', centerX, centerY);
      } else {
        particleEngine.createEffect('vineGrowth', centerX, centerY, { segments: 15 });
      }
    }
  };

  const playGame = (game) => {
    // Simulate game play with scoring
    const baseScore = Math.floor(Math.random() * game.maxScore);
    const finalScore = Math.max(100, baseScore);
    
    setGameScores(prev => ({
      ...prev,
      [game.id]: [...(prev[game.id] || []), { score: finalScore, date: new Date(), player: currentPlayer.name }]
    }));

    // Award gamification points
    gamificationSystem.awardXP(finalScore / 100, finalScore / 200, `Played ${game.name}`);
    
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      if (finalScore > game.maxScore * 0.8) {
        // High score celebration
        particleEngine.createEffect('holographicPulse', centerX, centerY, { count: 30 });
      } else {
        // Standard completion effect
        particleEngine.createEffect('ornamentBurst', centerX, centerY);
      }
    }
  };

  if (selectedGame) {
    return (
      <GamePlayInterface 
        game={selectedGame} 
        onBack={() => setSelectedGame(null)}
        onPlay={() => playGame(selectedGame)}
        theme={theme}
        arcadeMode={arcadeMode}
        particleEngine={particleEngine}
      />
    );
  }

  return (
    <div style={{
      background: arcadeMode === 'carnival'
        ? (theme === 'dark' 
          ? 'radial-gradient(circle at center, #3a2415, #2a1a0a, #1a0f05)'
          : 'radial-gradient(circle at center, #f5f0e8, #e8ddd0, #d4c4a8)')
        : (theme === 'dark'
          ? 'radial-gradient(circle at center, #1a1a3a, #0a0a2a, #05051a)'
          : 'radial-gradient(circle at center, #e8e8ff, #d0d0f0, #b8b8e0)'),
      minHeight: '100vh',
      fontFamily: 'Cinzel, serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Arcade Header */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <h1 style={{
          fontSize: '3rem',
          background: arcadeMode === 'carnival'
            ? 'linear-gradient(45deg, #FFD700, #B8860B, #CD853F)'
            : 'linear-gradient(45deg, #00FFFF, #FF1493, #8A2BE2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '2px 4px 8px rgba(0,0,0,0.3)',
          marginBottom: '1rem',
          letterSpacing: '2px'
        }}>
          {arcadeMode === 'carnival' 
            ? '🎪 Le Grand Salon de Jeux 🎪'
            : '🎮 Cyber-Arcade Matrix 🎮'
          }
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: theme === 'dark' ? '#CCCCCC' : '#666666',
          fontStyle: 'italic',
          marginBottom: '2rem'
        }}>
          {arcadeMode === 'carnival'
            ? 'Une collection raffinée de divertissements aristocratiques'
            : 'An advanced neural gaming interface for digital entertainment'
          }
        </p>

        <button
          onClick={toggleArcadeMode}
          style={{
            background: arcadeMode === 'carnival'
              ? 'linear-gradient(135deg, #8A2BE2, #FF1493)'
              : 'linear-gradient(135deg, #B8860B, #FFD700)',
            border: 'none',
            color: '#FFF',
            padding: '15px 30px',
            borderRadius: '30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
            fontFamily: 'Cinzel, serif'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05) translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1) translateY(0)';
          }}
        >
          {arcadeMode === 'carnival' 
            ? '🚀 Enter Cyber-Arcade'
            : '🎭 Return to Carnival'
          }
        </button>
      </div>

      {/* Slot Machine Game Selection */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <div
          ref={slotMachineRef}
          style={{
            background: arcadeMode === 'carnival'
              ? 'linear-gradient(135deg, #8B4513, #CD853F, #D4A574)'
              : 'linear-gradient(135deg, #2a2a4a, #3a3a5a, #4a4a6a)',
            border: arcadeMode === 'carnival'
              ? '5px solid #FFD700'
              : '5px solid #00FFFF',
            borderRadius: '20px',
            padding: '30px',
            position: 'relative',
            boxShadow: arcadeMode === 'carnival'
              ? '0 0 40px rgba(255,215,0,0.4), inset 0 0 40px rgba(255,215,0,0.1)'
              : '0 0 40px rgba(0,255,255,0.4), inset 0 0 40px rgba(0,255,255,0.1)',
            minWidth: '500px'
          }}
        >
          
          {/* Ornate Decorations */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2rem'
          }}>
            {arcadeMode === 'carnival' ? '👑' : '🔮'}
          </div>

          {/* Game Display Window */}
          <div style={{
            background: '#000',
            border: arcadeMode === 'carnival'
              ? '3px solid #B8860B'
              : '3px solid #FF1493',
            borderRadius: '15px',
            padding: '30px',
            margin: '20px 0',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            
            {/* Game Display */}
            <div style={{
              background: carnivalGames[activeSlot].hologramColor + '20',
              border: `2px solid ${carnivalGames[activeSlot].hologramColor}`,
              borderRadius: '10px',
              padding: '20px',
              transition: isSpinning ? 'none' : 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '10px',
                filter: `drop-shadow(0 0 10px ${carnivalGames[activeSlot].hologramColor})`
              }}>
                {carnivalGames[activeSlot].icon}
              </div>
              
              <h3 style={{
                color: carnivalGames[activeSlot].hologramColor,
                fontSize: '1.5rem',
                marginBottom: '10px',
                textShadow: `0 0 10px ${carnivalGames[activeSlot].hologramColor}`
              }}>
                {carnivalGames[activeSlot].name}
              </h3>
              
              <p style={{
                color: '#FFFFFF',
                fontSize: '14px',
                fontStyle: 'italic',
                marginBottom: '10px'
              }}>
                {arcadeMode === 'carnival' 
                  ? carnivalGames[activeSlot].belleEpoqueStyle
                  : carnivalGames[activeSlot].cyberStyle
                }
              </p>
              
              <div style={{
                background: carnivalGames[activeSlot].hologramColor,
                color: '#000',
                padding: '5px 15px',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-block'
              }}>
                {carnivalGames[activeSlot].difficulty}
              </div>
            </div>

            {/* Holographic Scan Lines */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 3px)',
              pointerEvents: 'none',
              opacity: arcadeMode === 'cyber-arcade' ? 0.5 : 0
            }} />
          </div>

          {/* Control Panel */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px'
          }}>
            
            {/* Spin Button */}
            <button
              onClick={spinSlotMachine}
              disabled={isSpinning}
              style={{
                background: isSpinning
                  ? 'linear-gradient(135deg, #666, #999)'
                  : arcadeMode === 'carnival'
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                    : 'linear-gradient(135deg, #FF1493, #8A2BE2)',
                border: 'none',
                color: isSpinning ? '#CCC' : '#000',
                padding: '15px 25px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Cinzel, serif',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              {isSpinning ? '🎰 Spinning...' : '🎰 Spin to Choose'}
            </button>

            {/* Select Button */}
            <button
              onClick={() => selectGame(activeSlot)}
              style={{
                background: arcadeMode === 'carnival'
                  ? 'linear-gradient(135deg, #32CD32, #228B22)'
                  : 'linear-gradient(135deg, #00FFFF, #0080FF)',
                border: 'none',
                color: '#FFF',
                padding: '15px 25px',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Cinzel, serif',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              🎮 Play Game
            </button>
          </div>

          {/* Vintage Mechanical Details */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.5rem',
            opacity: 0.6
          }}>
            <span>{arcadeMode === 'carnival' ? '⚙️' : '🔬'}</span>
            <span>{arcadeMode === 'carnival' ? '🔧' : '💾'}</span>
            <span>{arcadeMode === 'carnival' ? '⚙️' : '🔬'}</span>
          </div>
        </div>
      </div>

      {/* Holographic Leaderboards */}
      <HolographicLeaderboard 
        gameScores={gameScores}
        theme={theme}
        arcadeMode={arcadeMode}
        particleEngine={particleEngine}
      />

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '12px',
        textAlign: 'right',
        fontFamily: 'monospace'
      }}>
        <div>Spin the slot machine to browse games</div>
        <div>Select and play for aristocratic entertainment</div>
        <div>Toggle between carnival and cyber modes</div>
      </div>
    </div>
  );
}

// Game Play Interface Component
function GamePlayInterface({ game, onBack, onPlay, theme, arcadeMode, particleEngine }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  const startGame = () => {
    setIsPlaying(true);
    
    // Simulate game play
    setTimeout(() => {
      const score = Math.floor(Math.random() * game.maxScore);
      setGameScore(score);
      setIsPlaying(false);
      onPlay();
      
      if (particleEngine) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        if (score > game.maxScore * 0.8) {
          particleEngine.createEffect('holographicPulse', centerX, centerY, { count: 25 });
        }
      }
    }, 3000);
  };

  return (
    <div style={{
      background: arcadeMode === 'carnival'
        ? 'linear-gradient(135deg, #8B4513, #CD853F)'
        : 'linear-gradient(135deg, #1a1a3a, #2a2a4a)',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'Cinzel, serif',
      color: '#FFF'
    }}>
      
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: '2px solid #FFD700',
          color: '#FFD700',
          padding: '10px 20px',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '2rem',
          fontFamily: 'Cinzel, serif'
        }}
      >
        ← Back to Arcade
      </button>

      {/* Game Interface */}
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          filter: `drop-shadow(0 0 20px ${game.hologramColor})`
        }}>
          {game.icon}
        </div>
        
        <h2 style={{
          fontSize: '2.5rem',
          background: `linear-gradient(45deg, ${game.hologramColor}, #FFD700)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>
          {game.name}
        </h2>
        
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          {game.description}
        </p>

        {!isPlaying && gameScore === 0 && (
          <button
            onClick={startGame}
            style={{
              background: `linear-gradient(135deg, ${game.hologramColor}, #FFD700)`,
              border: 'none',
              color: '#000',
              padding: '20px 40px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
              boxShadow: '0 5px 25px rgba(0,0,0,0.3)'
            }}
          >
            🎮 Start Game
          </button>
        )}

        {isPlaying && (
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '40px',
            borderRadius: '20px',
            border: `2px solid ${game.hologramColor}`
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem'
            }}>
              🎮 Playing...
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              background: '#333',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, ${game.hologramColor}, #FFD700)`,
                animation: 'progress 3s linear'
              }} />
            </div>
          </div>
        )}

        {gameScore > 0 && (
          <div style={{
            background: `linear-gradient(135deg, ${game.hologramColor}20, #FFD70020)`,
            border: `2px solid ${game.hologramColor}`,
            borderRadius: '20px',
            padding: '30px',
            marginTop: '2rem'
          }}>
            <h3 style={{
              fontSize: '2rem',
              color: game.hologramColor,
              marginBottom: '1rem'
            }}>
              🏆 Final Score: {gameScore}
            </h3>
            
            <button
              onClick={() => {
                setGameScore(0);
                startGame();
              }}
              style={{
                background: `linear-gradient(135deg, ${game.hologramColor}, #FFD700)`,
                border: 'none',
                color: '#000',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Cinzel, serif',
                marginRight: '10px'
              }}
            >
              🔄 Play Again
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

// Holographic Leaderboard Component
function HolographicLeaderboard({ gameScores, theme, arcadeMode, particleEngine }) {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('overall');

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem'
    }}>
      <h3 style={{
        textAlign: 'center',
        fontSize: '2rem',
        background: arcadeMode === 'carnival'
          ? 'linear-gradient(45deg, #FFD700, #B8860B)'
          : 'linear-gradient(45deg, #00FFFF, #FF1493)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '2rem'
      }}>
        {arcadeMode === 'carnival' ? '🏆 Hall of Fame 🏆' : '📊 Digital Leaderboards 📊'}
      </h3>

      {/* Leaderboard Display */}
      <div style={{
        background: arcadeMode === 'carnival'
          ? 'linear-gradient(135deg, rgba(139,69,19,0.8), rgba(205,133,63,0.8))'
          : 'linear-gradient(135deg, rgba(26,26,58,0.8), rgba(42,42,74,0.8))',
        border: arcadeMode === 'carnival'
          ? '2px solid #FFD700'
          : '2px solid #00FFFF',
        borderRadius: '15px',
        padding: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          color: theme === 'dark' ? '#FFF' : '#333',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          {Object.keys(gameScores).length === 0 
            ? 'No scores recorded yet - start playing to see your achievements!'
            : 'Your gaming accomplishments will appear here...'
          }
        </div>
      </div>
    </div>
  );
}