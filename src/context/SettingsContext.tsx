import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WebsiteSettings,
  DEFAULT_WEBSITE_SETTINGS,
  THEME_PRESETS,
  SiteColors,
} from '../types/settings.ts';

interface SettingsContextType {
  settings: WebsiteSettings;
  savedSettings: WebsiteSettings;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  previewFullSite: boolean;
  setPreviewFullSite: (preview: boolean) => void;
  openAdmin: () => void;
  loginAdmin: (password: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  changeAdminPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  updateColors: (colors: Partial<SiteColors>) => void;
  applyThemePreset: (presetId: string) => void;
  updateSettingSection: <K extends keyof WebsiteSettings>(
    section: K,
    data: Partial<WebsiteSettings[K]>
  ) => void;
  saveChanges: () => Promise<{ success: boolean; message?: string; error?: string }>;
  discardChanges: () => void;
  resetToDefaults: () => Promise<{ success: boolean; message?: string; error?: string }>;
  isLogoEntrancePlaying: boolean;
  finishLogoEntrance: () => void;
  triggerLogoEntrance: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

function applyCssVariables(colors: SiteColors) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', colors.primaryAccent);
  root.style.setProperty('--theme-secondary', colors.secondaryAccent);
  root.style.setProperty('--theme-bg-dark', colors.bgDark);
  root.style.setProperty('--theme-card', colors.cardSurface);
  root.style.setProperty('--theme-navy', colors.navySurface);
  root.style.setProperty('--theme-text-primary', colors.textPrimary);
  root.style.setProperty('--theme-text-muted', colors.textMuted);

  // Also update existing global variables for backward compatibility
  root.style.setProperty('--bg-midnight', colors.bgDark);
  root.style.setProperty('--bg-dark-navy', colors.navySurface);
  root.style.setProperty('--bg-panel', colors.cardSurface);
  root.style.setProperty('--electric-blue', colors.primaryAccent);
  root.style.setProperty('--bright-blue', colors.secondaryAccent);
  root.style.setProperty('--text-primary', colors.textPrimary);
  root.style.setProperty('--text-muted', colors.textMuted);
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_WEBSITE_SETTINGS);
  const [savedSettings, setSavedSettings] = useState<WebsiteSettings>(DEFAULT_WEBSITE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [previewFullSite, setPreviewFullSite] = useState(false);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('pipeband_admin_token');
    } catch {
      return null;
    }
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('pipeband_admin_token'));
  });

  // Logo entrance animation state
  const [isLogoEntrancePlaying, setIsLogoEntrancePlaying] = useState<boolean>(false);
  const finishLogoEntrance = useCallback(() => setIsLogoEntrancePlaying(false), []);
  const triggerLogoEntrance = useCallback(() => setIsLogoEntrancePlaying(true), []);

  // Verify stored token with backend
  useEffect(() => {
    if (!adminToken) {
      setIsAdminLoggedIn(false);
      return;
    }

    let isMounted = true;
    fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.success && data.authenticated) {
            setIsAdminLoggedIn(true);
          } else {
            setIsAdminLoggedIn(false);
            setAdminToken(null);
            localStorage.removeItem('pipeband_admin_token');
          }
        }
      })
      .catch(() => {
        // Keep offline optimistic state if error occurs
      });

    return () => {
      isMounted = false;
    };
  }, [adminToken]);

  // Compute if local settings differ from saved
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  // Sync CSS variables on color changes
  useEffect(() => {
    applyCssVariables(settings.colors);
  }, [settings.colors]);

  // Open Admin helper: triggers login modal if not logged in
  const openAdmin = useCallback(() => {
    if (isAdminLoggedIn) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  }, [isAdminLoggedIn]);

  // Admin Login Action
  const loginAdmin = useCallback(async (password: string, username: string = 'admin') => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, username }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        setIsAdminLoggedIn(true);
        try {
          localStorage.setItem('pipeband_admin_token', data.token);
        } catch {
          // ignore localStorage error
        }
        setIsLoginModalOpen(false);
        setIsAdminOpen(true);
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid admin credentials' };
    } catch {
      return { success: false, error: 'Network error communicating with authentication service.' };
    }
  }, []);

  // Admin Logout Action
  const logoutAdmin = useCallback(async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch {
        // ignore network error on logout
      }
    }
    setAdminToken(null);
    setIsAdminLoggedIn(false);
    setIsAdminOpen(false);
    try {
      localStorage.removeItem('pipeband_admin_token');
    } catch {
      // ignore
    }
  }, [adminToken]);

  // Change Password Action
  const changeAdminPassword = useCallback(
    async (currentPass: string, newPass: string) => {
      if (!adminToken) {
        return { success: false, error: 'You must be logged in as admin to change password.' };
      }
      try {
        const res = await fetch('/api/admin/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          return { success: true };
        }
        return { success: false, error: data.error || 'Failed to update password.' };
      } catch {
        return { success: false, error: 'Network error updating password.' };
      }
    },
    [adminToken]
  );

  // Fetch from server on initial load
  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings && isMounted) {
            // Deep merge with defaults in case new fields were added
            const merged: WebsiteSettings = {
              ...DEFAULT_WEBSITE_SETTINGS,
              ...data.settings,
              colors: {
                ...DEFAULT_WEBSITE_SETTINGS.colors,
                ...(data.settings.colors || {}),
              },
              visuals: {
                ...DEFAULT_WEBSITE_SETTINGS.visuals,
                ...(data.settings.visuals || {}),
              },
              seo: {
                ...DEFAULT_WEBSITE_SETTINGS.seo,
                ...(data.settings.seo || {}),
              },
              announcement: {
                ...DEFAULT_WEBSITE_SETTINGS.announcement,
                ...(data.settings.announcement || {}),
              },
              navigation: {
                ...DEFAULT_WEBSITE_SETTINGS.navigation,
                ...(data.settings.navigation || {}),
              },
              hero: {
                ...DEFAULT_WEBSITE_SETTINGS.hero,
                ...(data.settings.hero || {}),
                stats: data.settings.hero?.stats || DEFAULT_WEBSITE_SETTINGS.hero.stats,
              },
              features: {
                ...DEFAULT_WEBSITE_SETTINGS.features,
                ...(data.settings.features || {}),
              },
              charts: {
                ascent: {
                  ...DEFAULT_WEBSITE_SETTINGS.charts.ascent,
                  ...(data.settings.charts?.ascent || {}),
                  milestones:
                    data.settings.charts?.ascent?.milestones &&
                    data.settings.charts.ascent.milestones.length > 0
                      ? data.settings.charts.ascent.milestones
                      : DEFAULT_WEBSITE_SETTINGS.charts.ascent.milestones,
                },
                adjudicator: {
                  ...DEFAULT_WEBSITE_SETTINGS.charts.adjudicator,
                  ...(data.settings.charts?.adjudicator || {}),
                },
                rivalry: {
                  ...DEFAULT_WEBSITE_SETTINGS.charts.rivalry,
                  ...(data.settings.charts?.rivalry || {}),
                },
                trophy: {
                  ...DEFAULT_WEBSITE_SETTINGS.charts.trophy,
                  ...(data.settings.charts?.trophy || {}),
                },
              },
              roadmap: {
                ...DEFAULT_WEBSITE_SETTINGS.roadmap,
                ...(data.settings.roadmap || {}),
              },
              signup: {
                ...DEFAULT_WEBSITE_SETTINGS.signup,
                ...(data.settings.signup || {}),
              },
              footer: {
                ...DEFAULT_WEBSITE_SETTINGS.footer,
                ...(data.settings.footer || {}),
              },
            };
            setSettings(merged);
            setSavedSettings(merged);
          }
        }
      } catch (err) {
        console.warn('Could not load remote settings, using defaults:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateColors = useCallback((partial: Partial<SiteColors>) => {
    setSettings((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...partial,
      },
    }));
  }, []);

  const applyThemePreset = useCallback((presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSettings((prev) => ({
      ...prev,
      themePreset: presetId,
      colors: {
        ...preset.colors,
      },
    }));
  }, []);

  const updateSettingSection = useCallback(
    <K extends keyof WebsiteSettings>(section: K, data: Partial<WebsiteSettings[K]>) => {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...(typeof prev[section] === 'object' && prev[section] !== null ? prev[section] : {}),
          ...data,
        },
      }));
    },
    []
  );

  const saveChanges = useCallback(async () => {
    setIsSaving(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSavedSettings(settings);
        return { success: true, message: 'Settings & colors saved permanently!' };
      }
      if (res.status === 401) {
        setIsAdminLoggedIn(false);
        setIsLoginModalOpen(true);
        return { success: false, error: 'Admin session expired. Please log in again.' };
      }
      return { success: false, error: data.error || 'Failed to save settings.' };
    } catch {
      return { success: false, error: 'Network error occurred while saving.' };
    } finally {
      setIsSaving(false);
    }
  }, [settings, adminToken]);

  const discardChanges = useCallback(() => {
    setSettings(savedSettings);
  }, [savedSettings]);

  const resetToDefaults = useCallback(async () => {
    setIsSaving(true);
    try {
      const headers: Record<string, string> = {};
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const res = await fetch('/api/settings/reset', { method: 'POST', headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(DEFAULT_WEBSITE_SETTINGS);
        setSavedSettings(DEFAULT_WEBSITE_SETTINGS);
        return { success: true, message: 'Reset to factory defaults.' };
      }
      if (res.status === 401) {
        setIsAdminLoggedIn(false);
        setIsLoginModalOpen(true);
        return { success: false, error: 'Admin login required to reset settings.' };
      }
      return { success: false, error: data.error || 'Failed to reset settings.' };
    } catch {
      return { success: false, error: 'Network error occurred while resetting.' };
    } finally {
      setIsSaving(false);
    }
  }, [adminToken]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        savedSettings,
        isLoading,
        isSaving,
        hasUnsavedChanges,
        isAdminOpen,
        setIsAdminOpen,
        isAdminLoggedIn,
        adminToken,
        isLoginModalOpen,
        setIsLoginModalOpen,
        previewFullSite,
        setPreviewFullSite,
        openAdmin,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        updateColors,
        applyThemePreset,
        updateSettingSection,
        saveChanges,
        discardChanges,
        resetToDefaults,
        isLogoEntrancePlaying,
        finishLogoEntrance,
        triggerLogoEntrance,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
