import React from 'react';
import { Player, Item } from '../types';
import { STORE_INVENTORY } from '../data/gameData';
import { ITEM_RARITY_COLORS, ITEM_RARITY_TEXT_COLORS } from '../constants';

interface StorePanelProps {
  player: Player;
  onBuyItem: (itemId: string, price: number) => void;
  masterItemList: Item[];
}

const StorePanel: React.FC<StorePanelProps> = ({ player, onBuyItem, masterItemList }) => {
  const storeItems = STORE_INVENTORY.map(storeItem => {
    const itemDetails = masterItemList.find(i => i.id === storeItem.itemId);
    return { ...itemDetails, price: storeItem.price };
  }).filter(item => item.id); // Filter out items not found in ITEM_LIST

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-serif text-yellow-300">Thương Hội</h3>
        <div className="text-lg bg-gray-900/50 border border-gray-700 px-4 py-1 rounded-lg">
          <span className="text-gray-400">Linh Thạch: </span>
          <span className="font-bold text-yellow-400">{player.linhThach}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storeItems.map(item => {
          // The filter above ensures item.id and item.price exist, but we check again for type safety
          if (!item.id || item.price === undefined || !item.rarity) return null;
          
          const canAfford = player.linhThach >= item.price;
          const alreadyKnown = item.skillId ? player.skills.some(s => s.id === item.skillId) : false;
          const meetsRequirement = !item.requirement || player.sect === item.requirement;
          const isDisabled = !canAfford || alreadyKnown || !meetsRequirement;

          let buttonText = 'Mua';
          if (alreadyKnown) buttonText = 'Đã Học';
          else if (!meetsRequirement) buttonText = `Yêu cầu: ${item.requirement}`;
          else if (!canAfford) buttonText = 'Không đủ Linh Thạch';

          return (
            <div key={item.id} className={`bg-gray-900/50 border-2 p-4 rounded-lg flex flex-col transition-all ${ITEM_RARITY_COLORS[item.rarity]}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-xl">{item.icon}</div>
                <div>
                  <h4 className={`font-semibold text-lg ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>{item.name}</h4>
                  <p className="text-sm text-yellow-400">{item.price} Linh Thạch</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">Cấp: {item.rarity}</p>
              <div className="flex-grow mb-4">
                <p className="text-sm text-gray-400">{item.description}</p>
                {item.stats && (
                  <div className="text-xs mt-3 pt-3 border-t border-gray-700 space-y-1">
                    <h5 className="font-semibold text-green-300">Thuộc tính</h5>
                    {Object.entries(item.stats).map(([key, value]) => (
                      <p key={key} className="text-gray-300 capitalize flex justify-between">
                        <span>{key}:</span>
                        <span className="font-mono text-green-400">+{value}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => onBuyItem(item.id!, item.price!)}
                disabled={isDisabled}
                className="w-full mt-auto px-4 py-2 rounded-md font-semibold transition-colors bg-green-700 hover:bg-green-600 border border-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-500 disabled:text-gray-400"
              >
                {buttonText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorePanel;