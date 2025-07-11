import React, { useEffect, useState } from 'react';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(setPhotos);
  }, []);

  return (
    <section>
      <h2>Photo Gallery Channel</h2>
      <p style={{color:'#777'}}>Gallery fetches images from Express backend (<code>/images/</code>)</p>
      <div style={{display: 'flex', gap: 10}}>
        {photos.length ? photos.map((p, idx) => (
          <figure key={idx}>
            <img src={p.src} alt={p.caption} style={{width: '120px', border:'1px solid #999'}} />
            <figcaption>{p.caption}</figcaption>
          </figure>
        )) : <span style={{color:'#bbb'}}>No images provided in the backend; add your own images in <b>backend/images/</b>.</span>}
      </div>
      <div style={{marginTop:14, fontSize:'smaller', color:'#aaa'}}>
        (Extend: Add upload, slideshow, etc. See <b>Gallery.js</b>)
      </div>
    </section>
  );
}
// Extension: Add slideshow, zoom, or upload functionality.
