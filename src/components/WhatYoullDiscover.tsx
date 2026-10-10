import React from 'react';
import { Calendar, History, BarChart3 } from 'lucide-react';

export const WhatYoullDiscover: React.FC = () => {
  return (
    <section id="discover" className="relative py-24 bg-[#0B1425] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8ABFFF] font-mono mb-3">
            MORE THAN RESULTS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F8FC] tracking-tight font-sans mb-4">
            Discover the stories behind the scores.
          </h2>
          <p className="text-base sm:text-lg text-[#A7B4C7] leading-relaxed">
            From individual contest performances to championship history, explore the records, rivalries and trends that make the pipe band world unique.
          </p>
        </div>

        {/* 3 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CARD 1: Contest results */}
          <div className="bg-[#111B2B] rounded-2xl border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between hover:border-[#8ABFFF]/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg shadow-black/20">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#11213A] border border-[#8ABFFF]/20 flex items-center justify-center text-[#8ABFFF] mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#F5F8FC] mb-2.5">
                Contest results
              </h3>
              <p className="text-sm text-[#A7B4C7] leading-relaxed mb-6">
                Find results by contest, year and grade. Explore finishing positions and follow the performances that matter to you.
              </p>
            </div>

            {/* Visual: Compact elegant results table */}
            <div className="bg-[#0B1425] rounded-xl p-3.5 border border-white/[0.06] mt-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-2 flex justify-between">
                <span>Glasgow Green Final</span>
                <span className="text-[#8ABFFF]">Grade 1 MSR</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between py-1 px-2 rounded bg-[#11213A] text-white">
                  <span className="flex items-center gap-2">
                    <span className="text-[#8ABFFF] font-bold">1</span>
                    <span className="font-sans text-xs font-medium">Inveraray & District</span>
                  </span>
                  <span className="text-xs text-[#8ABFFF]">9 pts</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded text-[#A7B4C7]">
                  <span className="flex items-center gap-2">
                    <span className="font-bold">2</span>
                    <span className="font-sans text-xs">Field Marshal Montgomery</span>
                  </span>
                  <span className="text-xs">13 pts</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded text-[#A7B4C7]">
                  <span className="flex items-center gap-2">
                    <span className="font-bold">3</span>
                    <span className="font-sans text-xs">St Laurence O'Toole</span>
                  </span>
                  <span className="text-xs">21 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Championship history */}
          <div className="bg-[#111B2B] rounded-2xl border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between hover:border-[#8ABFFF]/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg shadow-black/20">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#11213A] border border-[#8ABFFF]/20 flex items-center justify-center text-[#8ABFFF] mb-6 group-hover:scale-110 transition-transform">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#F5F8FC] mb-2.5">
                Championship history
              </h3>
              <p className="text-sm text-[#A7B4C7] leading-relaxed mb-6">
                Revisit historic competitions and trace how bands have performed across seasons and generations.
              </p>
            </div>

            {/* Visual: Subtle historical timeline */}
            <div className="bg-[#0B1425] rounded-xl p-3.5 border border-white/[0.06] mt-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-2">
                Championship Milestones
              </div>
              <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-px before:bg-[#8ABFFF]/30">
                <div className="relative text-xs">
                  <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-[#8ABFFF]" />
                  <div className="font-mono text-[10px] text-[#8ABFFF]">2023 · Glasgow Green</div>
                  <div className="text-[#F5F8FC] font-medium text-xs">Boghall & Bathgate return to the summit</div>
                </div>
                <div className="relative text-xs">
                  <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-[#4C9FFF]/60" />
                  <div className="font-mono text-[10px] text-[#A7B4C7]">2019 · Dumbarton</div>
                  <div className="text-[#A7B4C7] text-xs">Inveraray captures historic Scottish title</div>
                </div>
                <div className="relative text-xs">
                  <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-white/20" />
                  <div className="font-mono text-[10px] text-[#A7B4C7]">2014 · Belfast</div>
                  <div className="text-[#A7B4C7] text-xs">FMM secures clean-sweep Grand Slam</div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: Statistics & records */}
          <div className="bg-[#111B2B] rounded-2xl border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between hover:border-[#8ABFFF]/40 transition-all duration-300 group hover:-translate-y-1 shadow-lg shadow-black/20">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#11213A] border border-[#8ABFFF]/20 flex items-center justify-center text-[#8ABFFF] mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#F5F8FC] mb-2.5">
                Statistics & records
              </h3>
              <p className="text-sm text-[#A7B4C7] leading-relaxed mb-6">
                Explore podium streaks, winning records, competitive trends and the rivalries behind the rankings.
              </p>
            </div>

            {/* Visual: Restrained animated chart / streak meter */}
            <div className="bg-[#0B1425] rounded-xl p-3.5 border border-white/[0.06] mt-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A7B4C7] mb-2 flex justify-between">
                <span>Podium Streaks Index</span>
                <span className="text-[#8ABFFF]">Active Seasons</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#F5F8FC] font-medium">Consecutive Major Podiums</span>
                    <span className="font-mono text-[#8ABFFF]">14 Majors</span>
                  </div>
                  <div className="w-full bg-[#11213A] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#8ABFFF] h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#A7B4C7]">Drum Corps Clean Sheets</span>
                    <span className="font-mono text-white">8 Titles</span>
                  </div>
                  <div className="w-full bg-[#11213A] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#4C9FFF] h-full rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#A7B4C7]">Medley Rank Consistency</span>
                    <span className="font-mono text-white">96.8%</span>
                  </div>
                  <div className="w-full bg-[#11213A] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-white/40 h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
