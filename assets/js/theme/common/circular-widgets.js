import $ from 'jquery';

export default class CircularWidgets {
    constructor() {
        this.$body = $('body');
        this.$widgets = $('.circular-widget[data-widget-action]');
        this.bindEvents();
        this.initTheme();
    }

    bindEvents() {
        this.$widgets.on('click', (event) => {
            const $widget = $(event.currentTarget);
            const action = $widget.data('widget-action');
            
            switch (action) {
                case 'calculator':
                    this.toggleCalculator();
                    break;
                case 'notifications':
                    this.toggleNotifications();
                    break;
                case 'theme-toggle':
                    this.toggleTheme();
                    break;
                default:
                    console.warn(`Unknown widget action: ${action}`);
            }
        });
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.$body.attr('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleCalculator() {
        // TODO: Implement calculator modal
        console.log('Calculator widget clicked');
        // For now, just show an alert
        alert('Calculator feature coming soon!');
    }

    toggleNotifications() {
        // TODO: Implement notifications panel
        console.log('Notifications widget clicked');
        // For now, just show an alert
        alert('Notifications feature coming soon!');
    }

    toggleTheme() {
        const currentTheme = this.$body.attr('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.$body.attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const $lightIcon = $('.theme-icon-light');
        const $darkIcon = $('.theme-icon-dark');
        
        if (theme === 'dark') {
            $lightIcon.hide();
            $darkIcon.show();
        } else {
            $lightIcon.show();
            $darkIcon.hide();
        }
    }
} 