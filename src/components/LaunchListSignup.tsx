import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, Lock, Shield } from 'lucide-react';
import { PrivacyPolicyModal } from './PrivacyPolicyModal.tsx';

interface LaunchListSignupProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const LaunchListSignup: React.FC<LaunchListSignupProps> = ({ inputRef }) => {
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
    <section id="signup" className="relative py-24 sm:py-32 bg-[#0B1425] border-t border-white/[0.06] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#4C9FFF]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Panel */}
        <div className="relative bg-[#111B2B] rounded-3xl border border-[#8ABFFF]/30 p-8 sm:p-12 md:p-16 shadow-2xl shadow-black/60 overflow-hidden">
          {/* Subtle Accent Glow Border Effect */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#8ABFFF] to-transparent" />

          <div className="max-w-2xl mx-auto text-center">
            {/* Header */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11213A] border border-[#8ABFFF]/25 text-[#8ABFFF] text-xs font-mono font-medium mb-6">
              <Lock className="w-3.5 h-3.5" />
              <span>EARLY ACCESS LAUNCH LIST</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F5F8FC] tracking-tight mb-4 font-sans">
              Be part of what's next.
            </h2>

            <p className="text-base sm:text-lg text-[#A7B4C7] leading-relaxed mb-8 sm:mb-10">
              The pipe band world's results and history are coming together in one place.
              Sign up to hear when PipeBand.app launches.
            </p>

            {/* Success State */}
            {status === 'success' ? (
              <div
                role="status"
                aria-live="polite"
                className="bg-[#11213A] border border-[#8ABFFF]/40 rounded-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#8ABFFF]/15 border border-[#8ABFFF]/40 flex items-center justify-center text-[#8ABFFF] mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You're on the launch list!</h3>
                <p className="text-sm text-[#A7B4C7] max-w-md mx-auto mb-6">
                  {message}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    setEmail('');
                    setMessage('');
                  }}
                  className="text-xs font-mono text-[#8ABFFF] hover:underline cursor-pointer"
                >
                  Register another email address →
                </button>
              </div>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot field (hidden from real users, tricks spam scrapers) */}
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
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A7B4C7]">
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
                      className="w-full pl-11 pr-4 py-3.5 bg-[#0B1425] border border-white/[0.12] rounded-xl text-[#F5F8FC] placeholder-[#A7B4C7]/60 text-base focus:outline-none focus:ring-2 focus:ring-[#8ABFFF] focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#8ABFFF] hover:bg-[#A3CEFF] active:bg-[#72AEEF] text-[#0B1425] font-semibold text-base rounded-xl transition-all duration-150 shadow-md shadow-[#8ABFFF]/25 hover:shadow-lg hover:shadow-[#8ABFFF]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111B2B] focus-visible:ring-[#8ABFFF] disabled:opacity-60 cursor-pointer shrink-0"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Join the launch list</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Optional Community Role Selector */}
                <div className="pt-2">
                  <div className="text-xs text-[#A7B4C7] font-mono mb-2 text-left sm:text-center">
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
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          interest === item.id
                            ? 'bg-[#11213A] border-[#8ABFFF] text-[#8ABFFF] font-medium'
                            : 'bg-[#0B1425]/50 border-white/[0.08] text-[#A7B4C7] hover:border-white/20'
                        }`}
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
                    className="mt-1 rounded bg-[#0B1425] border-white/20 text-[#8ABFFF] focus:ring-[#8ABFFF] focus:ring-offset-[#111B2B] cursor-pointer"
                  />
                  <label htmlFor="consent-check" className="text-xs text-[#A7B4C7] leading-relaxed cursor-pointer select-none">
                    Yes, keep me notified about the launch of PipeBand.app and platform preview access. No spam, ever.
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
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#A7B4C7]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#8ABFFF]" />
                Zero spam. Strict privacy.
              </span>
              <span>·</span>
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="underline hover:text-[#8ABFFF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8ABFFF] rounded px-1 cursor-pointer"
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
