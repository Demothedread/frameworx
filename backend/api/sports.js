const express = require('express');
const router = express.Router();
const SportsService = require('../utils/sportsService');

/**
 * Sports API Routes
 * Provides live scores, news, and data for NFL, NBA, and MLB
 */

const rateLimiter = require('../middleware/rateLimiter');

// Get all sports scores
router.get('/scores', rateLimiter, async (req, res) => {
  try {
    const sportsService = new SportsService();
    const data = await sportsService.getSportsDataWithCache('all');
    
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sports scores error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sports scores',
      message: error.message
    });
  }
});

// Get scores for a specific sport
router.get('/scores/:sport', rateLimiter, async (req, res) => {
  const { sport } = req.params;
  const validSports = ['nfl', 'nba', 'mlb'];
  
  if (!validSports.includes(sport.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid sport',
      validSports
    });
  }
  
  try {
    const sportsService = new SportsService();
    const data = await sportsService.getSportsDataWithCache(sport.toLowerCase());
    
    res.json({
      success: true,
      sport: sport.toUpperCase(),
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`${sport} scores error:`, error);
    res.status(500).json({
      success: false,
      error: `Failed to fetch ${sport.toUpperCase()} scores`,
      message: error.message
    });
  }
});

// Get sports news
router.get('/news', rateLimiter, async (req, res) => {
  const { sport = 'all' } = req.query;
  
  try {
    const sportsService = new SportsService();
    const news = await sportsService.getSportsNews(sport);
    
    res.json({
      success: true,
      sport: sport.toUpperCase(),
      articles: news,
      count: news.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sports news error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sports news',
      message: error.message
    });
  }
});

// Get live feed for TV Guide (combines scores and news)
router.get('/feed', rateLimiter, async (req, res) => {
  try {
    const sportsService = new SportsService();
    
    // Get both scores and news in parallel
    const [scoresData, newsData] = await Promise.all([
      sportsService.getSportsDataWithCache('all'),
      sportsService.getSportsNews('all')
    ]);
    
    // Create a feed format suitable for TV Guide display
    const feed = [];
    
    // Add live games first
    const allGames = [
      ...(scoresData.nfl || []),
      ...(scoresData.nba || []),
      ...(scoresData.mlb || [])
    ];
    
    // Filter for live/active games
    const liveGames = allGames.filter(game => 
      game.status.toLowerCase().includes('live') || 
      game.status.toLowerCase().includes('quarter') ||
      game.status.toLowerCase().includes('inning') ||
      game.status.toLowerCase().includes('half')
    );
    
    liveGames.forEach(game => {
      feed.push({
        type: 'live_game',
        sport: game.sport,
        title: `${game.awayTeam.abbreviation} @ ${game.homeTeam.abbreviation}`,
        subtitle: `${game.awayTeam.score} - ${game.homeTeam.score}`,
        status: game.status,
        priority: 1, // High priority for live games
        data: game
      });
    });
    
    // Add recent news
    newsData.slice(0, 5).forEach((article, index) => {
      feed.push({
        type: 'news',
        title: article.headline,
        subtitle: article.description,
        priority: 2, // Lower priority than live games
        data: article
      });
    });
    
    // Add upcoming games
    const upcomingGames = allGames.filter(game => 
      game.status.toLowerCase().includes('scheduled') ||
      game.status.toLowerCase().includes('pre')
    ).slice(0, 3);
    
    upcomingGames.forEach(game => {
      feed.push({
        type: 'upcoming_game',
        sport: game.sport,
        title: `${game.awayTeam.abbreviation} vs ${game.homeTeam.abbreviation}`,
        subtitle: new Date(game.startTime).toLocaleTimeString(),
        status: 'Upcoming',
        priority: 3,
        data: game
      });
    });
    
    // Sort by priority
    feed.sort((a, b) => a.priority - b.priority);
    
    res.json({
      success: true,
      feed,
      liveGames: liveGames.length,
      totalItems: feed.length,
      lastUpdated: scoresData.lastUpdated,
      fromCache: scoresData.fromCache,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Sports feed error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sports feed',
      message: error.message
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Sports API',
    status: 'healthy',
    endpoints: {
      scores: '/api/sports/scores',
      specificSport: '/api/sports/scores/:sport',
      news: '/api/sports/news',
      feed: '/api/sports/feed'
    },
    supportedSports: ['NFL', 'NBA', 'MLB'],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;