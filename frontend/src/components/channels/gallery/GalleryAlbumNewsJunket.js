import React, { useEffect, useState } from 'react';
import { fetchAlbumImages } from './GalleryData';

/**
 * News Junket album: newspaper-like layout.
 * @param {object} props
 * @param {string} [props.source]
 */
export default function GalleryAlbumNewsJunket({ source }) {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchAlbumImages(source, 'news-junket').then(setImages);
  }, [source]);
  return (
    <div className="news">
      <h2>The News Junket</h2>
      <div className="sheet">
        {images.map((img, i) => (
          <article key={i}>
            <img src={img.src} alt={img.caption} />
            <h3>{img.caption}</h3>
            <p>Lorem ipsum dolor sit amet.</p>
          </article>
        ))}
      </div>
      <style>{`
        .news { padding: 1rem; background: #fff; color: #000; }
        .sheet { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 1rem; }
        article { border: 1px solid #000; padding: 0.5rem; background: #fafafa; }
        article img { width: 100%; filter: grayscale(1); }
        article h3 { margin: 0.5rem 0; font-family: 'Times New Roman', serif; }
      `}</style>
    </div>
  );
}
