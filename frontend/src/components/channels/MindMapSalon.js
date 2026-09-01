import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getSampleMindMap } from '../../utils/mindMapData';
import { getGamificationSystem } from '../../utils/GamificationSystem';
import { buildSalonGuests, getGroupLabel } from './mindMapSalonModel';
import { drawSalonScene } from './mindMapSalonRenderer';
import './MindMapSalon.css';

const MODE_COPY = {
  'belle-epoque': {
    eyebrow: 'Relationship intelligence',
    title: 'The Salon Network',
    description: 'A measured view of the people, circles, and ideas that shape your world.'
  },
  'neural-network': {
    eyebrow: 'Connection intelligence',
    title: 'The Neural Network',
    description: 'A live map of affinity, influence, and the conversations moving between them.'
  }
};

export default function MindMapSalon({ theme = 'light', particleEngine }) {
  const canvasRef = useRef(null);
  const renderedNodesRef = useRef([]);
  const hoveredIdRef = useRef(null);
  const selectedIdRef = useRef('You');
  const [conversationMode, setConversationMode] = useState('belle-epoque');
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState('You');
  const gamificationSystem = getGamificationSystem();
  const graph = useMemo(() => getSampleMindMap(), []);
  const guests = useMemo(
    () => buildSalonGuests(graph.nodes, conversationMode),
    [conversationMode, graph.nodes]
  );
  const selectedGuest = guests.find((guest) => guest.id === selectedId) || guests[0];
  const copy = MODE_COPY[conversationMode];

  hoveredIdRef.current = hoveredId;
  selectedIdRef.current = selectedId;

  useEffect(() => {
    gamificationSystem.interactWithChannel('mindmap', 'salon-enter');
  }, [gamificationSystem]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || guests.length === 0) return undefined;

    const context = canvas.getContext('2d');
    const motionState = new Map();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId;
    let lastTimestamp = performance.now();
    let rotation = 0;
    let size = { width: 0, height: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      size = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * pixelRatio);
      canvas.height = Math.round(rect.height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const render = (timestamp) => {
      const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
      lastTimestamp = timestamp;
      if (!reducedMotion) rotation += delta * 0.11;

      renderedNodesRef.current = drawSalonScene({
        context,
        width: size.width,
        height: size.height,
        guests,
        connections: graph.links,
        mode: conversationMode,
        theme,
        rotation,
        elapsed: timestamp / 1000,
        delta,
        reducedMotion,
        hoveredId: hoveredIdRef.current,
        selectedId: selectedIdRef.current,
        motionState
      });
      frameId = requestAnimationFrame(render);
    };

    resize();
    const resizeObserver = window.ResizeObserver ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(canvas);
    else window.addEventListener('resize', resize);
    frameId = requestAnimationFrame(render);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, [conversationMode, graph.links, guests, theme]);

  const findNodeAtPoint = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let best = null;
    let bestDistance = Infinity;
    for (const node of renderedNodesRef.current) {
      const distance = Math.hypot(node.x - x, node.y - y);
      if (distance <= node.hitRadius && distance < bestDistance) {
        best = node;
        bestDistance = distance;
      }
    }
    return best;
  };

  const selectGuest = (guestId, event) => {
    setSelectedId(guestId);
    gamificationSystem.interactWithChannel('mindmap', 'guest-selected');
    if (particleEngine && event) {
      particleEngine.createEffect('ornamentBurst', event.clientX, event.clientY, { count: 10 });
    }
  };

  const handleModeChange = (nextMode) => {
    setConversationMode(nextMode);
    gamificationSystem.interactWithChannel('mindmap', `mode-${nextMode}`);
  };

  return (
    <section className={`salon salon--${conversationMode} salon--${theme}`}>
      <header className="salon__header">
        <div>
          <p className="salon__eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="salon__description">{copy.description}</p>
        </div>
        <div className="salon__mode-switch" aria-label="Network view">
          <button
            className={conversationMode === 'belle-epoque' ? 'is-active' : ''}
            onClick={() => handleModeChange('belle-epoque')}
            type="button"
          >
            Salon
          </button>
          <button
            className={conversationMode === 'neural-network' ? 'is-active' : ''}
            onClick={() => handleModeChange('neural-network')}
            type="button"
          >
            Network
          </button>
        </div>
      </header>

      <div className="salon__summary" aria-label="Network summary">
        <span><strong>{guests.length}</strong> people</span>
        <span><strong>{graph.links.length}</strong> connections</span>
        <span className="salon__live-status">Live topology</span>
      </div>

      <div className="salon__workspace">
        <div className="salon__graph-card">
          <canvas
            ref={canvasRef}
            className={hoveredId ? 'salon__canvas is-interactive' : 'salon__canvas'}
            aria-label="Interactive relationship graph. Select a person from the directory for full details."
            onClick={(event) => {
              const node = findNodeAtPoint(event);
              if (node) selectGuest(node.id, event);
            }}
            onMouseLeave={() => setHoveredId(null)}
            onMouseMove={(event) => {
              const node = findNodeAtPoint(event);
              setHoveredId((currentId) => currentId === node?.id ? currentId : node?.id || null);
            }}
            role="img"
          />
          <div className="salon__legend" aria-label="Relationship legend">
            <span><i className="is-family" />Family</span>
            <span><i className="is-friend" />Friends</span>
            <span><i className="is-work" />Work</span>
          </div>
        </div>

        <aside className="salon__inspector" aria-live="polite">
          <p className="salon__eyebrow">Selected profile</p>
          <div className="salon__identity">
            <span className="salon__monogram" aria-hidden="true">{selectedGuest.monogram}</span>
            <div>
              <h2>{selectedGuest.id}</h2>
              <p>{selectedGuest.persona.title}</p>
            </div>
          </div>
          <p className="salon__bio">{selectedGuest.persona.description}</p>

          <dl className="salon__metrics">
            <div><dt>Relationship</dt><dd>{getGroupLabel(selectedGuest.group)}</dd></div>
            <div><dt>Shared ties</dt><dd>{selectedGuest.mutual}</dd></div>
            <div><dt>Circle</dt><dd>{selectedGuest.circleLabel}</dd></div>
          </dl>

          <div className="salon__topics">
            <h3>Discussion threads</h3>
            <ul>{selectedGuest.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          </div>

          <div className="salon__directory">
            <h3>People in this view</h3>
            <div>
              {guests.map((guest) => (
                <button
                  className={guest.id === selectedGuest.id ? 'is-active' : ''}
                  key={guest.id}
                  onClick={() => selectGuest(guest.id)}
                  type="button"
                >
                  <span>{guest.monogram}</span>
                  {guest.id}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
