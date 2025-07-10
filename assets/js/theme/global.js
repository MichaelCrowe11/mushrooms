import 'focus-within-polyfill';

import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import carousel from './common/carousel';
import svgInjector from './global/svg-injector';
import SvgAnimations from './common/svg-animations';
import CircularWidgets from './common/circular-widgets';
import Sidebar from './common/sidebar';
import AIChat from './common/ai-chat';
import PerformanceMonitor from './common/performance-monitor';
import LazyLoad from './common/lazy-load';

export default class Global extends PageManager {
    onReady() {
        // Initialize performance monitoring first
        new PerformanceMonitor();
        
        // Initialize lazy loading for images
        new LazyLoad({
            rootMargin: '100px 0px',
            threshold: 0.01
        });
        
        const { cartId, secureBaseUrl } = this.context;
        cartPreview(secureBaseUrl, cartId);
        quickSearch();
        currencySelector(cartId);
        foundation($(document));
        quickView(this.context);
        carousel(this.context);
        menu();
        mobileMenuToggle();
        svgInjector();
        
        // Initialize custom components
        new SvgAnimations();
        new CircularWidgets();
        new Sidebar();
        new AIChat();
    }
}
