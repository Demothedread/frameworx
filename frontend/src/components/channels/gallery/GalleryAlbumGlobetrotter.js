import React, { useEffect, useState } from 'react';
import { fetchAlbumImages } from './GalleryData';

/**
 * Globetrotter album: horizontal travel reel.
 * @param {object} props
 * @param {string} [props.source]
 */
export default function GalleryAlbumGlobetrotter({ source }) {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchAlbumImages(source, 'globetrotter').then(setImages);
  }, [source]);
  return (
    <div className="globetrotter">
      <h2>Globetrotter</h2>
      <div className="reel">
        {images.map((img, i) => (
          <img key={i} src={img.src} alt={img.caption} />
        ))}
      </div>
      <style>{`
        .globetrotter { padding: 1rem; }
        .reel { display: flex; overflow-x: auto; gap: 1rem; }
        .reel img { flex: 0 0 auto; width: 300px; border: 6px solid #006; }
      `}</style>
    </div>
  );
}
