/**
 * SVG Animation Controller
 * Handles scroll-triggered animations for SVG elements
 */

export default class SvgAnimations {
    constructor() {
        this.svgElements = document.querySelectorAll('.swm-header-svg');
        this.observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }

    init() {
        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            // Fallback: just add the class immediately
            this.svgElements.forEach(svg => svg.classList.add('is-visible'));
            return;
        }

        // Create observer
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
        
        // Observe all SVG elements
        this.svgElements.forEach(svg => {
            this.observer.observe(svg);
        });

        // Also handle hover animations
        this.initHoverAnimations();
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class for CSS animations
                entry.target.classList.add('is-visible');
                
                // Optional: stop observing after animation
                // this.observer.unobserve(entry.target);
            }
        });
    }

    initHoverAnimations() {
        this.svgElements.forEach(svg => {
            const mushroomIcon = svg.querySelector('.mushroom-icon');
            if (!mushroomIcon) return;

            // Add subtle hover animation
            svg.addEventListener('mouseenter', () => {
                mushroomIcon.style.transform = 'scale(1.1)';
            });

            svg.addEventListener('mouseleave', () => {
                mushroomIcon.style.transform = 'scale(1)';
            });
        });
    }

    // Clean up method
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SvgAnimations();
}); 