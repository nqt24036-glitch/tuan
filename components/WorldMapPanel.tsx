import React, { useState } from 'react';
import { Player, WorldMapArea } from '../types.ts';
import { WORLD_MAP_DATA } from '../data/worldMapData.ts';

interface WorldMapPanelProps {
  player: Player;
  onNotify: (message: string) => void;
  onEnterArea: (area: WorldMapArea) => void;
  onFindHiddenTreasure: (treasureId: string) => void;
  onSeekEnlightenment: (enlightenmentId: string) => void;
  onSearchForHerbs: (herbId: string) => void;
}

const parseLevelRange = (range: string): [number, number] => {
  if (range.includes('+')) {
    return [parseInt(range, 10), Infinity];
  }
  const parts = range.split('-').map(Number);
  return [parts[0], parts[1] || parts[0]];
};

const WorldMapPanel: React.FC<WorldMapPanelProps> = ({ player, onNotify, onEnterArea, onFindHiddenTreasure, onSeekEnlightenment, onSearchForHerbs }) => {
  // Find the ID of the highest accessible realm to expand it by default.
  const accessibleRealms = WORLD_MAP_DATA.filter(realm => {
    const [minLevel] = parseLevelRange(realm.levelRange);
    return player.level >= minLevel;
  });
  const initialExpandedRealmId = accessibleRealms.length > 0 ? accessibleRealms[accessibleRealms.length - 1].id : null;

  const [expandedRealms, setExpandedRealms] = useState<Set<string>>(
    initialExpandedRealmId ? new Set([initialExpandedRealmId]) : new Set()
  );

  const toggleRealm = (realmId: string) => {
    setExpandedRealms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(realmId)) {
        newSet.delete(realmId);
      } else {
        newSet.add(realmId);
      }
      return newSet;
    });
  };

  const InteractiveButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
      <button 
        onClick={onClick}
        className="px-3 py-1 text-xs font-semibold rounded-md bg-yellow-600 hover:bg-yellow-500 border border-yellow-400 text-black shadow-md transition-all"
      >
          {children}
      </button>
  );

  return (
    <div className="h-full w-full overflow-y-auto pr-2">
      <h3 className="text-3xl font-serif text-yellow-300 text-center mb-6">Bản Đồ Thế Giới</h3>
      <div className="space-y-4">
        {WORLD_MAP_DATA.map(realm => {
          const [minRealmLevel] = parseLevelRange(realm.levelRange);
          const isRealmUnlocked = player.level >= minRealmLevel;
          const isExpanded = expandedRealms.has(realm.id);

          return (
            <div key={realm.id} className={`bg-gray-900/50 border-2 rounded-lg transition-all duration-300 ${isExpanded ? 'border-yellow-600' : 'border-gray-700'}`}>
              {/* Realm Header */}
              <button
                onClick={() => toggleRealm(realm.id)}
                disabled={!isRealmUnlocked}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-800/50 disabled:cursor-not-allowed"
              >
                <div>
                  <h2 className={`text-2xl font-serif ${isRealmUnlocked ? 'text-yellow-300' : 'text-gray-600'}`}>{realm.name}</h2>
                  <p className={`text-sm italic ${isRealmUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>{realm.description}</p>
                  <p className={`text-xs mt-1 font-semibold ${isRealmUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                    {isRealmUnlocked ? `Cấp: ${realm.levelRange}` : `🔒 Cấp ${minRealmLevel} Mở`}
                  </p>
                </div>
                <div className={`text-2xl transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                  ▼
                </div>
              </button>

              {/* Expanded Area List */}
              {isExpanded && isRealmUnlocked && (
                <div className="p-4 border-t-2 border-yellow-600/50 space-y-3">
                  {realm.areas.map(area => {
                    const [minAreaLevel] = parseLevelRange(area.levelRange);
                    const isAreaUnlocked = player.level >= minAreaLevel;
                    return (
                      <div key={area.id} className={`p-3 rounded-lg border ${isAreaUnlocked ? 'bg-gray-800/70 border-gray-600' : 'bg-black/50 border-gray-800 opacity-60'}`}>
                        <div className="flex flex-col sm:flex-row items-start justify-between">
                          <div>
                            <div className="flex items-center gap-4">
                              <h4 className={`text-xl font-bold ${isAreaUnlocked ? 'text-cyan-300' : 'text-gray-500'}`}>{area.name}</h4>
                              <span className={`text-sm font-semibold ${isAreaUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                                {isAreaUnlocked ? `Cấp: ${area.levelRange}` : `🔒 Cấp ${minAreaLevel} Mở`}
                              </span>
                            </div>
                            <p className={`mt-1 text-sm italic ${isAreaUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>{area.description}</p>
                          </div>
                          <div className="flex-shrink-0 ml-0 sm:ml-4 mt-4 sm:mt-0">
                            <button
                              onClick={() => onEnterArea(area)}
                              disabled={!isAreaUnlocked}
                              className="px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 border border-blue-400"
                            >
                              Tiến vào
                            </button>
                          </div>
                        </div>
                        {isAreaUnlocked && (area.npcs || area.monsters || area.boss || area.rewards) && (
                          <div className="mt-3 pt-3 border-t border-gray-700/50 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                            {area.npcs && <div><strong className="text-yellow-400">NPC:</strong> <span className="text-gray-300">{area.npcs.join(', ')}</span></div>}
                            {area.monsters && <div><strong className="text-red-400">Quái Vật:</strong> <span className="text-gray-300">{area.monsters.join(', ')}</span></div>}
                            {area.boss && <div><strong className="text-red-600 font-bold">BOSS:</strong> <span className="text-gray-300">{area.boss}</span></div>}
                            {area.rewards && <div><strong className="text-green-400">Phần Thưởng:</strong> <span className="text-gray-300">{area.rewards.join(', ')}</span></div>}
                          </div>
                        )}
                        {/* Interactive Elements */}
                        {isAreaUnlocked && (
                            <div className="mt-3 flex gap-2 justify-end">
                                {area.id === 'area_me_anh' && !player.foundTreasures.includes('me_anh_herbs') && (
                                    <InteractiveButton onClick={() => onSearchForHerbs('me_anh_herbs')}>
                                        🌿 Tìm linh thảo
                                    </InteractiveButton>
                                )}
                                {area.id === 'area_hang_da' && !player.foundTreasures.includes('hang_da_treasure') && (
                                    <InteractiveButton onClick={() => onFindHiddenTreasure('hang_da_treasure')}>
                                        💎 Khám phá bí mật
                                    </InteractiveButton>
                                )}
                                {area.id === 'area_tich_duong' && !player.foundTreasures.includes('tich_duong_enlightenment') && (
                                    <InteractiveButton onClick={() => onSeekEnlightenment('tich_duong_enlightenment')}>
                                        ✨ Ngộ Đạo
                                    </InteractiveButton>
                                )}
                            </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorldMapPanel;