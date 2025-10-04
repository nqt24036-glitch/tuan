import React, { useState } from 'react';
import { Monster } from '../types';

interface AddNewMonsterModalProps {
  promptData: {
    name: string;
    suggestedMonster: Monster;
  };
  onConfirm: (monster: Monster) => void;
  onCancel: () => void;
}

const AddNewMonsterModal: React.FC<AddNewMonsterModalProps> = ({ promptData, onConfirm, onCancel }) => {
  const [monster, setMonster] = useState<Monster>(promptData.suggestedMonster);

  const handleStatChange = (stat: keyof Monster['stats'], value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setMonster(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: numValue,
      },
    }));
  };
  
  const handleRewardChange = (reward: keyof Monster['rewards'], value: string) => {
      const numValue = parseInt(value, 10) || 0;
      if (reward === 'items') return; // Not supporting item editing for now
      setMonster(prev => ({
          ...prev,
          rewards: {
              ...prev.rewards,
              [reward]: numValue,
          }
      }))
  }

  const handleHpChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setMonster(prev => ({ ...prev, hp: numValue }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-yellow-600 rounded-lg p-6 w-full max-w-2xl animate-fadeIn space-y-4">
        <h2 className="text-2xl font-bold text-yellow-300">Phát Hiện Yêu Thú Mới!</h2>
        <p className="text-gray-400">
          Yêu thú <span className="font-bold text-white">{promptData.name}</span> chưa từng được ghi nhận. Bạn có muốn thêm nó vào danh giám yêu thú không?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-2 bg-gray-800/50 rounded">
            {/* Basic Stats */}
            <div>
                <h4 className="font-semibold text-lg text-cyan-300 mb-2">Chỉ số cơ bản</h4>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <span className="w-24 text-gray-400">HP:</span>
                        <input type="number" value={monster.hp} onChange={e => handleHpChange(e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full" />
                    </label>
                    <label className="flex items-center">
                        <span className="w-24 text-gray-400">Tấn công:</span>
                        <input type="number" value={monster.stats.attack} onChange={e => handleStatChange('attack', e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full" />
                    </label>
                    <label className="flex items-center">
                        <span className="w-24 text-gray-400">Phòng ngự:</span>
                        <input type="number" value={monster.stats.defense} onChange={e => handleStatChange('defense', e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full" />
                    </label>
                    <label className="flex items-center">
                        <span className="w-24 text-gray-400">Tốc độ:</span>
                        <input type="number" value={monster.stats.speed} onChange={e => handleStatChange('speed', e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full" />
                    </label>
                </div>
            </div>
            {/* Rewards */}
            <div>
                 <h4 className="font-semibold text-lg text-green-300 mb-2">Phần thưởng</h4>
                 <div className="space-y-2">
                    <label className="flex items-center">
                        <span className="w-24 text-gray-400">EXP Cấp:</span>
                        <input type="number" value={monster.rewards.characterExp} onChange={e => handleRewardChange('characterExp', e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full" />
                    </label>
                    <label className="flex items-center">
                        <span className="w-24 text-gray-400">EXP Tu vi:</span>
                        <input type="number" value={monster.rewards.cultivationExp} onChange={e => handleRewardChange('cultivationExp', e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full" />
                    </label>
                    <label className="flex items-center">
                        <span className="w-24 text-gray-400">Linh thạch:</span>
                        <input type="number" value={monster.rewards.linhThach} onChange={e => handleRewardChange('linhThach', e.target.value)} className="bg-gray-900 border border-gray-600 rounded px-2 py-1 w-full" />
                    </label>
                 </div>
            </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onCancel} className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded font-semibold">Bỏ qua</button>
          <button onClick={() => onConfirm(monster)} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold">Thêm và Chiến đấu</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewMonsterModal;