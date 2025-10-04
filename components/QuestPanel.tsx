


import React from 'react';
// FIX: Removed .ts extension to prevent MIME type errors on static hosts.
import { Quest } from '../types';

interface QuestPanelProps {
  quests: Quest[];
}

const QuestPanel: React.FC<QuestPanelProps> = ({ quests }) => {
  // FIX: Completed the component to render the quest list, fixing the return type and export errors.
  return (
    <div className="h-full w-full overflow-y-auto pr-2">
      <h3 className="text-3xl font-serif text-yellow-300 text-center mb-6">Nhiệm Vụ</h3>
      {quests.length > 0 ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {quests.map(quest => {
            const progressPercent = quest.target > 0 ? (quest.progress / quest.target) * 100 : 0;
            return (
              <div key={quest.id} className="bg-gray-900/50 border-2 border-yellow-700/50 rounded-lg p-4 animate-fadeIn">
                <h4 className="text-xl font-bold text-yellow-300">{quest.title}</h4>
                <p className="text-sm text-gray-400 my-2">{quest.description}</p>
                <div className="mt-4">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-semibold text-gray-300">Tiến độ:</span>
                    <span className="font-mono text-white">{quest.progress} / {quest.target}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-4 border border-gray-700">
                    <div
                      className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full transition-all duration-500 flex items-center justify-center text-xs font-bold"
                      style={{ width: `${progressPercent}%` }}
                    >
                      {progressPercent.toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <p className="text-sm font-semibold text-gray-300">
                    Phần thưởng: <span className="text-green-400 font-normal">{quest.reward}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-16">
          <p className="text-lg">Hiện tại không có nhiệm vụ nào.</p>
          <p className="mt-2">Hãy đi thám hiểm hoặc nói chuyện với các nhân vật để nhận nhiệm vụ mới!</p>
        </div>
      )}
    </div>
  );
};

export default QuestPanel;
