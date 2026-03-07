import { useEffect } from 'react';

interface LaunchCeremonyProps {
  onComplete: () => void;
}

// Pre-computed ring dots (32 dots around a circle, r=52, centered at 80,80)
const RING_DOTS = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * 2 * Math.PI;
  const r = 52;
  const x = 80 + r * Math.cos(angle);
  const y = 80 + r * Math.sin(angle);
  // Vary size/opacity by position for organic look
  const sizeMod = 0.6 + 0.9 * Math.abs(Math.sin(i * 0.55));
  const opacityMod = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.4 + 1.2));
  return { x, y, r: 1.0 + sizeMod, opacity: opacityMod };
});

// Scattered outer dots for depth
const OUTER_DOTS = [
  { x: 28, y: 38, r: 2.8, opacity: 0.38 },
  { x: 128, y: 48, r: 2.0, opacity: 0.44 },
  { x: 148, y: 88, r: 1.8, opacity: 0.32 },
  { x: 18, y: 108, r: 2.2, opacity: 0.40 },
  { x: 108, y: 148, r: 2.5, opacity: 0.36 },
  { x: 42, y: 142, r: 1.7, opacity: 0.42 },
  { x: 138, y: 128, r: 2.1, opacity: 0.30 },
  { x: 62, y: 16, r: 1.9, opacity: 0.38 },
  { x: 95, y: 22, r: 1.5, opacity: 0.28 },
  { x: 155, y: 60, r: 1.6, opacity: 0.35 },
];

export function LaunchCeremony({ onComplete }: LaunchCeremonyProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2900);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="launch-ceremony-overlay">
      <div className="launch-ceremony-orb">
        <svg
          width="200"
          height="200"
          viewBox="0 0 160 160"
          className="launch-ring-svg"
        >
          <defs>
            <radialGradient id="lc-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#C5D8F8" stopOpacity="0.65" />
              <stop offset="60%" stopColor="#A8C4F0" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8BAEE8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lc-outer-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#B8CFEE" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#8BAEE8" stopOpacity="0" />
            </radialGradient>
            <filter id="lc-dot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer soft glow */}
          <circle cx="80" cy="80" r="78" fill="url(#lc-outer-glow)" />

          {/* Center radial glow */}
          <circle cx="80" cy="80" r="62" fill="url(#lc-center-glow)" />

          {/* Ring dots */}
          {RING_DOTS.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill="white"
              opacity={dot.opacity}
              filter="url(#lc-dot-glow)"
            />
          ))}

          {/* Outer scattered dots */}
          {OUTER_DOTS.map((dot, i) => (
            <circle
              key={`o${i}`}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill="white"
              opacity={dot.opacity}
            />
          ))}
        </svg>
      </div>

      <p className="launch-ceremony-text">
        「 <strong>你的营销分身</strong>，正式上线 」
      </p>
    </div>
  );
}
