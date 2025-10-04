import React, { useState } from 'react';
import { NPC, CombatStats, EquipmentSlot } from '../types.ts';
import { COMBAT_STAT_LABELS, ITEM_RARITY_TEXT_COLORS } from '../constants.ts';

interface NpcDetailModalProps {
  npc: NPC;
  onClose: () => void;
  onUpdateDetails: (npcId: string, details: { hairStyle?: number; eyeColor?: 'Đen' | 'Trắng' }) => void;
}

const EYE_COLORS: Array<'Đen' | 'Trắng'> = ['Đen', 'Trắng'];
const HAIR_STYLES_COUNT = 20;

const NpcDetailModal: React.FC<NpcDetailModalProps> = ({ npc, onClose, onUpdateDetails }) => {
  const [tempHairStyle, setTempHairStyle] = useState(npc.hairStyle);
  const [tempEyeColor, setTempEyeColor] = useState(npc.eyeColor);

  const avatarPreviewUrl = `https://api.multiavatar.com/${npc.name.trim()}-${tempHairStyle}-${tempEyeColor}.png`;
  
  const nextHair = () => setTempHairStyle(prev => (prev % HAIR_STYLES_COUNT) + 1);
  const prevHair = () => setTempHairStyle(prev => (prev === 1 ? HAIR_STYLES_COUNT : prev - 1));

  const handleSaveChanges = () => {
    onUpdateDetails(npc.id, {
        hairStyle: tempHairStyle,
        eyeColor: tempEyeColor,
    });
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-gray-900 border-2 border-cyan-700 rounded-lg p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto" 
        onClick={e => e.stopPropagation()}
      >
        {/* Left Side: Avatar & Customization */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <img src={avatarPreviewUrl} alt={npc.name} className="w-48 h-48 rounded-lg border-2 border-gray-600 object-cover mb-4" />
            <h2 className="text-2xl font-bold text-cyan-300">{npc.name}</h2>
            <p className="text-sm text-gray-400 italic mt-2">"{npc.description}"</p>
            
            {/* Customization Controls */}
            <div className="mt-4 space-y-3 bg-gray-800/50 p-3 rounded-lg w-full">
                <div>
                    <label className="block font-semibold text-sm mb-1">Kiểu Tóc</label>
                    <div className="flex items-center gap-2">
                        <button onClick={prevHair} className="px-3 py-1 rounded border-2 border-gray-600 bg-transparent hover:bg-gray-700">{'<'}</button>
                        <span className="w-full text-center bg-gray-900 border border-gray-600 rounded py-1 text-sm">{`Kiểu ${tempHairStyle}`}</span>
                        <button onClick={nextHair} className="px-3 py-1 rounded border-2 border-gray-600 bg-transparent hover:bg-gray-700">{'>'}</button>
                    </div>
                </div>
                 <div>
                    <label className="block font-semibold text-sm mb-1">Màu Mắt</label>
                    <div className="flex gap-2">
                        {EYE_COLORS.map(c => (
                        <button key={c} onClick={() => setTempEyeColor(c)} className={`flex-1 py-1 rounded border-2 transition-colors text-sm ${tempEyeColor === c ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-transparent border-gray-600 hover:bg-gray-700'}`}>
                            {c}
                        </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Right Side: Stats & Equipment */}
        <div className="w-full md:w-2/3">
            {/* Combat Stats */}
            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-bold text-yellow-300 border-b border-gray-600 pb-2 mb-3">Thuộc Tính</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {Object.entries(npc.totalStats).map(([key, value]) => {
                        const statKey = key as keyof CombatStats;
                        const label = COMBAT_STAT_LABELS[statKey];
                        const isPercent = ['critRate', 'critDamage', 'accuracy', 'evasion', 'armorPen', 'blockRate', 'mentalDemonResistance'].includes(key);
                        const displayValue = isPercent ? `${((value as number) * 100).toFixed(2)}%` : Math.round(value as number);

                        return (
                            <div key={key} className="flex justify-between border-b border-gray-800 py-1">
                                <span className="text-gray-400">{label}:</span>
                                <span className="font-semibold text-white">{displayValue}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Equipped Items */}
            {Object.values(npc.equippedItems).filter(Boolean).length > 0 && (
                <div className="mt-4 bg-gray-800/50 border border-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-yellow-300 mb-2">Trang bị:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(Object.keys(npc.equippedItems) as EquipmentSlot[]).map(slot => {
                        const item = npc.equippedItems[slot];
                        return (
                          item && (
                            <div key={slot} className="p-2 rounded bg-gray-800 border border-gray-600 flex items-center gap-2 text-sm" title={`${item.name}\n${item.description}`}>
                              <span className="text-xl">{item.icon}</span>
                              <span className={ITEM_RARITY_TEXT_COLORS[item.rarity]}>{item.name}</span>
                            </div>
                          )
                        );
                      })}
                    </div>
                </div>
            )}
             <div className="mt-6 flex justify-end gap-4">
                <button onClick={onClose} className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded font-semibold transition-colors">
                    Đóng
                </button>
                <button onClick={handleSaveChanges} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold transition-colors">
                    Lưu Thay Đổi
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default NpcDetailModal;