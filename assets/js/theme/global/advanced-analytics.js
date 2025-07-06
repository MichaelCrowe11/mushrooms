/**
 * Enhanced Analytics & Tracking System
 * Comprehensive e-commerce tracking for Southwest Mushrooms
 */

class AdvancedAnalytics {
    constructor() {
        this.initializeAnalytics();
        this.setupEventListeners();
        this.trackPageMetrics();
    }

    initializeAnalytics() {
        // Enhanced Google Analytics 4 setup
        if (typeof gtag !== 'undefined') {
            this.setupGA4EnhancedEcommerce();
        }

        // Performance tracking
        this.trackPerformanceMetrics();
        
        // User engagement tracking
        this.trackUserEngagement();
    }

    setupGA4EnhancedEcommerce() {
        // Enhanced ecommerce configuration
        gtag('config', 'GA_MEASUREMENT_ID', {
            custom_map: {
                custom_parameter_1: 'mushroom_variety',
                custom_parameter_2: 'product_category',
                custom_parameter_3: 'customer_type'
            },
            enhanced_conversions: true,
            allow_enhanced_conversions: true
        });

        // Set default enhanced ecommerce data
        gtag('config', 'GA_MEASUREMENT_ID', {
            currency: 'USD',
            country: 'US',
            language: 'en-US'
        });
    }

    // Enhanced product tracking
    trackProductView(productData) {
        const enhancedData = {
            currency: 'USD',
            value: parseFloat(productData.price),
            items: [{
                item_id: productData.sku,
                item_name: productData.name,
                item_category: productData.category,
                item_category2: productData.subcategory,
                item_variant: productData.variant,
                price: parseFloat(productData.price),
                quantity: 1,
                // Custom parameters
                mushroom_variety: productData.variety,
                product_category: productData.category,
                freshness_rating: productData.freshness,
                organic_certified: productData.organic
            }]
        };

        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_item', enhancedData);
        }

        // Custom product view tracking
        this.trackCustomEvent('product_view', {
            product_id: productData.sku,
            product_name: productData.name,
            product_price: productData.price,
            product_category: productData.category,
            view_timestamp: new Date().toISOString(),
            page_url: window.location.href
        });
    }

    // Enhanced add to cart tracking
    trackAddToCart(productData, quantity = 1) {
        const enhancedData = {
            currency: 'USD',
            value: parseFloat(productData.price) * quantity,
            items: [{
                item_id: productData.sku,
                item_name: productData.name,
                item_category: productData.category,
                item_category2: productData.subcategory,
                price: parseFloat(productData.price),
                quantity: quantity,
                // Enhanced tracking
                mushroom_variety: productData.variety,
                product_freshness: productData.freshness,
                add_to_cart_method: productData.addMethod || 'product_page'
            }]
        };

        if (typeof gtag !== 'undefined') {
            gtag('event', 'add_to_cart', enhancedData);
        }

        // Heat mapping for add to cart buttons
        this.trackHeatmapEvent('add_to_cart_click', {
            element_position: this.getElementPosition(event.target),
            product_id: productData.sku,
            timestamp: Date.now()
        });

        // Conversion funnel tracking
        this.trackFunnelStep('add_to_cart', {
            product_id: productData.sku,
            quantity: quantity,
            cart_value: this.getCartTotal()
        });
    }

    // Enhanced purchase tracking
    trackPurchase(orderData) {
        const enhancedData = {
            transaction_id: orderData.orderId,
            value: parseFloat(orderData.total),
            tax: parseFloat(orderData.tax),
            shipping: parseFloat(orderData.shipping),
            currency: 'USD',
            coupon: orderData.coupon || '',
            items: orderData.items.map(item => ({
                item_id: item.sku,
                item_name: item.name,
                item_category: item.category,
                item_category2: item.subcategory,
                price: parseFloat(item.price),
                quantity: item.quantity,
                // Enhanced tracking
                mushroom_variety: item.variety,
                product_freshness: item.freshness,
                bulk_order: item.quantity >= 10
            }))
        };

        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', enhancedData);
        }

        // Customer lifetime value tracking
        this.updateCustomerLTV(orderData);

        // Revenue attribution
        this.trackRevenueAttribution(orderData);
    }

    // Performance metrics tracking
    trackPerformanceMetrics() {
        // Core Web Vitals
        if ('web-vital' in window) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(this.sendToAnalytics.bind(this));
                getFID(this.sendToAnalytics.bind(this));
                getFCP(this.sendToAnalytics.bind(this));
                getLCP(this.sendToAnalytics.bind(this));
                getTTFB(this.sendToAnalytics.bind(this));
            });
        }

        // Page load timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                this.trackCustomEvent('page_performance', {
                    page_load_time: perfData.loadEventEnd - perfData.loadEventStart,
                    dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    first_contentful_paint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
                    page_url: window.location.href
                });
            }, 1000);
        });
    }

    // User engagement tracking
    trackUserEngagement() {
        let startTime = Date.now();
        let isActive = true;
        let scrollDepth = 0;
        let maxScrollDepth = 0;

        // Scroll depth tracking
        const trackScrollDepth = () => {
            const scrollPercentage = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercentage > maxScrollDepth) {
                maxScrollDepth = scrollPercentage;
                
                // Track scroll milestones
                if ([25, 50, 75, 90].includes(scrollPercentage)) {
                    this.trackCustomEvent('scroll_depth', {
                        scroll_percentage: scrollPercentage,
                        page_url: window.location.href,
                        timestamp: Date.now()
                    });
                }
            }
        };

        window.addEventListener('scroll', _.throttle(trackScrollDepth, 500));

        // Page visibility tracking
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackCustomEvent('page_hidden', {
                    time_on_page: Date.now() - startTime,
                    max_scroll_depth: maxScrollDepth
                });
                isActive = false;
            } else {
                startTime = Date.now();
                isActive = true;
            }
        });

        // Click heatmap tracking
        document.addEventListener('click', (event) => {
            this.trackHeatmapEvent('click', {
                element_tag: event.target.tagName,
                element_class: event.target.className,
                element_id: event.target.id,
                click_position: this.getElementPosition(event.target),
                page_url: window.location.href
            });
        });
    }

    // A/B testing integration
    trackABTest(testName, variant) {
        this.trackCustomEvent('ab_test_view', {
            test_name: testName,
            variant: variant,
            timestamp: Date.now(),
            page_url: window.location.href
        });

        // Set custom dimension for segmentation
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                custom_map: { custom_parameter_4: 'ab_test_variant' }
            });
            gtag('event', 'custom_event', {
                ab_test_variant: `${testName}_${variant}`
            });
        }
    }

    // Cart abandonment tracking
    trackCartAbandonment() {
        const cartData = this.getCartData();
        if (cartData.items.length > 0) {
            this.trackCustomEvent('cart_abandonment', {
                cart_value: cartData.total,
                item_count: cartData.items.length,
                abandonment_stage: this.getCartStage(),
                time_in_cart: this.getTimeInCart(),
                timestamp: Date.now()
            });
        }
    }

    // Search tracking
    trackSearch(searchQuery, resultsCount, filterData = {}) {
        this.trackCustomEvent('site_search', {
            search_query: searchQuery,
            results_count: resultsCount,
            filters_applied: Object.keys(filterData).length,
            filters: filterData,
            timestamp: Date.now()
        });

        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                search_term: searchQuery,
                content_type: 'product',
                results_count: resultsCount
            });
        }
    }

    // Custom event tracking
    trackCustomEvent(eventName, eventData) {
        // Send to multiple analytics platforms
        const enrichedData = {
            ...eventData,
            session_id: this.getSessionId(),
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            page_referrer: document.referrer,
            utm_source: this.getUTMParameter('utm_source'),
            utm_medium: this.getUTMParameter('utm_medium'),
            utm_campaign: this.getUTMParameter('utm_campaign')
        };

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, enrichedData);
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', eventName, enrichedData);
        }

        // Custom analytics endpoint
        this.sendToCustomAnalytics(eventName, enrichedData);
    }

    // Utility methods
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height
        };
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    getUTMParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name) || '';
    }

    getCartData() {
        // Implementation depends on cart system
        try {
            return JSON.parse(localStorage.getItem('cart_data')) || { items: [], total: 0 };
        } catch {
            return { items: [], total: 0 };
        }
    }

    getCartTotal() {
        return this.getCartData().total || 0;
    }

    sendToCustomAnalytics(eventName, data) {
        // Send to custom analytics endpoint
        fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventName,
                data: data,
                timestamp: Date.now()
            })
        }).catch(err => console.warn('Analytics tracking failed:', err));
    }

    sendToAnalytics(metric) {
        // Send Core Web Vitals to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                event_category: 'Web Vitals',
                event_label: metric.id,
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                non_interaction: true
            });
        }
    }

    // Heat mapping utilities
    trackHeatmapEvent(eventType, data) {
        // Store heat mapping data
        const heatmapData = JSON.parse(localStorage.getItem('heatmap_data') || '[]');
        heatmapData.push({
            type: eventType,
            ...data,
            timestamp: Date.now()
        });

        // Keep only last 1000 events
        if (heatmapData.length > 1000) {
            heatmapData.splice(0, heatmapData.length - 1000);
        }

        localStorage.setItem('heatmap_data', JSON.stringify(heatmapData));
    }

    // Conversion funnel tracking
    trackFunnelStep(stepName, stepData) {
        const funnelData = JSON.parse(localStorage.getItem('funnel_data') || '{}');
        funnelData[stepName] = {
            ...stepData,
            timestamp: Date.now(),
            session_id: this.getSessionId()
        };
        localStorage.setItem('funnel_data', JSON.stringify(funnelData));

        this.trackCustomEvent('funnel_step', {
            step_name: stepName,
            ...stepData
        });
    }
}

// Initialize enhanced analytics
const analytics = new AdvancedAnalytics();

// Export for global use
window.AdvancedAnalytics = analytics;

export default AdvancedAnalytics;
