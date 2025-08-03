import React, { useState } from 'react';



import Landing from './channels/Landing';
import Gallery from './channels/Gallery';
import LiveVideo from './channels/LiveVideo';
import MindMap from './channels/MindMap';
import Productivity from './channels/Productivity';
import Blog from './channels/Blog';
import ThreeGame from './channels/ThreeGame';
import UploadAndSort from './channels/UploadAndSort';

import Admin from './channels/Admin';
import Game from './channels/Game';

// Register your channel cards here!
import Chatbot from './channels/Chatbot';

const CHANNELS = [
  { key: 'landing', name: 'Landing', Component: Landing },
  { key: 'gallery', name: 'Image Gallery', Component: Gallery },
  { key: 'livevideo', name: 'Live Video', Component: LiveVideo },
  { key: 'mindmap', name: 'Mind Map', Component: MindMap },
  { key: 'productivity', name: 'Productivity', Component: Productivity },
  { key: 'blog', name: 'Blog (CMS)', Component: Blog },
  { key: 'threegame', name: 'Three.js Game', Component: ThreeGame },
  { key: 'uploadandsort', name: 'Upload & Sort', Component: UploadAndSort },
  { key: 'chatbot', name: 'Chatbot', Component: Chatbot },
  { key: 'game', name: 'Game (Sample)', Component: Game },
  { key: 'admin', name: 'Admin', Component: Admin },
];

import React, { useState, useRef } from 'react';

// Animation CSS (TV flip/static effect)
const tvAnimStyles = `
.channel-flip-outer {
  position: relative;
  width: 100vw;
  min-height: 360px;
  background: #141519;
  overflow: hidden;
}
.tv-channel-inner {
  transition: transform 0.44s cubic-bezier(.75,-0.15,.7,1.4), opacity 0.33s cubic-bezier(.55,0,.5,1);
  will-change: transform, opacity;
}
.tv-flip {
  animation: tv-flip-in 0.44s 1;
}
@keyframes tv-flip-in {
  0% { opacity:0; transform: rotateY(90deg) scale(1.2); filter:brightness(2) grayscale(.8); }
  40% { opacity:.4; filter:contrast(1.5) brightness(1.5) blur(3px);}
  62% { filter:brightness(0.7) contrast(0.3) saturate(3) grayscale(0.9) }
  80% { filter:contrast(1.2) ; }
  100% { opacity:1; transform: none; filter:none }
}
.tv-static {
  animation: tv-staticflicker 0.15s 1;
}
@keyframes tv-staticflicker {
  0% { background: repeating-linear-gradient(90deg,#aaa 1px,#ddd 3px,#999 5px); }
  40% { background: repeating-linear-gradient(0deg,#444 2px,#efefef 6px,#999 12px); }
  80% { background: repeating-linear-gradient(90deg,#aaa 1px,#ddd 3px,#999 5px); }
  100% { background:inherit;}
}
.tv-channel-nav {
  position:relative; display:flex; flex-direction:row; align-items: center; justify-content: center;
  gap:2vw; margin: 14px 0 8px 0; font-family:sans-serif; font-weight:bold;
}
.tv-nav-btn {
  padding: 5px 20px; background: #222c36; color: #fff; border-radius: 1em; border:0; font-size:1rem; cursor:pointer;
  margin: 0 8px;
  transition:background .2s;
}
.tv-nav-btn:hover { background: #5569a1; }
`;

// Intuitive, drop-in: just put your Channel's Component in 'CHANNELS' above
export default function ChannelContainer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [flipDir, setFlipDir] = useState(''); // '' | 'fwd' | 'bwd'
  const animTimeoutRef = useRef();
  const Channel = CHANNELS[activeIdx].Component;

  function flip(toIdx, dir) {
    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    setFlipDir(dir);
    setAnimKey(k=>k+1);
    setTimeout(() => {
      setActiveIdx(toIdx);
      setAnimKey(k=>k+1);
      setFlipDir('');
    }, 440); // matches tv-flip duration
  }

  const nextChannel = () => flip((activeIdx + 1) % CHANNELS.length, 'fwd');
  const prevChannel = () => flip((activeIdx - 1 + CHANNELS.length) % CHANNELS.length, 'bwd');

  return (
    <main>
      <style>{tvAnimStyles}</style>
      <div className="tv-channel-nav">
        <button className="tv-nav-btn" onClick={prevChannel}>&lt; Prev</button>
        <span style={{color:'#c8ffe9', textShadow:'1px 2px 2px #111',fontSize:'1.4em'}}>{CHANNELS[activeIdx].name}</span>
        <button className="tv-nav-btn" onClick={nextChannel}>Next &gt;</button>
      </div>
      <div className={`channel-flip-outer ${flipDir && 'tv-static'}`}
           style={{padding:'10px 0 32px 0', minHeight:350, background:'#23233a', borderRadius:12, boxShadow:'0 3px 28px #35386080'}}>
        <div key={animKey}
          className={`tv-channel-inner${flipDir? ' tv-flip':''}`}
        >
          <Channel />
        </div>
      </div>
    </main>
  );
}
