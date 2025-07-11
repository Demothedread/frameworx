const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args));
const router = express.Router();

/**
 * Route: POST /api/chatbot/ask
 * Body: { prompt, profile, apiKey?, model? }
 * Handles CourtListener, LegiScan, News, Fantasy (demos)
 */
// Main ask route with multi-provider support
const rateLimiter = require('../middleware/rateLimiter');
const validateInput = require('../middleware/validateInput');
router.post(
  '/ask',
  rateLimiter,
  validateInput({ prompt: { required:true, maxLen:2000 } }),
  async (req, res) => {
  const { prompt, profile, apiKey, model, provider } = req.body;
  try {
    if (provider === 'openai') {
      // ---- OPENAI GPT-3/4 ----
      if (!apiKey) return res.status(400).json({error:'API key required for OpenAI'});
      const result = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-3.5-turbo',
          messages: [{ role: "system", content: personaPrompt(profile) }, { role: "user", content: prompt }],
          temperature: profile==='fantasy'?0.98: 0.3
        })
      });
      const json = await result.json();
      if(json.error) throw new Error(json.error.message);
      return res.json({ bot: model, reply: json.choices[0].message.content });
    }
    if (provider === 'gemini') {
      // ---- GOOGLE GEMINI ----
      if (!apiKey) return res.status(400).json({error:'API key required for Gemini'});
      const geminiModel = model || 'gemini-pro';
      const result = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${personaPrompt(profile)}\n${prompt}` }] }
            ]
          })
        }
      );
      const json = await result.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      return res.json({ bot: model, reply: text });
    }
    if (provider === 'deepinfra') {
      // ---- DEEPINFRA (LLAMA2/COMMUNITY MODELS) ----
      if (!apiKey) return res.status(400).json({error:'API key required for DeepInfra'});
      const llamaModel = model || 'meta-llama/Llama-2-70b-chat-hf';
      const result = await fetch(`https://api.deepinfra.com/v1/inference/${llamaModel}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: `${personaPrompt(profile)}\n${prompt}` })
      });
      const json = await result.json();
      const reply = json.results?.[0]?.generated_text || json.generated_text || 'No response.';
      return res.json({ bot: llamaModel, reply });
    }
    // Demo legacy profiles
    if (profile === 'legal') { ... /* unchanged legacy legal demo code */ }
    if (profile === 'news') { ... /* unchanged legacy news demo */ }
    if (profile === 'fantasy') { ... /* unchanged legacy fantasy */ }
    // Default: Echo mode for any model/call
    return res.json({ bot: model || 'Default Model', reply: `AI says: ${prompt}` });
  } catch(e) {
    res.status(500).json({ error: e.toString() });
  }
});

function personaPrompt(profile) {
  if (profile === 'legal') return "You are a formal legal scholar, always cite precedent and write as in a legal brief.";
  if (profile === 'news') return "You are a headline news analyst; reference major sources and offer summary and trend insights.";
  if (profile === 'fantasy') return "You are an imaginative story assistant, always creative, never conventional, expressive as a bard.";
  return "You are a helpful AI assistant.";
}

function wrapFantasy(text) {
  // Send prompt through a maximal creativity pipe
  return `
${text ? (text[0].toUpperCase() + text.slice(1)) : 'Imagine a world…'}

Let your creative spark blaze through the infinite realms!
My advice as Fantasy Freeflow: ${fantasyAdvice(text)}
`;
}
function fantasyAdvice(q) {
  if(!q) return "Invent, create, and refuse the ordinary.";
  if(q.toLowerCase().includes('story')) return "Weave your narrative with bold magic, unexpected twists, and unbound imagination.";
  if(q.toLowerCase().includes('name')) return "Mix syllables wild and ancient: Zarion, Elysil, Brandrune!";
  return "Ask for anything—advice, visions, worlds.";
}

module.exports = router;
