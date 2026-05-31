/**
 * Centralized screen content repository.
 * Screens stay self-contained in behavior while pulling copy/media/metadata from one shared source.
 */
export const screenContentRepository = Object.freeze({
  admin: {
    heading: 'Admin Console',
    summary: 'Configure platform controls and moderation settings.',
  },
  atelier: {
    heading: 'Art Atelier',
    summary: 'Curate visuals and craft composition workflows.',
  },
  blog: {
    heading: 'Blog CMS',
    summary: 'Publish editorial content and long-form updates.',
  },
  chatbot: {
    heading: 'Chatbot',
    summary: 'Interact with assistants, retrieval, and guided prompts.',
  },
  gallery: {
    heading: 'Image Gallery',
    summary: 'Navigate themed albums and immersive media layouts.',
  },
  game: {
    heading: 'Arcade Scoreboard',
    summary: 'Play, submit scores, and track leaderboard progression.',
  },
  landing: {
    heading: 'Landing',
    summary: 'Welcome hub for orientation and channel discovery.',
  },
  livevideo: {
    heading: 'Live Video',
    summary: 'Stream sessions and monitor current live rooms.',
  },
  mindmap: {
    heading: 'Mind Map',
    summary: 'Explore entities and relationships through graph views.',
  },
  productivity: {
    heading: 'Productivity',
    summary: 'Run focused utility tools and automation helpers.',
  },
  threegame: {
    heading: 'Three.js Game',
    summary: 'Launch the 3D interactive gameplay environment.',
  },
  uploadandsort: {
    heading: 'Upload & Sort',
    summary: 'Ingest files and process them through sort pipelines.',
  },
});

export const getScreenContent = (screenKey) => {
  if (!screenKey) return null;
  return screenContentRepository[screenKey] || null;
};
