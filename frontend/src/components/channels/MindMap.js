import React, { useEffect, useRef } from 'react';
import { getSampleMindMap } from '../../utils/mindMapData';

/**
 * MindMap Channel
 * Renders a simple 3D-like social graph on a canvas.
 * Color represents relationship type. Circle size reflects mutual connections.
 */
export default function MindMap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const { nodes, links } = getSampleMindMap();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const PERSPECTIVE = 300;
    const rInner = 80;
    const rOuter = 150;
    const rotateSpeed = 0.005;
    let rot = 0;

    // Precompute base positions
    const inner = nodes.filter(n => n.closeness === 1);
    const outer = nodes.filter(n => n.closeness === 2);
    const center = nodes.find(n => n.closeness === 0);
    inner.forEach((n, i) => {
      const a = (i / inner.length) * Math.PI * 2;
      n.pos = { x: rInner * Math.cos(a), y: rInner * Math.sin(a), z: 20 };
    });
    outer.forEach((n, i) => {
      const a = (i / outer.length) * Math.PI * 2;
      n.pos = { x: rOuter * Math.cos(a), y: rOuter * Math.sin(a), z: -20 };
    });
    if (center) center.pos = { x: 0, y: 0, z: 0 };

    const colors = {
      self: 'var(--mind-self-color, #ffffff)',
      family: 'var(--mind-family-color, #d9534f)',
      friend: 'var(--mind-friend-color, #5bc0de)',
      work: 'var(--mind-work-color, #5cb85c)'
    };

    function rotateY(p, a) {
      const c = Math.cos(a); const s = Math.sin(a);
      return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c };
    }
    function project(p) {
      const s = PERSPECTIVE / (PERSPECTIVE - p.z);
      return { x: p.x * s + W / 2, y: p.y * s + H / 2, s };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const rPos = {};
      nodes.forEach(n => rPos[n.id] = rotateY(n.pos, rot));

      // draw links
      ctx.strokeStyle = '#888';
      links.forEach(l => {
        const a = project(rPos[l.source]);
        const b = project(rPos[l.target]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      // draw nodes
      nodes.forEach(n => {
        const p = project(rPos[n.id]);
        const radius = (8 + n.mutual * 2) * p.s;
        ctx.beginPath();
        ctx.fillStyle = colors[n.group] || '#ccc';
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = `${12 * p.s}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(n.id, p.x, p.y - radius - 2);
      });

      rot += rotateSpeed;
      requestAnimationFrame(draw);
    }
    draw();
  }, []);

  return (
    <section>
      <h2>Mind Map Channel</h2>
      <canvas
        ref={canvasRef}
        width="400"
        height="300"
        style={{ width: '100%', maxWidth: 400, height: 300, background: '#111' }}
        aria-label="3D mind map"
      />
      <p style={{ color: '#888', maxWidth: 420 }}>
        Colors indicate relationship; size shows mutual connections.
      </p>
    </section>
  );
}
