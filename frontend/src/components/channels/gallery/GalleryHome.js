import React, { useEffect, useState } from 'react';
import GalleryTile from './GalleryTile';

/**
 * Home screen showing album tiles with keyboard and scroll navigation.
 * @param {object} props
 * @param {Array} props.albums List of album metadata objects.
 * @param {Function} props.onOpen Handler when an album is activated.
 */
export default function GalleryHome({ albums, onOpen }) {
  const [selected, setSelected] = useState(0);

  // Keyboard and scroll navigation
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setSelected((s) => (s + 1) % albums.length);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setSelected((s) => (s - 1 + albums.length) % albums.length);
      } else if (e.key === 'Enter') {
        onOpen(albums[selected].key);
      }
    }
    function handleWheel(e) {
      if (e.deltaY > 0) setSelected((s) => (s + 1) % albums.length);
      else if (e.deltaY < 0) setSelected((s) => (s - 1 + albums.length) % albums.length);
    }
    window.addEventListener('keydown', handleKey);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [albums, selected, onOpen]);

  return (
    <div className="gallery-home">
      {albums.map((a, idx) => (
        <GalleryTile
          key={a.key}
          album={a}
          index={idx}
          active={idx === selected}
          onClick={() => onOpen(a.key)}
        />
      ))}
      <style>{`
        .gallery-home {
          --bg-light: #f5f5f5;
          --bg-dark: #000;
          min-height: 100vh;
          background: var(--gallery-bg, var(--bg-dark));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        @media (prefers-color-scheme: light) {
          .gallery-home { --gallery-bg: var(--bg-light); }
        }
      `}</style>
    </div>
  );
}
