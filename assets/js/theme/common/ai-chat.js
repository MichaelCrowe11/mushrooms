import $ from 'jquery';

export default class AIChat {
    constructor() {
        try {
            this.initializeChat();
        } catch (error) {
            console.error('AI Chat initialization failed:', error);
            this.showFallbackUI();
        }
    }
    
    initializeChat() {
        this.$widget = $('#aiChatWidget');
        this.$toggle = $('#aiChatToggle');
        this.$overlay = $('#aiChatOverlay');
        this.$messages = $('#chatMessages');
        this.$input = $('.chat-input-field');
        this.isOpen = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Fallback avatar SVG
        this.fallbackAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM0Q0FGNTAiLz4KPHBhdGggZD0iTTI0IDI4QzI4LjQxODMgMjggMzIgMjQuNDE4MyAzMiAyMEMzMiAxNS41ODE3IDI4LjQxODMgMTIgMjQgMTJDMTkuNTgxNyAxMiAxNiAxNS41ODE3IDE2IDIwQzE2IDI0LjQxODMgMTkuNTgxNyAyOCAyNCAyOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNCAzMkMxNi4yNjggMzIgMTAgMzUuNTgyIDEwIDQwVjQySDM4VjQwQzM4IDM1LjU4MiAzMS43MzIgMzIgMjQgMzJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=';
        
        this.responses = {
            beginner: "Welcome to mushroom cultivation! I'd recommend starting with our Oyster Mushroom Grow Kit - it's the most forgiving for beginners and produces amazing results. Would you like me to show you our beginner-friendly products?",
            desert: "Growing mushrooms in the desert requires special techniques! The key is maintaining proper humidity (80-95%) and temperature control. Our Desert Cultivation Guide covers everything you need. We also have specially adapted strains that thrive in low-humidity environments.",
            troubleshoot: "I'd be happy to help troubleshoot! What issues are you experiencing? Common problems include: contamination (green/black mold), slow growth, no fruiting, or dry mushrooms. Please describe what you're seeing.",
            products: "Based on your needs, I can recommend: 🍄 Grow Kits for beginners, 🧪 Liquid Cultures for experienced growers, 📚 Complete cultivation courses, or 🌵 Desert-adapted strains. What's your experience level?"
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupAutoResize();
        this.preloadImages();
    }
    
    bindEvents() {
        // Toggle chat
        this.$toggle.on('click', () => this.toggleChat());
        this.$overlay.on('click', () => this.closeChat());
        
        // Header actions
        $('.chat-action-btn[data-action="minimize"]').on('click', () => this.closeChat());
        $('.chat-action-btn[data-action="close"]').on('click', () => this.closeChat());
        
        // Send message
        $('.input-action-btn[data-action="send"]').on('click', () => this.sendMessage());
        this.$input.on('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Suggestion chips
        $(document).on('click', '.suggestion-chip', (e) => {
            const suggestion = $(e.target).data('suggestion');
            this.handleSuggestion(suggestion);
        });
        
        // Quick actions
        $('.quick-action-btn').on('click', (e) => {
            const action = $(e.target).closest('.quick-action-btn').data('action');
            this.handleQuickAction(action);
        });
        
        // Error event listeners
        window.addEventListener('error', (e) => {
            if (e.filename && e.filename.includes('ai-chat')) {
                this.handleError(e.error);
            }
        });
    }
    
    setupAutoResize() {
        this.$input.on('input', () => {
            try {
                this.$input.css('height', 'auto');
                const maxRows = parseInt(this.$input.data('max-rows')) || 4;
                const lineHeight = parseInt(this.$input.css('line-height')) || 24;
                const maxHeight = maxRows * lineHeight;
                const scrollHeight = this.$input[0].scrollHeight;
                
                if (scrollHeight <= maxHeight) {
                    this.$input.css('height', scrollHeight + 'px');
                } else {
                    this.$input.css('height', maxHeight + 'px');
                }
            } catch (error) {
                console.warn('Auto-resize failed:', error);
            }
        });
    }
    
    preloadImages() {
        const avatarUrl = this.getAvatarUrl();
        const img = new Image();
        img.onerror = () => {
            console.warn('Avatar image failed to load, using fallback');
            this.avatarUrl = this.fallbackAvatar;
        };
        img.onload = () => {
            this.avatarUrl = avatarUrl;
        };
        img.src = avatarUrl;
    }
    
    getAvatarUrl() {
        const cdnUrl = window.theme_settings?.cdn_url || '';
        const avatarPath = '/assets/img/crowe-ai-avatar.png';
        
        // Check if we're in development or production
        if (window.location.hostname === 'localhost') {
            return this.fallbackAvatar;
        }
        
        return cdnUrl + avatarPath;
    }
    
    toggleChat() {
        try {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        } catch (error) {
            this.handleError(error);
        }
    }
    
    openChat() {
        try {
            this.isOpen = true;
            this.$widget.attr('data-state', 'open');
            this.$input.focus();
            
            // Add welcome message if first time
            if (this.$messages.find('.chat-message').length === 1) {
                setTimeout(() => {
                    this.addAIMessage("I'm here to help you succeed with mushroom cultivation! Feel free to ask me anything about growing techniques, product recommendations, or troubleshooting.");
                }, 500);
            }
        } catch (error) {
            this.handleError(error);
        }
    }
    
    closeChat() {
        try {
            this.isOpen = false;
            this.$widget.attr('data-state', 'minimized');
        } catch (error) {
            this.handleError(error);
        }
    }
    
    sendMessage() {
        try {
            const message = this.$input.val().trim();
            if (!message) return;
            
            // Add user message
            this.addUserMessage(message);
            this.$input.val('').trigger('input');
            
            // Show typing indicator
            this.showTyping();
            
            // Simulate AI response
            setTimeout(() => {
                this.hideTyping();
                const response = this.generateResponse(message);
                this.addAIMessage(response);
            }, 1000 + Math.random() * 1000);
        } catch (error) {
            this.handleError(error);
            this.hideTyping();
            this.addAIMessage("I apologize, but I encountered an error. Please try again or contact support if the issue persists.");
        }
    }
    
    addUserMessage(text) {
        try {
            const messageHtml = `
                <div class="chat-message chat-message--user">
                    <div class="message-content">
                        <p class="message-text">${this.escapeHtml(text)}</p>
                    </div>
                    <span class="message-time">${this.getCurrentTime()}</span>
                </div>
            `;
            this.$messages.append(messageHtml);
            this.scrollToBottom();
        } catch (error) {
            this.handleError(error);
        }
    }
    
    addAIMessage(text, suggestions = null) {
        try {
            const avatarUrl = this.avatarUrl || this.fallbackAvatar;
            const suggestionsHtml = suggestions ? `
                <div class="message-suggestions">
                    ${suggestions.map(s => `<button class="suggestion-chip" data-suggestion="${s.key}">${s.text}</button>`).join('')}
                </div>
            ` : '';
            
            const messageHtml = `
                <div class="chat-message chat-message--ai">
                    <div class="message-avatar">
                        <img src="${avatarUrl}" alt="AI" onerror="this.src='${this.fallbackAvatar}'" />
                    </div>
                    <div class="message-content">
                        <p class="message-text">${text}</p>
                        ${suggestionsHtml}
                    </div>
                    <span class="message-time">${this.getCurrentTime()}</span>
                </div>
            `;
            this.$messages.append(messageHtml);
            this.scrollToBottom();
        } catch (error) {
            this.handleError(error);
        }
    }
    
    handleSuggestion(suggestion) {
        try {
            const response = this.responses[suggestion];
            if (response) {
                this.addUserMessage($(`[data-suggestion="${suggestion}"]`).first().text());
                this.showTyping();
                setTimeout(() => {
                    this.hideTyping();
                    this.addAIMessage(response);
                }, 1000);
            }
        } catch (error) {
            this.handleError(error);
        }
    }
    
    handleQuickAction(action) {
        try {
            switch(action) {
                case 'catalog':
                    window.location.href = '/categories';
                    break;
                case 'guides':
                    window.location.href = '/learn';
                    break;
                case 'contact':
                    this.addAIMessage("I'll connect you with our expert team! You can reach us at support@southwestmushrooms.com or call (555) 123-4567. We're here Monday-Friday 9AM-5PM MST.");
                    break;
                default:
                    console.warn('Unknown quick action:', action);
            }
        } catch (error) {
            this.handleError(error);
        }
    }
    
    generateResponse(message) {
        try {
            const lowerMessage = message.toLowerCase();
            
            // Simple keyword matching for demo
            if (lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
                return this.responses.beginner;
            } else if (lowerMessage.includes('desert') || lowerMessage.includes('dry') || lowerMessage.includes('arid')) {
                return this.responses.desert;
            } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('help')) {
                return this.responses.troubleshoot;
            } else if (lowerMessage.includes('buy') || lowerMessage.includes('product') || lowerMessage.includes('recommend')) {
                return this.responses.products;
            } else if (lowerMessage.includes('contaminat')) {
                return "Contamination is the #1 challenge! Green mold (Trichoderma) is most common. To prevent: 1) Always sterilize equipment, 2) Work in a clean area, 3) Use proper sterile technique. If contaminated, isolate immediately. Would you like our detailed contamination prevention guide?";
            } else if (lowerMessage.includes('temperature') || lowerMessage.includes('temp')) {
                return "Temperature is crucial! Most gourmet mushrooms fruit best at 65-75°F. In the desert, use AC or evaporative cooling. Oysters tolerate heat better (up to 85°F). Lions Mane prefers cooler temps (65-70°F). Need specific temperature advice for your species?";
            } else {
                return "Great question! I'm constantly learning about mushroom cultivation. For now, I can help with: beginner advice, desert growing tips, troubleshooting, and product recommendations. What would you like to know more about?";
            }
        } catch (error) {
            this.handleError(error);
            return "I apologize, but I'm having trouble processing your request. Please try rephrasing your question or contact our support team for assistance.";
        }
    }
    
    showTyping() {
        try {
            const avatarUrl = this.avatarUrl || this.fallbackAvatar;
            const typingHtml = `
                <div class="chat-message chat-message--ai chat-typing">
                    <div class="message-avatar">
                        <img src="${avatarUrl}" alt="AI" onerror="this.src='${this.fallbackAvatar}'" />
                    </div>
                    <div class="message-content">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            `;
            this.$messages.append(typingHtml);
            this.scrollToBottom();
        } catch (error) {
            console.warn('Failed to show typing indicator:', error);
        }
    }
    
    hideTyping() {
        try {
            this.$messages.find('.chat-typing').remove();
        } catch (error) {
            console.warn('Failed to hide typing indicator:', error);
        }
    }
    
    scrollToBottom() {
        try {
            this.$messages.scrollTop(this.$messages[0].scrollHeight);
        } catch (error) {
            console.warn('Failed to scroll to bottom:', error);
        }
    }
    
    getCurrentTime() {
        try {
            return new Date().toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        } catch (error) {
            return 'Now';
        }
    }
    
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
    
    handleError(error) {
        console.error('AI Chat Error:', error);
        
        // Log to analytics if available
        if (window.gtag) {
            gtag('event', 'exception', {
                description: error.toString(),
                fatal: false,
                error_source: 'ai_chat'
            });
        }
        
        // Increment retry count
        this.retryCount++;
        
        // Show error message if too many retries
        if (this.retryCount > this.maxRetries) {
            this.showFallbackUI();
        }
    }
    
    showFallbackUI() {
        const fallbackHtml = `
            <div class="ai-chat-error-state">
                <div class="error-icon">⚠️</div>
                <p class="error-message">Chat temporarily unavailable</p>
                <button class="error-retry-btn" onclick="location.reload()">Refresh Page</button>
                <p class="error-contact">Or email us at <a href="mailto:support@southwestmushrooms.com">support@southwestmushrooms.com</a></p>
            </div>
        `;
        
        if (this.$widget.length) {
            this.$widget.html(fallbackHtml);
        }
    }
}