import React from 'react';
import { Search, Compass, Activity } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Find the results',
      icon: Search,
      description:
        'Browse contests by year, championship and grade. Get to the results you want without digging through scattered pages.',
      detail: 'Instant search across major championships and regional contests.',
    },
    {
      num: '02',
      title: 'Explore the history',
      icon: Compass,
      description:
        'Follow bands through the years, revisit historic performances and discover how the competitive landscape has changed.',
      detail: 'Decades of championship lineage, roster milestones and historic finals.',
    },
    {
      num: '03',
      title: 'Uncover the statistics',
      icon: Activity,
      description:
        'Go beyond individual results. Explore records, podium streaks, winning runs and the rivalries that define championship competition.',
      detail: 'Adjudicator breakdown indices, MSR vs Medley splits and head-to-head records.',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-[#0B1425] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="text-xs font-semibold tracking-[0.2em] uppercase text-[#8ABFFF] font-mono mb-3">
            YOUR PIPE BAND ARCHIVE
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F8FC] tracking-tight font-sans mb-4">
            The whole competition. A new perspective.
          </h2>
          <p className="text-base sm:text-lg text-[#A7B4C7] leading-relaxed">
            From individual contest results to decades of championship history, discover more about the bands and competitions that matter to you.
          </p>
        </div>

        {/* Timeline Sequence */}
        <div className="relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden lg:block absolute top-12 left-10 right-10 h-0.5 bg-gradient-to-r from-[#8ABFFF]/40 via-[#4C9FFF]/40 to-[#8ABFFF]/40 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-[#111B2B] rounded-2xl border border-white/[0.08] p-7 flex flex-col justify-between relative group hover:border-[#8ABFFF]/40 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/20"
                >
                  <div>
                    {/* Step Badge & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#11213A] border border-[#8ABFFF]/25 flex items-center justify-center text-[#8ABFFF] group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-2xl font-bold text-[#8ABFFF]/40 group-hover:text-[#8ABFFF] transition-colors">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#F5F8FC] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#A7B4C7] leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-[#8ABFFF] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF]" />
                    {step.detail}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
