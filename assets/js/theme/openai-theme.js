/**
 * OpenAI-Inspired Theme JavaScript
 * Modern ES6+ JavaScript for enhanced user experience
 */

class OpenAITheme {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupSidebar();
        this.setupAnimations();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
        this.setupProgressiveEnhancement();
    }

    /**
     * Theme Toggle Functionality
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        
        if (!themeToggle) return;

        // Initialize theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        
        this.setTheme(initialTheme);

        // Theme toggle event listener
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        const html = document.documentElement;
        const themeToggle = document.getElementById('theme-toggle');
        
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle button accessibility
        if (themeToggle) {
            const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            themeToggle.setAttribute('aria-label', label);
            themeToggle.setAttribute('title', label);
        }

        // Dispatch custom event for other scripts
        window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
    }

    /**
     * Sidebar Navigation
     */
    setupSidebar() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('openai-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (!sidebar || !sidebarToggle || !overlay) return;

        // Toggle sidebar
        const toggleSidebar = () => {
            const isOpen = sidebar.classList.contains('sidebar-open');
            
            if (isOpen) {
                this.closeSidebar();
            } else {
                this.openSidebar();
            }
        };

        // Event listeners
        sidebarToggle.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', () => this.closeSidebar());

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('sidebar-open')) {
                this.closeSidebar();
            }
        });

        // Auto-close on navigation (mobile)
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    setTimeout(() => this.closeSidebar(), 150);
                }
            });
        });

        // Handle resize
        window.addEventListener('resize', this.debounce(() => {
            if (window.innerWidth >= 992) {
                this.resetSidebar();
            }
        }, 250));

        // Initialize proper state
        this.resetSidebar();
    }

    openSidebar() {
        const sidebar = document.getElementById('openai-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggle = document.getElementById('sidebar-toggle');
        
        sidebar.classList.add('sidebar-open');
        overlay.classList.add('overlay-active');
        sidebar.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        
        // Focus management
        const firstFocusableElement = sidebar.querySelector('a, button');
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
        
        // Prevent body scroll on mobile
        if (window.innerWidth < 992) {
            document.body.style.overflow = 'hidden';
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('openai-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggle = document.getElementById('sidebar-toggle');
        
        sidebar.classList.remove('sidebar-open');
        overlay.classList.remove('overlay-active');
        sidebar.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        toggle.focus();
    }

    resetSidebar() {
        const sidebar = document.getElementById('openai-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('sidebar-open');
            overlay.classList.remove('overlay-active');
            sidebar.setAttribute('aria-hidden', 'false');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    /**
     * Animation Enhancements
     */
    setupAnimations() {
        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--duration-fast', '0ms');
            document.documentElement.style.setProperty('--duration-normal', '0ms');
            document.documentElement.style.setProperty('--duration-slow', '0ms');
            return;
        }

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.card, .product-card, .productView');
        animateElements.forEach(el => observer.observe(el));

        // Parallax effect for hero sections (subtle)
        const heroElements = document.querySelectorAll('.hero, .banner');
        if (heroElements.length > 0) {
            window.addEventListener('scroll', this.throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                heroElements.forEach(hero => {
                    hero.style.transform = `translateY(${rate}px)`;
                });
            }, 10));
        }
    }

    /**
     * Performance Optimizations
     */
    setupPerformanceOptimizations() {
        // Lazy load images with better loading states
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        } else {
            // Fallback to Intersection Observer
            this.setupLazyLoading();
        }

        // Preload critical resources
        this.preloadCriticalResources();

        // Service Worker registration (if available)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .catch(() => {
                        // Service worker not available, that's ok
                    });
            });
        }
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload next page if user hovers over navigation links
        const navigationLinks = document.querySelectorAll('.nav-link[href^="/"]');
        const preloadedPages = new Set();

        navigationLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const href = link.getAttribute('href');
                if (!preloadedPages.has(href)) {
                    const linkEl = document.createElement('link');
                    linkEl.rel = 'prefetch';
                    linkEl.href = href;
                    document.head.appendChild(linkEl);
                    preloadedPages.add(href);
                }
            }, { once: true });
        });
    }

    /**
     * Accessibility Enhancements
     */
    setupAccessibility() {
        // Focus management
        this.setupFocusManagement();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Screen reader enhancements
        this.setupScreenReaderSupport();
        
        // High contrast support
        this.setupHighContrastSupport();
    }

    setupFocusManagement() {
        // Focus trap for modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                lastElement.focus();
                                e.preventDefault();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                firstElement.focus();
                                e.preventDefault();
                            }
                        }
                    }
                });
            }
        });
    }

    setupKeyboardNavigation() {
        // Arrow key navigation for sidebar
        const sidebar = document.getElementById('openai-sidebar');
        const navLinks = sidebar ? sidebar.querySelectorAll('.nav-link') : [];
        
        navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % navLinks.length;
                    navLinks[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + navLinks.length) % navLinks.length;
                    navLinks[prevIndex].focus();
                }
            });
        });
    }

    setupScreenReaderSupport() {
        // Announce page changes
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);

        // Announce route changes
        window.addEventListener('popstate', () => {
            announcer.textContent = `Navigated to ${document.title}`;
        });

        // Announce loading states
        const loadingElements = document.querySelectorAll('[data-loading]');
        loadingElements.forEach(element => {
            const observer = new MutationObserver(() => {
                if (element.hasAttribute('data-loading')) {
                    announcer.textContent = 'Loading content...';
                } else {
                    announcer.textContent = 'Content loaded';
                }
            });
            
            observer.observe(element, { attributes: true });
        });
    }

    setupHighContrastSupport() {
        // Detect high contrast mode
        const highContrastMedia = window.matchMedia('(prefers-contrast: high)');
        
        const applyHighContrast = (matches) => {
            document.documentElement.classList.toggle('high-contrast', matches);
        };

        applyHighContrast(highContrastMedia.matches);
        highContrastMedia.addEventListener('change', (e) => {
            applyHighContrast(e.matches);
        });
    }

    /**
     * Progressive Enhancement
     */
    setupProgressiveEnhancement() {
        // Enhanced form validation
        this.enhanceFormValidation();
        
        // Smooth scrolling with fallback
        this.setupSmoothScrolling();
        
        // Enhanced search functionality
        this.enhanceSearch();
    }

    enhanceFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', this.debounce(() => {
                    this.validateField(input);
                }, 300));
            });
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        const errorMessage = field.nextElementSibling;
        
        if (!isValid) {
            field.classList.add('error');
            if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                const error = document.createElement('span');
                error.className = 'error-message';
                error.textContent = field.validationMessage;
                field.parentNode.insertBefore(error, field.nextSibling);
            }
        } else {
            field.classList.remove('error');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.remove();
            }
        }
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without triggering scroll
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });
    }

    enhanceSearch() {
        const searchInputs = document.querySelectorAll('input[type="search"]');
        
        searchInputs.forEach(input => {
            let searchTimeout;
            
            input.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    // Implement instant search functionality here
                    this.performInstantSearch(input.value);
                }, 300);
            });
        });
    }

    performInstantSearch(query) {
        // Placeholder for instant search functionality
        // This would typically make an AJAX request to search endpoint
        console.log('Searching for:', query);
    }

    /**
     * Utility Functions
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the theme when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new OpenAITheme();
    });
} else {
    new OpenAITheme();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenAITheme;
}
