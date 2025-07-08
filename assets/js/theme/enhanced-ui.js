/**
 * Enhanced UI Interactions
 * Advanced animations, smooth scrolling, and interactive effects
 */

class EnhancedUI {
    constructor() {
        this.initScrollAnimations();
        this.initMagneticButtons();
        this.initParallaxEffects();
        this.initGlassCardInteractions();
        this.initSmoothScroll();
        this.initLazyLoading();
        this.initPageTransitions();
        this.initCartEnhancements();
    }

    /**
     * Initialize scroll-triggered animations
     */
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Add stagger effect for children
                    if (entry.target.classList.contains('stagger-animation')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('revealed');
                            }, index * 50);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe all elements with reveal animations
        document.querySelectorAll('.reveal-on-scroll, [data-aos]').forEach(el => {
            animateOnScroll.observe(el);
        });

        // Handle AOS animations
        this.handleAOSAnimations();
    }

    /**
     * Handle AOS (Animate On Scroll) library-like animations
     */
    handleAOSAnimations() {
        const aosElements = document.querySelectorAll('[data-aos]');
        
        const aosObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px'
        });

        aosElements.forEach(el => {
            aosObserver.observe(el);
        });
    }

    /**
     * Initialize magnetic button effects
     */
    initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-button');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = Math.max(rect.width, rect.height);
                
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const translateX = x * force * 0.3;
                    const translateY = y * force * 0.3;
                    
                    button.style.transform = `translate(${translateX}px, ${translateY}px)`;
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    /**
     * Initialize parallax scrolling effects
     */
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    /**
     * Initialize glass card 3D interactions
     */
    initGlassCardInteractions() {
        const cards = document.querySelectorAll('.interactive-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /**
     * Initialize smooth scrolling
     */
    initSmoothScroll() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offset = 100; // Header offset
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Smooth scroll to top button
        const scrollTopButton = document.createElement('button');
        scrollTopButton.className = 'scroll-to-top liquid-button hover-lift';
        scrollTopButton.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>';
        scrollTopButton.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollTopButton);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Initialize lazy loading for images
     */
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    }
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Initialize page transitions
     */
    initPageTransitions() {
        // Add loading class on page unload
        window.addEventListener('beforeunload', () => {
            document.body.classList.add('page-loading');
        });

        // Remove loading class when page loads
        window.addEventListener('load', () => {
            document.body.classList.remove('page-loading');
            document.body.classList.add('page-loaded');
        });

        // Smooth transitions for internal links
        document.querySelectorAll('a:not([target="_blank"]):not([href^="#"])').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.hostname === window.location.hostname) {
                    e.preventDefault();
                    document.body.classList.add('page-transitioning');
                    
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 300);
                }
            });
        });
    }

    /**
     * Initialize cart UI enhancements
     */
    initCartEnhancements() {
        // Animated quantity updates
        const quantityInputs = document.querySelectorAll('.cart-item-qty-input');
        
        quantityInputs.forEach(input => {
            const originalValue = input.value;
            
            input.addEventListener('change', (e) => {
                const newValue = e.target.value;
                const diff = newValue - originalValue;
                
                if (diff !== 0) {
                    // Show animated feedback
                    const feedback = document.createElement('div');
                    feedback.className = 'quantity-feedback';
                    feedback.textContent = diff > 0 ? `+${diff}` : diff;
                    feedback.style.color = diff > 0 ? '#10b981' : '#ef4444';
                    
                    input.parentElement.appendChild(feedback);
                    
                    setTimeout(() => {
                        feedback.classList.add('animate');
                    }, 10);
                    
                    setTimeout(() => {
                        feedback.remove();
                    }, 1000);
                }
            });
        });

        // Enhanced remove item animation
        document.querySelectorAll('.cart-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const row = button.closest('.cart-item');
                
                if (row) {
                    row.style.transformOrigin = 'center';
                    row.style.animation = 'cart-item-remove 0.5s ease-out forwards';
                    
                    setTimeout(() => {
                        row.style.display = 'none';
                    }, 500);
                }
            });
        });

        // Add to cart success animation
        this.initAddToCartAnimation();
    }

    /**
     * Initialize add to cart animation
     */
    initAddToCartAnimation() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-button-type="add-cart"]')) {
                e.preventDefault();
                
                const button = e.target;
                const productCard = button.closest('.product-card');
                
                if (productCard) {
                    const productImage = productCard.querySelector('img');
                    const cartIcon = document.querySelector('.navUser-item--cart');
                    
                    if (productImage && cartIcon) {
                        // Create flying image
                        const flyingImage = productImage.cloneNode();
                        flyingImage.className = 'flying-image';
                        
                        const imageRect = productImage.getBoundingClientRect();
                        const cartRect = cartIcon.getBoundingClientRect();
                        
                        flyingImage.style.position = 'fixed';
                        flyingImage.style.left = `${imageRect.left}px`;
                        flyingImage.style.top = `${imageRect.top}px`;
                        flyingImage.style.width = `${imageRect.width}px`;
                        flyingImage.style.height = `${imageRect.height}px`;
                        flyingImage.style.zIndex = '9999';
                        
                        document.body.appendChild(flyingImage);
                        
                        // Animate to cart
                        setTimeout(() => {
                            flyingImage.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                            flyingImage.style.left = `${cartRect.left + cartRect.width / 2}px`;
                            flyingImage.style.top = `${cartRect.top + cartRect.height / 2}px`;
                            flyingImage.style.width = '0';
                            flyingImage.style.height = '0';
                            flyingImage.style.opacity = '0';
                            flyingImage.style.transform = 'rotate(360deg) scale(0)';
                        }, 10);
                        
                        // Remove flying image
                        setTimeout(() => {
                            flyingImage.remove();
                            
                            // Animate cart icon
                            cartIcon.classList.add('bounce');
                            setTimeout(() => {
                                cartIcon.classList.remove('bounce');
                            }, 600);
                        }, 800);
                    }
                }
                
                // Continue with actual add to cart
                // ... existing add to cart logic
            }
        });
    }
}

// Initialize enhanced UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedUI();
});

// Export for use in other modules
export default EnhancedUI; 