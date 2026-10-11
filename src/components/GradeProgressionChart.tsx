import React, { useState } from 'react';
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
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';
import { AscentMilestone, AscentChartConfig, DEFAULT_WEBSITE_SETTINGS } from '../types/settings.ts';

interface GradeProgressionChartProps {
  ascent?: AscentChartConfig;
}

export const GradeProgressionChart: React.FC<GradeProgressionChartProps> = ({ ascent: propAscent }) => {
  const { settings } = useSettings();
  const { colors } = settings;

  const ascent = propAscent || settings.charts?.ascent || DEFAULT_WEBSITE_SETTINGS.charts.ascent;
  const milestones: AscentMilestone[] =
    ascent.milestones && ascent.milestones.length > 0
      ? ascent.milestones
      : (DEFAULT_WEBSITE_SETTINGS.charts.ascent.milestones as AscentMilestone[]);

  // Default to stepper on mobile or user preference
  const [viewMode, setViewMode] = useState<'stepper' | 'curve'>(
    ascent.defaultMobileView || 'stepper'
  );
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    milestones[milestones.length - 1]?.id || 'm1'
  );

  const selectedMilestone =
    milestones.find((m) => m.id === selectedMilestoneId) || milestones[0];
  const selectedIndex = milestones.findIndex((m) => m.id === selectedMilestoneId);

  // Gradient trajectory colors tied to theme
  const gradStart = ascent.accentThemeMatch !== false ? colors.secondaryAccent : ascent.trajectoryGradientStart;
  const gradMid = ascent.accentThemeMatch !== false ? colors.primaryAccent : ascent.trajectoryGradientMid;
  const gradEnd = ascent.trajectoryGradientEnd || '#F59E0B';

  const strokeWidth =
    ascent.curveStrokeWidth === 'fine' ? '2' : ascent.curveStrokeWidth === 'bold' ? '5' : '3.5';
  const showGridlines = ascent.showGridlines !== false;
  const showNodeGlow = ascent.showNodeGlow !== false;

  const handlePrevMilestone = () => {
    if (selectedIndex > 0) {
      setSelectedMilestoneId(milestones[selectedIndex - 1].id);
    }
  };

  const handleNextMilestone = () => {
    if (selectedIndex < milestones.length - 1) {
      setSelectedMilestoneId(milestones[selectedIndex + 1].id);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header Badges & Ascent Overview Banner */}
      <div
        className="rounded-xl p-4 sm:p-6 border transition-all"
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
              <span>HISTORIC GRADE PROGRESSION</span>
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
          </div>

          {/* View Mode Toggle: Stepper vs Curve */}
          <div
            className="inline-flex p-0.5 rounded-lg border text-xs font-mono select-none"
            style={{
              backgroundColor: colors.cardSurface,
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
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
              <span>Curve</span>
            </button>
          </div>
        </div>

        {/* Band Headline */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          {ascent.bandName}{' '}
          <span
            className="font-normal text-base sm:text-xl md:text-2xl block sm:inline mt-0.5 sm:mt-0"
            style={{ color: colors.primaryAccent }}
          >
            Grade Ascent Journey
          </span>
        </h3>
        <p className="text-xs sm:text-sm mt-1" style={{ color: colors.textMuted }}>
          {ascent.journeySubtitle}
        </p>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mt-4 sm:mt-5">
          <div
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: colors.cardSurface,
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5" style={{ color: colors.textMuted }}>
              STARTING GRADE
            </div>
            <div className="text-xs sm:text-sm font-bold text-emerald-400 truncate">
              {ascent.startingGrade}
            </div>
            <div className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
              ({ascent.startingYear})
            </div>
          </div>

          <div
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: colors.cardSurface,
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5" style={{ color: colors.textMuted }}>
              PEAK GRADE
            </div>
            <div className="text-xs sm:text-sm font-bold text-amber-300 truncate">
              {ascent.peakGrade}
            </div>
            <div className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
              ({ascent.peakSubtitle})
            </div>
          </div>

          <div
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: colors.cardSurface,
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5" style={{ color: colors.textMuted }}>
              PROMOTIONS
            </div>
            <div className="text-sm sm:text-lg font-bold font-mono" style={{ color: colors.primaryAccent }}>
              {ascent.promotionsCount}
            </div>
            <div className="text-[10px]" style={{ color: colors.textMuted }}>
              {ascent.promotionsSubtitle}
            </div>
          </div>

          <div
            className="rounded-lg p-3 border"
            style={{
              backgroundColor: colors.cardSurface,
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-0.5" style={{ color: colors.textMuted }}>
              TO GRADE 1
            </div>
            <div className="text-sm sm:text-lg font-bold font-mono text-white">
              {ascent.yearsToGrade1}
            </div>
            <div className="text-[10px]" style={{ color: colors.textMuted }}>
              {ascent.speedSubtitle}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Visual Area */}
      <div
        className="rounded-xl p-3.5 sm:p-6 border relative overflow-hidden"
        style={{
          backgroundColor: colors.navySurface,
          borderColor: `${colors.primaryAccent}20`,
        }}
      >
        {/* Top Header of Visual Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color: colors.primaryAccent }} />
              <span>RSPBA Competitive Grade Trajectory</span>
            </h4>
            <p className="text-[11px] mt-0.5" style={{ color: colors.textMuted }}>
              Timeline of annual plateaus, promotions, and major World Championship titles
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

        {/* =========================================================================
            VIEW A: MOBILE-FIRST MILESTONES STEPPER
           ========================================================================= */}
        {viewMode === 'stepper' && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            {/* Quick interactive year pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
              {milestones.map((m) => {
                const isSelected = m.id === selectedMilestoneId;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMilestoneId(m.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer border flex items-center gap-1"
                    style={{
                      backgroundColor: isSelected ? colors.primaryAccent : colors.cardSurface,
                      color: isSelected ? colors.bgDark : colors.textPrimary,
                      borderColor: isSelected ? colors.primaryAccent : 'rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? `0 4px 12px ${colors.primaryAccent}30` : 'none',
                    }}
                  >
                    <span>'{m.year.slice(-2)}</span>
                    {m.isWorldChampion && <Crown className="w-2.5 h-2.5 text-amber-400" />}
                    {m.isPromotion && <Rocket className="w-2.5 h-2.5 text-purple-400" />}
                  </button>
                );
              })}
            </div>

            {/* Stepper Timeline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {milestones.map((m) => {
                const isSelected = m.id === selectedMilestoneId;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(m.id)}
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

                    {/* Event Title */}
                    <h5 className="text-xs sm:text-sm font-bold text-white tracking-tight mb-1">
                      {m.eventTitle}
                    </h5>

                    {/* Notes */}
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
            VIEW B: RESPONSIVE TRAJECTORY CURVE (SVG)
           ========================================================================= */}
        {viewMode === 'curve' && (
          <div className="animate-in fade-in duration-200">
            {/* The Responsive Trajectory SVG Canvas */}
            <div
              className="w-full relative rounded-xl border p-2 sm:p-4 select-none overflow-hidden"
              style={{
                backgroundColor: colors.cardSurface,
                borderColor: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Grade Y-Axis Labels overlay on the left */}
              <div className="absolute left-2.5 top-4 bottom-8 flex flex-col justify-between text-[10px] sm:text-[11px] font-mono font-semibold pointer-events-none z-10">
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
                  className="w-full h-[220px] sm:h-[280px] overflow-visible"
                  viewBox="0 0 800 240"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="progression-chart-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={gradStart} />
                      <stop offset="50%" stopColor={gradMid} />
                      <stop offset="100%" stopColor={gradEnd} />
                    </linearGradient>

                    <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal Guideline Grids */}
                  {showGridlines && (
                    <g>
                      <line x1="0" y1="20" x2="800" y2="20" stroke="#F59E0B" strokeWidth="1" strokeDasharray="5 3" opacity="0.4" />
                      <line x1="0" y1="60" x2="800" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                      <line x1="0" y1="105" x2="800" y2="105" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                      <line x1="0" y1="150" x2="800" y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <line x1="0" y1="190" x2="800" y2="190" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <line x1="0" y1="225" x2="800" y2="225" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                    </g>
                  )}

                  {/* Optional Rival Benchmark Baseline */}
                  {ascent.rivalOverlayBandName && (
                    <g opacity="0.55">
                      <path
                        d="M 20 20 L 780 20"
                        stroke="#94A3B8"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        fill="none"
                      />
                      <text x="775" y="14" textAnchor="end" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                        Benchmark: {ascent.rivalOverlayBandName} (Grade 1)
                      </text>
                    </g>
                  )}

                  {/* Dynamic Trajectory Curve Path */}
                  <path
                    d="M 20 225 L 70 225 C 110 225, 120 115, 150 105 C 180 95, 200 65, 230 60 C 260 55, 280 20, 310 20 L 780 20"
                    stroke="url(#progression-chart-gradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Render Milestone Nodes mapped along the trajectory */}
                  {milestones.map((m, idx) => {
                    // Approximate X and Y along the trajectory
                    let cx = 20 + idx * 85;
                    let cy = 20;
                    if (m.grade.includes('Novice')) {
                      cy = 225;
                      cx = 20 + idx * 45;
                    } else if (m.grade.includes('Juvenile') && !m.grade.includes('Novice')) {
                      cy = 105;
                      cx = 150;
                    } else if (m.grade === 'Grade 2') {
                      cy = 60;
                      cx = 220 + (idx > 2 ? 30 : 0);
                    } else {
                      // Grade 1
                      cy = 20;
                      cx = 310 + (idx - 4) * 85;
                      if (cx > 780) cx = 780;
                    }

                    const isSelected = m.id === selectedMilestoneId;

                    return (
                      <g
                        key={m.id}
                        className="cursor-pointer group"
                        onClick={() => setSelectedMilestoneId(m.id)}
                      >
                        {/* Invisible larger touch target for mobile fingers */}
                        <circle cx={cx} cy={cy} r="18" fill="transparent" />

                        {/* Selected halo */}
                        {isSelected && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="11"
                            fill="none"
                            stroke={m.isWorldChampion ? '#F59E0B' : colors.primaryAccent}
                            strokeWidth="2"
                            strokeDasharray="2 2"
                            className="animate-spin"
                            style={{ transformOrigin: `${cx}px ${cy}px` }}
                          />
                        )}

                        {/* Outer colored dot */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSelected ? 7 : m.isWorldChampion ? 6.5 : 5}
                          fill={
                            m.isWorldChampion
                              ? '#F59E0B'
                              : m.isPromotion
                              ? '#A855F7'
                              : isSelected
                              ? colors.primaryAccent
                              : colors.secondaryAccent
                          }
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 2 : 1.5}
                          filter={isSelected && showNodeGlow ? 'url(#node-glow)' : undefined}
                        />

                        {/* Year label below */}
                        <text
                          x={cx}
                          y={cy > 180 ? cy - 12 : cy + 18}
                          textAnchor="middle"
                          fill={isSelected ? '#ffffff' : colors.textMuted}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                        >
                          '{m.year.slice(-2)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <p className="text-[11px] font-mono mt-2 flex items-center justify-between" style={{ color: colors.textMuted }}>
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                Tap any node along the curve to inspect historic contest marks
              </span>
              <span className="text-amber-400 font-semibold">{ascent.worldTitlesLabel}</span>
            </p>
          </div>
        )}

        {/* =========================================================================
            3. INTERACTIVE SELECTED MILESTONE INSPECTION DRAWER / BANNER
           ========================================================================= */}
        {selectedMilestone && (
          <div
            className="mt-4 p-4 rounded-xl border transition-all animate-in fade-in"
            style={{
              backgroundColor: colors.cardSurface,
              borderColor: `${colors.primaryAccent}35`,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Details */}
              <div className="space-y-1">
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
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Crown className="w-3 h-3 text-amber-400" />
                      World Champions
                    </span>
                  )}

                  {selectedMilestone.isPromotion && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      <Rocket className="w-3 h-3 text-purple-400" />
                      Elevated Grade
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  {selectedMilestone.eventTitle}
                </h4>

                {selectedMilestone.notes && (
                  <p className="text-xs max-w-2xl leading-relaxed" style={{ color: colors.textMuted }}>
                    {selectedMilestone.notes}
                  </p>
                )}
              </div>

              {/* Right: Milestone Prev / Next Navigation */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
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
