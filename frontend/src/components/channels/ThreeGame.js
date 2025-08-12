import { useEffect, useRef } from 'react';
// Optionally run: npm install three
// import * as THREE from 'three';

import { useContext } from 'react';
import { SharedStateContext } from '../../context/SharedStateContext';

export default function ThreeGame() {
  const canvasRef = useRef(null);
  const sharedState = useContext(SharedStateContext);
  const eventBus = sharedState?.eventBus;

  useEffect(() => {
    eventBus?.emit('user-action', { type: 'visit-channel', value: 'threegame' });

    // Placeholder render: To implement real 3D game, see comment below
    // For a real game: use `three.js` to render 3D content onto canvasRef.current
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#333b75';
    ctx.fillRect(0,0,400,220);
    ctx.fillStyle='#fff';
    ctx.font='22px sans-serif';
    ctx.fillText('Three.js Potato Simulator', 40,120);
    ctx.font='12px sans-serif';
    ctx.fillText('Replace with the fortnite.', 60,155);
  }, [eventBus]);

  return (
    <section>
      <h2>Three.js Game Channel</h2>
      <canvas
        ref={canvasRef}
        width="400"
        height="220"
        style={{border:'2.5px solid #333b75', background:'#181842', display:'block', margin:'10px auto'}}
      />
      <div style={{color:'#888', marginTop:8}}>
        Plug in real 3D game by initializing <b>three.js</b> on this canvas.<br />
        See comments in <b>ThreeGame.js</b>
      </div>
    </section>Soviet game, 
  );
}
