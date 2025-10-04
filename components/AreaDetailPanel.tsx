import React, { useState } from 'react';
import { WorldMapArea, Player, Quest, NPC, EquipmentSlot, Monster } from '../types';
import { generateQuest } from '../services/geminiService';
import { ITEM_RARITY_TEXT_COLORS } from '../constants';
import NpcDetailModal from './NpcDetailModal';

interface AreaDetailPanelProps {
  area: WorldMapArea;
  player: Player;
  onLeaveArea: () => void;
  onStartBattle: (monsterName: string) => void;
  onAcceptQuest: (quest: Quest) => void;
  onNotify: (message: string) => void;
  onOpenBlacksmith: () => void;
  apiKey: string | null;
  masterMonsterList: Monster[];
  npcList: NPC[];
  onUpdateNpcDetails: (npcId: string, details: { hairStyle?: number; eyeColor?: 'Đen' | 'Trắng' }) => void;
}

const AreaDetailPanel: React.FC<AreaDetailPanelProps> = ({ area, player, onLeaveArea, onStartBattle, onAcceptQuest, onNotify, onOpenBlacksmith, apiKey, masterMonsterList, npcList, onUpdateNpcDetails }) => {
  const [isLoadingQuest, setIsLoadingQuest] = useState(false);
  const [generatedQuest, setGeneratedQuest] = useState<Quest | null>(null);
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);
  const [showNpcDetails, setShowNpcDetails] = useState<NPC | null>(null);

  const handleNpcClick = async (npcName: string) => {
    const npcData = npcList.find(npc => npc.name === npcName);

    if (npcName === 'Thợ rèn') {
      onOpenBlacksmith();
      return;
    }

    if (!npcData) {
        onNotify("Không tìm thấy thông tin NPC.");
        return;
    }

    setSelectedNpc(npcData);

    if (!apiKey) {
      setIsLoadingQuest(false);
      setGeneratedQuest(null);
      return;
    }

    setIsLoadingQuest(true);
    setGeneratedQuest(null);
    try {
        const quest = await generateQuest(npcName, area, player);
        if (quest) {
          setGeneratedQuest(quest);
        }
    } catch (e) {
        console.error("Failed to handle NPC click interaction:", e);
        onNotify("Có lỗi xảy ra khi trò chuyện với NPC.");
    } finally {
        setIsLoadingQuest(false);
    }
  };
  
  const handleAcceptQuest = () => {
    if (generatedQuest) {
      onAcceptQuest(generatedQuest);
    }
    setGeneratedQuest(null);
    setSelectedNpc(null);
  };
  
  const handleDeclineQuest = () => {
    setGeneratedQuest(null);
    setSelectedNpc(null);
  };

  const QuestModal: React.FC = () => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-yellow-600 rounded-lg p-6 w-full max-w-lg animate-fadeIn">
        {selectedNpc && (
          <>
            {isLoadingQuest ? (
              <div>
                <h3 className="text-xl font-bold text-yellow-300">Đang trò chuyện với {selectedNpc.name}...</h3>
                <p className="text-gray-400 mt-4 animate-pulse">Xin chờ một chút...</p>
              </div>
            ) : generatedQuest ? (
              <div>
                <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-700">
                  <button onClick={() => setShowNpcDetails(selectedNpc)} className="focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg transition-all" title="Xem chi tiết thuộc tính">
                    <img src={selectedNpc.avatarUrl} alt={selectedNpc.name} className="w-20 h-20 rounded-lg border-2 border-gray-600 flex-shrink-0 object-cover" />
                  </button>
                  <div>
                    <p className="font-bold text-lg text-white">{selectedNpc.name}</p>
                    <p className="italic text-sm text-gray-400">"{selectedNpc.description}"</p>
                  </div>
                </div>

                {Object.values(selectedNpc.equippedItems).filter(Boolean).length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-400">Trang bị:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(Object.keys(selectedNpc.equippedItems) as EquipmentSlot[]).map(slot => {
                        const item = selectedNpc.equippedItems[slot];
                        return (
                          item && (
                            <div key={slot} className="p-2 rounded bg-gray-800 border border-gray-600 flex items-center gap-2 text-xs" title={`${item.name}\n${item.description}`}>
                              <span className="text-lg">{item.icon}</span>
                              <span className={ITEM_RARITY_TEXT_COLORS[item.rarity]}>{item.name}</span>
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mb-2">{selectedNpc.name} nói:</p>
                <h3 className="text-2xl font-bold text-yellow-300 mb-2">{generatedQuest.title}</h3>
                <p className="text-gray-300 mb-4">{generatedQuest.description}</p>
                <div className="border-t border-gray-700 pt-4">
                  <p className="font-semibold">Mục tiêu: <span className="font-normal text-white">{generatedQuest.objective?.targetName} x {generatedQuest.target}</span></p>
                  <p className="font-semibold">Phần thưởng: <span className="font-normal text-green-400">{generatedQuest.reward}</span></p>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button onClick={handleDeclineQuest} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Từ Chối</button>
                  <button onClick={handleAcceptQuest} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded">Chấp Nhận</button>
                </div>
              </div>
            ) : (
                 <div>
                    <p className="text-lg text-white">"{selectedNpc.name} không có gì để nói với bạn lúc này."</p>
                    {!apiKey && (
                        <p className="text-sm text-yellow-400 mt-4">Lưu ý: Tính năng tạo nhiệm vụ động yêu cầu Gemini API Key. Vui lòng thiết lập trong Cài đặt.</p>
                    )}
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={handleDeclineQuest} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded">Rời đi</button>
                    </div>
                 </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full overflow-y-auto animate-fadeIn relative">
      {selectedNpc && <QuestModal />}
      {showNpcDetails && <NpcDetailModal npc={showNpcDetails} onClose={() => setShowNpcDetails(null)} onUpdateDetails={onUpdateNpcDetails} />}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-serif text-cyan-300">{area.name}</h2>
          <p className="text-gray-400">{area.description}</p>
        </div>
        <button onClick={onLeaveArea} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-semibold transition-colors">
          Rời Khỏi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* NPCs Section */}
        <div>
          <h3 className="text-xl font-bold text-yellow-300 border-b-2 border-yellow-700/50 pb-2 mb-4">Nhân Vật</h3>
          <div className="space-y-3">
            {area.npcs && area.npcs.length > 0 ? (
              area.npcs.map(npcName => (
                <button key={npcName} onClick={() => handleNpcClick(npcName)} className="w-full text-left p-3 bg-gray-800/70 border border-gray-600 rounded-lg hover:bg-gray-700/90 transition-colors">
                  <p className="font-semibold text-white">{npcName}</p>
                  <p className="text-xs text-gray-400">Nhấn để tương tác</p>
                </button>
              ))
            ) : (
              <p className="text-gray-500 italic">Không có ai ở đây cả.</p>
            )}
          </div>
        </div>

        {/* Monsters Section */}
        <div>
          <h3 className="text-xl font-bold text-red-400 border-b-2 border-red-700/50 pb-2 mb-4">Yêu Thú</h3>
          <div className="space-y-3">
            {area.monsters && area.monsters.length > 0 && area.monsters[0] !== 'Không có (thành an toàn)' ? (
              area.monsters.map(monsterName => {
                const monsterData = masterMonsterList.find(m => m.name === monsterName);
                return (
                  <div key={monsterName} className="p-3 bg-black/50 border border-gray-700 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-red-300">{monsterName}</p>
                      {monsterData && <p className="text-xs text-gray-400">HP: {monsterData.hp}, Công: {monsterData.stats.attack}</p>}
                    </div>
                    <button onClick={() => onStartBattle(monsterName)} className="px-3 py-1 bg-red-800 hover:bg-red-700 rounded font-semibold text-sm transition-colors">
                      Tấn Công
                    </button>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 italic">Khu vực này an toàn.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetailPanel;