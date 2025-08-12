const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args));
const router = express.Router();
const WebScraper = require('../utils/webScraper');
const RAGService = require('../utils/ragService');

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
  const { prompt, profile, apiKey, model, provider, useRAG, vectorStoreType, openaiVectorStoreId, qdrantCollectionName, customInstructions } = req.body;
  try {
    // ---- RAG ENHANCEMENT ----
    let ragContext = '';
    let ragResults = null;
    
    if (useRAG && apiKey) {
      try {
        const ragService = new RAGService();
        const ragSearchResult = await ragService.performRAGSearch(prompt, {
          apiKey,
          vectorStoreType: vectorStoreType || 'uploadandsort',
          openaiVectorStoreId,
          qdrantCollectionName,
          limit: 5
        });
        
        ragResults = ragSearchResult.results;
        ragContext = ragService.buildContextFromResults(ragResults);
      } catch (ragError) {
        console.error('RAG search failed:', ragError);
        // Continue without RAG if it fails
      }
    }
    
    if (provider === 'openai') {
      // ---- OPENAI GPT-3/4 ----
      if (!apiKey) return res.status(400).json({error:'API key required for OpenAI'});
      
      // Build enhanced system prompt with custom instructions and RAG context
      let systemPrompt = personaPrompt(profile);
      
      if (customInstructions) {
        systemPrompt += `\n\nCustom Instructions: ${customInstructions}`;
      }
      
      if (ragContext) {
        systemPrompt += `\n\n${ragContext}`;
        systemPrompt += '\n\nPlease use the above context when relevant to answer the user\'s question. If the context doesn\'t contain relevant information, answer based on your training knowledge.';
      }
      
      const result = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o',
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
          temperature: profile==='fantasy'?0.98: 0.3
        })
      });
      const json = await result.json();
      if(json.error) throw new Error(json.error.message);
      return res.json({
        bot: model,
        reply: json.choices[0].message.content,
        ragResults,
        usedRAG: !!ragContext
      });
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
    // Demo legacy profiles (stub implementations)
    if (profile === 'legal') {
      // Enhanced Legal Scholar with CourtListener search
      try {
        const scraper = new WebScraper();
        
        // Check for cached results first
        let searchResults = await scraper.getCachedResults(prompt, 'courtlistener');
        
        if (!searchResults) {
          // Perform fresh search
          searchResults = await scraper.searchCourtListener(prompt, 5);
          
          // Cache the results
          if (searchResults.length > 0) {
            await scraper.cacheResults(prompt, searchResults, 'courtlistener');
          }
        }
        
        let reply = `As a Legal Scholar, I've researched "${prompt}" and found the following relevant legal precedents:\n\n`;
        
        if (searchResults.length > 0) {
          searchResults.forEach((result, index) => {
            reply += `${index + 1}. **${result.title}**\n`;
            reply += `   Court: ${result.court}\n`;
            reply += `   Date: ${result.date}\n`;
            reply += `   Summary: ${result.snippet}\n`;
            reply += `   [Read Full Opinion](${result.url})\n\n`;
          });
          
          reply += `These cases provide relevant legal precedents for your query. Each opinion contains detailed legal reasoning that may be applicable to your research.`;
        } else {
          reply += `I was unable to find specific legal precedents for "${prompt}" in the CourtListener database. This could be due to the specificity of your query or current database limitations. I recommend refining your search terms or consulting additional legal databases.`;
        }
        
        return res.json({
          bot: 'Legal Scholar',
          reply,
          searchResults,
          source: searchResults.length > 0 ? searchResults[0] : null
        });
      } catch (error) {
        console.error('Legal search error:', error);
        return res.json({
          bot: 'Legal Scholar',
          reply: `I encountered an error while searching legal databases for "${prompt}". As a Legal Scholar, I can still provide general analysis, but I recommend checking CourtListener directly for the most current legal precedents.`
        });
      }
    }
    }
    if (profile === 'news') {
      // Stub: simple news-style response with dummy source
      return res.json({
        bot: 'Newspaper',
        reply: `News Headline: "${prompt}". More details forthcoming.`,
        source: [{ title: 'Demo News Source' }]
      });
    }
    if (profile === 'fantasy') {
      // Stub: creative fantasy-style response
      const adventure = wrapFantasy(prompt);
      return res.json({
        bot: 'Fantasy Freeflow',
        reply: adventure
      });
    }
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

// New endpoint for web search functionality
router.post('/search', rateLimiter, validateInput({ query: { required: true, maxLen: 500 } }), async (req, res) => {
  const { query, sources = ['courtlistener'], limit = 5 } = req.body;
  
  try {
    const scraper = new WebScraper();
    
    // Check cache first
    let cachedResults = null;
    for (const source of sources) {
      const cached = await scraper.getCachedResults(query, source);
      if (cached && cached.length > 0) {
        cachedResults = cached;
        break;
      }
    }
    
    if (cachedResults) {
      return res.json({
        query,
        results: cachedResults,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }
    
    // Perform fresh search
    const results = await scraper.searchLegalDatabases(query, sources, limit);
    
    // Cache results if any found
    if (results.length > 0) {
      await scraper.cacheResults(query, results, sources.join(','));
    }
    
    res.json({
      query,
      results,
      cached: false,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Web search error:', error);
    res.status(500).json({
      error: 'Web search failed',
      message: error.message,
      query
    });
  }
});

// RAG search endpoint
router.post('/rag', rateLimiter, validateInput({ query: { required: true, maxLen: 500 } }), async (req, res) => {
  const { query, vectorStoreType = 'uploadandsort', openaiVectorStoreId, qdrantCollectionName, apiKey, limit = 5 } = req.body;
  
  try {
    if (!apiKey) {
      return res.status(400).json({ error: 'API key required for RAG operations' });
    }
    
    const ragService = new RAGService();
    const ragResults = await ragService.performRAGSearch(query, {
      apiKey,
      vectorStoreType,
      openaiVectorStoreId,
      qdrantCollectionName,
      limit
    });
    
    const context = ragService.buildContextFromResults(ragResults.results);
    
    res.json({
      query,
      vectorStoreType,
      results: ragResults.results,
      context,
      resultCount: ragResults.resultCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('RAG search error:', error);
    res.status(500).json({
      error: 'RAG search failed',
      message: error.message,
      query
    });
  }
});

// Endpoint to get detailed opinion content
router.get('/opinion/:id', rateLimiter, async (req, res) => {
  const { id } = req.params;
  const opinionUrl = decodeURIComponent(id);
  
  try {
    const scraper = new WebScraper();
    const opinionDetails = await scraper.getOpinionDetails(opinionUrl);
    
    res.json({
      success: true,
      opinion: opinionDetails,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Opinion fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch opinion details',
      message: error.message,
      url: opinionUrl
    });
  }
});

module.exports = router;
