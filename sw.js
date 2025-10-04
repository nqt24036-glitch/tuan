const CACHE_NAME = 'huyen-gioi-tu-tien-v1.3'; // Incremented version
const urlsToCache = [
  './',
  './index.html',
  './index.js',
  './metadata.json',
  './manifest.json',
  './types.js',
  './constants.js',
  './utils/audio.js',
  './services/geminiService.js',
  './data/gameData.js',
  './data/worldMapData.js',
  './components/ActivityLogPanel.js',
  './components/AddNewMonsterModal.js',
  './components/AdminPanel.js',
  './components/AdventurePanel.js',
  './components/ApiKeyModal.js',
  './components/AreaDetailPanel.js',
  './components/BattleScreen.js',
  './components/BlacksmithPanel.js',
  './components/BottomNavBar.js',
  './components/CharacterCreationScreen.js',
  './components/CharacterDetailPopup.js',
  './components/CharacterPanel.js',
  './components/CombatEffect.js',
  './components/CompanionEquipModal.js',
  './components/CompanionPanel.js',
  './components/CultivationPanel.js',
  './components/FormationPanel.js',
  './components/IconComponents.js',
  './components/InventoryPanel.js',
  './components/MainContentArea.js',
  './components/MiniMap.js',
  './components/NpcDetailModal.js',
  './components/QuestPanel.js',
  './components/SettingsPanel.js',
  './components/SkillDisplay.js',
  './components/StatusBar.js',
  './components/StorePanel.js',
  './components/WorldMapPanel.js',
  './App.js',
  // External URLs that caused CORS errors have been removed.
  // The browser will handle caching these via its standard HTTP cache.
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use a fetch with "no-cors" for external resources if needed, but it's better to let the browser cache them.
        // For simplicity and to fix the error, we only cache local files.
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache resources during install:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  // We only handle navigation requests with a network-first strategy.
  // For other requests (CSS, JS, images), we go cache-first.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // We don't cache cross-origin scripts like babel/react.
                if (event.request.url.startsWith(self.location.origin)) {
                   cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});


self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});