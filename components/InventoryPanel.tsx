import React, { useState, useMemo } from 'react';
import { Player, Item, ItemType, EquipmentSlot } from '../types.ts';
import { ITEM_RARITY_COLORS, ITEM_RARITY_TEXT_COLORS } from '../constants.ts';

interface InventoryPanelProps {
  player: Player;
  onItemUse: (item: Item) => void;
  onEquip: (item: Item) => void;
}

type FilterType = 'Tất cả' | ItemType | 'Trang bị';

interface StackedItem {
  item: Item;
  count: number;
}

const RARITY_ORDER: Record<Item['rarity'], number> = {
  'Phổ thông': 0,
  'Quý': 1,
  'Hiếm': 2,
  'Truyền Kỳ': 3,
  'Thần Thoại': 4,
};

const InventoryPanel: React.FC<InventoryPanelProps> = ({ player, onItemUse, onEquip }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [filter, setFilter] = useState<FilterType>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const stackedInventory = useMemo((): StackedItem[] => {
    const itemMap = new Map<string, StackedItem>();
    player.inventory.forEach(item => {
      if (itemMap.has(item.id)) {
        itemMap.get(item.id)!.count++;
      } else {
        itemMap.set(item.id, { item: { ...item }, count: 1 });
      }
    });
    return Array.from(itemMap.values());
  }, [player.inventory]);

  const processedInventory = useMemo(() => {
    let items = [...stackedInventory];

    // 1. Filter by category
    items = items.filter(stackedItem => {
      const { item } = stackedItem;
      if (filter === 'Tất cả') return true;
      if (filter === 'Trang bị') return ['Vũ khí', 'Áo giáp', 'Pháp bảo'].includes(item.type);
      return item.type === filter;
    });

    // 2. Filter by search query
    if (searchQuery.trim()) {
        items = items.filter(({ item }) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 3. Sort
    items.sort((a, b) => {
        switch (sortOrder) {
            case 'name_asc':
                return a.item.name.localeCompare(b.item.name);
            case 'name_desc':
                return b.item.name.localeCompare(a.item.name);
            case 'rarity_desc':
                return RARITY_ORDER[b.item.rarity] - RARITY_ORDER[a.item.rarity];
            case 'rarity_asc':
                return RARITY_ORDER[a.item.rarity] - RARITY_ORDER[b.item.rarity];
            case 'type':
                return a.item.type.localeCompare(b.item.type);
            default:
                return 0; // Default order (as received)
        }
    });

    return items;
  }, [stackedInventory, filter, searchQuery, sortOrder]);
  
  const selectedItemStack = useMemo(() => {
      if (!selectedItem) return null;
      return stackedInventory.find(si => si.item.id === selectedItem.id);
  }, [selectedItem, stackedInventory]);

  const canEquip = (item: Item): boolean => {
    if (!item.requirement) return true; // No requirement
    // Simple level check for now, can be expanded
    const reqLevelMatch = item.requirement.match(/Cấp (\d+)/);
    if (reqLevelMatch) {
      return player.level >= parseInt(reqLevelMatch[1], 10);
    }
    return player.sect === item.requirement;
  };
  
  // Auto-select first item if the list changes and the current selection disappears
  React.useEffect(() => {
    if (selectedItem && !processedInventory.some(si => si.item.id === selectedItem.id)) {
      setSelectedItem(processedInventory.length > 0 ? processedInventory[0].item : null);
    } else if (!selectedItem && processedInventory.length > 0) {
        setSelectedItem(processedInventory[0].item);
    }
  }, [processedInventory, selectedItem]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Left Column: Item List */}
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-serif text-yellow-300 mb-4 flex-shrink-0">Túi Đồ</h3>
        <div className="flex flex-wrap gap-2 mb-2 flex-shrink-0">
          {(['Tất cả', 'Trang bị', 'Tiêu hao', 'Sách Kỹ Năng', 'Nguyên liệu'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === f ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-4 flex-shrink-0">
            <input 
                type="text"
                placeholder="Tìm kiếm vật phẩm..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="w-full sm:w-auto bg-gray-900 border border-gray-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
                <option value="default">Sắp xếp mặc định</option>
                <option value="name_asc">Tên (A-Z)</option>
                <option value="name_desc">Tên (Z-A)</option>
                <option value="rarity_desc">Độ hiếm (Cao-Thấp)</option>
                <option value="rarity_asc">Độ hiếm (Thấp-Cao)</option>
                <option value="type">Loại</option>
            </select>
        </div>
        <div className="flex-grow space-y-2 overflow-y-auto pr-2 border-r border-gray-700">
          {processedInventory.length > 0 ? (
            processedInventory.map(({ item, count }) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`w-full text-left p-2 rounded-lg border-2 flex items-center gap-3 transition-colors ${ITEM_RARITY_COLORS[item.rarity]} ${selectedItem?.id === item.id ? 'bg-gray-700/80 ring-2 ring-yellow-400' : 'bg-gray-900/50 hover:bg-gray-800/50'}`}
              >
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
                <div className="flex-grow">
                  <p className={`font-semibold ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>
                    {item.name}
                    {count > 1 && <span className="text-yellow-400 font-normal ml-2">x{count}</span>}
                  </p>
                  <p className="text-xs text-gray-400">{item.type} - {item.rarity}</p>
                </div>
              </button>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-8">Không tìm thấy vật phẩm nào.</p>
          )}
        </div>
      </div>

      {/* Right Column: Item Details */}
      <div className="md:col-span-1 flex flex-col h-full">
        {selectedItem ? (
          <div className={`p-4 rounded-lg border-2 bg-gray-900/70 flex flex-col h-full ${ITEM_RARITY_COLORS[selectedItem.rarity]}`}>
            {/* Header */}
            <div className="pb-3 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">{selectedItem.icon}</div>
                  <div className="flex-grow">
                      <h4 className={`text-2xl font-bold ${ITEM_RARITY_TEXT_COLORS[selectedItem.rarity]}`}>{selectedItem.name}</h4>
                      <p className="text-sm text-gray-400">Loại: {selectedItem.type} | Phẩm chất: {selectedItem.rarity}</p>
                      {selectedItem.requirement && <p className={`text-sm ${canEquip(selectedItem) ? 'text-gray-400' : 'text-red-400'}`}>Yêu cầu: {selectedItem.requirement}</p>}
                  </div>
              </div>
               {selectedItemStack && selectedItemStack.count > 0 && (
                  <div className="text-right mt-2">
                    <span className="text-lg font-bold text-yellow-400 bg-gray-800 px-3 py-1 rounded">Số lượng: {selectedItemStack.count}</span>
                  </div>
                )}
            </div>

            {/* Scrollable content area */}
            <div className="flex-grow overflow-y-auto py-3 space-y-4 pr-2">
                <p className="text-gray-300">{selectedItem.description}</p>
                
                {selectedItem.story && (
                  <div className="pt-2">
                    <p className="text-sm text-yellow-300 italic">"{selectedItem.story}"</p>
                  </div>
                )}

                {selectedItem.stats && (
                  <div className="pt-2">
                    <h5 className="font-semibold text-green-300 mb-1">Thuộc tính</h5>
                    <div className="space-y-1">
                        {Object.entries(selectedItem.stats).map(([key, value]) => (
                            <p key={key} className="text-sm text-gray-300 capitalize flex justify-between">
                                <span>{key}:</span>
                                <span className="font-mono text-green-400">+{value}</span>
                            </p>
                        ))}
                    </div>
                  </div>
                )}
                
                {selectedItem.effect && (
                     <div className="pt-2">
                        <h5 className="font-semibold text-cyan-300 mb-1">Hiệu ứng</h5>
                        <p className="text-sm text-gray-300">{selectedItem.effect}</p>
                    </div>
                )}
            </div>

            {/* Action buttons */}
            <div className="pt-3 mt-auto border-t border-gray-700 flex flex-col gap-2 flex-shrink-0">
                {selectedItem.slot && (
                  <button 
                    onClick={() => onEquip(selectedItem)}
                    disabled={!canEquip(selectedItem)}
                    className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold"
                  >
                    {canEquip(selectedItem) ? 'Trang Bị' : `Yêu cầu: ${selectedItem.requirement}`}
                  </button>
                )}
                {selectedItem.type === 'Tiêu hao' && <button onClick={() => onItemUse(selectedItem)} className="w-full bg-green-600 p-2 rounded hover:bg-green-500 font-semibold">Sử Dụng</button>}
                {selectedItem.type === 'Sách Kỹ Năng' && <button onClick={() => onItemUse(selectedItem)} className="w-full bg-purple-600 p-2 rounded hover:bg-purple-500 font-semibold">Học</button>}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-4 rounded-lg border-2 border-dashed border-gray-700">
            <p className="text-gray-500">Chọn một vật phẩm để xem chi tiết.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPanel;