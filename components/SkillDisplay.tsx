import React, { useState } from 'react';
import { Skill } from '../types.ts';
import { SparklesIcon, SwordIcon, ShieldIcon, CultivationIcon } from './IconComponents.tsx';

// Configuration for displaying all possible passive stat bonuses
const STAT_DISPLAY_CONFIG = {
  // CombatStats
  attack: { label: 'Công Kích', format: (v: number) => `+${v}` },
  magicAttack: { label: 'Pháp Công', format: (v: number) => `+${v}` },
  defense: { label: 'Phòng Thủ', format: (v: number) => `+${v}` },
  magicDefense: { label: 'Kháng Phép', format: (v: number) => `+${v}` },
  critRate: { label: 'Tỉ Lệ Chí Mạng', format: (v: number) => `+${(v * 100).toFixed(1)}%` },
  critDamage: { label: 'ST Chí Mạng', format: (v: number) => `+${((v - 1) * 100).toFixed(0)}%` },
  accuracy: { label: 'Chính Xác', format: (v: number) => `+${(v * 100).toFixed(1)}%` },
  evasion: { label: 'Né Tránh', format: (v: number) => `+${(v * 100).toFixed(1)}%` },
  speed: { label: 'Tốc Độ', format: (v: number) => `+${v}` },
  armorPen: { label: 'Xuyên Giáp', format: (v: number) => `+${(v * 100).toFixed(1)}%` },
  blockRate: { label: 'Chặn Đòn', format: (v: number) => `+${(v * 100).toFixed(1)}%` },
  mentalDemonResistance: { label: 'Kháng Tâm Ma', format: (v: number) => `+${(v * 100).toFixed(1)}%` },
  // Other bonuses
  hp: { label: 'HP Tối Đa', format: (v: number) => `+${v}` },
  mp: { label: 'MP Tối Đa', format: (v: number) => `+${v}` },
  cultivationSpeedBonus: { label: 'Tốc Độ Tu Luyện', format: (v: number) => `+${(v * 100).toFixed(0)}%` },
};

const STAT_GROUPS = [
    {
        id: 'offensive',
        label: 'Tấn Công & Sát Thương',
        icon: SwordIcon,
        keys: ['attack', 'magicAttack', 'critRate', 'critDamage', 'armorPen'],
        color: 'text-red-400'
    },
    {
        id: 'defensive',
        label: 'Phòng Thủ & Sống Sót',
        icon: ShieldIcon,
        keys: ['defense', 'magicDefense', 'blockRate', 'hp', 'mentalDemonResistance'],
        color: 'text-blue-400'
    },
    {
        id: 'utility',
        label: 'Linh Hoạt & Tiện Ích',
        icon: SparklesIcon,
        keys: ['speed', 'evasion', 'accuracy', 'mp'],
        color: 'text-green-400'
    },
    {
        id: 'cultivation',
        label: 'Tu Luyện',
        icon: CultivationIcon,
        keys: ['cultivationSpeedBonus'],
        color: 'text-purple-400'
    }
];

interface SkillDisplayProps {
  skills: Skill[];
}

const SkillDisplay: React.FC<SkillDisplayProps> = ({ skills }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(skills.length > 0 ? skills[0] : null);

  const renderPassiveBonuses = () => {
    if (!selectedSkill?.passiveBonus) return null;

    const activeGroups = STAT_GROUPS.map(group => {
        const activeBonuses = Object.entries(selectedSkill.passiveBonus ?? {})
            .filter(([key, value]) => group.keys.includes(key) && value !== undefined);
        
        return {
            ...group,
            bonuses: activeBonuses
        };
    }).filter(group => group.bonuses.length > 0);

    if (activeGroups.length === 0) return null;

    return (
      <div className="pt-3 mt-3 border-t border-gray-700 space-y-4">
        <h5 className="font-semibold text-green-300">Hiệu Ứng Thụ Động</h5>
        {activeGroups.map(group => (
            <div key={group.id} className="bg-gray-800/50 p-3 rounded-lg">
                <div className={`flex items-center gap-2 font-bold mb-2 ${group.color}`}>
                    <group.icon />
                    <h6>{group.label}</h6>
                </div>
                <div className="space-y-1 pl-7">
                    {group.bonuses.map(([key, value]) => {
                        const config = STAT_DISPLAY_CONFIG[key as keyof typeof STAT_DISPLAY_CONFIG];
                        return (
                            <div key={key} className="flex justify-between text-sm">
                                <span className="text-gray-400">{config.label}:</span>
                                <span className="font-medium text-white">{config.format(value as number)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <h3 className="text-2xl font-serif text-yellow-300 mb-4">Công Pháp Đã Học</h3>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {skills.length > 0 ? (
                skills.map(skill => (
                    <button
                        key={skill.id}
                        onClick={() => setSelectedSkill(skill)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedSkill?.id === skill.id ? 'bg-yellow-800/50 border-yellow-600' : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/50'}`}
                    >
                        <div className={`p-2 rounded flex-shrink-0 ${skill.type === 'Chủ Động' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            <SparklesIcon />
                        </div>
                        <div>
                          <p className="font-semibold">{skill.name}</p>
                          <p className={`text-xs ${skill.type === 'Chủ Động' ? 'text-red-400' : 'text-green-400'}`}>{skill.type}</p>
                        </div>
                    </button>
                ))
            ) : (
                <p className="text-center text-gray-500 mt-8">Chưa học được công pháp nào.</p>
            )}
        </div>
      </div>

      <div className="md:col-span-2">
        <h3 className="text-2xl font-serif text-yellow-300 mb-4">Chi Tiết Kỹ Năng</h3>
        {selectedSkill ? (
            <div className="p-4 rounded-lg border-2 border-purple-700 bg-gray-900/70 space-y-3">
                <h4 className="text-2xl font-bold text-purple-300">{selectedSkill.name}</h4>
                <p className="text-sm text-gray-500 italic">Nguồn gốc: {selectedSkill.origin}</p>
                <p className="text-gray-300 min-h-[6rem]">{selectedSkill.description}</p>
                
                {selectedSkill.type === 'Chủ Động' && (
                    <div className="pt-3 mt-3 border-t border-gray-700">
                        <h5 className="font-semibold text-red-300 mb-2">Hiệu Ứng Chủ Động</h5>
                        <div className="flex flex-wrap gap-x-6">
                            {selectedSkill.damage !== undefined && <p className="text-md">Sát thương cơ bản: <span className="font-bold text-white">{selectedSkill.damage}</span></p>}
                            {selectedSkill.mpCost !== undefined && <p className="text-md">Tiêu hao MP: <span className="font-bold text-white">{selectedSkill.mpCost}</span></p>}
                        </div>
                    </div>
                )}
                
                {renderPassiveBonuses()}
            </div>
        ) : (
            <div className="flex items-center justify-center h-full p-4 rounded-lg border-2 border-dashed border-gray-700">
                <p className="text-gray-500">Chọn một kỹ năng để xem chi tiết.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SkillDisplay;