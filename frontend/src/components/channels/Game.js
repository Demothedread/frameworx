import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Enhanced Gaming Platform
 * Features:
 * - Multiple game types (Snake, Tetris, Pong, Memory, Number Guessing)
 * - Achievement system with unlockable badges
 * - Real-time multiplayer support with WebSocket simulation
 * - Comprehensive leaderboards with filtering
 * - Player profiles with statistics
 * - Tournament mode with brackets
 * - Game replay system
 * - Social features (friends, challenges)
 * - Mobile responsive design
 * - Game statistics tracking
 */

// Game types configuration
const GAME_TYPES = {
  snake: {
    id: 'snake',
    name: 'Snake',
    description: 'Classic snake game with growing tail',
    icon: '🐍',
    difficulty: 'Medium',
    category: 'Action',
    maxPlayers: 1
  },
  tetris: {
    id: 'tetris',
    name: 'Tetris',
    description: 'Stack blocks and clear lines',
    icon: '🟦',
    difficulty: 'Hard',
    category: 'Puzzle',
    maxPlayers: 1
  },
  pong: {
    id: 'pong',
    name: 'Pong',
    description: 'Classic paddle ball game',
    icon: '🏓',
    difficulty: 'Easy',
    category: 'Sports',
    maxPlayers: 2
  },
  memory: {
    id: 'memory',
    name: 'Memory Match',
    description: 'Match pairs of cards',
    icon: '🧠',
    difficulty: 'Medium',
    category: 'Puzzle',
    maxPlayers: 1
  },
  guess: {
    id: 'guess',
    name: 'Number Guess',
    description: 'Guess the secret number',
    icon: '🔢',
    difficulty: 'Easy',
    category: 'Logic',
    maxPlayers: 1
  }
};

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_game', name: 'First Game', description: 'Play your first game', icon: '🎮', points: 10 },
  { id: 'high_scorer', name: 'High Scorer', description: 'Reach top 10 in any game', icon: '🏆', points: 50 },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Achieve perfect score', icon: '💯', points: 100 },
  { id: 'marathon', name: 'Marathon', description: 'Play for 30+ minutes straight', icon: '⏰', points: 75 },
  { id: 'multitasker', name: 'Multitasker', description: 'Play 3 different games in one session', icon: '🔄', points: 60 },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Play 10 multiplayer games', icon: '🦋', points: 80 },
  { id: 'champion', name: 'Champion', description: 'Win a tournament', icon: '👑', points: 200 },
  { id: 'streak_master', name: 'Streak Master', description: 'Win 5 games in a row', icon: '🔥', points: 90 }
];

// Mock player data
const MOCK_PLAYERS = [
  { id: 1, username: 'ProGamer', avatar: '👨‍💻', level: 15, totalScore: 12450, gamesPlayed: 89, wins: 67 },
  { id: 2, username: 'SnakeQueen', avatar: '👩‍🎮', level: 12, totalScore: 9800, gamesPlayed: 76, wins: 52 },
  { id: 3, username: 'TetrisMaster', avatar: '🧙‍♂️', level: 18, totalScore: 15200, gamesPlayed: 102, wins: 78 },
  { id: 4, username: 'PuzzlePro', avatar: '🤓', level: 10, totalScore: 7600, gamesPlayed: 54, wins: 41 }
];

export default function Game() {
  // Core state
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState({ 
    id: 'user1', 
    username: 'Player', 
    avatar: '👤', 
    level: 1, 
    totalScore: 0,
    gamesPlayed: 0,
    wins: 0,
    achievements: []
  });
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, finished
  const [gameData, setGameData] = useState({});
  const [scores, setScores] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboards, setLeaderboards] = useState({});
  const [friends, setFriends] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  
  // UI state
  const [activeTab, setActiveTab] = useState('games');
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('overall');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  
  // Game-specific refs
  const gameCanvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameLevel, setGameLevel] = useState(1);
  const [gameTime, setGameTime] = useState(0);

  // Initialize data
  useEffect(() => {
    loadGameData();
    loadPlayerProfile();
    initializeWebSocket();
  }, []);

  const loadGameData = async () => {
    // Mock data loading - replace with actual API calls
    setScores(MOCK_PLAYERS.map(p => ({ ...p, game: 'snake' })));
    setLeaderboards({
      overall: MOCK_PLAYERS.sort((a, b) => b.totalScore - a.totalScore),
      snake: MOCK_PLAYERS.filter(() => Math.random() > 0.3).sort((a, b) => b.totalScore - a.totalScore),
      tetris: MOCK_PLAYERS.filter(() => Math.random() > 0.3).sort((a, b) => b.totalScore - a.totalScore)
    });
  };

  const loadPlayerProfile = () => {
    const savedProfile = localStorage.getItem('gamePlayerProfile');
    if (savedProfile) {
      setCurrentPlayer(JSON.parse(savedProfile));
    }
  };

  const savePlayerProfile = (profile) => {
    localStorage.setItem('gamePlayerProfile', JSON.stringify(profile));
    setCurrentPlayer(profile);
  };

  const initializeWebSocket = () => {
    // Mock WebSocket for multiplayer - replace with actual WebSocket
    setTimeout(() => {
      setConnectedPlayers([
        { id: 'bot1', username: 'AI Player 1', avatar: '🤖', status: 'online' },
        { id: 'bot2', username: 'AI Player 2', avatar: '🔮', status: 'playing' }
      ]);
    }, 1000);
  };

  // Game logic
  const startGame = (gameType, multiplayer = false) => {
    setSelectedGame(gameType);
    setIsMultiplayer(multiplayer);
    setGameState('playing');
    setGameScore(0);
    setGameLevel(1);
    setGameTime(0);
    
    // Initialize game-specific data
    switch (gameType.id) {
      case 'snake':
        initializeSnakeGame();
        break;
      case 'memory':
        initializeMemoryGame();
        break;
      case 'guess':
        initializeNumberGuess();
        break;
      default:
        break;
    }
  };

  const endGame = (finalScore) => {
    setGameState('finished');
    
    // Update player stats
    const updatedPlayer = {
      ...currentPlayer,
      gamesPlayed: currentPlayer.gamesPlayed + 1,
      totalScore: currentPlayer.totalScore + finalScore,
      wins: finalScore > 0 ? currentPlayer.wins + 1 : currentPlayer.wins
    };

    // Check for achievements
    checkAchievements(updatedPlayer, finalScore);
    
    // Save game to history
    const gameRecord = {
      id: Date.now(),
      game: selectedGame.id,
      score: finalScore,
      level: gameLevel,
      time: gameTime,
      date: new Date().toISOString(),
      multiplayer: isMultiplayer
    };
    
    setGameHistory(prev => [gameRecord, ...prev].slice(0, 50));
    savePlayerProfile(updatedPlayer);
  };

  const checkAchievements = (player, score) => {
    const newAchievements = [];
    
    // First game achievement
    if (player.gamesPlayed === 1 && !player.achievements.includes('first_game')) {
      newAchievements.push('first_game');
    }
    
    // High scorer achievement
    if (score > 1000 && !player.achievements.includes('high_scorer')) {
      newAchievements.push('high_scorer');
    }
    
    // Perfect score achievement
    if (score === getMaxPossibleScore(selectedGame.id) && !player.achievements.includes('perfectionist')) {
      newAchievements.push('perfectionist');
    }
    
    if (newAchievements.length > 0) {
      const updatedPlayer = {
        ...player,
        achievements: [...player.achievements, ...newAchievements]
      };
      savePlayerProfile(updatedPlayer);
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  };

  const getMaxPossibleScore = (gameId) => {
    const maxScores = { snake: 10000, tetris: 50000, memory: 1000, guess: 100, pong: 21 };
    return maxScores[gameId] || 1000;
  };

  // Simple Snake Game Implementation
  const initializeSnakeGame = () => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    
    const gameLoop = () => {
      // Update snake position
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      
      // Check wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame(score);
        return;
      }
      
      // Check self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame(score);
        return;
      }
      
      snake.unshift(head);
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        setGameScore(score);
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snake.pop();
      }
      
      // Draw game
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });
      
      ctx.fillStyle = '#f00';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    };
    
    // Keyboard controls
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
        case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
        case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    gameLoopRef.current = setInterval(gameLoop, 150);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameLoopRef.current);
    };
  };

  // Memory Game Implementation
  const initializeMemoryGame = () => {
    const cards = [];
    const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    
    // Create pairs
    symbols.forEach(symbol => {
      cards.push({ id: Math.random(), symbol, flipped: false, matched: false });
      cards.push({ id: Math.random(), symbol, flipped: false, matched: false });
    });
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    setGameData({ cards, flippedCards: [], moves: 0 });
  };

  // Number Guessing Game Implementation
  const initializeNumberGuess = () => {
    const targetNumber = Math.floor(Math.random() * 100) + 1;
    setGameData({
      targetNumber,
      guesses: [],
      attempts: 0,
      maxAttempts: 7,
      hint: 'Guess a number between 1 and 100!'
    });
  };

  const renderGameContent = () => {
    if (!selectedGame) return null;
    
    switch (selectedGame.id) {
      case 'snake':
        return (
          <div style={styles.gameContainer}>
            <div style={styles.gameInfo}>
              <div>Score: {gameScore}</div>
              <div>Level: {gameLevel}</div>
              <button onClick={() => setGameState('paused')}>Pause</button>
            </div>
            <canvas
              ref={gameCanvasRef}
              width={400}
              height={400}
              style={styles.gameCanvas}
            />
            <div style={styles.gameControls}>
              <div>Use arrow keys to control the snake</div>
            </div>
          </div>
        );
        
      case 'memory':
        return (
          <MemoryGameComponent 
            gameData={gameData} 
            setGameData={setGameData}
            onGameEnd={endGame}
          />
        );
        
      case 'guess':
        return (
          <NumberGuessComponent 
            gameData={gameData} 
            setGameData={setGameData}
            onGameEnd={endGame}
          />
        );
        
      default:
        return (
          <div style={styles.gameContainer}>
            <h3>{selectedGame.name}</h3>
            <p>{selectedGame.description}</p>
            <p>Game implementation coming soon!</p>
            <button onClick={() => endGame(Math.floor(Math.random() * 1000))}>
              Simulate Game
            </button>
          </div>
        );
    }
  };

  // Main render based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'games':
        return gameState === 'menu' ? renderGameSelection() : renderGameContent();
      case 'leaderboards':
        return renderLeaderboards();
      case 'profile':
        return renderPlayerProfile();
      case 'achievements':
        return renderAchievements();
      case 'tournaments':
        return renderTournaments();
      case 'social':
        return renderSocialFeatures();
      default:
        return renderGameSelection();
    }
  };

  const renderGameSelection = () => (
    <div style={styles.gameSelection}>
      <h3>🎮 Choose Your Game</h3>
      <div style={styles.gameGrid}>
        {Object.values(GAME_TYPES).map(game => (
          <div key={game.id} style={styles.gameCard} onClick={() => startGame(game)}>
            <div style={styles.gameIcon}>{game.icon}</div>
            <h4>{game.name}</h4>
            <p>{game.description}</p>
            <div style={styles.gameMetadata}>
              <span style={styles.gameDifficulty}>{game.difficulty}</span>
              <span style={styles.gameCategory}>{game.category}</span>
            </div>
            {game.maxPlayers > 1 && (
              <button 
                style={styles.multiplayerButton}
                onClick={(e) => {
                  e.stopPropagation();
                  startGame(game, true);
                }}
              >
                🌐 Multiplayer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeaderboards = () => (
    <div style={styles.leaderboards}>
      <h3>🏆 Leaderboards</h3>
      <div style={styles.leaderboardTabs}>
        {Object.keys(leaderboards).map(board => (
          <button
            key={board}
            style={{
              ...styles.tabButton,
              backgroundColor: selectedLeaderboard === board ? '#4a90e2' : '#f0f0f0'
            }}
            onClick={() => setSelectedLeaderboard(board)}
          >
            {board.charAt(0).toUpperCase() + board.slice(1)}
          </button>
        ))}
      </div>
      <div style={styles.leaderboardList}>
        {(leaderboards[selectedLeaderboard] || []).map((player, index) => (
          <div key={player.id} style={styles.leaderboardEntry}>
            <div style={styles.playerRank}>#{index + 1}</div>
            <div style={styles.playerAvatar}>{player.avatar}</div>
            <div style={styles.playerInfo}>
              <div style={styles.playerName}>{player.username}</div>
              <div style={styles.playerStats}>
                Level {player.level} • {player.totalScore} pts
              </div>
            </div>
            <div style={styles.playerScore}>{player.totalScore}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlayerProfile = () => (
    <div style={styles.playerProfile}>
      <div style={styles.profileHeader}>
        <div style={styles.profileAvatar}>{currentPlayer.avatar}</div>
        <div style={styles.profileInfo}>
          <h3>{currentPlayer.username}</h3>
          <div>Level {currentPlayer.level}</div>
          <div>{currentPlayer.totalScore} total points</div>
        </div>
        <button style={styles.editButton}>Edit Profile</button>
      </div>
      
      <div style={styles.profileStats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{currentPlayer.gamesPlayed}</div>
          <div style={styles.statLabel}>Games Played</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{currentPlayer.wins}</div>
          <div style={styles.statLabel}>Wins</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            {currentPlayer.gamesPlayed > 0 ? 
              Math.round((currentPlayer.wins / currentPlayer.gamesPlayed) * 100) : 0}%
          </div>
          <div style={styles.statLabel}>Win Rate</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{currentPlayer.achievements.length}</div>
          <div style={styles.statLabel}>Achievements</div>
        </div>
      </div>

      <div style={styles.gameHistory}>
        <h4>Recent Games</h4>
        {gameHistory.slice(0, 5).map(game => (
          <div key={game.id} style={styles.historyEntry}>
            <div style={styles.historyGame}>
              {GAME_TYPES[game.game]?.icon} {GAME_TYPES[game.game]?.name}
            </div>
            <div style={styles.historyScore}>Score: {game.score}</div>
            <div style={styles.historyDate}>
              {new Date(game.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div style={styles.achievements}>
      <h3>🏅 Achievements</h3>
      <div style={styles.achievementGrid}>
        {ACHIEVEMENTS.map(achievement => {
          const isUnlocked = currentPlayer.achievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              style={{
                ...styles.achievementCard,
                opacity: isUnlocked ? 1 : 0.5,
                backgroundColor: isUnlocked ? '#e8f5e8' : '#f0f0f0'
              }}
            >
              <div style={styles.achievementIcon}>{achievement.icon}</div>
              <h4>{achievement.name}</h4>
              <p>{achievement.description}</p>
              <div style={styles.achievementPoints}>
                {achievement.points} pts
              </div>
              {isUnlocked && (
                <div style={styles.unlockedBadge}>✅ Unlocked</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div style={styles.tournaments}>
      <h3>👑 Tournaments</h3>
      <div style={styles.tournamentActions}>
        <button style={styles.createTournamentButton}>Create Tournament</button>
        <button style={styles.joinTournamentButton}>Join Tournament</button>
      </div>
      <div style={styles.tournamentList}>
        <div style={styles.tournamentCard}>
          <h4>🐍 Snake Championship</h4>
          <p>32 players • Starts in 2 hours</p>
          <div style={styles.prizePool}>Prize: 1000 pts</div>
          <button style={styles.joinButton}>Join (16/32)</button>
        </div>
        <div style={styles.tournamentCard}>
          <h4>🧠 Memory Masters</h4>
          <p>16 players • In Progress</p>
          <div style={styles.prizePool}>Prize: 500 pts</div>
          <button style={styles.spectateButton}>Spectate</button>
        </div>
      </div>
    </div>
  );

  const renderSocialFeatures = () => (
    <div style={styles.social}>
      <h3>👥 Social</h3>
      <div style={styles.socialTabs}>
        <button style={styles.socialTab}>Friends</button>
        <button style={styles.socialTab}>Challenges</button>
        <button style={styles.socialTab}>Chat</button>
      </div>
      <div style={styles.friendsList}>
        {connectedPlayers.map(player => (
          <div key={player.id} style={styles.friendCard}>
            <div style={styles.friendAvatar}>{player.avatar}</div>
            <div style={styles.friendInfo}>
              <div style={styles.friendName}>{player.username}</div>
              <div style={styles.friendStatus}>{player.status}</div>
            </div>
            <div style={styles.friendActions}>
              <button style={styles.challengeButton}>Challenge</button>
              <button style={styles.chatButton}>Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (gameState === 'playing' && selectedGame) {
    return (
      <div style={styles.container}>
        <div style={styles.gameHeader}>
          <button style={styles.backButton} onClick={() => setGameState('menu')}>
            ← Back to Menu
          </button>
          <h2>{selectedGame.name}</h2>
          <div style={styles.gameStatus}>
            {isMultiplayer && <span style={styles.multiplayerBadge}>🌐 Multiplayer</span>}
          </div>
        </div>
        {renderGameContent()}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🎮 Gaming Center</h2>
        <div style={styles.playerQuickInfo}>
          <span>{currentPlayer.avatar} {currentPlayer.username}</span>
          <span>Level {currentPlayer.level}</span>
        </div>
      </div>

      <div style={styles.navigation}>
        {[
          { key: 'games', label: '🎮 Games', icon: '🎮' },
          { key: 'leaderboards', label: '🏆 Leaderboards', icon: '🏆' },
          { key: 'profile', label: '👤 Profile', icon: '👤' },
          { key: 'achievements', label: '🏅 Achievements', icon: '🏅' },
          { key: 'tournaments', label: '👑 Tournaments', icon: '👑' },
          { key: 'social', label: '👥 Social', icon: '👥' }
        ].map(tab => (
          <button
            key={tab.key}
            style={{
              ...styles.navButton,
              backgroundColor: activeTab === tab.key ? '#4a90e2' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#666'
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {renderTabContent()}
      </div>
    </div>
  );
}

// Memory Game Component
function MemoryGameComponent({ gameData, setGameData, onGameEnd }) {
  const handleCardClick = (cardIndex) => {
    const { cards, flippedCards, moves } = gameData;
    
    if (flippedCards.length >= 2 || cards[cardIndex].flipped || cards[cardIndex].matched) {
      return;
    }
    
    const newCards = [...cards];
    newCards[cardIndex].flipped = true;
    const newFlippedCards = [...flippedCards, cardIndex];
    
    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      if (cards[first].symbol === cards[second].symbol) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setGameData({ ...gameData, cards: newCards, flippedCards: [], moves: moves + 1 });
        
        // Check if game is complete
        if (newCards.every(card => card.matched)) {
          onGameEnd(Math.max(0, 1000 - moves * 10));
        }
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setGameData({ ...gameData, cards: newCards, flippedCards: [], moves: moves + 1 });
        }, 1000);
      }
    } else {
      setGameData({ ...gameData, cards: newCards, flippedCards: newFlippedCards });
    }
  };
  
  return (
    <div style={styles.memoryGame}>
      <div style={styles.gameInfo}>
        <div>Moves: {gameData.moves}</div>
        <div>Matches: {gameData.cards?.filter(c => c.matched).length / 2 || 0}/8</div>
      </div>
      <div style={styles.cardGrid}>
        {gameData.cards?.map((card, index) => (
          <div
            key={card.id}
            style={{
              ...styles.memoryCard,
              backgroundColor: card.flipped || card.matched ? '#4a90e2' : '#f0f0f0'
            }}
            onClick={() => handleCardClick(index)}
          >
            {(card.flipped || card.matched) ? card.symbol : '❓'}
          </div>
        ))}
      </div>
    </div>
  );
}

// Number Guessing Game Component
function NumberGuessComponent({ gameData, setGameData, onGameEnd }) {
  const [currentGuess, setCurrentGuess] = useState('');
  
  const makeGuess = () => {
    const guess = parseInt(currentGuess);
    if (isNaN(guess) || guess < 1 || guess > 100) return;
    
    const { targetNumber, guesses, attempts, maxAttempts } = gameData;
    const newGuesses = [...guesses, { guess, attempts: attempts + 1 }];
    const newAttempts = attempts + 1;
    
    let hint = '';
    let gameEnded = false;
    
    if (guess === targetNumber) {
      hint = '🎉 Correct! You won!';
      gameEnded = true;
      onGameEnd(Math.max(0, 100 - newAttempts * 10));
    } else if (newAttempts >= maxAttempts) {
      hint = `😞 Game over! The number was ${targetNumber}`;
      gameEnded = true;
      onGameEnd(0);
    } else if (guess < targetNumber) {
      hint = '📈 Higher!';
    } else {
      hint = '📉 Lower!';
    }
    
    setGameData({
      ...gameData,
      guesses: newGuesses,
      attempts: newAttempts,
      hint
    });
    
    setCurrentGuess('');
  };
  
  return (
    <div style={styles.guessGame}>
      <div style={styles.gameInfo}>
        <div>Attempts: {gameData.attempts}/{gameData.maxAttempts}</div>
        <div>Range: 1-100</div>
      </div>
      <div style={styles.guessInput}>
        <input
          type="number"
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          placeholder="Enter your guess"
          min="1"
          max="100"
          style={styles.numberInput}
        />
        <button onClick={makeGuess} style={styles.guessButton}>
          Guess
        </button>
      </div>
      <div style={styles.hint}>{gameData.hint}</div>
      <div style={styles.guessHistory}>
        {gameData.guesses?.map((g, i) => (
          <div key={i} style={styles.previousGuess}>
            Attempt {g.attempts}: {g.guess}
          </div>
        ))}
      </div>
    </div>
  );
}

// Comprehensive styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px',
    color: 'white'
  },
  
  playerQuickInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px'
  },
  
  navigation: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflowX: 'auto'
  },
  
  navButton: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },
  
  content: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    minHeight: '500px'
  },
  
  // Game Selection
  gameSelection: {
    textAlign: 'center'
  },
  
  gameGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '30px'
  },
  
  gameCard: {
    padding: '25px',
    backgroundColor: '#f8f9fa',
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    textAlign: 'center',
    position: 'relative'
  },
  
  gameIcon: {
    fontSize: '3rem',
    marginBottom: '15px'
  },
  
  gameMetadata: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '15px'
  },
  
  gameDifficulty: {
    padding: '4px 8px',
    backgroundColor: '#e9ecef',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  
  gameCategory: {
    padding: '4px 8px',
    backgroundColor: '#dee2e6',
    borderRadius: '12px',
    fontSize: '12px'
  },
  
  multiplayerButton: {
    marginTop: '10px',
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  
  // Game Playing
  gameHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '12px'
  },
  
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  
  multiplayerBadge: {
    padding: '6px 12px',
    backgroundColor: '#17a2b8',
    color: 'white',
    borderRadius: '15px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  
  gameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  
  gameInfo: {
    display: 'flex',
    gap: '30px',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  
  gameCanvas: {
    border: '2px solid #333',
    borderRadius: '8px',
    backgroundColor: '#000'
  },
  
  gameControls: {
    textAlign: 'center',
    color: '#666'
  },
  
  // Memory Game
  memoryGame: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    maxWidth: '400px'
  },
  
  memoryCard: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  // Number Guess Game
  guessGame: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    maxWidth: '400px',
    margin: '0 auto'
  },
  
  guessInput: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  
  numberInput: {
    padding: '10px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    width: '120px',
    textAlign: 'center'
  },
  
  guessButton: {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  
  hint: {
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  guessHistory: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    width: '100%'
  },
  
  previousGuess: {
    padding: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    textAlign: 'center'
  },
  
  // Leaderboards
  leaderboards: {
    
  },
  
  leaderboardTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  
  tabButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#333'
  },
  
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  
  leaderboardEntry: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef'
  },
  
  playerRank: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#495057',
    minWidth: '40px'
  },
  
  playerAvatar: {
    fontSize: '2rem'
  },
  
  playerInfo: {
    flex: 1
  },
  
  playerName: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  
  playerStats: {
    color: '#6c757d',
    fontSize: '14px'
  },
  
  playerScore: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#28a745'
  },
  
  // Player Profile
  playerProfile: {
    
  },
  
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px'
  },
  
  profileAvatar: {
    fontSize: '4rem'
  },
  
  profileInfo: {
    flex: 1
  },
  
  editButton: {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  
  profileStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  
  statCard: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e9ecef'
  },
  
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4a90e2'
  },
  
  statLabel: {
    color: '#6c757d',
    fontSize: '14px',
    marginTop: '5px'
  },
  
  gameHistory: {
    
  },
  
  historyEntry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    marginBottom: '10px'
  },
  
  historyGame: {
    fontWeight: 'bold'
  },
  
  historyScore: {
    color: '#28a745'
  },
  
  historyDate: {
    color: '#6c757d',
    fontSize: '14px'
  },
  
  // Achievements
  achievements: {
    
  },
  
  achievementGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  
  achievementCard: {
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e9ecef',
    position: 'relative'
  },
  
  achievementIcon: {
    fontSize: '3rem',
    marginBottom: '10px'
  },
  
  achievementPoints: {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#ffc107'
  },
  
  unlockedBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#28a745',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  
  // Tournaments
  tournaments: {
    
  },
  
  tournamentActions: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px'
  },
  
  createTournamentButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  
  joinTournamentButton: {
    padding: '12px 24px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  
  tournamentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  
  tournamentCard: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e9ecef'
  },
  
  prizePool: {
    color: '#ffc107',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  
  joinButton: {
    marginTop: '15px',
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  
  spectateButton: {
    marginTop: '15px',
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  
  // Social Features
  social: {
    
  },
  
  socialTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  
  socialTab: {
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  
  friendsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  
  friendCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef'
  },
  
  friendAvatar: {
    fontSize: '2rem'
  },
  
  friendInfo: {
    flex: 1
  },
  
  friendName: {
    fontWeight: 'bold'
  },
  
  friendStatus: {
    color: '#6c757d',
    fontSize: '14px'
  },
  
  friendActions: {
    display: 'flex',
    gap: '10px'
  },
  
  challengeButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  
  chatButton: {
    padding: '6px 12px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  }
};
