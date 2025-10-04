import React from 'react';
import { Player, TranPhap, Item, PotentialStats, WorldMapArea, EquipmentSlot } from '../types.ts';
import CharacterPanel from './CharacterPanel.tsx';
import InventoryPanel from './InventoryPanel.tsx';
import AdventurePanel from './AdventurePanel.tsx';
import SkillDisplay from './SkillDisplay.tsx';
import FormationPanel from './FormationPanel.tsx';
import StorePanel from './StorePanel.tsx';
import WorldMapPanel from './WorldMapPanel.tsx';
import QuestPanel from './QuestPanel.tsx';
import CompanionPanel from './CompanionPanel.tsx';

interface MainContentAreaProps {
  apiKey: string | null;
  activePanel: string;
  player: Player;
  isCultivating: boolean;
  setIsCultivating: (isCultivating: boolean) => void;
  cultivationBonus: number;
  onCultivate: () => () => void;
  isMeditating: boolean;
  setIsMeditating: (isMeditating: boolean) => void;
  // FIX: Added the missing onMeditate prop to align with its usage in App.tsx.
  onMeditate: () => () => void;
  onStartBattle: (monsterName: string) => void;
  onReceiveReward: (reward: { characterExp?: number; cultivationExp?: number; linhThach?: number; itemId?: string }) => void;
  onActivateFormation: (tranPhap: TranPhap) => void;
  onActivateCultivationMethod: (methodId: string) => void;
  onSpendPotentialPoint: (stat: keyof PotentialStats) => void;
  onEquipItem: (item: Item) => void;
  onUnequipItem: (slot: EquipmentSlot) => void;
  onItemUse: (item: Item) => void;
  onBuyItem: (itemId: string, price: number) => void;
  onNotify: (message: string) => void;
  onEnterArea: (area: WorldMapArea) => void;
  onSetActiveCompanion: (companionId: string | null) => void;
  onEquipItemOnCompanion: (companionId: string, item: Item) => void;
  onUnequipItemFromCompanion: (companionId: string, slot: EquipmentSlot) => void;
  onFindHiddenTreasure: (treasureId: string) => void;
  onSeekEnlightenment: (enlightenmentId: string) => void;
  onSearchForHerbs: (herbId: string) => void;
  masterItemList: Item[];
}

const MainContentArea: React.FC<MainContentAreaProps> = (props) => {
  const { activePanel, player, apiKey } = props;

  const renderContent = () => {
    switch (activePanel) {
      case 'character':
        return <CharacterPanel 
            player={player}
            isCultivating={props.isCultivating}
            setIsCultivating={props.setIsCultivating}
            cultivationBonus={props.cultivationBonus}
            onCultivate={props.onCultivate}
            isMeditating={props.isMeditating}
            setIsMeditating={props.setIsMeditating}
            onMeditate={props.onMeditate}
            onSpendPotentialPoint={props.onSpendPotentialPoint}
            onUnequipItem={props.onUnequipItem}
            onActivateCultivationMethod={props.onActivateCultivationMethod}
        />;
      case 'inventory':
        return <InventoryPanel player={player} onItemUse={props.onItemUse} onEquip={props.onEquipItem} />;
      case 'adventure':
        return <AdventurePanel onStartBattle={props.onStartBattle} onReceiveReward={props.onReceiveReward} apiKey={apiKey} />;
      case 'quest':
        return <QuestPanel quests={player.quests} />;
      case 'skills':
        return <SkillDisplay skills={player.skills} />;
      case 'map':
        return <WorldMapPanel 
            player={player} 
            onNotify={props.onNotify} 
            onEnterArea={props.onEnterArea}
            onFindHiddenTreasure={props.onFindHiddenTreasure}
            onSeekEnlightenment={props.onSeekEnlightenment}
            onSearchForHerbs={props.onSearchForHerbs}
        />;
      case 'formation':
        return <FormationPanel player={player} onActivate={props.onActivateFormation} />;
      case 'store':
        return <StorePanel player={player} onBuyItem={props.onBuyItem} masterItemList={props.masterItemList} />;
      case 'companion':
        return <CompanionPanel 
            player={player} 
            onSetActiveCompanion={props.onSetActiveCompanion}
            onEquipItem={props.onEquipItemOnCompanion}
            onUnequipItem={props.onUnequipItemFromCompanion}
        />;
      default:
        return <p>Unknown panel</p>;
    }
  };

  return <div className="h-full w-full overflow-y-auto">{renderContent()}</div>;
};

export default MainContentArea;