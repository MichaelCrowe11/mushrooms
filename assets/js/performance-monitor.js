/**
 * Performance Monitor for Southwest Mushrooms Theme
 * Tracks key performance metrics and reports issues
 */

(function() {
  'use strict';
  
  const PerformanceMonitor = {
    metrics: {},
    
    init: function() {
      this.startTime = performance.now();
      this.bindEvents();
      this.measureInitialLoad();
    },
    
    bindEvents: function() {
      // Measure page load time
      window.addEventListener('load', this.measurePageLoad.bind(this));
      
      // Measure user interactions
      document.addEventListener('click', this.measureInteraction.bind(this));
      
      // Monitor for errors
      window.addEventListener('error', this.handleError.bind(this));
      window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
    },
    
    measureInitialLoad: function() {
      // First Contentful Paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(function(list) {
          list.getEntries().forEach(function(entry) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              this.reportMetric('FCP', entry.startTime);
            }
          }.bind(this));
        }.bind(this));
        
        observer.observe({ entryTypes: ['paint'] });
      }
      
      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(function(list) {
          list.getEntries().forEach(function(entry) {
            this.metrics.lcp = entry.startTime;
            this.reportMetric('LCP', entry.startTime);
          }.bind(this));
        }.bind(this));
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }
    },
    
    measurePageLoad: function() {
      const loadTime = performance.now() - this.startTime;
      this.metrics.pageLoad = loadTime;
      this.reportMetric('PageLoad', loadTime);
      
      // Check for performance issues
      this.checkPerformanceIssues();
    },
    
    measureInteraction: function(e) {
      const target = e.target;
      const tagName = target.tagName.toLowerCase();
      
      // Track important interactions
      if (tagName === 'button' || tagName === 'a') {
        const interactionTime = performance.now();
        this.metrics.lastInteraction = interactionTime;
        
        // Report slow interactions
        if (interactionTime > 100) {
          this.reportMetric('SlowInteraction', interactionTime, {
            element: target.tagName,
            className: target.className,
            id: target.id
          });
        }
      }
    },
    
    handleError: function(e) {
      this.reportError('JavaScript Error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error ? e.error.stack : null
      });
    },
    
    handlePromiseError: function(e) {
      this.reportError('Promise Rejection', {
        reason: e.reason,
        promise: e.promise
      });
    },
    
    checkPerformanceIssues: function() {
      const issues = [];
      
      // Check page load time
      if (this.metrics.pageLoad > 3000) {
        issues.push('Slow page load: ' + Math.round(this.metrics.pageLoad) + 'ms');
      }
      
      // Check FCP
      if (this.metrics.fcp > 1500) {
        issues.push('Slow FCP: ' + Math.round(this.metrics.fcp) + 'ms');
      }
      
      // Check LCP
      if (this.metrics.lcp > 2500) {
        issues.push('Slow LCP: ' + Math.round(this.metrics.lcp) + 'ms');
      }
      
      if (issues.length > 0) {
        this.reportPerformanceIssues(issues);
      }
    },
    
    reportMetric: function(name, value, context) {
      // In production, send to analytics service
      if (window.gtag) {
        gtag('event', 'performance_metric', {
          metric_name: name,
          metric_value: Math.round(value),
          page_location: window.location.href,
          custom_parameters: context || {}
        });
      }
      
      // Log in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Performance Metric:', name, Math.round(value) + 'ms', context);
      }
    },
    
    reportError: function(type, details) {
      // In production, send to error tracking service
      if (window.gtag) {
        gtag('event', 'exception', {
          description: type + ': ' + (details.message || details.reason),
          fatal: false
        });
      }
      
      // Log in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Performance Error:', type, details);
      }
    },
    
    reportPerformanceIssues: function(issues) {
      // In production, send to monitoring service
      if (window.gtag) {
        gtag('event', 'performance_issues', {
          issues: issues.join(', '),
          page_location: window.location.href
        });
      }
      
      // Log in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('Performance Issues Detected:', issues);
      }
    },
    
    // Public API for manual measurements
    measure: function(name, fn) {
      const start = performance.now();
      const result = fn();
      const duration = performance.now() - start;
      
      this.reportMetric(name, duration);
      return result;
    }
  };
  
  // Initialize performance monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      PerformanceMonitor.init();
    });
  } else {
    PerformanceMonitor.init();
  }
  
  // Expose for manual measurements
  window.PerformanceMonitor = PerformanceMonitor;
  
})(); 