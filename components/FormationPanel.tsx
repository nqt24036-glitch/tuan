import React from 'react';
// FIX: Removed .ts extension to prevent MIME type errors on static hosts.
import { Player, TranPhap } from '../types';
// FIX: Removed .ts extension to prevent MIME type errors on static hosts.
import { TRAN_PHAP_LIST } from '../data/gameData';

interface FormationPanelProps {
  player: Player;
  onActivate: (tranPhap: TranPhap) => void;
}

const FormationPanel: React.FC<FormationPanelProps> = ({ player, onActivate }) => {
  const knownFormations = TRAN_PHAP_LIST.filter(tf => player.knownTranPhapIds.includes(tf.id));

  return (
    <div>
      <p className="text-center text-gray-400 mb-6">Kích hoạt trận pháp để nhận các loại hiệu ứng có lợi.</p>
      
      {player.activeTranPhap && (
        <div className="mb-6 p-4 bg-cyan-900/50 border border-cyan-700 rounded-lg text-center">
            <h4 className="text-lg font-bold text-cyan-300">Trận Pháp Hiện Tại</h4>
            <p className="text-xl font-semibold text-white">{player.activeTranPhap.name}</p>
            <p className="text-sm text-gray-300">{player.activeTranPhap.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {knownFormations.map(tf => (
          <div
            key={tf.id}
            className={`p-4 rounded-lg border-2 flex flex-col text-center transition-all ${player.activeTranPhap?.id === tf.id ? 'bg-yellow-800/70 border-yellow-500' : 'bg-gray-900/50 border-gray-700'}`}
          >
            <h5 className="text-lg font-bold text-yellow-300">{tf.name}</h5>
            <p className="text-sm text-gray-400 flex-grow my-2">{tf.description}</p>
            <div className="text-left text-xs my-2">
                {tf.cultivationBonus > 0 && <p className="text-cyan-400">+{tf.cultivationBonus * 100}% Tốc độ tu luyện</p>}
                {tf.combatBonus?.attack > 0 && <p className="text-red-400">+ Tấn công trong chiến đấu</p>}
            </div>

            <button
                onClick={() => onActivate(tf)}
                disabled={player.activeTranPhap?.id === tf.id}
                className="mt-auto px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 border border-blue-400"
            >
                {player.activeTranPhap?.id === tf.id ? 'Đã Kích Hoạt' : 'Kích Hoạt'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormationPanel;