// Shared Types/Interfaces for posts, gallery, etc.
// Copy these into TS types or use as JSDoc for reference

/**
 * @typedef {Object} BlogPost
 * @property {number} id
 * @property {string} title
 * @property {string} summary
 * @property {string} content
 * @property {string} author
 * @property {string} date YYYY-MM-DD
 */

/**
 * @typedef {Object} GalleryPhoto
 * @property {string} src
 * @property {string} caption
 */

/**
 * @typedef {Object} ChannelDef
 * @property {string} key
 * @property {string} name
 * @property {React.ComponentType} Component
 */
