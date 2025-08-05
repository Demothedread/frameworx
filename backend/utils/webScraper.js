const fetch = (...args) => import('node-fetch').then(({default:fetch}) => fetch(...args));
const cheerio = require('cheerio');

/**
 * Custom web scraper for CourtListener and other legal websites
 * Replaces Apify with BeautifulSoup-equivalent functionality using Cheerio
 */

class WebScraper {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    };
  }

  /**
   * Search CourtListener for legal cases and opinions
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Array>} Array of search results
   */
  async searchCourtListener(query, limit = 10) {
    try {
      const searchUrl = `https://www.courtlistener.com/opinion/?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      const results = [];
      
      // Parse CourtListener search results
      $('.result').each((index, element) => {
        if (index >= limit) return false; // Stop at limit
        
        const $element = $(element);
        const title = $element.find('h3 a').text().trim();
        const link = $element.find('h3 a').attr('href');
        const court = $element.find('.court').text().trim();
        const date = $element.find('.date').text().trim();
        const snippet = $element.find('.snippet').text().trim();
        
        if (title && link) {
          results.push({
            title,
            url: link.startsWith('http') ? link : `https://www.courtlistener.com${link}`,
            court,
            date,
            snippet,
            source: 'CourtListener'
          });
        }
      });
      
      return results;
    } catch (error) {
      console.error('CourtListener search error:', error);
      throw new Error(`Failed to search CourtListener: ${error.message}`);
    }
  }

  /**
   * Get full opinion text from a CourtListener opinion URL
   * @param {string} opinionUrl - URL to the opinion page
   * @returns {Promise<Object>} Opinion details with full text
   */
  async getOpinionDetails(opinionUrl) {
    try {
      const response = await fetch(opinionUrl, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract opinion details
      const title = $('h1.case-title').text().trim() || $('.meta-data-header h1').text().trim();
      const court = $('.meta-data-value:contains("Court")').next().text().trim();
      const date = $('.meta-data-value:contains("Date")').next().text().trim();
      const judge = $('.meta-data-value:contains("Judge")').next().text().trim();
      
      // Get the full opinion text
      const opinionText = $('.opinion-content').text().trim() || 
                         $('#opinion-content').text().trim() ||
                         $('.document-text').text().trim();
      
      // Get citations
      const citations = [];
      $('.citation').each((index, element) => {
        citations.push($(element).text().trim());
      });
      
      return {
        title,
        court,
        date,
        judge,
        opinionText,
        citations,
        url: opinionUrl,
        source: 'CourtListener'
      };
    } catch (error) {
      console.error('Opinion details fetch error:', error);
      throw new Error(`Failed to fetch opinion details: ${error.message}`);
    }
  }

  /**
   * Search multiple legal databases (extensible for other sources)
   * @param {string} query - Search query
   * @param {Array} sources - Array of sources to search ['courtlistener', 'justia', etc.]
   * @param {number} limit - Results per source
   * @returns {Promise<Array>} Combined search results
   */
  async searchLegalDatabases(query, sources = ['courtlistener'], limit = 5) {
    const allResults = [];
    
    for (const source of sources) {
      try {
        let results = [];
        
        switch (source.toLowerCase()) {
          case 'courtlistener':
            results = await this.searchCourtListener(query, limit);
            break;
          case 'justia':
            results = await this.searchJustia(query, limit);
            break;
          default:
            console.warn(`Unknown legal database source: ${source}`);
        }
        
        allResults.push(...results);
      } catch (error) {
        console.error(`Error searching ${source}:`, error);
        // Continue with other sources even if one fails
      }
    }
    
    return allResults;
  }

  /**
   * Search Justia (as backup/additional source)
   * @param {string} query - Search query
   * @param {number} limit - Maximum results
   * @returns {Promise<Array>} Search results
   */
  async searchJustia(query, limit = 5) {
    try {
      const searchUrl = `https://law.justia.com/search?cx=004471346504244445128%3Ahrn4c5tqfri&cof=FORID%3A11&ie=UTF-8&q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      const results = [];
      
      $('.gsc-result').each((index, element) => {
        if (index >= limit) return false;
        
        const $element = $(element);
        const title = $element.find('.gsc-title a').text().trim();
        const link = $element.find('.gsc-title a').attr('href');
        const snippet = $element.find('.gsc-snippet').text().trim();
        
        if (title && link) {
          results.push({
            title,
            url: link,
            snippet,
            source: 'Justia'
          });
        }
      });
      
      return results;
    } catch (error) {
      console.error('Justia search error:', error);
      return []; // Return empty array instead of throwing to not break other sources
    }
  }

  /**
   * Cache search results in database
   * @param {string} query - Original search query
   * @param {Array} results - Search results to cache
   * @param {string} source - Source name
   */
  async cacheResults(query, results, source) {
    try {
      // This would integrate with your Neon database
      // Implementation depends on your database connection setup
      const { Client } = require('pg');
      
      // Get connection string from environment or config
      const connectionString = process.env.NEON_DATABASE_URL;
      if (!connectionString) return; // Skip caching if no DB configured
      
      const client = new Client({ connectionString });
      await client.connect();
      
      // Cache for 1 hour
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      
      await client.query(
        'INSERT INTO frameworx.web_search_cache (search_query, source, results, expires_at) VALUES ($1, $2, $3, $4)',
        [query, source, JSON.stringify(results), expiresAt]
      );
      
      await client.end();
    } catch (error) {
      console.error('Error caching search results:', error);
      // Don't throw - caching failure shouldn't break the search
    }
  }

  /**
   * Get cached search results
   * @param {string} query - Search query
   * @param {string} source - Source name
   * @returns {Promise<Array|null>} Cached results or null
   */
  async getCachedResults(query, source) {
    try {
      const { Client } = require('pg');
      
      const connectionString = process.env.NEON_DATABASE_URL;
      if (!connectionString) return null;
      
      const client = new Client({ connectionString });
      await client.connect();
      
      const result = await client.query(
        'SELECT results FROM frameworx.web_search_cache WHERE search_query = $1 AND source = $2 AND expires_at > NOW()',
        [query, source]
      );
      
      await client.end();
      
      if (result.rows.length > 0) {
        return JSON.parse(result.rows[0].results);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching cached results:', error);
      return null;
    }
  }
}

module.exports = WebScraper;