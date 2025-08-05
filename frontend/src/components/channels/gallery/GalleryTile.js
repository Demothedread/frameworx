import React from 'react';

/**
 * Rhombus-shaped album tile with drop animation and glow.
 * @param {object} props
 * @param {{key:string,name:string,color:string,preview:string}} props.album Album metadata.
 * @param {boolean} props.active Whether the tile is currently selected.
 * @param {number} props.index Position index for alternating animations.
 * @param {Function} props.onClick Callback when the tile is activated.
 */
export default function GalleryTile({ album, active, index, onClick }) {
  return (
    <div
      className={`gallery-tile${active ? ' active' : ''}`}
      style={{
        '--tile-color': album.color,
        '--tile-image': `url(${album.preview})`,
        animationDelay: `${index * 0.15}s`
      }}
      onClick={onClick}
    >
      <span className="label">{album.name}</span>
      <style>{`
        .gallery-tile {
          --size: 80vmin;
          position: relative;
          width: var(--size);
          height: var(--size);
          transform: rotate(45deg);
          border: 4px solid var(--tile-color, #ccc);
          background: var(--tile-image) no-repeat center/cover;
          filter: brightness(0.4);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2vh auto;
          animation: drop-${index % 2 ? 'bottom' : 'top'} 0.6s ease forwards;
        }
        .gallery-tile .label {
          position: absolute;
          transform: rotate(-45deg);
          color: var(--tile-color, #ccc);
          font-weight: bold;
          text-shadow: 0 0 6px rgba(0,0,0,0.8);
        }
        .gallery-tile.active {
          filter: brightness(1);
          box-shadow: 0 0 30px var(--tile-color, #fff);
          transform: rotate(45deg) scale(1.05);
        }
        .gallery-tile.active::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(255,255,255,0.8), transparent);
          mix-blend-mode: overlay;
          animation: glisten 1.2s linear;
        }
        @keyframes drop-top {
          from { transform: translateY(-100vh) rotate(45deg); }
          to { transform: translateY(0) rotate(45deg); }
        }
        @keyframes drop-bottom {
          from { transform: translateY(100vh) rotate(45deg); }
          to { transform: translateY(0) rotate(45deg); }
        }
        @keyframes glisten {
          from { opacity: 0; }
          50% { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
