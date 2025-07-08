/**
 * Cart Quantity Stepper and Error Toast for Southwest Mushrooms
 * Glass-morphism theme compatible
 */

class CartFixer {
  constructor() {
    this.init();
  }

  init() {
    this.setupQuantitySteppers();
    this.setupErrorToast();
    this.bindEvents();
  }

  setupQuantitySteppers() {
    const quantityInputs = document.querySelectorAll('input[data-quantity-change], input[name="qty[]"]');
    
    quantityInputs.forEach(input => {
      if (!input.parentElement.querySelector('.qty-stepper')) {
        this.createQuantityStepper(input);
      }
    });
  }

  createQuantityStepper(input) {
    const wrapper = document.createElement('div');
    wrapper.className = 'qty-stepper glass-card';
    
    const decreaseBtn = document.createElement('button');
    decreaseBtn.type = 'button';
    decreaseBtn.className = 'qty-stepper__btn qty-stepper__btn--decrease glass-btn';
    decreaseBtn.innerHTML = '−';
    decreaseBtn.setAttribute('aria-label', 'Decrease quantity');
    
    const increaseBtn = document.createElement('button');
    increaseBtn.type = 'button';
    increaseBtn.className = 'qty-stepper__btn qty-stepper__btn--increase glass-btn';
    increaseBtn.innerHTML = '+';
    increaseBtn.setAttribute('aria-label', 'Increase quantity');
    
    // Style the input
    input.className = 'qty-stepper__input glass-input glass-text';
    input.setAttribute('min', '1');
    input.setAttribute('max', '999');
    
    // Wrap the input
    input.parentElement.insertBefore(wrapper, input);
    wrapper.appendChild(decreaseBtn);
    wrapper.appendChild(input);
    wrapper.appendChild(increaseBtn);
    
    // Bind events
    decreaseBtn.addEventListener('click', () => this.decreaseQuantity(input));
    increaseBtn.addEventListener('click', () => this.increaseQuantity(input));
    input.addEventListener('blur', () => this.validateQuantity(input));
  }

  decreaseQuantity(input) {
    const currentValue = parseInt(input.value, 10) || 1;
    const minValue = parseInt(input.getAttribute('min'), 10) || 1;
    
    if (currentValue > minValue) {
      input.value = currentValue - 1;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  increaseQuantity(input) {
    const currentValue = parseInt(input.value, 10) || 1;
    const maxValue = parseInt(input.getAttribute('max'), 10) || 999;
    
    if (currentValue < maxValue) {
      input.value = currentValue + 1;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  validateQuantity(input) {
    const value = parseInt(input.value, 10);
    const minValue = parseInt(input.getAttribute('min'), 10) || 1;
    const maxValue = parseInt(input.getAttribute('max'), 10) || 999;
    
    if (isNaN(value) || value < minValue) {
      input.value = minValue;
      this.showToast('Minimum quantity is ' + minValue, 'warning');
    } else if (value > maxValue) {
      input.value = maxValue;
      this.showToast('Maximum quantity is ' + maxValue, 'warning');
    }
    
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  setupErrorToast() {
    if (!document.querySelector('.cart-toast')) {
      const toast = document.createElement('div');
      toast.className = 'cart-toast glass-card';
      toast.innerHTML = `
        <div class="cart-toast__content">
          <div class="cart-toast__icon"></div>
          <div class="cart-toast__message glass-text"></div>
          <button class="cart-toast__close glass-btn" aria-label="Close notification">&times;</button>
        </div>
      `;
      document.body.appendChild(toast);
      
      // Close button functionality
      const closeBtn = toast.querySelector('.cart-toast__close');
      closeBtn.addEventListener('click', () => this.hideToast());
    }
  }

  showToast(message, type = 'info') {
    const toast = document.querySelector('.cart-toast');
    const messageEl = toast.querySelector('.cart-toast__message');
    const iconEl = toast.querySelector('.cart-toast__icon');
    
    messageEl.textContent = message;
    
    // Set icon based on type
    const icons = {
      success: '✓',
      error: '⚠',
      warning: '⚡',
      info: 'ℹ'
    };
    
    iconEl.textContent = icons[type] || icons.info;
    
    // Update toast classes
    toast.className = `cart-toast glass-card cart-toast--${type} cart-toast--visible`;
    
    // Auto-hide after 4 seconds
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 4000);
  }

  hideToast() {
    const toast = document.querySelector('.cart-toast');
    if (toast) {
      toast.classList.remove('cart-toast--visible');
    }
    clearTimeout(this.toastTimeout);
  }

  bindEvents() {
    // Listen for cart errors
    document.addEventListener('cart:error', (event) => {
      const message = event.detail?.message || 'An error occurred while updating the cart';
      this.showToast(message, 'error');
    });
    
    // Listen for cart success
    document.addEventListener('cart:success', (event) => {
      const message = event.detail?.message || 'Cart updated successfully';
      this.showToast(message, 'success');
    });
    
    // Listen for form submission errors
    document.addEventListener('submit', (event) => {
      if (event.target.dataset.cartItemAdd !== undefined || 
          event.target.dataset.cartItemUpdate !== undefined) {
        this.handleCartFormSubmission(event);
      }
    });
    
    // Re-initialize steppers when cart content changes
    const observer = new MutationObserver(() => {
      this.setupQuantitySteppers();
    });
    
    const cartContainers = document.querySelectorAll('[data-cart], .cart-content, #cart-contents');
    cartContainers.forEach(container => {
      observer.observe(container, { childList: true, subtree: true });
    });
  }

  handleCartFormSubmission(event) {
    const form = event.target;
    const button = form.querySelector('[data-button-state]');
    
    if (button) {
      // Show loading state
      button.classList.add('loading');
      button.disabled = true;
      
      // Handle form response
      setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
      }, 2000);
    }
  }
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.cartFixer = new CartFixer();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CartFixer;
}
