const { Client } = require('pg');

/**
 * Performance Monitoring and Optimization Suite
 * Features:
 * - Real-time performance metrics collection
 * - API response time monitoring
 * - Database query optimization tracking
 * - Memory and CPU usage monitoring
 * - Automated performance alerts
 * - Caching layer optimization
 * - Load balancing recommendations
 * - Performance dashboard data
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      apiRequests: new Map(),
      dbQueries: new Map(),
      cacheHits: new Map(),
      errors: new Map(),
      responseTimesTotal: [],
      memoryUsage: [],
      activeConnections: 0
    };
    
    this.thresholds = {
      responseTime: 2000, // 2 seconds
      dbQueryTime: 1000, // 1 second
      memoryUsage: 80, // 80% of available memory
      errorRate: 5, // 5% error rate
      cacheHitRate: 70 // 70% cache hit rate
    };
    
    this.alerts = [];
    this.isMonitoring = false;
    this.connectionString = process.env.NEON_DATABASE_URL;
    
    // Start performance monitoring
    this.startMonitoring();
  }

  /**
   * Start continuous performance monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🔍 Performance monitoring started');
    
    // Collect metrics every 30 seconds
    setInterval(() => this.collectSystemMetrics(), 30000);
    
    // Generate performance reports every 5 minutes
    setInterval(() => this.generatePerformanceReport(), 300000);
    
    // Clean up old metrics every hour
    setInterval(() => this.cleanupOldMetrics(), 3600000);
  }

  /**
   * Track API request performance
   * @param {string} endpoint - API endpoint
   * @param {number} responseTime - Response time in milliseconds
   * @param {number} statusCode - HTTP status code
   * @param {string} method - HTTP method
   */
  trackAPIRequest(endpoint, responseTime, statusCode, method = 'GET') {
    const key = `${method} ${endpoint}`;
    const timestamp = Date.now();
    
    if (!this.metrics.apiRequests.has(key)) {
      this.metrics.apiRequests.set(key, {
        totalRequests: 0,
        totalResponseTime: 0,
        successCount: 0,
        errorCount: 0,
        responseTimes: [],
        lastRequest: timestamp
      });
    }
    
    const metric = this.metrics.apiRequests.get(key);
    metric.totalRequests++;
    metric.totalResponseTime += responseTime;
    metric.responseTimes.push({ time: responseTime, timestamp });
    metric.lastRequest = timestamp;
    
    if (statusCode >= 200 && statusCode < 400) {
      metric.successCount++;
    } else {
      metric.errorCount++;
    }
    
    // Keep only last 100 response times
    if (metric.responseTimes.length > 100) {
      metric.responseTimes.shift();
    }
    
    // Add to global response times
    this.metrics.responseTimesTotal.push({ endpoint: key, time: responseTime, timestamp });
    if (this.metrics.responseTimesTotal.length > 1000) {
      this.metrics.responseTimesTotal.shift();
    }
    
    // Check for performance alerts
    this.checkPerformanceAlerts(key, responseTime, statusCode);
  }

  /**
   * Track database query performance
   * @param {string} query - SQL query (first 100 chars)
   * @param {number} executionTime - Execution time in milliseconds
   * @param {number} rowCount - Number of rows affected/returned
   */
  trackDBQuery(query, executionTime, rowCount = 0) {
    const queryKey = query.substring(0, 100);
    const timestamp = Date.now();
    
    if (!this.metrics.dbQueries.has(queryKey)) {
      this.metrics.dbQueries.set(queryKey, {
        totalExecutions: 0,
        totalExecutionTime: 0,
        avgExecutionTime: 0,
        maxExecutionTime: 0,
        minExecutionTime: Infinity,
        totalRowsAffected: 0,
        executionTimes: [],
        lastExecution: timestamp
      });
    }
    
    const metric = this.metrics.dbQueries.get(queryKey);
    metric.totalExecutions++;
    metric.totalExecutionTime += executionTime;
    metric.avgExecutionTime = metric.totalExecutionTime / metric.totalExecutions;
    metric.maxExecutionTime = Math.max(metric.maxExecutionTime, executionTime);
    metric.minExecutionTime = Math.min(metric.minExecutionTime, executionTime);
    metric.totalRowsAffected += rowCount;
    metric.executionTimes.push({ time: executionTime, timestamp });
    metric.lastExecution = timestamp;
    
    // Keep only last 50 execution times
    if (metric.executionTimes.length > 50) {
      metric.executionTimes.shift();
    }
    
    // Alert for slow queries
    if (executionTime > this.thresholds.dbQueryTime) {
      this.addAlert('SLOW_QUERY', `Slow database query detected: ${executionTime}ms`, {
        query: queryKey,
        executionTime,
        timestamp
      });
    }
  }

  /**
   * Track cache performance
   * @param {string} cacheKey - Cache key
   * @param {boolean} hit - Whether it was a cache hit
   * @param {number} retrievalTime - Time to retrieve from cache
   */
  trackCachePerformance(cacheKey, hit, retrievalTime = 0) {
    const key = `cache_${cacheKey}`;
    const timestamp = Date.now();
    
    if (!this.metrics.cacheHits.has(key)) {
      this.metrics.cacheHits.set(key, {
        totalAccesses: 0,
        hits: 0,
        misses: 0,
        hitRate: 0,
        avgRetrievalTime: 0,
        totalRetrievalTime: 0,
        lastAccess: timestamp
      });
    }
    
    const metric = this.metrics.cacheHits.get(key);
    metric.totalAccesses++;
    metric.totalRetrievalTime += retrievalTime;
    metric.avgRetrievalTime = metric.totalRetrievalTime / metric.totalAccesses;
    metric.lastAccess = timestamp;
    
    if (hit) {
      metric.hits++;
    } else {
      metric.misses++;
    }
    
    metric.hitRate = (metric.hits / metric.totalAccesses) * 100;
    
    // Alert for low cache hit rates
    if (metric.totalAccesses > 10 && metric.hitRate < this.thresholds.cacheHitRate) {
      this.addAlert('LOW_CACHE_HIT_RATE', `Low cache hit rate: ${metric.hitRate.toFixed(1)}%`, {
        cacheKey,
        hitRate: metric.hitRate,
        totalAccesses: metric.totalAccesses
      });
    }
  }

  /**
   * Track error occurrences
   * @param {string} errorType - Type of error
   * @param {string} message - Error message
   * @param {Object} context - Additional context
   */
  trackError(errorType, message, context = {}) {
    const timestamp = Date.now();
    
    if (!this.metrics.errors.has(errorType)) {
      this.metrics.errors.set(errorType, {
        count: 0,
        lastOccurrence: timestamp,
        messages: [],
        contexts: []
      });
    }
    
    const metric = this.metrics.errors.get(errorType);
    metric.count++;
    metric.lastOccurrence = timestamp;
    metric.messages.push({ message, timestamp });
    metric.contexts.push({ context, timestamp });
    
    // Keep only last 20 error instances
    if (metric.messages.length > 20) {
      metric.messages.shift();
      metric.contexts.shift();
    }
    
    // Alert for high error rates
    const recentErrors = metric.messages.filter(m => timestamp - m.timestamp < 300000); // Last 5 minutes
    if (recentErrors.length > 5) {
      this.addAlert('HIGH_ERROR_RATE', `High error rate detected for ${errorType}`, {
        errorType,
        recentCount: recentErrors.length,
        totalCount: metric.count
      });
    }
  }

  /**
   * Collect system metrics (memory, CPU, etc.)
   */
  collectSystemMetrics() {
    const memUsage = process.memoryUsage();
    const timestamp = Date.now();
    
    const systemMetric = {
      timestamp,
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external,
        arrayBuffers: memUsage.arrayBuffers
      },
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage()
    };
    
    this.metrics.memoryUsage.push(systemMetric);
    
    // Keep only last 100 memory readings
    if (this.metrics.memoryUsage.length > 100) {
      this.metrics.memoryUsage.shift();
    }
    
    // Check memory usage alerts
    const heapUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    if (heapUsagePercent > this.thresholds.memoryUsage) {
      this.addAlert('HIGH_MEMORY_USAGE', `High memory usage: ${heapUsagePercent.toFixed(1)}%`, {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        percentage: heapUsagePercent
      });
    }
  }

  /**
   * Check for performance alerts
   * @param {string} endpoint - API endpoint
   * @param {number} responseTime - Response time
   * @param {number} statusCode - HTTP status code
   */
  checkPerformanceAlerts(endpoint, responseTime, statusCode) {
    // Slow response time alert
    if (responseTime > this.thresholds.responseTime) {
      this.addAlert('SLOW_RESPONSE', `Slow response detected: ${responseTime}ms`, {
        endpoint,
        responseTime,
        statusCode,
        timestamp: Date.now()
      });
    }
    
    // High error rate alert
    const metric = this.metrics.apiRequests.get(endpoint);
    if (metric && metric.totalRequests > 10) {
      const errorRate = (metric.errorCount / metric.totalRequests) * 100;
      if (errorRate > this.thresholds.errorRate) {
        this.addAlert('HIGH_ERROR_RATE', `High error rate: ${errorRate.toFixed(1)}%`, {
          endpoint,
          errorRate,
          totalRequests: metric.totalRequests,
          errorCount: metric.errorCount
        });
      }
    }
  }

  /**
   * Add performance alert
   * @param {string} type - Alert type
   * @param {string} message - Alert message
   * @param {Object} data - Additional alert data
   */
  addAlert(type, message, data = {}) {
    const alert = {
      id: Date.now() + Math.random(),
      type,
      message,
      data,
      timestamp: Date.now(),
      severity: this.getAlertSeverity(type)
    };
    
    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts.shift();
    }
    
    // Log critical alerts
    if (alert.severity === 'CRITICAL') {
      console.error(`🚨 CRITICAL ALERT: ${message}`, data);
    } else if (alert.severity === 'WARNING') {
      console.warn(`⚠️  WARNING: ${message}`, data);
    }
  }

  /**
   * Get alert severity based on type
   * @param {string} type - Alert type
   * @returns {string} Severity level
   */
  getAlertSeverity(type) {
    const criticalAlerts = ['HIGH_ERROR_RATE', 'HIGH_MEMORY_USAGE'];
    const warningAlerts = ['SLOW_RESPONSE', 'SLOW_QUERY', 'LOW_CACHE_HIT_RATE'];
    
    if (criticalAlerts.includes(type)) {
      return 'CRITICAL';
    } else if (warningAlerts.includes(type)) {
      return 'WARNING';
    } else {
      return 'INFO';
    }
  }

  /**
   * Generate comprehensive performance report
   */
  async generatePerformanceReport() {
    const now = Date.now();
    const oneHourAgo = now - 3600000; // 1 hour ago
    
    // Calculate API performance metrics
    const apiMetrics = this.calculateAPIMetrics(oneHourAgo);
    const dbMetrics = this.calculateDBMetrics(oneHourAgo);
    const cacheMetrics = this.calculateCacheMetrics();
    const systemMetrics = this.calculateSystemMetrics(oneHourAgo);
    const alertSummary = this.calculateAlertSummary(oneHourAgo);
    
    const report = {
      timestamp: new Date().toISOString(),
      period: '1 hour',
      summary: {
        totalAPIRequests: apiMetrics.totalRequests,
        avgResponseTime: apiMetrics.avgResponseTime,
        totalDBQueries: dbMetrics.totalQueries,
        avgQueryTime: dbMetrics.avgQueryTime,
        overallCacheHitRate: cacheMetrics.overallHitRate,
        systemHealth: this.getSystemHealthStatus(),
        activeAlerts: this.alerts.filter(a => now - a.timestamp < 3600000).length
      },
      details: {
        api: apiMetrics,
        database: dbMetrics,
        cache: cacheMetrics,
        system: systemMetrics,
        alerts: alertSummary
      },
      recommendations: this.generateRecommendations()
    };
    
    // Save report to database if possible
    await this.savePerformanceReport(report);
    
    console.log('📊 Performance Report Generated:', {
      totalRequests: report.summary.totalAPIRequests,
      avgResponseTime: `${report.summary.avgResponseTime}ms`,
      cacheHitRate: `${report.summary.overallCacheHitRate}%`,
      systemHealth: report.summary.systemHealth,
      alerts: report.summary.activeAlerts
    });
    
    return report;
  }

  /**
   * Calculate API performance metrics
   * @param {number} since - Timestamp to calculate from
   */
  calculateAPIMetrics(since) {
    let totalRequests = 0;
    let totalResponseTime = 0;
    let successCount = 0;
    let errorCount = 0;
    const endpointStats = [];
    
    for (const [endpoint, metric] of this.metrics.apiRequests) {
      const recentResponses = metric.responseTimes.filter(r => r.timestamp >= since);
      
      if (recentResponses.length > 0) {
        const endpointTotal = recentResponses.length;
        const endpointAvg = recentResponses.reduce((sum, r) => sum + r.time, 0) / endpointTotal;
        const endpointMax = Math.max(...recentResponses.map(r => r.time));
        const endpointMin = Math.min(...recentResponses.map(r => r.time));
        
        totalRequests += endpointTotal;
        totalResponseTime += recentResponses.reduce((sum, r) => sum + r.time, 0);
        
        endpointStats.push({
          endpoint,
          requests: endpointTotal,
          avgResponseTime: Math.round(endpointAvg),
          maxResponseTime: endpointMax,
          minResponseTime: endpointMin,
          successRate: metric.totalRequests > 0 ? ((metric.successCount / metric.totalRequests) * 100).toFixed(1) : 0
        });
      }
    }
    
    return {
      totalRequests,
      avgResponseTime: totalRequests > 0 ? Math.round(totalResponseTime / totalRequests) : 0,
      successCount,
      errorCount,
      endpoints: endpointStats.sort((a, b) => b.requests - a.requests).slice(0, 10)
    };
  }

  /**
   * Calculate database performance metrics
   * @param {number} since - Timestamp to calculate from
   */
  calculateDBMetrics(since) {
    let totalQueries = 0;
    let totalExecutionTime = 0;
    const queryStats = [];
    
    for (const [query, metric] of this.metrics.dbQueries) {
      const recentExecutions = metric.executionTimes.filter(e => e.timestamp >= since);
      
      if (recentExecutions.length > 0) {
        const queryTotal = recentExecutions.length;
        const queryAvg = recentExecutions.reduce((sum, e) => sum + e.time, 0) / queryTotal;
        const queryMax = Math.max(...recentExecutions.map(e => e.time));
        
        totalQueries += queryTotal;
        totalExecutionTime += recentExecutions.reduce((sum, e) => sum + e.time, 0);
        
        queryStats.push({
          query: query.substring(0, 50) + '...',
          executions: queryTotal,
          avgExecutionTime: Math.round(queryAvg),
          maxExecutionTime: queryMax,
          totalRowsAffected: metric.totalRowsAffected
        });
      }
    }
    
    return {
      totalQueries,
      avgQueryTime: totalQueries > 0 ? Math.round(totalExecutionTime / totalQueries) : 0,
      slowQueries: queryStats.filter(q => q.avgExecutionTime > this.thresholds.dbQueryTime),
      topQueries: queryStats.sort((a, b) => b.executions - a.executions).slice(0, 5)
    };
  }

  /**
   * Calculate cache performance metrics
   */
  calculateCacheMetrics() {
    let totalAccesses = 0;
    let totalHits = 0;
    const cacheStats = [];
    
    for (const [cacheKey, metric] of this.metrics.cacheHits) {
      totalAccesses += metric.totalAccesses;
      totalHits += metric.hits;
      
      cacheStats.push({
        cacheKey: cacheKey.replace('cache_', ''),
        accesses: metric.totalAccesses,
        hitRate: metric.hitRate.toFixed(1),
        avgRetrievalTime: Math.round(metric.avgRetrievalTime)
      });
    }
    
    return {
      overallHitRate: totalAccesses > 0 ? ((totalHits / totalAccesses) * 100).toFixed(1) : 0,
      totalAccesses,
      cachePerformance: cacheStats.sort((a, b) => b.accesses - a.accesses)
    };
  }

  /**
   * Calculate system metrics
   * @param {number} since - Timestamp to calculate from
   */
  calculateSystemMetrics(since) {
    const recentMetrics = this.metrics.memoryUsage.filter(m => m.timestamp >= since);
    
    if (recentMetrics.length === 0) {
      return { noData: true };
    }
    
    const latest = recentMetrics[recentMetrics.length - 1];
    const avgHeapUsed = recentMetrics.reduce((sum, m) => sum + m.memory.heapUsed, 0) / recentMetrics.length;
    const maxHeapUsed = Math.max(...recentMetrics.map(m => m.memory.heapUsed));
    
    return {
      currentMemory: {
        heapUsed: Math.round(latest.memory.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(latest.memory.heapTotal / 1024 / 1024), // MB
        rss: Math.round(latest.memory.rss / 1024 / 1024), // MB
        usage: Math.round((latest.memory.heapUsed / latest.memory.heapTotal) * 100)
      },
      averageMemory: {
        heapUsed: Math.round(avgHeapUsed / 1024 / 1024), // MB
        maxHeapUsed: Math.round(maxHeapUsed / 1024 / 1024) // MB
      },
      uptime: Math.round(latest.uptime / 3600), // hours
      dataPoints: recentMetrics.length
    };
  }

  /**
   * Calculate alert summary
   * @param {number} since - Timestamp to calculate from
   */
  calculateAlertSummary(since) {
    const recentAlerts = this.alerts.filter(a => a.timestamp >= since);
    
    const alertCounts = recentAlerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {});
    
    const severityCounts = recentAlerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalAlerts: recentAlerts.length,
      byType: alertCounts,
      bySeverity: severityCounts,
      latestAlerts: recentAlerts.slice(-5).map(a => ({
        type: a.type,
        message: a.message,
        severity: a.severity,
        timestamp: new Date(a.timestamp).toISOString()
      }))
    };
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    
    // API performance recommendations
    const slowEndpoints = [];
    for (const [endpoint, metric] of this.metrics.apiRequests) {
      const avgTime = metric.totalResponseTime / metric.totalRequests;
      if (avgTime > this.thresholds.responseTime) {
        slowEndpoints.push({ endpoint, avgTime });
      }
    }
    
    if (slowEndpoints.length > 0) {
      recommendations.push({
        type: 'API_OPTIMIZATION',
        priority: 'HIGH',
        description: 'Optimize slow API endpoints',
        details: `${slowEndpoints.length} endpoints have average response times above ${this.thresholds.responseTime}ms`,
        endpoints: slowEndpoints.slice(0, 3)
      });
    }
    
    // Database recommendations
    const slowQueries = [];
    for (const [query, metric] of this.metrics.dbQueries) {
      if (metric.avgExecutionTime > this.thresholds.dbQueryTime) {
        slowQueries.push({ query: query.substring(0, 50), avgTime: metric.avgExecutionTime });
      }
    }
    
    if (slowQueries.length > 0) {
      recommendations.push({
        type: 'DATABASE_OPTIMIZATION',
        priority: 'HIGH',
        description: 'Optimize slow database queries',
        details: `${slowQueries.length} queries have average execution times above ${this.thresholds.dbQueryTime}ms`,
        queries: slowQueries.slice(0, 3)
      });
    }
    
    // Cache recommendations
    const lowHitRateCaches = [];
    for (const [cacheKey, metric] of this.metrics.cacheHits) {
      if (metric.totalAccesses > 10 && metric.hitRate < this.thresholds.cacheHitRate) {
        lowHitRateCaches.push({ key: cacheKey, hitRate: metric.hitRate });
      }
    }
    
    if (lowHitRateCaches.length > 0) {
      recommendations.push({
        type: 'CACHE_OPTIMIZATION',
        priority: 'MEDIUM',
        description: 'Improve cache hit rates',
        details: `${lowHitRateCaches.length} cache keys have hit rates below ${this.thresholds.cacheHitRate}%`,
        caches: lowHitRateCaches.slice(0, 3)
      });
    }
    
    // Memory recommendations
    const latestMemory = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
    if (latestMemory) {
      const memoryUsagePercent = (latestMemory.memory.heapUsed / latestMemory.memory.heapTotal) * 100;
      if (memoryUsagePercent > this.thresholds.memoryUsage) {
        recommendations.push({
          type: 'MEMORY_OPTIMIZATION',
          priority: 'CRITICAL',
          description: 'High memory usage detected',
          details: `Current memory usage is ${memoryUsagePercent.toFixed(1)}%`,
          suggestions: [
            'Implement garbage collection optimization',
            'Review memory leaks in long-running processes',
            'Consider increasing available memory'
          ]
        });
      }
    }
    
    return recommendations;
  }

  /**
   * Get overall system health status
   */
  getSystemHealthStatus() {
    const criticalAlerts = this.alerts.filter(a => 
      a.severity === 'CRITICAL' && 
      Date.now() - a.timestamp < 300000 // Last 5 minutes
    );
    
    if (criticalAlerts.length > 0) {
      return 'CRITICAL';
    }
    
    const warningAlerts = this.alerts.filter(a => 
      a.severity === 'WARNING' && 
      Date.now() - a.timestamp < 900000 // Last 15 minutes
    );
    
    if (warningAlerts.length > 3) {
      return 'WARNING';
    }
    
    return 'HEALTHY';
  }

  /**
   * Save performance report to database
   * @param {Object} report - Performance report
   */
  async savePerformanceReport(report) {
    if (!this.connectionString) return;
    
    try {
      const client = new Client({ connectionString: this.connectionString });
      await client.connect();
      
      const query = `
        INSERT INTO frameworx.performance_reports (report_data, created_at)
        VALUES ($1, CURRENT_TIMESTAMP)
      `;
      
      await client.query(query, [JSON.stringify(report)]);
      await client.end();
      
    } catch (error) {
      console.error('Failed to save performance report:', error.message);
    }
  }

  /**
   * Clean up old metrics to prevent memory leaks
   */
  cleanupOldMetrics() {
    const oneHourAgo = Date.now() - 3600000;
    
    // Clean up old response times
    this.metrics.responseTimesTotal = this.metrics.responseTimesTotal.filter(
      r => r.timestamp > oneHourAgo
    );
    
    // Clean up old memory usage data
    this.metrics.memoryUsage = this.metrics.memoryUsage.filter(
      m => m.timestamp > oneHourAgo
    );
    
    // Clean up old alerts
    this.alerts = this.alerts.filter(a => a.timestamp > oneHourAgo);
    
    console.log('🧹 Performance metrics cleanup completed');
  }

  /**
   * Get current performance summary
   */
  getCurrentPerformanceSummary() {
    const now = Date.now();
    const fiveMinutesAgo = now - 300000;
    
    // Recent API requests
    const recentAPIRequests = this.metrics.responseTimesTotal.filter(r => r.timestamp > fiveMinutesAgo);
    const avgRecentResponseTime = recentAPIRequests.length > 0 
      ? recentAPIRequests.reduce((sum, r) => sum + r.time, 0) / recentAPIRequests.length 
      : 0;
    
    // Recent alerts
    const recentAlerts = this.alerts.filter(a => a.timestamp > fiveMinutesAgo);
    
    // Current memory
    const latestMemory = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
    const memoryUsagePercent = latestMemory 
      ? (latestMemory.memory.heapUsed / latestMemory.memory.heapTotal) * 100 
      : 0;
    
    return {
      timestamp: new Date().toISOString(),
      systemHealth: this.getSystemHealthStatus(),
      recentRequests: recentAPIRequests.length,
      avgResponseTime: Math.round(avgRecentResponseTime),
      memoryUsage: Math.round(memoryUsagePercent),
      recentAlerts: recentAlerts.length,
      activeConnections: this.metrics.activeConnections,
      uptime: Math.round(process.uptime() / 3600) // hours
    };
  }

  /**
   * Express middleware for automatic performance tracking
   */
  middleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      const originalSend = res.send;
      
      res.send = function(data) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // Track the request
        global.performanceMonitor?.trackAPIRequest(
          req.route?.path || req.path,
          responseTime,
          res.statusCode,
          req.method
        );
        
        return originalSend.call(this, data);
      };
      
      next();
    };
  }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor();
global.performanceMonitor = performanceMonitor;

module.exports = PerformanceMonitor;