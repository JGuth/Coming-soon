import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, Lock, Shield } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { PrivacyPolicyModal } from './PrivacyPolicyModal.tsx';
import { useSettings } from '../context/SettingsContext.tsx';

interface LaunchListSignupProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const LaunchListSignup: React.FC<LaunchListSignupProps> = ({ inputRef }) => {
  const { settings } = useSettings();
  const { signup, colors } = settings;

  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('general');
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(true);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const validateEmail = (val: string): boolean => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return re.test(val.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address (e.g. piper@example.com).');
      return;
    }

    if (!consent) {
      setStatus('error');
      setMessage('Please confirm your consent to receive launch notifications.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          interest,
          consent,
          honeypot,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'You’re on the list! We’ll be in touch with launch news.');
        try {
          localStorage.setItem('pipeband_registered_email', email.trim());
        } catch {
          // ignore localStorage security errors if sandboxed
        }
      } else {
        setStatus('error');
        setMessage(data.error || 'Unable to register your email. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to connect to the PipeBand.app server. Please check your internet connection.');
    }
  };

  return (
    <section
      id="signup"
      className="relative py-10 sm:py-20 border-t border-white/[0.06] overflow-hidden transition-colors"
      style={{ backgroundColor: colors.bgDark }}
    >
      {/* Background Lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] blur-[150px] rounded-full pointer-events-none opacity-20"
        style={{ backgroundColor: colors.secondaryAccent }}
      />

      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        {/* Main Panel */}
        <div
          className="relative rounded-2xl sm:rounded-3xl border p-4 sm:p-8 md:p-12 shadow-2xl shadow-black/60 overflow-hidden"
          style={{
            backgroundColor: colors.cardSurface,
            borderColor: `${colors.primaryAccent}40`,
          }}
        >
          {/* Subtle Accent Glow Border Effect */}
          <div
            className="absolute top-0 inset-x-0 h-1"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.primaryAccent}, transparent)`,
            }}
          />

          <div className="max-w-2xl mx-auto text-center">
            {/* Prominent Logo Badge */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <div
                className="p-2 sm:p-3 rounded-xl sm:rounded-2xl border shadow-lg"
                style={{
                  backgroundColor: colors.bgDark,
                  borderColor: `${colors.primaryAccent}35`,
                  boxShadow: `0 8px 20px -4px ${colors.primaryAccent}20`,
                }}
              >
                <BrandLogo size="md" showWordmark={false} variant="glow" />
              </div>
            </div>

            {/* Header */}
            {signup.tag && (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium mb-3 sm:mb-5 border"
                style={{
                  backgroundColor: colors.navySurface,
                  borderColor: `${colors.primaryAccent}30`,
                  color: colors.primaryAccent,
                }}
              >
                <Lock className="w-3 h-3" />
                <span>{signup.tag}</span>
              </div>
            )}

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3 font-sans" style={{ color: colors.textPrimary }}>
              {signup.title}
            </h2>

            <p className="text-xs sm:text-base leading-relaxed mb-5 sm:mb-8" style={{ color: colors.textMuted }}>
              {signup.subtitle}
            </p>

            {/* Success State */}
            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="border rounded-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300"
                style={{
                  backgroundColor: colors.navySurface,
                  borderColor: `${colors.primaryAccent}50`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full border flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: `${colors.primaryAccent}20`,
                    borderColor: `${colors.primaryAccent}50`,
                    color: colors.primaryAccent,
                  }}
                >
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You're on the launch list!</h3>
                <p className="text-sm max-w-md mx-auto mb-6" style={{ color: colors.textMuted }}>
                  {message}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setEmail('');
                    setMessage('');
                  }}
                  className="text-xs font-mono hover:underline cursor-pointer"
                  style={{ color: colors.primaryAccent }}
                >
                  Register another email address →
                </button>
              </div>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="hp_company">Company</label>
                  <input
                    id="hp_company"
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Email and Submit Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: colors.textMuted }}>
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder="Enter your email address"
                      aria-label="Email address"
                      aria-required="true"
                      aria-invalid={status === 'error'}
                      disabled={status === 'loading'}
                      className="w-full pl-11 pr-4 py-3.5 border rounded-xl text-base focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: colors.bgDark,
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                        color: colors.textPrimary,
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-semibold text-base rounded-xl transition-all duration-150 shadow-md cursor-pointer shrink-0 disabled:opacity-60 hover:brightness-110 active:brightness-95"
                    style={{
                      backgroundColor: colors.primaryAccent,
                      color: colors.bgDark,
                      boxShadow: `0 4px 15px ${colors.primaryAccent}40`,
                    }}
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>{signup.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Optional Community Role Selector */}
                <div className="pt-2">
                  <div className="text-xs font-mono mb-2 text-left sm:text-center" style={{ color: colors.textMuted }}>
                    Optional: What connects you to the pipe band scene?
                  </div>
                  <div className="flex flex-wrap justify-start sm:justify-center gap-2">
                    {[
                      { id: 'piper', label: 'Piper' },
                      { id: 'drummer', label: 'Drummer' },
                      { id: 'band_member', label: 'Band Member / Official' },
                      { id: 'supporter', label: 'Follower / Supporter' },
                      { id: 'general', label: 'General Enthusiast' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setInterest(item.id)}
                        className="text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer"
                        style={{
                          backgroundColor: interest === item.id ? colors.navySurface : `${colors.bgDark}80`,
                          borderColor: interest === item.id ? colors.primaryAccent : 'rgba(255, 255, 255, 0.08)',
                          color: interest === item.id ? colors.primaryAccent : colors.textMuted,
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2.5 text-left pt-2">
                  <input
                    type="checkbox"
                    id="consent-check"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 rounded cursor-pointer"
                    style={{ accentColor: colors.primaryAccent }}
                  />
                  <label htmlFor="consent-check" className="text-xs leading-relaxed cursor-pointer select-none" style={{ color: colors.textMuted }}>
                    {signup.consentText}
                  </label>
                </div>

                {/* Error Banner */}
                {status === 'error' && (
                  <div
                    role="alert"
                    className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 text-left animate-in fade-in duration-200"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
              </form>
            )}

            {/* Privacy Reassurance Note */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs" style={{ color: colors.textMuted }}>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" style={{ color: colors.primaryAccent }} />
                <span>{signup.disclaimer || 'Zero spam. Strict privacy.'}</span>
              </span>
              <span>·</span>
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="underline hover:opacity-100 transition-opacity rounded px-1 cursor-pointer"
                style={{ color: colors.primaryAccent }}
              >
                Read our Privacy Policy & Data Notice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Privacy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </section>
  );
};
