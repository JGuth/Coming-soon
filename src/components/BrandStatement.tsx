import React, { useEffect, useRef, useState } from 'react';

export const BrandStatement: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState([false, false, false]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Progressive staggered reveal
            setTimeout(() => setVisibleItems((prev) => [true, prev[1], prev[2]]), 100);
            setTimeout(() => setVisibleItems((prev) => [prev[0], true, prev[2]]), 300);
            setTimeout(() => setVisibleItems((prev) => [prev[0], prev[1], true]), 500);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const phrases = [
    { text: 'EVERY CONTEST.', highlight: 'From local Highland games to the World Championship arena.' },
    { text: 'EVERY RESULT.', highlight: 'Precise adjudicator scorecards, aggregate totals and rankings.' },
    { text: 'EVERY STORY.', highlight: 'The rivalries, historic streaks and moments that shape generations.' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-36 bg-[#070D19] overflow-hidden border-y border-white/[0.06]"
    >
      {/* Restrained Abstract Line Pattern in Background */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <svg
          viewBox="0 0 1440 600"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100 300 Q 360 100, 720 300 T 1540 300"
            stroke="#8ABFFF"
            strokeWidth="0.75"
            strokeDasharray="4 8"
          />
          <path
            d="M -100 200 Q 400 450, 800 200 T 1600 200"
            stroke="#4C9FFF"
            strokeWidth="0.75"
            strokeOpacity="0.5"
          />
          <line x1="0" y1="150" x2="1440" y2="150" stroke="#162742" strokeWidth="0.5" />
          <line x1="0" y1="450" x2="1440" y2="450" stroke="#162742" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Atmospheric center spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#8ABFFF]/4 blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="space-y-14 sm:space-y-20">
          {phrases.map((item, idx) => (
            <div
              key={item.text}
              className={`transition-all duration-700 transform ${
                visibleItems[idx]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#F5F8FC] uppercase font-sans">
                {item.text.split(' ')[0]}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8ABFFF] to-[#4C9FFF]">
                  {item.text.split(' ')[1]}
                </span>
              </h3>
              <p className="mt-2 text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-[#A7B4C7]">
                {item.highlight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
