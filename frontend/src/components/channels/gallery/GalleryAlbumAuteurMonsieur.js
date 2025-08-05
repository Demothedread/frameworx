import React, { useEffect, useState } from 'react';
import { fetchAlbumImages } from './GalleryData';

/**
 * Auteur Monsieur album: salon-style stacked frames.
 * @param {object} props
 * @param {string} [props.source]
 */
export default function GalleryAlbumAuteurMonsieur({ source }) {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchAlbumImages(source, 'auteur-monsieur').then(setImages);
  }, [source]);
  return (
    <div className="auteur">
      <h2>Auteur Monsieur</h2>
      <div className="wall">
        {images.map((img, i) => (
          <img key={i} src={img.src} alt={img.caption} />
        ))}
      </div>
      <style>{`
        .auteur { padding: 1rem; background: #fbe; }
        .wall { column-count: 3; column-gap: 0; }
        .wall img { width: 100%; margin: 0 0 1rem; border: 8px double #800; box-shadow: 4px 4px 0 rgba(0,0,0,0.3); }
      `}</style>
    </div>
  );
}
