interface AnimatedHandProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function AnimatedHand({
  size = 240,
  animate = true,
  className,
}: AnimatedHandProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="icharaHeroGlow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2d6c50" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="icharaHandFill" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#c8f5dc" stopOpacity="0.85" />
        </linearGradient>
        <filter id="icharaHandGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx="100"
        cy="108"
        r="88"
        fill="url(#icharaHeroGlow)"
        className={animate ? "ichara-pulse-glow" : undefined}
      />

      <g
        className={animate ? "ichara-hand-wave" : undefined}
        filter="url(#icharaHandGlow)"
      >
        <rect x="54" y="110" width="92" height="72" rx="22" fill="url(#icharaHandFill)" />
        <rect
          x="30"
          y="118"
          width="30"
          height="52"
          rx="15"
          fill="url(#icharaHandFill)"
          transform="rotate(-28 45 144)"
        />
        <rect
          x="57"
          y="36"
          width="22"
          height="84"
          rx="11"
          fill="url(#icharaHandFill)"
          className={animate ? "ichara-finger-1" : undefined}
        />
        <rect
          x="83"
          y="24"
          width="22"
          height="96"
          rx="11"
          fill="url(#icharaHandFill)"
          className={animate ? "ichara-finger-2" : undefined}
        />
        <rect
          x="109"
          y="34"
          width="22"
          height="86"
          rx="11"
          fill="url(#icharaHandFill)"
          className={animate ? "ichara-finger-3" : undefined}
        />
        <rect
          x="135"
          y="52"
          width="18"
          height="68"
          rx="9"
          fill="url(#icharaHandFill)"
          className={animate ? "ichara-finger-4" : undefined}
        />

        <rect x="68" y="118" width="64" height="8" rx="4" fill="rgba(255,255,255,0.45)" />
        <circle cx="68" cy="116" r="4" fill="rgba(45,108,80,0.15)" />
        <circle cx="94" cy="116" r="4" fill="rgba(45,108,80,0.15)" />
        <circle cx="120" cy="116" r="4" fill="rgba(45,108,80,0.15)" />
        <circle cx="144" cy="116" r="3" fill="rgba(45,108,80,0.12)" />
      </g>
    </svg>
  );
}
