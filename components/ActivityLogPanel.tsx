import React from 'react';

interface ActivityLogPanelProps {
    logs: string[];
    onClose: () => void;
}

const ActivityLogPanel: React.FC<ActivityLogPanelProps> = ({ logs, onClose }) => {
    
    const getLogColor = (log: string): string => {
        const lowerLog = log.toLowerCase();
        if (lowerLog.includes('nhiệm vụ')) return 'text-green-300';
        if (lowerLog.includes('nhận') || lowerLog.includes('thưởng') || lowerLog.includes('thành công')) return 'text-yellow-300';
        if (lowerLog.includes('thất bại')) return 'text-red-400';
        return 'text-gray-300';
    };
    
    return (
        <div className="absolute top-20 right-4 w-80 h-96 bg-black/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg z-40 flex flex-col animate-fadeIn">
            <header className="flex justify-between items-center p-3 border-b border-gray-600 flex-shrink-0">
                <h3 className="text-lg font-bold text-yellow-300">Nhật Ký Hoạt Động</h3>
                <button onClick={onClose} className="text-xl font-bold hover:text-red-500">&times;</button>
            </header>
            <main className="flex-grow overflow-y-auto p-3 space-y-2">
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <p key={index} className={`text-sm ${getLogColor(log)}`}>
                            {log}
                        </p>
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic mt-4">Chưa có hoạt động nào.</p>
                )}
            </main>
        </div>
    );
};

export default ActivityLogPanel;