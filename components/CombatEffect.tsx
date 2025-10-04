import React, { useEffect, useState, RefObject } from 'react';

interface CombatEffectProps {
    effect: { id: number; type: string; target: 'player' | 'monster' | 'companion' };
    playerRef: RefObject<HTMLDivElement>;
    companionRef: RefObject<HTMLDivElement>;
    monsterRef: RefObject<HTMLDivElement>;
    onCompleted: (id: number) => void;
}

const CombatEffect: React.FC<CombatEffectProps> = ({ effect, playerRef, companionRef, monsterRef, onCompleted }) => {
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

    useEffect(() => {
        let targetRef: RefObject<HTMLDivElement> | null = null;
        switch (effect.target) {
            case 'player': targetRef = playerRef; break;
            case 'companion': targetRef = companionRef; break;
            case 'monster': targetRef = monsterRef; break;
        }

        if (targetRef && targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top + rect.height / 2,
                left: rect.left + rect.width / 2,
            });
        }
        
        const timer = setTimeout(() => {
            onCompleted(effect.id);
        }, 1200); // Duration should match the longest animation

        return () => clearTimeout(timer);
    }, [effect, playerRef, companionRef, monsterRef, onCompleted]);

    if (!position) return null;

    const renderEffect = () => {
        switch(effect.type) {
            case 'slash':
                return <div style={{ top: `${position.top}px`, left: `${position.left}px` }} className="animate-slash fixed z-20"></div>;
            case 'heal':
                return (
                    <div style={{ top: `${position.top}px`, left: `${position.left}px` }} className="fixed z-20">
                        {/* Create multiple particles for a better effect */}
                        {[...Array(5)].map((_, i) => (
                             <div 
                                key={i}
                                className="animate-heal-particle"
                                style={{
                                    left: `${Math.random() * 60 - 30}px`,
                                    top: `${Math.random() * 20 - 10}px`,
                                    animationDelay: `${i * 0.1}s`
                                }}
                            ></div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return renderEffect();
};

export default CombatEffect;