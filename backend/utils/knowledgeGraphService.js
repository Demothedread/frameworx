const { Client } = require('pg');

/**
 * Knowledge Graph Service
 * Manages knowledge graph operations using Neon database
 * Features:
 * - Auto-updating knowledge graph from content
 * - Relationship discovery and mapping
 * - Node embeddings and similarity search
 * - Graph traversal and path finding
 * - Content recommendation based on graph structure
 * - Real-time graph updates from user interactions
 */

class KnowledgeGraphService {
  constructor() {
    this.connectionString = process.env.NEON_DATABASE_URL;
    this.embeddingModel = 'text-embedding-ada-002';
    
    // Node types supported in the knowledge graph
    this.nodeTypes = {
      BLOG_POST: 'blog_post',
      CATEGORY: 'category',
      TAG: 'tag',
      AUTHOR: 'author',
      GAME: 'game',
      PLAYER: 'player',
      ACHIEVEMENT: 'achievement',
      SPORTS_TEAM: 'sports_team',
      SPORTS_PLAYER: 'sports_player',
      CHAT_CONVERSATION: 'chat_conversation',
      DOCUMENT: 'document',
      CONCEPT: 'concept'
    };
    
    // Relationship types for the knowledge graph
    this.relationshipTypes = {
      AUTHORED_BY: 'authored_by',
      CATEGORIZED_AS: 'categorized_as',
      TAGGED_WITH: 'tagged_with',
      RELATED_TO: 'related_to',
      PART_OF: 'part_of',
      SIMILAR_TO: 'similar_to',
      PLAYED_BY: 'played_by',
      ACHIEVED_BY: 'achieved_by',
      COMPETES_IN: 'competes_in',
      MENTIONS: 'mentions',
      REFERENCES: 'references',
      FOLLOWS: 'follows',
      INTERACTS_WITH: 'interacts_with'
    };
  }

  /**
   * Initialize or update a knowledge node
   * @param {Object} nodeData - Node data including type, name, properties
   * @param {Array} embedding - Optional embedding vector
   * @returns {Promise<Object>} Created or updated node
   */
  async upsertNode(nodeData, embedding = null) {
    if (!this.connectionString) {
      throw new Error('Database connection not configured');
    }

    const client = new Client({ connectionString: this.connectionString });
    
    try {
      await client.connect();
      
      const { type, name, properties = {} } = nodeData;
      
      // Generate embedding if not provided
      let embeddingVector = embedding;
      if (!embeddingVector && process.env.OPENAI_API_KEY) {
        embeddingVector = await this.generateEmbedding(name + ' ' + JSON.stringify(properties));
      }
      
      const query = `
        INSERT INTO frameworx.knowledge_nodes (node_type, name, properties, embedding)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (node_type, name) 
        DO UPDATE SET 
          properties = $3,
          embedding = $4,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      
      const result = await client.query(query, [
        type,
        name,
        JSON.stringify(properties),
        embeddingVector ? JSON.stringify(embeddingVector) : null
      ]);
      
      return result.rows[0];
      
    } finally {
      await client.end();
    }
  }

  /**
   * Create or update a relationship between nodes
   * @param {number} fromNodeId - Source node ID
   * @param {number} toNodeId - Target node ID
   * @param {string} relationshipType - Type of relationship
   * @param {Object} properties - Additional relationship properties
   * @param {number} weight - Relationship strength (0-1)
   * @returns {Promise<Object>} Created or updated relationship
   */
  async upsertRelationship(fromNodeId, toNodeId, relationshipType, properties = {}, weight = 1.0) {
    if (!this.connectionString) {
      throw new Error('Database connection not configured');
    }

    const client = new Client({ connectionString: this.connectionString });
    
    try {
      await client.connect();
      
      const query = `
        INSERT INTO frameworx.knowledge_relationships (from_node_id, to_node_id, relationship_type, properties, weight)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (from_node_id, to_node_id, relationship_type)
        DO UPDATE SET 
          properties = $4,
          weight = $5,
          created_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
      
      const result = await client.query(query, [
        fromNodeId,
        toNodeId,
        relationshipType,
        JSON.stringify(properties),
        weight
      ]);
      
      return result.rows[0];
      
    } finally {
      await client.end();
    }
  }

  /**
   * Process blog post and create/update knowledge graph nodes and relationships
   * @param {Object} blogPost - Blog post data
   * @returns {Promise<Object>} Knowledge graph update summary
   */
  async processBlogPost(blogPost) {
    const updates = {
      nodes: [],
      relationships: [],
      concepts: []
    };

    try {
      // Create blog post node
      const postNode = await this.upsertNode({
        type: this.nodeTypes.BLOG_POST,
        name: blogPost.slug,
        properties: {
          title: blogPost.title,
          summary: blogPost.summary,
          content: blogPost.content,
          publishedAt: blogPost.publishedAt,
          readingTime: blogPost.readingTime,
          status: blogPost.status
        }
      });
      updates.nodes.push(postNode);

      // Create author node
      if (blogPost.author) {
        const authorNode = await this.upsertNode({
          type: this.nodeTypes.AUTHOR,
          name: blogPost.author.name,
          properties: {
            bio: blogPost.author.bio,
            avatar: blogPost.author.avatar
          }
        });
        updates.nodes.push(authorNode);

        // Create authorship relationship
        const authorshipRel = await this.upsertRelationship(
          postNode.id,
          authorNode.id,
          this.relationshipTypes.AUTHORED_BY,
          {},
          1.0
        );
        updates.relationships.push(authorshipRel);
      }

      // Create category node and relationship
      if (blogPost.category) {
        const categoryNode = await this.upsertNode({
          type: this.nodeTypes.CATEGORY,
          name: blogPost.category,
          properties: { type: 'blog_category' }
        });
        updates.nodes.push(categoryNode);

        const categoryRel = await this.upsertRelationship(
          postNode.id,
          categoryNode.id,
          this.relationshipTypes.CATEGORIZED_AS,
          {},
          1.0
        );
        updates.relationships.push(categoryRel);
      }

      // Create tag nodes and relationships
      if (blogPost.tags && blogPost.tags.length > 0) {
        for (const tag of blogPost.tags) {
          const tagNode = await this.upsertNode({
            type: this.nodeTypes.TAG,
            name: tag,
            properties: { type: 'blog_tag' }
          });
          updates.nodes.push(tagNode);

          const tagRel = await this.upsertRelationship(
            postNode.id,
            tagNode.id,
            this.relationshipTypes.TAGGED_WITH,
            {},
            0.8
          );
          updates.relationships.push(tagRel);
        }
      }

      // Extract and create concept nodes from content
      const concepts = await this.extractConcepts(blogPost.content);
      for (const concept of concepts) {
        const conceptNode = await this.upsertNode({
          type: this.nodeTypes.CONCEPT,
          name: concept.name,
          properties: {
            confidence: concept.confidence,
            context: concept.context
          }
        });
        updates.concepts.push(conceptNode);

        const conceptRel = await this.upsertRelationship(
          postNode.id,
          conceptNode.id,
          this.relationshipTypes.MENTIONS,
          { confidence: concept.confidence },
          concept.confidence
        );
        updates.relationships.push(conceptRel);
      }

      // Find and create similarity relationships with other posts
      await this.createSimilarityRelationships(postNode);

      return updates;

    } catch (error) {
      console.error('Error processing blog post for knowledge graph:', error);
      throw error;
    }
  }

  /**
   * Process game session and update knowledge graph
   * @param {Object} gameSession - Game session data
   * @returns {Promise<Object>} Knowledge graph update summary
   */
  async processGameSession(gameSession) {
    const updates = { nodes: [], relationships: [] };

    try {
      // Create game node
      const gameNode = await this.upsertNode({
        type: this.nodeTypes.GAME,
        name: gameSession.gameType,
        properties: {
          category: 'game',
          difficulty: gameSession.difficulty || 'medium'
        }
      });
      updates.nodes.push(gameNode);

      // Create player node
      const playerNode = await this.upsertNode({
        type: this.nodeTypes.PLAYER,
        name: gameSession.userId,
        properties: {
          level: gameSession.playerLevel || 1,
          totalScore: gameSession.totalScore || 0
        }
      });
      updates.nodes.push(playerNode);

      // Create play relationship
      const playRel = await this.upsertRelationship(
        playerNode.id,
        gameNode.id,
        this.relationshipTypes.PLAYED_BY,
        {
          score: gameSession.score,
          level: gameSession.levelReached,
          timePlayedSeconds: gameSession.timePlayedSeconds,
          completedAt: gameSession.completedAt
        },
        Math.min(gameSession.score / 1000, 1.0) // Normalize score to weight
      );
      updates.relationships.push(playRel);

      // Process achievements
      if (gameSession.achievements) {
        for (const achievementId of gameSession.achievements) {
          const achievementNode = await this.upsertNode({
            type: this.nodeTypes.ACHIEVEMENT,
            name: achievementId,
            properties: { gameType: gameSession.gameType }
          });
          updates.nodes.push(achievementNode);

          const achievementRel = await this.upsertRelationship(
            playerNode.id,
            achievementNode.id,
            this.relationshipTypes.ACHIEVED_BY,
            { unlockedAt: new Date().toISOString() },
            1.0
          );
          updates.relationships.push(achievementRel);
        }
      }

      return updates;

    } catch (error) {
      console.error('Error processing game session for knowledge graph:', error);
      throw error;
    }
  }

  /**
   * Process sports data and create knowledge graph entries
   * @param {Object} sportsData - Sports data from APIs
   * @returns {Promise<Object>} Knowledge graph update summary
   */
  async processSportsData(sportsData) {
    const updates = { nodes: [], relationships: [] };

    try {
      if (sportsData.nfl) {
        for (const game of sportsData.nfl) {
          // Create team nodes
          const homeTeamNode = await this.upsertNode({
            type: this.nodeTypes.SPORTS_TEAM,
            name: game.homeTeam.name,
            properties: {
              sport: 'NFL',
              abbreviation: game.homeTeam.abbreviation,
              logo: game.homeTeam.logo
            }
          });
          updates.nodes.push(homeTeamNode);

          const awayTeamNode = await this.upsertNode({
            type: this.nodeTypes.SPORTS_TEAM,
            name: game.awayTeam.name,
            properties: {
              sport: 'NFL',
              abbreviation: game.awayTeam.abbreviation,
              logo: game.awayTeam.logo
            }
          });
          updates.nodes.push(awayTeamNode);

          // Create competition relationship
          const competitionRel = await this.upsertRelationship(
            homeTeamNode.id,
            awayTeamNode.id,
            this.relationshipTypes.COMPETES_IN,
            {
              gameId: game.id,
              homeScore: game.homeTeam.score,
              awayScore: game.awayTeam.score,
              status: game.status,
              startTime: game.startTime,
              venue: game.venue
            },
            0.9
          );
          updates.relationships.push(competitionRel);
        }
      }

      // Similar processing for NBA and MLB data...
      
      return updates;

    } catch (error) {
      console.error('Error processing sports data for knowledge graph:', error);
      throw error;
    }
  }

  /**
   * Process chat conversation and extract knowledge
   * @param {Object} conversation - Chat conversation data
   * @returns {Promise<Object>} Knowledge graph update summary
   */
  async processChatConversation(conversation) {
    const updates = { nodes: [], relationships: [], concepts: [] };

    try {
      // Create conversation node
      const conversationNode = await this.upsertNode({
        type: this.nodeTypes.CHAT_CONVERSATION,
        name: `conversation_${conversation.id}`,
        properties: {
          title: conversation.title,
          profile: conversation.profile,
          provider: conversation.provider,
          model: conversation.model,
          createdAt: conversation.createdAt
        }
      });
      updates.nodes.push(conversationNode);

      // Extract concepts from conversation content
      const fullContent = conversation.messages
        .map(msg => msg.content)
        .join(' ');
      
      const concepts = await this.extractConcepts(fullContent);
      for (const concept of concepts) {
        const conceptNode = await this.upsertNode({
          type: this.nodeTypes.CONCEPT,
          name: concept.name,
          properties: {
            confidence: concept.confidence,
            context: 'chat_conversation'
          }
        });
        updates.concepts.push(conceptNode);

        const conceptRel = await this.upsertRelationship(
          conversationNode.id,
          conceptNode.id,
          this.relationshipTypes.MENTIONS,
          { confidence: concept.confidence },
          concept.confidence
        );
        updates.relationships.push(conceptRel);
      }

      return updates;

    } catch (error) {
      console.error('Error processing chat conversation for knowledge graph:', error);
      throw error;
    }
  }

  /**
   * Generate embedding for text using OpenAI
   * @param {string} text - Text to embed
   * @returns {Promise<Array>} Embedding vector
   */
  async generateEmbedding(text) {
    if (!process.env.OPENAI_API_KEY) {
      return null;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: text.slice(0, 8000), // Limit text length
          model: this.embeddingModel
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0].embedding;

    } catch (error) {
      console.error('Error generating embedding:', error);
      return null;
    }
  }

  /**
   * Extract concepts from text using simple keyword extraction
   * @param {string} text - Text to analyze
   * @returns {Promise<Array>} Array of concept objects
   */
  async extractConcepts(text) {
    // Simple concept extraction - in production, use NLP libraries or APIs
    const concepts = [];
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordCounts = {};
    
    // Count word frequencies
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    // Extract top concepts
    const sortedWords = Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    for (const [word, count] of sortedWords) {
      if (count >= 2) { // Minimum frequency threshold
        concepts.push({
          name: word,
          confidence: Math.min(count / 10, 1.0),
          context: text.slice(0, 100) + '...'
        });
      }
    }
    
    return concepts;
  }

  /**
   * Create similarity relationships between nodes based on embeddings
   * @param {Object} targetNode - Node to find similarities for
   * @returns {Promise<Array>} Created similarity relationships
   */
  async createSimilarityRelationships(targetNode) {
    if (!targetNode.embedding || !this.connectionString) {
      return [];
    }

    const client = new Client({ connectionString: this.connectionString });
    const relationships = [];
    
    try {
      await client.connect();
      
      // Find similar nodes using cosine similarity
      const query = `
        SELECT id, name, node_type, 
               1 - (embedding <=> $1::vector) as similarity
        FROM frameworx.knowledge_nodes
        WHERE id != $2 
          AND node_type = $3
          AND embedding IS NOT NULL
        ORDER BY embedding <=> $1::vector
        LIMIT 5
      `;
      
      const result = await client.query(query, [
        JSON.stringify(targetNode.embedding),
        targetNode.id,
        targetNode.node_type
      ]);
      
      for (const similarNode of result.rows) {
        if (similarNode.similarity > 0.7) { // Similarity threshold
          const relationship = await this.upsertRelationship(
            targetNode.id,
            similarNode.id,
            this.relationshipTypes.SIMILAR_TO,
            { similarity: similarNode.similarity },
            similarNode.similarity
          );
          relationships.push(relationship);
        }
      }
      
    } finally {
      await client.end();
    }
    
    return relationships;
  }

  /**
   * Get related nodes for a given node
   * @param {number} nodeId - Node ID to find relations for
   * @param {number} depth - Maximum traversal depth
   * @param {Array} relationshipTypes - Types of relationships to follow
   * @returns {Promise<Object>} Related nodes and their relationships
   */
  async getRelatedNodes(nodeId, depth = 2, relationshipTypes = null) {
    if (!this.connectionString) {
      throw new Error('Database connection not configured');
    }

    const client = new Client({ connectionString: this.connectionString });
    
    try {
      await client.connect();
      
      let whereClause = '';
      const params = [nodeId, depth];
      
      if (relationshipTypes && relationshipTypes.length > 0) {
        whereClause = 'AND r.relationship_type = ANY($3)';
        params.push(relationshipTypes);
      }
      
      const query = `
        WITH RECURSIVE related_nodes AS (
          SELECT n.*, 0 as depth, ARRAY[n.id] as path
          FROM frameworx.knowledge_nodes n
          WHERE n.id = $1
          
          UNION
          
          SELECT n.*, rn.depth + 1, rn.path || n.id
          FROM frameworx.knowledge_nodes n
          JOIN frameworx.knowledge_relationships r ON (n.id = r.to_node_id OR n.id = r.from_node_id)
          JOIN related_nodes rn ON (
            (r.from_node_id = rn.id AND n.id = r.to_node_id) OR
            (r.to_node_id = rn.id AND n.id = r.from_node_id)
          )
          WHERE rn.depth < $2
            AND NOT (n.id = ANY(rn.path))
            ${whereClause}
        )
        SELECT DISTINCT rn.*, 
               array_agg(DISTINCT jsonb_build_object(
                 'id', r.id,
                 'type', r.relationship_type,
                 'weight', r.weight,
                 'properties', r.properties
               )) as relationships
        FROM related_nodes rn
        LEFT JOIN frameworx.knowledge_relationships r ON (
          r.from_node_id = rn.id OR r.to_node_id = rn.id
        )
        GROUP BY rn.id, rn.node_type, rn.name, rn.properties, rn.embedding, rn.created_at, rn.updated_at, rn.depth, rn.path
        ORDER BY rn.depth, rn.created_at
      `;
      
      const result = await client.query(query, params);
      
      return {
        nodes: result.rows,
        totalCount: result.rows.length
      };
      
    } finally {
      await client.end();
    }
  }

  /**
   * Get content recommendations based on knowledge graph
   * @param {string} nodeType - Type of content to recommend
   * @param {Object} userContext - User context and preferences
   * @param {number} limit - Number of recommendations
   * @returns {Promise<Array>} Recommended content
   */
  async getRecommendations(nodeType, userContext = {}, limit = 10) {
    if (!this.connectionString) {
      throw new Error('Database connection not configured');
    }

    const client = new Client({ connectionString: this.connectionString });
    
    try {
      await client.connect();
      
      // Complex recommendation query based on user interactions and graph structure
      const query = `
        SELECT n.*, 
               COUNT(r.id) as connection_strength,
               AVG(r.weight) as avg_weight
        FROM frameworx.knowledge_nodes n
        JOIN frameworx.knowledge_relationships r ON (n.id = r.from_node_id OR n.id = r.to_node_id)
        WHERE n.node_type = $1
        GROUP BY n.id, n.node_type, n.name, n.properties, n.embedding, n.created_at, n.updated_at
        ORDER BY connection_strength DESC, avg_weight DESC
        LIMIT $2
      `;
      
      const result = await client.query(query, [nodeType, limit]);
      
      return result.rows;
      
    } finally {
      await client.end();
    }
  }

  /**
   * Update knowledge graph from all system events
   * @param {Object} event - System event data
   * @returns {Promise<Object>} Update summary
   */
  async processSystemEvent(event) {
    const { type, data } = event;
    
    try {
      switch (type) {
        case 'blog_post_created':
        case 'blog_post_updated':
          return await this.processBlogPost(data);
          
        case 'game_session_completed':
          return await this.processGameSession(data);
          
        case 'sports_data_updated':
          return await this.processSportsData(data);
          
        case 'chat_conversation_created':
          return await this.processChatConversation(data);
          
        default:
          console.log(`Unknown event type for knowledge graph: ${type}`);
          return { nodes: [], relationships: [], concepts: [] };
      }
    } catch (error) {
      console.error('Error processing system event:', error);
      throw error;
    }
  }

  /**
   * Get knowledge graph statistics
   * @returns {Promise<Object>} Graph statistics
   */
  async getGraphStatistics() {
    if (!this.connectionString) {
      throw new Error('Database connection not configured');
    }

    const client = new Client({ connectionString: this.connectionString });
    
    try {
      await client.connect();
      
      const nodeStatsQuery = `
        SELECT node_type, COUNT(*) as count
        FROM frameworx.knowledge_nodes
        GROUP BY node_type
        ORDER BY count DESC
      `;
      
      const relationshipStatsQuery = `
        SELECT relationship_type, COUNT(*) as count, AVG(weight) as avg_weight
        FROM frameworx.knowledge_relationships
        GROUP BY relationship_type
        ORDER BY count DESC
      `;
      
      const [nodeStats, relationshipStats] = await Promise.all([
        client.query(nodeStatsQuery),
        client.query(relationshipStatsQuery)
      ]);
      
      return {
        nodes: {
          total: nodeStats.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
          byType: nodeStats.rows
        },
        relationships: {
          total: relationshipStats.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
          byType: relationshipStats.rows
        },
        lastUpdated: new Date().toISOString()
      };
      
    } finally {
      await client.end();
    }
  }
}

module.exports = KnowledgeGraphService;