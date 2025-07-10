export default class LazyLoad {
    constructor(options = {}) {
        this.options = {
            rootMargin: options.rootMargin || '50px 0px',
            threshold: options.threshold || 0.01,
            loadedClass: options.loadedClass || 'lazy-loaded',
            loadingClass: options.loadingClass || 'lazy-loading',
            errorClass: options.errorClass || 'lazy-error',
            ...options
        };
        
        this.images = [];
        this.imageObserver = null;
        
        this.init();
    }
    
    init() {
        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            this.loadImagesImmediately();
            return;
        }
        
        this.imageObserver = new IntersectionObserver(
            this.handleIntersection.bind(this),
            {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            }
        );
        
        this.collectImages();
        this.observeImages();
    }
    
    collectImages() {
        // Find all images with data-src or data-srcset
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset], picture > source[data-srcset]');
        this.images = Array.from(lazyImages);
    }
    
    observeImages() {
        this.images.forEach(image => {
            // Skip images that are already loaded
            if (image.classList.contains(this.options.loadedClass)) {
                return;
            }
            
            // Add loading class
            image.classList.add(this.options.loadingClass);
            
            // Observe the image
            this.imageObserver.observe(image);
        });
    }
    
    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }
    
    loadImage(image) {
        // Handle picture element sources
        if (image.tagName === 'SOURCE') {
            this.loadSource(image);
            return;
        }
        
        // Create a new image to preload
        const tempImage = new Image();
        
        // Set up load handlers
        tempImage.onload = () => {
            this.applyImage(image, tempImage.src);
            image.classList.remove(this.options.loadingClass);
            image.classList.add(this.options.loadedClass);
            
            // Trigger custom event
            this.triggerEvent(image, 'lazyloaded');
        };
        
        tempImage.onerror = () => {
            image.classList.remove(this.options.loadingClass);
            image.classList.add(this.options.errorClass);
            
            // Try fallback image if available
            if (image.dataset.fallback) {
                image.src = image.dataset.fallback;
            }
            
            // Trigger custom event
            this.triggerEvent(image, 'lazyerror');
        };
        
        // Start loading
        const src = image.dataset.src || image.dataset.srcset;
        if (src) {
            tempImage.src = src;
        }
    }
    
    loadSource(source) {
        if (source.dataset.srcset) {
            source.srcset = source.dataset.srcset;
            source.removeAttribute('data-srcset');
        }
    }
    
    applyImage(image, src) {
        // Apply srcset if available
        if (image.dataset.srcset) {
            image.srcset = image.dataset.srcset;
            image.removeAttribute('data-srcset');
        }
        
        // Apply sizes if available
        if (image.dataset.sizes) {
            image.sizes = image.dataset.sizes;
            image.removeAttribute('data-sizes');
        }
        
        // Apply src
        if (image.dataset.src) {
            image.src = src;
            image.removeAttribute('data-src');
        }
        
        // Apply background image if it's a div with data-bg
        if (image.dataset.bg) {
            image.style.backgroundImage = `url(${image.dataset.bg})`;
            image.removeAttribute('data-bg');
        }
    }
    
    loadImagesImmediately() {
        // Fallback for browsers without IntersectionObserver
        this.images.forEach(image => {
            if (image.tagName === 'SOURCE') {
                this.loadSource(image);
            } else {
                if (image.dataset.src) {
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                }
                if (image.dataset.srcset) {
                    image.srcset = image.dataset.srcset;
                    image.removeAttribute('data-srcset');
                }
                image.classList.add(this.options.loadedClass);
            }
        });
    }
    
    triggerEvent(element, eventName) {
        const event = new CustomEvent(eventName, {
            detail: { element },
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }
    
    // Public method to manually load an image
    load(image) {
        if (this.imageObserver) {
            this.imageObserver.unobserve(image);
        }
        this.loadImage(image);
    }
    
    // Public method to refresh and find new images
    refresh() {
        this.collectImages();
        this.observeImages();
    }
    
    // Public method to destroy the lazy loader
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
            this.imageObserver = null;
        }
        this.images = [];
    }
}

// Auto-initialize on DOM ready with default options
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.lazyLoader = new LazyLoad({
            rootMargin: '100px 0px',
            threshold: 0.01
        });
    });
} else {
    window.lazyLoader = new LazyLoad({
        rootMargin: '100px 0px',
        threshold: 0.01
    });
}

// Listen for dynamic content updates
document.addEventListener('contentUpdated', () => {
    if (window.lazyLoader) {
        window.lazyLoader.refresh();
    }
});