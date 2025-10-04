const CACHE_NAME = 'huyen-gioi-tu-tien-v1.2'; // Incremented version
const urlsToCache = [
  './',
  './index.html',
  './index.tsx',
  './metadata.json',
  './manifest.json',
  './types.ts',
  './constants.ts',
  './utils/audio.ts',
  './services/geminiService.ts',
  './data/gameData.ts',
  './data/worldMapData.ts',
  './components/ActivityLogPanel.tsx',
  './components/AddNewMonsterModal.tsx',
  './components/AdminPanel.tsx',
  './components/AdventurePanel.tsx',
  './components/ApiKeyModal.tsx',
  './components/AreaDetailPanel.tsx',
  './components/BattleScreen.tsx',
  './components/BlacksmithPanel.tsx',
  './components/BottomNavBar.tsx',
  './components/CharacterCreationScreen.tsx',
  './components/CharacterDetailPopup.tsx',
  './components/CharacterPanel.tsx',
  './components/CombatEffect.tsx',
  './components/CompanionEquipModal.tsx',
  './components/CompanionPanel.tsx',
  './components/CultivationPanel.tsx',
  './components/FormationPanel.tsx',
  './components/IconComponents.tsx',
  './components/InventoryPanel.tsx',
  './components/MainContentArea.tsx',
  './components/MiniMap.tsx',
  './components/NpcDetailModal.tsx',
  './components/QuestPanel.tsx',
  './components/SettingsPanel.tsx',
  './components/SkillDisplay.tsx',
  './components/StatusBar.tsx',
  './components/StorePanel.tsx',
  './components/WorldMapPanel.tsx',
  './App.tsx',
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