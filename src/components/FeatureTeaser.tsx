import React, { useState } from 'react';
import { 
  Trophy, 
  Swords, 
  Scale, 
  TrendingUp, 
  Sparkles,
  Flame,
  Music,
  CheckCircle,
  Compass,
  Users,
  Award,
  Crown,
  Rocket
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';
import { GradeProgressionChart } from './GradeProgressionChart.tsx';

type TeaserTab = 'ascent' | 'judges' | 'rivalries' | 'trophies';

export const FeatureTeaser: React.FC = () => {
  const { settings } = useSettings();
  const { features, charts, colors } = settings;
  const [activeTab, setActiveTab] = useState<TeaserTab>('ascent');

  const {
    ascent = {
      bandName: 'Inveraray and District',
      journeySubtitle: 'Chronological ascent from Novice Juvenile (2005) through to Grade 1 (2026).',
      startingGrade: 'Novice Juvenile',
      startingYear: '2005',
      peakGrade: 'Grade 1',
      peakSubtitle: 'Premier Flight',
      promotionsCount: '3',
      promotionsSubtitle: 'Tiers Climbed',
      yearsToGrade1: '6 Yrs',
      speedSubtitle: 'Ascent Speed',
      trajectoryGradientStart: '#10B981',
      trajectoryGradientMid: '#8ABFFF',
      trajectoryGradientEnd: '#A855F7',
      worldTitlesLabel: 'Grade 1 World Champions in 2017 & 2019',
      landmark1Label: "'07 WORLDS",
      landmark2Label: "'08 WORLDS & PROMO",
      landmark3Label: "'09 WORLDS & PROMO",
      landmark4Label: "'10 TO GRADE 1",
      landmark5Label: "'17 WORLDS",
      landmark6Label: "'19 WORLDS",
    },
    adjudicator = {
      adjudicatorName: 'James Campbell',
      discipline: 'Piping 1',
      careerSpan: '1999 – 2026 (28 Years)',
      worldsPanels: '54 World Championship Panels',
      majorAppearances: '160',
      assignments: '574',
      bandsScored: '4341',
      contests: '179',
      majors: '160',
    },
    rivalry = {
      band1Name: 'Field Marshal Montgomery',
      band1Wins: 34,
      band1WinPercent: '58.6%',
      band1Color: '#8ABFFF',
      band2Name: 'Inveraray & District',
      band2Wins: 22,
      band2WinPercent: '37.9%',
      band2Color: '#34D399',
      drawsCount: 2,
      pipingScore: 'FMM 36 · IDPB 20',
      drummingScore: 'IDPB 33 · FMM 22',
      ensembleScore: 'FMM 31 · IDPB 25',
      iconicDeciderTitle: 'Iconic Decider: 2019 World Championship Final',
      iconicDeciderDesc: 'Tied at 13-13 aggregate. Inveraray captured the World Title on Drumming countback (2nd vs 3rd).',
    },
    trophy = {
      bandName: 'PEOPLES FORD BOGHALL & BATHGATE CALEDONIA',
      bandSummary: '18 Major Titles · 2 World Championships · 14 World Drumming Banners',
      trophy1Title: 'WORLD CHAMP',
      trophy1Year: '2023',
      trophy1Score: 'Score: 10 pts',
      trophy2Title: 'WORLD DRUMS',
      trophy2Year: '2023 & 2012',
      trophy2Score: '14 Career Banners',
      trophy3Title: 'SCOTTISH',
      trophy3Year: '2019 & 2017',
      trophy3Score: 'Dumbarton',
      trophy4Title: 'CHAMPIONS',
      trophy4Year: '2023 Season',
      trophy4Score: 'Overall Season',
      leadershipText: 'Leadership: P/M Ross Harvey · L/D Kerr McQuillan',
    },
  } = charts || {};

  return (
    <section
      id="features"
      className="relative py-12 sm:py-20 border-t border-white/[0.06] overflow-hidden transition-colors"
      style={{
        backgroundColor: colors.bgDark,
        color: colors.textPrimary,
      }}
    >
      {/* Subtle atmospheric glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] blur-[150px] pointer-events-none opacity-20"
        style={{ backgroundColor: colors.secondaryAccent }}
      />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-10">
          {features.tag && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium mb-3 border"
              style={{
                backgroundColor: colors.navySurface,
                borderColor: `${colors.primaryAccent}40`,
                color: colors.primaryAccent,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{features.tag}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans mb-2 sm:mb-4">
            {features.title}
          </h2>
          <p className="text-xs sm:text-base max-w-2xl mx-auto" style={{ color: colors.textMuted }}>
            {features.subtitle}
          </p>
        </div>

        {/* Feature Tab Selector - Mobile friendly horizontal scroll/wrap */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 mb-6 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
          {/* Tab 1 */}
          <button
            type="button"
            onClick={() => setActiveTab('ascent')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border shrink-0"
            style={{
              backgroundColor: activeTab === 'ascent' ? colors.primaryAccent : colors.cardSurface,
              color: activeTab === 'ascent' ? colors.bgDark : colors.textMuted,
              borderColor: activeTab === 'ascent' ? colors.primaryAccent : 'rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'ascent' ? `0 6px 16px -4px ${colors.primaryAccent}40` : 'none',
            }}
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Grade Ascent</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeTab === 'ascent' ? 'bg-black/20 text-current' : 'bg-purple-500/20 text-purple-300'
            }`}>
              ASCENT
            </span>
          </button>

          {/* Tab 2 */}
          <button
            type="button"
            onClick={() => setActiveTab('judges')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border shrink-0"
            style={{
              backgroundColor: activeTab === 'judges' ? colors.primaryAccent : colors.cardSurface,
              color: activeTab === 'judges' ? colors.bgDark : colors.textMuted,
              borderColor: activeTab === 'judges' ? colors.primaryAccent : 'rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'judges' ? `0 6px 16px -4px ${colors.primaryAccent}40` : 'none',
            }}
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Judges & Variance</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeTab === 'judges' ? 'bg-black/20 text-current' : 'bg-blue-500/20 text-blue-300'
            }`}>
              JUDGES
            </span>
          </button>

          {/* Tab 3 */}
          <button
            type="button"
            onClick={() => setActiveTab('rivalries')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border shrink-0"
            style={{
              backgroundColor: activeTab === 'rivalries' ? colors.primaryAccent : colors.cardSurface,
              color: activeTab === 'rivalries' ? colors.bgDark : colors.textMuted,
              borderColor: activeTab === 'rivalries' ? colors.primaryAccent : 'rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'rivalries' ? `0 6px 16px -4px ${colors.primaryAccent}40` : 'none',
            }}
          >
            <Swords className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Rivalry Arena</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeTab === 'rivalries' ? 'bg-black/20 text-current' : 'bg-rose-500/20 text-rose-300'
            }`}>
              CLASH
            </span>
          </button>

          {/* Tab 4 */}
          <button
            type="button"
            onClick={() => setActiveTab('trophies')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border shrink-0"
            style={{
              backgroundColor: activeTab === 'trophies' ? colors.primaryAccent : colors.cardSurface,
              color: activeTab === 'trophies' ? colors.bgDark : colors.textMuted,
              borderColor: activeTab === 'trophies' ? colors.primaryAccent : 'rgba(255, 255, 255, 0.08)',
              boxShadow: activeTab === 'trophies' ? `0 6px 16px -4px ${colors.primaryAccent}40` : 'none',
            }}
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Trophy Cabinet</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeTab === 'trophies' ? 'bg-black/20 text-current' : 'bg-amber-500/20 text-amber-300'
            }`}>
              MAJORS
            </span>
          </button>
        </div>

        {/* Dynamic Interactive Card Display */}
        <div
          className="rounded-2xl border shadow-xl p-3.5 sm:p-6 md:p-8 transition-all duration-300"
          style={{
            backgroundColor: colors.cardSurface,
            borderColor: 'rgba(255, 255, 255, 0.08)',
          }}
        >

          {/* =========================================================================
              TAB 1: ASCENT JOURNEY CHART (CONFIGURABLE & MOBILE-REDESIGNED)
             ========================================================================= */}
          {activeTab === 'ascent' && (
            <div className="animate-in fade-in duration-300">
              <GradeProgressionChart ascent={ascent} />
            </div>
          )}

          {/* =========================================================================
              TAB 2: JAMES CAMPBELL - ADJUDICATOR PROFILE (CONFIGURABLE)
             ========================================================================= */}
          {activeTab === 'judges' && (
            <div className="animate-in fade-in duration-300 space-y-4 sm:space-y-6">
              <div
                className="rounded-xl p-4 sm:p-6 border"
                style={{
                  backgroundColor: colors.navySurface,
                  borderColor: `${colors.primaryAccent}25`,
                }}
              >
                <div className="flex flex-col sm:flex-row items-start gap-3.5 sm:gap-5 mb-4 sm:mb-5">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl border flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: colors.navySurface,
                      borderColor: `${colors.primaryAccent}40`,
                      color: colors.primaryAccent,
                    }}
                  >
                    <Music className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>

                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      {adjudicator.adjudicatorName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono">
                        <CheckCircle className="w-3 h-3" />
                        Canonical Adjudicator
                      </span>

                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono border"
                        style={{
                          backgroundColor: colors.navySurface,
                          borderColor: `${colors.primaryAccent}30`,
                          color: colors.primaryAccent,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primaryAccent }} />
                        {adjudicator.discipline}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-[#11213A] border border-white/[0.08] text-[#A7B4C7] text-[11px] font-mono">
                        Career: {adjudicator.careerSpan}
                      </span>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/50 border border-amber-500/40 text-amber-300 text-[11px] font-mono">
                        <Crown className="w-3 h-3 text-amber-400" />
                        {adjudicator.worldsPanels}
                      </span>
                    </div>

                    <div className="pt-1 text-[11px] font-mono text-[#A7B4C7]">
                      Historical marks tracked: <span className="text-white">J Campbell (433)</span> · <span className="text-white">James Campbell (87)</span> · <span className="text-white">Jim Campbell (35)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[#A7B4C7]">
                      MAJOR BENCH APPEARANCES
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
                        {adjudicator.majorAppearances}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-[#A7B4C7]">
                    {adjudicator.bandsScored} performances evaluated
                  </div>
                </div>
              </div>

              {/* 4 Stat Tiles */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                <div className="bg-[#0E1726] rounded-xl p-3.5 sm:p-4 border border-white/[0.06] flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-0.5">ASSIGNMENTS</div>
                    <div className="text-lg sm:text-2xl font-bold text-white font-mono">{adjudicator.assignments}</div>
                    <div className="text-[11px] text-[#A7B4C7]">Rounds officiated</div>
                  </div>
                  <Scale className="w-4 h-4 text-indigo-400" />
                </div>

                <div className="bg-[#0E1726] rounded-xl p-3.5 sm:p-4 border border-white/[0.06] flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-0.5">BANDS SCORED</div>
                    <div className="text-lg sm:text-2xl font-bold text-white font-mono">{adjudicator.bandsScored}</div>
                    <div className="text-[11px] text-[#A7B4C7]">Scores logged</div>
                  </div>
                  <Users className="w-4 h-4" style={{ color: colors.primaryAccent }} />
                </div>

                <div className="bg-[#0E1726] rounded-xl p-3.5 sm:p-4 border border-white/[0.06] flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-0.5">CONTESTS</div>
                    <div className="text-lg sm:text-2xl font-bold text-white font-mono">{adjudicator.contests}</div>
                    <div className="text-[11px] text-[#A7B4C7]">Events attended</div>
                  </div>
                  <Compass className="w-4 h-4 text-purple-400" />
                </div>

                <div className="bg-[#0E1726] rounded-xl p-3.5 sm:p-4 border border-white/[0.06] flex items-start justify-between">
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-0.5">MAJORS</div>
                    <div className="text-lg sm:text-2xl font-bold text-amber-400 font-mono">{adjudicator.majors}</div>
                    <div className="text-[11px] text-[#A7B4C7]">Championship panels</div>
                  </div>
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: RIVALRY ARENA (CONFIGURABLE)
             ========================================================================= */}
          {activeTab === 'rivalries' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start justify-between">
                <div className="lg:max-w-sm space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider" style={{ color: colors.primaryAccent }}>
                    <Swords className="w-3.5 h-3.5" />
                    <span>Head-to-Head Clash Arena</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Relive Legendary Band Rivalries
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A7B4C7] leading-relaxed">
                    Pit any two bands in history head-to-head. Trace every encounter across 28 years, compare section supremacy, and uncover the deciders decided on countback.
                  </p>
                </div>

                {/* Rivalry Arena Mockup */}
                <div className="w-full lg:flex-1 bg-[#0B1425] rounded-xl border border-white/[0.06] p-4 sm:p-5 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] mb-3">
                    <span className="font-semibold text-[11px]" style={{ color: colors.primaryAccent }}>
                      HEAD-TO-HEAD CLASH RECORDS
                    </span>
                    <span className="text-[10px] text-[#A7B4C7]">
                      {rivalry.band1Wins + rivalry.band2Wins + rivalry.drawsCount} CLASHES
                    </span>
                  </div>

                  {/* Band vs Band Header */}
                  <div className="flex items-center justify-between font-sans text-xs sm:text-sm font-bold text-white mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rivalry.band1Color }} />
                      <span className="truncate max-w-[120px] sm:max-w-none">{rivalry.band1Name}</span>
                    </div>
                    <span className="text-[#A7B4C7] font-mono text-xs px-2">VS</span>
                    <div className="flex items-center gap-1.5 text-right">
                      <span className="truncate max-w-[120px] sm:max-w-none">{rivalry.band2Name}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rivalry.band2Color }} />
                    </div>
                  </div>

                  {/* Clash Stat Bar */}
                  <div className="bg-[#11213A] p-3 rounded-lg border border-white/[0.04] mb-3">
                    <div className="flex justify-between text-[11px] font-bold mb-1.5">
                      <span style={{ color: rivalry.band1Color }}>{rivalry.band1Wins} Wins ({rivalry.band1WinPercent})</span>
                      <span className="text-[#A7B4C7] text-[10px]">{rivalry.drawsCount} Ties</span>
                      <span style={{ color: rivalry.band2Color }}>{rivalry.band2Wins} Wins ({rivalry.band2WinPercent})</span>
                    </div>
                    <div className="h-2 w-full bg-[#0B1425] rounded-full overflow-hidden flex">
                      <div className="h-full" style={{ width: rivalry.band1WinPercent, backgroundColor: rivalry.band1Color }} />
                      <div className="bg-white/30 h-full" style={{ width: '4%' }} />
                      <div className="h-full" style={{ width: rivalry.band2WinPercent, backgroundColor: rivalry.band2Color }} />
                    </div>
                  </div>

                  {/* Section Supremacy */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] mb-3">
                    <div className="bg-[#111B2B] p-2 rounded-lg">
                      <div className="text-[#A7B4C7]">PIPING SECTION</div>
                      <div className="text-white font-bold mt-0.5">{rivalry.pipingScore}</div>
                    </div>
                    <div className="bg-[#111B2B] p-2 rounded-lg">
                      <div className="text-[#A7B4C7]">DRUM CORPS</div>
                      <div className="font-bold mt-0.5" style={{ color: rivalry.band2Color }}>{rivalry.drummingScore}</div>
                    </div>
                    <div className="bg-[#111B2B] p-2 rounded-lg">
                      <div className="text-[#A7B4C7]">ENSEMBLE</div>
                      <div className="text-white font-bold mt-0.5">{rivalry.ensembleScore}</div>
                    </div>
                  </div>

                  {/* Drumming Tie-Break Decider Highlight */}
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] text-rose-200">
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{rivalry.iconicDeciderTitle}</span>
                    </div>
                    <span>{rivalry.iconicDeciderDesc}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: VIRTUAL TROPHY CABINET (CONFIGURABLE)
             ========================================================================= */}
          {activeTab === 'trophies' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-start justify-between">
                <div className="lg:max-w-sm space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider" style={{ color: colors.primaryAccent }}>
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Digital Heritage & Trophy Cases</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Interactive Band Profiles & Trophy Cabinets
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A7B4C7] leading-relaxed">
                    Every band in the 28-year archive receives a dedicated digital sanctuary. Track Pipe Majors and Leading Drummers across seasons, explore promotions, and inspect virtual trophy cabinets.
                  </p>
                </div>

                {/* Trophy Cabinet Mockup */}
                <div className="w-full lg:flex-1 bg-[#0B1425] rounded-xl border border-white/[0.06] p-4 sm:p-5 font-mono text-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] mb-3">
                    <div>
                      <span className="font-semibold text-xs block font-sans truncate" style={{ color: colors.primaryAccent }}>
                        {trophy.bandName}
                      </span>
                      <span className="text-[10px] text-[#A7B4C7]">{trophy.bandSummary}</span>
                    </div>
                    <Award className="w-5 h-5 shrink-0" style={{ color: colors.primaryAccent }} />
                  </div>

                  {/* 4 Trophy Showcase Items (2x2 on mobile) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    <div
                      className="p-2.5 rounded-lg border text-center flex flex-col justify-between"
                      style={{
                        backgroundColor: colors.navySurface,
                        borderColor: `${colors.primaryAccent}40`,
                      }}
                    >
                      <div className="text-xl mb-0.5">🌍</div>
                      <div className="font-bold text-white text-[10px]">{trophy.trophy1Title}</div>
                      <div className="text-[10px] font-bold" style={{ color: colors.primaryAccent }}>{trophy.trophy1Year}</div>
                      <div className="text-[#A7B4C7] text-[9px]">{trophy.trophy1Score}</div>
                    </div>

                    <div className="bg-[#11213A] p-2.5 rounded-lg border border-white/[0.06] text-center flex flex-col justify-between">
                      <div className="text-xl mb-0.5">🥁</div>
                      <div className="font-bold text-white text-[10px]">{trophy.trophy2Title}</div>
                      <div className="text-[10px] font-bold" style={{ color: colors.primaryAccent }}>{trophy.trophy2Year}</div>
                      <div className="text-[#A7B4C7] text-[9px]">{trophy.trophy2Score}</div>
                    </div>

                    <div className="bg-[#11213A] p-2.5 rounded-lg border border-white/[0.06] text-center flex flex-col justify-between">
                      <div className="text-xl mb-0.5">🏴󠁧󠁢󠁳󠁣󠁴󠁿</div>
                      <div className="font-bold text-white text-[10px]">{trophy.trophy3Title}</div>
                      <div className="text-[10px] font-bold" style={{ color: colors.primaryAccent }}>{trophy.trophy3Year}</div>
                      <div className="text-[#A7B4C7] text-[9px]">{trophy.trophy3Score}</div>
                    </div>

                    <div className="bg-[#11213A] p-2.5 rounded-lg border border-white/[0.06] text-center flex flex-col justify-between">
                      <div className="text-xl mb-0.5">🎖️</div>
                      <div className="font-bold text-white text-[10px]">{trophy.trophy4Title}</div>
                      <div className="text-[10px] font-bold" style={{ color: colors.primaryAccent }}>{trophy.trophy4Year}</div>
                      <div className="text-[#A7B4C7] text-[9px]">{trophy.trophy4Score}</div>
                    </div>
                  </div>

                  <div className="bg-[#111B2B] p-2 rounded-lg border border-white/[0.04] text-[10px] text-[#A7B4C7] flex flex-wrap justify-between items-center gap-1">
                    <span>{trophy.leadershipText}</span>
                    <span style={{ color: colors.primaryAccent }}>Scorecards archive →</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
