// =============================================================================
// SOUTHWEST MUSHROOMS - SERVICE WORKER
// Progressive Web App features and caching strategy
// =============================================================================

const CACHE_NAME = 'southwest-mushrooms-v1.4.0';
const RUNTIME_CACHE_NAME = 'runtime-cache-v1.4.0';

// Resources to cache immediately
const STATIC_CACHE_RESOURCES = [
  '/',
  '/assets/css/theme.css',
  '/assets/js/theme-bundle.main.js',
  '/assets/img/logo.svg',
  '/assets/icons/favicon.ico',
  '/offline.html'
];

// Resources to cache on runtime
const RUNTIME_CACHE_PATTERNS = [
  /\/assets\/img\/.+\.(png|jpg|jpeg|svg|gif|webp)$/,
  /\/assets\/js\/.+\.js$/,
  /\/assets\/css\/.+\.css$/,
  /\/fonts\/.+\.(woff|woff2|ttf)$/
];

// Network-first patterns (always try network first)
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /\/cart/,
  /\/checkout/,
  /\/account/
];

// =============================================================================
// INSTALLATION
// =============================================================================

self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_CACHE_RESOURCES);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// =============================================================================
// ACTIVATION
// =============================================================================

self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('[SW] Activation failed:', error);
      })
  );
});

// =============================================================================
// FETCH HANDLING
// =============================================================================

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Apply caching strategy based on request type
  if (isNetworkFirst(request)) {
    event.respondWith(networkFirst(request));
  } else if (isRuntimeCacheable(request)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

// =============================================================================
// CACHING STRATEGIES
// =============================================================================

/**
 * Cache First Strategy
 * Good for static assets that don't change often
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return getOfflineFallback(request);
  }
}

/**
 * Network First Strategy
 * Good for API calls and dynamic content
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return getOfflineFallback(request);
  }
}

/**
 * Stale While Revalidate Strategy
 * Good for frequently updated content
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh version in background
  const fetchPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.error('[SW] Background fetch failed:', error);
  });
  
  // Return cached version immediately, or wait for network
  return cachedResponse || fetchPromise || getOfflineFallback(request);
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if request should use network-first strategy
 */
function isNetworkFirst(request) {
  return NETWORK_FIRST_PATTERNS.some(pattern => 
    pattern.test(request.url)
  );
}

/**
 * Check if request should be cached at runtime
 */
function isRuntimeCacheable(request) {
  return RUNTIME_CACHE_PATTERNS.some(pattern => 
    pattern.test(request.url)
  );
}

/**
 * Get offline fallback for failed requests
 */
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    return await caches.match('/offline.html');
  }
  
  // Return placeholder for images
  if (request.destination === 'image') {
    return await caches.match('/assets/img/offline-placeholder.svg');
  }
  
  // Return generic offline response
  return new Response('Offline content not available', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  });
}

// =============================================================================
// BACKGROUND SYNC
// =============================================================================

self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-cart-sync') {
    event.waitUntil(syncCartData());
  }
  
  if (event.tag === 'background-analytics-sync') {
    event.waitUntil(syncAnalyticsData());
  }
});

/**
 * Sync cart data when connection is restored
 */
async function syncCartData() {
  try {
    // Get queued cart operations from IndexedDB
    const queuedOperations = await getQueuedCartOperations();
    
    for (const operation of queuedOperations) {
      await fetch(operation.url, operation.options);
      await removeQueuedOperation(operation.id);
    }
    
    console.log('[SW] Cart sync completed');
  } catch (error) {
    console.error('[SW] Cart sync failed:', error);
  }
}

/**
 * Sync analytics data when connection is restored
 */
async function syncAnalyticsData() {
  try {
    // Get queued analytics events from IndexedDB
    const queuedEvents = await getQueuedAnalyticsEvents();
    
    for (const event of queuedEvents) {
      // Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag(event.command, event.name, event.parameters);
      }
      await removeQueuedAnalyticsEvent(event.id);
    }
    
    console.log('[SW] Analytics sync completed');
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error);
  }
}

// =============================================================================
// PUSH NOTIFICATIONS
// =============================================================================

self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/assets/img/icon-192x192.png',
    badge: '/assets/img/badge-72x72.png',
    tag: data.tag || 'general',
    data: data.data || {},
    actions: data.actions || [],
    vibrate: [100, 50, 100],
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const data = event.notification.data;
  let url = data.url || '/';
  
  // Handle different notification types
  if (event.action === 'view-cart') {
    url = '/cart';
  } else if (event.action === 'view-product') {
    url = data.productUrl || '/';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// =============================================================================
// INDEXEDDB HELPERS (Placeholder implementations)
// =============================================================================

async function getQueuedCartOperations() {
  // Implement IndexedDB operations retrieval
  return [];
}

async function removeQueuedOperation(id) {
  // Implement IndexedDB operation removal
}

async function getQueuedAnalyticsEvents() {
  // Implement IndexedDB analytics events retrieval
  return [];
}

async function removeQueuedAnalyticsEvent(id) {
  // Implement IndexedDB analytics event removal
}

// =============================================================================
// CLEANUP AND OPTIMIZATION
// =============================================================================

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.payload;
    event.waitUntil(
      caches.open(RUNTIME_CACHE_NAME).then(cache => {
        return cache.addAll(urls);
      })
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
