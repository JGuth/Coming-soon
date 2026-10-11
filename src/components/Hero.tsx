import React, { useState } from 'react';
import { ArrowDown, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import heroLogoImage from '../assets/images/regenerated_image_1791656993056.png';
import { useSettings } from '../context/SettingsContext.tsx';

interface HeroProps {
  onScrollToTeasers: () => void;
  onScrollToRoadmap: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToTeasers, onScrollToRoadmap }) => {
  const { settings } = useSettings();
  const { hero, colors } = settings;

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
    <section
      className="relative flex flex-col justify-center pt-20 sm:pt-28 pb-10 sm:pb-16 overflow-hidden technical-grid stave-lines"
      style={{
        backgroundColor: colors.bgDark,
        color: colors.textPrimary,
      }}
    >
      {/* Cinematic Lighting */}
      <div
        className="absolute top-0 inset-x-0 h-64 sm:h-96 pointer-events-none"
        style={{
          background: `radial-gradient(circle 800px at 50% -10%, ${colors.secondaryAccent}25, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] blur-[130px] rounded-full pointer-events-none"
        style={{ backgroundColor: `${colors.secondaryAccent}15` }}
      />

      {/* Large Ambient Watermark of Official Logo in Hero Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[360px] sm:h-[520px] opacity-[0.045] pointer-events-none select-none">
        <BrandLogo size="hero" showWordmark={false} variant="white" className="w-full h-full" imageSrc={heroLogoImage} />
      </div>

      {/* Decorative Musical Stave Vectors */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-full max-w-7xl animate-pulse-subtle"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="120" x2="1200" y2="120" stroke={colors.primaryAccent} strokeWidth="0.75" strokeDasharray="6 4" />
          <line x1="0" y1="140" x2="1200" y2="140" stroke={colors.primaryAccent} strokeWidth="0.5" />
          <line x1="0" y1="160" x2="1200" y2="160" stroke={colors.primaryAccent} strokeWidth="0.5" />
          <line x1="0" y1="180" x2="1200" y2="180" stroke={colors.primaryAccent} strokeWidth="0.5" />
          <line x1="0" y1="200" x2="1200" y2="200" stroke={colors.primaryAccent} strokeWidth="0.75" strokeDasharray="4 6" />
          <path
            d="M 80 220 C 320 140, 520 270, 780 140 C 940 70, 1100 160, 1200 130"
            stroke={colors.secondaryAccent}
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 text-center z-10 flex-1 flex flex-col justify-center">
        
        {/* PROMINENT OFFICIAL LOGO SHOWCASE IN HERO */}
        <div className="flex flex-col items-center justify-center mb-3 sm:mb-5">
          <div className="relative group cursor-default">
            {/* Ambient halo glow behind logo */}
            <div
              className="absolute inset-0 blur-2xl rounded-full scale-125 pointer-events-none opacity-30"
              style={{ backgroundColor: colors.primaryAccent }}
            />
            
            {/* Illuminated Emblem Frame */}
            <div
              className="relative border rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xl backdrop-blur-md transition-transform duration-300 hover:scale-105"
              style={{
                backgroundColor: `${colors.navySurface}E6`,
                borderColor: `${colors.primaryAccent}45`,
                boxShadow: `0 15px 30px -10px ${colors.primaryAccent}25`,
              }}
            >
              <BrandLogo size="lg" showWordmark={false} variant="glow" imageSrc={heroLogoImage} />
            </div>
          </div>
        </div>

        {/* Eyebrow */}
        {hero.badge && (
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3 justify-center">
            <span
              className="w-1.5 h-1.5 rounded-full animate-ping"
              style={{ backgroundColor: colors.primaryAccent }}
            />
            <span
              className="text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase font-mono"
              style={{ color: colors.primaryAccent }}
            >
              {hero.badge}
            </span>
          </div>
        )}

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-3 sm:mb-5 font-sans">
          <span>{hero.titleLine1}</span><br className="hidden sm:inline" />{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.textPrimary}, ${colors.primaryAccent})`,
            }}
          >
            {hero.titleLine2}
          </span><br className="hidden sm:inline" />{' '}
          <span style={{ color: colors.primaryAccent }}>
            {hero.titleLine3}
          </span>
        </h1>

        {/* Supporting Paragraph */}
        <p
          className="max-w-2xl mx-auto text-xs sm:text-base leading-relaxed mb-5 sm:mb-7 px-1"
          style={{ color: colors.textMuted }}
        >
          {hero.description}
        </p>

        {/* Quick Email Form Right in Hero */}
        <div className="max-w-md mx-auto w-full mb-5 sm:mb-7">
          {status === 'success' ? (
            <div
              className="border rounded-xl p-3 text-xs flex items-center justify-center gap-2 animate-in fade-in duration-200"
              style={{
                backgroundColor: colors.navySurface,
                borderColor: `${colors.primaryAccent}50`,
                color: colors.textPrimary,
              }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: colors.primaryAccent }} />
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
                  placeholder={hero.inputPlaceholder || 'Enter your email address'}
                  aria-label="Email address"
                  disabled={status === 'loading'}
                  className="flex-1 px-3.5 py-2.5 sm:py-3 border rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.cardSurface,
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    color: colors.textPrimary,
                  }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50 hover:brightness-110 active:brightness-95"
                  style={{
                    backgroundColor: colors.primaryAccent,
                    color: colors.bgDark,
                    boxShadow: `0 4px 14px ${colors.primaryAccent}35`,
                  }}
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{hero.ctaText || 'Join launch list'}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

          <div
            className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs pt-2.5"
            style={{ color: colors.textMuted }}
          >
            <span>{hero.featureNote1 || 'Free early access'}</span>
            <span>·</span>
            <span>{hero.featureNote2 || 'Zero spam'}</span>
            <span>·</span>
            <button
              type="button"
              onClick={onScrollToTeasers}
              className="hover:underline cursor-pointer inline-flex items-center gap-1"
              style={{ color: colors.primaryAccent }}
            >
              {hero.featureNote3 || 'Teased features'} <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Key Archive Statistics Counter Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5 max-w-3xl mx-auto w-full pt-3 sm:pt-4 border-t border-white/[0.06]">
          {hero.stats.map((stat, i) => (
            <div
              key={i}
              className="p-2.5 sm:p-3 rounded-xl border border-white/[0.04] transition-all hover:border-white/10"
              style={{ backgroundColor: `${colors.cardSurface}B3` }}
            >
              <div
                className="text-lg sm:text-2xl font-bold font-mono"
                style={{ color: stat.color || colors.primaryAccent }}
              >
                {stat.value}
              </div>
              <div
                className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider"
                style={{ color: colors.textMuted }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
