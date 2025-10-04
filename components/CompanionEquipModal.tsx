import React from 'react';
import { Item, EquipmentSlot } from '../types.ts';
import { ITEM_RARITY_COLORS, ITEM_RARITY_TEXT_COLORS } from '../constants.ts';

interface CompanionEquipModalProps {
    playerInventory: Item[];
    slotToEquip: EquipmentSlot;
    onClose: () => void;
    onEquip: (item: Item) => void;
}

const CompanionEquipModal: React.FC<CompanionEquipModalProps> = ({ playerInventory, slotToEquip, onClose, onEquip }) => {
    const compatibleItems = playerInventory.filter(item => item.slot === slotToEquip);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-gray-900 border border-yellow-600 rounded-lg p-6 w-full max-w-lg animate-fadeIn flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-yellow-300 mb-4">Chọn trang bị cho vị trí <span className="capitalize">{slotToEquip}</span></h3>
                <div className="flex-grow space-y-2 overflow-y-auto pr-2 max-h-[60vh]">
                    {compatibleItems.length > 0 ? (
                        compatibleItems.map((item, index) => (
                            <button
                                key={`${item.id}-${index}`}
                                onClick={() => onEquip(item)}
                                className={`w-full text-left p-2 rounded-lg border-2 flex items-center gap-3 transition-colors ${ITEM_RARITY_COLORS[item.rarity]} bg-gray-900/50 hover:bg-gray-800/50`}
                            >
                                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-xl">{item.icon}</div>
                                <div>
                                    <p className={`font-semibold ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>{item.name}</p>
                                    <p className="text-xs text-gray-400">{item.type} - {item.rarity}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">Không có vật phẩm phù hợp trong túi đồ.</p>
                    )}
                </div>
                <div className="mt-4 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default CompanionEquipModal;
