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

type TeaserTab = 'ascent' | 'judges' | 'rivalries' | 'trophies';

export const FeatureTeaser: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TeaserTab>('ascent');

  return (
    <section id="features" className="relative py-20 sm:py-28 bg-[#0B1425] border-t border-white/[0.06] overflow-hidden">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#4C9FFF]/8 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11213A] border border-[#8ABFFF]/25 text-[#8ABFFF] text-xs font-mono font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMING SOON · PLATFORM TEASERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F8FC] tracking-tight font-sans mb-4">
            Unlocking 28 years of competitive history.
          </h2>
          <p className="text-base sm:text-lg text-[#A7B4C7]">
            Explore the flagship modules launching soon on PipeBand.app, built directly from official 1998–2026 championship records.
          </p>
        </div>

        {/* Feature Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {/* Tab 1: Inveraray Rising Through The Grades */}
          <button
            type="button"
            onClick={() => setActiveTab('ascent')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'ascent'
                ? 'bg-[#8ABFFF] text-[#0B1425] shadow-lg shadow-[#8ABFFF]/25'
                : 'bg-[#111B2B] text-[#A7B4C7] hover:text-[#F5F8FC] hover:bg-[#11213A] border border-white/[0.06]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Grade Ascent Journey</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              activeTab === 'ascent' ? 'bg-[#0B1425]/20 text-[#0B1425]' : 'bg-purple-500/20 text-purple-300'
            }`}>
              INVERARAY '05–'26
            </span>
          </button>

          {/* Tab 2: Adjudicator Profile (James Campbell) */}
          <button
            type="button"
            onClick={() => setActiveTab('judges')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'judges'
                ? 'bg-[#8ABFFF] text-[#0B1425] shadow-lg shadow-[#8ABFFF]/25'
                : 'bg-[#111B2B] text-[#A7B4C7] hover:text-[#F5F8FC] hover:bg-[#11213A] border border-white/[0.06]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Judges & Variance</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              activeTab === 'judges' ? 'bg-[#0B1425]/20 text-[#0B1425]' : 'bg-[#4C9FFF]/20 text-[#8ABFFF]'
            }`}>
              J. CAMPBELL PROFILE
            </span>
          </button>

          {/* Tab 3: Rivalry Arena */}
          <button
            type="button"
            onClick={() => setActiveTab('rivalries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'rivalries'
                ? 'bg-[#8ABFFF] text-[#0B1425] shadow-lg shadow-[#8ABFFF]/25'
                : 'bg-[#111B2B] text-[#A7B4C7] hover:text-[#F5F8FC] hover:bg-[#11213A] border border-white/[0.06]'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Rivalry Arena</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              activeTab === 'rivalries' ? 'bg-[#0B1425]/20 text-[#0B1425]' : 'bg-rose-500/20 text-rose-300'
            }`}>
              FMM VS IDPB
            </span>
          </button>

          {/* Tab 4: Virtual Trophy Cabinets */}
          <button
            type="button"
            onClick={() => setActiveTab('trophies')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'trophies'
                ? 'bg-[#8ABFFF] text-[#0B1425] shadow-lg shadow-[#8ABFFF]/25'
                : 'bg-[#111B2B] text-[#A7B4C7] hover:text-[#F5F8FC] hover:bg-[#11213A] border border-white/[0.06]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Virtual Trophy Cabinet</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
              activeTab === 'trophies' ? 'bg-[#0B1425]/20 text-[#0B1425]' : 'bg-amber-500/20 text-amber-300'
            }`}>
              THE 5 MAJORS
            </span>
          </button>
        </div>

        {/* Dynamic Interactive Card Display */}
        <div className="bg-[#111B2B] rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/50 p-5 sm:p-7 md:p-9 transition-all duration-300">

          {/* =========================================================================
              TAB 1: INVERARAY RISING THROUGH THE GRADES (LAYOUT & DATA FROM SCREENSHOTS)
             ========================================================================= */}
          {activeTab === 'ascent' && (
            <div className="animate-in fade-in duration-300 space-y-6">
              {/* Header Badges & Title Block */}
              <div className="bg-[#0E1726] rounded-2xl p-6 sm:p-7 border border-white/[0.06]">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium">
                    <Rocket className="w-3.5 h-3.5" />
                    <span>HISTORIC GRADE PROGRESSION</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>RISEN THROUGH 3 GRADE TIERS</span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                  Inveraray and District <span className="text-[#8ABFFF] font-normal text-xl sm:text-2xl">Grade Ascent Journey</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#A7B4C7]">
                  Chronological ascent from Novice Juvenile (2005) through to Grade 1 (2026).
                </p>

                {/* 4 Summary Cards (Exact data & layout from screenshot 2 & 3) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
                  {/* Card 1: Starting Grade */}
                  <div className="bg-[#11213A] rounded-xl p-4 border border-white/[0.06]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-1">
                      STARTING GRADE
                    </div>
                    <div className="text-sm sm:text-base font-bold text-emerald-300">
                      Novice Juvenile
                    </div>
                    <div className="text-[11px] text-[#A7B4C7] font-mono mt-0.5">(2005)</div>
                  </div>

                  {/* Card 2: Peak Grade */}
                  <div className="bg-[#11213A] rounded-xl p-4 border border-white/[0.06]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-1">
                      PEAK GRADE
                    </div>
                    <div className="text-sm sm:text-base font-bold text-amber-400">
                      Grade 1
                    </div>
                    <div className="text-[11px] text-[#A7B4C7] font-mono mt-0.5">(Premier Flight)</div>
                  </div>

                  {/* Card 3: Promotions */}
                  <div className="bg-[#11213A] rounded-xl p-4 border border-white/[0.06]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-1">
                      PROMOTIONS
                    </div>
                    <div className="text-base sm:text-xl font-bold text-purple-300 font-mono">
                      3
                    </div>
                    <div className="text-[11px] text-[#A7B4C7] mt-0.5">Tiers Climbed</div>
                  </div>

                  {/* Card 4: To Grade 1 */}
                  <div className="bg-[#11213A] rounded-xl p-4 border border-white/[0.06]">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-1">
                      TO GRADE 1
                    </div>
                    <div className="text-base sm:text-xl font-bold text-[#8ABFFF] font-mono">
                      6 Yrs
                    </div>
                    <div className="text-[11px] text-[#A7B4C7] mt-0.5">Ascent Speed</div>
                  </div>
                </div>
              </div>

              {/* Main Timeline Card: RSPBA Competitive Grade Trajectory (2005–2026) */}
              <div className="bg-[#0E1726] rounded-2xl p-6 sm:p-7 border border-white/[0.06]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      RSPBA Competitive Grade Trajectory (2005 – 2026)
                    </h4>
                    <p className="text-xs text-[#A7B4C7] mt-1">
                      Interactive timeline of annual grade plateaus, promotion ascents, and World Championship titles
                    </p>
                  </div>

                  {/* Chart Legends */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11213A] border border-white/[0.06] text-[11px] text-purple-300 font-mono">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Grade Line
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-[11px] text-purple-200 font-mono">
                      <Rocket className="w-3 h-3 text-purple-300" />
                      Promotion
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-900/40 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
                      <Crown className="w-3 h-3 text-amber-400" />
                      World Champion
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 font-mono">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Double Landmark
                    </span>
                  </div>
                </div>

                {/* The Responsive Trajectory Chart */}
                <div className="overflow-x-auto pb-4 pt-2 -mx-2 sm:mx-0 px-2 sm:px-0">
                  <div className="min-w-[820px] h-[340px] relative bg-[#070D19] rounded-xl border border-white/[0.06] p-4 select-none">
                    
                    {/* Y-Axis Grades Guidelines & Labels */}
                    <div className="absolute left-4 top-6 bottom-12 w-32 flex flex-col justify-between text-xs font-mono font-medium z-10 pointer-events-none">
                      <div className="text-amber-400 flex items-center gap-1 font-bold">
                        <span>Grade 1</span>
                        <span className="text-[10px] text-amber-400/70">(Premier)</span>
                      </div>
                      <div className="text-[#A7B4C7]">Grade 2</div>
                      <div className="text-[#A7B4C7]">Juvenile</div>
                      <div className="text-[#A7B4C7]">Grade 3A</div>
                      <div className="text-[#A7B4C7]">Grade 3B</div>
                      <div className="text-emerald-400 font-bold">Novice Juvenile</div>
                    </div>

                    {/* SVG Canvas for Trajectory Line and Landmark Badges */}
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 860 300" preserveAspectRatio="none">
                      <defs>
                        {/* Glow filter */}
                        <filter id="purple-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="ascent-line" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="35%" stopColor="#8ABFFF" />
                          <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid Lines */}
                      {/* Grade 1 Line (Golden dashed boundary) */}
                      <line x1="140" y1="26" x2="840" y2="26" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                      {/* Grade 2 */}
                      <line x1="140" y1="76" x2="840" y2="76" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                      {/* Juvenile */}
                      <line x1="140" y1="126" x2="840" y2="126" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                      {/* Grade 3A */}
                      <line x1="140" y1="176" x2="840" y2="176" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      {/* Grade 3B */}
                      <line x1="140" y1="226" x2="840" y2="226" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      {/* Novice Juvenile */}
                      <line x1="140" y1="272" x2="840" y2="272" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" strokeDasharray="3 3" />

                      {/* Ascent Trajectory Curve:
                          Years:
                          '05: x=160, y=272 (Novice Juvenile)
                          '06: x=198, y=272 (Novice Juvenile)
                          '07: x=236, y=272 (Novice Juvenile - '07 Worlds)
                          '08: x=274, y=126 (Juvenile - '08 Worlds & Promo)
                          '09: x=312, y=76  (Grade 2 - '09 Worlds & Promo)
                          '10: x=350, y=26  (Grade 1 - '10 To Grade 1)
                          '11..'24: y=26    (Grade 1 Plateau)
                      */}
                      <path
                        d="M 160 272 L 198 272 L 236 272 C 255 272, 260 140, 274 126 C 288 112, 298 86, 312 76 C 326 66, 336 26, 350 26 L 820 26"
                        stroke="url(#ascent-line)"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#purple-glow)"
                      />

                      {/* Nodes on Path */}
                      {/* '05 */}
                      <circle cx="160" cy="272" r="4.5" fill="#10B981" />
                      {/* '06 */}
                      <circle cx="198" cy="272" r="4.5" fill="#10B981" />
                      
                      {/* '07 Node & Landmark (Novice Juvenile Worlds Winner) */}
                      <circle cx="236" cy="272" r="6" fill="#D97706" stroke="#fff" strokeWidth="1.5" />
                      
                      {/* '08 Node (Juvenile Worlds & Promo) */}
                      <circle cx="274" cy="126" r="6" fill="#A855F7" stroke="#F59E0B" strokeWidth="2" />

                      {/* '09 Node (Grade 2 Worlds & Promo) */}
                      <circle cx="312" cy="76" r="6" fill="#A855F7" stroke="#F59E0B" strokeWidth="2" />

                      {/* '10 Node (Promoted to Grade 1) */}
                      <circle cx="350" cy="26" r="6.5" fill="#A855F7" stroke="#fff" strokeWidth="2" />

                      {/* Grade 1 Plateau Nodes ('11 through '24) */}
                      <circle cx="388" cy="26" r="4" fill="#CBD5E1" />
                      <circle cx="426" cy="26" r="4" fill="#CBD5E1" />
                      <circle cx="464" cy="26" r="4" fill="#CBD5E1" />
                      <circle cx="502" cy="26" r="4" fill="#CBD5E1" />
                      <circle cx="540" cy="26" r="4" fill="#CBD5E1" />
                      <circle cx="578" cy="26" r="4" fill="#CBD5E1" />
                      
                      {/* '17 Worlds Champion Node */}
                      <circle cx="616" cy="26" r="7.5" fill="#F59E0B" stroke="#fff" strokeWidth="2" />
                      
                      {/* '18 */}
                      <circle cx="654" cy="26" r="4" fill="#CBD5E1" />
                      
                      {/* '19 Worlds Champion Node */}
                      <circle cx="692" cy="26" r="7.5" fill="#F59E0B" stroke="#fff" strokeWidth="2" />

                      {/* '22, '23, '24 */}
                      <circle cx="730" cy="26" r="4" fill="#CBD5E1" />
                      <circle cx="768" cy="26" r="4" fill="#CBD5E1" />
                      <circle cx="806" cy="26" r="5" fill="#A855F7" stroke="#fff" strokeWidth="1" />
                    </svg>

                    {/* Landmark HTML Floating Badges (positioned exactly as in screenshot 2 & 3) */}
                    {/* '07 Worlds */}
                    <div className="absolute left-[208px] bottom-[26px] bg-gradient-to-r from-amber-700 to-amber-600 border border-amber-400 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 z-20">
                      <span>👑</span>
                      <span>'07 WORLDS</span>
                    </div>

                    {/* '08 Worlds & Promo */}
                    <div className="absolute left-[225px] top-[148px] bg-[#3B0764] border border-amber-400/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 z-20">
                      <span>👑</span>
                      <span>🚀</span>
                      <span className="text-amber-300">'08 WORLDS & PROMO</span>
                    </div>

                    {/* '09 Worlds & Promo */}
                    <div className="absolute left-[262px] top-[94px] bg-[#3B0764] border border-amber-400/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 z-20">
                      <span>👑</span>
                      <span>🚀</span>
                      <span className="text-amber-300">'09 WORLDS & PROMO</span>
                    </div>

                    {/* '10 To Grade 1 */}
                    <div className="absolute left-[310px] top-[2px] bg-purple-600 border border-purple-300 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 z-20">
                      <span>🚀</span>
                      <span>'10 TO GRADE 1</span>
                    </div>

                    {/* '17 Worlds Champion */}
                    <div className="absolute left-[565px] top-[2px] bg-gradient-to-r from-amber-600 to-amber-500 border border-amber-200 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 z-20">
                      <span>👑</span>
                      <span>'17 WORLDS</span>
                    </div>

                    {/* '19 Worlds Champion */}
                    <div className="absolute left-[645px] top-[2px] bg-gradient-to-r from-amber-600 to-amber-500 border border-amber-200 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 z-20">
                      <span>👑</span>
                      <span>'19 WORLDS</span>
                    </div>

                    {/* X-Axis Years Labels along bottom */}
                    <div className="absolute left-[140px] right-[40px] bottom-1 flex justify-between text-[11px] font-mono text-[#A7B4C7]">
                      <span className="text-emerald-400 font-bold">'05</span>
                      <span>'06</span>
                      <span className="text-amber-400 font-bold">'07</span>
                      <span className="text-purple-300 font-bold">'08</span>
                      <span className="text-purple-300 font-bold">'09</span>
                      <span className="text-purple-300 font-bold">'10</span>
                      <span>'11</span>
                      <span>'12</span>
                      <span>'13</span>
                      <span>'14</span>
                      <span>'15</span>
                      <span>'16</span>
                      <span className="text-amber-400 font-bold">'17</span>
                      <span>'18</span>
                      <span className="text-amber-400 font-bold">'19</span>
                      <span>'22</span>
                      <span>'23</span>
                      <span className="text-white font-bold">'24</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#A7B4C7] font-mono">
                  <span>Scroll horizontally to inspect all 21 seasons</span>
                  <span className="text-purple-300">Grade 1 World Champions in 2017 & 2019</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: JAMES CAMPBELL - ADJUDICATOR PROFILE (LAYOUT & DATA FROM SCREENSHOT 1)
             ========================================================================= */}
          {activeTab === 'judges' && (
            <div className="animate-in fade-in duration-300 space-y-6">
              {/* Main Profile Header Card (Exact replica of Screenshot 1) */}
              <div className="bg-[#0E1726] rounded-2xl p-6 sm:p-8 border border-white/[0.08]">
                {/* Profile Top Row */}
                <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
                  {/* Glowing Musical Note Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#11213A] border-2 border-indigo-500/40 flex items-center justify-center text-[#8ABFFF] shadow-lg shadow-indigo-500/10 shrink-0">
                    <Music className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
                  </div>

                  {/* Name and Badges */}
                  <div className="space-y-3 flex-1">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      James Campbell
                    </h3>

                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Canonical Adjudicator
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11213A] border border-[#8ABFFF]/30 text-[#8ABFFF] text-xs font-mono font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#8ABFFF]" />
                        Piping 1
                      </span>

                      <span className="px-3 py-1 rounded-full bg-[#11213A] border border-white/[0.08] text-[#A7B4C7] text-xs font-mono">
                        Career: 1999 – 2026 (28 Years)
                      </span>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs font-mono font-medium">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        54 World Championship Panels
                      </span>
                    </div>

                    {/* Historical Name Forms (From Screenshot 1) */}
                    <div className="pt-2">
                      <div className="text-[11px] font-mono text-[#A7B4C7] mb-1.5">
                        Historical Name Forms:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: 'J Campbell', count: 433 },
                          { name: 'James Campbell', count: 87 },
                          { name: 'Jim Campbell', count: 35 },
                          { name: 'J Campbel', count: 10 },
                          { name: 'J Cambell', count: 3 },
                          { name: 'J. Campbell', count: 1 },
                        ].map((variant) => (
                          <span
                            key={variant.name}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#11213A] border border-white/[0.06] text-[11px] font-mono text-[#A7B4C7]"
                          >
                            <span>{variant.name}</span>
                            <span className="text-[#8ABFFF]">({variant.count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Major Bench Appearances Highlight Bar */}
                <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7]">
                      MAJOR BENCH APPEARANCES
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span className="text-2xl font-bold font-mono text-amber-400">160</span>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-[#A7B4C7]">
                    4,341 bands evaluated
                  </div>
                </div>
              </div>

              {/* 4 Stat Tiles Grid (Exact replica of Screenshot 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Assignments */}
                <div className="bg-[#0E1726] rounded-xl p-5 border border-white/[0.06] flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-1">
                      ASSIGNMENTS
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">574</div>
                    <div className="text-xs text-[#A7B4C7] mt-1">Contest rounds officiated</div>
                  </div>
                  <Scale className="w-5 h-5 text-indigo-400" />
                </div>

                {/* 2. Bands Scored */}
                <div className="bg-[#0E1726] rounded-xl p-5 border border-white/[0.06] flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-1">
                      BANDS SCORED
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">4341</div>
                    <div className="text-xs text-[#A7B4C7] mt-1">Performances evaluated</div>
                  </div>
                  <Users className="w-5 h-5 text-[#8ABFFF]" />
                </div>

                {/* 3. Contests */}
                <div className="bg-[#0E1726] rounded-xl p-5 border border-white/[0.06] flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-1">
                      CONTESTS
                    </div>
                    <div className="text-2xl font-bold text-white font-mono">179</div>
                    <div className="text-xs text-[#A7B4C7] mt-1">Events attended</div>
                  </div>
                  <Compass className="w-5 h-5 text-purple-400" />
                </div>

                {/* 4. Majors */}
                <div className="bg-[#0E1726] rounded-xl p-5 border border-white/[0.06] flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-1">
                      MAJORS
                    </div>
                    <div className="text-2xl font-bold text-amber-400 font-mono">160</div>
                    <div className="text-xs text-[#A7B4C7] mt-1">54 World Championships</div>
                  </div>
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: RIVALRY ARENA (FMM VS INVERARAY)
             ========================================================================= */}
          {activeTab === 'rivalries' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
                <div className="lg:max-w-md">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8ABFFF] uppercase tracking-wider mb-2">
                    <Swords className="w-4 h-4" />
                    <span>Head-to-Head Clash Arena</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    Relive Legendary Band Rivalries
                  </h3>
                  <p className="text-sm text-[#A7B4C7] leading-relaxed mb-4">
                    Pit any two bands in history head-to-head. Trace every encounter across 28 years, compare section supremacy, and uncover the heartbreaking deciders decided on countback.
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#A7B4C7]">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF] mt-1.5 shrink-0" />
                      <span><strong className="text-white">Section Supremacy:</strong> Who owned the piping corps, drum corps, or ensemble over a decade?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF] mt-1.5 shrink-0" />
                      <span><strong className="text-white">The "Heartbreak Metric":</strong> Contests decided by ≤ 1 point or drumming preference.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF] mt-1.5 shrink-0" />
                      <span><strong className="text-white">Major vs Major Records:</strong> Worlds records compared to Scottish, British, and UK Majors.</span>
                    </li>
                  </ul>
                </div>

                {/* Rivalry Arena Mockup */}
                <div className="w-full lg:flex-1 bg-[#0B1425] rounded-xl border border-white/[0.06] p-5 sm:p-6 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                    <span className="text-[#8ABFFF] font-semibold">HEAD-TO-HEAD: GRADE 1 (2010–2024)</span>
                    <span className="text-[10px] text-[#A7B4C7]">58 CLASHES</span>
                  </div>

                  {/* Band vs Band Header */}
                  <div className="flex items-center justify-between font-sans text-sm font-bold text-white mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8ABFFF]" />
                      <span>Field Marshal Montgomery</span>
                    </div>
                    <span className="text-[#A7B4C7] font-mono text-xs">VS</span>
                    <div className="flex items-center gap-2 text-right">
                      <span>Inveraray & District</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Clash Stat Bar */}
                  <div className="bg-[#11213A] p-3.5 rounded-xl border border-white/[0.04] mb-4">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-[#8ABFFF]">34 Wins (58.6%)</span>
                      <span className="text-[#A7B4C7] text-[10px]">2 Ties</span>
                      <span className="text-emerald-400">22 Wins (37.9%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#0B1425] rounded-full overflow-hidden flex">
                      <div className="bg-[#8ABFFF] h-full" style={{ width: '58.6%' }} />
                      <div className="bg-white/30 h-full" style={{ width: '3.5%' }} />
                      <div className="bg-emerald-400 h-full" style={{ width: '37.9%' }} />
                    </div>
                  </div>

                  {/* Section Supremacy */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] mb-4">
                    <div className="bg-[#111B2B] p-2 rounded-lg">
                      <div className="text-[#A7B4C7]">PIPING SECTION</div>
                      <div className="text-white font-bold mt-0.5">FMM 36 · IDPB 20</div>
                    </div>
                    <div className="bg-[#111B2B] p-2 rounded-lg">
                      <div className="text-[#A7B4C7]">DRUM CORPS</div>
                      <div className="text-emerald-400 font-bold mt-0.5">IDPB 33 · FMM 22</div>
                    </div>
                    <div className="bg-[#111B2B] p-2 rounded-lg">
                      <div className="text-[#A7B4C7]">ENSEMBLE</div>
                      <div className="text-white font-bold mt-0.5">FMM 31 · IDPB 25</div>
                    </div>
                  </div>

                  {/* Drumming Tie-Break Decider Highlight */}
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] text-rose-200">
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>Iconic Decider: 2019 World Championship Final</span>
                    </div>
                    <span>Tied at 13-13 aggregate. Inveraray captured the World Title on Drumming countback (2nd vs 3rd).</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: VIRTUAL TROPHY CABINET
             ========================================================================= */}
          {activeTab === 'trophies' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
                <div className="lg:max-w-md">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#8ABFFF] uppercase tracking-wider mb-2">
                    <Trophy className="w-4 h-4" />
                    <span>Digital Heritage & Trophy Cases</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    Interactive Band Profiles & Virtual Trophy Cabinets
                  </h3>
                  <p className="text-sm text-[#A7B4C7] leading-relaxed mb-4">
                    Every band in the 28-year archive receives a dedicated digital sanctuary. Track Pipe Majors and Leading Drummers across seasons, explore promotions, and inspect virtual trophy cabinets.
                  </p>
                  <ul className="space-y-2.5 text-xs text-[#A7B4C7]">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF] mt-1.5 shrink-0" />
                      <span><strong className="text-white">The Five Majors Showcase:</strong> World, Scottish, British, UK, and European Championship titles.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF] mt-1.5 shrink-0" />
                      <span><strong className="text-white">Leadership Timeline:</strong> Archive of Pipe Majors and Drumming leads across decades.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF] mt-1.5 shrink-0" />
                      <span><strong className="text-white">Career Milestones:</strong> Total contests, podium rates, and historical aggregate records.</span>
                    </li>
                  </ul>
                </div>

                {/* Trophy Cabinet Mockup */}
                <div className="w-full lg:flex-1 bg-[#0B1425] rounded-xl border border-white/[0.06] p-5 sm:p-6 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                    <div>
                      <span className="text-[#8ABFFF] font-semibold text-xs block font-sans">
                        PEOPLES FORD BOGHALL & BATHGATE CALEDONIA
                      </span>
                      <span className="text-[10px] text-[#A7B4C7]">18 Major Titles · 2 World Championships · 14 World Drumming Banners</span>
                    </div>
                    <Award className="w-5 h-5 text-[#8ABFFF]" />
                  </div>

                  {/* 4 Trophy Showcase Items */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                    <div className="bg-[#11213A] p-3 rounded-lg border border-[#8ABFFF]/30 text-center flex flex-col justify-between">
                      <div className="text-2xl mb-1">🌍</div>
                      <div className="font-bold text-white text-[11px]">WORLD CHAMP</div>
                      <div className="text-[#8ABFFF] text-[10px] font-bold">2023</div>
                      <div className="text-[#A7B4C7] text-[9px]">Score: 10 pts</div>
                    </div>

                    <div className="bg-[#11213A] p-3 rounded-lg border border-white/[0.06] text-center flex flex-col justify-between">
                      <div className="text-2xl mb-1">🥁</div>
                      <div className="font-bold text-white text-[11px]">WORLD DRUMS</div>
                      <div className="text-[#8ABFFF] text-[10px] font-bold">2023 & 2012</div>
                      <div className="text-[#A7B4C7] text-[9px]">14 Career Banners</div>
                    </div>

                    <div className="bg-[#11213A] p-3 rounded-lg border border-white/[0.06] text-center flex flex-col justify-between">
                      <div className="text-2xl mb-1">🏴󠁧󠁢󠁳󠁣󠁴󠁿</div>
                      <div className="font-bold text-white text-[11px]">SCOTTISH</div>
                      <div className="text-[#8ABFFF] text-[10px] font-bold">2019 & 2017</div>
                      <div className="text-[#A7B4C7] text-[9px]">Dumbarton</div>
                    </div>

                    <div className="bg-[#11213A] p-3 rounded-lg border border-white/[0.06] text-center flex flex-col justify-between">
                      <div className="text-2xl mb-1">🎖️</div>
                      <div className="font-bold text-white text-[11px]">CHAMPIONS</div>
                      <div className="text-[#8ABFFF] text-[10px] font-bold">2023 Season</div>
                      <div className="text-[#A7B4C7] text-[9px]">Overall Season</div>
                    </div>
                  </div>

                  <div className="bg-[#111B2B] p-2.5 rounded-lg border border-white/[0.04] text-[10px] text-[#A7B4C7] flex justify-between items-center">
                    <span>Leadership: P/M Ross Harvey · L/D Kerr McQuillan</span>
                    <span className="text-[#8ABFFF]">Click to inspect scorecards →</span>
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
