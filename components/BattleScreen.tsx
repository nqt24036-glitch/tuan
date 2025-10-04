import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Player, Monster, CombatStats, CombatLogEntry, Skill, Companion, Item } from '../types.ts';
import { AutoIcon, SparklesIcon, SwordIcon } from './IconComponents.tsx';
import { playSound } from '../utils/audio.ts';
import CombatEffect from './CombatEffect.tsx';
import CharacterDetailPopup from './CharacterDetailPopup.tsx';

interface BattleScreenProps {
  player: Player;
  activeCompanion: Companion | null;
  monster: Monster;
  onBattleEnd: (victory: boolean, finalPlayerHp: number, finalPlayerMp: number, finalCompanionState: { hp: number; mp: number } | null, monsterDefeated: Monster | null) => void;
  isMuted: boolean;
  onUseItem: (item: Item) => void;
}

type TurnActor = 'player' | 'companion' | 'monster';

const calculateDamage = (attacker: { stats: CombatStats, name: string }, defender: { stats: CombatStats }, skill: Skill | null) => {
    const hitChance = attacker.stats.accuracy - defender.stats.evasion;
    if (Math.random() > hitChance) {
        return { damage: 0, isMiss: true, isCrit: false, isBlock: false };
    }

    const isMagic = skill?.damage ? false : attacker.stats.magicAttack > attacker.stats.attack;
    const baseDamage = skill?.damage ? attacker.stats.attack + skill.damage : (isMagic ? attacker.stats.magicAttack : attacker.stats.attack);
    const defense = isMagic ? defender.stats.magicDefense : defender.stats.defense;
    const armorPen = attacker.stats.armorPen;
    const effectiveDefense = defense * (1 - armorPen);
    let calculatedDamage = Math.max(1, baseDamage - effectiveDefense);

    let isCrit = false;
    if (Math.random() < attacker.stats.critRate) {
        isCrit = true;
        calculatedDamage *= attacker.stats.critDamage;
    }
    
    let isBlock = false;
    if (!isCrit && Math.random() < defender.stats.blockRate) {
        isBlock = true;
        calculatedDamage *= 0.5;
    }

    return { damage: Math.round(calculatedDamage), isMiss: false, isCrit, isBlock };
};

const BattleScreen: React.FC<BattleScreenProps> = ({ player, activeCompanion, monster, onBattleEnd, isMuted, onUseItem }) => {
  const [playerState, setPlayerState] = useState({ hp: player.hp, mp: player.mp });
  const [companionState, setCompanionState] = useState(activeCompanion ? { hp: activeCompanion.hp, mp: activeCompanion.mp } : null);
  const [monsterHp, setMonsterHp] = useState(monster.hp);
  const [monsterStats, setMonsterStats] = useState(monster.stats);
  const [log, setLog] = useState<CombatLogEntry[]>([]);
  const [currentTurn, setCurrentTurn] = useState<TurnActor | null>(null);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [playerHitAnim, setPlayerHitAnim] = useState(false);
  const [companionHitAnim, setCompanionHitAnim] = useState(false);
  const [monsterHitAnim, setMonsterHitAnim] = useState(false);
  const [activeEffects, setActiveEffects] = useState<{ id: number; type: string; target: 'player' | 'monster' | 'companion' }[]>([]);
  const [isAutoBattle, setIsAutoBattle] = useState(false);
  const [autoSkills, setAutoSkills] = useState<Set<string>>(new Set());
  const [inspectingCharacter, setInspectingCharacter] = useState<Player | Companion | Monster | null>(null);
  const [showItemPanel, setShowItemPanel] = useState(false);
  
  const logRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const companionRef = useRef<HTMLDivElement>(null);
  const monsterRef = useRef<HTMLDivElement>(null);

  const turnOrder = useMemo(() => {
    const combatants: { name: TurnActor; speed: number }[] = [
      { name: 'player', speed: player.totalStats.speed },
      { name: 'monster', speed: monster.stats.speed },
    ];
    if (activeCompanion) {
      combatants.push({ name: 'companion', speed: activeCompanion.totalStats.speed });
    }
    return combatants.sort((a, b) => b.speed - a.speed).map(c => c.name);
  }, [player.totalStats.speed, monster.stats.speed, activeCompanion]);

  const consumableItems = useMemo(() => {
    const itemMap = new Map<string, { item: Item; count: number }>();
    player.inventory
        .filter(i => i.type === 'Tiêu hao' && i.restores)
        .forEach(item => {
            if (itemMap.has(item.id)) {
                itemMap.get(item.id)!.count++;
            } else {
                itemMap.set(item.id, { item, count: 1 });
            }
        });
    return Array.from(itemMap.values());
  }, [player.inventory]);

  const addLog = useCallback((entry: Omit<CombatLogEntry, 'isPlayerActor'>) => {
    setLog(prev => [...prev, { ...entry, isPlayerActor: entry.actor === player.name || entry.actor === activeCompanion?.name }]);
  }, [player.name, activeCompanion?.name]);

  const advanceTurn = useCallback(() => {
    if (isBattleOver) return;
    const currentTurnIndex = turnOrder.indexOf(currentTurn!);
    const nextTurnIndex = (currentTurnIndex + 1) % turnOrder.length;
    setCurrentTurn(turnOrder[nextTurnIndex]);
  }, [currentTurn, turnOrder, isBattleOver]);

  useEffect(() => {
    addLog({ actor: monster.name, action: 'xuất hiện!', target: '' });
    setCurrentTurn(turnOrder[0]);
    addLog({ actor: 'Hệ thống', action: `Lượt của ${turnOrder[0]} đi trước!`, target: '' });
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);
  
  const handlePlayerAction = useCallback((skill: Skill | null) => {
    if (currentTurn !== 'player' || isBattleOver) return;

    if (skill && playerState.mp < (skill.mpCost ?? 0)) {
        addLog({ actor: player.name, action: 'không đủ MP!', target: ''});
        return;
    }
    
    if (skill) {
        setPlayerState(prev => ({ ...prev, mp: prev.mp - (skill.mpCost ?? 0) }));
        playSound(skill.soundEffectUrl, isMuted);
    } else {
        playSound("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAZGF0YQAAAAA=", isMuted);
    }
    
    if (skill?.heal) {
        setPlayerHitAnim(true); setTimeout(() => setPlayerHitAnim(false), 300);
        const newHp = Math.min(player.maxHp, playerState.hp + skill.heal);
        addLog({ actor: player.name, action: `hồi phục ${skill.heal} HP!`, target: '' });
        setPlayerState(prev => ({ ...prev, hp: newHp }));
        if (skill.visualEffect) setActiveEffects(prev => [...prev, { id: Date.now(), type: skill.visualEffect!, target: 'player' }]);
        advanceTurn();
        return;
    }

    const result = calculateDamage({ stats: player.totalStats, name: player.name }, { stats: monsterStats }, skill);
    setMonsterHitAnim(true); setTimeout(() => setMonsterHitAnim(false), 300);
    if (skill?.visualEffect) setActiveEffects(prev => [...prev, { id: Date.now(), type: skill.visualEffect!, target: 'monster' }]);
    
    addLog({ actor: player.name, action: 'tấn công', target: monster.name, ...result, skillName: skill?.name });

    const newMonsterHp = monsterHp - result.damage;
    if (newMonsterHp <= 0) {
      setMonsterHp(0);
      addLog({ actor: monster.name, action: 'đã bị đánh bại!', target: ''});
      setIsBattleOver(true);
      setTimeout(() => onBattleEnd(true, playerState.hp, playerState.mp, companionState, monster), 1500);
    } else {
      setMonsterHp(newMonsterHp);
      advanceTurn();
    }
  }, [currentTurn, isBattleOver, playerState, monsterHp, addLog, advanceTurn, player, monster, onBattleEnd, isMuted, companionState, monsterStats]);
  
  const handleItemUse = (item: Item) => {
    if (currentTurn !== 'player' || isBattleOver) return;

    onUseItem(item);

    const hpRestored = item.restores?.hp ?? 0;
    const mpRestored = item.restores?.mp ?? 0;

    const newHp = Math.min(player.maxHp, playerState.hp + hpRestored);
    const newMp = Math.min(player.maxMp, playerState.mp + mpRestored);

    setPlayerState({ hp: newHp, mp: newMp });

    let logMessage = `dùng [${item.name}]`;
    if(hpRestored > 0) logMessage += ` hồi phục ${hpRestored} HP`;
    if(mpRestored > 0) logMessage += `${hpRestored > 0 ? ' và' : ''} hồi phục ${mpRestored} MP`;
    
    addLog({ actor: player.name, action: logMessage, target: ''});
    
    setPlayerHitAnim(true); setTimeout(() => setPlayerHitAnim(false), 300);
    setActiveEffects(prev => [...prev, { id: Date.now(), type: 'heal', target: 'player' }]);
    playSound("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABgAZGF0YQAAAAA=", isMuted);
    setShowItemPanel(false);
    advanceTurn();
  };

  // Auto-battle logic
  const autoBattleLogic = useCallback(() => {
    const playerActiveSkills = player.skills.filter(s => s.type === 'Chủ Động');
    let actionTaken = false;
    for (const skill of playerActiveSkills) {
        if (autoSkills.has(skill.id) && playerState.mp >= (skill.mpCost ?? 0)) {
            handlePlayerAction(skill);
            actionTaken = true;
            break;
        }
    }
    if (!actionTaken) handlePlayerAction(null);
  }, [player.skills, autoSkills, playerState.mp, handlePlayerAction]);

  useEffect(() => {
      if (isAutoBattle && currentTurn === 'player' && !isBattleOver) {
          const timeoutId = setTimeout(autoBattleLogic, 1000);
          return () => clearTimeout(timeoutId);
      }
  }, [isAutoBattle, currentTurn, isBattleOver, autoBattleLogic]);

  // Companion turn logic
  useEffect(() => {
    if (currentTurn !== 'companion' || !activeCompanion || !companionState || isBattleOver) return;

    const companionTurnTimeout = setTimeout(() => {
        const healSkill = activeCompanion.skills.find(s => s.heal && s.type === 'Chủ Động');
        const attackSkills = activeCompanion.skills.filter(s => s.damage && s.type === 'Chủ Động');
        let actionTaken = false;

        // AI Priority 1: Heal player if critical
        if (healSkill && playerState.hp < player.maxHp * 0.3 && companionState.mp >= (healSkill.mpCost ?? 0)) {
            setPlayerHitAnim(true); setTimeout(() => setPlayerHitAnim(false), 300);
            const newPlayerHp = Math.min(player.maxHp, playerState.hp + healSkill.heal!);
            const newCompanionMp = companionState.mp - (healSkill.mpCost ?? 0);
            
            addLog({ actor: activeCompanion.name, action: `dùng [${healSkill.name}] trị liệu cho`, target: player.name });
            
            setPlayerState(prev => ({...prev, hp: newPlayerHp}));
            setCompanionState({ ...companionState, mp: newCompanionMp });

            if (healSkill.visualEffect) setActiveEffects(prev => [...prev, { id: Date.now(), type: healSkill.visualEffect!, target: 'player' }]);
            actionTaken = true;
        } 
        // AI Priority 2: Heal self if low
        else if (healSkill && companionState.hp < activeCompanion.maxHp * 0.5 && companionState.mp >= (healSkill.mpCost ?? 0)) {
            setCompanionHitAnim(true); setTimeout(() => setCompanionHitAnim(false), 300);
            const newHp = Math.min(activeCompanion.maxHp, companionState.hp + healSkill.heal!);
            const newMp = companionState.mp - (healSkill.mpCost ?? 0);
            addLog({ actor: activeCompanion.name, action: `dùng [${healSkill.name}] tự hồi phục ${healSkill.heal} HP!`, target: '' });
            setCompanionState({ hp: newHp, mp: newMp });
            if (healSkill.visualEffect) setActiveEffects(prev => [...prev, { id: Date.now(), type: healSkill.visualEffect!, target: 'companion' }]);
            actionTaken = true;
        }
        // AI Priority 3: Use an offensive skill
        else if (attackSkills.length > 0) {
            const skillToUse = attackSkills.find(s => companionState.mp >= (s.mpCost ?? 0));
            if(skillToUse) {
                const result = calculateDamage({ stats: activeCompanion.totalStats, name: activeCompanion.name }, { stats: monsterStats }, skillToUse);
                setMonsterHitAnim(true); setTimeout(() => setMonsterHitAnim(false), 300);
                if (skillToUse.visualEffect) setActiveEffects(prev => [...prev, { id: Date.now(), type: skillToUse.visualEffect!, target: 'monster' }]);
                
                addLog({ actor: activeCompanion.name, action: 'tấn công', target: monster.name, ...result, skillName: skillToUse.name });
                setCompanionState(prev => prev ? ({...prev, mp: prev.mp - (skillToUse.mpCost ?? 0)}) : null);

                const newMonsterHp = monsterHp - result.damage;
                if (newMonsterHp <= 0) {
                    setMonsterHp(0);
                    addLog({ actor: monster.name, action: 'đã bị đánh bại!', target: ''});
                    setIsBattleOver(true);
                    setTimeout(() => onBattleEnd(true, playerState.hp, playerState.mp, companionState, monster), 1500);
                    return;
                } else {
                    setMonsterHp(newMonsterHp);
                }
                actionTaken = true;
            }
        }

        // AI Priority 4: Basic Attack
        if (!actionTaken) {
            const result = calculateDamage({ stats: activeCompanion.totalStats, name: activeCompanion.name }, { stats: monsterStats }, null);
            setMonsterHitAnim(true); setTimeout(() => setMonsterHitAnim(false), 300);
            addLog({ actor: activeCompanion.name, action: 'tấn công', target: monster.name, ...result });
            const newMonsterHp = monsterHp - result.damage;
            if (newMonsterHp <= 0) {
                setMonsterHp(0);
                addLog({ actor: monster.name, action: 'đã bị đánh bại!', target: ''});
                setIsBattleOver(true);
                setTimeout(() => onBattleEnd(true, playerState.hp, playerState.mp, companionState, monster), 1500);
                return;
            } else {
                setMonsterHp(newMonsterHp);
            }
        }
        
        advanceTurn();
    }, 1000);
    return () => clearTimeout(companionTurnTimeout);
  }, [currentTurn, isBattleOver, activeCompanion, companionState, monsterHp, addLog, advanceTurn, player, playerState, monsterStats]);

  // Monster Turn Logic
  useEffect(() => {
    if (currentTurn !== 'monster' || isBattleOver) return;

    const monsterTurnTimeout = setTimeout(() => {
        const targetIsCompanion = activeCompanion && companionState && companionState.hp > 0 && Math.random() > 0.5;
        const target = targetIsCompanion ? { stats: activeCompanion!.totalStats, name: activeCompanion!.name } : { stats: player.totalStats, name: player.name };

        let skillToUse: Skill | null = null;
        const availableSkills = monster.skills?.filter(s => s.type === 'Chủ Động') || [];

        // --- AI Decision Logic (Priority-based) ---
        // 1. Heal/Lifesteal if low HP
        const lifestealSkill = availableSkills.find(s => s.id === 'mskill_006');
        if (lifestealSkill && monsterHp < monster.hp * 0.5) {
            skillToUse = lifestealSkill;
        } else {
            // 2. Buff if not already buffed
            const buffSkill = availableSkills.find(s => s.passiveBonus);
            if (buffSkill) {
                const isAlreadyBuffed = Object.keys(buffSkill.passiveBonus!).some(
                    stat => monsterStats[stat as keyof CombatStats] > monster.stats[stat as keyof CombatStats]
                );
                if (!isAlreadyBuffed && Math.random() < 0.8) {
                    skillToUse = buffSkill;
                }
            }

            // 3. Use a standard offensive skill if no other priority action was taken
            if (!skillToUse) {
                const offensiveSkills = availableSkills.filter(s => s.damage && !s.passiveBonus);
                if (offensiveSkills.length > 0 && Math.random() < 0.6) {
                    skillToUse = offensiveSkills[Math.floor(Math.random() * offensiveSkills.length)];
                }
            }
        }

        // --- Execute Action ---
        if (skillToUse) {
            // Handle Buffs
            if (skillToUse.passiveBonus) {
                setMonsterStats(prevStats => {
                    const newStats = { ...prevStats };
                    for (const [stat, value] of Object.entries(skillToUse!.passiveBonus!)) {
                        newStats[stat as keyof CombatStats] += value;
                    }
                    return newStats;
                });
                addLog({ actor: monster.name, action: `dùng [${skillToUse.name}] và trở nên mạnh hơn!`, target: '' });
            } 
            // Handle Damage Skills
            else {
                const result = calculateDamage({ stats: monsterStats, name: monster.name }, target, skillToUse);
                addLog({ actor: monster.name, action: `dùng [${skillToUse.name}] tấn công`, target: target.name, ...result });

                // Special logic for lifesteal
                if (skillToUse.id === 'mskill_006') {
                    const healAmount = Math.round(result.damage * 0.5);
                    setMonsterHp(prev => Math.min(monster.hp, prev + healAmount));
                    addLog({ actor: monster.name, action: `hồi phục ${healAmount} HP!`, target: '' });
                }

                // Apply damage to target
                if (targetIsCompanion && companionState) {
                    setCompanionHitAnim(true); setTimeout(() => setCompanionHitAnim(false), 300);
                    const newCompanionHp = companionState.hp - result.damage;
                    setCompanionState(prev => prev ? ({ ...prev, hp: newCompanionHp }) : null);
                    if (newCompanionHp <= 0) addLog({ actor: activeCompanion!.name, action: 'đã gục ngã!', target: '' });
                } else {
                    setPlayerHitAnim(true); setTimeout(() => setPlayerHitAnim(false), 300);
                    const newPlayerHp = playerState.hp - result.damage;
                    setPlayerState(prev => ({ ...prev, hp: newPlayerHp }));
                    if (newPlayerHp <= 0) {
                        addLog({ actor: player.name, action: 'đã bị đánh bại!', target: ''});
                        setIsBattleOver(true);
                        setTimeout(() => onBattleEnd(false, 0, playerState.mp, companionState, monster), 1500);
                        return;
                    }
                }
            }
        } 
        // Basic Attack if no skill was chosen
        else {
            const result = calculateDamage({ stats: monsterStats, name: monster.name }, target, null);
            addLog({ actor: monster.name, action: 'tấn công', target: target.name, ...result });

            if (targetIsCompanion && companionState) {
                setCompanionHitAnim(true); setTimeout(() => setCompanionHitAnim(false), 300);
                const newCompanionHp = companionState.hp - result.damage;
                setCompanionState(prev => prev ? ({ ...prev, hp: newCompanionHp }) : null);
                if (newCompanionHp <= 0) addLog({ actor: activeCompanion!.name, action: 'đã gục ngã!', target: '' });
            } else {
                setPlayerHitAnim(true); setTimeout(() => setPlayerHitAnim(false), 300);
                const newPlayerHp = playerState.hp - result.damage;
                setPlayerState(prev => ({ ...prev, hp: newPlayerHp }));
                if (newPlayerHp <= 0) {
                    addLog({ actor: player.name, action: 'đã bị đánh bại!', target: ''});
                    setIsBattleOver(true);
                    setTimeout(() => onBattleEnd(false, 0, playerState.mp, companionState, monster), 1500);
                    return;
                }
            }
        }
        advanceTurn();
    }, 1000);
    return () => clearTimeout(monsterTurnTimeout);
}, [currentTurn, isBattleOver, addLog, monster, monsterHp, monsterStats, onBattleEnd, player, playerState, activeCompanion, companionState, advanceTurn]);


  const StatBar: React.FC<{ name: string, current: number, max: number, color: string, mp?: number, maxMp?: number }> = ({ name, current, max, color, mp, maxMp }) => (
    <div className="w-32">
        <div className="flex justify-between items-end mb-1">
            <span className="font-bold text-base text-white truncate">{name}</span>
            <span className="text-xs font-mono text-gray-300">{current}/{max}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-800">
            <div className={`${color} h-full rounded-full transition-all duration-500`} style={{width: `${(current/max) * 100}%`}}></div>
        </div>
        {mp !== undefined && maxMp !== undefined && (
             <div className="w-full bg-gray-700 rounded-full h-3 border border-gray-800 mt-1">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{width: `${(mp/maxMp) * 100}%`}}></div>
            </div>
        )}
    </div>
  );

  const ItemPanel: React.FC = () => (
    <div className="absolute inset-x-0 bottom-0 top-auto bg-gray-800/90 border-t-2 border-yellow-500 p-4 rounded-t-lg z-20 animate-fadeInUp">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-yellow-300">Dược Phẩm</h3>
            <button onClick={() => setShowItemPanel(false)} className="font-bold text-xl">&times;</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
            {consumableItems.length > 0 ? consumableItems.map(({ item, count }) => (
                <button 
                    key={item.id} 
                    onClick={() => handleItemUse(item)}
                    className="flex items-center gap-2 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-left"
                >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                        <p className="font-semibold text-sm">{item.name} <span className="text-yellow-400">x{count}</span></p>
                        <p className="text-xs text-gray-400">{item.effect}</p>
                    </div>
                </button>
            )) : <p className="col-span-full text-center text-gray-500">Không có dược phẩm.</p>}
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {inspectingCharacter && (
        <CharacterDetailPopup 
          character={inspectingCharacter} 
          onClose={() => setInspectingCharacter(null)}
        />
      )}
      <div className="w-full max-w-4xl bg-gray-900 border-2 border-red-800 rounded-lg shadow-2xl shadow-black/50 p-6 flex flex-col gap-4 relative">
        {showItemPanel && <ItemPanel />}
        <div className="absolute inset-0 pointer-events-none z-10">
            {activeEffects.map(effect => (
                <CombatEffect
                    key={effect.id}
                    effect={effect}
                    playerRef={playerRef}
                    companionRef={companionRef}
                    monsterRef={monsterRef}
                    onCompleted={(id) => setActiveEffects(prev => prev.filter(e => e.id !== id))}
                />
            ))}
        </div>

        <div className="relative h-48 flex justify-between items-center px-4 md:px-16">
            <div className="flex gap-2 items-end">
                <div ref={playerRef} className={`relative flex flex-col items-center ${playerHitAnim ? 'animate-hit' : ''}`}>
                    <button onClick={() => setInspectingCharacter(player)} className="focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full transition-all">
                      <img src={player.avatarUrl} alt="Player" className="w-20 h-20 rounded-full border-4 border-cyan-500 mb-2"/>
                    </button>
                    <StatBar name={player.name} current={playerState.hp} max={player.maxHp} color="bg-green-500" mp={playerState.mp} maxMp={player.maxMp} />
                </div>
                {activeCompanion && companionState && (
                    <div ref={companionRef} className={`relative flex flex-col items-center ${companionHitAnim ? 'animate-hit' : ''}`}>
                        <button onClick={() => setInspectingCharacter(activeCompanion)} className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full transition-all">
                          <img src={activeCompanion.avatarUrl} alt="Companion" className="w-16 h-16 rounded-full border-4 border-yellow-500 mb-2"/>
                        </button>
                        <StatBar name={activeCompanion.name} current={companionState.hp} max={activeCompanion.maxHp} color="bg-green-500" mp={companionState.mp} maxMp={activeCompanion.maxMp} />
                    </div>
                )}
            </div>
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-serif text-red-500">VS</div>
            <div ref={monsterRef} className={`relative flex flex-col items-center ${monsterHitAnim ? 'animate-hit' : ''}`}>
                <button 
                  onClick={() => setInspectingCharacter({ ...monster, hp: monsterHp, stats: monsterStats })} 
                  className="focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full transition-all"
                >
                  <div className="w-20 h-20 rounded-full border-4 border-red-500 mb-2 bg-black flex items-center justify-center text-4xl">?</div>
                </button>
                <StatBar name={monster.name} current={monsterHp} max={monster.hp} color="bg-red-500" />
            </div>
        </div>

        <div ref={logRef} className="h-40 bg-black/50 p-3 rounded-md border border-gray-700 overflow-y-auto text-sm space-y-2">
          {log.map((entry, index) => (
             <p key={index} className={`animate-fadeIn ${entry.isPlayerActor ? 'text-cyan-300' : 'text-red-300'}`}>
                <span className="font-bold">{entry.actor}</span> {entry.skillName ? `dùng [${entry.skillName}]` : entry.action} {entry.target && `lên ${entry.target}`}
                {entry.isMiss ? <span className="text-yellow-400 font-bold">, nhưng đã Né Tránh!</span> : ''}
                {entry.damage ? <span>, gây <span className="font-bold text-white">{entry.damage}</span> sát thương</span> : ''}
                {entry.isCrit ? <span className="text-yellow-400 font-bold"> - CHÍ MẠNG!</span> : ''}
                {entry.isBlock ? <span className="text-blue-300"> (Bị Chặn!)</span> : ''}
                {!entry.damage && !entry.isMiss && !entry.target ? '!' : '.'}
            </p>
          ))}
        </div>

        <div className="flex justify-end items-center -mb-1">
            <label htmlFor="autoBattleToggle" className="mr-3 font-semibold text-yellow-300 flex items-center gap-1"><AutoIcon /> Tự Động</label>
            <button id="autoBattleToggle" onClick={() => setIsAutoBattle(prev => !prev)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isAutoBattle ? 'bg-green-500' : 'bg-gray-600'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isAutoBattle ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button onClick={() => handlePlayerAction(null)} disabled={currentTurn !== 'player' || isBattleOver || isAutoBattle} className="p-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md font-bold transition-colors flex items-center justify-center gap-2"> <SwordIcon /> Tấn Công</button>
          <button onClick={() => setShowItemPanel(prev => !prev)} disabled={currentTurn !== 'player' || isBattleOver || isAutoBattle} className="p-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md font-bold transition-colors flex items-center justify-center gap-2">Túi Đồ</button>
          {player.skills.filter(s => s.type === 'Chủ Động').map(skill => (
              <div key={skill.id} className="relative">
                <button 
                    onClick={() => handlePlayerAction(skill)} 
                    disabled={currentTurn !== 'player' || isBattleOver || isAutoBattle || playerState.mp < (skill.mpCost ?? 0)} 
                    className="w-full h-full p-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 rounded-md font-bold transition-colors flex items-center justify-center gap-2" 
                    title={`MP: ${skill.mpCost}`}
                > 
                    <SparklesIcon /> {skill.name}
                </button>
                 <button 
                    onClick={() => { const newSet = new Set(autoSkills); newSet.has(skill.id) ? newSet.delete(skill.id) : newSet.add(skill.id); setAutoSkills(newSet); }}
                    className={`absolute -top-2 -right-2 w-7 h-7 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold transition-colors ${autoSkills.has(skill.id) ? 'bg-green-500' : 'bg-gray-500'}`}
                    title="Sử dụng trong chế độ Tự Động"
                >A</button>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleScreen;