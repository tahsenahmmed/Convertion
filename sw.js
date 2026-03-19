// ══════════════════════════════════════════════════════════════
//  UNITFORM Service Worker — Cache-first + Network fallback
//  Version bump the CACHE_NAME to force update when deploying
// ══════════════════════════════════════════════════════════════

const CACHE_NAME = 'unitform-v1';

// Everything the app needs to work fully offline
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // Google Fonts — cached on first load, served offline after
  'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700;900&display=swap',
  'https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRBEqV98dVQztYldFcLowEF.woff2',
  'https://fonts.gstatic.com/s/barlowcondensed/v12/HTxwL3I-JCGChYJ8VI-L6OO_au7B4-Lw.woff2',
];

// ── INSTALL: pre-cache all static assets ──────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache core files; font files may 404 on first run if URLs changed —
      // use individual try/catch so one failure doesn't break everything
      return cache.addAll(PRECACHE_URLS.slice(0, 3))   // always cache these
        .then(() =>
          Promise.allSettled(
            PRECACHE_URLS.slice(3).map(url =>
              cache.add(url).catch(e => console.warn('Pre-cache skip:', url, e))
            )
          )
        );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean up old caches ─────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('UNITFORM SW: deleting old cache', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first, network fallback ──────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // For currency API calls — always try network first (live rates),
  // fall back to cache if offline, don't cache the response long-term
  if (url.hostname === 'api.exchangerate-api.com') {
    event.respondWith(
      fetch(request)
        .then(res => {
          // Clone and cache the fresh rate response
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))  // offline: use last cached rates
    );
    return;
  }

  // For Google Fonts — stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(res => {
          caches.open(CACHE_NAME).then(c => c.put(request, res.clone()));
          return res;
        });
        return cached || network;
      })
    );
    return;
  }

  // For everything else — cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        // Only cache successful same-origin responses
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
        return res;
      });
    })
  );
});

// ── MESSAGE: force update from app UI ─────────────────────────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
