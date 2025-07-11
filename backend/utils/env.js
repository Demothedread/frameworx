function getEnv() {
  // Add shared secrets, keys, etc.
  return {
    APP_NAME: 'Channel Rolodex',
    FEATURE_FLAG_CHATBOT: false,
  };
}
module.exports = { getEnv };
