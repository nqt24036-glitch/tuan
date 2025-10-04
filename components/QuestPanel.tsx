
import React from 'react';
// FIX: Added .ts extension to fix module resolution error.
import { Quest } from '../types.ts';

interface QuestPanelProps {
  quests: Quest[];
}

const QuestPanel: React.FC<QuestPanelProps> = ({ quests }) => {
  return (
    <div className="space-y-4">
      {quests.map(quest => (
        <div key={quest.id} className="bg-gray-900 bg-opacity-50 border border-gray-700 p-4 rounded-lg">
          <h4 className="text-lg font-bold text-yellow-300">{quest.title}</h4>
          <p className="text-sm text-gray-300 my-2">{quest.description}</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Tiến độ</span>
              <span>{quest.progress} / {quest.target}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${(quest.progress / quest.target) * 100}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-yellow-500 mt-2">
            <span className="font-semibold">Phần thưởng:</span> {quest.reward}
          </p>
        </div>
      ))}
       {quests.length === 0 && (
         <p className="text-center text-gray-500">Không có nhiệm vụ nào.</p>
       )}
    </div>
  );
};

export default QuestPanel;