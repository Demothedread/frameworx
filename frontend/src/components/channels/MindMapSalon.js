import React, { useEffect, useRef, useState } from 'react';
import { getSampleMindMap } from '../../utils/mindMapData';
import { getGamificationSystem } from '../../utils/GamificationSystem';

/**
 * Belle Époque Social Salon with Futuristic Neural Network Overlay
 * 
 * Transforms the mind map into an interactive salon where nodes represent salon guests
 * with floating conversation bubbles, golden particle connections, and neon neural overlays.
 * Features both vintage French salon aesthetics and cyberpunk social networking visuals.
 */

export default function MindMapSalon({ theme = 'light', particleEngine }) {
  const canvasRef = useRef(null);
  const salonRef = useRef(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [conversationMode, setConversationMode] = useState('belle-epoque'); // 'belle-epoque' | 'neural-network'
  const [activeConversations, setActiveConversations] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const gamificationSystem = getGamificationSystem();

  // Salon guests data (enhanced mind map nodes)
  const [salonGuests, setSalonGuests] = useState([]);
  const [salonConnections, setSalonConnections] = useState([]);

  useEffect(() => {
    const { nodes, links } = getSampleMindMap();
    
    // Transform nodes into salon guests with Belle Époque personas
    const guests = nodes.map((node, index) => ({
      ...node,
      salonPersona: generateSalonPersona(node, index),
      conversations: generateConversationTopics(node),
      position: { x: 0, y: 0, z: 0 },
      socialEnergy: Math.random() * 100,
      networkActivity: Math.random() * 100
    }));

    setSalonGuests(guests);
    setSalonConnections(links);
    
    // Track interaction
    gamificationSystem.interactWithChannel('mindmap', 'salon-enter');
  }, []);

  const generateSalonPersona = (node, index) => {
    const belleEpoquePersonas = [
      { 
        title: 'Madame la Comtesse', 
        description: 'Influential aristocrat hosting elegant soirées',
        avatar: '👑',
        speciality: 'Political Discourse'
      },
      { 
        title: 'Monsieur l\'Artiste', 
        description: 'Renowned painter of the avant-garde movement',
        avatar: '🎨',
        speciality: 'Artistic Innovation'
      },
      { 
        title: 'Professeur de Sciences', 
        description: 'Leading physicist exploring new theories',
        avatar: '🔬',
        speciality: 'Scientific Discovery'
      },
      { 
        title: 'Dame Philanthrope', 
        description: 'Champion of social reform and charity',
        avatar: '💎',
        speciality: 'Social Progress'
      },
      { 
        title: 'Maître Architecte', 
        description: 'Designer of magnificent Art Nouveau buildings',
        avatar: '🏛️',
        speciality: 'Architectural Vision'
      },
      { 
        title: 'Éditeur Littéraire', 
        description: 'Publisher of revolutionary literary works',
        avatar: '📚',
        speciality: 'Literary Culture'
      }
    ];

    const futuristicPersonas = [
      {
        title: 'Neural Interface Architect',
        description: 'Designer of consciousness-machine interfaces',
        avatar: '🧠',
        speciality: 'Mind-Machine Fusion'
      },
      {
        title: 'Quantum Social Engineer',
        description: 'Manipulator of probability networks',
        avatar: '⚛️',
        speciality: 'Reality Optimization'
      },
      {
        title: 'Holographic Artist',
        description: 'Creator of immersive light sculptures',
        avatar: '🔮',
        speciality: 'Digital Aesthetics'
      }
    ];

    const personas = theme === 'dark' ? futuristicPersonas : belleEpoquePersonas;
    return personas[index % personas.length];
  };

  const generateConversationTopics = (node) => {
    const belleEpoqueTopics = [
      "The influence of electricity on modern society",
      "Impressionist techniques in contemporary art",
      "The role of women in advancing social reform",
      "Archaeological discoveries in Egypt",
      "The future of transportation and automobiles",
      "Literary salons and intellectual discourse"
    ];

    const futuristicTopics = [
      "Quantum consciousness theories",
      "Digital emotion synthesis",
      "Bio-neural network architecture",
      "Holographic memory storage",
      "Synthetic empathy algorithms",
      "Multidimensional social protocols"
    ];

    const topics = theme === 'dark' ? futuristicTopics : belleEpoqueTopics;
    return topics.slice(0, 3 + Math.floor(Math.random() * 3));
  };

  useEffect(() => {
    if (!canvasRef.current || salonGuests.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const W = canvas.width;
    const H = canvas.height;
    const centerX = W / 2;
    const centerY = H / 2;
    const PERSPECTIVE = 400;
    const rInner = 120;
    const rOuter = 200;
    let rotation = 0;
    let animationId;

    // Position guests in salon layout
    const inner = salonGuests.filter(g => g.closeness === 1);
    const outer = salonGuests.filter(g => g.closeness === 2);
    const center = salonGuests.find(g => g.closeness === 0);

    inner.forEach((guest, i) => {
      const angle = (i / inner.length) * Math.PI * 2;
      guest.position = { x: rInner * Math.cos(angle), y: rInner * Math.sin(angle), z: 30 };
    });

    outer.forEach((guest, i) => {
      const angle = (i / outer.length) * Math.PI * 2;
      guest.position = { x: rOuter * Math.cos(angle), y: rOuter * Math.sin(angle), z: -30 };
    });

    if (center) center.position = { x: 0, y: 0, z: 0 };

    function rotateY(pos, angle) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: pos.x * cos - pos.z * sin,
        y: pos.y,
        z: pos.x * sin + pos.z * cos
      };
    }

    function project(pos) {
      const scale = PERSPECTIVE / (PERSPECTIVE - pos.z);
      return {
        x: pos.x * scale + centerX,
        y: pos.y * scale + centerY,
        scale: scale
      };
    }

    function drawSalon() {
      // Clear with salon background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(W, H) / 2);
      
      if (conversationMode === 'belle-epoque') {
        gradient.addColorStop(0, theme === 'dark' ? '#2a1810' : '#f5f0e8');
        gradient.addColorStop(0.7, theme === 'dark' ? '#1a0f08' : '#e8ddd0');
        gradient.addColorStop(1, theme === 'dark' ? '#0f0704' : '#d4c4a8');
      } else {
        gradient.addColorStop(0, theme === 'dark' ? '#0a0a2e' : '#e8e8ff');
        gradient.addColorStop(0.7, theme === 'dark' ? '#050520' : '#d0d0f0');
        gradient.addColorStop(1, theme === 'dark' ? '#020210' : '#b8b8e0');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      // Draw connections first
      salonConnections.forEach(connection => {
        const sourceGuest = salonGuests.find(g => g.id === connection.source);
        const targetGuest = salonGuests.find(g => g.id === connection.target);
        
        if (sourceGuest && targetGuest) {
          const sourcePos = project(rotateY(sourceGuest.position, rotation));
          const targetPos = project(rotateY(targetGuest.position, rotation));
          
          drawConnection(ctx, sourcePos, targetPos, sourceGuest, targetGuest);
        }
      });

      // Draw guests
      const rotatedGuests = salonGuests.map(guest => ({
        ...guest,
        projectedPos: project(rotateY(guest.position, rotation))
      }));

      // Sort by z-depth for proper rendering
      rotatedGuests.sort((a, b) => {
        const aRotated = rotateY(a.position, rotation);
        const bRotated = rotateY(b.position, rotation);
        return bRotated.z - aRotated.z;
      });

      rotatedGuests.forEach(guest => {
        drawGuest(ctx, guest);
      });

      rotation += 0.01;
      animationId = requestAnimationFrame(drawSalon);
    }

    function drawConnection(ctx, sourcePos, targetPos, sourceGuest, targetGuest) {
      const gradient = ctx.createLinearGradient(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
      
      if (conversationMode === 'belle-epoque') {
        gradient.addColorStop(0, theme === 'dark' ? '#FFD700' : '#B8860B');
        gradient.addColorStop(0.5, theme === 'dark' ? '#FFA500' : '#CD853F');
        gradient.addColorStop(1, theme === 'dark' ? '#FFD700' : '#B8860B');
      } else {
        gradient.addColorStop(0, '#00FFFF');
        gradient.addColorStop(0.5, '#FF1493');
        gradient.addColorStop(1, '#8A2BE2');
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = Math.min(sourcePos.scale, targetPos.scale) * 2;
      ctx.shadowColor = conversationMode === 'belle-epoque' ? '#FFD700' : '#00FFFF';
      ctx.shadowBlur = 5;
      
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      
      // Add curve for more elegant connection
      const midX = (sourcePos.x + targetPos.x) / 2;
      const midY = (sourcePos.y + targetPos.y) / 2 - 20 * Math.min(sourcePos.scale, targetPos.scale);
      ctx.quadraticCurveTo(midX, midY, targetPos.x, targetPos.y);
      ctx.stroke();
      
      ctx.shadowBlur = 0;

      // Draw floating particles along connection
      if (Math.random() < 0.1) {
        const t = Math.random();
        const particleX = sourcePos.x + t * (targetPos.x - sourcePos.x);
        const particleY = sourcePos.y + t * (targetPos.y - sourcePos.y);
        
        ctx.fillStyle = conversationMode === 'belle-epoque' ? '#FFD700' : '#00FFFF';
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawGuest(ctx, guest) {
      const pos = guest.projectedPos;
      const isHovered = hoveredNode === guest.id;
      const isSelected = selectedGuest === guest.id;
      
      // Guest circle
      const radius = (15 + guest.mutual * 3) * pos.scale;
      
      let fillColor, strokeColor;
      if (conversationMode === 'belle-epoque') {
        fillColor = theme === 'dark' ? '#3a2a1a' : '#f8f4e6';
        strokeColor = guest.group === 'family' ? '#d4af37' : 
                     guest.group === 'friend' ? '#cd853f' : 
                     guest.group === 'work' ? '#daa520' : '#ffd700';
      } else {
        fillColor = theme === 'dark' ? '#1a1a3a' : '#e6e6ff';
        strokeColor = guest.group === 'family' ? '#ff1493' : 
                     guest.group === 'friend' ? '#00ffff' : 
                     guest.group === 'work' ? '#8a2be2' : '#00ff00';
      }

      // Glow effect for hovered/selected
      if (isHovered || isSelected) {
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = 15;
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = (isSelected ? 4 : isHovered ? 3 : 2) * pos.scale;
      
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Guest avatar/icon
      ctx.fillStyle = strokeColor;
      ctx.font = `${20 * pos.scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(guest.salonPersona.avatar, pos.x, pos.y);

      // Guest name
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#333333';
      ctx.font = `${10 * pos.scale}px Cinzel, serif`;
      ctx.fillText(guest.id, pos.x, pos.y + radius + 15 * pos.scale);

      // Floating conversation bubble (if active)
      if (activeConversations.includes(guest.id) || isHovered) {
        drawConversationBubble(ctx, pos, guest, pos.scale);
      }
    }

    function drawConversationBubble(ctx, pos, guest, scale) {
      const bubbleX = pos.x + 40 * scale;
      const bubbleY = pos.y - 30 * scale;
      const bubbleWidth = 120 * scale;
      const bubbleHeight = 60 * scale;

      // Bubble background
      ctx.fillStyle = conversationMode === 'belle-epoque' 
        ? (theme === 'dark' ? 'rgba(255, 215, 0, 0.9)' : 'rgba(248, 244, 230, 0.95)')
        : (theme === 'dark' ? 'rgba(0, 255, 255, 0.9)' : 'rgba(230, 230, 255, 0.95)');
      
      ctx.strokeStyle = conversationMode === 'belle-epoque' ? '#B8860B' : '#00FFFF';
      ctx.lineWidth = 1;

      // Rounded rectangle bubble
      ctx.beginPath();
      ctx.roundRect(bubbleX - bubbleWidth/2, bubbleY - bubbleHeight/2, bubbleWidth, bubbleHeight, 10 * scale);
      ctx.fill();
      ctx.stroke();

      // Bubble tail
      ctx.beginPath();
      ctx.moveTo(bubbleX - 20 * scale, bubbleY + 15 * scale);
      ctx.lineTo(pos.x + 10 * scale, pos.y - 10 * scale);
      ctx.lineTo(bubbleX - 10 * scale, bubbleY + 20 * scale);
      ctx.closePath();
      ctx.fill();

      // Conversation text
      ctx.fillStyle = theme === 'dark' ? '#000000' : '#333333';
      ctx.font = `${8 * scale}px Cinzel, serif`;
      ctx.textAlign = 'center';
      
      const topic = guest.conversations[Math.floor(Date.now() / 3000) % guest.conversations.length];
      const words = topic.split(' ');
      const maxWordsPerLine = 3;
      
      for (let i = 0; i < words.length; i += maxWordsPerLine) {
        const line = words.slice(i, i + maxWordsPerLine).join(' ');
        ctx.fillText(line, bubbleX, bubbleY - 10 * scale + (i / maxWordsPerLine) * 12 * scale);
      }
    }

    drawSalon();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [salonGuests, conversationMode, theme, hoveredNode, selectedGuest, activeConversations]);

  const handleCanvasClick = (event) => {
    if (!canvasRef.current || salonGuests.length === 0) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Find clicked guest (simplified hit detection)
    salonGuests.forEach(guest => {
      const distance = Math.sqrt(
        Math.pow(clickX - canvas.width / 2, 2) + 
        Math.pow(clickY - canvas.height / 2, 2)
      );
      
      if (distance < 100) { // Simplified detection
        setSelectedGuest(guest.id);
        setActiveConversations(prev => 
          prev.includes(guest.id) 
            ? prev.filter(id => id !== guest.id)
            : [...prev, guest.id]
        );
        
        gamificationSystem.interactWithChannel('mindmap', 'guest-conversation');
        
        if (particleEngine) {
          particleEngine.createEffect('ornamentBurst', clickX + rect.left, clickY + rect.top);
        }
      }
    });
  };

  const toggleConversationMode = () => {
    const newMode = conversationMode === 'belle-epoque' ? 'neural-network' : 'belle-epoque';
    setConversationMode(newMode);
    
    gamificationSystem.interactWithChannel('mindmap', `mode-${newMode}`);
    
    if (particleEngine) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      if (newMode === 'neural-network') {
        particleEngine.createEffect('holographicPulse', centerX, centerY, { count: 25 });
      } else {
        particleEngine.createEffect('vineGrowth', centerX, centerY, { segments: 20 });
      }
    }
  };

  return (
    <div style={{
      background: conversationMode === 'belle-epoque'
        ? (theme === 'dark' 
          ? 'linear-gradient(135deg, #2a1810, #1a0f08)'
          : 'linear-gradient(135deg, #f5f0e8, #e8ddd0)')
        : (theme === 'dark'
          ? 'linear-gradient(135deg, #0a0a2e, #050520)'
          : 'linear-gradient(135deg, #e8e8ff, #d0d0f0)'),
      minHeight: '100vh',
      position: 'relative',
      fontFamily: 'Cinzel, serif'
    }}>
      
      {/* Salon Header */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          background: conversationMode === 'belle-epoque'
            ? 'linear-gradient(45deg, #FFD700, #B8860B)'
            : 'linear-gradient(45deg, #00FFFF, #FF1493)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>
          {conversationMode === 'belle-epoque' 
            ? '🎭 Le Salon Parisien 🎭'
            : '🧠 Neural Network Salon 🧠'
          }
        </h2>
        
        <p style={{
          color: theme === 'dark' ? '#cccccc' : '#666666',
          fontSize: '1.1rem',
          fontStyle: 'italic',
          marginBottom: '2rem'
        }}>
          {conversationMode === 'belle-epoque'
            ? 'Un espace d\'échange intellectuel et de conversation raffinée'
            : 'An interconnected matrix of consciousness and digital discourse'
          }
        </p>

        <button
          onClick={toggleConversationMode}
          style={{
            background: conversationMode === 'belle-epoque'
              ? 'linear-gradient(135deg, #8A2BE2, #FF1493)'
              : 'linear-gradient(135deg, #B8860B, #FFD700)',
            border: 'none',
            color: '#FFF',
            padding: '12px 25px',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Cinzel, serif',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
          }}
        >
          {conversationMode === 'belle-epoque' 
            ? '🔮 Enter Neural Network'
            : '🎭 Return to Belle Époque'
          }
        </button>
      </div>

      {/* Interactive Salon Canvas */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative'
      }}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={(e) => {
            // Simplified hover detection
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
            
            // Set hovered node based on distance (simplified)
            if (distance < 150 && salonGuests.length > 0) {
              const guestIndex = Math.floor((Math.atan2(mouseY - centerY, mouseX - centerX) + Math.PI) / (Math.PI * 2) * salonGuests.length);
              setHoveredNode(salonGuests[guestIndex]?.id || null);
            } else {
              setHoveredNode(null);
            }
          }}
          style={{
            width: '600px',
            height: '400px',
            border: conversationMode === 'belle-epoque'
              ? '3px solid #FFD700'
              : '3px solid #00FFFF',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: conversationMode === 'belle-epoque'
              ? '0 0 30px rgba(255, 215, 0, 0.3)'
              : '0 0 30px rgba(0, 255, 255, 0.3)'
          }}
        />
      </div>

      {/* Guest Information Panel */}
      {selectedGuest && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: conversationMode === 'belle-epoque'
            ? 'linear-gradient(135deg, rgba(255,215,0,0.95), rgba(184,134,11,0.95))'
            : 'linear-gradient(135deg, rgba(0,255,255,0.95), rgba(255,20,147,0.95))',
          color: theme === 'dark' ? '#000' : '#FFF',
          padding: '20px 30px',
          borderRadius: '20px',
          border: conversationMode === 'belle-epoque' ? '2px solid #B8860B' : '2px solid #00FFFF',
          maxWidth: '400px',
          textAlign: 'center',
          zIndex: 3,
          backdropFilter: 'blur(10px)'
        }}>
          {(() => {
            const guest = salonGuests.find(g => g.id === selectedGuest);
            return guest ? (
              <div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                  {guest.salonPersona.avatar} {guest.salonPersona.title}
                </h3>
                <p style={{ margin: '5px 0', fontSize: '14px', fontStyle: 'italic' }}>
                  {guest.salonPersona.description}
                </p>
                <div style={{ fontSize: '12px', marginTop: '10px' }}>
                  <strong>Speciality:</strong> {guest.salonPersona.speciality}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

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
        <div>Click guests to start conversations</div>
        <div>Hover to see discussion topics</div>
        <div>Toggle between salon modes</div>
      </div>
    </div>
  );
}