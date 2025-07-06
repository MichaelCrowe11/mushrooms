import PageManager from './page-manager';
import { bind, debounce } from 'lodash';
import checkIsGiftCertValid from './common/gift-certificate-validator';
import { createTranslationDictionary } from './common/utils/translations-utils';
import utils from '@bigcommerce/stencil-utils';
import ShippingEstimator from './cart/shipping-estimator';
import { defaultModal, showAlertModal, ModalEvents } from './global/modal';
import CartItemDetails from './common/cart-item-details';

export default class Cart extends PageManager {
    onReady() {
        this.$cartContent = $('[data-cart-content]');
        this.$cartMessages = $('[data-cart-status]');
        this.$cartTotals = $('[data-cart-totals]');
        this.$cartAdditionalCheckoutBtns = $('[data-cart-additional-checkout-buttons]');
        this.$overlay = $('[data-cart] .loadingOverlay')
            .hide(); // TODO: temporary until remaining bugs are squashed
        this.$activeCartItemId = null;
        this.$activeCartItemBtnAction = null;

        this.setApplePaySupport();
        this.bindEvents();
        
        // Enhanced cart initialization
        this.initCartEnhancements();
    }

    /**
     * Initialize enhanced cart features
     */
    initCartEnhancements() {
        this.initAutoSave();
        this.initCartAnalytics();
        this.initCartValidation();
        this.initCartNotifications();
        this.initShippingCalculator();
    }

    /**
     * Initialize auto-save functionality
     */
    initAutoSave() {
        this.autoSaveTimeout = null;
        
        // Auto-save cart changes after 2 seconds of inactivity
        $(document).on('input', '[data-cart-quantity]', debounce(() => {
            this.autoSaveCart();
        }, 2000));
    }

    /**
     * Auto-save cart changes
     */
    autoSaveCart() {
        const $changedItems = $('[data-cart-quantity]').filter((index, element) => {
            const $input = $(element);
            return $input.val() !== $input.data('original-value');
        });

        if ($changedItems.length > 0) {
            this.showCartMessage('Saving changes...', 'info');
            
            // Save each changed item
            $changedItems.each((index, element) => {
                const $input = $(element);
                const itemId = $input.data('cart-itemid');
                const newQuantity = parseInt($input.val(), 10);
                
                if (newQuantity > 0) {
                    this.cartUpdate($input);
                }
            });
        }
    }

    /**
     * Initialize cart analytics tracking
     */
    initCartAnalytics() {
        // Track cart interactions
        $(document).on('click', '[data-cart-remove]', (event) => {
            const $item = $(event.currentTarget).closest('[data-cart-item]');
            const itemName = $item.find('[data-item-name]').text();
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'remove_from_cart', {
                    event_category: 'ecommerce',
                    event_label: itemName,
                    value: 0
                });
            }
        });

        // Track quantity changes
        $(document).on('change', '[data-cart-quantity]', (event) => {
            const $input = $(event.currentTarget);
            const $item = $input.closest('[data-cart-item]');
            const itemName = $item.find('[data-item-name]').text();
            const newQuantity = parseInt($input.val(), 10);
            const oldQuantity = parseInt($input.data('original-value'), 10) || 1;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cart_quantity_change', {
                    event_category: 'ecommerce',
                    event_label: itemName,
                    value: newQuantity - oldQuantity
                });
            }
        });
    }

    /**
     * Initialize cart validation
     */
    initCartValidation() {
        $(document).on('input', '[data-cart-quantity]', (event) => {
            const $input = $(event.currentTarget);
            const quantity = parseInt($input.val(), 10);
            const min = parseInt($input.data('quantity-min'), 10) || 1;
            const max = parseInt($input.data('quantity-max'), 10);
            
            // Clear previous validation
            $input.removeClass('form-input--error');
            $input.siblings('.quantity-error').remove();
            
            // Validate quantity
            if (isNaN(quantity) || quantity < min) {
                this.showQuantityError($input, `Minimum quantity is ${min}`);
                return false;
            }
            
            if (max && quantity > max) {
                this.showQuantityError($input, `Maximum quantity is ${max}`);
                return false;
            }
            
            return true;
        });
    }

    /**
     * Show quantity validation error
     * @param {jQuery} $input - Quantity input field
     * @param {string} message - Error message
     */
    showQuantityError($input, message) {
        $input.addClass('form-input--error');
        
        const $error = $(`<div class="quantity-error" role="alert">${message}</div>`);
        $input.after($error);
        
        // Auto-hide after 5 seconds
        setTimeout(() => $error.fadeOut(() => $error.remove()), 5000);
    }

    /**
     * Initialize cart notifications
     */
    initCartNotifications() {
        this.$cartNotifications = $('<div class="cart-notifications" aria-live="polite"></div>');
        this.$cartContent.prepend(this.$cartNotifications);
    }

    /**
     * Show cart message
     * @param {string} message - Message text
     * @param {string} type - Message type (success, error, info, warning)
     */
    showCartMessage(message, type = 'info') {
        const $message = $(`
            <div class="cart-message cart-message--${type}" role="alert">
                <span class="cart-message-icon" aria-hidden="true">
                    ${this.getMessageIcon(type)}
                </span>
                <span class="cart-message-text">${message}</span>
                <button class="cart-message-close" aria-label="Close message">×</button>
            </div>
        `);
        
        this.$cartNotifications.append($message);
        
        // Auto-hide after delay
        const delay = type === 'error' ? 8000 : 4000;
        setTimeout(() => {
            $message.fadeOut(() => $message.remove());
        }, delay);
        
        // Manual close
        $message.find('.cart-message-close').on('click', () => {
            $message.fadeOut(() => $message.remove());
        });
    }

    /**
     * Get icon for message type
     * @param {string} type - Message type
     * @returns {string} - Icon HTML
     */
    getMessageIcon(type) {
        const icons = {
            success: '✓',
            error: '⚠',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Initialize enhanced shipping calculator
     */
    initShippingCalculator() {
        // Enhanced shipping estimation with live updates
        $(document).on('change', '[data-shipping-calculator] select', debounce(() => {
            this.updateShippingEstimate();
        }, 500));
    }

    /**
     * Update shipping estimate
     */
    updateShippingEstimate() {
        const $calculator = $('[data-shipping-calculator]');
        const $country = $calculator.find('[name="shipping-country"]');
        const $state = $calculator.find('[name="shipping-state"]');
        
        if ($country.val() && $state.val()) {
            this.showCartMessage('Calculating shipping...', 'info');
            
            // Trigger shipping calculation
            utils.api.cart.getShippingQuotes({
                country_id: $country.val(),
                state_id: $state.val(),
                zip_code: $calculator.find('[name="shipping-zip"]').val()
            }, (err, response) => {
                if (err) {
                    this.showCartMessage('Error calculating shipping', 'error');
                    return;
                }
                
                this.updateShippingOptions(response.data);
                this.showCartMessage('Shipping updated', 'success');
            });
        }
    }

    /**
     * Update shipping options display
     * @param {Array} shippingOptions - Available shipping options
     */
    updateShippingOptions(shippingOptions) {
        const $container = $('[data-shipping-options]');
        
        if (shippingOptions.length === 0) {
            $container.html('<p>No shipping options available</p>');
            return;
        }
        
        const optionsHtml = shippingOptions.map(option => `
            <label class="shipping-option">
                <input type="radio" name="shipping-option" value="${option.id}" data-cost="${option.cost}">
                <span class="shipping-option-name">${option.name}</span>
                <span class="shipping-option-cost">${option.cost}</span>
            </label>
        `).join('');
        
        $container.html(optionsHtml);
        
        // Update totals when shipping option changes
        $container.on('change', 'input[name="shipping-option"]', () => {
            this.updateCartTotals();
        });
    }

    /**
     * Enhanced cart update with better UX
     */
    cartUpdate($target) {
        const itemId = $target.data('cart-itemid');
        const $row = $target.closest('.cart-item');
        const $input = $row.find('.cart-item-quantity-input');
        const preVal = parseInt($input.data('original-value'), 10);
        const targetVal = parseInt($input.val(), 10);
        
        // Validate quantity before update
        if (!this.validateQuantityInput($input)) {
            $input.val(preVal); // Reset to previous value
            return;
        }
        
        // Show loading state
        $row.addClass('cart-item--updating');
        this.showCartMessage('Updating item...', 'info');
        
        if (targetVal !== preVal) {
            utils.api.cart.itemUpdate(itemId, targetVal, (err, response) => {
                this.cartUpdateQtyTextChange($input, preVal);
                
                $row.removeClass('cart-item--updating');
                
                if (response.data.status === 'succeed') {
                    // Update was successful
                    $input.data('original-value', targetVal);
                    this.refreshContent(response.data.remove);
                    this.showCartMessage('Item updated successfully', 'success');
                } else {
                    // Update failed
                    $input.val(preVal); // Reset to previous value
                    this.showCartMessage(response.data.errors.join(' '), 'error');
                }
            });
        }
    }

    /**
     * Validate quantity input
     * @param {jQuery} $input - Quantity input
     * @returns {boolean} - Validation result
     */
    validateQuantityInput($input) {
        const quantity = parseInt($input.val(), 10);
        const min = parseInt($input.data('quantity-min'), 10) || 1;
        const max = parseInt($input.data('quantity-max'), 10);
        
        if (isNaN(quantity) || quantity < min) {
            this.showQuantityError($input, `Minimum quantity is ${min}`);
            return false;
        }
        
        if (max && quantity > max) {
            this.showQuantityError($input, `Maximum quantity is ${max}`);
            return false;
        }
        
        return true;
    }

    /**
     * Enhanced refresh content with better loading states
     */
    refreshContent(remove) {
        const $cartItemsRows = $('[data-item-row]', this.$cartContent);
        const $cartPageTitle = $('[data-cart-page-title]');
        const options = {
            template: {
                content: 'cart/content',
                totals: 'cart/totals',
                pageTitle: 'cart/page-title',
                statusMessages: 'cart/status-messages',
                additionalCheckoutButtons: 'cart/additional-checkout-buttons',
            },
        };

        // Show loading overlay
        this.$overlay.show();

        // Temporarily disable all cart interactions
        $('[data-cart-content] button, [data-cart-content] input').prop('disabled', true);

        utils.api.cart.getContent(options, (err, response) => {
            // Re-enable interactions
            $('[data-cart-content] button, [data-cart-content] input').prop('disabled', false);
            
            this.$cartContent.html(response.content);
            this.$cartTotals.html(response.totals);
            this.$cartMessages.html(response.statusMessages);
            this.$cartAdditionalCheckoutBtns.html(response.additionalCheckoutButtons);

            $cartPageTitle.replaceWith(response.pageTitle);
            this.$overlay.hide();

            const quantity = $('[data-cart-quantity]', this.$cartContent).map((index, element) => parseInt($(element).val(), 10)).get();

            $('body').trigger('cart-quantity-update', quantity.reduce((acc, val) => acc + val, 0));

            if (remove && $cartItemsRows.length === 1) {
                this.showRedirectMessage(this.context.cartRemoveAllQtyConfirmMessage);
            }
            
            // Reinitialize enhanced features after content refresh
            this.initCartEnhancements();
        });
    }

    /**
     * Show redirect message for empty cart
     * @param {string} message - Redirect message
     */
    showRedirectMessage(message) {
        const redirectMessage = message || 'Your cart is empty. Redirecting...';
        
        this.showCartMessage(redirectMessage, 'info');
        
        setTimeout(() => {
            window.location = this.context.urls.home;
        }, 3000);
    }

    setApplePaySupport() {
        if (window.ApplePaySession) {
            this.$cartPageContent.addClass('apple-pay-supported');
        }
    }

    cartUpdate($target) {
        const itemId = $target.data('cartItemid');
        this.$activeCartItemId = itemId;
        this.$activeCartItemBtnAction = $target.data('action');

        const $el = $(`#qty-${itemId}`);
        const oldQty = parseInt($el.val(), 10);
        const maxQty = parseInt($el.data('quantityMax'), 10);
        const minQty = parseInt($el.data('quantityMin'), 10);
        const minError = $el.data('quantityMinError');
        const maxError = $el.data('quantityMaxError');
        const newQty = $target.data('action') === 'inc' ? oldQty + 1 : oldQty - 1;
        // Does not quality for min/max quantity
        if (newQty < minQty) {
            return showAlertModal(minError);
        } else if (maxQty > 0 && newQty > maxQty) {
            return showAlertModal(maxError);
        }

        this.$overlay.show();

        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            this.$overlay.hide();

            if (response.data.status === 'succeed') {
                // if the quantity is changed "1" from "0", we have to remove the row.
                const remove = (newQty === 0);

                this.refreshContent(remove);
            } else {
                $el.val(oldQty);
                showAlertModal(response.data.errors.join('\n'));
            }
        });
    }

    cartUpdateQtyTextChange($target, preVal = null) {
        const itemId = $target.data('cartItemid');
        const $el = $(`#qty-${itemId}`);
        const maxQty = parseInt($el.data('quantityMax'), 10);
        const minQty = parseInt($el.data('quantityMin'), 10);
        const oldQty = preVal !== null ? preVal : minQty;
        const minError = $el.data('quantityMinError');
        const maxError = $el.data('quantityMaxError');
        const newQty = parseInt(Number($el.val()), 10);
        let invalidEntry;

        // Does not quality for min/max quantity
        if (!Number.isInteger(newQty)) {
            invalidEntry = $el.val();
            $el.val(oldQty);
            return showAlertModal(this.context.invalidEntryMessage.replace('[ENTRY]', invalidEntry));
        } else if (newQty < minQty) {
            $el.val(oldQty);
            return showAlertModal(minError);
        } else if (maxQty > 0 && newQty > maxQty) {
            $el.val(oldQty);
            return showAlertModal(maxError);
        }

        this.$overlay.show();
        utils.api.cart.itemUpdate(itemId, newQty, (err, response) => {
            this.$overlay.hide();

            if (response.data.status === 'succeed') {
                // if the quantity is changed "1" from "0", we have to remove the row.
                const remove = (newQty === 0);

                this.refreshContent(remove);
            } else {
                $el.val(oldQty);

                return showAlertModal(response.data.errors.join('\n'));
            }
        });
    }

    cartRemoveItem(itemId) {
        this.$overlay.show();
        utils.api.cart.itemRemove(itemId, (err, response) => {
            if (response.data.status === 'succeed') {
                this.refreshContent(response.data.remove);
                this.showCartMessage('Item removed from cart', 'success');
            } else {
                this.showCartMessage('Error removing item', 'error');
            }
        });
    }
}
