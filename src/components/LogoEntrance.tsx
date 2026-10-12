import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext.tsx';
import { Sparkles, X } from 'lucide-react';

export const LogoEntrance: React.FC = () => {
  const { settings, isLogoEntrancePlaying, finishLogoEntrance } = useSettings();
  const [stage, setStage] = useState<number>(0);
  // stage 0: Initial black screen
  // stage 1: 'p' glyph draws in (0.3s)
  // stage 2: 'b' stem and circle draw in (1.0s)
  // stage 3: drone 1 (bass drone) rises (1.6s)
  // stage 4: drone 2 (tenor 1) rises at 18deg (2.0s)
  // stage 5: drone 3 (tenor 2) rises at 36deg (2.4s)
  // stage 6: monogram complete, glow pulse & wordmark reveal (2.8s)
  // stage 7: fade out / unveil website (3.8s)

  const [isFadingOut, setIsFadingOut] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Check if logo entrance is disabled in settings
  const isEnabled = settings.visuals?.logoEntranceEnabled !== false;

  useEffect(() => {
    if (!isLogoEntrancePlaying || !isEnabled) {
      return;
    }

    // Reset stage & begin choreographed sequence matching the video
    setStage(0);
    setIsFadingOut(false);

    const clearAll = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };

    clearAll();

    const t1 = setTimeout(() => setStage(1), 250);   // 'p' draws in
    const t2 = setTimeout(() => setStage(2), 950);   // 'b' draws in
    const t3 = setTimeout(() => setStage(3), 1550);  // Drone 1 shoots up
    const t4 = setTimeout(() => setStage(4), 1950);  // Drone 2 shoots up
    const t5 = setTimeout(() => setStage(5), 2350);  // Drone 3 shoots up
    const t6 = setTimeout(() => setStage(6), 2750);  // Wordmark + glow settle
    const t7 = setTimeout(() => setIsFadingOut(true), 3700); // Begin fade out
    const t8 = setTimeout(() => {
      finishLogoEntrance();
    }, 4400); // Fully unmounted

    timeoutsRef.current = [t1, t2, t3, t4, t5, t6, t7, t8];

    // Keyboard shortcut to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearAll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLogoEntrancePlaying, isEnabled]);

  const handleSkip = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsFadingOut(true);
    setTimeout(() => {
      finishLogoEntrance();
    }, 350);
  };

  if (!isLogoEntrancePlaying || !isEnabled) {
    return null;
  }

  // Animation timeline progression flags
  const showP = stage >= 1;
  const showB = stage >= 2;
  const showDrone1 = stage >= 3;
  const showDrone2 = stage >= 4;
  const showDrone3 = stage >= 5;
  const showComplete = stage >= 6;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="PipeBand.app Logo Entrance"
      onClick={handleSkip}
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background ambient radial glow on complete */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          showComplete ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle at 50% 48%, ${settings.colors.primaryAccent}22 0%, rgba(138, 191, 255, 0.08) 35%, transparent 70%)`,
        }}
      />

      {/* Skip button in top right */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#A7B4C7] hover:text-white text-xs font-mono transition-all backdrop-blur-md cursor-pointer"
        title="Skip intro animation (Esc)"
      >
        <span>Skip</span>
        <span className="text-[10px] opacity-60 hidden sm:inline">[Esc]</span>
        <X className="w-3.5 h-3.5 opacity-70" />
      </button>

      {/* Logo Monogram Container */}
      <div className="relative flex flex-col items-center justify-center p-4 max-w-sm sm:max-w-md md:max-w-lg w-full">
        {/* Glow halo right behind the SVG icon */}
        <div
          className={`absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
            showComplete
              ? 'opacity-80 scale-110'
              : 'opacity-0 scale-90'
          }`}
          style={{
            backgroundColor: `${settings.colors.primaryAccent}33`,
          }}
        />

        {/* The Animated "pb" Bagpipe Monogram SVG */}
        <svg
          className="w-56 h-60 sm:w-72 sm:h-80 md:w-84 md:h-92 overflow-visible relative z-10 transition-transform duration-700"
          viewBox="0 0 1000 1100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Knockout mask for the seamless negative-space gap between 'p' and 'b' */}
            <mask id="pba-entrance-knockout">
              <rect x="-100" y="-100" width="1200" height="1300" fill="#FFFFFF" />
              <path
                d="M 80 925 L 80 520 A 195 195 0 1 1 275 715 C 340 715, 410 705, 465 675"
                stroke="#000000"
                strokeWidth="156"
                strokeLinecap="round"
                fill="none"
              />
            </mask>

            {/* Drone 1 Clip Path to mask rising up out from the 'b' circle rim */}
            <clipPath id="drone1-entrance-clip">
              <rect x="630" y="-50" width="120" height="340" />
            </clipPath>

            {/* Drone 2 Clip Path */}
            <clipPath id="drone2-entrance-clip">
              <rect x="-60" y="-240" width="120" height="300" />
            </clipPath>

            {/* Drone 3 Clip Path */}
            <clipPath id="drone3-entrance-clip">
              <rect x="-60" y="-240" width="120" height="300" />
            </clipPath>
          </defs>

          {/* LAYER 1: 'b' Letterform (Masked by 'p' knockout channel) */}
          <g
            mask="url(#pba-entrance-knockout)"
            className="transition-all duration-700 ease-out"
            style={{
              opacity: showB ? 1 : 0,
              transform: showB ? 'scale(1)' : 'scale(0.96)',
              transformOrigin: '710px 560px',
            }}
          >
            {/* 'b' Annular Loop */}
            <circle
              cx="710"
              cy="560"
              r="220"
              stroke="#FFFFFF"
              strokeWidth="120"
              fill="none"
              style={{
                strokeDasharray: 1400,
                strokeDashoffset: showB ? 0 : 1400,
                transition: 'stroke-dashoffset 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {/* 'b' Vertical Ascender Stem */}
            <path
              d="M 430 360 L 430 160 C 430 90, 485 55, 550 55 L 550 360 Z"
              fill="#FFFFFF"
              style={{
                opacity: showB ? 1 : 0,
                transform: showB ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
              }}
            />
          </g>

          {/* LAYER 2: Three Highland Bagpipe Drones */}
          {/* Drone 1: Bass Drone (Vertical, Center X 688) */}
          <g
            clipPath="url(#drone1-entrance-clip)"
            className="transition-all"
            style={{
              opacity: showDrone1 ? 1 : 0,
              transform: showDrone1 ? 'translateY(0)' : 'translateY(160px)',
              transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Stock collar on 'b' rim */}
            <path d="M 668 281 C 668 265, 708 265, 708 281 Z" fill="#FFFFFF" />
            {/* Shaft, slide ferrule, neck, flared bell & top cap */}
            <path
              d="
                M 684 257
                L 684 218
                L 674 218
                L 674 212
                L 676 212
                L 676 60
                L 661 55
                L 661 16
                L 715 16
                L 715 55
                L 700 60
                L 700 212
                L 702 212
                L 702 218
                L 692 218
                L 692 257
                Z
              "
              fill="#FFFFFF"
            />
          </g>

          {/* Drone 2: Tenor Drone 1 (Angled 18 deg clockwise, Center 794, 293) */}
          <g transform="translate(794, 293) rotate(18)">
            <g
              clipPath="url(#drone2-entrance-clip)"
              style={{
                opacity: showDrone2 ? 1 : 0,
                transform: showDrone2 ? 'translateY(0)' : 'translateY(160px)',
                transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <path d="M -20 0 C -20 -16, 20 -16, 20 0 Z" fill="#FFFFFF" />
              <path
                d="
                  M -10 -24
                  L -10 -60
                  L -12 -60
                  L -12 -66
                  L -10 -66
                  L -10 -170
                  L -22 -175
                  L -22 -204
                  L 22 -204
                  L 22 -175
                  L 10 -170
                  L 10 -66
                  L 12 -66
                  L 12 -60
                  L 10 -60
                  L 10 -24
                  Z
                "
                fill="#FFFFFF"
              />
            </g>
          </g>

          {/* Drone 3: Tenor Drone 2 (Angled 36 deg clockwise, Center 874, 332) */}
          <g transform="translate(874, 332) rotate(36)">
            <g
              clipPath="url(#drone3-entrance-clip)"
              style={{
                opacity: showDrone3 ? 1 : 0,
                transform: showDrone3 ? 'translateY(0)' : 'translateY(160px)',
                transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <path d="M -20 0 C -20 -16, 20 -16, 20 0 Z" fill="#FFFFFF" />
              <path
                d="
                  M -10 -24
                  L -10 -60
                  L -12 -60
                  L -12 -66
                  L -10 -66
                  L -10 -170
                  L -22 -175
                  L -22 -204
                  L 22 -204
                  L 22 -175
                  L 10 -170
                  L 10 -66
                  L 12 -66
                  L 12 -60
                  L 10 -60
                  L 10 -24
                  Z
                "
                fill="#FFFFFF"
              />
            </g>
          </g>

          {/* LAYER 3: 'p' Foreground Monogram Letter (Crisp Solid White) */}
          <path
            d="M 80 925 L 80 520 A 195 195 0 1 1 275 715 C 340 715, 410 705, 465 675"
            stroke="#FFFFFF"
            strokeWidth="112"
            strokeLinecap="round"
            fill="none"
            style={{
              opacity: showP ? 1 : 0,
              strokeDasharray: 1800,
              strokeDashoffset: showP ? 0 : 1800,
              transition: 'stroke-dashoffset 0.85s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
            }}
          />
        </svg>

        {/* Wordmark Reveal Underneath Monogram */}
        <div
          className={`flex flex-col items-center mt-6 transition-all duration-700 ${
            showComplete
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="flex items-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
            <span>PipeBand</span>
            <span
              className="font-medium ml-0.5"
              style={{ color: settings.colors.primaryAccent }}
            >
              .app
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF] animate-pulse" />
            <p className="text-[10px] sm:text-xs font-mono tracking-widest text-[#A7B4C7] uppercase">
              1998 – 2026 Archive · Every Contest. Every Result.
            </p>
          </div>
        </div>
      </div>

      {/* Subtle bottom hint */}
      <div
        className={`absolute bottom-6 text-[11px] font-mono text-[#A7B4C7]/50 tracking-wider transition-opacity duration-500 ${
          showComplete ? 'opacity-70' : 'opacity-0'
        }`}
      >
        Click anywhere to enter
      </div>
    </div>
  );
};
