
import React, { useState, useEffect } from 'react';
import { Player, Companion, CombatStats, Skill, EquipmentSlot, Item } from '../types.ts';
import { COMBAT_STAT_LABELS, ITEM_RARITY_COLORS, ITEM_RARITY_TEXT_COLORS } from '../constants.ts';
import { SparklesIcon } from './IconComponents.tsx';
import CompanionEquipModal from './CompanionEquipModal.tsx';

interface CompanionPanelProps {
  player: Player;
  onSetActiveCompanion: (companionId: string | null) => void;
  onEquipItem: (companionId: string, item: Item) => void;
  onUnequipItem: (companionId: string, slot: EquipmentSlot) => void;
}

const CompanionPanel: React.FC<CompanionPanelProps> = ({ player, onSetActiveCompanion, onEquipItem, onUnequipItem }) => {
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(player.companions.length > 0 ? player.companions[0] : null);
  const [isEquipModalOpen, setIsEquipModalOpen] = useState(false);
  const [slotToEquip, setSlotToEquip] = useState<EquipmentSlot | null>(null);

  // FIX: Added useEffect to synchronize the selected companion's data with the main player state.
  // This ensures that when an item is equipped, the UI updates in real-time to show the new item.
  useEffect(() => {
    if (selectedCompanion) {
      const updatedCompanion = player.companions.find(c => c.id === selectedCompanion.id);
      setSelectedCompanion(updatedCompanion || null);
    } else if (player.companions.length > 0) {
      setSelectedCompanion(player.companions[0]);
    }
  }, [player.companions]);


  const handleOpenEquipModal = (slot: EquipmentSlot) => {
    setSlotToEquip(slot);
    setIsEquipModalOpen(true);
  };

  const handleEquipItemSelected = (item: Item) => {
    if (selectedCompanion && slotToEquip) {
      onEquipItem(selectedCompanion.id, item);
    }
    setIsEquipModalOpen(false);
    setSlotToEquip(null);
  };

  const renderEquipment = () => {
    if (!selectedCompanion) return null;
    const slots: EquipmentSlot[] = ['vũ khí', 'áo giáp', 'pháp bảo'];

    return (
      <div>
        <h5 className="font-semibold text-yellow-300 mb-2 mt-4">Trang Bị</h5>
        <div className="grid grid-cols-3 gap-3">
          {slots.map(slot => {
            const item = selectedCompanion.equippedItems[slot];
            if (item) {
              return (
                <div key={slot} className={`p-2 rounded-lg border-2 h-28 flex flex-col justify-between text-center ${ITEM_RARITY_COLORS[item.rarity]} bg-gray-800/50`}>
                  <div className="text-2xl">{item.icon}</div>
                  <p className={`text-xs font-semibold truncate ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>{item.name}</p>
                  <button
                    onClick={() => onUnequipItem(selectedCompanion.id, slot)}
                    className="w-full text-xs bg-red-600 hover:bg-red-500 rounded py-1"
                  >
                    Tháo
                  </button>
                </div>
              );
            } else {
              return (
                <button
                  key={slot}
                  onClick={() => handleOpenEquipModal(slot)}
                  className="p-2 rounded-lg border-2 border-dashed border-gray-600 h-28 flex flex-col justify-center items-center text-gray-500 hover:bg-gray-800/50 hover:border-gray-500 transition-colors"
                >
                  <span className="text-xs uppercase">{slot}</span>
                  <span className="text-sm mt-1">Trống</span>
                </button>
              );
            }
          })}
        </div>
      </div>
    );
  };

  const StatDisplay: React.FC<{ label: string; value: number | string; }> = ({ label, value }) => (
    <div className="flex justify-between border-b border-gray-800 py-1 text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className="font-semibold text-white">{value}</span>
    </div>
  );

  return (
    <>
      {isEquipModalOpen && selectedCompanion && slotToEquip && (
          <CompanionEquipModal
              playerInventory={player.inventory}
              slotToEquip={slotToEquip}
              onClose={() => setIsEquipModalOpen(false)}
              onEquip={handleEquipItemSelected}
          />
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        <div className="md:col-span-1">
          <h3 className="text-2xl font-serif text-yellow-300 mb-4">Đồng Hành</h3>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
              {player.companions.length > 0 ? (
                  player.companions.map(comp => (
                      <button
                          key={comp.id}
                          onClick={() => setSelectedCompanion(comp)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedCompanion?.id === comp.id ? 'bg-yellow-800/50 border-yellow-600' : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/50'}`}
                      >
                          <img src={comp.avatarUrl} alt={comp.name} className="w-12 h-12 rounded-full border-2 border-gray-600 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">{comp.name}</p>
                            <p className="text-xs text-gray-400">Cấp {comp.level}</p>
                            {player.activeCompanionId === comp.id && <span className="text-xs text-cyan-400 font-bold">Đang triệu hồi</span>}
                          </div>
                      </button>
                  ))
              ) : (
                  <p className="text-center text-gray-500 mt-8">Chưa có đồng hành nào.</p>
              )}
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-2xl font-serif text-yellow-300 mb-4">Chi Tiết Đồng Hành</h3>
          {selectedCompanion ? (
              <div className="p-4 rounded-lg border-2 border-purple-700 bg-gray-900/70 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                      <img src={selectedCompanion.avatarUrl} alt={selectedCompanion.name} className="w-32 h-32 rounded-lg border-2 border-gray-600 flex-shrink-0" />
                      <div className="flex-grow">
                          <h4 className="text-2xl font-bold text-purple-300">{selectedCompanion.name}</h4>
                          <p className="text-sm text-gray-400 italic">"{selectedCompanion.description}"</p>
                          <div className="mt-2 text-sm">
                              <p>Cấp: <span className="font-bold text-white">{selectedCompanion.level}</span></p>
                              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(selectedCompanion.exp / selectedCompanion.expToNextLevel) * 100}%` }}></div>
                              </div>
                              <p className="text-xs text-right">{selectedCompanion.exp} / {selectedCompanion.expToNextLevel} EXP</p>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                          <h5 className="font-semibold text-yellow-300 mb-2">Thuộc Tính</h5>
                          <div className="space-y-1">
                              <StatDisplay label="HP" value={`${selectedCompanion.hp} / ${selectedCompanion.maxHp}`} />
                              <StatDisplay label="MP" value={`${selectedCompanion.mp} / ${selectedCompanion.maxMp}`} />
                              {Object.entries(selectedCompanion.totalStats).map(([key, value]) => {
                                  const statKey = key as keyof CombatStats;
                                  const isPercent = ['critRate', 'critDamage', 'accuracy', 'evasion', 'armorPen', 'blockRate'].includes(key);
                                  const displayValue = isPercent ? `${((value as number) * 100).toFixed(1)}%` : Math.round(value as number);
                                  return <StatDisplay key={key} label={COMBAT_STAT_LABELS[statKey]} value={displayValue} />;
                              })}
                          </div>
                      </div>
                      <div>
                          <h5 className="font-semibold text-yellow-300 mb-2">Kỹ Năng</h5>
                          <div className="space-y-2">
                            {selectedCompanion.skills.map(skill => (
                              <div key={skill.id} className="p-2 bg-gray-800/50 rounded border border-gray-700">
                                <div className="flex items-center gap-2">
                                <div className={`p-1 rounded flex-shrink-0 ${skill.type === 'Chủ Động' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}><SparklesIcon /></div>
                                  <p className="font-semibold">{skill.name}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{skill.description}</p>
                              </div>
                            ))}
                          </div>
                      </div>
                  </div>
                  
                  {renderEquipment()}

                  <div className="pt-4 text-center">
                      <button 
                          onClick={() => onSetActiveCompanion(selectedCompanion.id)}
                          className={`w-full max-w-xs py-3 rounded-lg font-bold text-lg transition-colors ${player.activeCompanionId === selectedCompanion.id ? 'bg-red-600 hover:bg-red-500' : 'bg-cyan-600 hover:bg-cyan-500'}`}
                      >
                          {player.activeCompanionId === selectedCompanion.id ? 'Nghỉ Ngơi' : 'Triệu Hồi'}
                      </button>
                  </div>
              </div>
          ) : (
              <div className="flex items-center justify-center h-full p-4 rounded-lg border-2 border-dashed border-gray-700">
                  <p className="text-gray-500">Chọn một đồng hành để xem chi tiết.</p>
              </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanionPanel;
