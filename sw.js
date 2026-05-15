// FairChance Finder — Service Worker (v2)
// Hybrid strategy:
// - HTML navigations: network-first (fresh updates), fallback to cached shell
// - JS/CSS & data: stale-while-revalidate (fast + refresh in background)
// - icons/images: cache-first

const CACHE_NAME = 'fairchancefinder-v3';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/app.css',
  '/app/main.js',
  '/public/icons/16724.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);

  const network = fetch(req).then(res => {
    if (res && res.status === 200) cache.put(req, res.clone());
    return res;
  }).catch(() => cached);

  return cached || network;
}

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  if (res && res.status === 200) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, res.clone());
  }
  return res;
}

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return (await caches.match(req)) || caches.match('/index.html');
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(req));
    return;
  }

  // HTML navigations
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
    return;
  }

  // JS/CSS
  if (url.pathname.startsWith('/app/') || url.pathname.startsWith('/styles/')) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // (future) data endpoints
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  // images/icons
  if (url.pathname.startsWith('/public/icons/') || req.destination === 'image') {
    event.respondWith(cacheFirst(req));
    return;
  }

  // default
  event.respondWith(cacheFirst(req));
});
