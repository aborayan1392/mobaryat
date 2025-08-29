const CACHE_NAME = 'matches-schedule-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap'
];

// حدث التثبيت: يتم تخزين الملفات في الـ cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// حدث الجلب: يتم اعتراض الطلبات وتقديم الملفات من الـ cache إذا كانت متاحة
self.addEventListener('fetch', event => {
  // لا تقم بتخزين طلبات chrome-extension
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
    
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الطلب في الكاش، قم بإرجاعه
        if (response) {
          return response;
        }
        // وإلا، قم بجلبه من الشبكة
        return fetch(event.request);
      })
  );
});

// حدث التفعيل: يتم تنظيف الـ cache القديم
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});