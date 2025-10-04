import React, { useState, useCallback } from 'react';
import { AdventureStorylet, AdventureStep, AdventureChoice } from '../types.ts';
import { generateAdventureStorylet } from '../services/geminiService.ts';

interface AdventurePanelProps {
  onStartBattle: (monsterName: string) => void;
  onReceiveReward: (reward: { exp?: number; linhThach?: number; itemId?: string }) => void;
}

const AdventurePanel: React.FC<AdventurePanelProps> = ({ onStartBattle, onReceiveReward }) => {
  const [storylet, setStorylet] = useState<AdventureStorylet | null>(null);
  const [currentStep, setCurrentStep] = useState<AdventureStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adventureLog, setAdventureLog] = useState<string[]>([]);

  const startNewAdventure = useCallback(async () => {
    setIsLoading(true);
    setStorylet(null);
    setCurrentStep(null);
    setAdventureLog([]);
    const newStorylet = await generateAdventureStorylet();
    if (newStorylet) {
      setStorylet(newStorylet);
      // FIX: Add a fallback to the first step if the startStepId is invalid.
      const startStep = newStorylet.steps.find(s => s.id === newStorylet.startStepId) ?? newStorylet.steps[0];
      if (startStep) {
        setCurrentStep(startStep);
        setAdventureLog([`**${newStorylet.title}**\n\n${startStep.description}`]);
      } else {
        setAdventureLog(['Lỗi: Không thể tải cuộc phiêu lưu.']);
        console.error("Invalid storylet: No steps found.", newStorylet);
      }
    } else {
      setAdventureLog(['Không thể tạo cuộc phiêu lưu vào lúc này. Vui lòng thử lại sau.']);
    }
    setIsLoading(false);
  }, []);

  const handleChoice = (choice: AdventureChoice) => {
    const { outcome } = choice;
    let logMessage = `> ${choice.text}`;

    switch (outcome.type) {
      case 'continue':
        if (outcome.nextStepId && storylet) {
          const nextStep = storylet.steps.find(s => s.id === outcome.nextStepId);
          if (nextStep) {
            setCurrentStep(nextStep);
            logMessage += `\n\n${nextStep.description}`;
          } else {
            logMessage += `\n\nLối đi này dường như không dẫn đến đâu cả... Cuộc phiêu lưu kết thúc.`;
            setCurrentStep(null);
          }
        }
        break;
      case 'battle':
        if (outcome.monsterName) {
          logMessage += `\n\nBạn đã gặp phải một ${outcome.monsterName}! Chuẩn bị chiến đấu!`;
          onStartBattle(outcome.monsterName);
          setCurrentStep(null);
        }
        break;
      case 'reward':
        logMessage += `\n\n${outcome.rewardDescription || 'Bạn đã nhận được một phần thưởng!'}`;
        onReceiveReward({
          exp: outcome.rewardExp,
          linhThach: outcome.rewardLinhThach,
          itemId: outcome.rewardItemId
        });
        setCurrentStep(null);
        break;
      case 'end':
        logMessage += `\n\nCuộc phiêu lưu của bạn đã kết thúc.`;
        setCurrentStep(null);
        break;
    }
    setAdventureLog(prev => [...prev, logMessage]);
  };

  return (
    <div className="flex flex-col items-center h-full">
      <h3 className="text-3xl font-serif text-yellow-300">Luyện Lịch</h3>
      <p className="text-gray-400 mt-2 mb-6">Khám phá thế giới, tìm kiếm cơ duyên và đối mặt với thử thách.</p>

      {!storylet && !isLoading && (
        <button
          onClick={startNewAdventure}
          className="px-8 py-4 text-xl font-bold rounded-lg border-2 transition-all duration-300 bg-blue-600 hover:bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/20"
        >
          Bắt Đầu Thám Hiểm
        </button>
      )}

      {isLoading && (
        <div className="text-center">
            <p className="text-xl text-yellow-300 animate-pulse">Đang kiến tạo một cơ duyên mới...</p>
            <p className="text-gray-400 mt-2">Tiên nhân đang gieo quẻ, xin chờ trong giây lát.</p>
        </div>
      )}

      {storylet && (
        <div className="w-full max-w-2xl bg-gray-900/50 border border-gray-700 rounded-lg p-6 flex flex-col flex-grow">
          {currentStep ? (
            <>
              <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4 text-gray-300">
                {adventureLog.map((log, index) => (
                  <p key={index} className="whitespace-pre-wrap animate-fadeIn" dangerouslySetInnerHTML={{ __html: log.replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-300">$1</strong>') }}></p>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    className="w-full text-left p-3 rounded-lg bg-gray-800/70 border border-gray-600 hover:bg-gray-700/90 transition-colors"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col flex-grow">
              <h4 className="text-xl font-bold text-yellow-300 mb-4 border-b border-yellow-700 pb-2">Nhật Ký Thám Hiểm</h4>
              <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4 text-gray-300">
                 {adventureLog.map((log, index) => (
                  <p key={index} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: log.replace(/\*\*(.*?)\*\*/g, '<strong class="text-yellow-300">$1</strong>') }}></p>
                ))}
              </div>
              <button
                  onClick={startNewAdventure}
                  className="w-full mt-auto px-6 py-3 text-lg font-bold rounded-lg border-2 transition-all duration-300 bg-blue-600 hover:bg-blue-500 border-blue-400"
                >
                  Bắt Đầu Cuộc Phiêu Lưu Mới
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdventurePanel;