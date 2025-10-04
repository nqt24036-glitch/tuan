// FIX: Create full content for `types.ts` to define all game-related types.
// Exporting types makes this file a module, fixing import errors.
// MODIFIED: Added PotentialStats, SpiritRoot, and updated Player/CombatStats for the new character panel.
// MODIFIED: Added new fields to WorldMapArea for NPCs, monsters, bosses, and rewards.
// MODIFIED: Added an optional 'skills' array to the Monster interface to support the new combat AI.

export type ItemRarity = 'Phổ thông' | 'Quý' | 'Hiếm' | 'Truyền Kỳ' | 'Thần Thoại';
export type ItemType = 'Vũ khí' | 'Áo giáp' | 'Pháp bảo' | 'Tiêu hao' | 'Nguyên liệu' | 'Sách Kỹ Năng';
export type EquipmentSlot = 'vũ khí' | 'áo giáp' | 'pháp bảo';

export type SkillType = 'Chủ Động' | 'Bị Động';
export type OutcomeType = 'continue' | 'battle' | 'reward' | 'end';

export interface CombatStats {
  attack: number;
  magicAttack: number;
  defense: number;
  magicDefense: number;
  critRate: number; // 0 to 1
  critDamage: number; // multiplier, e.g., 1.5
  accuracy: number; // 0 to 1
  evasion: number; // 0 to 1
  speed: number;
  armorPen: number; // 0 to 1
  blockRate: number; // 0 to 1
  mentalDemonResistance: number; // 0 to 1
}

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  type: ItemType;
  icon: string;
  slot?: EquipmentSlot;
  // FIX: Allow `hp` and `mp` in item stats to match usage in `App.tsx` and data in `gameData.ts`.
  stats?: Partial<CombatStats & { hp: number; mp: number }>;
  effect?: string; // For consumables
  restores?: { hp?: number; mp?: number }; // For battle consumables
  expGain?: number; // For cultivation items
  skillId?: string; // For skill books
  requirement?: string;
  story?: string;
  value?: number; // Base value for buying/selling
}

export interface Cultivation {
  realm: string;
  stage: number;
  lp: number; // Linh Lực
  lpToNext: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  origin: string;
  type: SkillType;
  damage?: number;
  heal?: number;
  mpCost?: number;
  passiveBonus?: Partial<CombatStats & { hp: number; mp: number; cultivationSpeedBonus: number }>;
  visualEffect?: 'slash' | 'heal';
  soundEffectUrl?: string;
}

export interface TranPhap {
    id: string;
    name: string;
    description: string;
    cultivationBonus: number;
    combatBonus?: Partial<CombatStats>;
}

export interface PotentialStats {
  theChat: number; // Thể chất
  triLuc: number;  // Trí lực
  linhMan: number; // Linh mẫn
  sucManh: number; // Sức mạnh
  canCo: number;   // Căn cơ
  dinhLuc: number; // Định lực
}

export interface SpiritRoot {
  linhCan: string;
  phamChat: string;
  nguHanh: { [key: string]: number };
  thienPhu: number;
  canCot: number;
  phucDuyen: number;
}

export interface CultivationMethod {
  id: string;
  name: string;
  description: string;
  realmRequirement: string;
  bonuses: Partial<CombatStats & { hp: number; mp: number; cultivationSpeedBonus: number }>;
}

export interface Player {
  name: string;
  gender: 'Nam' | 'Nữ';
  sect: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  linhThach: number;
  avatarUrl: string;
  hairStyle: number;
  eyeColor: 'Đen' | 'Trắng';
  
  potentialPoints: number;
  basePotentialStats: PotentialStats;
  potentialStats: PotentialStats;
  spiritRoot: SpiritRoot;
  
  baseStats: CombatStats;
  totalStats: CombatStats; // Base + equipment + skills + formation + potential
  
  cultivation: Cultivation;
  inventory: Item[];
  equippedItems: Partial<Record<EquipmentSlot, Item>>;
  skills: Skill[];
  quests: Quest[];
  knownTranPhapIds: string[];
  activeTranPhap: TranPhap | null;

  knownCultivationMethodIds: string[];
  activeCultivationMethod: CultivationMethod | null;

  companions: Companion[];
  activeCompanionId: string | null;
  foundTreasures: string[];
}

export interface Companion {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  level: number;
  exp: number;
  expToNextLevel: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  baseStats: CombatStats;
  totalStats: CombatStats;
  skills: Skill[];
  equippedItems: Partial<Record<EquipmentSlot, Item>>;
}

export interface Monster {
  id: string;
  name: string;
  hp: number;
  stats: CombatStats;
  skills?: Skill[];
  rewards: {
    characterExp: number;
    cultivationExp: number;
    // FIX: Corrected typo from `lThach` to `linhThach` for consistency.
    linhThach: number;
    items: { itemId: string; chance: number }[];
  }
}

export interface NPC {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  hairStyle: number;
  eyeColor: 'Đen' | 'Trắng';
  baseStats: CombatStats;
  totalStats: CombatStats;
  equippedItems: Partial<Record<EquipmentSlot, Item>>;
}

export interface CharacterCreationData {
  name: string;
  gender: 'Nam' | 'Nữ';
  sect: string;
  hairStyle: number;
  eyeColor: 'Đen' | 'Trắng';
}

export interface AdventureOutcome {
  type: OutcomeType;
  nextStepId?: string;
  monsterName?: string;
  rewardDescription?: string;
  rewardExp?: number;
  rewardLinhThach?: number;
  rewardItemId?: string;
}

export interface AdventureChoice {
  text: string;
  outcome: AdventureOutcome;
}

export interface AdventureStep {
  id: string;
  description: string;
  choices: AdventureChoice[];
}

export interface AdventureStorylet {
  title: string;
  startStepId: string;
  steps: AdventureStep[];
}

export interface CombatLogEntry {
  actor: string;
  action: string;
  target: string;
  isPlayerActor: boolean;
  damage?: number;
  isCrit?: boolean;
  isMiss?: boolean;
  isBlock?: boolean;
  skillName?: string;
}

// FIX: Added Quest type to resolve import error in QuestPanel.tsx
export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  rewardObject?: {
    characterExp?: number;
    cultivationExp?: number;
    linhThach?: number;
    itemId?: string;
  };
  objective?: {
    type: 'kill' | 'collect' | 'talk';
    targetName: string; // Can be monster name, item name, or NPC name
    itemId?: string; // Specifically for 'collect' quests to identify the item
  };
}

export interface WorldMapArea {
  id: string;
  name: string;
  description: string;
  levelRange: string;
  npcs?: string[];
  monsters?: string[];
  boss?: string;
  rewards?: string[];
}

export interface WorldMapRealm {
  id: string;
  name: string;
  description: string;
  levelRange: string;
  areas: WorldMapArea[];
}