export default class PerformanceMonitor {
    constructor() {
        this.metrics = {
            lcp: null,
            fcp: null,
            cls: null,
            fid: null,
            ttfb: null
        };
        
        this.init();
    }
    
    init() {
        // Check if Performance API is available
        if (!('PerformanceObserver' in window)) {
            console.warn('PerformanceObserver not supported');
            return;
        }
        
        this.observeLCP();
        this.observeFCP();
        this.observeCLS();
        this.observeFID();
        this.measureTTFB();
        this.setupResourceHints();
    }
    
    observeLCP() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                
                console.log('LCP:', this.metrics.lcp);
                this.reportMetric('LCP', this.metrics.lcp);
                
                // Disconnect after capturing LCP
                observer.disconnect();
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
            console.warn('LCP observation failed:', error);
        }
    }
    
    observeFCP() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
                
                if (fcpEntry) {
                    this.metrics.fcp = fcpEntry.startTime;
                    console.log('FCP:', this.metrics.fcp);
                    this.reportMetric('FCP', this.metrics.fcp);
                }
            });
            
            observer.observe({ entryTypes: ['paint'] });
        } catch (error) {
            console.warn('FCP observation failed:', error);
        }
    }
    
    observeCLS() {
        try {
            let clsValue = 0;
            let clsEntries = [];
            
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // Only count layout shifts without user input
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                    }
                }
                
                this.metrics.cls = clsValue;
                console.log('CLS:', this.metrics.cls);
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
            
            // Report CLS when page is about to unload
            window.addEventListener('beforeunload', () => {
                this.reportMetric('CLS', this.metrics.cls);
            });
        } catch (error) {
            console.warn('CLS observation failed:', error);
        }
    }
    
    observeFID() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const firstInput = entries[0];
                
                if (firstInput) {
                    this.metrics.fid = firstInput.processingStart - firstInput.startTime;
                    console.log('FID:', this.metrics.fid);
                    this.reportMetric('FID', this.metrics.fid);
                    
                    // Disconnect after capturing FID
                    observer.disconnect();
                }
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        } catch (error) {
            console.warn('FID observation failed:', error);
        }
    }
    
    measureTTFB() {
        try {
            // Wait for the page to load
            window.addEventListener('load', () => {
                const navigationEntry = performance.getEntriesByType('navigation')[0];
                
                if (navigationEntry) {
                    this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.fetchStart;
                    console.log('TTFB:', this.metrics.ttfb);
                    this.reportMetric('TTFB', this.metrics.ttfb);
                }
            });
        } catch (error) {
            console.warn('TTFB measurement failed:', error);
        }
    }
    
    setupResourceHints() {
        // Add preconnect hints for external domains
        const preconnectDomains = [
            'https://fonts.gstatic.com',
            'https://www.googletagmanager.com',
            'https://cdn11.bigcommerce.com'
        ];
        
        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
        
        // Preload critical fonts
        const criticalFonts = [
            '/assets/fonts/inter-regular.woff2',
            '/assets/fonts/inter-semibold.woff2'
        ];
        
        criticalFonts.forEach(fontPath => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.href = fontPath;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    reportMetric(name, value) {
        // Send to Google Analytics if available
        if (window.gtag) {
            gtag('event', 'web_vitals', {
                event_category: 'Web Vitals',
                event_label: name,
                value: Math.round(value),
                non_interaction: true
            });
        }
        
        // Send to custom analytics endpoint if needed
        if (window.customAnalytics) {
            window.customAnalytics.track('performance_metric', {
                metric: name,
                value: value,
                timestamp: Date.now(),
                url: window.location.href
            });
        }
    }
    
    // Public method to get current metrics
    getMetrics() {
        return { ...this.metrics };
    }
    
    // Optimize images for better LCP
    static optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    // Optimize critical CSS
    static injectCriticalCSS() {
        const criticalCSS = `
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .glass-sidebar { position: fixed; top: 0; left: 0; width: 320px; height: 100vh; }
            .main-content { margin-left: 320px; min-height: 100vh; }
            .header-logo { display: block; max-width: 120px; height: auto; }
            @media (max-width: 991px) {
                .glass-sidebar { transform: translateX(-100%); }
                .main-content { margin-left: 0; }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.performanceMonitor = new PerformanceMonitor();
        PerformanceMonitor.optimizeImages();
        PerformanceMonitor.injectCriticalCSS();
    });
} else {
    window.performanceMonitor = new PerformanceMonitor();
    PerformanceMonitor.optimizeImages();
    PerformanceMonitor.injectCriticalCSS();
}