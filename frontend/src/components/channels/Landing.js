import React, { useState, useEffect, useRef } from 'react';

/**
 * TV Guide Style Landing Page
 * Features:
 * - Top 1/4: "Now Playing" section with rotating content
 * - Bottom 3/4: Scrollable channel directory with semi-transparent glowing boxes
 * - Auto-scroll with hover controls
 * - Integrated sports feeds between channels
 * - Modern TV Guide aesthetic
 */

// Channel data with enhanced metadata
const CHANNELS = [
  { 
    key: 'landing', 
    name: 'Home', 
    description: 'Welcome to Channel Rolodex',
    category: 'navigation',
    color: '#4a90e2',
    icon: '🏠'
  },
  { 
    key: 'gallery', 
    name: 'Image Gallery', 
    description: 'Photo collections and visual content',
    category: 'media',
    color: '#7b68ee',
    icon: '🖼️'
  },
  { 
    key: 'livevideo', 
    name: 'Live Video', 
    description: 'Streaming and video content',
    category: 'media',
    color: '#ff6b6b',
    icon: '📹'
  },
  { 
    key: 'productivity', 
    name: 'Productivity', 
    description: 'Tools and workflows for productivity',
    category: 'tools',
    color: '#4ecdc4',
    icon: '⚡'
  },
  { 
    key: 'blog', 
    name: 'Blog (CMS)', 
    description: 'Content management and blogging',
    category: 'content',
    color: '#45b7d1',
    icon: '📝'
  },
  { 
    key: 'threegame', 
    name: 'Three.js Game', 
    description: '3D games and interactive experiences',
    category: 'games',
    color: '#96ceb4',
    icon: '🎮'
  },
  { 
    key: 'uploadandsort', 
    name: 'Upload & Sort', 
    description: 'File management and AI organization',
    category: 'tools',
    color: '#ffeaa7',
    icon: '📂'
  },
  { 
    key: 'chatbot', 
    name: 'AI Chatbot', 
    description: 'Intelligent conversation and assistance',
    category: 'ai',
    color: '#fd79a8',
    icon: '🤖'
  },
  { 
    key: 'game', 
    name: 'Classic Games', 
    description: 'Traditional games and leaderboards',
    category: 'games',
    color: '#fdcb6e',
    icon: '🎯'
  },
  { 
    key: 'admin', 
    name: 'Admin Panel', 
    description: 'System administration and settings',
    category: 'system',
    color: '#e17055',
    icon: '⚙️'
  }
];

// Sample "Now Playing" content that rotates
const NOW_PLAYING_CONTENT = [
  {
    title: "Featured: AI-Enhanced Chatbot",
    subtitle: "Experience RAG-powered conversations with vector search",
    description: "Our chatbot now supports multiple vector stores, custom instructions, and real-time web search integration.",
    channel: "chatbot",
    image: "🤖",
    highlight: true
  },
  {
    title: "Live Sports Updates",
    subtitle: "NFL • NBA • MLB scores and news",
    description: "Get real-time sports scores, game updates, and breaking news from major leagues.",
    channel: "sports",
    image: "🏈",
    highlight: false
  },
  {
    title: "New: 3D Gaming Experience",
    subtitle: "Three.js powered interactive games",
    description: "Immersive 3D games built with modern web technologies and real-time physics.",
    channel: "threegame",
    image: "🎮",
    highlight: false
  },
  {
    title: "Content Management",
    subtitle: "Rich blogging platform with markdown",
    description: "Create, edit, and manage blog posts with our enhanced CMS featuring categories and tags.",
    channel: "blog",
    image: "📝",
    highlight: false
  }
];

export default function Landing() {
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [sportsData, setSportsData] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  // Fetch sports data on component mount
  useEffect(() => {
    fetchSportsData();
    const sportsInterval = setInterval(fetchSportsData, 300000); // Update every 5 minutes
    return () => clearInterval(sportsInterval);
  }, []);

  // Auto-scroll "Now Playing" content
  useEffect(() => {
    if (isAutoScrolling && !isHovering) {
      const interval = setInterval(() => {
        setNowPlayingIndex(prev => (prev + 1) % NOW_PLAYING_CONTENT.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoScrolling, isHovering]);

  // Auto-scroll channel directory
  useEffect(() => {
    if (isAutoScrolling && !isHovering && scrollContainerRef.current) {
      autoScrollIntervalRef.current = setInterval(() => {
        const container = scrollContainerRef.current;
        if (container) {
          const scrollAmount = 2;
          container.scrollTop += scrollAmount;
          
          // Reset to top when reaching bottom
          if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            container.scrollTop = 0;
          }
        }
      }, 50);
    } else {
      clearInterval(autoScrollIntervalRef.current);
    }

    return () => clearInterval(autoScrollIntervalRef.current);
  }, [isAutoScrolling, isHovering]);

  const fetchSportsData = async () => {
    try {
      const response = await fetch('/api/sports/feed');
      if (response.ok) {
        const data = await response.json();
        setSportsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch sports data:', error);
    }
  };

  const handleChannelClick = (channelKey) => {
    // This would integrate with your channel navigation system
    console.log(`Navigate to channel: ${channelKey}`);
    // You might dispatch an action or call a navigation function here
  };

  const currentNowPlaying = NOW_PLAYING_CONTENT[nowPlayingIndex];

  return (
    <div style={styles.container}>
      {/* TV Guide Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📺 Channel Guide</h1>
        <div style={styles.controls}>
          <button 
            style={{...styles.controlBtn, backgroundColor: isAutoScrolling ? '#4a90e2' : '#666'}}
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          >
            {isAutoScrolling ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <span style={styles.liveIndicator}>
            <span style={styles.liveDot}></span>
            LIVE
          </span>
        </div>
      </div>

      {/* Now Playing Section (Top 1/4) */}
      <div style={styles.nowPlayingSection}>
        <div style={styles.nowPlayingContainer}>
          <div 
            style={styles.nowPlayingContent}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div style={styles.nowPlayingLeft}>
              <div style={styles.nowPlayingImage}>
                {currentNowPlaying.image}
              </div>
            </div>
            <div style={styles.nowPlayingRight}>
              <div style={styles.nowPlayingBadge}>
                {currentNowPlaying.highlight ? '🔥 FEATURED' : '📺 NOW PLAYING'}
              </div>
              <h2 style={styles.nowPlayingTitle}>{currentNowPlaying.title}</h2>
              <h3 style={styles.nowPlayingSubtitle}>{currentNowPlaying.subtitle}</h3>
              <p style={styles.nowPlayingDescription}>{currentNowPlaying.description}</p>
              <button 
                style={styles.watchButton}
                onClick={() => handleChannelClick(currentNowPlaying.channel)}
              >
                Watch Now →
              </button>
            </div>
          </div>
          
          {/* Progress indicators */}
          <div style={styles.progressIndicators}>
            {NOW_PLAYING_CONTENT.map((_, index) => (
              <div
                key={index}
                style={{
                  ...styles.progressDot,
                  backgroundColor: index === nowPlayingIndex ? '#fff' : 'rgba(255,255,255,0.3)'
                }}
                onClick={() => setNowPlayingIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Channel Directory Section (Bottom 3/4) */}
      <div style={styles.directorySection}>
        <div style={styles.directoryHeader}>
          <h3 style={styles.directoryTitle}>Channel Directory</h3>
          <div style={styles.directoryStats}>
            {CHANNELS.length} Channels • {sportsData?.liveGames || 0} Live Games
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          style={styles.channelGrid}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {CHANNELS.map((channel, index) => (
            <ChannelCard
              key={channel.key}
              channel={channel}
              onClick={() => handleChannelClick(channel.key)}
              delay={index * 100}
            />
          ))}
          
          {/* Sports Feed Integration */}
          {sportsData?.feed && sportsData.feed.slice(0, 3).map((item, index) => (
            <SportsCard
              key={`sports-${index}`}
              item={item}
              delay={(CHANNELS.length + index) * 100}
            />
          ))}
          
          {/* Spacer for continuous scroll */}
          <div style={{height: '200px'}} />
        </div>
      </div>
    </div>
  );
}

// Individual Channel Card Component
function ChannelCard({ channel, onClick, delay }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.channelCard,
        animationDelay: `${delay}ms`,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered ? styles.channelCardHover.boxShadow : styles.channelCard.boxShadow
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={styles.channelIcon}>{channel.icon}</div>
      <div style={styles.channelInfo}>
        <h4 style={styles.channelName}>{channel.name}</h4>
        <p style={styles.channelDescription}>{channel.description}</p>
        <div style={{...styles.channelCategory, backgroundColor: channel.color}}>
          {channel.category}
        </div>
      </div>
      <div style={{...styles.channelGlow, backgroundColor: channel.color}}></div>
    </div>
  );
}

// Sports Feed Card Component
function SportsCard({ item, delay }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.sportsCard,
        animationDelay: `${delay}ms`,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.sportsIcon}>
        {item.type === 'live_game' ? '🔴' : item.type === 'news' ? '📰' : '⏰'}
      </div>
      <div style={styles.sportsInfo}>
        <h4 style={styles.sportsTitle}>{item.title}</h4>
        <p style={styles.sportsSubtitle}>{item.subtitle}</p>
        {item.sport && (
          <div style={styles.sportsBadge}>{item.sport}</div>
        )}
      </div>
    </div>
  );
}

// Comprehensive styles object
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    overflow: 'hidden'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'rgba(0,0,0,0.2)',
    backdropFilter: 'blur(10px)'
  },
  
  title: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #fff, #a8dadc)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  
  controlBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  },
  
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#ff4757',
    animation: 'pulse 2s infinite'
  },
  
  nowPlayingSection: {
    height: '25vh',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center'
  },
  
  nowPlayingContainer: {
    width: '100%',
    position: 'relative'
  },
  
  nowPlayingContent: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease'
  },
  
  nowPlayingLeft: {
    marginRight: '30px'
  },
  
  nowPlayingImage: {
    fontSize: '4rem',
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    border: '2px solid rgba(255,255,255,0.2)'
  },
  
  nowPlayingRight: {
    flex: 1
  },
  
  nowPlayingBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  
  nowPlayingTitle: {
    margin: '0 0 10px 0',
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  
  nowPlayingSubtitle: {
    margin: '0 0 15px 0',
    fontSize: '1.2rem',
    opacity: 0.8
  },
  
  nowPlayingDescription: {
    margin: '0 0 20px 0',
    opacity: 0.7,
    lineHeight: 1.5
  },
  
  watchButton: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '25px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  },
  
  progressIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px'
  },
  
  progressDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  directorySection: {
    height: '75vh',
    padding: '0 40px 20px 40px'
  },
  
  directoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  
  directoryTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  
  directoryStats: {
    opacity: 0.7,
    fontSize: '14px'
  },
  
  channelGrid: {
    height: 'calc(75vh - 80px)',
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    paddingRight: '10px'
  },
  
  channelCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '25px',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: 'slideInUp 0.6s ease forwards',
    opacity: 0,
    transform: 'translateY(30px)',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  },
  
  channelCardHover: {
    boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
  },
  
  channelIcon: {
    fontSize: '2.5rem',
    marginBottom: '15px',
    display: 'block'
  },
  
  channelInfo: {
    position: 'relative',
    zIndex: 2
  },
  
  channelName: {
    margin: '0 0 10px 0',
    fontSize: '1.3rem',
    fontWeight: 'bold'
  },
  
  channelDescription: {
    margin: '0 0 15px 0',
    opacity: 0.8,
    fontSize: '14px',
    lineHeight: 1.4
  },
  
  channelCategory: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white'
  },
  
  channelGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    borderRadius: '15px',
    transition: 'opacity 0.3s ease'
  },
  
  sportsCard: {
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '15px',
    padding: '20px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.15)',
    transition: 'all 0.3s ease',
    animation: 'slideInUp 0.6s ease forwards',
    opacity: 0,
    transform: 'translateY(30px)',
    borderLeft: '4px solid #ff6b6b'
  },
  
  sportsIcon: {
    fontSize: '1.5rem',
    marginBottom: '10px'
  },
  
  sportsInfo: {
    
  },
  
  sportsTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  
  sportsSubtitle: {
    margin: '0 0 10px 0',
    opacity: 0.7,
    fontSize: '14px'
  },
  
  sportsBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    background: 'rgba(255,107,107,0.2)',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#ff6b6b'
  }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  /* Custom scrollbar */
  .channelGrid::-webkit-scrollbar {
    width: 8px;
  }
  
  .channelGrid::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }
  
  .channelGrid::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.3);
    border-radius: 4px;
  }
  
  .channelGrid::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.5);
  }
`;

if (!document.head.querySelector('style[data-landing-styles]')) {
  styleSheet.setAttribute('data-landing-styles', 'true');
  document.head.appendChild(styleSheet);
}
