/**
 * Theme Toggle Functionality
 * Handles light/dark mode switching with localStorage persistence
 */

(function() {
    'use strict';

    // Theme management
    const THEME_KEY = 'sw-mushrooms-theme';
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark'
    };

    // Get saved theme or default to light
    function getSavedTheme() {
        return localStorage.getItem(THEME_KEY) || THEMES.LIGHT;
    }

    // Save theme to localStorage
    function saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update button aria-pressed state
        const themeButton = document.getElementById('theme-toggle');
        if (themeButton) {
            themeButton.setAttribute('aria-pressed', theme === THEMES.DARK);
        }
    }

    // Toggle between themes
    function toggleTheme() {
        const currentTheme = getSavedTheme();
        const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
        
        saveTheme(newTheme);
        applyTheme(newTheme);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
    }

    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Theme toggle button
        const themeButton = document.getElementById('theme-toggle');
        if (themeButton) {
            themeButton.addEventListener('click', toggleTheme);
        }

        // Keyboard shortcut (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyT') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            setupEventListeners();
        });
    } else {
        initTheme();
        setupEventListeners();
    }

    // Expose theme functions globally for debugging
    window.ThemeToggle = {
        toggle: toggleTheme,
        setTheme: function(theme) {
            if (Object.values(THEMES).includes(theme)) {
                saveTheme(theme);
                applyTheme(theme);
            }
        },
        getCurrentTheme: getSavedTheme
    };

})();