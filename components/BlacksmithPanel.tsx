import React, { useState, useMemo } from 'react';
import { Player, Item } from '../types.ts';
import { BLACKSMITH_INVENTORY, CRAFTING_RECIPES } from '../data/gameData.ts';
import { ITEM_RARITY_COLORS, ITEM_RARITY_TEXT_COLORS } from '../constants.ts';

interface BlacksmithPanelProps {
  player: Player;
  onClose: () => void;
  onBuyItem: (itemId: string, price: number) => void;
  onSellItem: (item: Item) => void;
  onCraftItem: (inputIds: [string, string], outputId: string) => void;
  onNotify: (message: string) => void;
  masterItemList: Item[];
}

interface StackedItem {
  item: Item;
  count: number;
}

const BlacksmithPanel: React.FC<BlacksmithPanelProps> = ({ player, onClose, onBuyItem, onSellItem, onCraftItem, onNotify, masterItemList }) => {
  const [activeTab, setActiveTab] = useState('craft'); // craft, buy, sell

  // State for Sell Tab
  const [sellSelectedItem, setSellSelectedItem] = useState<Item | null>(null);

  // State for Craft Tab
  const [craftSlot1, setCraftSlot1] = useState<Item | null>(null);
  const [craftSlot2, setCraftSlot2] = useState<Item | null>(null);

  const stackedCraftableInventory = useMemo((): StackedItem[] => {
    const itemMap = new Map<string, StackedItem>();
    player.inventory.filter(i => i.type === 'Nguyên liệu').forEach(item => {
        if (itemMap.has(item.id)) {
            itemMap.get(item.id)!.count++;
        } else {
            itemMap.set(item.id, { item: { ...item }, count: 1 });
        }
    });
    return Array.from(itemMap.values());
  }, [player.inventory]);

  const craftResult = useMemo(() => {
    if (!craftSlot1 || !craftSlot2) return null;
    const inputIds = [craftSlot1.id, craftSlot2.id].sort();
    const recipe = CRAFTING_RECIPES.find(r => r.inputs.slice().sort().join(',') === inputIds.join(','));
    if (!recipe) return null;
    return masterItemList.find(i => i.id === recipe.output) || null;
  }, [craftSlot1, craftSlot2, masterItemList]);

  const handleSellItemClick = (item: Item) => {
    setSellSelectedItem(item);
  };

  const handleConfirmSell = () => {
    if (sellSelectedItem) {
      onSellItem(sellSelectedItem);
      setSellSelectedItem(null);
    }
  };

  const handleAddToCraftSlot = (item: Item) => {
    if (!craftSlot1) {
      setCraftSlot1(item);
    } else if (!craftSlot2) {
      setCraftSlot2(item);
    }
  };

  const handleRemoveFromCraftSlot = (slot: 1 | 2) => {
    if (slot === 1) setCraftSlot1(null);
    if (slot === 2) setCraftSlot2(null);
  };
  
  const handleCraft = () => {
    if (craftResult && craftSlot1 && craftSlot2) {
      const pInvCounts = player.inventory.reduce((acc, item) => {
          acc[item.id] = (acc[item.id] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);

      const hasSlot1 = pInvCounts[craftSlot1.id] >= 1;
      const hasSlot2 = pInvCounts[craftSlot2.id] >= (craftSlot1.id === craftSlot2.id ? 2 : 1);

      if (hasSlot1 && hasSlot2) {
        onCraftItem([craftSlot1.id, craftSlot2.id], craftResult.id);
        setCraftSlot1(null);
        setCraftSlot2(null);
      } else {
        onNotify("Không đủ nguyên liệu trong túi đồ.");
      }
    }
  };

  const sellableInventory = useMemo((): StackedItem[] => {
    const itemMap = new Map<string, StackedItem>();
    player.inventory.filter(i => i.value !== undefined).forEach(item => {
        if (itemMap.has(item.id)) {
            itemMap.get(item.id)!.count++;
        } else {
            itemMap.set(item.id, { item: { ...item }, count: 1 });
        }
    });
    return Array.from(itemMap.values());
  }, [player.inventory]);


  const renderBuyTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[60vh] p-1">
      {BLACKSMITH_INVENTORY.map(({ itemId, price }) => {
        const item = masterItemList.find(i => i.id === itemId);
        if (!item) return null;
        const canAfford = player.linhThach >= price;
        return (
          <div key={itemId} className={`p-3 rounded-lg border-2 ${ITEM_RARITY_COLORS[item.rarity]} bg-gray-800/50 flex flex-col`}>
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-xl">{item.icon}</div>
                <div>
                  <h4 className={`font-semibold ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>{item.name}</h4>
                  <p className="text-sm text-yellow-400">{price} Linh Thạch</p>
                </div>
              </div>
            <p className="text-xs text-gray-400 flex-grow mb-3">{item.description}</p>
            <button onClick={() => onBuyItem(itemId, price)} disabled={!canAfford} className="w-full mt-auto px-3 py-1 rounded font-semibold transition-colors bg-green-700 hover:bg-green-600 border border-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed">
              {canAfford ? 'Mua' : 'Không đủ Linh Thạch'}
            </button>
          </div>
        );
      })}
    </div>
  );

  const renderSellTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className="flex flex-col min-h-0">
        <h4 className="text-lg font-semibold text-yellow-300 mb-2 flex-shrink-0">Túi Đồ Của Bạn</h4>
        <div className="space-y-2 overflow-y-auto flex-grow border rounded border-gray-700 p-2 bg-black/20">
          {sellableInventory.length > 0 ? (
            sellableInventory.map(({ item, count }) => (
              <button key={item.id} onClick={() => handleSellItemClick(item)} className={`w-full text-left p-2 rounded flex items-center gap-2 transition-colors ${sellSelectedItem?.id === item.id ? 'bg-yellow-800/50' : 'bg-gray-800/70 hover:bg-gray-700/80'}`}>
                <span className="text-lg">{item.icon}</span>
                <span className={`flex-grow ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>
                    {item.name}
                    {count > 1 && <span className="text-yellow-400 font-normal ml-2">x{count}</span>}
                </span>
                <span className="text-sm text-yellow-400">{Math.floor(item.value! / 2)} LT</span>
              </button>
            ))
          ) : (
             <p className="text-gray-500 text-center p-4">Không có gì để bán.</p>
          )}
        </div>
      </div>
      <div className="bg-gray-800/50 rounded border border-gray-700 p-4 flex flex-col justify-center items-center">
        {sellSelectedItem ? (
          <>
            <h4 className="text-xl font-bold">Bán <span className={ITEM_RARITY_TEXT_COLORS[sellSelectedItem.rarity]}>{sellSelectedItem.name}</span></h4>
            <p className="text-2xl text-yellow-300 my-4">{Math.floor(sellSelectedItem.value! / 2)} Linh Thạch</p>
            <div className="flex gap-4">
              <button onClick={() => setSellSelectedItem(null)} className="px-6 py-2 rounded bg-gray-600 hover:bg-gray-500">Hủy</button>
              <button onClick={handleConfirmSell} className="px-6 py-2 rounded bg-green-600 hover:bg-green-500">Xác Nhận</button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Chọn một vật phẩm để bán.</p>
        )}
      </div>
    </div>
  );
  
  const CraftSlot: React.FC<{item: Item | null, onRemove: () => void, placeholder: string}> = ({ item, onRemove, placeholder }) => (
    <div className="w-28 h-28 border-2 border-dashed border-gray-600 rounded bg-black/30 flex justify-center items-center relative">
      {item ? (
        <>
          <div className="text-center">
            <div className="text-3xl">{item.icon}</div>
            <div className={`text-xs ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>{item.name}</div>
          </div>
          <button onClick={onRemove} className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full text-white font-bold text-sm">X</button>
        </>
      ) : (
        <span className="text-gray-500 text-sm">{placeholder}</span>
      )}
    </div>
  );

  const renderCraftTab = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col min-h-0">
            <h4 className="text-lg font-semibold text-yellow-300 mb-2 flex-shrink-0">Nguyên Liệu</h4>
            <div className="space-y-2 overflow-y-auto flex-grow border rounded border-gray-700 p-2 bg-black/20">
                {stackedCraftableInventory.length > 0 ? (
                    stackedCraftableInventory.map(({ item, count }) => (
                        <button key={item.id} onClick={() => handleAddToCraftSlot(item)} className="w-full text-left p-2 rounded flex items-center gap-2 bg-gray-800/70 hover:bg-gray-700/80">
                            <span className="text-lg">{item.icon}</span>
                            <span className={`flex-grow ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>{item.name}</span>
                            {count > 1 && <span className="text-yellow-400 font-normal">x{count}</span>}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-500 text-center p-4">Không có nguyên liệu.</p>
                )}
            </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 bg-gray-800/50 rounded border border-gray-700 p-4">
            <div className="flex items-center gap-4">
                <CraftSlot item={craftSlot1} onRemove={() => handleRemoveFromCraftSlot(1)} placeholder="NL 1" />
                <span className="text-3xl font-bold">+</span>
                <CraftSlot item={craftSlot2} onRemove={() => handleRemoveFromCraftSlot(2)} placeholder="NL 2" />
            </div>
            <div className="text-4xl">↓</div>
            <div className="w-40 h-28 border-2 border-green-500 rounded bg-black/30 flex justify-center items-center">
                {craftResult ? (
                    <div className="text-center">
                        <div className="text-3xl">{craftResult.icon}</div>
                        <div className={`text-sm ${ITEM_RARITY_TEXT_COLORS[craftResult.rarity]}`}>{craftResult.name}</div>
                    </div>
                ) : (
                    <span className="text-gray-500 text-sm">Thành Phẩm</span>
                )}
            </div>
             <button onClick={handleCraft} disabled={!craftResult} className="w-full mt-4 py-3 rounded-lg font-bold text-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">Chế Tạo</button>
        </div>
     </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border-2 border-yellow-700 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col animate-fadeIn" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-serif text-yellow-300">Tiệm Rèn</h2>
            <p className="text-gray-400">Mua, bán và chế tạo trang bị.</p>
          </div>
          <div className="text-lg bg-gray-800 border border-gray-600 px-3 py-1 rounded">
            <span className="text-gray-400">Linh Thạch: </span>
            <span className="font-bold text-yellow-400">{player.linhThach}</span>
          </div>
        </header>
        <nav className="flex justify-center border-b border-gray-700">
          {[
            { id: 'craft', label: 'Chế Tạo' },
            { id: 'buy', label: 'Mua' },
            { id: 'sell', label: 'Bán' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 text-lg font-semibold transition-colors ${activeTab === tab.id ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-gray-400 hover:bg-gray-700/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <main className="p-4 flex-grow overflow-hidden">
          {activeTab === 'craft' && renderCraftTab()}
          {activeTab === 'buy' && renderBuyTab()}
          {activeTab === 'sell' && renderSellTab()}
        </main>
        <footer className="p-4 border-t border-gray-700 text-right">
            <button onClick={onClose} className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded font-semibold transition-colors">
                Đóng
            </button>
        </footer>
      </div>
    </div>
  );
};

export default BlacksmithPanel;