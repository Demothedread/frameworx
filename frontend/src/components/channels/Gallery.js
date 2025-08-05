import React, { useState } from 'react';
import GalleryHome from './gallery/GalleryHome';
import GalleryAlbumSportingSort from './gallery/GalleryAlbumSportingSort';
import GalleryAlbumGlobetrotter from './gallery/GalleryAlbumGlobetrotter';
import GalleryAlbumAuteurMonsieur from './gallery/GalleryAlbumAuteurMonsieur';
import GalleryAlbumNewsJunket from './gallery/GalleryAlbumNewsJunket';

/**
 * Gallery channel root: displays album tiles and opens album subroutes.
 */
export default function Gallery() {
  const [active, setActive] = useState(null);
  const [source] = useState('local'); // default image source

  const albums = [
    { key: 'sporting-sort', name: 'Sporting Sort', color: '#e53935', preview: 'https://via.placeholder.com/400/ff4444' },
    { key: 'globetrotter', name: 'Globetrotter', color: '#43a047', preview: 'https://via.placeholder.com/400/44ff44' },
    { key: 'auteur-monsieur', name: 'Auteur Monsieur', color: '#1e88e5', preview: 'https://via.placeholder.com/400/4444ff' },
    { key: 'news-junket', name: 'The News Junket', color: '#fdd835', preview: 'https://via.placeholder.com/400/ffff44' }
  ];

  const albumComponents = {
    'sporting-sort': GalleryAlbumSportingSort,
    globetrotter: GalleryAlbumGlobetrotter,
    'auteur-monsieur': GalleryAlbumAuteurMonsieur,
    'news-junket': GalleryAlbumNewsJunket
  };

  const Album = active ? albumComponents[active] : null;

  return (
    <section>
      {Album ? (
        <div>
          <button onClick={() => setActive(null)}>Back</button>
          <Album source={source} />
        </div>
      ) : (
        <GalleryHome albums={albums} onOpen={setActive} />
      )}
    </section>
  );
}
