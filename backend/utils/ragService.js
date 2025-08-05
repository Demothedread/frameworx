const { Client } = require('pg');

/**
 * RAG (Retrieval-Augmented Generation) Service
 * Connects chatbot to vector stores for enhanced context-aware responses
 */

class RAGService {
  constructor() {
    this.connectionString = process.env.NEON_DATABASE_URL;
  }

  /**
   * Search local vector embeddings in Neon database
   * @param {Array} queryEmbedding - Query embedding vector
   * @param {number} limit - Number of results to return
   * @param {string} contentType - Filter by content type
   * @returns {Promise<Array>} Similar documents
   */
  async searchLocalVectors(queryEmbedding, limit = 5, contentType = null) {
    if (!this.connectionString) {
      throw new Error('Neon database connection not configured');
    }

    const client = new Client({ connectionString: this.connectionString });
    
    try {
      await client.connect();
      
      let query = `
        SELECT 
          content_id,
          content_type,
          filename,
          content_text,
          summary,
          metadata,
          1 - (embedding <=> $1::vector) as similarity
        FROM frameworx.vector_embeddings
      `;
      
      const params = [JSON.stringify(queryEmbedding)];
      
      if (contentType) {
        query += ' WHERE content_type = $2';
        params.push(contentType);
      }
      
      query += ' ORDER BY embedding <=> $1::vector LIMIT $' + (params.length + 1);
      params.push(limit);
      
      const result = await client.query(query, params);
      return result.rows;
      
    } finally {
      await client.end();
    }
  }

  /**
   * Search existing UploadAndSort vector store
   * @param {Array} queryVector - Query embedding vector
   * @param {number} k - Number of results
   * @returns {Promise<Array>} Similar documents from UploadAndSort
   */
  async searchUploadAndSortVectors(queryVector, k = 5) {
    try {
      // Use the existing vector search endpoint from UploadAndSort
      const response = await fetch('/api/uploadandsort/vquery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vector: queryVector, k })
      });
      
      if (!response.ok) {
        throw new Error(`Vector search failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results || [];
      
    } catch (error) {
      console.error('UploadAndSort vector search error:', error);
      return [];
    }
  }

  /**
   * Generate embedding for query text using OpenAI
   * @param {string} text - Text to embed
   * @param {string} apiKey - OpenAI API key
   * @returns {Promise<Array>} Embedding vector
   */
  async generateEmbedding(text, apiKey) {
    if (!apiKey) {
      throw new Error('OpenAI API key required for embeddings');
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI embedding failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  }

  /**
   * Search OpenAI vector store
   * @param {string} vectorStoreId - OpenAI vector store ID
   * @param {string} query - Search query
   * @param {string} apiKey - OpenAI API key
   * @param {number} limit - Number of results
   * @returns {Promise<Array>} Search results
   */
  async searchOpenAIVectorStore(vectorStoreId, query, apiKey, limit = 5) {
    if (!apiKey || !vectorStoreId) {
      throw new Error('OpenAI API key and vector store ID required');
    }

    try {
      // First, we need to create a thread and run with the vector store
      const response = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          tool_resources: {
            file_search: {
              vector_store_ids: [vectorStoreId]
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI thread creation failed: ${response.status}`);
      }

      const thread = await response.json();

      // Create a message in the thread
      const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: query
        })
      });

      if (!messageResponse.ok) {
        throw new Error(`OpenAI message creation failed: ${messageResponse.status}`);
      }

      const message = await messageResponse.json();

      // For now, return the search context - in a full implementation,
      // you'd run this with an assistant that has file_search enabled
      return [{
        content: `Vector store search for: ${query}`,
        source: 'OpenAI Vector Store',
        vector_store_id: vectorStoreId,
        thread_id: thread.id,
        message_id: message.id
      }];

    } catch (error) {
      console.error('OpenAI vector store search error:', error);
      throw error;
    }
  }

  /**
   * Search Qdrant collection
   * @param {string} collectionName - Qdrant collection name
   * @param {Array} queryVector - Query embedding vector
   * @param {number} limit - Number of results
   * @param {Object} qdrantConfig - Qdrant configuration
   * @returns {Promise<Array>} Search results
   */
  async searchQdrantCollection(collectionName, queryVector, limit = 5, qdrantConfig = {}) {
    const { host = 'localhost', port = 6333, apiKey } = qdrantConfig;
    const baseUrl = `http://${host}:${port}`;

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['api-key'] = apiKey;
      }

      const response = await fetch(`${baseUrl}/collections/${collectionName}/points/search`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          vector: queryVector,
          limit,
          with_payload: true,
          with_vectors: false
        })
      });

      if (!response.ok) {
        throw new Error(`Qdrant search failed: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];

    } catch (error) {
      console.error('Qdrant search error:', error);
      throw error;
    }
  }

  /**
   * Perform RAG search across multiple vector stores
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Combined search results
   */
  async performRAGSearch(query, options = {}) {
    const {
      apiKey,
      vectorStoreType = 'local', // 'local', 'openai', 'qdrant', 'uploadandsort'
      openaiVectorStoreId,
      qdrantCollectionName,
      qdrantConfig = {},
      limit = 5,
      contentType = null
    } = options;

    try {
      let results = [];
      let queryEmbedding = null;

      // Generate embedding if needed for vector searches
      if (['local', 'qdrant', 'uploadandsort'].includes(vectorStoreType) && apiKey) {
        queryEmbedding = await this.generateEmbedding(query, apiKey);
      }

      switch (vectorStoreType) {
        case 'local':
          if (queryEmbedding) {
            results = await this.searchLocalVectors(queryEmbedding, limit, contentType);
          }
          break;

        case 'openai':
          if (openaiVectorStoreId) {
            results = await this.searchOpenAIVectorStore(openaiVectorStoreId, query, apiKey, limit);
          }
          break;

        case 'qdrant':
          if (qdrantCollectionName && queryEmbedding) {
            results = await this.searchQdrantCollection(qdrantCollectionName, queryEmbedding, limit, qdrantConfig);
          }
          break;

        case 'uploadandsort':
          if (queryEmbedding) {
            results = await this.searchUploadAndSortVectors(queryEmbedding, limit);
          }
          break;

        default:
          throw new Error(`Unknown vector store type: ${vectorStoreType}`);
      }

      return {
        query,
        vectorStoreType,
        results,
        resultCount: results.length,
        embedding: queryEmbedding ? queryEmbedding.slice(0, 5) : null // First 5 dimensions for debugging
      };

    } catch (error) {
      console.error('RAG search error:', error);
      throw error;
    }
  }

  /**
   * Build context from RAG results for LLM prompt
   * @param {Array} ragResults - Results from RAG search
   * @param {number} maxLength - Maximum context length
   * @returns {string} Formatted context
   */
  buildContextFromResults(ragResults, maxLength = 2000) {
    if (!ragResults || ragResults.length === 0) {
      return '';
    }

    let context = 'Relevant context from knowledge base:\n\n';
    let currentLength = context.length;

    for (const result of ragResults) {
      let resultText = '';
      
      if (result.content_text) {
        resultText = result.content_text;
      } else if (result.summary) {
        resultText = result.summary;
      } else if (result.content) {
        resultText = result.content;
      } else if (result.payload && result.payload.text) {
        resultText = result.payload.text;
      }

      if (resultText) {
        const source = result.filename || result.source || 'Unknown';
        const snippet = `Source: ${source}\n${resultText.slice(0, 300)}...\n\n`;
        
        if (currentLength + snippet.length > maxLength) {
          break;
        }
        
        context += snippet;
        currentLength += snippet.length;
      }
    }

    return context;
  }
}

module.exports = RAGService;