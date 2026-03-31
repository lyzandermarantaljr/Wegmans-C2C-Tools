var CACHE = 'c2c-tools-v1';
var ASSETS = [
  '/Wegmans-C2C-Helper-Tools/shopper_tools.html',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        if(!response||response.status!==200||response.type==='opaque') return response;
        var clone = response.clone();
        caches.open(CACHE).then(function(cache){cache.put(e.request, clone);});
        return response;
      }).catch(function(){
        return caches.match('/Wegmans-C2C-Helper-Tools/shopper_tools.html');
      });
    })
  );
});
