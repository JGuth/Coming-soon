import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, X, KeyRound, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginAdmin, settings } = useSettings();
  const { colors } = settings;

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('Please enter the admin password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await loginAdmin(password.trim(), username.trim());
    setIsLoading(false);

    if (result.success) {
      setPassword('');
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden relative"
        style={{
          backgroundColor: colors.cardSurface,
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px 0 ${colors.primaryAccent}15`,
        }}
      >
        {/* Glow Header Accent */}
        <div
          className="h-1.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${colors.primaryAccent}, ${colors.secondaryAccent})`,
          }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close login modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Brand & Security Header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-inner"
              style={{
                backgroundColor: colors.navySurface,
                borderColor: `${colors.primaryAccent}40`,
                color: colors.primaryAccent,
              }}
            >
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Admin Authentication</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  SQLite Auth
                </span>
              </div>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                Sign in to customize website copy, colors, charts & leads
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Authentication Failed</p>
                <p className="text-[11px] text-red-200/80 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 rounded-xl border text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                style={{
                  backgroundColor: colors.navySurface,
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>
                  Password
                </label>
                <span className="text-[11px] font-mono text-white/40">
                  Default: <code className="text-amber-300 font-semibold">admin123</code>
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  autoFocus
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-sm text-white placeholder-white/30 focus:outline-none transition-colors font-mono"
                  style={{
                    backgroundColor: colors.navySurface,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-1 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Helper Banner */}
            <div
              className="p-3 rounded-xl border text-xs"
              style={{
                backgroundColor: `${colors.navySurface}80`,
                borderColor: `${colors.primaryAccent}25`,
              }}
            >
              <div className="flex items-start gap-2">
                <KeyRound className="w-4 h-4 mt-0.5 shrink-0" style={{ color: colors.primaryAccent }} />
                <div className="text-[11px] leading-relaxed" style={{ color: colors.textMuted }}>
                  <span className="font-semibold text-white">Default initial password:</span>{' '}
                  <span className="font-mono text-amber-300 font-bold bg-amber-950/40 px-1 py-0.5 rounded border border-amber-500/30">
                    admin123
                  </span>
                  . Once logged in, you can update your password at any time in the{' '}
                  <strong className="text-white">Security & Login</strong> tab.
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: colors.primaryAccent,
                  color: colors.bgDark,
                  boxShadow: `0 4px 14px 0 ${colors.primaryAccent}40`,
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Unlock Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
