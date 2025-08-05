const express = require('express');
const router = express.Router();
const KnowledgeGraphService = require('../utils/knowledgeGraphService');

/**
 * Knowledge Graph API Routes
 * Provides endpoints for knowledge graph operations, analytics, and recommendations
 */

const rateLimiter = require('../middleware/rateLimiter');

// Get knowledge graph statistics
router.get('/stats', rateLimiter, async (req, res) => {
  try {
    const kgService = new KnowledgeGraphService();
    const stats = await kgService.getGraphStatistics();
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Knowledge graph stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch knowledge graph statistics',
      message: error.message
    });
  }
});

// Get related nodes for a specific node
router.get('/nodes/:nodeId/related', rateLimiter, async (req, res) => {
  const { nodeId } = req.params;
  const { depth = 2, relationshipTypes } = req.query;
  
  try {
    const kgService = new KnowledgeGraphService();
    const relatedNodes = await kgService.getRelatedNodes(
      parseInt(nodeId), 
      parseInt(depth),
      relationshipTypes ? relationshipTypes.split(',') : null
    );
    
    res.json({
      success: true,
      nodeId: parseInt(nodeId),
      depth: parseInt(depth),
      data: relatedNodes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Related nodes fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch related nodes',
      message: error.message,
      nodeId
    });
  }
});

// Get content recommendations
router.get('/recommendations/:nodeType', rateLimiter, async (req, res) => {
  const { nodeType } = req.params;
  const { limit = 10, userContext } = req.query;
  
  try {
    const kgService = new KnowledgeGraphService();
    const recommendations = await kgService.getRecommendations(
      nodeType,
      userContext ? JSON.parse(userContext) : {},
      parseInt(limit)
    );
    
    res.json({
      success: true,
      nodeType,
      recommendations,
      count: recommendations.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Recommendations fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations',
      message: error.message,
      nodeType
    });
  }
});

// Process system event and update knowledge graph
router.post('/events', rateLimiter, async (req, res) => {
  const { type, data } = req.body;
  
  if (!type || !data) {
    return res.status(400).json({
      success: false,
      error: 'Event type and data are required'
    });
  }
  
  try {
    const kgService = new KnowledgeGraphService();
    const updateSummary = await kgService.processSystemEvent({ type, data });
    
    res.json({
      success: true,
      eventType: type,
      updateSummary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Knowledge graph event processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process knowledge graph event',
      message: error.message,
      eventType: type
    });
  }
});

// Create or update a node
router.post('/nodes', rateLimiter, async (req, res) => {
  const { nodeData, embedding } = req.body;
  
  if (!nodeData || !nodeData.type || !nodeData.name) {
    return res.status(400).json({
      success: false,
      error: 'Node data with type and name are required'
    });
  }
  
  try {
    const kgService = new KnowledgeGraphService();
    const node = await kgService.upsertNode(nodeData, embedding);
    
    res.json({
      success: true,
      node,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Node creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create/update node',
      message: error.message
    });
  }
});

// Create or update a relationship
router.post('/relationships', rateLimiter, async (req, res) => {
  const { fromNodeId, toNodeId, relationshipType, properties = {}, weight = 1.0 } = req.body;
  
  if (!fromNodeId || !toNodeId || !relationshipType) {
    return res.status(400).json({
      success: false,
      error: 'fromNodeId, toNodeId, and relationshipType are required'
    });
  }
  
  try {
    const kgService = new KnowledgeGraphService();
    const relationship = await kgService.upsertRelationship(
      fromNodeId,
      toNodeId,
      relationshipType,
      properties,
      weight
    );
    
    res.json({
      success: true,
      relationship,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Relationship creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create/update relationship',
      message: error.message
    });
  }
});

// Search nodes by type and properties
router.get('/search', rateLimiter, async (req, res) => {
  const { nodeType, query, limit = 20 } = req.query;
  
  try {
    const { Client } = require('pg');
    const connectionString = process.env.NEON_DATABASE_URL;
    
    if (!connectionString) {
      return res.status(500).json({
        success: false,
        error: 'Database connection not configured'
      });
    }
    
    const client = new Client({ connectionString });
    await client.connect();
    
    let sqlQuery = `
      SELECT *, COUNT(*) OVER() as total_count
      FROM frameworx.knowledge_nodes
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;
    
    if (nodeType) {
      sqlQuery += ` AND node_type = $${paramIndex}`;
      params.push(nodeType);
      paramIndex++;
    }
    
    if (query) {
      sqlQuery += ` AND (name ILIKE $${paramIndex} OR properties::text ILIKE $${paramIndex})`;
      params.push(`%${query}%`);
      paramIndex++;
    }
    
    sqlQuery += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit));
    
    const result = await client.query(sqlQuery, params);
    await client.end();
    
    res.json({
      success: true,
      nodes: result.rows,
      totalCount: result.rows.length > 0 ? result.rows[0].total_count : 0,
      query: { nodeType, query, limit },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Node search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search nodes',
      message: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Knowledge Graph API',
    status: 'healthy',
    endpoints: {
      stats: '/api/knowledge-graph/stats',
      relatedNodes: '/api/knowledge-graph/nodes/:nodeId/related',
      recommendations: '/api/knowledge-graph/recommendations/:nodeType',
      events: '/api/knowledge-graph/events',
      createNode: '/api/knowledge-graph/nodes',
      createRelationship: '/api/knowledge-graph/relationships',
      search: '/api/knowledge-graph/search'
    },
    features: [
      'Node management',
      'Relationship tracking',
      'Content recommendations',
      'Event processing',
      'Graph analytics',
      'Similarity search'
    ],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;