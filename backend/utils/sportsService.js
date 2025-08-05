const fetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args));
const { Client } = require('pg');

/**
 * Sports Data Service
 * Integrates with multiple sports APIs to provide live scores and news
 * for Baseball, Football (NFL), and Basketball (NBA)
 */

class SportsService {
  constructor() {
    this.connectionString = process.env.NEON_DATABASE_URL;
    
    // API endpoints and configurations
    this.apis = {
      // ESPN API (free tier)
      espn: {
        baseUrl: 'https://site.api.espn.com/apis/site/v2/sports',
        endpoints: {
          nfl: '/football/nfl/scoreboard',
          nba: '/basketball/nba/scoreboard', 
          mlb: '/baseball/mlb/scoreboard'
        }
      },
      
      // Sports Open Data API (free)
      sportsOpenData: {
        baseUrl: 'https://api.sportsdata.io/v3',
        // Note: Requires API key for production use
        key: process.env.SPORTS_DATA_API_KEY
      },
      
      // The Sports DB (free)
      theSportsDB: {
        baseUrl: 'https://www.thesportsdb.com/api/v1/json',
        // Free tier, no key required
      }
    };
  }

  /**
   * Get NFL scores and games for today
   * @returns {Promise<Array>} NFL games and scores
   */
  async getNFLScores() {
    try {
      const response = await fetch(`${this.apis.espn.baseUrl}${this.apis.espn.endpoints.nfl}`);
      
      if (!response.ok) {
        throw new Error(`NFL API error: ${response.status}`);
      }
      
      const data = await response.json();
      const games = [];
      
      if (data.events && data.events.length > 0) {
        for (const event of data.events) {
          const competition = event.competitions[0];
          const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
          const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
          
          games.push({
            id: event.id,
            sport: 'NFL',
            status: competition.status.type.description,
            homeTeam: {
              name: homeTeam.team.displayName,
              abbreviation: homeTeam.team.abbreviation,
              logo: homeTeam.team.logo,
              score: homeTeam.score
            },
            awayTeam: {
              name: awayTeam.team.displayName,
              abbreviation: awayTeam.team.abbreviation,
              logo: awayTeam.team.logo,
              score: awayTeam.score
            },
            startTime: event.date,
            venue: competition.venue?.fullName,
            week: event.week?.number
          });
        }
      }
      
      return games;
    } catch (error) {
      console.error('Error fetching NFL scores:', error);
      return [];
    }
  }

  /**
   * Get NBA scores and games for today
   * @returns {Promise<Array>} NBA games and scores
   */
  async getNBAScores() {
    try {
      const response = await fetch(`${this.apis.espn.baseUrl}${this.apis.espn.endpoints.nba}`);
      
      if (!response.ok) {
        throw new Error(`NBA API error: ${response.status}`);
      }
      
      const data = await response.json();
      const games = [];
      
      if (data.events && data.events.length > 0) {
        for (const event of data.events) {
          const competition = event.competitions[0];
          const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
          const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
          
          games.push({
            id: event.id,
            sport: 'NBA',
            status: competition.status.type.description,
            homeTeam: {
              name: homeTeam.team.displayName,
              abbreviation: homeTeam.team.abbreviation,
              logo: homeTeam.team.logo,
              score: homeTeam.score
            },
            awayTeam: {
              name: awayTeam.team.displayName,
              abbreviation: awayTeam.team.abbreviation,
              logo: awayTeam.team.logo,
              score: awayTeam.score
            },
            startTime: event.date,
            venue: competition.venue?.fullName
          });
        }
      }
      
      return games;
    } catch (error) {
      console.error('Error fetching NBA scores:', error);
      return [];
    }
  }

  /**
   * Get MLB scores and games for today
   * @returns {Promise<Array>} MLB games and scores
   */
  async getMLBScores() {
    try {
      const response = await fetch(`${this.apis.espn.baseUrl}${this.apis.espn.endpoints.mlb}`);
      
      if (!response.ok) {
        throw new Error(`MLB API error: ${response.status}`);
      }
      
      const data = await response.json();
      const games = [];
      
      if (data.events && data.events.length > 0) {
        for (const event of data.events) {
          const competition = event.competitions[0];
          const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
          const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
          
          games.push({
            id: event.id,
            sport: 'MLB',
            status: competition.status.type.description,
            homeTeam: {
              name: homeTeam.team.displayName,
              abbreviation: homeTeam.team.abbreviation,
              logo: homeTeam.team.logo,
              score: homeTeam.score
            },
            awayTeam: {
              name: awayTeam.team.displayName,
              abbreviation: awayTeam.team.abbreviation,
              logo: awayTeam.team.logo,
              score: awayTeam.score
            },
            startTime: event.date,
            venue: competition.venue?.fullName,
            inning: competition.status.period
          });
        }
      }
      
      return games;
    } catch (error) {
      console.error('Error fetching MLB scores:', error);
      return [];
    }
  }

  /**
   * Get all sports scores for today
   * @returns {Promise<Object>} Object with NFL, NBA, and MLB scores
   */
  async getAllSportsScores() {
    try {
      const [nflScores, nbaScores, mlbScores] = await Promise.all([
        this.getNFLScores(),
        this.getNBAScores(),
        this.getMLBScores()
      ]);

      return {
        nfl: nflScores,
        nba: nbaScores,
        mlb: mlbScores,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching all sports scores:', error);
      return {
        nfl: [],
        nba: [],
        mlb: [],
        error: error.message,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Get sports news headlines
   * @param {string} sport - Sport type (nfl, nba, mlb, or 'all')
   * @returns {Promise<Array>} Sports news headlines
   */
  async getSportsNews(sport = 'all') {
    try {
      // Using ESPN's news API
      let newsUrl = 'https://site.api.espn.com/apis/site/v2/sports/news';
      
      if (sport !== 'all') {
        const sportPaths = {
          nfl: '/football/nfl',
          nba: '/basketball/nba',
          mlb: '/baseball/mlb'
        };
        newsUrl += sportPaths[sport] || '';
      }
      
      const response = await fetch(newsUrl);
      
      if (!response.ok) {
        throw new Error(`Sports news API error: ${response.status}`);
      }
      
      const data = await response.json();
      const articles = [];
      
      if (data.articles && data.articles.length > 0) {
        for (const article of data.articles.slice(0, 10)) {
          articles.push({
            id: article.id,
            headline: article.headline,
            description: article.description,
            published: article.published,
            images: article.images || [],
            links: article.links || [],
            categories: article.categories || []
          });
        }
      }
      
      return articles;
    } catch (error) {
      console.error('Error fetching sports news:', error);
      return [];
    }
  }

  /**
   * Cache sports data in database
   * @param {string} sportType - Type of sport data
   * @param {Object} data - Sports data to cache
   * @param {number} cacheMinutes - Cache duration in minutes
   */
  async cacheSportsData(sportType, data, cacheMinutes = 15) {
    if (!this.connectionString) return;
    
    try {
      const client = new Client({ connectionString: this.connectionString });
      await client.connect();
      
      const expiresAt = new Date(Date.now() + (cacheMinutes * 60 * 1000));
      
      await client.query(
        'INSERT INTO frameworx.sports_data (sport_type, data_type, data, expires_at) VALUES ($1, $2, $3, $4) ON CONFLICT (sport_type, data_type) DO UPDATE SET data = $3, expires_at = $4, created_at = CURRENT_TIMESTAMP',
        [sportType, 'scores', JSON.stringify(data), expiresAt]
      );
      
      await client.end();
    } catch (error) {
      console.error('Error caching sports data:', error);
    }
  }

  /**
   * Get cached sports data from database
   * @param {string} sportType - Type of sport data
   * @returns {Promise<Object|null>} Cached sports data or null
   */
  async getCachedSportsData(sportType) {
    if (!this.connectionString) return null;
    
    try {
      const client = new Client({ connectionString: this.connectionString });
      await client.connect();
      
      const result = await client.query(
        'SELECT data FROM frameworx.sports_data WHERE sport_type = $1 AND data_type = $2 AND expires_at > NOW()',
        [sportType, 'scores']
      );
      
      await client.end();
      
      if (result.rows.length > 0) {
        return JSON.parse(result.rows[0].data);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching cached sports data:', error);
      return null;
    }
  }

  /**
   * Get sports data with caching
   * @param {string} sport - Sport type (nfl, nba, mlb, or 'all')
   * @returns {Promise<Object>} Sports data with cache info
   */
  async getSportsDataWithCache(sport = 'all') {
    try {
      // Check cache first
      const cached = await this.getCachedSportsData(sport);
      if (cached) {
        return { ...cached, fromCache: true };
      }
      
      // Fetch fresh data
      let data;
      if (sport === 'all') {
        data = await this.getAllSportsScores();
      } else {
        switch (sport) {
          case 'nfl':
            data = { nfl: await this.getNFLScores() };
            break;
          case 'nba':
            data = { nba: await this.getNBAScores() };
            break;
          case 'mlb':
            data = { mlb: await this.getMLBScores() };
            break;
          default:
            data = await this.getAllSportsScores();
        }
      }
      
      // Cache the fresh data
      await this.cacheSportsData(sport, data);
      
      return { ...data, fromCache: false };
      
    } catch (error) {
      console.error('Error getting sports data with cache:', error);
      throw error;
    }
  }
}

module.exports = SportsService;