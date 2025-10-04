import React, { useState } from 'react';
// FIX: Added .ts extension to fix module resolution error.
import { Player, PotentialStats, CombatStats, SpiritRoot, EquipmentSlot, Item } from '../types.ts';
// FIX: Added .tsx extension to fix module resolution error.
import CultivationPanel from './CultivationPanel.tsx';
// FIX: Added .ts extension to fix module resolution error.
import { ITEM_RARITY_COLORS, ITEM_RARITY_TEXT_COLORS, COMBAT_STAT_LABELS } from '../constants.ts';

// Props for the main panel
interface CharacterPanelProps {
  player: Player;
  isCultivating: boolean;
  setIsCultivating: (isCultivating: boolean) => void;
  cultivationBonus: number;
  onCultivate: () => () => void;
  isMeditating: boolean;
  setIsMeditating: (isMeditating: boolean) => void;
  onMeditate: () => () => void;
  onSpendPotentialPoint: (stat: keyof PotentialStats) => void;
  onUnequipItem: (slot: EquipmentSlot) => void;
  onActivateCultivationMethod: (methodId: string) => void;
}

// Props for the info tab
interface InfoTabProps {
  player: Player;
  onSpendPotentialPoint: (stat: keyof PotentialStats) => void;
}

// Props for the equipment tab
interface EquipmentTabProps {
  player: Player;
  onUnequipItem: (slot: EquipmentSlot) => void;
}

// Labels for potential stats for UI display
const POTENTIAL_STAT_LABELS: Record<keyof PotentialStats, string> = {
  theChat: 'Thể Chất',
  triLuc: 'Trí Lực',
  linhMan: 'Linh Mẫn',
  sucManh: 'Sức Mạnh',
  canCo: 'Căn Cơ',
  dinhLuc: 'Định Lực',
};

const POTENTIAL_STAT_TOOLTIPS: Record<keyof PotentialStats, string> = {
  theChat: 'Tăng HP tối đa và Phòng Ngự.',
  triLuc: 'Tăng MP tối đa và Pháp Công.',
  linhMan: 'Tăng Tốc Độ và Né Tránh.',
  sucManh: 'Tăng Công Kích.',
  canCo: 'Tăng Kháng Phép.',
  dinhLuc: 'Tăng Kháng Phép và Kháng Tâm Ma.',
};

// Sub-component for displaying character info and stats
const InfoTab: React.FC<InfoTabProps> = ({ player, onSpendPotentialPoint }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Potential Stats & Spirit Root */}
      <div className="lg:col-span-1 space-y-6">
        {/* Potential Stats */}
        <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-bold text-yellow-300 border-b border-gray-600 pb-2 mb-3">Tiềm Năng</h4>
          <p className="mb-3 text-sm text-gray-400">Điểm còn lại: <span className="font-bold text-white text-lg">{player.potentialPoints}</span></p>
          <div className="space-y-2">
            {Object.entries(player.potentialStats).map(([key, value]) => {
              const statKey = key as keyof PotentialStats;
              return (
              <div key={key} className="relative group flex justify-between items-center text-sm">
                <span className="text-gray-300 cursor-help">{POTENTIAL_STAT_LABELS[statKey]}:</span>
                 <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                >
                    {POTENTIAL_STAT_TOOLTIPS[statKey]}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white w-8 text-right">{value}</span>
                  {player.potentialPoints > 0 && (
                    <button onClick={() => onSpendPotentialPoint(statKey)} className="w-6 h-6 bg-green-600 text-white rounded-full hover:bg-green-500 transition-colors">+</button>
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Spirit Root */}
        <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg">
           <h4 className="text-lg font-bold text-yellow-300 border-b border-gray-600 pb-2 mb-3">Linh Căn</h4>
           <div className="space-y-1 text-sm">
             <p>Linh Căn: <span className="font-semibold text-cyan-300">{player.spiritRoot.linhCan}</span></p>
             <p>Phẩm Chất: <span className="font-semibold text-purple-300">{player.spiritRoot.phamChat}</span></p>
             <p>Căn Cốt: <span className="font-semibold text-white">{player.spiritRoot.canCot}</span></p>
             <p>Phúc Duyên: <span className="font-semibold text-white">{player.spiritRoot.phucDuyen}</span></p>
           </div>
        </div>
      </div>

      {/* Right Column: Combat Stats */}
      <div className="lg:col-span-2 bg-gray-900/50 border border-gray-700 p-4 rounded-lg">
         <h4 className="text-lg font-bold text-yellow-300 border-b border-gray-600 pb-2 mb-3">Thuộc Tính Tổng</h4>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            {Object.entries(player.totalStats).map(([key, value]) => {
                const statKey = key as keyof CombatStats;
                const label = COMBAT_STAT_LABELS[statKey];
                let displayValue: React.ReactNode;

                if (statKey === 'critRate') {
                    const total = player.totalStats.critRate;
                    const bonus = total - player.baseStats.critRate;
                    displayValue = (
                        <span className="flex items-center justify-end">
                            <span>{(total * 100).toFixed(2)}%</span>
                            {bonus > 0.0001 && <span className="text-green-400 ml-1">(+{(bonus * 100).toFixed(2)}%)</span>}
                        </span>
                    );
                } else if (statKey === 'critDamage') {
                    const total = player.totalStats.critDamage;
                    const bonus = total - player.baseStats.critDamage;
                    displayValue = (
                        <span className="flex items-center justify-end">
                            <span>+{((total - 1) * 100).toFixed(2)}%</span>
                            {bonus > 0.0001 && <span className="text-green-400 ml-1">(+{(bonus * 100).toFixed(2)}%)</span>}
                        </span>
                    );
                } else {
                    const isPercent = ['accuracy', 'evasion', 'armorPen', 'blockRate', 'mentalDemonResistance'].includes(key);
                    const displayValueNum = isPercent ? `${((value as number) * 100).toFixed(2)}%` : Math.round(value as number);
                    displayValue = <span>{displayValueNum}</span>;
                }

                return (
                    <div key={key} className="flex justify-between border-b border-gray-800 py-1">
                        <span className="text-gray-400">{label}:</span>
                        <span className="font-semibold text-white text-right">{displayValue}</span>
                    </div>
                );
            })}
         </div>
      </div>
    </div>
  );
};

// Sub-component for displaying equipped items
const EquipmentTab: React.FC<EquipmentTabProps> = ({ player, onUnequipItem }) => {
  const slots: EquipmentSlot[] = ['vũ khí', 'áo giáp', 'pháp bảo'];

  const renderItemCard = (item: Item | null, slot: EquipmentSlot) => {
    return (
      <div className={`p-4 rounded-lg border-2 h-52 flex flex-col justify-between ${item ? ITEM_RARITY_COLORS[item.rarity] : 'border-gray-700 border-dashed'} bg-gray-900/50`}>
        <div>
          <p className="text-sm uppercase text-gray-500">{slot}</p>
          {item ? (
            <>
              <h5 className={`font-bold text-lg ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>{item.name}</h5>
              <div className="text-xs mt-2">
                {item.stats && Object.entries(item.stats).map(([key, value]) => (
                  <p key={key} className="text-green-400 capitalize">{key}: +{value}</p>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-600 mt-4">Chưa trang bị</p>
          )}
        </div>
        {item && (
          <div className="mt-auto">
            <p className="text-xs text-right text-gray-400 mb-2">{item.rarity}</p>
            <button 
              onClick={() => onUnequipItem(slot)} 
              className="w-full px-3 py-1 text-sm bg-red-600 hover:bg-red-500 rounded font-semibold transition-colors"
            >
              Tháo
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
        <h3 className="text-2xl font-serif text-yellow-300 text-center">Trang Bị Trên Người</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {slots.map(slot => (
                <div key={slot}>
                    {renderItemCard(player.equippedItems[slot] ?? null, slot)}
                </div>
            ))}
        </div>
    </div>
  );
};


// Main Character Panel Component
const CharacterPanel: React.FC<CharacterPanelProps> = ({ player, onSpendPotentialPoint, onUnequipItem, onActivateCultivationMethod, ...cultivationProps }) => {
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'cultivation', 'equipment'

  const tabs = [
      { id: 'info', label: 'Thông Tin' },
      { id: 'cultivation', label: 'Tu Luyện' },
      { id: 'equipment', label: 'Trang Bị' },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'info':
        return <InfoTab player={player} onSpendPotentialPoint={onSpendPotentialPoint} />;
      case 'cultivation':
        return <CultivationPanel player={player} onActivateCultivationMethod={onActivateCultivationMethod} {...cultivationProps} />;
      case 'equipment':
        return <EquipmentTab player={player} onUnequipItem={onUnequipItem} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center border-b border-gray-700 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 text-lg font-semibold transition-colors ${
              activeTab === tab.id
                ? 'text-yellow-300 border-b-2 border-yellow-300'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* FIX: Complete the component structure that was truncated in the original file. */}
      <div className="flex-grow overflow-y-auto pr-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default CharacterPanel;