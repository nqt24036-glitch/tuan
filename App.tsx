// FIX: Replaced placeholder text with a fully functional main App component. This component manages game state, handles character creation, and orchestrates the different UI panels. Exporting the component resolves the "not a module" error.
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Player, CharacterCreationData, Monster, TranPhap, Item, EquipmentSlot, PotentialStats, WorldMapArea, Quest, Companion, NPC, Skill, CultivationMethod } from './types.ts';
import { MONSTERS, SKILLS, TRAN_PHAP_LIST, ITEM_LIST, COMPANION_LIST, NPC_LIST, CULTIVATION_METHODS_LIST } from './data/gameData.ts';
import CharacterCreationScreen from './components/CharacterCreationScreen.tsx';
import StatusBar from './components/StatusBar.tsx';
import MainContentArea from './components/MainContentArea.tsx';
import BottomNavBar from './components/BottomNavBar.tsx';
import BattleScreen from './components/BattleScreen.tsx';
import AreaDetailPanel from './components/AreaDetailPanel.tsx';
import BlacksmithPanel from './components/BlacksmithPanel.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import AddNewMonsterModal from './components/AddNewMonsterModal.tsx';
import ActivityLogPanel from './components/ActivityLogPanel.tsx';

// Initial Player State
const createInitialPlayer = (data: CharacterCreationData): Player => {
  // Base stats initialization
  const baseStats = { attack: 5, magicAttack: 5, defense: 5, magicDefense: 5, critRate: 0.05, critDamage: 1.5, accuracy: 0.9, evasion: 0.05, speed: 10, armorPen: 0, blockRate: 0, mentalDemonResistance: 0 };
  const initialCompanion = COMPANION_LIST.find(c => c.id === 'companion_001');
  const initialMethods = CULTIVATION_METHODS_LIST.filter(m => m.realmRequirement === 'Luyện Khí').map(m => m.id);
  const initialPotentialStats = { theChat: 5, triLuc: 5, linhMan: 5, sucManh: 5, canCo: 5, dinhLuc: 5 };

  return {
    name: data.name,
    gender: data.gender,
    sect: data.sect,
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    linhThach: 100,
    avatarUrl: `https://api.multiavatar.com/${data.name.trim()}-${data.hairStyle}-${data.eyeColor}.png`,
    hairStyle: data.hairStyle,
    eyeColor: data.eyeColor,
    potentialPoints: 5,
    basePotentialStats: initialPotentialStats,
    potentialStats: initialPotentialStats,
    spiritRoot: { linhCan: 'Ngũ Hành Tạp Linh Căn', phamChat: 'Hạ Phẩm', nguHanh: { Kim: 10, Mộc: 10, Thủy: 10, Hỏa: 10, Thổ: 10 }, thienPhu: 20, canCot: 20, phucDuyen: 20 },
    baseStats,
    totalStats: { ...baseStats },
    cultivation: { realm: 'Luyện Khí', stage: 1, lp: 0, lpToNext: 100 },
    inventory: [ ...ITEM_LIST.filter(i => ['item_001', 'item_002', 'item_004', 'item_019'].includes(i.id)) ],
    equippedItems: {},
    skills: [ ...SKILLS.filter(s => s.id === 'skill_001') ],
    quests: [],
    knownTranPhapIds: ['tp_001'],
    activeTranPhap: null,
    knownCultivationMethodIds: initialMethods,
    activeCultivationMethod: null,
    companions: initialCompanion ? [initialCompanion] : [],
    activeCompanionId: null,
    foundTreasures: [],
  };
};

const CULTIVATION_REALMS = ['Luyện Khí', 'Trúc Cơ', 'Kim Đan', 'Nguyên Anh', 'Hóa Thần', 'Luyện Hư', 'Hợp Thể', 'Độ Kiếp', 'Đại Thừa', 'Chân Tiên', 'Thiên Tiên', 'Tiên Vương'];
const REALM_BREAKTHROUGH_FLAT_BONUS = [10, 50, 100, 200, 300, 400, 600, 800, 1000, 5000, 8000, 10000];
const REALM_BREAKTHROUGH_PERCENT_BONUS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 2.0, 3.0];
const STAGE_PERCENT_BONUS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 2.0, 3.0];

const parseLevelRange = (range: string): [number, number] => {
  if (range.includes('+')) {
    return [parseInt(range, 10), Infinity];
  }
  const parts = range.split('-').map(Number);
  return [parts[0], parts[1] || parts[0]];
};


const App: React.FC = () => {
    // State management
    const [player, setPlayer] = useState<Player | null>(() => {
        const savedPlayer = localStorage.getItem('playerData');
        return savedPlayer ? JSON.parse(savedPlayer) : null;
    });
    const [npcList, setNpcList] = useState<NPC[]>(() => {
        const savedNpcs = localStorage.getItem('npcList');
        return savedNpcs ? JSON.parse(savedNpcs) : NPC_LIST;
    });
    const [activePanel, setActivePanel] = useState('character');
    const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
    const [isCultivating, setIsCultivating] = useState(false);
    const [isMeditating, setIsMeditating] = useState(false);
    const [notifications, setNotifications] = useState<string[]>([]);
    const [currentArea, setCurrentArea] = useState<WorldMapArea | null>(null);
    const [isBlacksmithOpen, setIsBlacksmithOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [masterMonsterList, setMasterMonsterList] = useState<Monster[]>([]);
    const [masterItemList, setMasterItemList] = useState<Item[]>(() => {
        const savedItems = localStorage.getItem('customItems');
        const customItems = savedItems ? JSON.parse(savedItems) : [];
        return [...ITEM_LIST, ...customItems];
    });
    const [newMonsterPrompt, setNewMonsterPrompt] = useState<{ name: string; suggestedMonster: Monster } | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        const savedIsAdmin = localStorage.getItem('isAdmin');
        return savedIsAdmin ? JSON.parse(savedIsAdmin) : false;
    });
    const [activityLog, setActivityLog] = useState<string[]>([]);
    const [isLogVisible, setIsLogVisible] = useState(false);
    const [isBottomNavBarVisible, setIsBottomNavBarVisible] = useState<boolean>(() => JSON.parse(localStorage.getItem('isBottomNavBarVisible') ?? 'true'));

    
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    const cultivationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Activity Log Handler
    const addActivityLog = useCallback((message: string) => {
        const timestamp = `[${new Date().toLocaleTimeString('en-GB')}]`;
        setActivityLog(prev => [`${timestamp} ${message}`, ...prev].slice(0, 100)); // Keep max 100 entries
    }, []);

    // Load initial data
    useEffect(() => {
        const customMonstersRaw = localStorage.getItem('customMonsters');
        const customMonsters = customMonstersRaw ? JSON.parse(customMonstersRaw) : [];
        setMasterMonsterList([...MONSTERS, ...customMonsters]);
    }, []);

    // Persist player data to localStorage
    useEffect(() => {
        if (player) {
            localStorage.setItem('playerData', JSON.stringify(player));
        }
    }, [player]);

    // Persist NPC data to localStorage
    useEffect(() => {
        localStorage.setItem('npcList', JSON.stringify(npcList));
    }, [npcList]);
    
    // Persist custom monsters to localStorage
    useEffect(() => {
        if (masterMonsterList.length > MONSTERS.length) {
            const customMonsters = masterMonsterList.slice(MONSTERS.length);
            localStorage.setItem('customMonsters', JSON.stringify(customMonsters));
        }
    }, [masterMonsterList]);
    
    useEffect(() => {
        if (masterItemList.length > ITEM_LIST.length) {
            const customItems = masterItemList.slice(ITEM_LIST.length);
            localStorage.setItem('customItems', JSON.stringify(customItems));
        }
    }, [masterItemList]);

    useEffect(() => {
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
    }, [isAdmin]);

    useEffect(() => {
        localStorage.setItem('isBottomNavBarVisible', JSON.stringify(isBottomNavBarVisible));
    }, [isBottomNavBarVisible]);

    // Notification handler
    const addNotification = useCallback((message: string) => {
        setNotifications(prev => [...prev, message]);
        setTimeout(() => setNotifications(prev => prev.slice(1)), 3000);
    }, []);

    // Companion stat calculation
    const calculateCompanionTotalStats = useCallback((c: Companion): Companion => {
        const updatedCompanion = { ...c };
        let newStats = { ...c.baseStats };
        let maxHpBonusFromItems = 0;
        let maxMpBonusFromItems = 0;
    
        const companionTemplate = COMPANION_LIST.find(comp => comp.id === c.id);
        if (!companionTemplate) return c;
    
        // Recalculate level up bonuses from scratch
        const levelUpHpBonus = (c.level - 1) * 15;
        const levelUpMpBonus = (c.level - 1) * 8;
    
        // Equipment stats
        Object.values(c.equippedItems).forEach(item => {
            if (item?.stats) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    if (stat === 'hp') maxHpBonusFromItems += value;
                    else if (stat === 'mp') maxMpBonusFromItems += value;
                    else newStats[stat as keyof typeof newStats] += value;
                }
            }
        });
    
        updatedCompanion.totalStats = newStats;
        updatedCompanion.maxHp = companionTemplate.maxHp + levelUpHpBonus + maxHpBonusFromItems;
        updatedCompanion.maxMp = companionTemplate.maxMp + levelUpMpBonus + maxMpBonusFromItems;
        updatedCompanion.hp = Math.min(updatedCompanion.hp, updatedCompanion.maxHp);
        updatedCompanion.mp = Math.min(updatedCompanion.mp, updatedCompanion.maxMp);
    
        return updatedCompanion;
    }, []);

    // Recalculate player total stats
    const calculateTotalStats = useCallback((p: Player): Player => {
        const updatedPlayer = { ...p };

        // --- NEW: Calculate potentialStats with bonuses from cultivation ---
        let tempPotentialStats = { ...p.basePotentialStats };
        const currentRealmIndex = CULTIVATION_REALMS.indexOf(p.cultivation.realm);

        if (currentRealmIndex !== -1) {
            // 1. Apply bonuses for all COMPLETED realms
            for (let i = 0; i < currentRealmIndex; i++) {
                const flatBonus = REALM_BREAKTHROUGH_FLAT_BONUS[i] || 0;
                const percentBonus = REALM_BREAKTHROUGH_PERCENT_BONUS[i] || 0;
                for (const key in tempPotentialStats) {
                    const statKey = key as keyof PotentialStats;
                    tempPotentialStats[statKey] += flatBonus;
                    tempPotentialStats[statKey] *= (1 + percentBonus);
                }
            }

            // 2. Apply bonuses for stages in the CURRENT realm (additive percentage)
            const stagesCompleted = p.cultivation.stage - 1;
            if (stagesCompleted > 0) {
                const stagePercentBonus = STAGE_PERCENT_BONUS[currentRealmIndex] || 0;
                const totalStageMultiplier = 1 + (stagesCompleted * stagePercentBonus);
                for (const key in tempPotentialStats) {
                    const statKey = key as keyof PotentialStats;
                    tempPotentialStats[statKey] *= totalStageMultiplier;
                }
            }
        }
        
        // Round the potential stats to avoid long decimals
        for (const key in tempPotentialStats) {
            const statKey = key as keyof PotentialStats;
            tempPotentialStats[statKey] = Math.round(tempPotentialStats[statKey]);
        }

        updatedPlayer.potentialStats = tempPotentialStats;
        // --- END OF NEW POTENTIAL STATS CALCULATION ---
        

        let newStats = { ...p.baseStats };
        let maxHpBonus = 0;
        let maxMpBonus = 0;

        // Apply potential stats bonuses (using the newly calculated potentialStats)
        newStats.attack += updatedPlayer.potentialStats.sucManh * 2;
        newStats.speed += updatedPlayer.potentialStats.linhMan * 1;
        newStats.evasion += updatedPlayer.potentialStats.linhMan * 0.005;
        maxHpBonus += updatedPlayer.potentialStats.theChat * 10;
        newStats.defense += updatedPlayer.potentialStats.theChat * 1;
        maxMpBonus += updatedPlayer.potentialStats.triLuc * 5;
        newStats.magicAttack += updatedPlayer.potentialStats.triLuc * 2;
        newStats.magicDefense += (updatedPlayer.potentialStats.canCo * 1) + (updatedPlayer.potentialStats.dinhLuc * 1);
        newStats.mentalDemonResistance += updatedPlayer.potentialStats.dinhLuc * 0.005;

        // Equipment stats
        Object.values(p.equippedItems).forEach(item => {
            if (item?.stats) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    if (stat === 'hp') maxHpBonus += value;
                    else if (stat === 'mp') maxMpBonus += value;
                    else newStats[stat as keyof typeof newStats] += value;
                }
            }
        });

        // Passive skill stats
        p.skills.forEach(skill => {
            if (skill.type === 'Bị Động' && skill.passiveBonus) {
                 for (const [stat, value] of Object.entries(skill.passiveBonus)) {
                    if (stat === 'hp') maxHpBonus += value;
                    else if (stat === 'mp') maxMpBonus += value;
                    else if (stat !== 'cultivationSpeedBonus' && newStats.hasOwnProperty(stat)) {
                        newStats[stat as keyof typeof newStats] += value;
                    }
                }
            }
        });

        // Formation stats
        if (p.activeTranPhap?.combatBonus) {
             for (const [stat, value] of Object.entries(p.activeTranPhap.combatBonus)) {
                newStats[stat as keyof typeof newStats] += value;
            }
        }
        
        // Active Cultivation Method stats
        if (p.activeCultivationMethod?.bonuses) {
             for (const [stat, value] of Object.entries(p.activeCultivationMethod.bonuses)) {
                if (stat === 'hp') maxHpBonus += value;
                else if (stat === 'mp') maxMpBonus += value;
                else if (stat !== 'cultivationSpeedBonus' && newStats.hasOwnProperty(stat)) {
                    newStats[stat as keyof typeof newStats] += value;
                }
            }
        }

        updatedPlayer.totalStats = newStats;
        
        const baseHpFromLevel = 100 + (p.level - 1) * 10;
        const baseMpFromLevel = 50 + (p.level - 1) * 5;
        
        updatedPlayer.maxHp = baseHpFromLevel + maxHpBonus;
        updatedPlayer.maxMp = baseMpFromLevel + maxMpBonus;
        
        return updatedPlayer;
    }, []);
    
    const processLevelUps = useCallback((playerState: Player): { finalPlayer: Player, notifications: string[] } => {
        const updatedPlayer = JSON.parse(JSON.stringify(playerState));
        const newNotifications: string[] = [];
    
        let playerLeveledUp = false;
        let realmLeveledUp = false;
        let cultivationLeveledUp = false;
        let companionLeveledUp = false;
    
        // Player Character Level Up
        while (updatedPlayer.exp >= updatedPlayer.expToNextLevel) {
            playerLeveledUp = true;
            updatedPlayer.exp -= updatedPlayer.expToNextLevel;
            updatedPlayer.level += 1;
            updatedPlayer.expToNextLevel = Math.floor(updatedPlayer.expToNextLevel * 1.5 + 50 * updatedPlayer.level);
            updatedPlayer.potentialPoints += 5;
            updatedPlayer.baseStats.attack += 1;
            updatedPlayer.baseStats.defense += 1;
            newNotifications.push(`Chúc mừng! Bạn đã đột phá Cấp ${updatedPlayer.level}!`);
        }
    
        // Player Cultivation Level Up
        while (updatedPlayer.cultivation.lp >= updatedPlayer.cultivation.lpToNext) {
            cultivationLeveledUp = true;
            updatedPlayer.cultivation.lp -= updatedPlayer.cultivation.lpToNext;
            updatedPlayer.cultivation.stage += 1;
            updatedPlayer.cultivation.lpToNext = Math.floor(updatedPlayer.cultivation.lpToNext * 1.2 + 20 * updatedPlayer.cultivation.stage);
    
            if (updatedPlayer.cultivation.stage > 10) {
                const currentRealmIndex = CULTIVATION_REALMS.indexOf(updatedPlayer.cultivation.realm);
                if (currentRealmIndex < CULTIVATION_REALMS.length - 1) {
                    realmLeveledUp = true;
                    updatedPlayer.cultivation.realm = CULTIVATION_REALMS[currentRealmIndex + 1];
                    updatedPlayer.cultivation.stage = 1;
                    newNotifications.push(`Cảnh giới đại đột phá! Chúc mừng bạn đã tiến vào ${updatedPlayer.cultivation.realm}!`);

                    const newlyUnlockedMethods = CULTIVATION_METHODS_LIST.filter(method => 
                        method.realmRequirement === updatedPlayer.cultivation.realm && 
                        !updatedPlayer.knownCultivationMethodIds.includes(method.id)
                    );
                    if (newlyUnlockedMethods.length > 0) {
                        newlyUnlockedMethods.forEach(method => {
                            updatedPlayer.knownCultivationMethodIds.push(method.id);
                            newNotifications.push(`Lĩnh ngộ công pháp mới: [${method.name}]!`);
                        });
                    }
                } else {
                     newNotifications.push(`Chúc mừng! Tu vi đột phá ${updatedPlayer.cultivation.realm} Tầng ${updatedPlayer.cultivation.stage}!`);
                }
            } else {
                 newNotifications.push(`Chúc mừng! Tu vi đột phá ${updatedPlayer.cultivation.realm} Tầng ${updatedPlayer.cultivation.stage}!`);
            }
        }
    
        // Companion Level Up
        updatedPlayer.companions.forEach((comp: Companion) => {
            let leveledUp = false;
            while (comp.exp >= comp.expToNextLevel) {
                leveledUp = true;
                comp.exp -= comp.expToNextLevel;
                comp.level += 1;
                comp.expToNextLevel = Math.floor(comp.expToNextLevel * 1.6);
                comp.baseStats.attack += 2;
                comp.baseStats.defense += 1;
                newNotifications.push(`Đồng hành [${comp.name}] đã lên Cấp ${comp.level}!`);
            }
            if (leveledUp) {
                companionLeveledUp = true;
                const newStatsComp = calculateCompanionTotalStats(comp);
                comp.maxHp = newStatsComp.maxHp;
                comp.maxMp = newStatsComp.maxMp;
                comp.totalStats = newStatsComp.totalStats;
                comp.hp = comp.maxHp;
                comp.mp = comp.maxMp;
            }
        });
    
        const somethingChanged = playerLeveledUp || realmLeveledUp || cultivationLeveledUp || companionLeveledUp;
    
        if (somethingChanged) {
            const playerWithNewStats = calculateTotalStats(updatedPlayer);

            if (playerLeveledUp || realmLeveledUp) {
                playerWithNewStats.hp = playerWithNewStats.maxHp;
                playerWithNewStats.mp = playerWithNewStats.maxMp;
                newNotifications.push(`HP/MP đã hồi phục hoàn toàn!`);
            } else {
                playerWithNewStats.hp = Math.min(updatedPlayer.hp, playerWithNewStats.maxHp);
                playerWithNewStats.mp = Math.min(updatedPlayer.mp, playerWithNewStats.maxMp);
            }
            
            playerWithNewStats.companions = updatedPlayer.companions;
            
            return { finalPlayer: playerWithNewStats, notifications: newNotifications };
        }
        
        // If nothing changed, return the original state
        return { finalPlayer: playerState, notifications: [] };
    }, [calculateTotalStats, calculateCompanionTotalStats]);


    // Auto-level up effect for player and companions, now using the centralized function
    useEffect(() => {
        if (!player) return;
        
        const { finalPlayer, notifications } = processLevelUps(player);
        
        if (notifications.length > 0) {
            // Compare to avoid infinite loops if the level-up logic produces the exact same object
            if (JSON.stringify(finalPlayer) !== JSON.stringify(player)) {
                notifications.forEach(addNotification);
                setPlayer(finalPlayer);
            }
        }
    }, [player, processLevelUps, addNotification]);


    // Character Creation
    const handleCharacterCreate = (data: CharacterCreationData) => {
        const newPlayer = createInitialPlayer(data);
        setPlayer(calculateTotalStats(newPlayer));
        addActivityLog("Chào mừng đến với Huyền Giới Tu Tiên!");
    };
    
    // Cultivation & Meditation Logic
    const cultivationBonus = useMemo(() => {
        if (!player) return 0;
        let bonus = 0;
        if (player.activeTranPhap) bonus += player.activeTranPhap.cultivationBonus;
        player.skills.forEach(s => {
            if (s.type === 'Bị Động' && s.passiveBonus?.cultivationSpeedBonus) {
                bonus += s.passiveBonus.cultivationSpeedBonus;
            }
        });
        if (player.activeCultivationMethod?.bonuses?.cultivationSpeedBonus) {
            bonus += player.activeCultivationMethod.bonuses.cultivationSpeedBonus;
        }
        return bonus;
    }, [player]);

    const stopActivities = () => {
        setIsCultivating(false);
        setIsMeditating(false);
        if (cultivationIntervalRef.current) {
            clearInterval(cultivationIntervalRef.current);
            cultivationIntervalRef.current = null;
        }
    };
    
    const handleCultivate = useCallback(() => {
        if (!player) return () => {};
        if (isCultivating || isMeditating) {
            stopActivities();
            return () => {};
        }

        setIsCultivating(true);
        cultivationIntervalRef.current = setInterval(() => {
            setPlayer(p => {
                if (!p) return null;
                const lpGain = 1 + Math.round(p.cultivation.stage * (1 + cultivationBonus));
                let newLp = p.cultivation.lp + lpGain;
                // Level up logic is now handled by useEffect
                return { ...p, cultivation: { ...p.cultivation, lp: newLp } };
            });
        }, 2000);
        return stopActivities;
    }, [player, isCultivating, isMeditating, cultivationBonus]);
    
    const handleMeditate = useCallback(() => {
        if (!player) return () => {};
        if (isCultivating || isMeditating) {
            stopActivities();
            return () => {};
        }

        setIsMeditating(true);
        cultivationIntervalRef.current = setInterval(() => {
            setPlayer(p => {
                if (!p) return null;
                const hpGain = Math.round(p.maxHp * 0.05);
                const mpGain = Math.round(p.maxMp * 0.05);
                const newHp = Math.min(p.maxHp, p.hp + hpGain);
                const newMp = Math.min(p.maxMp, p.mp + mpGain);
                if (newHp === p.maxHp && newMp === p.maxMp) {
                    stopActivities();
                    addNotification("Đã hồi phục hoàn toàn.");
                }
                return { ...p, hp: newHp, mp: newMp };
            });
        }, 3000);
        return stopActivities;
    }, [player, isCultivating, isMeditating, addNotification]);


    // Battle Logic
    const handleStartBattle = (monsterName: string) => {
        const monsterData = masterMonsterList.find(m => m.name === monsterName);
        if (monsterData) {
            stopActivities();
            setCurrentMonster(monsterData);
            addNotification(`Bạn đã gặp phải ${monsterName}!`);
        } else if (player) {
            const [areaMinLevel] = currentArea ? parseLevelRange(currentArea.levelRange) : [player.level, player.level];
            const monsterLevel = Math.max(1, areaMinLevel);

            const suggestedMonster: Monster = {
                id: `monster_${Date.now()}`,
                name: monsterName,
                hp: monsterLevel * 15 + 40,
                stats: {
                    attack: monsterLevel * 3 + 5,
                    defense: monsterLevel * 2 + 2,
                    speed: 10,
                    magicAttack: 0,
                    magicDefense: monsterLevel + 1,
                    critRate: 0.05,
                    critDamage: 1.5,
                    accuracy: 0.9,
                    evasion: 0.05,
                    armorPen: 0,
                    blockRate: 0,
                    mentalDemonResistance: 0
                },
                rewards: {
                    characterExp: monsterLevel * 8,
                    cultivationExp: monsterLevel * 5,
                    linhThach: monsterLevel * 3,
                    items: [],
                }
            };
            setNewMonsterPrompt({ name: monsterName, suggestedMonster });
        }
    };
    
    const handleConfirmAddMonster = (monster: Monster) => {
        addNotification(`Đã thêm yêu thú [${monster.name}] vào danh giám!`);
        setMasterMonsterList(prev => [...prev, monster]);

        // Start the battle now that the monster exists
        stopActivities();
        setCurrentMonster(monster);
        setNewMonsterPrompt(null);
    };

    const handleBattleEnd = (victory: boolean, finalPlayerHp: number, finalPlayerMp: number, finalCompanionState: { hp: number; mp: number } | null, monsterDefeated: Monster | null) => {
        setCurrentMonster(null);
        if (victory && player && monsterDefeated) {
            const { characterExp, cultivationExp, linhThach, items } = monsterDefeated.rewards;
            const rewardMsg = `Chiến thắng! Nhận ${characterExp} EXP, ${cultivationExp} Linh Lực, ${linhThach} Linh Thạch.`;
            addNotification(rewardMsg);
            addActivityLog(rewardMsg);
            
            setPlayer(p => {
                if (!p) return null;
                const newInv = [...p.inventory];
                items.forEach(itemDrop => {
                    if (Math.random() < itemDrop.chance) {
                        const item = masterItemList.find(i => i.id === itemDrop.itemId);
                        if(item) {
                           newInv.push(item);
                           const itemMsg = `Nhặt được: ${item.name}`;
                           addNotification(itemMsg);
                           addActivityLog(itemMsg);
                        }
                    }
                });

                const updatedPlayer = { 
                    ...p, 
                    hp: finalPlayerHp, 
                    mp: finalPlayerMp, 
                    exp: p.exp + characterExp, 
                    cultivation: {...p.cultivation, lp: p.cultivation.lp + cultivationExp }, 
                    linhThach: p.linhThach + linhThach, 
                    inventory: newInv,
                    quests: [...p.quests] // Create a copy to mutate
                };

                // --- Quest Progress and Completion Logic ---
                const questsWithProgress = updatedPlayer.quests.map(q => {
                    if (q.objective?.type === 'kill' && q.objective.targetName === monsterDefeated.name && q.progress < q.target) {
                        const newProgress = q.progress + 1;
                        const questMsg = `Nhiệm vụ [${q.title}]: ${newProgress}/${q.target}`;
                        addNotification(questMsg);
                        addActivityLog(questMsg);
                        return { ...q, progress: newProgress };
                    }
                    return q;
                });

                const completedQuests = questsWithProgress.filter(q => q.progress >= q.target);
                const remainingQuests = questsWithProgress.filter(q => q.progress < q.target);

                if (completedQuests.length > 0) {
                    completedQuests.forEach(cq => {
                        const questCompleteMsg = `Hoàn thành nhiệm vụ: ${cq.title}!`;
                        addNotification(questCompleteMsg);
                        addActivityLog(questCompleteMsg);
                        if (cq.rewardObject) {
                            if (cq.rewardObject.characterExp) updatedPlayer.exp += cq.rewardObject.characterExp;
                            if (cq.rewardObject.cultivationExp) updatedPlayer.cultivation.lp += cq.rewardObject.cultivationExp;
                            if (cq.rewardObject.linhThach) updatedPlayer.linhThach += cq.rewardObject.linhThach;
                            if (cq.rewardObject.itemId) {
                                const item = masterItemList.find(i => i.id === cq.rewardObject.itemId);
                                if (item) {
                                    updatedPlayer.inventory.push(item);
                                    const rewardItemMsg = `Nhận được phần thưởng nhiệm vụ: ${item.name}`;
                                    addNotification(rewardItemMsg);
                                    addActivityLog(rewardItemMsg);
                                }
                            }
                        }
                    });
                    updatedPlayer.quests = remainingQuests;
                } else {
                    updatedPlayer.quests = questsWithProgress;
                }
                // --- End of Quest Logic ---


                if (p.activeCompanionId && finalCompanionState) {
                    const companionIndex = updatedPlayer.companions.findIndex(c => c.id === p.activeCompanionId);
                    if (companionIndex !== -1) {
                        const companionExpGain = Math.floor(characterExp / 2);
                        updatedPlayer.companions[companionIndex].hp = finalCompanionState.hp;
                        updatedPlayer.companions[companionIndex].mp = finalCompanionState.mp;
                        updatedPlayer.companions[companionIndex].exp += companionExpGain;
                        addNotification(`Đồng hành [${updatedPlayer.companions[companionIndex].name}] nhận được ${companionExpGain} EXP.`);
                    }
                }
                return updatedPlayer;
            });
        } else {
            const failMsg = "Thất bại... Hãy tu luyện thêm.";
            addNotification(failMsg);
            addActivityLog(failMsg);
            setPlayer(p => {
                if (!p) return null;
                const updatedPlayer = { ...p, hp: Math.max(1, finalPlayerHp), mp: finalPlayerMp };
                if (p.activeCompanionId && finalCompanionState) {
                    const companionIndex = updatedPlayer.companions.findIndex(c => c.id === p.activeCompanionId);
                    if (companionIndex !== -1) {
                        updatedPlayer.companions[companionIndex].hp = Math.max(1, finalCompanionState.hp);
                        updatedPlayer.companions[companionIndex].mp = finalCompanionState.mp;
                    }
                }
                return updatedPlayer;
            });
        }
    };
    
    // Inventory and Equipment
    const handleEquipItem = (item: Item) => {
        if (!player || !item.slot) return;
        
        setPlayer(p => {
            if (!p) return null;
            const newEquipped = { ...p.equippedItems };
            const itemIndex = p.inventory.findIndex(invItem => invItem.id === item.id);
            if (itemIndex === -1) return p;
            const newInventory = [...p.inventory];
            newInventory.splice(itemIndex, 1);

            const previouslyEquipped = newEquipped[item.slot!];
            if (previouslyEquipped) {
                newInventory.push(previouslyEquipped);
            }
            
            newEquipped[item.slot!] = item;
            const updatedPlayer = { ...p, inventory: newInventory, equippedItems: newEquipped };
            return calculateTotalStats(updatedPlayer);
        });
        addNotification(`Đã trang bị ${item.name}.`);
    };

    const handleUnequipItem = (slot: EquipmentSlot) => {
        if (!player) return;
        setPlayer(p => {
            if (!p || !p.equippedItems[slot]) return p;
            
            const itemToUnequip = p.equippedItems[slot]!;
            const newEquipped = { ...p.equippedItems };
            delete newEquipped[slot];

            const newInventory = [...p.inventory, itemToUnequip];
            const updatedPlayer = { ...p, inventory: newInventory, equippedItems: newEquipped };
            return calculateTotalStats(updatedPlayer);
        });
         addNotification(`Đã tháo ${player.equippedItems[slot]?.name}.`);
    };

    const handleEquipItemOnCompanion = (companionId: string, item: Item) => {
        if (!player || !item.slot) return;
    
        setPlayer(p => {
            if (!p) return null;
            
            const itemIndexInInventory = p.inventory.findIndex(invItem => invItem.id === item.id);
            if (itemIndexInInventory === -1) return p;
    
            const companionIndex = p.companions.findIndex(c => c.id === companionId);
            if (companionIndex === -1) return p;
    
            const updatedPlayer = JSON.parse(JSON.stringify(p));
            const newInventory = updatedPlayer.inventory;
            const companion = updatedPlayer.companions[companionIndex];
    
            newInventory.splice(itemIndexInInventory, 1);
    
            const previouslyEquipped = companion.equippedItems[item.slot!];
            if (previouslyEquipped) {
                newInventory.push(previouslyEquipped);
            }
    
            companion.equippedItems[item.slot!] = item;
    
            updatedPlayer.companions[companionIndex] = calculateCompanionTotalStats(companion);
            
            addNotification(`Đã trang bị ${item.name} cho ${companion.name}.`);
            return updatedPlayer;
        });
    };
    
    const handleUnequipItemFromCompanion = (companionId: string, slot: EquipmentSlot) => {
        if (!player) return;
    
        setPlayer(p => {
            if (!p) return null;
            
            const companionIndex = p.companions.findIndex(c => c.id === companionId);
            if (companionIndex === -1) return p;
    
            const updatedPlayer = JSON.parse(JSON.stringify(p));
            const companion = updatedPlayer.companions[companionIndex];
            const itemToUnequip = companion.equippedItems[slot];
    
            if (!itemToUnequip) return p;
    
            updatedPlayer.inventory.push(itemToUnequip);
            delete companion.equippedItems[slot];
    
            updatedPlayer.companions[companionIndex] = calculateCompanionTotalStats(companion);
    
            addNotification(`Đã tháo ${itemToUnequip.name} từ ${companion.name}.`);
            return updatedPlayer;
        });
    };

    const handleItemUse = (item: Item) => {
        if (!player) return;
        setPlayer(p => {
            if (!p) return null;
            const itemIndex = p.inventory.findIndex(invItem => invItem.id === item.id);
            if (itemIndex === -1) return p;
            const newInv = [...p.inventory];
            newInv.splice(itemIndex, 1);
            
            let updatedPlayer = { ...p, inventory: newInv };

            if (item.restores?.hp) {
                updatedPlayer.hp = Math.min(p.maxHp, p.hp + item.restores.hp);
            }
             if (item.restores?.mp) {
                updatedPlayer.mp = Math.min(p.maxMp, p.mp + item.restores.mp);
            }
            if(item.expGain) {
                updatedPlayer.cultivation = { ...p.cultivation, lp: p.cultivation.lp + item.expGain };
            }
            if(item.skillId) {
                const skill = SKILLS.find(s => s.id === item.skillId);
                if (skill && !p.skills.some(s => s.id === skill.id)) {
                    addNotification(`Đã học được [${skill.name}]!`);
                    updatedPlayer.skills = [...p.skills, skill];
                } else {
                    addNotification(`Bạn đã biết kỹ năng này.`);
                    return p; // No change if skill is known
                }
            }
            return calculateTotalStats(updatedPlayer);
        });
    };
    
    const handleUseItemInBattle = (itemToUse: Item) => {
        if (!player) return;
        setPlayer(p => {
            if (!p) return null;
            const itemIndex = p.inventory.findIndex(invItem => invItem.id === itemToUse.id);
            if (itemIndex === -1) return p; // Item not found, shouldn't happen
            
            const newInventory = [...p.inventory];
            newInventory.splice(itemIndex, 1);
            
            return { ...p, inventory: newInventory };
        });
    };

    const handleBuyItem = (itemId: string, price: number) => {
        const item = masterItemList.find(i => i.id === itemId);
        if (!player || !item || player.linhThach < price) {
            addNotification("Không đủ Linh Thạch.");
            return;
        };
        setPlayer(p => p ? { ...p, linhThach: p.linhThach - price, inventory: [...p.inventory, item] } : null);
        addNotification(`Đã mua ${item.name}.`);
    };
    
    const handleSellItem = (itemToSell: Item) => {
        if (!player) return;
        
        const sellPrice = Math.floor((itemToSell.value || 0) / 2);
        if (sellPrice <= 0) {
            addNotification(`[${itemToSell.name}] không thể bán.`);
            return;
        }

        setPlayer(p => {
            if (!p) return null;
            const itemIndex = p.inventory.findIndex(invItem => invItem.id === itemToSell.id);
            if (itemIndex === -1) {
                addNotification("Lỗi: Vật phẩm không tồn tại trong túi đồ.");
                return p;
            }
            const newInventory = [...p.inventory];
            newInventory.splice(itemIndex, 1);
            addNotification(`Đã bán [${itemToSell.name}] nhận ${sellPrice} Linh Thạch.`);
            return {
                ...p,
                inventory: newInventory,
                linhThach: p.linhThach + sellPrice
            };
        });
    };
    
    const handleCraftItem = (inputIds: [string, string], outputId: string) => {
        if (!player) return;

        const outputItem = masterItemList.find(i => i.id === outputId);
        if (!outputItem) {
            addNotification("Lỗi: Không tìm thấy vật phẩm chế tạo.");
            return;
        }

        setPlayer(p => {
            if (!p) return null;
            const tempInventory = [...p.inventory];
            
            const index1 = tempInventory.findIndex(item => item.id === inputIds[0]);
            if (index1 !== -1) tempInventory.splice(index1, 1);
    
            const index2 = tempInventory.findIndex(item => item.id === inputIds[1]);
            if (index2 !== -1) tempInventory.splice(index2, 1);
            
            if (index1 !== -1 && index2 !== -1) {
                addNotification(`Chế tạo thành công: [${outputItem.name}]!`);
                return {
                    ...p,
                    inventory: [...tempInventory, outputItem],
                };
            }
            // This case should be handled in the UI, but as a fallback.
            addNotification("Không đủ nguyên liệu.");
            return p;
        });
    };

    const handleReceiveReward = (reward: { characterExp?: number; cultivationExp?: number; linhThach?: number; itemId?: string }) => {
        if (!player) return;
        setPlayer(p => {
            if (!p) return null;
            const updatedPlayer = { ...p };
            let rewardMsg = "Nhận được phần thưởng: ";
            const rewards: string[] = [];
            if (reward.characterExp) {
                updatedPlayer.exp += reward.characterExp;
                rewards.push(`${reward.characterExp} EXP`);
            }
            if (reward.cultivationExp) {
                 updatedPlayer.cultivation.lp += reward.cultivationExp;
                 rewards.push(`${reward.cultivationExp} Linh Lực`);
            }
            if (reward.linhThach) {
                updatedPlayer.linhThach += reward.linhThach;
                rewards.push(`${reward.linhThach} Linh Thạch`);
            }
            if (reward.itemId) {
                const item = masterItemList.find(i => i.id === reward.itemId);
                if (item) {
                    updatedPlayer.inventory.push(item);
                    addNotification(`Nhận được: ${item.name}`);
                    rewards.push(item.name);
                }
            }
            addActivityLog(rewardMsg + rewards.join(', ') + '.');
            return updatedPlayer;
        });
    };

    const handleActivateFormation = (tranPhap: TranPhap) => {
        if (!player) return;
        setPlayer(p => {
            if (!p) return null;
            const updatedPlayer = { ...p, activeTranPhap: tranPhap.id === p.activeTranPhap?.id ? null : tranPhap };
            return calculateTotalStats(updatedPlayer);
        });
        addNotification(player.activeTranPhap?.id === tranPhap.id ? `Đã hủy ${tranPhap.name}.` : `Đã kích hoạt ${tranPhap.name}.`);
    };

    const handleActivateCultivationMethod = (methodId: string) => {
        if (!player) return;

        const methodToActivate = CULTIVATION_METHODS_LIST.find(m => m.id === methodId);
        if (!methodToActivate) return;

        setPlayer(p => {
            if (!p) return null;
            const isDeactivating = p.activeCultivationMethod?.id === methodId;
            const updatedPlayer = { ...p, activeCultivationMethod: isDeactivating ? null : methodToActivate };
            addNotification(
                isDeactivating 
                ? `Đã ngừng vận hành [${methodToActivate.name}].` 
                : `Bắt đầu vận hành [${methodToActivate.name}].`
            );
            return calculateTotalStats(updatedPlayer);
        });
    };

    const handleSpendPotentialPoint = (stat: keyof PotentialStats) => {
        if (!player || player.potentialPoints <= 0) return;
        setPlayer(p => {
            if (!p) return null;
            const updatedPlayer = { 
                ...p, 
                potentialPoints: p.potentialPoints - 1, 
                basePotentialStats: { ...p.basePotentialStats, [stat]: p.basePotentialStats[stat] + 1 } 
            };
            return calculateTotalStats(updatedPlayer);
        });
    };

    const handleEnterArea = (area: WorldMapArea) => {
        setCurrentArea(area);
        setActivePanel('character');
    };

    const handleAcceptQuest = (quest: Quest) => {
        if (!player) return;
        if (player.quests.some(q => q.id === quest.id)) {
            addNotification("Bạn đã có nhiệm vụ này rồi.");
            return;
        }
        setPlayer(p => p ? { ...p, quests: [...p.quests, quest] } : null);
        const questMsg = `Đã nhận nhiệm vụ: ${quest.title}`;
        addNotification(questMsg);
        addActivityLog(questMsg);
    };
    
    const handleUpdatePlayerDetails = (details: { name?: string; hairStyle?: number; eyeColor?: 'Đen' | 'Trắng' }) => {
        if (!player) return;
        setPlayer(p => {
            if (!p) return null;
            const updatedPlayer = { ...p, ...details };
            if (details.name !== undefined || details.hairStyle !== undefined || details.eyeColor !== undefined) {
                updatedPlayer.avatarUrl = `https://api.multiavatar.com/${(details.name ?? p.name).trim()}-${details.hairStyle ?? p.hairStyle}-${details.eyeColor ?? p.eyeColor}.png`;
            }
            return updatedPlayer;
        });
        addNotification("Thông tin nhân vật đã được cập nhật.");
    };

    const handleUpdateNpcDetails = (npcId: string, details: { hairStyle?: number; eyeColor?: 'Đen' | 'Trắng' }) => {
        setNpcList(prevNpcList => {
            return prevNpcList.map(npc => {
                if (npc.id === npcId) {
                    const updatedNpc = { ...npc, ...details };
                    updatedNpc.avatarUrl = `https://api.multiavatar.com/${updatedNpc.name.trim()}-${updatedNpc.hairStyle}-${updatedNpc.eyeColor}.png`;
                    return updatedNpc;
                }
                return npc;
            });
        });
        addNotification("Đã cập nhật ngoại hình NPC.");
    };
    
    const handleAdminAddItem = (itemToAdd: Item) => {
        if (!player) return;
        setPlayer(p => {
            if (!p) return null;
            addNotification(`[ADMIN] Đã thêm: ${itemToAdd.name}`);
            return {
                ...p,
                inventory: [...p.inventory, itemToAdd],
            };
        });
    };

    const handleAdminLearnSkill = (skillToLearn: Skill) => {
        if (!player) return;
        setPlayer(p => {
            if (!p) return null;
            if (p.skills.some(s => s.id === skillToLearn.id)) {
                addNotification(`[ADMIN] Bạn đã biết kỹ năng [${skillToLearn.name}].`);
                return p;
            }
            addNotification(`[ADMIN] Đã học: ${skillToLearn.name}`);
            const updatedPlayer = { ...p, skills: [...p.skills, skillToLearn] };
            return calculateTotalStats(updatedPlayer); // Recalculate for passives
        });
    };
    
    const handleAdminCreateItem = (itemToAdd: Item) => {
        setMasterItemList(prev => [...prev, itemToAdd]);
        // Also add it directly to the player's inventory
        handleAdminAddItem(itemToAdd);
        addNotification(`[ADMIN] Đã tạo và thêm: ${itemToAdd.name}`);
    };

    const handleAdminCreateMonster = (monsterToAdd: Monster) => {
        setMasterMonsterList(prev => [...prev, monsterToAdd]);
        addNotification(`[ADMIN] Đã tạo quái vật: ${monsterToAdd.name}`);
    };

    const handleRedeemGiftcode = (code: string) => {
        if (!player) return;
    
        let rewardGiven = false;
        let rewardMessage = "";
        let playerAfterUpdate: Player | null = null;
    
        if (code.toUpperCase() === 'TANTHU2024') {
            const rewardItem = masterItemList.find(i => i.id === 'item_006'); // Luyện Khí Tán
            if (rewardItem) {
                setPlayer(p => {
                    if (!p) return null;
                    const newInv = [...p.inventory, rewardItem, rewardItem, rewardItem];
                    return { ...p, inventory: newInv };
                });
                rewardMessage = "Đổi mã thành công! Nhận được 3x Luyện Khí Tán.";
                rewardGiven = true;
            }
        }
    
        if (code.toUpperCase() === 'ADMIN2410') {
            setIsAdmin(true);
            rewardMessage = "Chế độ ADMIN đã được mở khóa!";
            rewardGiven = true;
        }

        if (code.toUpperCase() === 'NQT2410') {
            const highestTierWeapon = masterItemList.find(i => i.rarity === 'Thần Thoại' && i.type === 'Vũ khí');
            const highestTierSkillBooks = masterItemList.filter(i => i.type === 'Sách Kỹ Năng' && i.rarity === 'Thần Thoại');
    
            const itemsToAdd: Item[] = [];
            if (highestTierWeapon) {
                itemsToAdd.push(highestTierWeapon);
            }
            itemsToAdd.push(...highestTierSkillBooks);
    
            const tempPlayer = {
                ...player,
                exp: player.exp + 9999999,
                cultivation: { ...player.cultivation, lp: player.cultivation.lp + 999999 },
                linhThach: player.linhThach + 99999,
                inventory: [...player.inventory, ...itemsToAdd]
            };
            
            const { finalPlayer, notifications } = processLevelUps(tempPlayer);
            notifications.forEach(addNotification);
            playerAfterUpdate = finalPlayer;

            rewardMessage = "Đổi mã NQT2410 thành công! Bạn nhận được phần thưởng cực lớn!";
            rewardGiven = true;
        }

        if (code.toUpperCase() === 'EXP111') {
            const tempPlayer = {
                ...player,
                exp: player.exp + 99999999999,
                cultivation: { ...player.cultivation, lp: player.cultivation.lp + 99999999999 },
            };
            
            const { finalPlayer, notifications } = processLevelUps(tempPlayer);
            notifications.forEach(addNotification);
            playerAfterUpdate = finalPlayer;

            rewardMessage = "Đổi mã EXP111 thành công! Bạn nhận được một lượng lớn EXP và Linh Lực!";
            rewardGiven = true;
        }

        if (code.toUpperCase() === 'SKILL50') {
            const allSkillsMap = new Map<string, Skill>();
            player.skills.forEach(skill => allSkillsMap.set(skill.id, skill));
            SKILLS.forEach(skill => allSkillsMap.set(skill.id, skill));
            
            const updatedSkills = Array.from(allSkillsMap.values());
            const updatedPlayer = { ...player, skills: updatedSkills };
            
            playerAfterUpdate = calculateTotalStats(updatedPlayer);

            rewardMessage = "Mã SKILL50 thành công! Bạn đã học được tất cả kỹ năng trong trò chơi!";
            rewardGiven = true;
        }
    
        if (playerAfterUpdate) {
            setPlayer(playerAfterUpdate);
        }

        if (rewardGiven) {
            addNotification(rewardMessage);
            addActivityLog(rewardMessage);
        } else {
            addNotification("Mã quà tặng không hợp lệ hoặc đã hết hạn.");
        }
    };

    const handleSetActiveCompanion = (companionId: string | null) => {
        if (!player) return;
        const comp = player.companions.find(c => c.id === companionId);
        
        if (companionId && player.activeCompanionId === companionId) {
            // Deactivate
            setPlayer(p => p ? { ...p, activeCompanionId: null } : null);
            addNotification(`Đồng hành [${comp?.name}] đã nghỉ ngơi.`);
        } else {
            // Activate
            setPlayer(p => p ? { ...p, activeCompanionId: companionId } : null);
             if(comp) addNotification(`Đồng hành [${comp.name}] đã được triệu hồi!`);
        }
    };
    
    // World Map Interactive Event Handlers
    const handleFindHiddenTreasure = (treasureId: string) => {
        if (!player || player.foundTreasures.includes(treasureId)) {
            addNotification("Bạn đã khám phá nơi này rồi.");
            return;
        }
        const treasureItem = masterItemList.find(i => i.id === 'item_014'); // Linh Hồn Thạch
        if (!treasureItem) return;

        setPlayer(p => {
            if (!p) return null;
            return {
                ...p,
                inventory: [...p.inventory, treasureItem],
                linhThach: p.linhThach + 200,
                foundTreasures: [...p.foundTreasures, treasureId],
            };
        });
        const treasureMsg = `Bạn tìm thấy một rương cũ: nhận [${treasureItem.name}] và 200 Linh Thạch!`;
        addNotification(treasureMsg);
        addActivityLog(treasureMsg);
    };
    
    const handleSeekEnlightenment = (enlightenmentId: string) => {
        if (!player || player.foundTreasures.includes(enlightenmentId)) {
            addNotification("Tiên nhân đã chỉ điểm cho bạn rồi.");
            return;
        }
         setPlayer(p => {
            if (!p) return null;
            return {
                ...p,
                cultivation: { ...p.cultivation, lp: p.cultivation.lp + 500 },
                foundTreasures: [...p.foundTreasures, enlightenmentId],
            };
        });
        const enlightenMsg = "Tiên nhân mỉm cười và truyền cho bạn linh lực. Tu vi tăng lên!";
        addNotification(enlightenMsg);
        addActivityLog(enlightenMsg);
    };

    const handleSearchForHerbs = (herbId: string) => {
        if (!player || player.foundTreasures.includes(herbId)) {
            addNotification("Bạn đã tìm hết linh thảo ở đây.");
            return;
        }
        const herbItem = masterItemList.find(i => i.id === 'item_006'); // Luyện Khí Tán
        if (!herbItem) return;

        setPlayer(p => {
            if (!p) return null;
            return {
                ...p,
                inventory: [...p.inventory, herbItem, herbItem],
                foundTreasures: [...p.foundTreasures, herbId],
            };
        });
        const herbMsg = `Bạn tìm thấy một gốc linh thảo quý, nhận 2x [${herbItem.name}]!`;
        addNotification(herbMsg);
        addActivityLog(herbMsg);
    };

    if (!player) {
        return <CharacterCreationScreen onCharacterCreate={handleCharacterCreate} />;
    }
    
    const activeCompanion = player.companions.find(c => c.id === player.activeCompanionId) || null;

    return (
        <div className="bg-cover bg-center bg-fixed h-screen w-screen text-white font-sans" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/glowing-spaceship-orbits-planet-starry-galaxy-generated-by-ai_188544-9655.jpg')" }}>
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative h-full w-full flex flex-col p-4 gap-4">
                
                {currentMonster && <BattleScreen player={player} activeCompanion={activeCompanion} monster={currentMonster} onBattleEnd={handleBattleEnd} isMuted={isMuted} onUseItem={handleUseItemInBattle} />}
                {isBlacksmithOpen && <BlacksmithPanel player={player} onClose={() => setIsBlacksmithOpen(false)} onBuyItem={handleBuyItem} onSellItem={handleSellItem} onCraftItem={handleCraftItem} onNotify={addNotification} masterItemList={masterItemList} />}
                {isSettingsOpen && <SettingsPanel 
                    player={player} 
                    onClose={() => setIsSettingsOpen(false)} 
                    isMuted={isMuted} 
                    onToggleMute={() => setIsMuted(!isMuted)} 
                    onUpdatePlayerDetails={handleUpdatePlayerDetails} 
                    onRedeemGiftcode={handleRedeemGiftcode} 
                    isAdmin={isAdmin} 
                    // FIX: Changed `onAdminAddItem` to `handleAdminAddItem` to pass the correct function prop.
                    onAdminAddItem={handleAdminAddItem} 
                    // FIX: Changed `onAdminLearnSkill` to `handleAdminLearnSkill` to pass the correct function prop.
                    onAdminLearnSkill={handleAdminLearnSkill} 
                    onAdminCreateItem={handleAdminCreateItem} 
                    onAdminCreateMonster={handleAdminCreateMonster} 
                    masterItemList={masterItemList}
                    isBottomNavBarVisible={isBottomNavBarVisible}
                    onToggleBottomNavBar={() => setIsBottomNavBarVisible(p => !p)}
                />}
                {newMonsterPrompt && (
                    <AddNewMonsterModal
                        promptData={newMonsterPrompt}
                        onConfirm={handleConfirmAddMonster}
                        onCancel={() => setNewMonsterPrompt(null)}
                    />
                )}
                 {isLogVisible && <ActivityLogPanel logs={activityLog} onClose={() => setIsLogVisible(false)} />}

                <header className="flex-shrink-0">
                    <StatusBar player={player} onAvatarClick={() => setIsSettingsOpen(true)} onToggleLog={() => setIsLogVisible(prev => !prev)} isLogVisible={isLogVisible}/>
                </header>
                
                <main className="flex-grow bg-black/60 border border-gray-700 rounded-lg p-4 backdrop-blur-sm relative overflow-hidden">
                    
                    {currentArea ? (
                        <AreaDetailPanel 
                            area={currentArea} 
                            player={player}
                            masterMonsterList={masterMonsterList}
                            npcList={npcList}
                            onLeaveArea={() => setCurrentArea(null)}
                            onStartBattle={handleStartBattle}
                            onAcceptQuest={handleAcceptQuest}
                            onNotify={addNotification}
                            onOpenBlacksmith={() => setIsBlacksmithOpen(true)}
                            // FIX: Corrected a typo, passing `handleUpdateNpcDetails` to the `onUpdateNpcDetails` prop instead of the undefined `onUpdateNpcDetails`.
                            onUpdateNpcDetails={handleUpdateNpcDetails}
                        />
                    ) : (
                        <MainContentArea
                            activePanel={activePanel}
                            player={player}
                            isCultivating={isCultivating}
                            setIsCultivating={setIsCultivating}
                            cultivationBonus={cultivationBonus}
                            onCultivate={handleCultivate}
                            isMeditating={isMeditating}
                            setIsMeditating={setIsMeditating}
                            onMeditate={handleMeditate}
                            onStartBattle={handleStartBattle}
                            onReceiveReward={handleReceiveReward}
                            onActivateFormation={handleActivateFormation}
                            onActivateCultivationMethod={handleActivateCultivationMethod}
                            onSpendPotentialPoint={handleSpendPotentialPoint}
                            onEquipItem={handleEquipItem}
                            onUnequipItem={handleUnequipItem}
                            onItemUse={handleItemUse}
                            onBuyItem={handleBuyItem}
                            onNotify={addNotification}
                            onEnterArea={handleEnterArea}
                            onSetActiveCompanion={handleSetActiveCompanion}
                            onEquipItemOnCompanion={handleEquipItemOnCompanion}
                            onUnequipItemFromCompanion={handleUnequipItemFromCompanion}
                            onFindHiddenTreasure={handleFindHiddenTreasure}
                            onSeekEnlightenment={handleSeekEnlightenment}
                            onSearchForHerbs={handleSearchForHerbs}
                            masterItemList={masterItemList}
                        />
                    )}
                </main>
                
                {isBottomNavBarVisible && (
                    <footer className="flex-shrink-0">
                        <BottomNavBar activePanel={activePanel} onPanelChange={setActivePanel} />
                    </footer>
                )}

                <div className="absolute bottom-24 right-4 space-y-2 z-50">
                    {notifications.map((msg, i) => (
                        <div key={i} className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg animate-fadeIn">{msg}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;