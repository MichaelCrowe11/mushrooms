/**
 * Southwest Mushrooms - Modern App Bootstrap
 * ES Module architecture for BigCommerce Stencil
 */

// Import core modules
import { initSidebar } from './modules/sidebar.js';
import { initTheme } from './modules/theme.js';
import { initProductCards } from './modules/product-cards.js';
import { initGlassEffects } from './modules/glass-effects.js';

// App configuration
const APP_CONFIG = {
    theme: {
        storageKey: 'swm-theme',
        default: 'light'
    },
    sidebar: {
        breakpoint: 768,
        animationDuration: 300
    },
    api: {
        baseUrl: '/api/storefront',
        cartEndpoint: '/carts'
    }
};

/**
 * Initialize the application
 */
async function initApp() {
    try {
        // Core initializations
        initTheme(APP_CONFIG.theme);
        initSidebar(APP_CONFIG.sidebar);
        initGlassEffects();
        
        // Initialize product cards if template exists
        const productTemplate = document.getElementById('tpl-product-card');
        if (productTemplate) {
            initProductCards(productTemplate, APP_CONFIG.api);
        }
        
        // Set current year
        const yearElements = document.querySelectorAll('[data-year]');
        yearElements.forEach(el => {
            el.textContent = new Date().getFullYear();
        });
        
        // Remove no-js class
        document.documentElement.classList.remove('no-js');
        
        // Log successful initialization
        console.log('🍄 Southwest Mushrooms app initialized');
        
    } catch (error) {
        console.error('App initialization failed:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for use in other modules
export { APP_CONFIG }; 