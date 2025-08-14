import React, { useEffect, useMemo, useState } from 'react';
import { fetchAlbumImages } from './GalleryData';

/**
 * Auteur Monsieur album: ornate French salon wall with fixed frames and
 * dynamically assigned photos. Users can pan and zoom the wall.
 * @param {object} props React props
 * @param {string} [props.source] Image source key
 * @returns {JSX.Element}
 */
export default function GalleryAlbumAuteurMonsieur({ source }) {
  const [images, setImages] = useState([]);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Backend API lists files under /images/auteur-monsieur
    fetchAlbumImages(source, 'auteur-monsieur').then(setImages);
  }, [source]);

  const frames = useMemo(() => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    return FRAME_LAYOUT.map((frame, i) => ({
      ...frame,
      photo: shuffled[i % shuffled.length],
    }));
  }, [images]);

  return (
    <div className="salon-album">
      <h2>Auteur Monsieur</h2>
      <div className="controls">
        <label htmlFor="zoom">Zoom</label>
        <input
          id="zoom"
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
      </div>
      <div className="salon-scroll">
        <div className="salon-wall" style={{ transform: `scale(${scale})` }}>
          {frames.map((f, idx) => (
            <div
              key={`${f.src}-${idx}`}
              className="frame"
              style={{
                width: f.w,
                height: f.h,
                left: f.x,
                top: f.y,
              }}
            >
              {f.photo && (
                <img
                  className="photo"
                  src={f.photo.src}
                  alt={f.photo.caption}
                />
              )}
              <img className="border" src={f.src} alt="decorative frame" />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .salon-album { padding: 1rem; }
        .controls { margin-bottom: 1rem; }
        .salon-scroll {
          overflow: auto;
          width: 100%;
          height: 80vh;
          background:
            var(--salon-bg, #6b2d3d);
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1), transparent 40%),
            repeating-linear-gradient(45deg, #7a1f33 0 25px, #8c263b 25px 50px);
        }
        .salon-wall {
          position: relative;
          width: 2000px;
          height: 1200px;
          transform-origin: 0 0;
        }
        .frame {
          position: absolute;
          --pad: 12%;
        }
        .frame .photo {
          position: absolute;
          top: var(--pad);
          left: var(--pad);
          width: calc(100% - 2 * var(--pad));
          height: calc(100% - 2 * var(--pad));
          object-fit: cover;
        }
        .frame .border {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

/** Frame layout definitions with fixed positions and dimensions */
const FRAME_LAYOUT = [
  { src: '/frames/frame1-min.png', w: 300, h: 400, x: 50, y: 60 },
  { src: '/frames/frame2-min.png', w: 220, h: 280, x: 400, y: 100 },
  { src: '/frames/frame3-min.png', w: 260, h: 260, x: 700, y: 40 },
  { src: '/frames/frame4-min.png', w: 320, h: 360, x: 1000, y: 200 },
  { src: '/frames/frame5-min.png', w: 240, h: 300, x: 1350, y: 80 },
  { src: '/frames/frame6-min.png', w: 280, h: 350, x: 1600, y: 260 },
];

