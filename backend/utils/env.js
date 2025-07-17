function getEnv() {
  // Picks up environment variables for production (set through hosting or .env)
  return {
    APP_NAME: 'Channel Rolodex',
    // --- Feature toggles/AI integrations ---
    LLM_PROVIDER: process.env.LLM_PROVIDER || 'openai',  // 'openai','google','deepseek'
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    OPENAI_API_MODEL: process.env.OPENAI_API_MODEL || 'gpt-4o',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
    GOOGLE_VISION_REGION: process.env.GOOGLE_VISION_REGION || '',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
    // --- Vector store/RAG
    EMBEDDING_ENABLE: (process.env.EMBEDDING_ENABLE||'false') === 'true',
    // Feature flag sample:
    FEATURE_FLAG_CHATBOT: false,
  };
}
module.exports = { getEnv };
