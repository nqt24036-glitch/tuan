import React from 'react';
import { Player } from '../types.ts';
import { CULTIVATION_METHODS_LIST } from '../data/gameData.ts';
import { COMBAT_STAT_LABELS } from '../constants.ts';

interface CultivationPanelProps {
  player: Player;
  onCultivate: () => void;
  isCultivating: boolean;
  cultivationBonus: number;
  onMeditate: () => void;
  isMeditating: boolean;
  onActivateCultivationMethod: (methodId: string) => void;
}

const STAT_BONUS_FORMAT: Record<string, (v: number) => string> = {
  cultivationSpeedBonus: (v: number) => `Tốc độ tu luyện +${(v * 100).toFixed(0)}%`,
  hp: (v: number) => `HP Tối đa +${v}`,
  mp: (v: number) => `MP Tối đa +${v}`,
};


const CultivationPanel: React.FC<CultivationPanelProps> = ({ player, onCultivate, isCultivating, cultivationBonus, onMeditate, isMeditating, onActivateCultivationMethod }) => {
  const { realm, stage, lp, lpToNext } = player.cultivation;
  const lpPercent = lpToNext > 0 ? (lp / lpToNext) * 100 : 0;
  const isFullHealth = player.hp === player.maxHp && player.mp === player.maxMp;

  const knownMethods = CULTIVATION_METHODS_LIST.filter(method => 
    player.knownCultivationMethodIds.includes(method.id)
  );

  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
      <h3 className="text-3xl font-serif text-yellow-300">Tu Luyện</h3>
      <p className="text-gray-400 mt-2">Hấp thụ linh lực trời đất, đột phá cảnh giới.</p>
      
      {/* Main Progress Block */}
      <div className="my-6 p-6 bg-gray-900/50 border-2 border-yellow-700 rounded-xl w-full space-y-6">
        <div>
          <p className="text-lg text-gray-300">Cảnh giới hiện tại</p>
          <p className="text-4xl font-bold text-white my-1">{realm} <span className="text-yellow-400">Tầng {stage}</span></p>
        </div>

        {/* Realm Progression Visualizer */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Tiến Độ Đại Cảnh Giới</p>
          <div className="flex justify-center items-center gap-2" title={`Đột phá cảnh giới tiếp theo sau Tầng 10`}>
            {Array.from({ length: 10 }).map((_, i) => {
              const currentStage = i + 1;
              let stageClass = 'bg-gray-700 border-gray-600';
              if (currentStage < stage) {
                stageClass = 'bg-yellow-500 border-yellow-400';
              } else if (currentStage === stage) {
                stageClass = 'bg-yellow-400 border-white animate-pulse';
              }
              return (
                <div key={i} className={`w-5 h-5 rounded-full border-2 transition-colors ${stageClass}`} />
              );
            })}
          </div>
        </div>
        
        {/* LP Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Tiến Độ Tầng Hiện Tại (Linh Lực)</span>
            <span>{lp} / {lpToNext}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-5 border border-gray-700 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full transition-all duration-500 flex items-center justify-center text-xs font-bold" 
              style={{ width: `${lpPercent}%` }}
            >
              {lpPercent.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Active Method Effects */}
      {player.activeCultivationMethod && (
        <div className="mb-6 p-4 bg-cyan-900/50 border border-cyan-700 rounded-lg w-full text-left">
          <h4 className="text-lg font-bold text-cyan-300">Hiệu Ứng Vận Hành</h4>
          <p className="font-semibold text-white mb-2">Công pháp: {player.activeCultivationMethod.name}</p>
          <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(player.activeCultivationMethod.bonuses).map(([key, value]) => {
              const label = STAT_BONUS_FORMAT[key] 
                  ? STAT_BONUS_FORMAT[key](value as number)
                  : `${COMBAT_STAT_LABELS[key as keyof typeof COMBAT_STAT_LABELS] || key} +${value}`;
              return <p key={key} className="text-cyan-200">{label}</p>
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={onCultivate}
          disabled={isCultivating || isMeditating}
          className="flex-1 px-8 py-4 text-xl font-bold rounded-lg border-2 transition-all duration-300 bg-purple-600 hover:bg-purple-500 border-purple-400 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
        >
          {isCultivating ? 'Đang Tu Luyện...' : 'Hấp Thu Linh Lực'}
        </button>
        <button
          onClick={onMeditate}
          disabled={isMeditating || isCultivating || isFullHealth}
          className="flex-1 px-8 py-4 text-xl font-bold rounded-lg border-2 transition-all duration-300 bg-green-600 hover:bg-green-500 border-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
        >
          {isMeditating ? 'Đang Hồi Phục...' : 'Đả Tọa Hồi Phục'}
        </button>
      </div>

      {/* Cultivation Methods List */}
      <div className="w-full mt-12">
        <h4 className="text-2xl font-serif text-yellow-300 border-t border-gray-700 pt-6">Công Pháp Đã Học</h4>
        <p className="text-gray-400 mt-2 mb-6">Chọn một công pháp để vận hành. Mỗi công pháp mang lại hiệu quả khác nhau.</p>
        
        <div className="space-y-4">
          {knownMethods.length > 0 ? knownMethods.map(method => {
            const isActive = player.activeCultivationMethod?.id === method.id;
            return (
              <div 
                key={method.id}
                className={`p-4 rounded-lg border-2 text-left transition-all ${isActive ? 'bg-yellow-800/70 border-yellow-500 ring-2 ring-yellow-400' : 'bg-gray-900/50 border-gray-700'}`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-grow">
                    <h5 className="text-lg font-bold text-yellow-300">{method.name}</h5>
                    <p className="text-sm text-gray-400 my-2">{method.description}</p>
                     <div className="text-left text-xs pt-2 border-t border-gray-600/50 grid grid-cols-2 gap-1">
                      {Object.entries(method.bonuses).map(([key, value]) => {
                        const label = STAT_BONUS_FORMAT[key] 
                            ? STAT_BONUS_FORMAT[key](value as number)
                            : `${COMBAT_STAT_LABELS[key as keyof typeof COMBAT_STAT_LABELS] || key} +${value}`;
                        return <p key={key} className="text-cyan-400">{label}</p>
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => onActivateCultivationMethod(method.id)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex-shrink-0 w-full sm:w-auto ${isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                  >
                    {isActive ? 'Hủy Bỏ' : 'Vận Hành'}
                  </button>
                </div>
              </div>
            );
          }) : (
            <p className="text-gray-500 italic">Bạn chưa học được công pháp tu luyện nào.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default CultivationPanel;
