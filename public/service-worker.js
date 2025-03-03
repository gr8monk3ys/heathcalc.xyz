/**
 * HealthCheck Service Worker
 * Provides offline support and caching for better performance
 */

const CACHE_NAME = 'healthcheck-cache-v1';
const OFFLINE_PAGE = '/offline.html';

// Resources to cache on install
const PRECACHE_RESOURCES = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/images/og-image.jpg',
  '/styles.css',
  '/main.js',
];

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip browser-sync requests
  if (event.request.url.includes('browser-sync')) {
    return;
  }
  
  // For HTML requests - network first, fallback to cache, then offline page
  if (event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Try to get from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback to offline page
            return caches.match(OFFLINE_PAGE);
          });
        })
    );
    return;
  }
  
  // For non-HTML requests - cache first, network fallback
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Cache the response for future
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch((error) => {
            console.error('Service Worker fetch failed:', error);
            
            // For image requests, return a placeholder
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/images/placeholder.png');
            }
            
            // For other requests, just propagate the error
            throw error;
          });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const notification = event.data.json();
  const title = notification.title || 'HealthCheck Update';
  const options = {
    body: notification.body || 'New content is available!',
    icon: notification.icon || '/icons/icon-192x192.png',
    badge: notification.badge || '/icons/badge-72x72.png',
    data: notification.data || { url: '/' },
    actions: notification.actions || [
      { action: 'view', title: 'View' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    const urlToOpen = event.notification.data && event.notification.data.url 
      ? event.notification.data.url 
      : '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((windowClients) => {
          // Check if there is already a window/tab open with the target URL
          for (let client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window/tab is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-saved-results') {
    event.waitUntil(syncSavedResults());
  }
});

// Function to sync saved results with server
async function syncSavedResults() {
  try {
    // Get saved results from IndexedDB
    const db = await openDatabase();
    const savedResults = await getAllSavedResults(db);
    
    // Send to server
    if (savedResults.length > 0) {
      const response = await fetch('/api/sync-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ results: savedResults })
      });
      
      if (response.ok) {
        // Mark as synced in IndexedDB
        await markResultsAsSynced(db, savedResults);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper function to open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('healthcheck-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('saved-results')) {
        db.createObjectStore('saved-results', { keyPath: 'id' });
      }
    };
  });
}

// Helper function to get all saved results
function getAllSavedResults(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('saved-results', 'readonly');
    const store = transaction.objectStore('saved-results');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Helper function to mark results as synced
function markResultsAsSynced(db, results) {
  return Promise.all(results.map((result) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('saved-results', 'readwrite');
      const store = transaction.objectStore('saved-results');
      result.synced = true;
      const request = store.put(result);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }));
}
