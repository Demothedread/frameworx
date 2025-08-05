/**
 * Fetch images for an album from a specified source.
 * Currently returns placeholders; integrations are TODO.
 * @param {'local'|'google'|'adobe'|'cdn'} [source='local']
 * @param {string} albumKey Identifier for the album.
 * @returns {Promise<Array<{src:string,caption:string}>>}
 */
export async function fetchAlbumImages(source = 'local', albumKey) {
  if (source !== 'local') {
    // TODO: integrate with external sources (Google, Adobe, CDN)
  }
  return Array.from({ length: 6 }, (_, i) => ({
    src: `https://via.placeholder.com/300?text=${encodeURIComponent(albumKey + ' ' + (i + 1))}`,
    caption: `${albumKey} ${i + 1}`
  }));
}
