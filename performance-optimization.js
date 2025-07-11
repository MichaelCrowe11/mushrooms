// Performance Optimization and Monitoring Script
// Add to Script Manager or footer of base.html

(function() {
  'use strict';

  // Core Web Vitals and Performance Monitoring
  function initPerformanceMonitoring() {
    // Only run if analytics is available
    if (typeof gtag === 'undefined') return;

    // Lazy load web-vitals library
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.js';
    script.type = 'module';
    script.onload = function() {
      // Import and setup Core Web Vitals tracking
      import('https://unpkg.com/web-vitals@3/dist/web-vitals.js')
        .then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
          function sendToGoogleAnalytics({name, delta, value, id}) {
            gtag('event', name, {
              event_category: 'Web Vitals',
              event_label: id,
              value: Math.round(name === 'CLS' ? delta * 1000 : delta),
              non_interaction: true,
              custom_map: {
                metric_id: 'custom_parameter_1',
                metric_value: 'custom_parameter_2'
              }
            });
          }

          getCLS(sendToGoogleAnalytics);
          getFID(sendToGoogleAnalytics);
          getFCP(sendToGoogleAnalytics);
          getLCP(sendToGoogleAnalytics);
          getTTFB(sendToGoogleAnalytics);
        })
        .catch(err => console.warn('Web Vitals library failed to load:', err));
    };
    document.head.appendChild(script);
  }

  // Video Performance Optimization
  function optimizeVideoLoading() {
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    if (!videoPlaceholders.length) return;

    // Intersection Observer for lazy loading video iframes
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const placeholder = entry.target;
          const videoId = placeholder.dataset.videoId;
          const title = placeholder.dataset.title;
          
          if (videoId && !placeholder.querySelector('iframe')) {
            loadVideoIframe(placeholder, videoId, title);
            videoObserver.unobserve(placeholder);
          }
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });

    videoPlaceholders.forEach(placeholder => {
      videoObserver.observe(placeholder);
      
      // Add click handler for immediate loading
      placeholder.addEventListener('click', function() {
        const videoId = this.dataset.videoId;
        const title = this.dataset.title;
        if (videoId && !this.querySelector('iframe')) {
          loadVideoIframe(this, videoId, title);
          videoObserver.unobserve(this);
        }
      });
    });
  }

  function loadVideoIframe(placeholder, videoId, title) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = title;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0;';
    
    // Fade out placeholder and fade in iframe
    placeholder.style.transition = 'opacity 0.3s ease';
    placeholder.style.opacity = '0.7';
    
    iframe.onload = function() {
      placeholder.innerHTML = '';
      placeholder.appendChild(iframe);
      placeholder.style.opacity = '1';
      
      // Track video interaction
      if (typeof gtag !== 'undefined') {
        gtag('event', 'video_play', {
          event_category: 'Video',
          event_label: title,
          custom_parameter_1: videoId
        });
      }
    };
    
    iframe.onerror = function() {
      const fallback = placeholder.querySelector('.video-fallback');
      if (fallback) {
        fallback.style.display = 'block';
        placeholder.style.opacity = '1';
      }
    };
  }

  // GPT Lab Performance Optimization
  function optimizeGPTLab() {
    const gptFrame = document.getElementById('gpt-iframe');
    const gptFallback = document.getElementById('gpt-fallback');
    
    if (!gptFrame) return;

    // Set timeout for iframe loading
    const loadTimeout = setTimeout(() => {
      if (gptFallback) {
        gptFrame.style.display = 'none';
        gptFallback.style.display = 'flex';
        
        // Track fallback usage
        if (typeof gtag !== 'undefined') {
          gtag('event', 'gpt_fallback_shown', {
            event_category: 'GPT Lab',
            event_label: 'Iframe Load Timeout'
          });
        }
      }
    }, 10000); // 10 second timeout

    // Clear timeout if iframe loads successfully
    gptFrame.onload = function() {
      clearTimeout(loadTimeout);
      
      // Track successful GPT Lab load
      if (typeof gtag !== 'undefined') {
        gtag('event', 'gpt_lab_loaded', {
          event_category: 'GPT Lab',
          event_label: 'Successful Load'
        });
      }
    };

    gptFrame.onerror = function() {
      clearTimeout(loadTimeout);
      if (gptFallback) {
        gptFrame.style.display = 'none';
        gptFallback.style.display = 'flex';
      }
    };
  }

  // Image Optimization
  function optimizeImages() {
    // Add loading="lazy" to images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      if (!img.closest('.hero') && !img.closest('.above-fold')) {
        img.loading = 'lazy';
      }
    });

    // Handle image load errors
    document.addEventListener('error', function(e) {
      if (e.target.tagName === 'IMG') {
        const img = e.target;
        
        // Try alternative image source if available
        if (img.dataset.fallback) {
          img.src = img.dataset.fallback;
        } else if (img.src.includes('maxresdefault.jpg')) {
          // YouTube thumbnail fallback
          img.src = img.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
        }
        
        // Track image load errors
        if (typeof gtag !== 'undefined') {
          gtag('event', 'image_error', {
            event_category: 'Performance',
            event_label: img.src,
            non_interaction: true
          });
        }
      }
    }, true);
  }

  // Enhanced Image Loading Optimization
  function optimizeImageLoading() {
    // Implement advanced lazy loading with intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load the image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
          }
          
          // Load srcset if available
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          // Remove loading placeholder
          img.classList.remove('lazy-loading');
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Apply to all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.classList.add('lazy-loading');
      imageObserver.observe(img);
    });
  }

  // Theme Toggle Performance
  function optimizeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Debounce theme toggle to prevent rapid switching
    let themeTimeout;
    const originalHandler = themeToggle.onclick;
    
    themeToggle.onclick = function(e) {
      clearTimeout(themeTimeout);
      themeTimeout = setTimeout(() => {
        if (originalHandler) originalHandler.call(this, e);
        
        // Track theme usage
        if (typeof gtag !== 'undefined') {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          gtag('event', 'theme_toggle', {
            event_category: 'User Interface',
            event_label: isDark ? 'Dark Mode' : 'Light Mode'
          });
        }
      }, 150);
    };
  }

  // Page Visibility API for performance tracking
  function trackPageVisibility() {
    let startTime = Date.now();
    let isVisible = !document.hidden;

    document.addEventListener('visibilitychange', function() {
      const now = Date.now();
      const timeSpent = now - startTime;
      
      if (document.hidden && isVisible) {
        // Page became hidden - track time spent
        if (typeof gtag !== 'undefined' && timeSpent > 1000) {
          gtag('event', 'page_engagement', {
            event_category: 'User Engagement',
            event_label: window.location.pathname,
            value: Math.round(timeSpent / 1000)
          });
        }
        isVisible = false;
      } else if (!document.hidden && !isVisible) {
        // Page became visible - reset timer
        startTime = now;
        isVisible = true;
      }
    });
  }

  // Preload critical resources
  function preloadCriticalResources() {
    // Preload hero images
    const heroImages = document.querySelectorAll('.hero img, .featured-showcase img');
    heroImages.forEach(img => {
      if (img.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
      }
    });

    // Preload critical fonts if they exist
    const criticalFonts = [
      '/assets/fonts/primary-font.woff2',
      '/assets/fonts/heading-font.woff2'
    ];
    
    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      link.onerror = () => {}; // Ignore errors for non-existent fonts
      document.head.appendChild(link);
    });
  }

  // Enhanced Font Loading Strategy
  function optimizeFontLoading() {
    if ('fonts' in document) {
      // Critical fonts to load immediately
      const criticalFonts = [
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont'
      ];
      
      // Load critical fonts first
      Promise.allSettled(
        criticalFonts.map(font => document.fonts.load(`16px ${font}`))
      ).then(() => {
        document.body.classList.add('fonts-loaded');
      });
    }
  }

  // Enhanced Resource Hints
  function addResourceHints() {
    const head = document.head;
    
    // Preconnect to external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
      'https://cdn.bigcommerce.com'
    ];
    
    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      head.appendChild(link);
    });
    
    // DNS prefetch for less critical domains
    const prefetchDomains = [
      'https://www.googletagmanager.com',
      'https://connect.facebook.net',
      'https://static.hotjar.com'
    ];
    
    prefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      head.appendChild(link);
    });
  }

  // Enhanced Service Worker Implementation
  function initServiceWorker() {
    if ('serviceWorker' in navigator && 'caches' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registered:', registration);
          
          // Update available notification
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Show update notification
                showUpdateNotification();
              }
            });
          });
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    }
  }

  // Update notification for PWA
  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-notification-content">
        <p>A new version is available!</p>
        <button onclick="location.reload()" class="button button--primary">Update Now</button>
        <button onclick="this.parentElement.parentElement.remove()" class="button button--secondary">Later</button>
      </div>
    `;
    document.body.appendChild(notification);
  }

  // Critical Resource Loading
  function loadCriticalResources() {
    // Load critical CSS inline for first paint
    const criticalCSS = document.getElementById('critical-css');
    if (!criticalCSS) {
      // Load critical styles if not already inline
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/css/critical.css';
      link.id = 'critical-css';
      document.head.appendChild(link);
    }
    
    // Preload key resources
    const keyResources = [
      { href: '/assets/js/theme-bundle.main.js', as: 'script' },
      { href: '/assets/css/theme.css', as: 'style' },
      { href: '/assets/img/logo.svg', as: 'image' }
    ];
    
    keyResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.as === 'script') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  // Initialize all optimizations
  function init() {
    // Use requestIdleCallback for non-critical optimizations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        initPerformanceMonitoring();
        optimizeImages();
        trackPageVisibility();
        preloadCriticalResources();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        initPerformanceMonitoring();
        optimizeImages();
        trackPageVisibility();
        preloadCriticalResources();
      }, 100);
    }

    // Initialize critical optimizations immediately
    optimizeVideoLoading();
    optimizeGPTLab();
    optimizeThemeToggle();
    optimizeImageLoading();
    optimizeFontLoading();
    addResourceHints();
    initServiceWorker();
    loadCriticalResources();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
