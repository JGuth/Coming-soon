import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  TrendingUp,
  Rocket,
  Crown,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
  Info,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Volume2,
  VolumeX,
  Compass,
  Star,
  Activity,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';
import { AscentMilestone, AscentChartConfig, DEFAULT_WEBSITE_SETTINGS } from '../types/settings.ts';

interface GradeProgressionChartProps {
  ascent?: AscentChartConfig;
  inAdminPreview?: boolean;
}

export const GradeProgressionChart: React.FC<GradeProgressionChartProps> = ({
  ascent: propAscent,
  inAdminPreview = false,
}) => {
  const { settings } = useSettings();
  const { colors } = settings;

  const ascent = propAscent || settings.charts?.ascent || DEFAULT_WEBSITE_SETTINGS.charts.ascent;
  const milestones: AscentMilestone[] = useMemo(() => {
    return ascent.milestones && ascent.milestones.length > 0
      ? ascent.milestones
      : (DEFAULT_WEBSITE_SETTINGS.charts.ascent.milestones as AscentMilestone[]);
  }, [ascent.milestones]);

  // View Mode: 'stepper' vs 'curve'
  const [viewMode, setViewMode] = useState<'stepper' | 'curve'>(
    ascent.defaultMobileView || 'curve'
  );

  // Active milestone selection
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    milestones[0]?.id || 'm1'
  );

  // Animation Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'0.75x' | '1x' | '1.5x' | '2x'>('1x');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPausedAtMilestone, setIsPausedAtMilestone] = useState<boolean>(false);
  const [pauseProgress, setPauseProgress] = useState<number>(0); // 0 to 100%
  const [hasCompletedTour, setHasCompletedTour] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    ascent.animation?.soundEffectsEnabled || false
  );

  // Animation config options
  const animConfig = ascent.animation || {
    enabled: true,
    autoPlay: false,
    speed: 'normal',
    pauseDurationMs: 2400,
    tracerStyle: 'golden-comet',
    spotlightEffect: true,
    showCrownCelebration: true,
    loopAnimation: true,
    showFloatingMilestoneCard: true,
    soundEffectsEnabled: false,
    nodeMarkerStyle: 'rings',
    showMetricCards: true,
  };

  const selectedIndex = milestones.findIndex((m) => m.id === selectedMilestoneId);
  const selectedMilestone = milestones[selectedIndex >= 0 ? selectedIndex : 0] || milestones[0];

  // Theme-aware colors
  const gradStart = ascent.accentThemeMatch !== false ? colors.secondaryAccent : ascent.trajectoryGradientStart;
  const gradMid = ascent.accentThemeMatch !== false ? colors.primaryAccent : ascent.trajectoryGradientMid;
  const gradEnd = ascent.trajectoryGradientEnd || '#F59E0B';

  const strokeWidth =
    ascent.curveStrokeWidth === 'fine'
      ? 2
      : ascent.curveStrokeWidth === 'bold'
      ? 5
      : ascent.curveStrokeWidth === 'ultra'
      ? 7
      : 3.5;
  const showGridlines = ascent.showGridlines !== false;
  const showNodeGlow = ascent.showNodeGlow !== false;
  const curveStyle = ascent.curveStyle || 'spline';
  const nodeMarkerStyle = animConfig.nodeMarkerStyle || 'rings';
  const tracerStyle = animConfig.tracerStyle || 'golden-comet';
  const showFloatingCard = animConfig.showFloatingMilestoneCard !== false;
  const showMetricCards = animConfig.showMetricCards !== false;

  // Grade coordinate mapping (Y values from top: Grade 1 at y=26 down to Novice at y=224)
  const getGradeY = (grade: string): number => {
    const g = grade.toLowerCase();
    if (g.includes('grade 1') || g.includes('prem')) return 26;
    if (g.includes('grade 2')) return 68;
    if (g.includes('juvenile') && !g.includes('novice')) return 112;
    if (g.includes('grade 3a') || g.includes('3a')) return 152;
    if (g.includes('grade 3b') || g.includes('3b') || g.includes('grade 3')) return 188;
    return 224; // Novice Juvenile / Grade 4 / Foundation
  };

  const getMilestoneX = (index: number, total: number): number => {
    if (total <= 1) return 400;
    return 55 + (index / (total - 1)) * 690;
  };

  // Pre-calculate coordinates for all milestones
  const points = useMemo(() => {
    return milestones.map((m, idx) => ({
      x: getMilestoneX(idx, milestones.length),
      y: getGradeY(m.grade),
      milestone: m,
      index: idx,
    }));
  }, [milestones]);

  // Construct SVG path string based on selected curveStyle ('spline' | 'linear' | 'stepped')
  const generatePathD = (pts: typeof points): string => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let d = `M ${pts[0].x} ${pts[0].y}`;

    if (curveStyle === 'linear') {
      for (let i = 1; i < pts.length; i++) {
        d += ` L ${pts[i].x} ${pts[i].y}`;
      }
      return d;
    }

    if (curveStyle === 'stepped') {
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const midX = (p0.x + p1.x) / 2;
        d += ` H ${midX} V ${p1.y} H ${p1.x}`;
      }
      return d;
    }

    // Default 'spline': Smooth cubic Bezier curve
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) * 0.45;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) * 0.55;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const fullPathD = useMemo(() => generatePathD(points), [points, curveStyle]);

  // Traced path up to active step index
  const activePathD = useMemo(() => {
    const activePoints = points.slice(0, activeStepIndex + 1);
    return generatePathD(activePoints);
  }, [points, activeStepIndex, curveStyle]);

  // Active runner position at current milestone
  const activePoint = points[activeStepIndex] || points[0];

  // Pause duration adjusted by speed setting
  const basePauseMs = animConfig.pauseDurationMs || 2400;
  const speedMultiplier =
    playbackSpeed === '2x'
      ? 0.45
      : playbackSpeed === '1.5x'
      ? 0.7
      : playbackSpeed === '0.75x'
      ? 1.4
      : 1;
  const currentPauseDuration = Math.max(800, Math.round(basePauseMs * speedMultiplier));

  // Sound Synthesizer via Web Audio API (Native, Zero External Dependencies)
  const playMilestoneSound = (isWorldChampion: boolean) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      // World Champions play a triumphant fanfare triad; promotions/milestones play an acoustic chime
      const freqs = isWorldChampion
        ? [523.25, 659.25, 783.99, 1046.5]
        : [440, 554.37, 659.25];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = isWorldChampion ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(isWorldChampion ? 0.14 : 0.07, now + i * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.6);
      });
    } catch {
      // Audio context silenced or blocked
    }
  };

  // Main Animation Effect: Step through milestones, pause, highlight, and continue
  useEffect(() => {
    if (!isPlaying) return;

    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    // Phase: Paused at milestone
    setIsPausedAtMilestone(true);
    setPauseProgress(0);

    // Trigger arrival fanfare
    const curr = milestones[activeStepIndex];
    if (curr) {
      playMilestoneSound(Boolean(curr.isWorldChampion));
    }

    const startTime = Date.now();
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / currentPauseDuration) * 100));
      setPauseProgress(pct);
    }, 40);

    timer = setTimeout(() => {
      clearInterval(progressInterval);
      setPauseProgress(100);

      // Check if reached the end of the ascent
      if (activeStepIndex >= milestones.length - 1) {
        setIsPausedAtMilestone(false);
        setHasCompletedTour(true);

        if (animConfig.loopAnimation) {
          // Loop back after celebratory pause
          const loopTimer = setTimeout(() => {
            setActiveStepIndex(0);
            setSelectedMilestoneId(milestones[0].id);
            setHasCompletedTour(false);
          }, 2200);
          return () => clearTimeout(loopTimer);
        } else {
          setIsPlaying(false);
        }
      } else {
        // Advance to next milestone
        const nextIdx = activeStepIndex + 1;
        setActiveStepIndex(nextIdx);
        setSelectedMilestoneId(milestones[nextIdx].id);
        setIsPausedAtMilestone(false);
      }
    }, currentPauseDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [isPlaying, activeStepIndex, milestones, currentPauseDuration, animConfig.loopAnimation, soundEnabled]);

  // Manual navigation helpers
  const handleSelectMilestone = (mId: string) => {
    setSelectedMilestoneId(mId);
    const idx = milestones.findIndex((m) => m.id === mId);
    if (idx >= 0) {
      setActiveStepIndex(idx);
      setIsPausedAtMilestone(true);
      setPauseProgress(0);
      playMilestoneSound(Boolean(milestones[idx].isWorldChampion));
    }
  };

  const handlePrevMilestone = () => {
    if (selectedIndex > 0) {
      const prevIdx = selectedIndex - 1;
      setActiveStepIndex(prevIdx);
      setSelectedMilestoneId(milestones[prevIdx].id);
      setIsPausedAtMilestone(true);
      setPauseProgress(0);
      playMilestoneSound(Boolean(milestones[prevIdx].isWorldChampion));
    }
  };

  const handleNextMilestone = () => {
    if (selectedIndex < milestones.length - 1) {
      const nextIdx = selectedIndex + 1;
      setActiveStepIndex(nextIdx);
      setSelectedMilestoneId(milestones[nextIdx].id);
      setIsPausedAtMilestone(true);
      setPauseProgress(0);
      playMilestoneSound(Boolean(milestones[nextIdx].isWorldChampion));
    }
  };

  const handleTogglePlay = () => {
    if (hasCompletedTour) {
      setActiveStepIndex(0);
      setSelectedMilestoneId(milestones[0].id);
      setHasCompletedTour(false);
      setIsPlaying(true);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetTour = () => {
    setIsPlaying(false);
    setActiveStepIndex(0);
    setSelectedMilestoneId(milestones[0].id);
    setIsPausedAtMilestone(false);
    setPauseProgress(0);
    setHasCompletedTour(false);
  };

  // Tracer Color definitions
  const tracerColors = useMemo(() => {
    switch (tracerStyle) {
      case 'cyan-spark':
        return { core: '#FFFFFF', mid: '#38BDF8', outer: '#0284C7' };
      case 'emerald-beam':
        return { core: '#FFFFFF', mid: '#34D399', outer: '#059669' };
      case 'royal-flame':
        return { core: '#FFFFFF', mid: '#C084FC', outer: '#9333EA' };
      case 'golden-comet':
      default:
        return { core: '#FFFFFF', mid: '#FBBF24', outer: '#D97706' };
    }
  }, [tracerStyle]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* =========================================================================
          1. HEADER STATS & ASCENT SUMMARY BANNER
         ========================================================================= */}
      <div
        className="rounded-xl p-3.5 sm:p-5 border transition-all"
        style={{
          backgroundColor: colors.navySurface,
          borderColor: `${colors.primaryAccent}25`,
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border"
              style={{
                backgroundColor: `${colors.primaryAccent}15`,
                borderColor: `${colors.primaryAccent}40`,
                color: colors.primaryAccent,
              }}
            >
              <Rocket className="w-3 h-3" />
              <span>{ascent.bandName.toUpperCase()}</span>
            </div>

            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderColor: 'rgba(16, 185, 129, 0.4)',
                color: '#34D399',
              }}
            >
              <TrendingUp className="w-3 h-3" />
              <span>{ascent.promotionsCount} TIERS CLIMBED</span>
            </div>

            {selectedMilestone.isWorldChampion && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>WORLD TITLE YEAR</span>
              </span>
            )}

            {selectedMilestone.isPromotion && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <Rocket className="w-3 h-3 text-purple-400" />
                <span>GRADE PROMOTION</span>
              </span>
            )}
          </div>

          {/* View Mode Toggle: Trajectory Curve vs Milestones Stepper */}
          <div
            className="inline-flex p-0.5 rounded-lg border text-xs font-mono select-none"
            style={{
              backgroundColor: colors.cardSurface,
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('curve')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                viewMode === 'curve' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: viewMode === 'curve' ? colors.primaryAccent : 'transparent',
                color: viewMode === 'curve' ? colors.bgDark : colors.textMuted,
              }}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Trajectory Curve</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('stepper')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                viewMode === 'stepper' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: viewMode === 'stepper' ? colors.primaryAccent : 'transparent',
                color: viewMode === 'stepper' ? colors.bgDark : colors.textMuted,
              }}
            >
              <Layers className="w-3 h-3" />
              <span>Milestones</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Badges (Toggleable in Settings) */}
        {showMetricCards && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div
              className="rounded-lg p-2.5 sm:p-3 border"
              style={{
                backgroundColor: colors.cardSurface,
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5"
                style={{ color: colors.textMuted }}
              >
                STARTING GRADE
              </div>
              <div className="text-sm sm:text-base font-bold text-white font-mono">
                {ascent.startingGrade}
              </div>
              <div className="text-[10px]" style={{ color: colors.textMuted }}>
                Season {ascent.startingYear}
              </div>
            </div>

            <div
              className="rounded-lg p-2.5 sm:p-3 border"
              style={{
                backgroundColor: colors.cardSurface,
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5"
                style={{ color: colors.textMuted }}
              >
                PEAK COMPETITION GRADE
              </div>
              <div className="text-sm sm:text-base font-bold font-mono" style={{ color: colors.primaryAccent }}>
                {ascent.peakGrade}
              </div>
              <div className="text-[10px]" style={{ color: colors.textMuted }}>
                {ascent.peakSubtitle}
              </div>
            </div>

            <div
              className="rounded-lg p-2.5 sm:p-3 border"
              style={{
                backgroundColor: colors.cardSurface,
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5"
                style={{ color: colors.textMuted }}
              >
                PROMOTIONS EARNED
              </div>
              <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                {ascent.promotionsCount} Promotions
              </div>
              <div className="text-[10px]" style={{ color: colors.textMuted }}>
                {ascent.promotionsSubtitle}
              </div>
            </div>

            <div
              className="rounded-lg p-2.5 sm:p-3 border"
              style={{
                backgroundColor: colors.cardSurface,
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5"
                style={{ color: colors.textMuted }}
              >
                SPEED TO GRADE 1
              </div>
              <div className="text-sm sm:text-base font-bold text-amber-400 font-mono">
                {ascent.yearsToGrade1}
              </div>
              <div className="text-[10px]" style={{ color: colors.textMuted }}>
                {ascent.speedSubtitle}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. INTERACTIVE ANIMATION CONTROLLER TOOLBAR (HIGH IMPACT)
         ========================================================================= */}
      <div
        className="rounded-xl p-3 border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg"
        style={{
          backgroundColor: colors.navySurface,
          borderColor: isPlaying ? colors.primaryAccent : 'rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono font-bold text-xs transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isPlaying ? '#F59E0B' : colors.primaryAccent,
              color: colors.bgDark,
            }}
            title={isPlaying ? 'Pause Ascent Tour' : 'Play Animated Ascent Tour'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Tour</span>
              </>
            ) : hasCompletedTour ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Tour</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Ascent Tour</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResetTour}
            className="p-2 rounded-lg border text-xs font-mono transition-colors hover:bg-white/5 cursor-pointer text-[#A7B4C7] hover:text-white"
            style={{
              backgroundColor: colors.cardSurface,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
            title="Reset to Starting Year"
            aria-label="Reset to Starting Year"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Stepper prev/next */}
          <div className="flex items-center border rounded-lg overflow-hidden border-white/10">
            <button
              type="button"
              onClick={handlePrevMilestone}
              disabled={activeStepIndex <= 0}
              className="p-1.5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="Previous Milestone"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] font-mono text-[#A7B4C7]">
              {activeStepIndex + 1}/{milestones.length}
            </span>
            <button
              type="button"
              onClick={handleNextMilestone}
              disabled={activeStepIndex >= milestones.length - 1}
              className="p-1.5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors cursor-pointer"
              title="Next Milestone"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 border border-white/10 rounded-lg p-0.5 bg-[#0B1425]">
            {(['0.75x', '1x', '1.5x', '2x'] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-[#8ABFFF] text-[#0B1425]'
                    : 'text-[#A7B4C7] hover:text-white'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>

          {/* Sound Fanfare Chime Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#0B1425] text-white/40 border-white/10 hover:text-white'
            }`}
            title={soundEnabled ? 'Arrival Chime: Enabled' : 'Arrival Chime: Muted (Click to enable)'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden sm:inline">{soundEnabled ? 'Audio Chime' : 'Muted'}</span>
          </button>
        </div>

        {/* Right: Live Animation Tour Status & Milestone Countdown */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {isPlaying ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[#8ABFFF]">
                {isPausedAtMilestone ? (
                  <>
                    <span className="font-bold text-white">Stopped at {selectedMilestone.year}</span>
                    <span className="text-[#8ABFFF] ml-1">({selectedMilestone.grade})</span>
                  </>
                ) : (
                  'Ascending curve...'
                )}
              </span>

              {/* Animated Countdown Progress Ring / Bar */}
              <div className="w-16 h-2 bg-[#0B1425] rounded-full overflow-hidden border border-white/10 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#8ABFFF] via-emerald-400 to-amber-400 transition-all duration-75"
                  style={{ width: `${pauseProgress}%` }}
                />
              </div>
            </div>
          ) : hasCompletedTour ? (
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Ascent Tour Complete (Peak Reached)</span>
            </span>
          ) : (
            <span className="text-[#A7B4C7] text-[11px] hidden sm:inline flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#8ABFFF]" />
              Tap Play to trace the animated trajectory stopping at milestones
            </span>
          )}
        </div>
      </div>

      {/* =========================================================================
          3. MAIN VISUAL CANVAS AREA: RESPONSIVE ANIMATED CURVE OR STEPPER
         ========================================================================= */}
      <div
        className="rounded-xl p-3.5 sm:p-6 border relative overflow-hidden"
        style={{
          backgroundColor: colors.navySurface,
          borderColor: `${colors.primaryAccent}20`,
        }}
      >
        {/* Top Header of Visual Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: colors.primaryAccent }} />
              <span>RSPBA Competitive Grade Trajectory</span>
            </h4>
            <p className="text-[11px] mt-0.5" style={{ color: colors.textMuted }}>
              Chronological ascent with animated stops, grade promotions, and World Championship milestones
            </p>
          </div>

          {/* Badges / Legend */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono border"
              style={{
                backgroundColor: colors.cardSurface,
                borderColor: 'rgba(255, 255, 255, 0.08)',
                color: colors.primaryAccent,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primaryAccent }} />
              Grade Curve
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-200 font-mono border border-purple-500/30">
              <Rocket className="w-2.5 h-2.5 text-purple-300" />
              Promotion
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-300 font-mono border border-amber-500/30">
              <Crown className="w-2.5 h-2.5 text-amber-400" />
              World Title
            </span>
          </div>
        </div>

        {/* Quick Year Navigation Scrubber Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1 mb-3">
          {milestones.map((m, idx) => {
            const isSelected = m.id === selectedMilestoneId;
            const isPassed = idx <= activeStepIndex;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMilestone(m.id)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer border flex items-center gap-1"
                style={{
                  backgroundColor: isSelected
                    ? colors.primaryAccent
                    : isPassed
                    ? `${colors.cardSurface}`
                    : `${colors.navySurface}80`,
                  color: isSelected ? colors.bgDark : isPassed ? colors.textPrimary : colors.textMuted,
                  borderColor: isSelected
                    ? colors.primaryAccent
                    : isPassed
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: isSelected ? `0 4px 12px ${colors.primaryAccent}30` : 'none',
                }}
              >
                <span>'{m.year.slice(-2)}</span>
                {m.isWorldChampion && <Crown className="w-2.5 h-2.5 text-amber-400" />}
                {m.isPromotion && !m.isWorldChampion && <Rocket className="w-2.5 h-2.5 text-purple-400" />}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            VIEW A: RESPONSIVE TRAJECTORY CURVE (SVG) WITH ANIMATED RUNNER & SPOTLIGHTS
           ========================================================================= */}
        {viewMode === 'curve' && (
          <div className="animate-in fade-in duration-200">
            <div
              className="w-full relative rounded-xl border p-2 sm:p-4 select-none overflow-hidden"
              style={{
                backgroundColor: colors.cardSurface,
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Grade Y-Axis Labels overlay on the left */}
              <div className="absolute left-2.5 top-5 bottom-8 flex flex-col justify-between text-[10px] sm:text-[11px] font-mono font-semibold pointer-events-none z-10">
                <div className="text-amber-400 flex items-center gap-1 font-bold">
                  <span>Grade 1</span>
                  <span className="text-[9px] text-amber-400/70 hidden sm:inline">(Prem)</span>
                </div>
                <div style={{ color: colors.textMuted }}>Grade 2</div>
                <div style={{ color: colors.textMuted }}>Juvenile</div>
                <div style={{ color: colors.textMuted }}>Grade 3A</div>
                <div style={{ color: colors.textMuted }}>Grade 3B</div>
                <div className="text-emerald-400 font-bold">Novice Juv</div>
              </div>

              {/* The SVG element */}
              <div className="pl-16 sm:pl-20 pr-2">
                <svg
                  className="w-full h-[240px] sm:h-[310px] overflow-visible"
                  viewBox="0 0 800 250"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="progression-chart-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={gradStart} />
                      <stop offset="50%" stopColor={gradMid} />
                      <stop offset="100%" stopColor={gradEnd} />
                    </linearGradient>

                    <radialGradient id="tracer-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={tracerColors.core} stopOpacity="1" />
                      <stop offset="40%" stopColor={tracerColors.mid} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={tracerColors.outer} stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="gold-celebration-burst" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
                    </radialGradient>

                    <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal Guideline Grids */}
                  {showGridlines && (
                    <g>
                      <line x1="0" y1="26" x2="800" y2="26" stroke="#F59E0B" strokeWidth="1" strokeDasharray="5 3" opacity="0.35" />
                      <line x1="0" y1="68" x2="800" y2="68" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                      <line x1="0" y1="112" x2="800" y2="112" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                      <line x1="0" y1="152" x2="800" y2="152" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <line x1="0" y1="188" x2="800" y2="188" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <line x1="0" y1="224" x2="800" y2="224" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                    </g>
                  )}

                  {/* Optional Rival Benchmark Baseline */}
                  {ascent.rivalOverlayBandName && (
                    <g opacity="0.55">
                      <path
                        d="M 20 26 L 780 26"
                        stroke={ascent.rivalOverlayColor || '#94A3B8'}
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        fill="none"
                      />
                      <text
                        x="775"
                        y="20"
                        textAnchor="end"
                        fill={ascent.rivalOverlayColor || '#94A3B8'}
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        Benchmark: {ascent.rivalOverlayBandName} (Grade 1)
                      </text>
                    </g>
                  )}

                  {/* Background Full Trajectory Track (Ghost/Projected) */}
                  <path
                    d={fullPathD}
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 4"
                  />

                  {/* Dynamic Traced Trajectory Path (Active Progress) */}
                  <path
                    d={activePathD}
                    stroke="url(#progression-chart-gradient)"
                    strokeWidth={strokeWidth + 1}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#node-glow)"
                    className="transition-all duration-300"
                  />

                  {/* Milestone Nodes */}
                  {points.map((pt) => {
                    const isSelected = pt.milestone.id === selectedMilestoneId;
                    const isPassed = pt.index <= activeStepIndex;
                    const isCurrentAnimating = pt.index === activeStepIndex && isPausedAtMilestone;

                    return (
                      <g
                        key={pt.milestone.id}
                        className="cursor-pointer group"
                        onClick={() => handleSelectMilestone(pt.milestone.id)}
                      >
                        {/* Invisible larger touch target for mobile fingers */}
                        <circle cx={pt.x} cy={pt.y} r="22" fill="transparent" />

                        {/* Animated Expanding Ripple Ping when currently active */}
                        {(isCurrentAnimating || isSelected) && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isCurrentAnimating ? '18' : '13'}
                            fill="none"
                            stroke={pt.milestone.isWorldChampion ? '#F59E0B' : colors.primaryAccent}
                            strokeWidth="2"
                            className="animate-ping opacity-60"
                            style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                          />
                        )}

                        {/* Selected Rotating Halo */}
                        {isSelected && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="12"
                            fill="none"
                            stroke={pt.milestone.isWorldChampion ? '#F59E0B' : colors.primaryAccent}
                            strokeWidth="2"
                            strokeDasharray="3 3"
                            className="animate-spin"
                            style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                          />
                        )}

                        {/* Node Marker Shape (customizable: rings, shields, diamonds, solid) */}
                        {nodeMarkerStyle === 'diamonds' ? (
                          <polygon
                            points={`${pt.x},${pt.y - (isSelected ? 9 : 6)} ${pt.x + (isSelected ? 9 : 6)},${pt.y} ${pt.x},${pt.y + (isSelected ? 9 : 6)} ${pt.x - (isSelected ? 9 : 6)},${pt.y}`}
                            fill={
                              pt.milestone.isWorldChampion
                                ? '#F59E0B'
                                : pt.milestone.isPromotion
                                ? '#A855F7'
                                : isSelected
                                ? colors.primaryAccent
                                : isPassed
                                ? colors.secondaryAccent
                                : '#475569'
                            }
                            stroke="#ffffff"
                            strokeWidth={isSelected ? 2 : 1.2}
                            filter={isSelected && showNodeGlow ? 'url(#node-glow)' : undefined}
                          />
                        ) : nodeMarkerStyle === 'shields' ? (
                          <path
                            d={`M ${pt.x} ${pt.y - 7} L ${pt.x + 6} ${pt.y - 3} L ${pt.x + 5} ${pt.y + 4} L ${pt.x} ${pt.y + 8} L ${pt.x - 5} ${pt.y + 4} L ${pt.x - 6} ${pt.y - 3} Z`}
                            fill={
                              pt.milestone.isWorldChampion
                                ? '#F59E0B'
                                : pt.milestone.isPromotion
                                ? '#A855F7'
                                : isSelected
                                ? colors.primaryAccent
                                : isPassed
                                ? colors.secondaryAccent
                                : '#475569'
                            }
                            stroke="#ffffff"
                            strokeWidth={isSelected ? 1.8 : 1}
                            filter={isSelected && showNodeGlow ? 'url(#node-glow)' : undefined}
                          />
                        ) : (
                          /* Circles / Rings (Default) */
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isSelected ? 8.5 : isPassed ? 6.5 : 5}
                            fill={
                              pt.milestone.isWorldChampion
                                ? '#F59E0B'
                                : pt.milestone.isPromotion
                                ? '#A855F7'
                                : isSelected
                                ? colors.primaryAccent
                                : isPassed
                                ? colors.secondaryAccent
                                : '#475569'
                            }
                            stroke="#ffffff"
                            strokeWidth={isSelected ? 2.5 : 1.5}
                            filter={isSelected && showNodeGlow ? 'url(#node-glow)' : undefined}
                            className="transition-transform group-hover:scale-125"
                          />
                        )}

                        {/* Celebration Crown Floating on World Championship years */}
                        {pt.milestone.isWorldChampion && (
                          <g transform={`translate(${pt.x - 7}, ${pt.y - 20})`}>
                            <polygon
                              points="7,0 10,6 14,2 12,10 2,10 0,2 4,6"
                              fill="#F59E0B"
                              stroke="#78350F"
                              strokeWidth="0.5"
                              className={isCurrentAnimating ? 'animate-bounce' : ''}
                            />
                          </g>
                        )}

                        {/* Promotion rocket indicator */}
                        {pt.milestone.isPromotion && !pt.milestone.isWorldChampion && (
                          <circle
                            cx={pt.x}
                            cy={pt.y - 14}
                            r="3"
                            fill="#A855F7"
                            className="animate-pulse"
                          />
                        )}

                        {/* Year label below */}
                        <text
                          x={pt.x}
                          y={pt.y > 185 ? pt.y - 13 : pt.y + 19}
                          textAnchor="middle"
                          fill={isSelected ? '#ffffff' : isPassed ? colors.textPrimary : colors.textMuted}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                        >
                          '{pt.milestone.year.slice(-2)}
                        </text>
                      </g>
                    );
                  })}

                  {/* ANIMATED TRACER ORB (COMET HEAD) GLIDING AT CURRENT TIP */}
                  {isPlaying && (
                    <g transform={`translate(${activePoint.x}, ${activePoint.y})`}>
                      <circle r="15" fill="url(#tracer-glow)" className="animate-pulse" />
                      <circle r="5.5" fill="#FFFFFF" stroke={tracerColors.outer} strokeWidth="2" />
                    </g>
                  )}

                  {/* WORLD TITLE CELEBRATION BURST SPARKLES (When stopped on World Champion) */}
                  {selectedMilestone.isWorldChampion && (isPausedAtMilestone || isPlaying) && (
                    <g transform={`translate(${activePoint.x}, ${activePoint.y})`}>
                      <circle r="36" fill="url(#gold-celebration-burst)" className="animate-ping opacity-35" />
                      <polygon points="0,-24 4,-12 16,-12 6,-4 10,8 0,0 -10,8 -6,-4 -16,-12 -4,-12" fill="#F59E0B" opacity="0.8" className="animate-spin" />
                      <circle cx="18" cy="-18" r="2" fill="#FBBF24" className="animate-bounce" />
                      <circle cx="-18" cy="-16" r="2.5" fill="#F59E0B" className="animate-bounce" />
                      <circle cx="22" cy="12" r="2" fill="#FEF08A" className="animate-ping" />
                    </g>
                  )}

                  {/* =========================================================================
                      FLOATING MILESTONE SPOTLIGHT CALLOUT (Directly Above/At Node!)
                     ========================================================================= */}
                  {showFloatingCard && selectedMilestone && (
                    <g
                      transform={`translate(${Math.max(120, Math.min(680, activePoint.x))}, ${
                        activePoint.y <= 90 ? activePoint.y + 36 : activePoint.y - 68
                      })`}
                      className="pointer-events-none transition-all duration-300"
                    >
                      {/* Anchor pointer triangle */}
                      <polygon
                        points={
                          activePoint.y <= 90
                            ? '0,-6 -6,0 6,0'
                            : '0,58 -6,52 6,52'
                        }
                        fill="#0B1425"
                        stroke={selectedMilestone.isWorldChampion ? '#F59E0B' : colors.primaryAccent}
                        strokeWidth="1"
                      />

                      {/* Spotlight Card Body */}
                      <rect
                        x="-110"
                        y="0"
                        width="220"
                        height="52"
                        rx="8"
                        fill="#0B1425"
                        fillOpacity="0.95"
                        stroke={selectedMilestone.isWorldChampion ? '#F59E0B' : colors.primaryAccent}
                        strokeWidth="1.5"
                        filter="url(#node-glow)"
                      />

                      {/* Top Row: Year, Grade, Title Icon */}
                      <text x="-100" y="18" fill="#FFFFFF" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        {selectedMilestone.year} · {selectedMilestone.grade}
                      </text>

                      {selectedMilestone.isWorldChampion && (
                        <text x="96" y="18" textAnchor="end" fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          👑 WORLD TITLE
                        </text>
                      )}
                      {selectedMilestone.isPromotion && !selectedMilestone.isWorldChampion && (
                        <text x="96" y="18" textAnchor="end" fill="#C084FC" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          🚀 PROMOTION
                        </text>
                      )}

                      {/* Bottom Row: Event title */}
                      <text x="-100" y="34" fill={colors.textPrimary} fontSize="10" fontWeight="600">
                        {selectedMilestone.eventTitle.length > 28
                          ? selectedMilestone.eventTitle.slice(0, 28) + '...'
                          : selectedMilestone.eventTitle}
                      </text>

                      {/* Mini countdown timer bar inside card */}
                      {isPlaying && isPausedAtMilestone && (
                        <rect
                          x="-100"
                          y="42"
                          width={(200 * pauseProgress) / 100}
                          height="2"
                          rx="1"
                          fill={selectedMilestone.isWorldChampion ? '#F59E0B' : colors.primaryAccent}
                        />
                      )}
                    </g>
                  )}
                </svg>
              </div>
            </div>

            <p
              className="text-[11px] font-mono mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              style={{ color: colors.textMuted }}
            >
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3 text-[#8ABFFF]" />
                Tap Play to watch the animated trajectory stop at each milestone, or scrub nodes manually.
              </span>
              <span className="text-amber-400 font-semibold">{ascent.worldTitlesLabel}</span>
            </p>
          </div>
        )}

        {/* =========================================================================
            VIEW B: MOBILE-FIRST MILESTONES STEPPER CARDS
           ========================================================================= */}
        {viewMode === 'stepper' && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {milestones.map((m, idx) => {
                const isSelected = m.id === selectedMilestoneId;
                const isPassed = idx <= activeStepIndex;

                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMilestone(m.id)}
                    className="p-3.5 rounded-xl border transition-all cursor-pointer relative group text-left"
                    style={{
                      backgroundColor: isSelected ? `${colors.cardSurface}` : `${colors.cardSurface}90`,
                      borderColor: isSelected ? colors.primaryAccent : 'rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? `0 8px 24px -6px ${colors.primaryAccent}35` : 'none',
                    }}
                  >
                    {/* Top Row: Year, Grade, Status Badges */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-sm font-extrabold px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: isSelected ? colors.primaryAccent : `${colors.navySurface}`,
                            color: isSelected ? colors.bgDark : colors.textPrimary,
                          }}
                        >
                          {m.year}
                        </span>

                        <span
                          className="text-xs font-semibold"
                          style={{
                            color:
                              m.grade === 'Grade 1'
                                ? '#FBBF24'
                                : m.grade.includes('Novice')
                                ? '#34D399'
                                : colors.primaryAccent,
                          }}
                        >
                          {m.grade}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {m.isWorldChampion && (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            title="World Pipe Band Champions"
                          >
                            <Crown className="w-3 h-3 text-amber-400" />
                            <span>TITLE</span>
                          </span>
                        )}
                        {m.isPromotion && (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40"
                            title="RSPBA Grade Promotion"
                          >
                            <Rocket className="w-3 h-3 text-purple-400" />
                            <span>PROMO</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <h5 className="text-xs sm:text-sm font-bold text-white tracking-tight mb-1">
                      {m.eventTitle}
                    </h5>

                    {m.notes && (
                      <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: colors.textMuted }}>
                        {m.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            4. SPOTLIGHT MILESTONE INSPECTION DRAWER / BANNER (SYNCS TO TOUR!)
           ========================================================================= */}
        {selectedMilestone && (
          <div
            className={`mt-4 rounded-xl border transition-all animate-in fade-in overflow-hidden ${
              isPausedAtMilestone ? 'ring-2 ring-[#8ABFFF]/40 shadow-xl' : ''
            }`}
            style={{
              backgroundColor: colors.cardSurface,
              borderColor: isPausedAtMilestone ? colors.primaryAccent : `${colors.primaryAccent}35`,
            }}
          >
            {/* Countdown timer line along top when tour pauses at this milestone */}
            {isPlaying && isPausedAtMilestone && (
              <div className="w-full bg-[#111B2B] h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8ABFFF] via-emerald-400 to-amber-400 transition-all duration-75"
                  style={{ width: `${pauseProgress}%` }}
                />
              </div>
            )}

            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Details */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: colors.primaryAccent,
                      color: colors.bgDark,
                    }}
                  >
                    Season {selectedMilestone.year}
                  </span>

                  <span
                    className="text-xs font-bold"
                    style={{
                      color:
                        selectedMilestone.grade === 'Grade 1'
                          ? '#FBBF24'
                          : selectedMilestone.grade.includes('Novice')
                          ? '#34D399'
                          : colors.primaryAccent,
                    }}
                  >
                    {selectedMilestone.grade}
                  </span>

                  {selectedMilestone.isWorldChampion && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      <Crown className="w-3 h-3 text-amber-400" />
                      World Champions Title
                    </span>
                  )}

                  {selectedMilestone.isPromotion && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      <Rocket className="w-3 h-3 text-purple-400" />
                      Elevated Competitive Grade
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                  <span>{selectedMilestone.eventTitle}</span>
                </h4>

                {selectedMilestone.notes && (
                  <p className="text-xs max-w-2xl leading-relaxed" style={{ color: colors.textMuted }}>
                    {selectedMilestone.notes}
                  </p>
                )}
              </div>

              {/* Right: Milestone Prev / Next Navigation & Pause Option */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                {isPlaying && (
                  <button
                    type="button"
                    onClick={() => setIsPlaying(false)}
                    className="px-2.5 py-1 rounded text-xs font-mono border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 cursor-pointer"
                  >
                    Hold Here
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePrevMilestone}
                  disabled={selectedIndex <= 0}
                  className="p-2 rounded-lg border text-xs font-mono transition-colors disabled:opacity-30 cursor-pointer"
                  style={{
                    backgroundColor: colors.navySurface,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: colors.textPrimary,
                  }}
                  title="Previous Milestone"
                  aria-label="Previous Milestone"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-[11px] font-mono text-white/50 px-1">
                  {selectedIndex + 1} / {milestones.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextMilestone}
                  disabled={selectedIndex >= milestones.length - 1}
                  className="p-2 rounded-lg border text-xs font-mono transition-colors disabled:opacity-30 cursor-pointer"
                  style={{
                    backgroundColor: colors.navySurface,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: colors.textPrimary,
                  }}
                  title="Next Milestone"
                  aria-label="Next Milestone"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
