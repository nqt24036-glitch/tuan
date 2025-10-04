import React, { useState, useMemo, useEffect } from 'react';
import { Item, Skill, ItemRarity, ItemType, EquipmentSlot, CombatStats, Monster } from '../types.ts';
import { SKILLS } from '../data/gameData.ts';
import { ITEM_RARITY_COLORS, ITEM_RARITY_TEXT_COLORS, COMBAT_STAT_LABELS } from '../constants.ts';
import { SparklesIcon } from './IconComponents.tsx';

interface AdminPanelProps {
    onClose: () => void;
    onAddItem: (item: Item) => void;
    onLearnSkill: (skill: Skill) => void;
    onCreateItem: (item: Item) => void;
    onCreateMonster: (monster: Monster) => void;
    masterItemList: Item[];
}

const STAT_DISPLAY_CONFIG = {
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
  hp: { label: 'HP Tối Đa', format: (v: number) => `+${v}` },
  mp: { label: 'MP Tối Đa', format: (v: number) => `+${v}` },
  cultivationSpeedBonus: { label: 'Tốc Độ Tu Luyện', format: (v: number) => `+${(v * 100).toFixed(0)}%` },
};
const ALL_STATS_KEYS = [...Object.keys(COMBAT_STAT_LABELS), 'hp', 'mp'];

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onAddItem, onLearnSkill, onCreateItem, onCreateMonster, masterItemList }) => {
    const [activeTab, setActiveTab] = useState('equipment');
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    const getInitialNewItem = (): Item => ({
        id: `custom_${Date.now()}`,
        name: '',
        description: '',
        story: '',
        rarity: 'Phổ thông',
        type: 'Vũ khí',
        icon: '❓',
        slot: 'vũ khí',
        stats: {},
        value: 0
    });
    const [newItem, setNewItem] = useState<Item>(getInitialNewItem());
    const [tempStats, setTempStats] = useState<{ key: keyof (CombatStats & {hp: number, mp: number}); value: number }[]>([]);

    const getInitialNewMonster = (): Monster => ({
        id: `custom_monster_${Date.now()}`,
        name: '',
        hp: 100,
        stats: {
            attack: 10, defense: 10, speed: 10, magicAttack: 0, magicDefense: 0,
            critRate: 0.05, critDamage: 1.5, accuracy: 0.9, evasion: 0.05,
            armorPen: 0, blockRate: 0, mentalDemonResistance: 0,
        },
        skills: [],
        rewards: { characterExp: 20, cultivationExp: 15, linhThach: 10, items: [] }
    });
    const [newMonster, setNewMonster] = useState<Monster>(getInitialNewMonster());

    const equippableItems = useMemo(() => 
        masterItemList.filter(item => ['Vũ khí', 'Áo giáp', 'Pháp bảo'].includes(item.type)), 
    [masterItemList]);
    
    useEffect(() => {
        const statsObject = tempStats.reduce((acc, stat) => {
            acc[stat.key] = stat.value;
            return acc;
        }, {} as Record<string, number>);
        setNewItem(prev => ({...prev, stats: statsObject}));
    }, [tempStats]);

    const handleCreateItem = () => {
        if (!newItem.name.trim()) {
            alert("Tên vật phẩm không được để trống.");
            return;
        }
        onCreateItem(newItem);
        setNewItem(getInitialNewItem());
        setTempStats([]);
    };
    
    const handleNewItemChange = (field: keyof Item, value: any) => {
        const updatedItem = { ...newItem, [field]: value };
        if (field === 'type') {
            if (value === 'Vũ khí') updatedItem.slot = 'vũ khí';
            else if (value === 'Áo giáp') updatedItem.slot = 'áo giáp';
            else if (value === 'Pháp bảo') updatedItem.slot = 'pháp bảo';
            else delete updatedItem.slot;
        }
        setNewItem(updatedItem);
    }
    
    const handleStatChange = (index: number, field: 'key' | 'value', value: any) => {
        const newStats = [...tempStats];
        newStats[index] = { ...newStats[index], [field]: value };
        setTempStats(newStats);
    }

    const addStat = () => setTempStats([...tempStats, { key: 'attack', value: 0}]);
    const removeStat = (index: number) => setTempStats(tempStats.filter((_, i) => i !== index));

    const handleNewMonsterChange = (field: keyof Monster | `stats.${keyof CombatStats}` | `rewards.${keyof Omit<Monster['rewards'], 'items'>}`, value: any) => {
        setNewMonster(prev => {
            const updatedMonster = JSON.parse(JSON.stringify(prev)); // Deep copy
            if (field.startsWith('stats.')) {
                const statKey = field.split('.')[1] as keyof CombatStats;
                updatedMonster.stats[statKey] = parseFloat(value) || 0;
            } else if (field.startsWith('rewards.')) {
                const rewardKey = field.split('.')[1] as keyof Omit<Monster['rewards'], 'items'>;
                updatedMonster.rewards[rewardKey] = parseInt(value, 10) || 0;
            } else if (field === 'hp') {
                updatedMonster.hp = parseInt(value, 10) || 0;
            } else if (field === 'name') {
                updatedMonster.name = value;
            }
            return updatedMonster;
        });
    };
    
    const handleMonsterSkillToggle = (skill: Skill) => {
        setNewMonster(prev => {
            const hasSkill = prev.skills?.some(s => s.id === skill.id);
            if (hasSkill) {
                return { ...prev, skills: prev.skills?.filter(s => s.id !== skill.id) };
            } else {
                return { ...prev, skills: [...(prev.skills || []), skill] };
            }
        });
    };
    
    const handleAddItemReward = () => {
        if (masterItemList.length > 0) {
            setNewMonster(prev => ({ ...prev, rewards: { ...prev.rewards, items: [...prev.rewards.items, { itemId: masterItemList[0].id, chance: 0.1 }] } }));
        }
    };
    
    const handleItemRewardChange = (index: number, field: 'itemId' | 'chance', value: any) => {
        setNewMonster(prev => {
            const newItems = [...prev.rewards.items];
            newItems[index] = { ...newItems[index], [field]: field === 'chance' ? parseFloat(value) || 0 : value };
            return { ...prev, rewards: { ...prev.rewards, items: newItems } };
        });
    };
    
    const handleRemoveItemReward = (index: number) => {
        setNewMonster(prev => ({ ...prev, rewards: { ...prev.rewards, items: prev.rewards.items.filter((_, i) => i !== index) }}));
    };
    
    const handleCreateMonster = () => {
        if (!newMonster.name.trim()) {
            alert("Tên quái vật không được để trống.");
            return;
        }
        onCreateMonster(newMonster);
        setNewMonster(getInitialNewMonster());
    };

    const renderPassiveBonuses = (skill: Skill) => {
        if (!skill?.passiveBonus) return null;
        const bonuses = Object.entries(skill.passiveBonus).filter(([key, value]) => value !== undefined && STAT_DISPLAY_CONFIG.hasOwnProperty(key));
        if (bonuses.length === 0) return null;
        return (
        <div className="pt-3 mt-3 border-t border-gray-700">
            <h5 className="font-semibold text-green-300 mb-2">Hiệu Ứng Thụ Động</h5>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {bonuses.map(([key, value]) => {
                const config = STAT_DISPLAY_CONFIG[key as keyof typeof STAT_DISPLAY_CONFIG];
                return (<div key={key} className="flex justify-between text-sm"><span className="text-gray-400">{config.label}:</span><span className="font-medium text-white">{config.format(value as number)}</span></div>);
            })}
            </div>
        </div>
        );
    };

    const renderEquipmentTab = () => (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="flex flex-col h-full md:w-1/2 min-h-0">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2 flex-shrink-0">Danh Sách Trang Bị</h3>
                <div className="flex-grow space-y-2 overflow-y-auto pr-2 border-r-0 md:border-r border-gray-700">
                    {equippableItems.map(item => (<button key={item.id} onClick={() => setSelectedItem(item)} className={`w-full text-left p-2 rounded-lg border-2 flex items-center gap-3 transition-colors ${ITEM_RARITY_COLORS[item.rarity]} ${selectedItem?.id === item.id ? 'bg-gray-700/80 ring-2 ring-yellow-400' : 'bg-gray-900/50 hover:bg-gray-800/50'}`}><div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div><div className="flex-grow"><p className={`font-semibold ${ITEM_RARITY_TEXT_COLORS[item.rarity]}`}>{item.name}</p><p className="text-xs text-gray-400">{item.type} - {item.rarity}</p></div></button>))}
                </div>
            </div>
            <div className="flex flex-col h-full md:w-1/2">
                {selectedItem ? (<div className={`p-4 rounded-lg border-2 bg-gray-900/70 flex flex-col h-full ${ITEM_RARITY_COLORS[selectedItem.rarity]}`}><div className="pb-3 border-b border-gray-700 flex-shrink-0"><h4 className={`text-xl font-bold ${ITEM_RARITY_TEXT_COLORS[selectedItem.rarity]}`}>{selectedItem.name}</h4><p className="text-sm text-gray-400">{selectedItem.type} | {selectedItem.rarity}</p></div><div className="flex-grow overflow-y-auto py-3 space-y-4 pr-2"><p className="text-gray-300">{selectedItem.description}</p>{selectedItem.stats && (<div className="pt-2"><h5 className="font-semibold text-green-300 mb-1">Thuộc tính</h5><div className="space-y-1">{Object.entries(selectedItem.stats).map(([key, value]) => (<p key={key} className="text-sm text-gray-300 capitalize flex justify-between"><span>{key}:</span><span className="font-mono text-green-400">+{value}</span></p>))}</div></div>)}</div><div className="pt-3 mt-auto border-t border-gray-700 flex-shrink-0"><button onClick={() => onAddItem(selectedItem)} className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500 font-semibold">Thêm vào Túi đồ</button></div></div>) : (<div className="flex items-center justify-center h-full p-4 rounded-lg border-2 border-dashed border-gray-700"><p className="text-gray-500">Chọn một trang bị để xem chi tiết.</p></div>)}
            </div>
        </div>
    );
    
    const renderSkillsTab = () => (
        <div className="flex flex-col md:flex-row gap-6 h-full">
             <div className="flex flex-col h-full md:w-1/2 min-h-0">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2 flex-shrink-0">Danh Sách Kỹ Năng</h3>
                <div className="flex-grow space-y-2 overflow-y-auto pr-2 border-r-0 md:border-r border-gray-700">
                    {SKILLS.map(skill => (<button key={skill.id} onClick={() => setSelectedSkill(skill)} className={`w-full text-left p-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedSkill?.id === skill.id ? 'bg-yellow-800/50 border-yellow-600' : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/50'}`}><div className={`p-2 rounded flex-shrink-0 ${skill.type === 'Chủ Động' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}><SparklesIcon /></div><div><p className="font-semibold">{skill.name}</p><p className={`text-xs ${skill.type === 'Chủ Động' ? 'text-red-400' : 'text-green-400'}`}>{skill.type}</p></div></button>))}
                </div>
             </div>
             <div className="flex flex-col h-full md:w-1/2">
                 {selectedSkill ? (<div className="p-4 rounded-lg border-2 border-purple-700 bg-gray-900/70 flex flex-col h-full"><div className="pb-3 border-b border-gray-700 flex-shrink-0"><h4 className="text-xl font-bold text-purple-300">{selectedSkill.name}</h4><p className="text-sm text-gray-500 italic">Nguồn gốc: {selectedSkill.origin}</p></div><div className="flex-grow overflow-y-auto py-3 space-y-4 pr-2"><p className="text-gray-300">{selectedSkill.description}</p>{selectedSkill.type === 'Chủ Động' && (<div className="pt-3 mt-3 border-t border-gray-700"><h5 className="font-semibold text-red-300 mb-2">Hiệu Ứng Chủ Động</h5><div className="flex flex-wrap gap-x-6">{selectedSkill.damage !== undefined && <p>Sát thương: <span className="font-bold text-white">{selectedSkill.damage}</span></p>}{selectedSkill.heal !== undefined && <p>Hồi phục: <span className="font-bold text-white">{selectedSkill.heal}</span></p>}{selectedSkill.mpCost !== undefined && <p>Tiêu hao MP: <span className="font-bold text-white">{selectedSkill.mpCost}</span></p>}</div></div>)}{renderPassiveBonuses(selectedSkill)}</div><div className="pt-3 mt-auto border-t border-gray-700 flex-shrink-0"><button onClick={() => onLearnSkill(selectedSkill)} className="w-full bg-purple-600 p-2 rounded hover:bg-purple-500 font-semibold">Học Kỹ Năng</button></div></div>) : (<div className="flex items-center justify-center h-full p-4 rounded-lg border-2 border-dashed border-gray-700"><p className="text-gray-500">Chọn một kỹ năng để xem chi tiết.</p></div>)}
            </div>
        </div>
    );
    
    const renderCreateItemTab = () => (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="md:w-1/2 flex flex-col gap-3 overflow-y-auto pr-2">
                <label className="block"><span className="text-gray-400">Tên Vật Phẩm</span><input type="text" value={newItem.name} onChange={e => handleNewItemChange('name', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1" /></label>
                <label className="block"><span className="text-gray-400">Icon (Emoji)</span><input type="text" value={newItem.icon} onChange={e => handleNewItemChange('icon', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1" /></label>
                <label className="block"><span className="text-gray-400">Mô Tả</span><textarea value={newItem.description} onChange={e => handleNewItemChange('description', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1 h-20"></textarea></label>
                <label className="block"><span className="text-gray-400">Câu chuyện</span><textarea value={newItem.story} onChange={e => handleNewItemChange('story', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1 h-20"></textarea></label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="block"><span className="text-gray-400">Độ Hiếm</span><select value={newItem.rarity} onChange={e => handleNewItemChange('rarity', e.target.value as ItemRarity)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"><option>Phổ thông</option><option>Quý</option><option>Hiếm</option><option>Truyền Kỳ</option><option>Thần Thoại</option></select></label>
                    <label className="block"><span className="text-gray-400">Loại</span><select value={newItem.type} onChange={e => handleNewItemChange('type', e.target.value as ItemType)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"><option>Vũ khí</option><option>Áo giáp</option><option>Pháp bảo</option><option>Tiêu hao</option><option>Nguyên liệu</option><option>Sách Kỹ Năng</option></select></label>
                    {newItem.slot && <label className="block"><span className="text-gray-400">Vị Trí</span><select value={newItem.slot} onChange={e => handleNewItemChange('slot', e.target.value as EquipmentSlot)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1"><option value="vũ khí">Vũ khí</option><option value="áo giáp">Áo giáp</option><option value="pháp bảo">Pháp bảo</option></select></label>}
                    <label className="block"><span className="text-gray-400">Giá Trị Bán</span><input type="number" value={newItem.value} onChange={e => handleNewItemChange('value', parseInt(e.target.value) || 0)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1" /></label>
                </div>
            </div>
            <div className="md:w-1/2 flex flex-col">
                 <h3 className="text-lg font-semibold text-green-300 mb-2 flex-shrink-0">Chỉ Số Vật Phẩm</h3>
                 <div className="flex-grow space-y-2 overflow-y-auto pr-2 bg-gray-800/30 p-2 rounded">
                    {tempStats.map((stat, index) => (<div key={index} className="flex items-center gap-2"><select value={stat.key} onChange={e => handleStatChange(index, 'key', e.target.value)} className="flex-grow bg-gray-800 border border-gray-600 rounded px-2 py-1">{ALL_STATS_KEYS.map(key => <option key={key} value={key}>{STAT_DISPLAY_CONFIG[key as keyof typeof STAT_DISPLAY_CONFIG]?.label || key}</option>)}</select><input type="number" value={stat.value} onChange={e => handleStatChange(index, 'value', parseInt(e.target.value) || 0)} className="w-24 bg-gray-800 border border-gray-600 rounded px-2 py-1" /><button onClick={() => removeStat(index)} className="w-8 h-8 bg-red-600 rounded text-white font-bold">&times;</button></div>))}
                 </div>
                 <button onClick={addStat} className="w-full mt-2 py-2 bg-cyan-700 hover:bg-cyan-600 rounded">Thêm Chỉ Số</button>
                 <button onClick={handleCreateItem} className="w-full mt-4 py-3 text-lg font-bold bg-green-600 hover:bg-green-500 rounded">Tạo và Thêm Vật Phẩm</button>
            </div>
        </div>
    );

    const renderCreateMonsterTab = () => (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="md:w-1/2 flex flex-col gap-3 overflow-y-auto pr-2">
                <h3 className="text-lg font-semibold text-yellow-300">Thông Tin Cơ Bản</h3>
                <label className="block"><span className="text-gray-400">Tên Quái Vật</span><input type="text" value={newMonster.name} onChange={e => handleNewMonsterChange('name', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1" /></label>
                <label className="block"><span className="text-gray-400">HP Tối Đa</span><input type="number" value={newMonster.hp} onChange={e => handleNewMonsterChange('hp', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1" /></label>
                
                <h3 className="text-lg font-semibold text-yellow-300 mt-2">Thuộc Tính Chiến Đấu</h3>
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(newMonster.stats).map(statKey => (
                        <label key={statKey} className="block text-sm">
                            <span className="text-gray-400 capitalize">{COMBAT_STAT_LABELS[statKey as keyof CombatStats] || statKey}</span>
                            <input type="number" value={newMonster.stats[statKey as keyof CombatStats]} onChange={e => handleNewMonsterChange(`stats.${statKey as keyof CombatStats}`, e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1" step={statKey.includes('Rate') || statKey.includes('Pen') ? "0.01" : "1"} />
                        </label>
                    ))}
                </div>
                 <h3 className="text-lg font-semibold text-yellow-300 mt-2">Kỹ Năng</h3>
                <div className="max-h-40 overflow-y-auto space-y-1 bg-gray-800/50 p-2 rounded">
                    {SKILLS.map(skill => (
                        <label key={skill.id} className="flex items-center gap-2 p-1 rounded hover:bg-gray-700">
                            <input type="checkbox" checked={newMonster.skills?.some(s => s.id === skill.id) || false} onChange={() => handleMonsterSkillToggle(skill)} className="form-checkbox h-4 w-4 bg-gray-900 border-gray-600 text-cyan-500 focus:ring-cyan-500" />
                            <span>{skill.name}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <div className="md:w-1/2 flex flex-col">
                 <h3 className="text-lg font-semibold text-green-300 mb-2 flex-shrink-0">Phần Thưởng Khi Bị Đánh Bại</h3>
                 <div className="flex-grow space-y-2 overflow-y-auto pr-2 bg-gray-800/30 p-2 rounded">
                    <label className="block"><span className="text-gray-400">EXP Nhân Vật</span><input type="number" value={newMonster.rewards.characterExp} onChange={e => handleNewMonsterChange('rewards.characterExp', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1" /></label>
                    <label className="block"><span className="text-gray-400">Linh Lực (Tu Vi)</span><input type="number" value={newMonster.rewards.cultivationExp} onChange={e => handleNewMonsterChange('rewards.cultivationExp', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1" /></label>
                    <label className="block"><span className="text-gray-400">Linh Thạch</span><input type="number" value={newMonster.rewards.linhThach} onChange={e => handleNewMonsterChange('rewards.linhThach', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 mt-1" /></label>
                    
                     <h4 className="text-md font-semibold text-green-300 pt-2 border-t border-gray-700 mt-2">Vật Phẩm Rơi</h4>
                     {newMonster.rewards.items.map((reward, index) => (
                        <div key={index} className="flex items-center gap-2 p-1 bg-gray-900/50 rounded">
                             <select value={reward.itemId} onChange={e => handleItemRewardChange(index, 'itemId', e.target.value)} className="flex-grow bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs">
                                {masterItemList.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                             </select>
                             <input type="number" value={reward.chance} onChange={e => handleItemRewardChange(index, 'chance', e.target.value)} className="w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs" step="0.01" min="0" max="1" placeholder="Tỉ lệ" />
                             <button onClick={() => handleRemoveItemReward(index)} className="w-7 h-7 bg-red-600 rounded text-white font-bold text-xs">&times;</button>
                        </div>
                     ))}
                     <button onClick={handleAddItemReward} className="w-full mt-2 py-1 text-sm bg-cyan-700 hover:bg-cyan-600 rounded">Thêm Vật Phẩm Rơi</button>
                 </div>
                 <button onClick={handleCreateMonster} className="w-full mt-4 py-3 text-lg font-bold bg-green-600 hover:bg-green-500 rounded">Tạo Quái Vật</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-900 border-2 border-red-700 rounded-lg w-full max-w-5xl h-[90vh] flex flex-col animate-fadeIn" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-serif text-red-400">Bảng Điều Khiển ADMIN</h2>
                    <button onClick={onClose} className="text-2xl font-bold hover:text-white transition-colors">&times;</button>
                </header>
                <nav className="flex justify-center border-b border-gray-700 flex-wrap">
                    {['equipment', 'skills', 'createItem', 'createMonster'].map(tabId => (
                        <button 
                            key={tabId}
                            onClick={() => setActiveTab(tabId)} 
                            className={`px-6 py-2 text-lg font-semibold transition-colors ${activeTab === tabId ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-gray-400 hover:bg-gray-700/50'}`}
                        >
                            {
                                tabId === 'equipment' ? 'Trang Bị' : 
                                tabId === 'skills' ? 'Kỹ Năng' : 
                                tabId === 'createItem' ? 'Tạo Vật Phẩm' : 
                                'Tạo Quái Vật'
                            }
                        </button>
                    ))}
                </nav>
                <main className="p-4 flex-grow overflow-hidden min-h-0">
                    {activeTab === 'equipment' && renderEquipmentTab()}
                    {activeTab === 'skills' && renderSkillsTab()}
                    {activeTab === 'createItem' && renderCreateItemTab()}
                    {activeTab === 'createMonster' && renderCreateMonsterTab()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;