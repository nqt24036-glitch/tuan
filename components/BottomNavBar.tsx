import React from 'react';
import { CharacterIcon, InventoryIcon, AdventureIcon, SkillIcon, FormationIcon, ShoppingCartIcon, MapIcon, QuestIcon, CompanionIcon } from './IconComponents.tsx';

interface BottomNavBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

const navItems = [
  { id: 'character', label: 'Nhân Vật', icon: CharacterIcon },
  { id: 'skills', label: 'Kỹ Năng', icon: SkillIcon },
  { id: 'inventory', label: 'Túi Đồ', icon: InventoryIcon },
  { id: 'companion', label: 'Đồng Hành', icon: CompanionIcon },
  { id: 'adventure', label: 'Luyện Lịch', icon: AdventureIcon },
  { id: 'quest', label: 'Nhiệm Vụ', icon: QuestIcon },
  { id: 'map', label: 'Bản Đồ', icon: MapIcon },
  { id: 'formation', label: 'Trận Đồ', icon: FormationIcon },
  { id: 'store', label: 'Cửa Hàng', icon: ShoppingCartIcon },
];

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activePanel, onPanelChange }) => {
  return (
    <div className="bg-black/60 border border-gray-700 rounded-lg p-2 backdrop-blur-sm">
      <div className={`grid grid-cols-${navItems.length} gap-1`}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onPanelChange(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-200 ${
              activePanel === item.id ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <item.icon />
            <span className="text-xs mt-1 hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavBar;