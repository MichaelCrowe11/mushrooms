/**
 * Southwest Mushrooms Theme - Optimized JavaScript Bundle
 * Version: 1.0.0
 * Optimized for performance and compatibility
 */

(function() {
  'use strict';
  
  // Performance optimization: Use requestAnimationFrame for smooth animations
  const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    setTimeout(callback, 16);
  };
  
  // Utility functions
  const utils = {
    // Debounce function for performance
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction() {
        const later = function() {
          clearTimeout(timeout);
          func();
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    // Throttle function for scroll events
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(function() {
            inThrottle = false;
          }, limit);
        }
      };
    },
    
    // Safe DOM query selector
    $: function(selector, context) {
      return (context || document).querySelector(selector);
    },
    
    // Safe DOM query selector all
    $$: function(selector, context) {
      return (context || document).querySelectorAll(selector);
    }
  };
  
  // Theme Manager
  const ThemeManager = {
    init: function() {
      this.loadingOverlay = utils.$('#loading-overlay');
      this.sidebarToggle = utils.$('#sidebar-toggle');
      this.sidebarNav = utils.$('.sidebar-nav');
      this.themeToggle = utils.$('#theme-toggle');
      this.scrollToTop = utils.$('#scroll-to-top');
      this.notificationToast = utils.$('#notification-toast');
      
      this.bindEvents();
      this.initTheme();
      this.hideLoadingOverlay();
    },
    
    bindEvents: function() {
      // Sidebar toggle
      if (this.sidebarToggle) {
        this.sidebarToggle.addEventListener('click', this.toggleSidebar.bind(this));
      }
      
      // Theme toggle
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
      }
      
      // Scroll to top
      if (this.scrollToTop) {
        this.scrollToTop.addEventListener('click', this.scrollToTopHandler.bind(this));
      }
      
      // Scroll event (throttled)
      window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), 16));
      
      // Keyboard navigation
      document.addEventListener('keydown', this.handleKeyboard.bind(this));
    },
    
    initTheme: function() {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      if (savedTheme === 'dark' && this.themeToggle) {
        this.themeToggle.classList.add('dark-mode');
      }
    },
    
    hideLoadingOverlay: function() {
      if (this.loadingOverlay) {
        raf(function() {
          this.loadingOverlay.style.opacity = '0';
          setTimeout(function() {
            this.loadingOverlay.style.display = 'none';
          }.bind(this), 300);
        }.bind(this));
      }
    },
    
    toggleSidebar: function() {
      if (this.sidebarNav) {
        this.sidebarNav.classList.toggle('open');
        this.sidebarToggle.classList.toggle('active');
        
        // Update ARIA attributes
        const isOpen = this.sidebarNav.classList.contains('open');
        this.sidebarToggle.setAttribute('aria-expanded', isOpen);
        this.sidebarNav.setAttribute('aria-hidden', !isOpen);
      }
    },
    
    toggleTheme: function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      if (this.themeToggle) {
        if (newTheme === 'dark') {
          this.themeToggle.classList.add('dark-mode');
        } else {
          this.themeToggle.classList.remove('dark-mode');
        }
      }
      
      this.showNotification('Theme switched to ' + newTheme + ' mode', 'success');
    },
    
    handleScroll: function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Show/hide scroll to top button
      if (this.scrollToTop) {
        if (scrollTop > 300) {
          this.scrollToTop.classList.add('visible');
        } else {
          this.scrollToTop.classList.remove('visible');
        }
      }
    },
    
    scrollToTopHandler: function() {
      raf(function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    },
    
    handleKeyboard: function(e) {
      // ESC key closes sidebar
      if (e.key === 'Escape' && this.sidebarNav && this.sidebarNav.classList.contains('open')) {
        this.toggleSidebar();
      }
      
      // Ctrl/Cmd + K toggles theme
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.toggleTheme();
      }
    },
    
    showNotification: function(message, type) {
      if (!this.notificationToast) return;
      
      const toastMessage = this.notificationToast.querySelector('.toast-message');
      if (toastMessage) {
        toastMessage.textContent = message;
      }
      
      this.notificationToast.className = 'notification-toast ' + (type || 'info') + ' visible';
      
      setTimeout(function() {
        this.notificationToast.classList.remove('visible');
      }.bind(this), 3000);
    }
  };
  
  // Video Gallery Manager
  const VideoGallery = {
    init: function() {
      this.videoPlaceholders = utils.$$('.video-placeholder');
      this.bindEvents();
    },
    
    bindEvents: function() {
      this.videoPlaceholders.forEach(function(placeholder) {
        const playButton = placeholder.querySelector('.play-button');
        if (playButton) {
          playButton.addEventListener('click', this.loadVideo.bind(this, placeholder));
        }
      }.bind(this));
    },
    
    loadVideo: function(placeholder) {
      const videoId = placeholder.dataset.videoId;
      const title = placeholder.dataset.title;
      
      if (!videoId) return;
      
      // Add loading state
      placeholder.classList.add('loading');
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
      iframe.title = title || 'Video';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';
      iframe.style.cssText = 'width:100%;height:100%;border:0;border-radius:var(--border-radius);';
      
      // Handle load events
      iframe.addEventListener('load', function() {
        placeholder.classList.remove('loading');
      });
      
      iframe.addEventListener('error', function() {
        placeholder.classList.remove('loading');
        placeholder.classList.add('error');
      });
      
      // Replace content
      placeholder.innerHTML = '';
      placeholder.appendChild(iframe);
    }
  };
  
  // GPT Lab Manager
  const GPTLab = {
    init: function() {
      this.gptIframe = utils.$('#gpt-iframe');
      this.gptFallback = utils.$('#gpt-fallback');
      
      if (this.gptIframe) {
        this.bindEvents();
      }
    },
    
    bindEvents: function() {
      // Handle iframe errors
      this.gptIframe.addEventListener('error', this.showFallback.bind(this));
      
      // Handle timeout
      setTimeout(function() {
        if (this.gptIframe.style.display !== 'none' && !this.gptIframe.contentWindow) {
          this.showFallback();
        }
      }.bind(this), 10000);
      
      // Listen for theme changes
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            this.updateTheme();
          }
        }.bind(this));
      }.bind(this));
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      
      // Handle postMessage
      window.addEventListener('message', this.handleMessage.bind(this));
    },
    
    showFallback: function() {
      if (this.gptIframe && this.gptFallback) {
        this.gptIframe.style.display = 'none';
        this.gptFallback.style.display = 'flex';
      }
    },
    
    updateTheme: function() {
      if (this.gptIframe && this.gptIframe.contentWindow) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const currentSrc = this.gptIframe.src;
        const newSrc = currentSrc.replace(/[?&]theme=[^&]*/, '') + 
                      (currentSrc.includes('?') ? '&' : '?') + 'theme=' + currentTheme;
        this.gptIframe.src = newSrc;
      }
    },
    
    handleMessage: function(event) {
      // Verify origin for security
      if (event.origin !== 'https://app.crowelogic.ai') {
        return;
      }
      
      if (event.data.type === 'gpt_ready') {
        // GPT Lab loaded successfully
      } else if (event.data.type === 'gpt_error') {
        this.showFallback();
      }
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ThemeManager.init();
      VideoGallery.init();
      GPTLab.init();
    });
  } else {
    ThemeManager.init();
    VideoGallery.init();
    GPTLab.init();
  }
  
  // Expose to global scope for debugging (development only)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.SouthwestMushrooms = {
      ThemeManager: ThemeManager,
      VideoGallery: VideoGallery,
      GPTLab: GPTLab,
      utils: utils
    };
  }
  
})(); 