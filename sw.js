// Basit önbellek — uygulama kabuğu çevrimdışı da açılsın (üretim yine internet ister).
const CACHE = 'curionaut-v1';
const ASSETS = ['./index.html', './manifest.webmanifest', './icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // API ve görsel isteklerini asla önbellekleme
  if (u.hostname.includes('googleapis.com') || u.hostname.includes('pollinations.ai')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
