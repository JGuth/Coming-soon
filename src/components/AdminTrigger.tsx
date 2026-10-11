import React from 'react';
import { Sliders, Lock, ShieldCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

export const AdminTrigger: React.FC = () => {
  const { isAdminOpen, openAdmin, hasUnsavedChanges, isAdminLoggedIn, settings } = useSettings();

  if (isAdminOpen) return null;

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 select-none">
      <button
        type="button"
        onClick={openAdmin}
        className="group relative flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          backgroundColor: `${settings.colors.cardSurface}EE`,
          borderColor: hasUnsavedChanges ? '#F59E0B' : `${settings.colors.primaryAccent}45`,
          boxShadow: `0 8px 20px -4px ${settings.colors.primaryAccent}30`,
        }}
        aria-label="Open Admin & Theme Customizer"
        title={isAdminLoggedIn ? "Admin Panel (Logged In) (Ctrl+Shift+A)" : "Admin Login & Customizer (Ctrl+Shift+A)"}
      >
        {/* Glow halo */}
        <span
          className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity"
          style={{ backgroundColor: settings.colors.primaryAccent }}
        />

        <span className="relative flex items-center justify-center">
          {isAdminLoggedIn ? (
            <Sliders
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:rotate-45"
              style={{ color: settings.colors.primaryAccent }}
            />
          ) : (
            <Lock
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              style={{ color: settings.colors.primaryAccent }}
            />
          )}
        </span>

        <span className="relative text-[11px] sm:text-xs font-semibold font-mono tracking-tight text-white pr-0.5">
          {isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
        </span>

        {hasUnsavedChanges ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
        ) : isAdminLoggedIn ? (
          <span
            className="relative px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase flex items-center gap-0.5"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#34D399',
            }}
          >
            <ShieldCheck className="w-2.5 h-2.5" />
            AUTH
          </span>
        ) : (
          <span
            className="relative px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
            style={{
              backgroundColor: `${settings.colors.primaryAccent}25`,
              color: settings.colors.primaryAccent,
            }}
          >
            LOCK
          </span>
        )}
      </button>
    </div>
  );
};
