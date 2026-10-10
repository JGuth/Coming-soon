import React from 'react';
import { Calendar, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { LaunchListSignup } from './LaunchListSignup.tsx';

interface RoadmapSectionProps {
  emailInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({ emailInputRef }) => {
  const roadmapItems = [
    {
      quarter: 'Q1 2026',
      status: 'LIVE / COMPLETED',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: '28-Year Archive Foundation',
      desc: '1998–2026 RSPBA championship harvesting, sub-score parser, canonical entity resolution, and public developer REST API.',
      isDone: true,
    },
    {
      quarter: 'Q2 2026',
      status: 'NEXT RELEASE',
      statusColor: 'text-[#8ABFFF] bg-[#8ABFFF]/10 border-[#8ABFFF]/30',
      title: 'Band Profiles & Trophy Cabinets',
      desc: 'Heritage timelines, Pipe Major & Drumming leadership history, career milestones, and virtual showcase of the 5 Majors.',
      isDone: false,
    },
    {
      quarter: 'Q3 2026',
      status: 'UPCOMING',
      statusColor: 'text-[#A7B4C7] bg-white/5 border-white/10',
      title: 'Rivalry Arena & Form Curves',
      desc: 'Head-to-head clash statistics, margin deciders, 10-year placing trajectories, and grade progression curves.',
      isDone: false,
    },
    {
      quarter: 'Q4 2026',
      status: 'FLAGSHIP TEASER',
      statusColor: 'text-[#8ABFFF] bg-[#4C9FFF]/10 border-[#8ABFFF]/20',
      title: 'Adjudicator Variance Engine',
      desc: 'Consensus deviation analysis (ΔRank), lone dissenter metrics, and objective judging pattern intelligence.',
      isDone: false,
    },
  ];

  return (
    <section id="roadmap" className="relative py-20 sm:py-28 bg-[#070D19] border-t border-white/[0.06] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#8ABFFF]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11213A] border border-[#8ABFFF]/25 text-[#8ABFFF] text-xs font-mono font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>2026 DELIVERY TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F8FC] tracking-tight font-sans mb-4">
            A methodical roadmap for the pipe band world.
          </h2>
          <p className="text-base sm:text-lg text-[#A7B4C7]">
            Built with algorithmic rigor and respect for competitive piping and drumming heritage. Here is what is live and what arrives next.
          </p>
        </div>

        {/* 4-Quarter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {roadmapItems.map((item) => (
            <div
              key={item.quarter}
              className={`bg-[#111B2B] rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                item.isDone ? 'border-emerald-500/30' : 'border-white/[0.08] hover:border-[#8ABFFF]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-white">{item.quarter}</span>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-[#A7B4C7] leading-relaxed mb-4">{item.desc}</p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono flex items-center gap-1.5">
                {item.isDone ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Archive Ingested
                  </span>
                ) : (
                  <span className="text-[#8ABFFF] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    In Active Development
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dedicated Final Conversion Panel */}
        <div className="max-w-4xl mx-auto">
          <LaunchListSignup inputRef={emailInputRef} />
        </div>
      </div>
    </section>
  );
};
