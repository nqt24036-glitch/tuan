import React from 'react';
import { Player, Companion, Monster, CombatStats, Skill, EquipmentSlot } from '../types';
import { COMBAT_STAT_LABELS, ITEM_RARITY_TEXT_COLORS } from '../constants';
import { SparklesIcon } from './IconComponents';

interface CharacterDetailPopupProps {
  character: Player | Companion | Monster;
  onClose: () => void;
}

const CharacterDetailPopup: React.FC<CharacterDetailPopupProps> = ({ character, onClose }) => {
  const isPlayerOrCompanion = 'level' in character;
  const isPlayer = isPlayerOrCompanion && 'potentialPoints' in character;
  const characterStats: CombatStats = isPlayerOrCompanion ? character.totalStats : character.stats;

  const getBorderColor = () => {
    if (isPlayer) return 'border-cyan-500';
    if (isPlayerOrCompanion) return 'border-yellow-500';
    return 'border-red-500';
  };

  const getAvatar = () => {
    if (isPlayerOrCompanion) {
      return <img src={character.avatarUrl} alt={character.name} className="w-24 h-24 rounded-lg border-2 border-gray-600 object-cover" />;
    }
    return <div className="w-24 h-24 rounded-lg border-2 border-gray-600 bg-black flex items-center justify-center text-5xl">?</div>;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div 
        className={`bg-gray-900 border-2 ${getBorderColor()} rounded-lg p-6 w-full max-w-3xl flex flex-col gap-6 max-h-[90vh]`} 
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-start">
            <div className="flex gap-4">
                {getAvatar()}
                <div>
                    <h2 className="text-3xl font-bold text-white">{character.name}</h2>
                    {isPlayerOrCompanion && <p className="text-lg text-gray-400">Cấp {character.level}</p>}
                    <div className="flex gap-4 mt-2">
                        <p className="text-md font-semibold text-green-400">HP: {character.hp} / {isPlayerOrCompanion ? character.maxHp : character.hp}</p>
                        {isPlayerOrCompanion && <p className="text-md font-semibold text-blue-400">MP: {character.mp} / {character.maxMp}</p>}
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="text-3xl font-bold hover:text-red-500 transition-colors">&times;</button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2">
            {/* Stats Section */}
            <section>
                <h3 className="text-xl font-semibold text-yellow-300 border-b border-gray-700 pb-2 mb-3">Thuộc Tính Chi Tiết</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    {Object.entries(characterStats).map(([key, value]) => {
                        const statKey = key as keyof CombatStats;
                        const label = COMBAT_STAT_LABELS[statKey] || statKey;
                        const isPercent = ['critRate', 'critDamage', 'accuracy', 'evasion', 'armorPen', 'blockRate', 'mentalDemonResistance'].includes(key);
                        const displayValue = isPercent ? `${((value as number) * 100).toFixed(1)}%` : Math.round(value as number);
                        return (
                            <div key={key} className="flex justify-between py-1">
                                <span className="text-gray-400">{label}:</span>
                                <span className="font-semibold text-white">{displayValue}</span>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Equipment & Skills Section */}
            <section className="space-y-4">
                {isPlayerOrCompanion && Object.values(character.equippedItems).length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold text-yellow-300 border-b border-gray-700 pb-2 mb-3">Trang Bị</h3>
                        <div className="space-y-2">
                            {(Object.keys(character.equippedItems) as EquipmentSlot[]).map(slot => {
                                const item = character.equippedItems[slot];
                                if (!item) return null;
                                return (
                                    <div key={slot} className="p-2 rounded bg-gray-800/70 border border-gray-700 flex items-center gap-2">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <p className={`font-semibold text-sm ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>{item.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{slot}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                {character.skills && character.skills.length > 0 && (
                     <div>
                        <h3 className="text-xl font-semibold text-yellow-300 border-b border-gray-700 pb-2 mb-3">Kỹ Năng</h3>
                        <div className="space-y-2">
                            {character.skills.map(skill => (
                                <div key={skill.id} className="p-2 rounded bg-gray-800/70 border border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1 rounded flex-shrink-0 ${skill.type === 'Chủ Động' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}><SparklesIcon /></div>
                                        <p className="font-semibold">{skill.name}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 pl-8">{skill.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </main>
      </div>
    </div>
  );
};

export default CharacterDetailPopup;