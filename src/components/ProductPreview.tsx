import React, { useState } from 'react';
import { Trophy, TrendingUp, SlidersHorizontal, Info, Sparkles } from 'lucide-react';

interface DemonstrationRow {
  rank: number;
  band: string;
  lead: string;
  piping: string;
  drumming: string;
  ensemble: string;
  total: number;
  trend: string;
  prevYear: number;
}

const SAMPLE_DATA: Record<string, DemonstrationRow[]> = {
  '2024-G1': [
    { rank: 1, band: 'Inveraray & District', lead: 'P/M S. Liddell · L/D S. Muir', piping: '1, 1, 2, 1', drumming: '1, 2', ensemble: '1, 1', total: 9, trend: '+1', prevYear: 2 },
    { rank: 2, band: 'Field Marshal Montgomery', lead: 'P/M R. Parkes MBE · L/D G. Brown', piping: '2, 3, 1, 2', drumming: '3, 1', ensemble: '2, 2', total: 13, trend: '-1', prevYear: 1 },
    { rank: 3, band: 'St Laurence O’Toole', lead: 'P/M A. Bready · L/D S. McWhirter', piping: '3, 2, 4, 3', drumming: '2, 3', ensemble: '3, 4', total: 21, trend: '+2', prevYear: 5 },
    { rank: 4, band: 'Simon Fraser University', lead: 'P/M A. Lee · L/D J. Reid', piping: '4, 4, 3, 4', drumming: '4, 4', ensemble: '4, 3', total: 26, trend: '0', prevYear: 4 },
    { rank: 5, band: 'Scottish Power', lead: 'P/M C. Armstrong · L/D J. Campbell', piping: '5, 5, 5, 6', drumming: '5, 5', ensemble: '5, 5', total: 36, trend: '+1', prevYear: 6 },
    { rank: 6, band: 'Peoples Ford Boghall & Bathgate', lead: 'P/M R. Ross · L/D K. Reilly', piping: '6, 6, 6, 5', drumming: '6, 6', ensemble: '6, 6', total: 41, trend: '-3', prevYear: 3 },
  ],
  '2023-G1': [
    { rank: 1, band: 'Peoples Ford Boghall & Bathgate', lead: 'P/M R. Ross · L/D K. Reilly', piping: '1, 2, 1, 1', drumming: '1, 1', ensemble: '1, 2', total: 9, trend: '+2', prevYear: 3 },
    { rank: 2, band: 'Field Marshal Montgomery', lead: 'P/M R. Parkes MBE · L/D G. Brown', piping: '2, 1, 2, 3', drumming: '2, 3', ensemble: '2, 1', total: 14, trend: '-1', prevYear: 1 },
    { rank: 3, band: 'Inveraray & District', lead: 'P/M S. Liddell · L/D S. Muir', piping: '3, 3, 3, 2', drumming: '3, 2', ensemble: '3, 3', total: 19, trend: '-1', prevYear: 2 },
    { rank: 4, band: 'Simon Fraser University', lead: 'P/M A. Lee · L/D J. Reid', piping: '4, 4, 5, 4', drumming: '4, 4', ensemble: '4, 5', total: 30, trend: '+1', prevYear: 5 },
    { rank: 5, band: 'St Laurence O’Toole', lead: 'P/M A. Bready · L/D S. McWhirter', piping: '5, 5, 4, 5', drumming: '5, 5', ensemble: '5, 4', total: 33, trend: '-1', prevYear: 4 },
    { rank: 6, band: 'Scottish Power', lead: 'P/M C. Armstrong · L/D J. Campbell', piping: '6, 6, 6, 6', drumming: '6, 6', ensemble: '6, 6', total: 42, trend: '0', prevYear: 6 },
  ],
  '2024-G2': [
    { rank: 1, band: 'Ravara Pipe Band', lead: 'P/M S. Connolly · L/D D. Brown', piping: '1, 1', drumming: '1', ensemble: '1', total: 4, trend: '+3', prevYear: 4 },
    { rank: 2, band: 'Buchan Peterson', lead: 'P/M P. Higgins · L/D M. Stewart', piping: '2, 3', drumming: '2', ensemble: '2', total: 9, trend: '0', prevYear: 2 },
    { rank: 3, band: 'Portlethen & District', lead: 'P/M K. Fraser · L/D G. Bruce', piping: '3, 2', drumming: '4', ensemble: '3', total: 12, trend: '+2', prevYear: 5 },
    { rank: 4, band: 'Uddingston', lead: 'P/M J. Martin · L/D R. Vance', piping: '4, 4', drumming: '3', ensemble: '4', total: 15, trend: '-3', prevYear: 1 },
  ],
};

export const ProductPreview: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<'2024' | '2023'>('2024');
  const [selectedGrade, setSelectedGrade] = useState<'G1' | 'G2'>('G1');
  const [selectedContest, setSelectedContest] = useState('World Championships');
  const [activeBandIndex, setActiveBandIndex] = useState(0);

  const key = `${selectedYear}-${selectedGrade}`;
  const rows = SAMPLE_DATA[key] || SAMPLE_DATA['2024-G1'];
  const activeBand = rows[activeBandIndex] || rows[0];

  return (
    <section id="preview" className="relative py-24 bg-[#0B1425] border-t border-white/[0.06]">
      {/* Background Lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#4C9FFF]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-[#8ABFFF]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11213A] border border-[#8ABFFF]/20 text-[#8ABFFF] text-xs font-mono font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLATFORM CONCEPT · INTERACTIVE PREVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F8FC] tracking-tight font-sans mb-4">
            A sports-data platform for the pipe band world.
          </h2>
          <p className="text-base sm:text-lg text-[#A7B4C7]">
            Clean championship tables, adjudicator summaries and multi-season records.
            Below is a live interactive simulation of the core analysis interface.
          </p>
        </div>

        {/* Mock Interface Container */}
        <div className="bg-[#111B2B] rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
          {/* Top Interface Toolbar */}
          <div className="bg-[#11213A]/70 px-4 sm:px-6 py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            {/* Left: Championship Selector */}
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-[#8ABFFF] shrink-0" />
              <div>
                <div className="text-xs text-[#A7B4C7] font-mono uppercase tracking-wider">Championship</div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedContest}
                    onChange={(e) => setSelectedContest(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-[#F5F8FC] focus:outline-none cursor-pointer hover:text-[#8ABFFF] transition-colors"
                  >
                    <option value="World Championships" className="bg-[#11213A]">World Pipe Band Championships (Glasgow Green)</option>
                    <option value="Scottish Championships" className="bg-[#11213A]">Scottish Championships (Dumbarton)</option>
                    <option value="British Championships" className="bg-[#11213A]">British Championships (Paisley)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: Interactive Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Year Selector */}
              <div className="flex rounded-lg bg-[#0B1425] p-1 border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setSelectedYear('2024')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    selectedYear === '2024'
                      ? 'bg-[#8ABFFF] text-[#0B1425] shadow-xs'
                      : 'text-[#A7B4C7] hover:text-[#F5F8FC]'
                  }`}
                >
                  2024
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedYear('2023')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    selectedYear === '2023'
                      ? 'bg-[#8ABFFF] text-[#0B1425] shadow-xs'
                      : 'text-[#A7B4C7] hover:text-[#F5F8FC]'
                  }`}
                >
                  2023
                </button>
              </div>

              {/* Grade Selector */}
              <div className="flex rounded-lg bg-[#0B1425] p-1 border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGrade('G1');
                    setActiveBandIndex(0);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    selectedGrade === 'G1'
                      ? 'bg-[#8ABFFF] text-[#0B1425] shadow-xs'
                      : 'text-[#A7B4C7] hover:text-[#F5F8FC]'
                  }`}
                >
                  Grade 1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGrade('G2');
                    setActiveBandIndex(0);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    selectedGrade === 'G2'
                      ? 'bg-[#8ABFFF] text-[#0B1425] shadow-xs'
                      : 'text-[#A7B4C7] hover:text-[#F5F8FC]'
                  }`}
                >
                  Grade 2
                </button>
              </div>
            </div>
          </div>

          {/* Interface Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
            {/* Left 8 Cols: Results Table */}
            <div className="lg:col-span-8 p-4 sm:p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#F5F8FC]">Official Contest Aggregate</span>
                  <span className="text-xs text-[#A7B4C7] font-mono">
                    ({selectedContest} · {selectedYear} · {selectedGrade === 'G1' ? 'Grade 1' : 'Grade 2'})
                  </span>
                </div>
                <div className="text-[11px] text-[#8ABFFF] font-mono hidden sm:inline-block">
                  Click a band to inspect scorecard
                </div>
              </div>

              {/* Responsive Scroll Container */}
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[11px] font-mono uppercase tracking-wider text-[#A7B4C7]">
                      <th className="py-2.5 px-3 w-12 text-center">Pos</th>
                      <th className="py-2.5 px-3">Band & Leadership</th>
                      <th className="py-2.5 px-3 text-center">Piping</th>
                      <th className="py-2.5 px-3 text-center">Drumming</th>
                      <th className="py-2.5 px-3 text-center">Ensemble</th>
                      <th className="py-2.5 px-3 text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-sm">
                    {rows.map((row, index) => {
                      const isSelected = activeBandIndex === index;
                      return (
                        <tr
                          key={row.band}
                          onClick={() => setActiveBandIndex(index)}
                          className={`cursor-pointer transition-colors duration-150 ${
                            isSelected
                              ? 'bg-[#11213A] text-white'
                              : 'hover:bg-white/[0.02] text-[#A7B4C7] hover:text-[#F5F8FC]'
                          }`}
                        >
                          <td className="py-3 px-3 text-center font-mono">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold ${
                                row.rank === 1
                                  ? 'bg-[#8ABFFF] text-[#0B1425]'
                                  : row.rank === 2
                                  ? 'bg-white/20 text-white'
                                  : row.rank === 3
                                  ? 'bg-amber-600/30 text-amber-200'
                                  : 'text-[#A7B4C7]'
                              }`}
                            >
                              {row.rank}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-[#F5F8FC] flex items-center gap-2">
                              {row.band}
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF]" />
                              )}
                            </div>
                            <div className="text-xs text-[#A7B4C7] font-normal">{row.lead}</div>
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-xs">{row.piping}</td>
                          <td className="py-3 px-3 text-center font-mono text-xs">{row.drumming}</td>
                          <td className="py-3 px-3 text-center font-mono text-xs">{row.ensemble}</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-[#8ABFFF]">{row.total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#A7B4C7]">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#8ABFFF]" />
                  Demonstration sample dataset. Actual historic RSPBA records will be indexed upon launch.
                </span>
                <span className="font-mono text-[11px] hidden sm:inline">Aggregate system: 4 Judges / 2 Disciplines</span>
              </div>
            </div>

            {/* Right 4 Cols: Performance Chart & Statistics Card */}
            <div className="lg:col-span-4 p-4 sm:p-6 flex flex-col justify-between bg-[#0B1425]/40 space-y-6">
              {/* Selected Band Deep Dive Card */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider font-mono text-[#A7B4C7]">Band Spotlight</span>
                  <span className="text-xs text-[#8ABFFF] font-mono">Finishing: #{activeBand.rank}</span>
                </div>
                <div className="bg-[#11213A] p-4 rounded-xl border border-white/[0.06]">
                  <h4 className="text-base font-bold text-white mb-1">{activeBand.band}</h4>
                  <p className="text-xs text-[#A7B4C7] mb-3">{activeBand.lead}</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs">
                    <div>
                      <span className="text-[#A7B4C7] block">Total Penalty/Points</span>
                      <span className="text-sm font-mono font-semibold text-[#8ABFFF]">{activeBand.total} pts</span>
                    </div>
                    <div>
                      <span className="text-[#A7B4C7] block">Year Trend</span>
                      <span className="text-sm font-mono font-semibold text-emerald-400">
                        {activeBand.trend.startsWith('+') ? `▲ ${activeBand.trend}` : activeBand.trend === '0' ? '— Same' : `▼ ${activeBand.trend}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Championship Trajectory Chart */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-mono text-[#A7B4C7] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#8ABFFF]" />
                    Championship Trend
                  </span>
                  <span className="text-[11px] text-[#A7B4C7] font-mono">2019 — 2024</span>
                </div>

                {/* SVG Line Chart */}
                <div className="bg-[#11213A]/60 p-3.5 rounded-xl border border-white/[0.06] relative">
                  <div className="h-28 w-full flex items-end">
                    <svg viewBox="0 0 280 90" className="w-full h-full overflow-visible" fill="none">
                      {/* Grid guideline lines */}
                      <line x1="0" y1="15" x2="280" y2="15" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <line x1="0" y1="45" x2="280" y2="45" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                      <line x1="0" y1="75" x2="280" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                      {/* Rank indicators */}
                      <text x="2" y="14" fill="#A7B4C7" fontSize="8" fontFamily="monospace">1st</text>
                      <text x="2" y="44" fill="#A7B4C7" fontSize="8" fontFamily="monospace">3rd</text>
                      <text x="2" y="74" fill="#A7B4C7" fontSize="8" fontFamily="monospace">5th</text>

                      {/* Sparkline curve */}
                      <path
                        d="M 30 50 L 80 20 L 130 35 L 180 15 L 230 25 L 270 15"
                        stroke="#8ABFFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Highlighted points */}
                      <circle cx="30" cy="50" r="3" fill="#0B1425" stroke="#8ABFFF" strokeWidth="2" />
                      <circle cx="80" cy="20" r="3" fill="#0B1425" stroke="#8ABFFF" strokeWidth="2" />
                      <circle cx="130" cy="35" r="3" fill="#0B1425" stroke="#8ABFFF" strokeWidth="2" />
                      <circle cx="180" cy="15" r="3" fill="#0B1425" stroke="#8ABFFF" strokeWidth="2" />
                      <circle cx="230" cy="25" r="3" fill="#0B1425" stroke="#8ABFFF" strokeWidth="2" />
                      <circle cx="270" cy="15" r="4" fill="#4C9FFF" stroke="#F5F8FC" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#A7B4C7] mt-2 pt-1 border-t border-white/[0.04]">
                    <span>'19</span>
                    <span>'20</span>
                    <span>'21</span>
                    <span>'22</span>
                    <span>'23</span>
                    <span className="text-[#8ABFFF] font-bold">'24</span>
                  </div>
                </div>
              </div>

              {/* Statistics Metrics Card */}
              <div className="bg-[#11213A]/60 p-3.5 rounded-xl border border-white/[0.06]">
                <div className="text-xs uppercase tracking-wider font-mono text-[#A7B4C7] mb-2">
                  Championship Metrics
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#A7B4C7]">Consistency Rating</span>
                    <span className="font-mono text-white font-medium">96.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A7B4C7]">Medley / MSR Delta</span>
                    <span className="font-mono text-[#8ABFFF] font-medium">+0.8 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A7B4C7]">Podium Streak</span>
                    <span className="font-mono text-white font-medium">5 Seasons</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Notice below Preview */}
        <p className="mt-4 text-center text-xs text-[#A7B4C7]/80">
          Preview concept demonstrating future interface layout and analysis views. Historical records and statistics are subject to validation upon launch.
        </p>
      </div>
    </section>
  );
};
