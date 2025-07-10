# Ultra Glass Design - Implementation Guide

## 🚀 Quick Start Implementation

### Phase 1: Core Glass System (Immediate Implementation)

#### 1. Base Glass Mixins
Create `assets/scss/components/_ultra-glass-system.scss`:

```scss
// Core glass mixin with performance optimization
@mixin ultra-glass($level: 'standard', $shape: null) {
  // Performance: Use will-change for smooth animations
  will-change: transform, backdrop-filter;
  
  // Base glass effect
  @if map-has-key($glass-presets, $level) {
    $preset: map-get($glass-presets, $level);
    backdrop-filter: blur(map-get($preset, 'blur')) saturate(180%);
    -webkit-backdrop-filter: blur(map-get($preset, 'blur')) saturate(180%);
    background: linear-gradient(
      135deg,
      map-get($preset, 'tint') 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
  }
  
  // Glass border with glow
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: if($shape, $shape, 1rem);
  
  // Subtle inner glow
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.1),
    0 8px 32px rgba(31, 38, 135, 0.15);
  
  // Shimmer effect on hover
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
    pointer-events: none;
  }
  
  &:hover::before {
    left: 100%;
  }
}

// Animated glass orb
@mixin glass-orb($size: 60px, $glow-color: rgba(255, 255, 255, 0.3)) {
  width: $size;
  height: $size;
  border-radius: 50%;
  @include ultra-glass('intense', 50%);
  
  // Pulsing glow animation
  &::after {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      $glow-color 0%,
      transparent 70%
    );
    animation: pulse-glow 2s ease-in-out infinite;
  }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}
```

#### 2. Enhanced Product Cards
Update `assets/scss/components/_product-card-ultra.scss`:

```scss
.product-card-ultra {
  @include ultra-glass('standard');
  overflow: hidden;
  transition: all 0.3s map-get($easings, 'glass-in');
  
  // 3D hover effect
  transform-style: preserve-3d;
  perspective: 1000px;
  
  &:hover {
    transform: translateY(-5px) rotateX(5deg);
    
    .product-image {
      transform: translateZ(20px) scale(1.05);
    }
    
    .quick-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .product-image-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 0.75rem;
    
    // Ensure images stay crisp
    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      transition: transform 0.5s map-get($easings, 'smooth');
      filter: none !important;
    }
  }
  
  .product-info {
    padding: map-get($space, 'medium');
    
    .product-title {
      font-size: map-get($type-scale, 'h3');
      margin-bottom: map-get($space, 'small');
      
      // Gradient text effect
      background: linear-gradient(
        135deg,
        #1a1a1a 0%,
        #4a4a4a 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .product-price {
      display: flex;
      align-items: baseline;
      gap: map-get($space, 'small');
      
      .current-price {
        font-size: map-get($type-scale, 'h2');
        font-weight: 700;
      }
      
      .original-price {
        text-decoration: line-through;
        opacity: 0.6;
      }
    }
  }
  
  .quick-actions {
    position: absolute;
    bottom: map-get($space, 'medium');
    left: map-get($space, 'medium');
    right: map-get($space, 'medium');
    display: flex;
    gap: map-get($space, 'small');
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s map-get($easings, 'glass-in');
    
    button {
      @include ultra-glass('elevated');
      flex: 1;
      padding: map-get($space, 'small') map-get($space, 'medium');
      border: none;
      cursor: pointer;
      font-weight: 600;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(31, 38, 135, 0.25);
      }
    }
  }
}
```

#### 3. Floating Navigation System
Create `assets/js/theme/common/floating-navigation.js`:

```javascript
export default class FloatingNavigation {
  constructor() {
    this.orbSystem = null;
    this.isExpanded = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    
    this.init();
  }
  
  init() {
    this.createOrbSystem();
    this.attachEventListeners();
    this.initMagneticEffect();
  }
  
  createOrbSystem() {
    const orbHTML = `
      <div class="floating-nav-system">
        <button class="primary-orb" aria-label="Open navigation menu">
          <span class="orb-icon">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="orb-glow"></span>
        </button>
        
        <div class="satellite-orbs" aria-hidden="true">
          ${this.createSatelliteOrbs()}
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', orbHTML);
    this.orbSystem = document.querySelector('.floating-nav-system');
  }
  
  createSatelliteOrbs() {
    const orbs = [
      { icon: '🏠', label: 'Home', action: 'navigate-home' },
      { icon: '🛒', label: 'Cart', action: 'open-cart' },
      { icon: '🔍', label: 'Search', action: 'open-search' },
      { icon: '👤', label: 'Account', action: 'open-account' },
      { icon: '💬', label: 'Chat', action: 'open-chat' },
      { icon: '⚡', label: 'Quick Shop', action: 'quick-shop' }
    ];
    
    return orbs.map((orb, index) => `
      <button 
        class="satellite-orb" 
        data-action="${orb.action}"
        data-index="${index}"
        aria-label="${orb.label}"
        style="--orb-index: ${index};"
      >
        <span class="orb-icon">${orb.icon}</span>
        <span class="orb-tooltip">${orb.label}</span>
      </button>
    `).join('');
  }
  
  attachEventListeners() {
    const primaryOrb = this.orbSystem.querySelector('.primary-orb');
    
    // Click to toggle
    primaryOrb.addEventListener('click', () => this.toggleOrbs());
    
    // Touch gestures
    primaryOrb.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    });
    
    primaryOrb.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;
      
      // Swipe up to expand
      if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -50) {
        this.expandOrbs();
      }
    });
    
    // Satellite orb actions
    this.orbSystem.querySelectorAll('.satellite-orb').forEach(orb => {
      orb.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleOrbAction(action);
      });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.orbSystem.contains(e.target) && this.isExpanded) {
        this.collapseOrbs();
      }
    });
  }
  
  initMagneticEffect() {
    const primaryOrb = this.orbSystem.querySelector('.primary-orb');
    let animationFrame = null;
    
    primaryOrb.addEventListener('mousemove', (e) => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      
      animationFrame = requestAnimationFrame(() => {
        const rect = primaryOrb.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.1;
        const deltaY = (e.clientY - centerY) * 0.1;
        
        primaryOrb.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
    });
    
    primaryOrb.addEventListener('mouseleave', () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      primaryOrb.style.transform = 'translate(0, 0)';
    });
  }
  
  toggleOrbs() {
    if (this.isExpanded) {
      this.collapseOrbs();
    } else {
      this.expandOrbs();
    }
  }
  
  expandOrbs() {
    this.isExpanded = true;
    this.orbSystem.classList.add('expanded');
    
    // Stagger animation for satellite orbs
    const satellites = this.orbSystem.querySelectorAll('.satellite-orb');
    satellites.forEach((orb, index) => {
      setTimeout(() => {
        orb.classList.add('visible');
      }, index * 50);
    });
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }
  
  collapseOrbs() {
    this.isExpanded = false;
    this.orbSystem.classList.remove('expanded');
    
    const satellites = this.orbSystem.querySelectorAll('.satellite-orb');
    satellites.forEach(orb => {
      orb.classList.remove('visible');
    });
  }
  
  handleOrbAction(action) {
    switch(action) {
      case 'navigate-home':
        window.location.href = '/';
        break;
      case 'open-cart':
        this.openCart();
        break;
      case 'open-search':
        this.openSearch();
        break;
      case 'open-account':
        this.openAccount();
        break;
      case 'open-chat':
        this.openChat();
        break;
      case 'quick-shop':
        this.openQuickShop();
        break;
    }
    
    this.collapseOrbs();
  }
  
  openCart() {
    // Trigger cart drawer or navigate to cart
    document.dispatchEvent(new CustomEvent('cart:open'));
  }
  
  openSearch() {
    // Create fullscreen search overlay
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay active';
    searchOverlay.innerHTML = `
      <div class="search-container">
        <input type="search" placeholder="Search for mushrooms..." autofocus>
        <button class="search-close">&times;</button>
      </div>
    `;
    document.body.appendChild(searchOverlay);
    
    // Focus search input
    searchOverlay.querySelector('input').focus();
    
    // Close handler
    searchOverlay.querySelector('.search-close').addEventListener('click', () => {
      searchOverlay.remove();
    });
  }
  
  openAccount() {
    window.location.href = '/account/';
  }
  
  openChat() {
    // Trigger AI chat
    document.dispatchEvent(new CustomEvent('chat:open'));
  }
  
  openQuickShop() {
    // Create quick shop modal
    document.dispatchEvent(new CustomEvent('quickshop:open'));
  }
}
```

#### 4. Dynamic Background System
Create `assets/js/theme/common/dynamic-background.js`:

```javascript
export default class DynamicBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.gradientAngle = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.init();
  }
  
  init() {
    this.createCanvas();
    this.createParticles();
    this.attachEventListeners();
    this.animate();
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'dynamic-background';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    
    document.body.prepend(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  
  attachEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.particles = [];
      this.createParticles();
    });
    
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }
  
  drawGradient() {
    // Animated gradient background
    const gradient = this.ctx.createLinearGradient(
      0, 0,
      this.canvas.width, this.canvas.height
    );
    
    const hue1 = (this.gradientAngle * 0.5) % 360;
    const hue2 = (hue1 + 60) % 360;
    
    gradient.addColorStop(0, `hsla(${hue1}, 70%, 85%, 0.1)`);
    gradient.addColorStop(0.5, `hsla(${hue2}, 60%, 80%, 0.05)`);
    gradient.addColorStop(1, `hsla(${hue1}, 70%, 85%, 0.1)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  drawParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.pulse += 0.02;
      
      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.x -= (dx / distance) * force * 2;
        particle.y -= (dy / distance) * force * 2;
      }
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      const pulseFactor = Math.sin(particle.pulse) * 0.5 + 0.5;
      const size = particle.size * (0.8 + pulseFactor * 0.4);
      const opacity = particle.opacity * (0.7 + pulseFactor * 0.3);
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.ctx.fill();
      
      // Glow effect
      const glowGradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, size * 3
      );
      glowGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`);
      glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, size * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = glowGradient;
      this.ctx.fill();
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawGradient();
    this.drawParticles();
    
    this.gradientAngle += 0.5;
    
    requestAnimationFrame(() => this.animate());
  }
}
```

### Phase 2: Conversion Optimization Components

#### 1. Smart Product Quick View
Create `assets/js/theme/common/smart-quick-view.js`:

```javascript
export default class SmartQuickView {
  constructor() {
    this.modal = null;
    this.currentProduct = null;
    this.init();
  }
  
  init() {
    this.createModal();
    this.attachEventListeners();
  }
  
  createModal() {
    const modalHTML = `
      <div class="quick-view-modal" role="dialog" aria-modal="true">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <button class="modal-close" aria-label="Close quick view">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          
          <div class="quick-view-container">
            <div class="product-gallery">
              <div class="main-image">
                <img src="" alt="" />
                <div class="image-zoom"></div>
              </div>
              <div class="thumbnail-strip"></div>
            </div>
            
            <div class="product-details">
              <h2 class="product-title"></h2>
              <div class="product-rating"></div>
              <div class="product-price"></div>
              
              <div class="product-options">
                <div class="option-group size-options"></div>
                <div class="option-group quantity-selector">
                  <button class="qty-decrease">-</button>
                  <input type="number" class="qty-input" value="1" min="1">
                  <button class="qty-increase">+</button>
                </div>
              </div>
              
              <div class="product-actions">
                <button class="add-to-cart-btn">
                  <span class="btn-text">Add to Cart</span>
                  <span class="btn-loader"></span>
                </button>
                <button class="buy-now-btn">Buy Now</button>
              </div>
              
              <div class="product-info-tabs">
                <div class="tab-headers">
                  <button class="tab-header active" data-tab="description">Description</button>
                  <button class="tab-header" data-tab="benefits">Benefits</button>
                  <button class="tab-header" data-tab="ingredients">Ingredients</button>
                </div>
                <div class="tab-content"></div>
              </div>
              
              <div class="social-proof">
                <div class="recently-viewed"></div>
                <div class="stock-indicator"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.querySelector('.quick-view-modal');
  }
  
  attachEventListeners() {
    // Quick view triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-quick-view]');
      if (trigger) {
        e.preventDefault();
        const productId = trigger.dataset.productId;
        this.openQuickView(productId);
      }
    });
    
    // Close handlers
    this.modal.querySelector('.modal-close').addEventListener('click', () => {
      this.closeQuickView();
    });
    
    this.modal.querySelector('.modal-backdrop').addEventListener('click', () => {
      this.closeQuickView();
    });
    
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeQuickView();
      }
    });
  }
  
  async openQuickView(productId) {
    // Show loading state
    this.modal.classList.add('loading', 'active');
    
    try {
      // Fetch product data
      const product = await this.fetchProductData(productId);
      this.currentProduct = product;
      
      // Populate modal
      this.populateModal(product);
      
      // Remove loading state
      this.modal.classList.remove('loading');
      
      // Initialize features
      this.initializeGallery();
      this.initializeOptions();
      this.initializeTabs();
      this.updateSocialProof();
      
      // Focus management
      this.modal.querySelector('.modal-close').focus();
      
    } catch (error) {
      console.error('Error loading product:', error);
      this.showError();
    }
  }
  
  closeQuickView() {
    this.modal.classList.remove('active');
    this.currentProduct = null;
    
    // Clean up
    setTimeout(() => {
      this.resetModal();
    }, 300);
  }
  
  // Additional implementation methods...
}
```

### Phase 3: Performance & Polish

#### 1. Progressive Enhancement Manager
Create `assets/js/theme/common/progressive-enhancement.js`:

```javascript
export default class ProgressiveEnhancement {
  constructor() {
    this.features = {
      basic: [],
      enhanced: [],
      premium: []
    };
    
    this.capabilities = {
      webgl: false,
      backdropFilter: false,
      intersectionObserver: false,
      webp: false,
      avif: false
    };
    
    this.init();
  }
  
  init() {
    this.detectCapabilities();
    this.loadFeatures();
    this.monitorPerformance();
  }
  
  detectCapabilities() {
    // WebGL support
    try {
      const canvas = document.createElement('canvas');
      this.capabilities.webgl = !!(
        canvas.getContext('webgl') || 
        canvas.getContext('experimental-webgl')
      );
    } catch (e) {
      this.capabilities.webgl = false;
    }
    
    // CSS backdrop-filter
    this.capabilities.backdropFilter = CSS.supports('backdrop-filter', 'blur(10px)');
    
    // Intersection Observer
    this.capabilities.intersectionObserver = 'IntersectionObserver' in window;
    
    // Image format support
    this.checkImageSupport();
  }
  
  async checkImageSupport() {
    // WebP
    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    this.capabilities.webp = await this.testImage(webpData);
    
    // AVIF
    const avifData = 'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAPBtZXRhAAAAAAAAAChoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAbGliYXZpZgAAAAAOcGl0bQAAAAAAAQAAAB5pbG9jAAAAAEQAAAEAAQAAAAEAAAEUAAAAKAAAAB1paW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAARWlwcnAAAAAoaXBjbwAAABRpc3BlAAAAAAAAAAQAAAAEAAAADGF2MUOBAAAAAAAAFWlwbWEAAAAAAAAAAQABAgECAAAAI21kYXQSAAoIP8R8hAQ0BUAyDWeeUy0JG+QAACANEkA=';
    this.capabilities.avif = await this.testImage(avifData);
  }
  
  testImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }
  
  loadFeatures() {
    // Always load basic features
    this.loadBasicFeatures();
    
    // Load enhanced features if supported
    if (this.capabilities.backdropFilter && this.capabilities.intersectionObserver) {
      this.loadEnhancedFeatures();
    }
    
    // Load premium features for high-end devices
    if (this.capabilities.webgl && this.isHighEndDevice()) {
      this.loadPremiumFeatures();
    }
  }
  
  loadBasicFeatures() {
    // Core functionality
    import('./floating-navigation').then(module => {
      new module.default();
    });
  }
  
  loadEnhancedFeatures() {
    // Glass effects and animations
    document.documentElement.classList.add('enhanced-mode');
    
    import('./smart-quick-view').then(module => {
      new module.default();
    });
  }
  
  loadPremiumFeatures() {
    // WebGL effects and particles
    document.documentElement.classList.add('premium-mode');
    
    import('./dynamic-background').then(module => {
      new module.default();
    });
  }
  
  isHighEndDevice() {
    // Check for high-end device indicators
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const connection = navigator.connection;
    
    return memory >= 4 && 
           cores >= 4 && 
           (!connection || connection.effectiveType === '4g');
  }
  
  monitorPerformance() {
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry);
            this.adjustQuality();
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }
  
  adjustQuality() {
    // Dynamically adjust quality based on performance
    const fps = this.measureFPS();
    
    if (fps < 30) {
      document.documentElement.classList.add('reduced-motion');
      console.log('Reducing motion for better performance');
    }
  }
  
  measureFPS() {
    // Simple FPS measurement
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;
    
    const measure = () => {
      const currentTime = performance.now();
      frames++;
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
      }
      
      if (frames < 10) {
        requestAnimationFrame(measure);
      }
    };
    
    measure();
    return fps;
  }
}
```

## 📋 Implementation Checklist

### Week 1-2: Foundation
- [ ] Set up SCSS architecture with glass system
- [ ]