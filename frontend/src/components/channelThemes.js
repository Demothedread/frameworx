/**
 * Channel-specific color themes for light and dark modes.
 * Light mode uses the primary color as background and the secondary for text.
 * Dark mode applies a black background with neon versions of the secondary
 * and tertiary colors for contrast.
 */
const channelThemes = {
  admin: {
    light: { primary: '#2F4F4F', secondary: '#FF7F50', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#FF4040', tertiary: '#FFDAB9' }
  },
  blog: {
    light: { primary: '#8A2BE2', secondary: '#00CED1', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#00FFFF', tertiary: '#E0FFFF' }
  },
  chatbot: {
    light: { primary: '#FF69B4', secondary: '#32CD32', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#39FF14', tertiary: '#ADFF2F' }
  },
  gallery: {
    light: { primary: '#007BA7', secondary: '#FFD700', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#FFFF33', tertiary: '#F5FF00' }
  },
  game: {
    light: { primary: '#4B0082', secondary: '#FF1493', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#FF10F0', tertiary: '#FF66FF' }
  },
  landing: {
    light: { primary: '#8E4585', secondary: '#7FFF00', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#ADFF2F', tertiary: '#DFFF00' }
  },
  livevideo: {
    light: { primary: '#006400', secondary: '#00FFFF', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#0FF0FC', tertiary: '#66FFFF' }
  },
  mindmap: {
    light: { primary: '#483D8B', secondary: '#F08080', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#FF5E5E', tertiary: '#FF9999' }
  },
  productivity: {
    light: { primary: '#2E8B57', secondary: '#FFA500', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#FF9F00', tertiary: '#FFB347' }
  },
  threegame: {
    light: { primary: '#1E90FF', secondary: '#FFDAB9', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#FFB380', tertiary: '#FFD1A9' }
  },
  uploadandsort: {
    light: { primary: '#800000', secondary: '#00FF7F', tertiary: '#FFFDD0' },
    dark: { primary: '#000000', secondary: '#00FF9F', tertiary: '#66FFB2' }
  }
};

export default channelThemes;

