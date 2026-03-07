import { useEffect, useState } from 'react';

interface CeremonyTransitionProps {
  onComplete: () => void;
}

export function CeremonyTransition({ onComplete }: CeremonyTransitionProps) {
  const [phase, setPhase] = useState<'particles' | 'text' | 'fade-out'>('particles');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 1500);
    const t2 = setTimeout(() => setPhase('fade-out'), 4000);
    const t3 = setTimeout(() => onComplete(), 4800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className={`ceremony-container ${phase === 'fade-out' ? 'ceremony-fade-out' : ''}`}>
      {/* Particle background */}
      <div className="ceremony-particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="ceremony-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Central glow orb */}
      <div className="ceremony-orb">
        <div className="ceremony-orb-inner" />
        <div className="ceremony-orb-ring" />
        <div className="ceremony-orb-ring ceremony-orb-ring-2" />
      </div>

      {/* Text */}
      <div className={`ceremony-text ${phase === 'text' || phase === 'fade-out' ? 'ceremony-text-visible' : ''}`}>
        「 你的AI营销助理 正在深度理解和对齐你的记忆 」
      </div>
    </div>
  );
}
