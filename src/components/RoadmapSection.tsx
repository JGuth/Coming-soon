import React from 'react';
import { Calendar, CheckCircle2, Zap } from 'lucide-react';
import { LaunchListSignup } from './LaunchListSignup.tsx';
import { useSettings } from '../context/SettingsContext.tsx';

interface RoadmapSectionProps {
  emailInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const RoadmapSection: React.FC<RoadmapSectionProps> = ({ emailInputRef }) => {
  const { settings } = useSettings();
  const { roadmap, colors } = settings;

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
    <section
      id="roadmap"
      className="relative py-12 sm:py-20 border-t border-white/[0.06] overflow-hidden transition-colors"
      style={{
        backgroundColor: colors.bgDark,
        color: colors.textPrimary,
      }}
    >
      {/* Background Lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] blur-[160px] pointer-events-none opacity-10"
        style={{ backgroundColor: colors.primaryAccent }}
      />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          {roadmap.tag && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium mb-3 border"
              style={{
                backgroundColor: colors.navySurface,
                borderColor: `${colors.primaryAccent}40`,
                color: colors.primaryAccent,
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{roadmap.tag}</span>
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans mb-2 sm:mb-4">
            {roadmap.title}
          </h2>
          <p className="text-xs sm:text-base max-w-2xl mx-auto" style={{ color: colors.textMuted }}>
            {roadmap.subtitle}
          </p>
        </div>

        {/* 4-Quarter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-10 sm:mb-16">
          {roadmapItems.map((item) => (
            <div
              key={item.quarter}
              className="rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: colors.cardSurface,
                borderColor: item.isDone ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-white">{item.quarter}</span>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: colors.textMuted }}>
                  {item.desc}
                </p>
              </div>

              <div className="pt-2.5 border-t border-white/[0.06] text-[11px] font-mono flex items-center gap-1.5">
                {item.isDone ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Archive Ingested
                  </span>
                ) : (
                  <span className="flex items-center gap-1" style={{ color: colors.primaryAccent }}>
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
