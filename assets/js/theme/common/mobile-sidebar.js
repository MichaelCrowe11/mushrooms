/**
 * Mobile Sidebar Navigation with Product Widgets
 * Handles the pull-out navigation for mobile devices
 */

export default class MobileSidebar {
    constructor() {
        this.sidebar = document.querySelector('.glass-sidebar');
        this.mobileToggle = document.querySelector('.mobile-toggle');
        this.overlay = document.querySelector('.sidebar-overlay');
        this.closeBtn = document.querySelector('.sidebar-close');
        this.body = document.body;
        
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        if (this.sidebar && this.mobileToggle) {
            this.init();
        }
    }
    
    init() {
        // Toggle button click
        this.mobileToggle.addEventListener('click', () => this.toggle());
        
        // Close button click
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        // Swipe gestures
        this.initSwipeGestures();
        
        // Handle widget clicks
        this.initWidgetNavigation();
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991 && this.isOpen) {
                this.close();
            }
        });
    }
    
    initSwipeGestures() {
        // Swipe to open from left edge
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        // Swipe to close on sidebar
        if (this.sidebar) {
            this.sidebar.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });
            
            this.sidebar.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                if (this.touchStartX - this.touchEndX > 50) {
                    this.close();
                }
            });
        }
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const edgeThreshold = 20;
        
        // Swipe right from left edge to open
        if (this.touchStartX < edgeThreshold && 
            this.touchEndX - this.touchStartX > swipeThreshold && 
            !this.isOpen) {
            this.open();
        }
    }
    
    initWidgetNavigation() {
        // Handle circular widget clicks for product navigation
        const productWidgets = document.querySelectorAll('.circular-widget[data-product-url]');
        
        productWidgets.forEach(widget => {
            widget.addEventListener('click', (e) => {
                e.preventDefault();
                const url = widget.getAttribute('data-product-url');
                const isQuickCheckout = widget.hasAttribute('data-quick-checkout');
                
                if (isQuickCheckout) {
                    // For quick checkout, close sidebar and navigate
                    this.close();
                    setTimeout(() => {
                        window.location.href = url + '?quick-checkout=true';
                    }, 300);
                } else {
                    // Regular navigation
                    window.location.href = url;
                }
            });
        });
        
        // Handle category widget clicks
        const categoryWidgets = document.querySelectorAll('.widget-grid--categories .circular-widget');
        categoryWidgets.forEach(widget => {
            widget.addEventListener('click', function(e) {
                // Add loading animation
                this.classList.add('widget-loading');
                
                // Visual feedback
                const ripple = document.createElement('span');
                ripple.className = 'widget-ripple';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        if (!this.sidebar) return;
        
        this.isOpen = true;
        this.sidebar.classList.add('is-open');
        this.mobileToggle.classList.add('active');
        this.body.classList.add('is-sidebar-open');
        
        if (this.overlay) {
            this.overlay.classList.add('is-visible');
        }
        
        // Trap focus
        this.trapFocus();
        
        // Announce to screen readers
        this.announceState('Navigation menu opened');
    }
    
    close() {
        if (!this.sidebar) return;
        
        this.isOpen = false;
        this.sidebar.classList.remove('is-open');
        this.mobileToggle.classList.remove('active');
        this.body.classList.remove('is-sidebar-open');
        
        if (this.overlay) {
            this.overlay.classList.remove('is-visible');
        }
        
        // Release focus trap
        this.releaseFocus();
        
        // Announce to screen readers
        this.announceState('Navigation menu closed');
    }
    
    trapFocus() {
        const focusableElements = this.sidebar.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        this.handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        };
        
        document.addEventListener('keydown', this.handleTabKey);
        
        // Focus first element
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }
    
    releaseFocus() {
        if (this.handleTabKey) {
            document.removeEventListener('keydown', this.handleTabKey);
        }
        
        // Return focus to toggle button
        if (this.mobileToggle) {
            this.mobileToggle.focus();
        }
    }
    
    announceState(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
}

// Widget loading animation styles
const style = document.createElement('style');
style.textContent = `
    .widget-loading {
        pointer-events: none;
        animation: widget-pulse 0.6s ease-in-out;
    }
    
    @keyframes widget-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); opacity: 0.7; }
        100% { transform: scale(1); }
    }
    
    .widget-ripple {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.5);
        animation: widget-ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes widget-ripple {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 200%;
            height: 200%;
            opacity: 0;
        }
    }
    
    /* Prevent body scroll when sidebar is open */
    body.is-sidebar-open {
        overflow: hidden;
        position: fixed;
        width: 100%;
    }
    
    /* Screen reader only class */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);