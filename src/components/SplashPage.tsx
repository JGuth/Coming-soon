import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Loader2, Lock, TrendingUp, X, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import heroLogoImage from '../assets/images/regenerated_image_1791656993056.png';
import { useSettings } from '../context/SettingsContext.tsx';
import { GradeProgressionChart } from './GradeProgressionChart.tsx';

export const SplashPage: React.FC = () => {
  const { settings, openAdmin } = useSettings();
  const { colors, hero, announcement } = settings;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  const validateEmail = (val: string): boolean => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return re.test(val.trim());
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
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
        body: JSON.stringify({ email: email.trim(), source: 'splash_page' }),
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

  // Secret multi-click on copyright or logo to open admin
  const handleSecretClick = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount >= 3) {
      setSecretClickCount(0);
      openAdmin();
    }
  };

  return (
    <div
      className="h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-between overflow-hidden relative select-none"
      style={{
        backgroundColor: colors.bgDark,
        color: colors.textPrimary,
      }}
    >
      {/* Background Lighting & Atmosphere */}
      <div
        className="absolute top-0 inset-x-0 h-64 sm:h-80 pointer-events-none"
        style={{
          background: `radial-gradient(circle 700px at 50% -10%, ${colors.secondaryAccent}25, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[400px] blur-[120px] rounded-full pointer-events-none opacity-30"
        style={{ backgroundColor: colors.secondaryAccent }}
      />

      {/* Decorative Musical Stave Vectors */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-full max-w-6xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="120" x2="1200" y2="120" stroke={colors.primaryAccent} strokeWidth="0.75" strokeDasharray="6 4" />
          <line x1="0" y1="140" x2="1200" y2="140" stroke={colors.primaryAccent} strokeWidth="0.5" />
          <line x1="0" y1="160" x2="1200" y2="160" stroke={colors.primaryAccent} strokeWidth="0.5" />
          <line x1="0" y1="180" x2="1200" y2="180" stroke={colors.primaryAccent} strokeWidth="0.5" />
          <line x1="0" y1="200" x2="1200" y2="200" stroke={colors.primaryAccent} strokeWidth="0.75" strokeDasharray="4 6" />
        </svg>
      </div>

      {/* =========================================================================
          TOP HEADER & ANNOUNCEMENT BAR
         ========================================================================= */}
      <header className="relative z-10 w-full shrink-0">
        {/* Top Announcement Bar */}
        {announcement?.enabled && (
          <div
            className="w-full py-1 sm:py-1.5 px-3 border-b text-center text-[10px] sm:text-xs font-medium tracking-tight flex items-center justify-center gap-2 truncate"
            style={{
              backgroundColor: `${colors.navySurface}CC`,
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: colors.textPrimary,
            }}
          >
            <span
              className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold tracking-wider uppercase shrink-0"
              style={{
                backgroundColor: `${colors.primaryAccent}25`,
                color: colors.primaryAccent,
              }}
            >
              {announcement.badgeText || 'ARCHIVE UPDATE'}
            </span>
            <span className="truncate">{announcement.text}</span>
          </div>
        )}

        {/* Brand Bar */}
        <div className="max-w-5xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" showWordmark={true} variant="glow" imageSrc={heroLogoImage} />
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: `${colors.primaryAccent}15`,
                borderColor: `${colors.primaryAccent}30`,
                color: colors.primaryAccent,
              }}
            >
              LAUNCHING 2026
            </span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          CENTER HERO CONTENT (Carefully balanced to fit without scrolling)
         ========================================================================= */}
      <main className="relative z-10 max-w-4xl mx-auto px-3.5 sm:px-6 w-full flex-1 flex flex-col justify-center items-center text-center my-auto py-1 sm:py-3">
        {/* Official Logo Emblem - Clickable as a secret admin shortcut */}
        <div className="mb-2 sm:mb-3">
          <button
            type="button"
            onClick={openAdmin}
            title="PipeBand.app Emblem (Click for Admin Access)"
            className="relative group cursor-pointer border rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: `${colors.navySurface}E6`,
              borderColor: `${colors.primaryAccent}45`,
              boxShadow: `0 12px 28px -8px ${colors.primaryAccent}30`,
            }}
          >
            <div
              className="absolute inset-0 blur-xl rounded-2xl scale-110 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity"
              style={{ backgroundColor: colors.primaryAccent }}
            />
            <BrandLogo size="lg" showWordmark={false} variant="glow" imageSrc={heroLogoImage} />
          </button>
        </div>

        {/* Eyebrow Archive Badge */}
        <div className="inline-flex items-center gap-1.5 mb-1.5 sm:mb-2">
          <span
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: colors.primaryAccent }}
          />
          <span
            className="text-[10px] sm:text-xs font-semibold tracking-[0.16em] uppercase font-mono"
            style={{ color: colors.primaryAccent }}
          >
            {hero.badge || '1998 – 2026 OFFICIAL ARCHIVES · 28 SEASONS'}
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-2 sm:mb-3 font-sans">
          <span>{hero.titleLine1 || 'Every contest..'}</span>{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(to right, ${colors.textPrimary}, ${colors.primaryAccent})`,
            }}
          >
            {hero.titleLine2 || 'Every result.'}
          </span>{' '}
          <span style={{ color: colors.primaryAccent }}>
            {hero.titleLine3 || 'Every story.'}
          </span>
        </h1>

        {/* Supporting Paragraph Description */}
        <p
          className="max-w-xl mx-auto text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 px-2"
          style={{ color: colors.textMuted }}
        >
          {hero.description ||
            'The home of pipe band results, competitive history and statistics. Transforming 28 years of RSPBA championship archives into interactive band profiles, historic rivalry arenas, and forensic adjudication analytics.'}
        </p>

        {/* Quick Launch List Email Capture Form */}
        <div className="max-w-md mx-auto w-full mb-3 sm:mb-4">
          {status === 'success' ? (
            <div
              className="border rounded-xl p-2.5 sm:p-3 text-xs flex items-center justify-center gap-2 animate-in fade-in"
              style={{
                backgroundColor: colors.navySurface,
                borderColor: `${colors.primaryAccent}50`,
                color: colors.textPrimary,
              }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{message} You'll be notified the moment we launch!</span>
            </div>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-1.5">
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
                  className="flex-1 px-3.5 py-2.5 border rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-1"
                  style={{
                    backgroundColor: colors.cardSurface,
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                    color: colors.textPrimary,
                  }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer shrink-0 disabled:opacity-50 hover:brightness-110 active:brightness-95"
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
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <div className="text-xs text-rose-300 flex items-center justify-center gap-1.5 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{message}</span>
                </div>
              )}
            </form>
          )}

          <div
            className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] pt-1.5"
            style={{ color: colors.textMuted }}
          >
            <span>{hero.featureNote1 || 'Free early access'}</span>
            <span>·</span>
            <span>{hero.featureNote2 || 'Zero spam'}</span>
            <span>·</span>
            <span style={{ color: colors.primaryAccent }}>Launching 2026</span>
          </div>
        </div>

        {/* 4 Archive Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 max-w-2xl mx-auto w-full pt-2 sm:pt-3 border-t border-white/[0.08]">
          {hero.stats?.map((stat, i) => (
            <div
              key={i}
              className="p-2 sm:p-2.5 rounded-xl border border-white/[0.06] transition-all"
              style={{ backgroundColor: `${colors.cardSurface}B3` }}
            >
              <div
                className="text-base sm:text-xl font-bold font-mono tracking-tight"
                style={{ color: stat.color || colors.primaryAccent }}
              >
                {stat.value}
              </div>
              <div
                className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider mt-0.5"
                style={{ color: colors.textMuted }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* =========================================================================
          BOTTOM FOOTER WITH PREVIEW MODAL BUTTON & HIDDEN ADMIN BUTTON
         ========================================================================= */}
      <footer className="relative z-10 w-full px-4 py-2 sm:py-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] sm:text-xs shrink-0">
        <span
          onClick={handleSecretClick}
          className="cursor-pointer select-none"
          style={{ color: colors.textMuted }}
          title="PipeBand.app"
        >
          © {new Date().getFullYear()} PipeBand.app · All rights reserved.
        </span>

        {/* Center: Preview Animated Ascent Modal Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsChartModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border border-[#8ABFFF]/30 bg-[#8ABFFF]/10 hover:bg-[#8ABFFF]/25 text-[#8ABFFF] hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Preview animated RSPBA competitive grade ascent chart"
          >
            <TrendingUp className="w-3 h-3 text-[#8ABFFF]" />
            <span>chart</span>
          </button>
        </div>

        {/* Hidden Admin Trigger - Low opacity and blended, but fully accessible */}
        <button
          type="button"
          onClick={openAdmin}
          className="opacity-15 hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/5 cursor-pointer text-white/50 hover:text-white"
          title="Admin Access (Ctrl+Shift+A)"
          aria-label="Admin Access"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </footer>

      {/* =========================================================================
          INTERACTIVE ANIMATED CHART PREVIEW MODAL
         ========================================================================= */}
      {isChartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl flex flex-col p-4 sm:p-6 relative animate-in zoom-in-95 duration-200"
            style={{
              backgroundColor: colors.bgDark,
              borderColor: `${colors.primaryAccent}40`,
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm sm:text-base font-bold text-white font-sans flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#8ABFFF]" />
                  <span>RSPBA Competitive Grade Ascent & Milestones</span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsChartModalOpen(false)}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Close Chart Preview"
                aria-label="Close Chart Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Interactive Grade Progression Chart with animated stops */}
            <div className="flex-1">
              <GradeProgressionChart />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
