import $ from 'jquery';

export default class Sidebar {
    constructor() {
        this.$sidebar = $('.glass-sidebar');
        this.$sidebarToggle = $('.sidebar-toggle');
        this.$mobileToggle = $('.mobile-toggle');
        this.$body = $('body');
        this.isOpen = false;
        
        this.bindEvents();
        this.createOverlay();
    }
    
    bindEvents() {
        // Desktop sidebar toggle
        this.$sidebarToggle.on('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });
        
        // Mobile toggle button
        this.$mobileToggle.on('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });
        
        // Close on overlay click
        $(document).on('click', '.sidebar-overlay', () => {
            if (this.isOpen) {
                this.closeSidebar();
            }
        });
        
        // Close on escape key
        $(document).on('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });
        
        // Handle window resize
        $(window).on('resize', () => {
            if (window.innerWidth > 991 && this.isOpen) {
                this.closeSidebar();
            }
        });
    }
    
    createOverlay() {
        if (!$('.sidebar-overlay').length) {
            $('<div class="sidebar-overlay"></div>').appendTo('body');
        }
        this.$overlay = $('.sidebar-overlay');
    }
    
    toggleSidebar() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
    
    openSidebar() {
        this.isOpen = true;
        this.$sidebar.addClass('is-open');
        this.$body.addClass('is-sidebar-open');
        this.$overlay.addClass('is-visible');
        
        // Prevent body scroll on mobile
        if (window.innerWidth <= 991) {
            this.$body.css('overflow', 'hidden');
        }
    }
    
    closeSidebar() {
        this.isOpen = false;
        this.$sidebar.removeClass('is-open');
        this.$body.removeClass('is-sidebar-open');
        this.$overlay.removeClass('is-visible');
        
        // Restore body scroll
        this.$body.css('overflow', '');
    }
} 