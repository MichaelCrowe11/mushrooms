/**
 * Quick Checkout Optimization
 * Handles streamlined checkout process for product widgets
 */

export default class QuickCheckout {
    constructor() {
        this.init();
    }
    
    init() {
        // Check if we're on a product page with quick checkout parameter
        const urlParams = new URLSearchParams(window.location.search);
        const isQuickCheckout = urlParams.get('quick-checkout') === 'true';
        
        if (isQuickCheckout && this.isProductPage()) {
            this.initializeQuickCheckout();
        }
        
        // Handle quick add to cart from widgets
        this.initQuickAddButtons();
    }
    
    isProductPage() {
        // Check if we're on a product page
        return document.querySelector('.productView') !== null;
    }
    
    initializeQuickCheckout() {
        // Auto-scroll to product form
        const productForm = document.querySelector('.productView-details');
        if (productForm) {
            setTimeout(() => {
                productForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
        
        // Highlight add to cart button
        const addToCartBtn = document.querySelector('[data-event-type="product-click"][data-button-type="add-cart"], .productView-details .form-action .button--primary');
        if (addToCartBtn) {
            addToCartBtn.classList.add('quick-checkout-highlight');
            
            // Add pulsing animation
            const style = document.createElement('style');
            style.textContent = `
                .quick-checkout-highlight {
                    animation: pulse-highlight 2s ease-in-out infinite;
                    box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
                }
                
                @keyframes pulse-highlight {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
                    }
                    50% {
                        transform: scale(1.05);
                        box-shadow: 0 0 30px rgba(76, 175, 80, 0.8);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show quick checkout banner
        this.showQuickCheckoutBanner();
        
        // Pre-select default options if available
        this.preselectDefaultOptions();
    }
    
    showQuickCheckoutBanner() {
        const banner = document.createElement('div');
        banner.className = 'quick-checkout-banner';
        banner.innerHTML = `
            <div class="banner-content">
                <span class="banner-icon">⚡</span>
                <span class="banner-text">Quick Checkout Mode - Add to cart for fast checkout!</span>
                <button class="banner-close" aria-label="Close banner">&times;</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .quick-checkout-banner {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: slide-down 0.5s ease-out;
            }
            
            .banner-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .banner-icon {
                font-size: 1.5rem;
            }
            
            .banner-text {
                font-weight: 600;
            }
            
            .banner-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                margin-left: 1rem;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            
            .banner-close:hover {
                opacity: 1;
            }
            
            @keyframes slide-down {
                from {
                    transform: translateX(-50%) translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(banner);
        
        // Close button functionality
        banner.querySelector('.banner-close').addEventListener('click', () => {
            banner.style.animation = 'slide-down 0.5s ease-out reverse';
            setTimeout(() => banner.remove(), 500);
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (banner.parentNode) {
                banner.style.animation = 'slide-down 0.5s ease-out reverse';
                setTimeout(() => banner.remove(), 500);
            }
        }, 5000);
    }
    
    preselectDefaultOptions() {
        // Auto-select first available option for required fields
        const requiredOptions = document.querySelectorAll('.productView-options .form-field--required');
        
        requiredOptions.forEach(field => {
            const select = field.querySelector('select');
            const radioButtons = field.querySelectorAll('input[type="radio"]');
            
            if (select && select.options.length > 1) {
                // Skip the "please choose" option and select the first real option
                select.selectedIndex = 1;
                // Trigger change event
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
            } else if (radioButtons.length > 0) {
                // Select the first radio button
                radioButtons[0].checked = true;
                const event = new Event('change', { bubbles: true });
                radioButtons[0].dispatchEvent(event);
            }
        });
    }
    
    initQuickAddButtons() {
        // Add quick add functionality to product cards
        document.addEventListener('click', (e) => {
            const quickAddBtn = e.target.closest('.quick-add-btn');
            if (!quickAddBtn) return;
            
            e.preventDefault();
            const productId = quickAddBtn.dataset.productId;
            
            if (productId) {
                this.quickAddToCart(productId, quickAddBtn);
            }
        });
    }
    
    async quickAddToCart(productId, button) {
        // Show loading state
        const originalText = button.textContent;
        button.textContent = 'Adding...';
        button.disabled = true;
        
        try {
            // Get product data
            const response = await fetch(`/api/storefront/products/${productId}`, {
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch product');
            
            const productData = await response.json();
            
            // Check if product has options
            if (productData.options && productData.options.length > 0) {
                // Redirect to product page for options selection
                window.location.href = `${productData.url}?quick-checkout=true`;
                return;
            }
            
            // Add to cart directly if no options
            const formData = new FormData();
            formData.append('product_id', productId);
            formData.append('qty[]', '1');
            
            const addResponse = await fetch('/remote/v1/cart/add', {
                method: 'POST',
                credentials: 'same-origin',
                body: formData
            });
            
            if (!addResponse.ok) throw new Error('Failed to add to cart');
            
            // Success feedback
            button.textContent = '✓ Added!';
            button.classList.add('success');
            
            // Update cart count
            this.updateCartCount();
            
            // Show success toast
            this.showSuccessToast(productData.title || 'Product');
            
            // Reset button after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('success');
            }, 2000);
            
        } catch (error) {
            console.error('Quick add error:', error);
            button.textContent = 'Error';
            button.classList.add('error');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.classList.remove('error');
            }, 2000);
        }
    }
    
    async updateCartCount() {
        try {
            const response = await fetch('/api/storefront/cart', {
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) return;
            
            const cart = await response.json();
            const cartCount = cart.lineItems.physicalItems.reduce((acc, item) => acc + item.quantity, 0);
            
            // Update all cart count badges
            document.querySelectorAll('.cart-quantity-badge, .widget-badge').forEach(badge => {
                badge.textContent = cartCount;
                badge.style.display = cartCount > 0 ? 'flex' : 'none';
            });
        } catch (error) {
            console.error('Failed to update cart count:', error);
        }
    }
    
    showSuccessToast(productName) {
        const toast = document.createElement('div');
        toast.className = 'quick-add-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">✓</span>
                <span class="toast-text">${productName} added to cart!</span>
                <a href="/cart.php" class="toast-link">View Cart</a>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#quick-add-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'quick-add-toast-styles';
            style.textContent = `
                .quick-add-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #4CAF50;
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    animation: toast-slide-in 0.3s ease-out;
                }
                
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .toast-icon {
                    font-size: 1.25rem;
                }
                
                .toast-link {
                    color: white;
                    text-decoration: underline;
                    margin-left: 1rem;
                    font-weight: 600;
                }
                
                .toast-link:hover {
                    text-decoration: none;
                }
                
                @keyframes toast-slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'toast-slide-in 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}