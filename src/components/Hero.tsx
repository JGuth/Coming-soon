import React, { useState } from 'react';
import { ArrowDown, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

interface HeroProps {
  onScrollToTeasers: () => void;
  onScrollToRoadmap: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToTeasers, onScrollToRoadmap }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validateEmail = (val: string): boolean => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return re.test(val.trim());
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'hero_quick' }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message || "You're on the launch list!");
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden technical-grid stave-lines">
      {/* Cinematic Lighting */}
      <div className="absolute top-0 inset-x-0 h-96 radial-glow-top pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] bg-[#4C9FFF]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Decorative Musical Stave Vectors */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-full max-w-7xl animate-pulse-subtle"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="120" x2="1200" y2="120" stroke="#8ABFFF" strokeWidth="0.75" strokeDasharray="6 4" />
          <line x1="0" y1="140" x2="1200" y2="140" stroke="#8ABFFF" strokeWidth="0.5" />
          <line x1="0" y1="160" x2="1200" y2="160" stroke="#8ABFFF" strokeWidth="0.5" />
          <line x1="0" y1="180" x2="1200" y2="180" stroke="#8ABFFF" strokeWidth="0.5" />
          <line x1="0" y1="200" x2="1200" y2="200" stroke="#8ABFFF" strokeWidth="0.75" strokeDasharray="4 6" />
          <path
            d="M 80 220 C 320 140, 520 270, 780 140 C 940 70, 1100 160, 1200 130"
            stroke="#4C9FFF"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 flex-1 flex flex-col justify-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8ABFFF] animate-ping" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#8ABFFF] font-mono">
            1998 – 2026 OFFICIAL ARCHIVES · 28 SEASONS
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#F5F8FC] leading-[1.08] mb-6 font-sans">
          Every contest.<br className="hidden sm:inline" />{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F8FC] via-[#D2E4FF] to-[#8ABFFF]">
            Every result.
          </span><br className="hidden sm:inline" />{' '}
          <span className="text-[#8ABFFF]">Every story.</span>
        </h1>

        {/* Supporting Paragraph with Specific Product Intelligence */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#A7B4C7] leading-relaxed mb-8">
          The home of pipe band results, competitive history and statistics.
          Transforming 28 years of RSPBA championship archives into interactive band profiles,
          historic rivalry arenas, and forensic adjudication analytics.
        </p>

        {/* Quick Email Form Right in Hero */}
        <div className="max-w-md mx-auto w-full mb-8">
          {status === 'success' ? (
            <div className="bg-[#11213A] border border-[#8ABFFF]/40 rounded-xl p-3.5 text-xs text-white flex items-center justify-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-[#8ABFFF]" />
              <span>{message} You'll be the first to know when we launch!</span>
            </div>
          ) : (
            <form onSubmit={handleHeroSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  disabled={status === 'loading'}
                  className="flex-1 px-4 py-3 bg-[#111B2B] border border-white/[0.12] rounded-xl text-[#F5F8FC] placeholder-[#A7B4C7]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ABFFF] transition-all"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8ABFFF] hover:bg-[#A3CEFF] text-[#0B1425] font-semibold text-sm rounded-xl transition-all shadow-md shadow-[#8ABFFF]/25 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Join launch list</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <div className="text-xs text-rose-300 flex items-center justify-center gap-1.5 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{message}</span>
                </div>
              )}
            </form>
          )}

          <div className="flex items-center justify-center gap-4 text-xs text-[#A7B4C7]/80 pt-3">
            <span>Free early access</span>
            <span>·</span>
            <span>Zero spam</span>
            <span>·</span>
            <button
              type="button"
              onClick={onScrollToTeasers}
              className="text-[#8ABFFF] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              Teased features <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Key Archive Statistics Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto w-full pt-4 border-t border-white/[0.06]">
          <div className="bg-[#111B2B]/60 p-3 rounded-xl border border-white/[0.04]">
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">28 Years</div>
            <div className="text-[11px] text-[#A7B4C7] uppercase font-mono tracking-wider">1998–2026 Archive</div>
          </div>

          <div className="bg-[#111B2B]/60 p-3 rounded-xl border border-white/[0.04]">
            <div className="text-xl sm:text-2xl font-bold font-mono text-[#8ABFFF]">600+</div>
            <div className="text-[11px] text-[#A7B4C7] uppercase font-mono tracking-wider">Major Contests</div>
          </div>

          <div className="bg-[#111B2B]/60 p-3 rounded-xl border border-white/[0.04]">
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">4,800+</div>
            <div className="text-[11px] text-[#A7B4C7] uppercase font-mono tracking-wider">Judge Marks</div>
          </div>

          <div className="bg-[#111B2B]/60 p-3 rounded-xl border border-white/[0.04]">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">100%</div>
            <div className="text-[11px] text-[#A7B4C7] uppercase font-mono tracking-wider">Verified Records</div>
          </div>
        </div>
      </div>
    </section>
  );
};
