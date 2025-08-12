import React, { useState, useEffect } from 'react';
import { getGamificationSystem } from '../../utils/GamificationSystem';

/**
 * Belle Époque-Futurism Gamification HUD
 * 
 * An elegant heads-up display that combines vintage salon aesthetics
 * with cyberpunk interface elements, featuring:
 * - XP progression with ornate bars
 * - Achievement notifications
 * - Currency displays (Salon Credits & Data Points)
 * - Level indicator with vintage styling
 * - Holographic overlays and particle effects
 */

export default function GamificationHUD({ theme, onFortuneWheelOpen }) {
  const [gameData, setGameData] = useState(null);
  const [showNotification, setShowNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const gamificationSystem = getGamificationSystem();

  useEffect(() => {
    // Load initial data
    setGameData(gamificationSystem.getStatistics());

    // Listen for updates
    const handleUpdate = (data) => {
      setGameData({
        ...gamificationSystem.getStatistics(),
        currency: gamificationSystem.getCurrency(),
        xp: gamificationSystem.getXP()
      });
    };

    gamificationSystem.addListener(handleUpdate);
    
    // Initial load
    handleUpdate();

    return () => {
      gamificationSystem.removeListener(handleUpdate);
    };
  }, []);

  useEffect(() => {
    // Check for new achievements
    const achievements = gamificationSystem.getAchievements();
    const recentAchievement = achievements.find(a => 
      a.unlocked && a.unlockedAt && (Date.now() - a.unlockedAt) < 5000
    );

    if (recentAchievement && showNotification?.id !== recentAchievement.id) {
      setShowNotification(recentAchievement);
      setTimeout(() => setShowNotification(null), 5000);
    }
  }, [gameData]);

  if (!gameData) return null;

  const { level, currency, xp, streak } = gameData;

  return (
    <div className={`gamification-hud ${theme}`} style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      fontFamily: 'Cinzel, serif',
      transition: 'all 0.3s ease',
      opacity: isVisible ? 1 : 0.3,
      transform: isVisible ? 'translateX(0)' : 'translateX(-50%)'
    }}>
      {/* Toggle Visibility Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'absolute',
          right: '-40px',
          top: '10px',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(45deg, #FFD700, #FF1493)',
          color: '#000',
          cursor: 'pointer',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isVisible ? '◀' : '▶'}
      </button>

      {/* Main HUD Container */}
      <div style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(20,20,40,0.95))'
          : 'linear-gradient(135deg, rgba(245,245,220,0.95), rgba(255,248,220,0.9))',
        border: theme === 'dark'
          ? '2px solid #00FFFF'
          : '2px solid #B8860B',
        borderRadius: '15px',
        padding: '15px',
        minWidth: '280px',
        boxShadow: theme === 'dark'
          ? '0 0 20px rgba(0,255,255,0.3), inset 0 0 20px rgba(255,215,0,0.1)'
          : '0 0 15px rgba(184,134,11,0.4), inset 0 0 15px rgba(255,215,0,0.2)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Decorative Corner Elements */}
        <div style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          width: '20px',
          height: '20px',
          border: `2px solid ${theme === 'dark' ? '#FFD700' : '#8B4513'}`,
          borderRight: 'none',
          borderBottom: 'none',
          borderRadius: '0 0 0 5px'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          width: '20px',
          height: '20px',
          border: `2px solid ${theme === 'dark' ? '#FFD700' : '#8B4513'}`,
          borderLeft: 'none',
          borderTop: 'none',
          borderRadius: '5px 0 0 0'
        }} />

        {/* Level and Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '15px',
          borderBottom: `1px solid ${theme === 'dark' ? '#00FFFF' : '#B8860B'}`,
          paddingBottom: '10px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            background: theme === 'dark'
              ? 'linear-gradient(45deg, #FFD700, #00FFFF)'
              : 'linear-gradient(45deg, #8B4513, #FFD700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '5px'
          }}>
            Niveau {level}
          </div>
          <div style={{
            fontSize: '12px',
            color: theme === 'dark' ? '#00FFFF' : '#8B4513',
            fontStyle: 'italic'
          }}>
            {theme === 'dark' ? 'Digital Aristocrat' : 'Salon Habitué'}
          </div>
        </div>

        {/* XP Progress Bar */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: theme === 'dark' ? '#CCCCCC' : '#666666',
            marginBottom: '5px'
          }}>
            <span>Expérience</span>
            <span>{xp?.toNextLevel || 0} to next level</span>
          </div>
          <div style={{
            width: '100%',
            height: '12px',
            background: theme === 'dark' ? '#333' : '#DDD',
            borderRadius: '6px',
            overflow: 'hidden',
            border: `1px solid ${theme === 'dark' ? '#555' : '#BBB'}`
          }}>
            <div style={{
              width: `${(xp?.percentage || 0) * 100}%`,
              height: '100%',
              background: theme === 'dark'
                ? 'linear-gradient(90deg, #FFD700, #00FFFF, #FF1493)'
                : 'linear-gradient(90deg, #B8860B, #FFD700, #DEB887)',
              transition: 'width 0.5s ease',
              position: 'relative'
            }}>
              {/* Animated shine effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shine 2s infinite'
              }} />
            </div>
          </div>
        </div>

        {/* Currency Display */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '15px'
        }}>
          <div style={{
            background: theme === 'dark' 
              ? 'rgba(255,215,0,0.1)' 
              : 'rgba(184,134,11,0.1)',
            padding: '8px',
            borderRadius: '8px',
            border: `1px solid ${theme === 'dark' ? '#FFD700' : '#B8860B'}`,
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '10px',
              color: theme === 'dark' ? '#FFD700' : '#8B4513',
              marginBottom: '2px'
            }}>
              Salon Credits
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#FFD700' : '#B8860B'
            }}>
              {currency?.salonCredits || 0}
            </div>
          </div>
          <div style={{
            background: theme === 'dark' 
              ? 'rgba(0,255,255,0.1)' 
              : 'rgba(30,144,255,0.1)',
            padding: '8px',
            borderRadius: '8px',
            border: `1px solid ${theme === 'dark' ? '#00FFFF' : '#1E90FF'}`,
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '10px',
              color: theme === 'dark' ? '#00FFFF' : '#1E90FF',
              marginBottom: '2px'
            }}>
              Data Points
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#00FFFF' : '#1E90FF'
            }}>
              {currency?.dataPoints || 0}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          fontSize: '10px',
          color: theme === 'dark' ? '#CCCCCC' : '#666666'
        }}>
          <div>Streak: {streak?.current || 0} days</div>
          <div>Channels: {gameData.channelsVisited?.length || 0}</div>
        </div>

        {/* Fortune Wheel Button */}
        <button
          onClick={onFortuneWheelOpen}
          style={{
            width: '100%',
            marginTop: '15px',
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            background: theme === 'dark'
              ? 'linear-gradient(135deg, #8A2BE2, #FF1493)'
              : 'linear-gradient(135deg, #DDA0DD, #FF69B4)',
            color: '#FFF',
            fontFamily: 'Cinzel, serif',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 5px 15px rgba(138,43,226,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          🔮 Consult Fortune Wheel
        </button>
      </div>

      {/* Achievement Notification */}
      {showNotification && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          right: '0',
          marginTop: '10px',
          background: 'linear-gradient(135deg, #FFD700, #FF1493)',
          color: '#000',
          padding: '15px',
          borderRadius: '10px',
          boxShadow: '0 5px 20px rgba(255,215,0,0.5)',
          animation: 'slideInUp 0.5s ease-out',
          zIndex: 1001
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '5px'
          }}>
            🎉 Achievement Unlocked!
          </div>
          <div style={{
            fontSize: '16px',
            marginBottom: '3px'
          }}>
            {showNotification.icon} {showNotification.name}
          </div>
          <div style={{
            fontSize: '11px',
            opacity: 0.8
          }}>
            {showNotification.description}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .gamification-hud {
          animation: fadeInLeft 0.5s ease-out;
        }
        
        @keyframes fadeInLeft {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}