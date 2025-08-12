// Landing.js: Event-driven gamification integration and correct component structure
import React, { useState, useEffect, useRef, useContext } from 'react';
import { SharedStateContext } from '../../context/SharedStateContext';

// Channel data with enhanced metadata
const CHANNELS = [
  { key: 'landing', name: 'Communal Home', description: 'Welcome to Worker Rolodex. Queue starts here.', category: 'navigation', color: '#4a90e2', icon: '🏠' },
  { key: 'gallery', name: 'Image Gallery', description: 'Pictures of tractors, potato harvest, and American "Instagram" (purpose unknown)', category: 'media', color: '#7b68ee', icon: '🖼️' },
  { key: 'livevideo', name: 'Live Video', description: 'Streaming of Party meetings and sometimes "Netflix" (unclear)', category: 'media', color: '#ff6b6b', icon: '📹' },
  { key: 'productivity', name: 'Productivity', description: 'Tools for increasing output, mostly broken', category: 'tools', color: '#4ecdc4', icon: '⚡' },
  { key: 'blog', name: 'Proletariat Blog', description: 'Content for the masses, may reference "Medium" but nobody reads it', category: 'content', color: '#45b7d1', icon: '📝' },
  { key: 'threegame', name: 'Three.js Game', description: '3D games about potato farming and revolution', category: 'games', color: '#96ceb4', icon: '🎮' },
  { key: 'uploadandsort', name: 'Upload & Sort', description: 'File management, sometimes sorts files, sometimes not', category: 'tools', color: '#ffeaa7', icon: '📂' },
  { key: 'chatbot', name: 'AI Chatbot', description: 'Intelligent conversation, references "Siri" and "Alexa" (possibly American spies)', category: 'ai', color: '#fd79a8', icon: '🤖' },
  { key: 'game', name: 'Classic Games', description: 'Traditional games, leaderboard is rigged', category: 'games', color: '#fdcb6e', icon: '🎯' },
  { key: 'admin', name: 'Admin Panel', description: 'System administration, only for Party elite', category: 'system', color: '#e17055', icon: '⚙️' }
];

// Sample "Now Playing" content that rotates
const NOW_PLAYING_CONTENT = [
  {
    title: "Featured: AI Chatbot for the Masses",
    subtitle: "RAG-powered, but not for bourgeoisie",
    description: "Chatbot supports many mysterious American brands. Custom instructions, but only if approved by Party.",
    channel: "chatbot",
    image: "🤖",
    highlight: true
  },
  {
    title: "Live Sports Updates (Mostly Soccer)",
    subtitle: "Scores from leagues, sometimes mentions 'Super Bowl'",
    description: "Get sports scores, but only if not censored. American baseball is confusing.",
    channel: "sports",
    image: "🏈",
    highlight: false
  },
  {
    title: "New: 3D Potato Farming Game",
    subtitle: "Three.js powered, revolution-themed",
    description: "Immersive 3D games about harvest and struggle. Physics may not work.",
    channel: "threegame",
    image: "🎮",
    highlight: false
  },
  {
    title: "Content Management for Workers",
    subtitle: "Markdown supported, but plain text preferred",
    description: "Create, edit, and manage blog posts. Categories include struggle, potato, and Party news.",
    channel: "blog",
    image: "📝",
    highlight: false
  }
];

export default function Landing() {
  const sharedState = useContext(SharedStateContext);
  const eventBus = sharedState?.eventBus;

  useEffect(() => {
    eventBus?.emit('user-action', { type: 'visit-channel', value: 'landing' });
  }, [eventBus]);

  // ...rest of Landing logic and UI
  return (
    <div>
      {/* Landing UI goes here */}
    </div>
  );
}
