import React, { useEffect, useState } from 'react';
import { fetchAlbumImages } from './GalleryData';

/**
 * Sporting Sort album: grid reminiscent of a scoreboard.
 * @param {object} props
 * @param {string} [props.source] Image source identifier.
 */
export default function GalleryAlbumSportingSort({ source }) {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchAlbumImages(source, 'sporting-sort').then(setImages);
  }, [source]);

  return (
    <div className="sporting-sort">
      <h2 className="scoreboard">Sporting Sort</h2>
      <div className="grid">
        {images.map((img, i) => (
          <figure key={i}>
            <img src={img.src} alt={img.caption} />
            <figcaption>{img.caption}</figcaption>
          </figure>
        ))}
      </div>
      <style>{`
        .sporting-sort { text-align: center; padding: 1rem; }
        .scoreboard { font-family: 'Courier New', monospace; border-bottom: 4px double #444; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
        .grid img { width: 100%; border: 4px solid #444; }
      `}</style>
    </div>
  );
}
