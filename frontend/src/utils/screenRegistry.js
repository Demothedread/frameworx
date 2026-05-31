import Admin from '../components/channels/Admin';
import Atelier from '../components/channels/Atelier';
import Blog from '../components/channels/Blog';
import Chatbot from '../components/channels/Chatbot';
import Gallery from '../components/channels/Gallery';
import Game from '../components/channels/Game';
import Landing from '../components/channels/Landing';
import LiveVideo from '../components/channels/LiveVideo';
import MindMap from '../components/channels/MindMap';
import Productivity from '../components/channels/Productivity';
import ThreeGame from '../components/channels/ThreeGame';
import UploadAndSort from '../components/channels/UploadAndSort';

import { getScreenContent } from '../content/screenContentRepository';

/**
 * Plug-and-play screen registry.
 * Each screen is self-contained and resolved from one centralized index.
 */
export const screenRegistry = [
  { key: 'admin', name: 'Admin', Component: Admin },
  { key: 'atelier', name: 'Art Atelier', Component: Atelier },
  { key: 'blog', name: 'Blog (CMS)', Component: Blog },
  { key: 'chatbot', name: 'Chatbot', Component: Chatbot },
  { key: 'gallery', name: 'Image Gallery', Component: Gallery },
  { key: 'game', name: 'Game (Sample)', Component: Game },
  { key: 'landing', name: 'Landing', Component: Landing },
  { key: 'livevideo', name: 'Live Video', Component: LiveVideo },
  { key: 'mindmap', name: 'Mind Map', Component: MindMap },
  { key: 'productivity', name: 'Productivity', Component: Productivity },
  { key: 'threegame', name: 'Three.js Game', Component: ThreeGame },
  { key: 'uploadandsort', name: 'Upload & Sort', Component: UploadAndSort },
].map((screen) => ({
  ...screen,
  content: getScreenContent(screen.key),
}));
