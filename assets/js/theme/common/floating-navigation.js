/**
 * Floating Navigation System - Ultra Glass Design
 * Provides an innovative orb-based navigation that works alongside the mobile sidebar
 */

export default class FloatingNavigation {
    constructor() {
        this.orbSystem = null;
        this.isExpanded = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.magneticElements = [];
        
        this.init();
    }
    
    init() {
        // Only initialize on mobile and tablet
        if (window.innerWidth <= 1024) {
            this.createOrbSystem();
            this.attachEventListeners();
            this.initMagneticEffect();
            this.setupIntersectionObserver();
        }
    }
    
    createOrbSystem() {
        const orbHTML = `
            <div class="floating-nav-system" aria-label="Quick navigation">
                <button class="primary-orb" aria-label="Open quick navigation menu" aria-expanded="false">
                    <span class="orb-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <circle cx="12" cy="12" r="2" fill="currentColor"/>
                            <circle cx="12" cy="6" r="2" fill="currentColor"/>
                            <circle cx="12" cy="18" r="2" fill="currentColor"/>
                        </svg>
                    </span>
                    <span class="orb-glow"></span>
                    <span class="orb-ripple"></span>
                </button>
                
                <div class="satellite-orbs" aria-hidden="true">
                    ${this.createSatelliteOrbs()}
                </div>
                
                <div class="orb-tooltips" aria-hidden="true"></div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', orbHTML);
        this.orbSystem = document.querySelector('.floating-nav-system');
        
        // Add SCSS styles dynamically
        this.injectStyles();
    }
    
    createSatelliteOrbs() {
        const orbs = [
            { icon: '🏠', label: 'Home', action: 'navigate-home', url: '/' },
            { icon: '🛒', label: 'Cart', action: 'open-cart', badge: true },
            { icon: '🔍', label: 'Search', action: 'open-search' },
            { icon: '👤', label: 'Account', action: 'open-account', url: '/account/' },
            { icon: '💬', label: 'AI Assistant', action: 'open-chat' },
            { icon: '⚡', label: 'Quick Shop', action: 'quick-shop' }
        ];
        
        return orbs.map((orb, index) => `
            <button 
                class="satellite-orb" 
                data-action="${orb.action}"
                data-index="${index}"
                data-url="${orb.url || ''}"
                aria-label="${orb.label}"
                style="--orb-index: ${index}; --orb-delay: ${index * 50}ms;"
            >
                <span class="orb-icon">${orb.icon}</span>
                ${orb.badge ? '<span class="orb-badge" data-cart-count></span>' : ''}
                <span class="orb-tooltip">${orb.label}</span>
            </button>
        `).join('');
    }
    
    attachEventListeners() {
        const primaryOrb = this.orbSystem.querySelector('.primary-orb');
        
        // Click to toggle
        primaryOrb.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleOrbs();
        });
        
        // Touch gestures
        primaryOrb.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        });
        
        primaryOrb.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - this.touchStartX;
            const deltaY = touchEndY - this.touchStartY;
            
            // Swipe up to expand
            if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -50) {
                this.expandOrbs();
            }
        });
        
        // Satellite orb actions
        this.orbSystem.querySelectorAll('.satellite-orb').forEach(orb => {
            orb.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.currentTarget.dataset.action;
                const url = e.currentTarget.dataset.url;
                this.handleOrbAction(action, url);
            });
            
            // Touch feedback
            orb.addEventListener('touchstart', () => {
                orb.classList.add('touching');
            });
            
            orb.addEventListener('touchend', () => {
                orb.classList.remove('touching');
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.orbSystem.contains(e.target) && this.isExpanded) {
                this.collapseOrbs();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isExpanded) {
                this.collapseOrbs();
                primaryOrb.focus();
            }
        });
        
        // Update cart count
        this.updateCartCount();
        document.addEventListener('cart:update', () => this.updateCartCount());
    }
    
    initMagneticEffect() {
        const primaryOrb = this.orbSystem.querySelector('.primary-orb');
        let animationFrame = null;
        
        const handleMouseMove = (e) => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            
            animationFrame = requestAnimationFrame(() => {
                const rect = primaryOrb.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const distance = Math.sqrt(
                    Math.pow(e.clientX - centerX, 2) + 
                    Math.pow(e.clientY - centerY, 2)
                );
                
                if (distance < 100) {
                    const deltaX = (e.clientX - centerX) * 0.1;
                    const deltaY = (e.clientY - centerY) * 0.1;
                    primaryOrb.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                    
                    // Scale based on proximity
                    const scale = 1 + (100 - distance) / 500;
                    primaryOrb.style.transform += ` scale(${scale})`;
                }
            });
        };
        
        // Only on devices with mouse
        if (window.matchMedia('(hover: hover)').matches) {
            document.addEventListener('mousemove', handleMouseMove);
            
            primaryOrb.addEventListener('mouseleave', () => {
                if (animationFrame) cancelAnimationFrame(animationFrame);
                primaryOrb.style.transform = 'translate(0, 0) scale(1)';
            });
        }
    }
    
    setupIntersectionObserver() {
        // Hide orb system when footer is visible
        const footer = document.querySelector('footer');
        if (!footer) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.orbSystem.classList.add('hidden-for-footer');
                } else {
                    this.orbSystem.classList.remove('hidden-for-footer');
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(footer);
    }
    
    toggleOrbs() {
        if (this.isExpanded) {
            this.collapseOrbs();
        } else {
            this.expandOrbs();
        }
    }
    
    expandOrbs() {
        this.isExpanded = true;
        this.orbSystem.classList.add('expanded');
        
        const primaryOrb = this.orbSystem.querySelector('.primary-orb');
        primaryOrb.setAttribute('aria-expanded', 'true');
        
        // Stagger animation for satellite orbs
        const satellites = this.orbSystem.querySelectorAll('.satellite-orb');
        satellites.forEach((orb, index) => {
            orb.setAttribute('aria-hidden', 'false');
            setTimeout(() => {
                orb.classList.add('visible');
            }, index * 50);
        });
        
        // Haptic feedback on mobile
        if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate(10);
        }
        
        // Announce to screen readers
        this.announce('Quick navigation menu opened');
    }
    
    collapseOrbs() {
        this.isExpanded = false;
        this.orbSystem.classList.remove('expanded');
        
        const primaryOrb = this.orbSystem.querySelector('.primary-orb');
        primaryOrb.setAttribute('aria-expanded', 'false');
        
        const satellites = this.orbSystem.querySelectorAll('.satellite-orb');
        satellites.forEach(orb => {
            orb.classList.remove('visible');
            orb.setAttribute('aria-hidden', 'true');
        });
        
        // Announce to screen readers
        this.announce('Quick navigation menu closed');
    }
    
    handleOrbAction(action, url) {
        // Add ripple effect
        this.createRipple(event.currentTarget);
        
        switch(action) {
            case 'navigate-home':
                window.location.href = url || '/';
                break;
            case 'open-cart':
                this.openCart();
                break;
            case 'open-search':
                this.openSearch();
                break;
            case 'open-account':
                window.location.href = url || '/account/';
                break;
            case 'open-chat':
                this.openChat();
                break;
            case 'quick-shop':
                this.openQuickShop();
                break;
        }
        
        this.collapseOrbs();
    }
    
    openCart() {
        // Try to trigger existing cart drawer
        const cartEvent = new CustomEvent('cart:open');
        document.dispatchEvent(cartEvent);
        
        // Fallback to cart page
        setTimeout(() => {
            const cartDrawer = document.querySelector('.cart-drawer.open');
            if (!cartDrawer) {
                window.location.href = '/cart.php';
            }
        }, 100);
    }
    
    openSearch() {
        // Create fullscreen search overlay with glass effect
        const searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay-glass active';
        searchOverlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <h2>What are you looking for?</h2>
                    <button class="search-close" aria-label="Close search">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
                <form class="search-form" action="/search.php" method="get">
                    <input 
                        type="search" 
                        name="search_query" 
                        placeholder="Search mushrooms, benefits, recipes..." 
                        autofocus
                        autocomplete="off"
                    >
                    <button type="submit" aria-label="Search">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
                            <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </form>
                <div class="search-suggestions">
                    <h3>Popular Searches</h3>
                    <div class="suggestion-tags">
                        <a href="/search.php?search_query=lions+mane">Lion's Mane</a>
                        <a href="/search.php?search_query=immune+support">Immune Support</a>
                        <a href="/search.php?search_query=focus">Focus & Clarity</a>
                        <a href="/search.php?search_query=reishi">Reishi</a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(searchOverlay);
        
        // Focus search input
        const searchInput = searchOverlay.querySelector('input[type="search"]');
        searchInput.focus();
        
        // Close handlers
        const closeSearch = () => {
            searchOverlay.classList.remove('active');
            setTimeout(() => searchOverlay.remove(), 300);
        };
        
        searchOverlay.querySelector('.search-close').addEventListener('click', closeSearch);
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) closeSearch();
        });
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        searchOverlay.addEventListener('transitionend', () => {
            if (!searchOverlay.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        });
    }
    
    openChat() {
        // Check if AI chat exists
        const chatWidget = document.querySelector('.ai-chat-widget');
        if (chatWidget) {
            chatWidget.classList.add('open');
        } else {
            // Create simple chat interface
            this.createChatInterface();
        }
    }
    
    openQuickShop() {
        // Navigate to featured products with quick shop parameter
        window.location.href = '/?quick-shop=true#featured-products';
    }
    
    createRipple(element) {
        const ripple = document.createElement('span');
        ripple.className = 'orb-ripple-effect';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    updateCartCount() {
        const cartCountElement = this.orbSystem.querySelector('[data-cart-count]');
        if (!cartCountElement) return;
        
        // Get cart count from page or API
        const cartLink = document.querySelector('.navUser-action--cart');
        const count = cartLink ? cartLink.getAttribute('data-cart-count') || '0' : '0';
        
        cartCountElement.textContent = count;
        cartCountElement.style.display = count === '0' ? 'none' : 'flex';
    }
    
    createChatInterface() {
        const chatHTML = `
            <div class="ultra-chat-interface">
                <div class="chat-header">
                    <h3>Mushroom Expert</h3>
                    <button class="chat-close">×</button>
                </div>
                <div class="chat-body">
                    <div class="chat-message bot">
                        <p>👋 Hi! I'm here to help you find the perfect mushroom products. What are you looking for today?</p>
                    </div>
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Ask about benefits, usage, or products...">
                    <button type="submit">Send</button>
                </div>
            </div>
        `;
        
        const chatContainer = document.createElement('div');
        chatContainer.className = 'ultra-chat-container';
        chatContainer.innerHTML = chatHTML;
        document.body.appendChild(chatContainer);
        
        // Basic chat functionality
        const closeBtn = chatContainer.querySelector('.chat-close');
        closeBtn.addEventListener('click', () => {
            chatContainer.remove();
        });
    }
    
    announce(message) {
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => announcement.remove(), 1000);
    }
    
    injectStyles() {
        // Add dynamic styles for the orb system
        const style = document.createElement('style');
        style.textContent = `
            .floating-nav-system {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 1000;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .floating-nav-system.hidden-for-footer {
                transform: translateY(100px);
                opacity: 0;
                pointer-events: none;
            }
            
            @media (min-width: 1025px) {
                .floating-nav-system {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FloatingNavigation();
    });
} else {
    new FloatingNavigation();
} 