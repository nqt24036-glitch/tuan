import React, { useState } from 'react';
import { Player, Item, Skill, Monster } from '../types';
import AdminPanel from './AdminPanel';

interface SettingsPanelProps {
    player: Player;
    onClose: () => void;
    isMuted: boolean;
    onToggleMute: () => void;
    onUpdatePlayerDetails: (details: { name?: string; hairStyle?: number; eyeColor?: 'Đen' | 'Trắng' }) => void;
    onRedeemGiftcode: (code: string) => void;
    apiKey: string | null;
    onSaveApiKey: (key: string) => void;
    isAdmin: boolean;
    onAdminAddItem: (item: Item) => void;
    onAdminLearnSkill: (skill: Skill) => void;
    onAdminCreateItem: (item: Item) => void;
    onAdminCreateMonster: (monster: Monster) => void;
    masterItemList: Item[];
    isBottomNavBarVisible: boolean;
    onToggleBottomNavBar: () => void;
}

const EYE_COLORS: Array<'Đen' | 'Trắng'> = ['Đen', 'Trắng'];
const HAIR_STYLES_COUNT = 20;

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    player, 
    onClose, 
    isMuted, 
    onToggleMute, 
    onUpdatePlayerDetails, 
    onRedeemGiftcode, 
    apiKey,
    onSaveApiKey,
    isAdmin, 
    onAdminAddItem, 
    onAdminLearnSkill, 
    onAdminCreateItem, 
    onAdminCreateMonster, 
    masterItemList,
    isBottomNavBarVisible,
    onToggleBottomNavBar
}) => {
    const [newName, setNewName] = useState(player.name);
    const [tempHairStyle, setTempHairStyle] = useState(player.hairStyle);
    const [tempEyeColor, setTempEyeColor] = useState(player.eyeColor);
    const [giftcode, setGiftcode] = useState('');
    const [tempApiKey, setTempApiKey] = useState(apiKey || '');
    const [showAdminPanel, setShowAdminPanel] = useState(false);

    const avatarPreviewUrl = `https://api.multiavatar.com/${newName.trim() || player.gender}-${tempHairStyle}-${tempEyeColor}.png`;

    const handleSaveChanges = () => {
        onUpdatePlayerDetails({
            name: newName,
            hairStyle: tempHairStyle,
            eyeColor: tempEyeColor,
        });
        onSaveApiKey(tempApiKey);
        onClose();
    };

    const handleRedeem = () => {
        onRedeemGiftcode(giftcode);
        setGiftcode('');
    };
    
    const nextHair = () => setTempHairStyle(prev => (prev % HAIR_STYLES_COUNT) + 1);
    const prevHair = () => setTempHairStyle(prev => (prev === 1 ? HAIR_STYLES_COUNT : prev - 1));

    return (
        <>
            {showAdminPanel && isAdmin && (
                <AdminPanel
                    onClose={() => setShowAdminPanel(false)}
                    onAddItem={onAdminAddItem}
                    onLearnSkill={onAdminLearnSkill}
                    onCreateItem={onAdminCreateItem}
                    onCreateMonster={onAdminCreateMonster}
                    masterItemList={masterItemList}
                />
            )}
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-gray-900 border-2 border-yellow-700 rounded-lg w-full max-w-2xl flex flex-col animate-fadeIn" onClick={e => e.stopPropagation()}>
                    <header className="flex justify-between items-center p-4 border-b border-gray-700">
                        <h2 className="text-2xl font-serif text-yellow-300">Cài Đặt</h2>
                        <button onClick={onClose} className="text-2xl font-bold hover:text-red-500 transition-colors">&times;</button>
                    </header>

                    <main className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
                        {/* Audio & UI Settings */}
                        <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
                            <h3 className="text-lg font-bold text-yellow-300 border-b border-gray-700 pb-2 mb-3">Hệ Thống</h3>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Âm Lượng Trò Chơi</span>
                                <button onClick={onToggleMute} className={`px-4 py-2 rounded-md font-bold transition-colors ${isMuted ? 'bg-red-600' : 'bg-green-600'}`}>
                                    {isMuted ? 'Đã Tắt' : 'Đang Bật'}
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Thanh Điều Hướng (Dưới)</span>
                                <button onClick={onToggleBottomNavBar} className={`px-4 py-2 rounded-md font-bold transition-colors ${!isBottomNavBarVisible ? 'bg-red-600' : 'bg-green-600'}`}>
                                    {!isBottomNavBarVisible ? 'Đang Ẩn' : 'Đang Hiện'}
                                </button>
                            </div>
                        </div>

                        {/* API Key */}
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                            <h3 className="text-lg font-bold text-yellow-300 border-b border-gray-700 pb-2 mb-3">Gemini API Key</h3>
                            <p className="text-xs text-gray-400 mb-2">Cần thiết cho các tính năng AI (Luyện Lịch, Nhiệm Vụ). Lấy key tại Google AI Studio.</p>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={tempApiKey}
                                    onChange={e => setTempApiKey(e.target.value)}
                                    placeholder="Chưa thiết lập API Key"
                                    className="flex-grow bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                        </div>

                        {/* Giftcode */}
                        <div className="bg-gray-800/50 p-3 rounded-lg">
                            <label className="block font-semibold text-lg mb-2">Mã Quà Tặng</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={giftcode}
                                    onChange={e => setGiftcode(e.target.value)}
                                    placeholder="Nhập mã quà tặng..."
                                    className="flex-grow bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                                <button onClick={handleRedeem} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold">Đổi</button>
                            </div>
                        </div>

                        {/* ADMIN Panel Button */}
                        {isAdmin && (
                            <div className="bg-red-900/50 p-3 rounded-lg flex justify-between items-center border border-red-700">
                                <span className="font-bold text-lg text-red-400">Bảng Điều Khiển ADMIN</span>
                                <button onClick={() => setShowAdminPanel(true)} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-semibold">
                                    Mở
                                </button>
                            </div>
                        )}

                        {/* Character Customization */}
                        <div className="bg-gray-800/50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col items-center">
                                <h3 className="text-lg font-semibold mb-2">Xem Trước</h3>
                                <div className="w-48 h-72 rounded-lg overflow-hidden border-2 border-yellow-600 mb-2">
                                    <img src={avatarPreviewUrl} alt="Avatar Preview" className="w-full h-full object-cover bg-gray-800" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-semibold text-lg mb-1">Danh Xưng</label>
                                    <input 
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Lưu ý: Đổi tên cũng sẽ thay đổi hình đại diện.</p>
                                </div>
                                <div>
                                    <label className="block font-semibold text-lg mb-1">Kiểu Tóc</label>
                                    <div className="flex items-center gap-2">
                                        <button onClick={prevHair} className="px-3 py-1 rounded border-2 border-gray-600 bg-transparent hover:bg-gray-700">{'<'}</button>
                                        <span className="w-full text-center bg-gray-900 border border-gray-600 rounded py-1">{`Kiểu ${tempHairStyle}`}</span>
                                        <button onClick={nextHair} className="px-3 py-1 rounded border-2 border-gray-600 bg-transparent hover:bg-gray-700">{'>'}</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-semibold text-lg mb-1">Màu Mắt</label>
                                    <div className="flex gap-2">
                                        {EYE_COLORS.map(c => (
                                        <button key={c} onClick={() => setTempEyeColor(c)} className={`flex-1 py-1 rounded border-2 transition-colors ${tempEyeColor === c ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-transparent border-gray-600 hover:bg-gray-700'}`}>
                                            {c}
                                        </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="p-4 border-t border-gray-700 text-right">
                        <button onClick={handleSaveChanges} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold transition-colors">
                            Lưu Tất Cả
                        </button>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;