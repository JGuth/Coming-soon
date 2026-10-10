import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showWordmark?: boolean;
  variant?: 'default' | 'glow' | 'white';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  variant = 'default',
}) => {
  // Size mapping
  const sizeMap = {
    sm: { width: 32, height: 35, text: 'text-base' },
    md: { width: 44, height: 48, text: 'text-lg' },
    lg: { width: 68, height: 75, text: 'text-2xl' },
    xl: { width: 96, height: 105, text: 'text-3xl' },
    hero: { width: 130, height: 143, text: 'text-4xl' },
  };

  const currentSize = sizeMap[size];

  // Color gradient setup
  const strokeColor = variant === 'white' ? '#FFFFFF' : '#8ABFFF';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official "pb" Bagpipe Drone Monogram Mark */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 ${
          variant === 'glow' ? 'drop-shadow-[0_0_15px_rgba(138,191,255,0.4)]' : ''
        }`}
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <svg
          viewBox="0 0 600 660"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pb-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#D2E4FF" />
              <stop offset="100%" stopColor="#8ABFFF" />
            </linearGradient>
            <filter id="pb-subtle-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g
            stroke={variant === 'white' ? '#FFFFFF' : 'url(#pb-logo-gradient)'}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={variant === 'glow' ? 'url(#pb-subtle-glow)' : undefined}
          >
            {/* LOWERCASE 'p' */}
            {/* Left descender stem */}
            <path d="M 95 310 L 95 560 C 95 605 135 625 165 595 C 190 570 190 510 190 460" />

            {/* Outer 'p' bowl */}
            <path d="M 95 310 C 95 210 180 180 270 180 C 365 180 435 230 435 340 C 435 440 370 495 285 495 C 230 495 190 475 190 425" />

            {/* Connecting bridge between 'p' and 'b' */}
            <path d="M 190 460 C 190 500 240 520 295 515 C 365 505 425 455 460 410" />

            {/* LOWERCASE 'b' STEM & BACK */}
            <path d="M 270 180 C 270 100 290 20 330 20 L 340 20 C 375 20 380 90 380 180" />

            {/* Main 'b' bowl (pipe bag body) */}
            <path d="M 455 185 C 530 215 575 285 575 380 C 575 495 490 575 375 575 C 295 575 240 525 220 480" />

            {/* Inner cutout of 'b' bowl */}
            <path d="M 380 240 C 460 240 515 295 515 380 C 515 465 460 515 380 515 C 335 515 290 485 275 440" />

            {/* DRONE STOCKS */}
            <path d="M 410 170 C 410 155 435 155 435 170" />
            <path d="M 460 185 C 465 170 485 175 485 190" />
            <path d="M 505 205 C 515 195 530 205 528 220" />

            {/* THREE BAGPIPE DRONES */}
            {/* 1. Bass Drone (Vertical, Tallest) */}
            <path d="M 422 155 L 422 65" />
            <path d="M 412 110 C 412 85 418 75 418 65 L 426 65 C 426 75 432 85 432 110 Z" />
            <path d="M 414 45 L 430 45" />
            <path d="M 414 45 C 404 45 404 20 412 10 L 432 10 C 440 20 440 45 430 45 Z" />

            {/* 2. Tenor Drone 1 (Angled ~18 degrees) */}
            <g transform="rotate(18, 472, 175)">
              <path d="M 472 170 L 472 85" />
              <path d="M 464 125 C 464 105 468 95 468 85 L 476 85 C 476 95 480 105 480 125 Z" />
              <path d="M 465 70 C 458 70 458 50 464 42 L 480 42 C 486 50 486 70 479 70 Z" />
            </g>

            {/* 3. Tenor Drone 2 (Angled ~36 degrees) */}
            <g transform="rotate(36, 517, 210)">
              <path d="M 517 205 L 517 125" />
              <path d="M 510 160 C 510 145 514 135 514 125 L 520 125 C 520 135 524 145 524 160 Z" />
              <path d="M 511 110 C 505 110 505 92 511 86 L 523 86 C 529 92 529 110 523 110 Z" />
            </g>
          </g>
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showWordmark && (
        <span className={`font-extrabold tracking-tight text-[#F5F8FC] ${currentSize.text} flex items-center`}>
          PipeBand<span className="text-[#8ABFFF] font-medium">.app</span>
        </span>
      )}
    </div>
  );
};
