const CACHE_NAME = 'huyen-gioi-tu-tien-v1.1';
const urlsToCache = [
  './',
  './index.html',
  './index.tsx',
  './metadata.json',
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
  'https://cdn.tailwindcss.com',
  'https://img.freepik.com/free-photo/glowing-spaceship-orbits-planet-starry-galaxy-generated-by-ai_188544-9655.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
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
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});