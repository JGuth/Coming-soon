import React from 'react';
import { Sliders, ShieldCheck, Eye, EyeOff, LogOut } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

export const AdminTrigger: React.FC = () => {
  const {
    isAdminOpen,
    openAdmin,
    hasUnsavedChanges,
    isAdminLoggedIn,
    logoutAdmin,
    settings,
    previewFullSite,
    setPreviewFullSite,
  } = useSettings();

  // If admin panel drawer is open, don't overlay
  if (isAdminOpen) return null;

  // When not logged in: keep it completely hidden from visitors!
  // (Hidden triggers exist on SplashPage via logo click, bottom lock icon, and Ctrl+Shift+A)
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed bottom-1 right-1 z-40 select-none">
        {/* Secret nearly invisible 6px spot for direct admin click */}
        <button
          type="button"
          onClick={openAdmin}
          className="w-4 h-4 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white/40 cursor-pointer"
          title="Admin Access (Ctrl+Shift+A)"
          aria-label="Admin Access"
        >
          🔒
        </button>
      </div>
    );
  }

  // When logged in as Admin: Render convenient Admin Quick-Control Bar
  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 select-none flex items-center gap-1.5 p-1 rounded-full shadow-2xl backdrop-blur-md border animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        backgroundColor: `${settings.colors.cardSurface}F0`,
        borderColor: hasUnsavedChanges ? '#F59E0B' : `${settings.colors.primaryAccent}45`,
        boxShadow: `0 8px 24px -4px ${settings.colors.primaryAccent}30`,
      }}
    >
      {/* 1. Toggle Preview Mode: Single Page Splash vs Full Site */}
      <button
        type="button"
        onClick={() => setPreviewFullSite(!previewFullSite)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer"
        style={{
          backgroundColor: previewFullSite ? `${settings.colors.primaryAccent}25` : 'transparent',
          color: previewFullSite ? settings.colors.primaryAccent : settings.colors.textMuted,
        }}
        title={previewFullSite ? "Switching to Public Single Page" : "Previewing Full Multi-Section Website"}
      >
        {previewFullSite ? (
          <>
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Viewing: Full Site</span>
            <span className="sm:hidden">Full</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Viewing: 1 Page Splash</span>
            <span className="sm:hidden">Splash</span>
          </>
        )}
      </button>

      {/* 2. Open Admin Panel */}
      <button
        type="button"
        onClick={openAdmin}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          backgroundColor: settings.colors.primaryAccent,
          color: settings.colors.bgDark,
        }}
        title="Open Admin Customizer (Ctrl+Shift+A)"
      >
        <Sliders className="w-3.5 h-3.5" />
        <span>Admin Panel</span>
        {hasUnsavedChanges && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
        )}
      </button>

      {/* 3. Auth badge / quick logout */}
      <button
        type="button"
        onClick={logoutAdmin}
        className="p-1.5 rounded-full text-[#A7B4C7] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        title="Sign Out of Admin"
        aria-label="Sign Out of Admin"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
