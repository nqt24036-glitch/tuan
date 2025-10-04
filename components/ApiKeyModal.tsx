import React, { useState } from 'react';

interface ApiKeyModalProps {
    onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
    const [key, setKey] = useState('');

    const handleSave = () => {
        if (key.trim()) {
            onSave(key.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-900 border-2 border-yellow-700 rounded-lg p-6 w-full max-w-md animate-fadeIn space-y-4 text-center">
                <h2 className="text-2xl font-bold text-yellow-300">Thiết Lập Gemini API Key</h2>
                <p className="text-gray-400">
                    Để sử dụng các tính năng AI (như Luyện Lịch, Nhiệm Vụ), bạn cần cung cấp Gemini API Key của riêng mình.
                </p>
                <p className="text-xs text-gray-500">
                    Bạn có thể lấy key tại Google AI Studio. Ứng dụng sẽ lưu key này vào bộ nhớ cục bộ của trình duyệt.
                </p>
                <input
                    type="password"
                    value={key}
                    onChange={e => setKey(e.target.value)}
                    placeholder="Dán API Key của bạn vào đây..."
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                    onClick={handleSave}
                    disabled={!key.trim()}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 rounded font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Lưu và Tiếp Tục
                </button>
            </div>
        </div>
    );
};

export default ApiKeyModal;
