import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Type,
  TrendingUp,
  Activity,
  Users,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Search,
  RefreshCw,
  Eye,
  Sparkles,
  Sliders,
  Send,
  Check,
  FileCode,
  Swords,
  Scale,
  Trophy,
  Lock,
  KeyRound,
  ShieldCheck,
  LogOut,
  Plus,
  Layout,
  Layers,
  Crown,
  Rocket,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';
import {
  THEME_PRESETS,
  SiteColors,
  DEFAULT_WEBSITE_SETTINGS,
  SiteChartsConfig,
  AscentMilestone,
  SiteVisualOptions,
} from '../types/settings.ts';
import { SignupRecord } from '../../server/db.ts';

type ActiveTab = 'colors' | 'charts' | 'texts' | 'styling' | 'security' | 'signups' | 'testing' | 'data';

export const AdminPanel: React.FC = () => {
  const {
    settings,
    isAdminOpen,
    setIsAdminOpen,
    adminToken,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    setIsLoginModalOpen,
    updateColors,
    applyThemePreset,
    updateSettingSection,
    saveChanges,
    discardChanges,
    resetToDefaults,
    hasUnsavedChanges,
    isSaving,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<ActiveTab>('colors');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Signups state
  const [signups, setSignups] = useState<SignupRecord[]>([]);
  const [totalSignups, setTotalSignups] = useState(0);
  const [signupsLoading, setSignupsLoading] = useState(false);
  const [signupSearch, setSignupSearch] = useState('');
  const [signupFilterInstrument, setSignupFilterInstrument] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Inline security login state
  const [inlineUser, setInlineUser] = useState('admin');
  const [inlinePass, setInlinePass] = useState('');
  const [inlineLoading, setInlineLoading] = useState(false);

  // Testing tab state
  const [testEmail, setTestEmail] = useState('piper.test@example.com');
  const [testInterest, setTestInterest] = useState('piper');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<Record<string, unknown> | null>(null);
  const [testingHealth, setTestingHealth] = useState(false);

  // Sub-section filters
  const [textSection, setTextSection] = useState<'hero' | 'stats' | 'announcement' | 'features' | 'roadmap' | 'signup' | 'footer'>('hero');
  const [chartModule, setChartModule] = useState<'ascent' | 'adjudicator' | 'rivalry' | 'trophy'>('ascent');

  // JSON import/export state
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  // Fallback safe charts config
  const charts = settings.charts || DEFAULT_WEBSITE_SETTINGS.charts;

  const updateChartModule = <K extends keyof SiteChartsConfig>(
    mod: K,
    patch: Partial<SiteChartsConfig[K]>
  ) => {
    updateSettingSection('charts', {
      ...charts,
      [mod]: {
        ...charts[mod],
        ...patch,
      },
    });
  };

  const currentMilestones: AscentMilestone[] =
    charts.ascent.milestones && charts.ascent.milestones.length > 0
      ? charts.ascent.milestones
      : (DEFAULT_WEBSITE_SETTINGS.charts.ascent.milestones as AscentMilestone[]);

  const handleUpdateMilestone = (id: string, patch: Partial<AscentMilestone>) => {
    const updated = currentMilestones.map((m) => (m.id === id ? { ...m, ...patch } : m));
    updateChartModule('ascent', { milestones: updated });
  };

  const handleDeleteMilestone = (id: string) => {
    if (currentMilestones.length <= 2) {
      showToast('error', 'The chart requires at least 2 milestones.');
      return;
    }
    const updated = currentMilestones.filter((m) => m.id !== id);
    updateChartModule('ascent', { milestones: updated });
    showToast('success', 'Milestone removed from timeline.');
  };

  const handleAddNewMilestone = () => {
    const newEntry: AscentMilestone = {
      id: `m_${Date.now()}`,
      year: newMilestoneYear.trim() || '2025',
      grade: newMilestoneGrade.trim() || 'Grade 1',
      eventTitle: newMilestoneTitle.trim() || 'Championship Title',
      isPromotion: newMilestoneIsPromo,
      isWorldChampion: newMilestoneIsWorldChamp,
      notes: newMilestoneNotes.trim(),
    };
    const updated = [...currentMilestones, newEntry].sort((a, b) => Number(a.year) - Number(b.year));
    updateChartModule('ascent', { milestones: updated });
    setIsAddingMilestone(false);
    showToast('success', `Added milestone for season ${newMilestoneYear}!`);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAdminOpen) {
        setIsAdminOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen(!isAdminOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminOpen, setIsAdminOpen]);

  // Fetch signups when tab is selected
  useEffect(() => {
    if (activeTab === 'signups' && isAdminOpen) {
      fetchSignups();
    }
  }, [activeTab, isAdminOpen, signupSearch]);

  // Manual signup & auth form state
  const [manualEmail, setManualEmail] = useState('');
  const [manualInterest, setManualInterest] = useState('piper');
  const [manualLoading, setManualLoading] = useState(false);

  // Security password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passSubmitting, setPassSubmitting] = useState(false);

  // New Milestone Editor state
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestoneYear, setNewMilestoneYear] = useState('2025');
  const [newMilestoneGrade, setNewMilestoneGrade] = useState('Grade 1');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('Major Championship Contender');
  const [newMilestoneIsPromo, setNewMilestoneIsPromo] = useState(false);
  const [newMilestoneIsWorldChamp, setNewMilestoneIsWorldChamp] = useState(false);
  const [newMilestoneNotes, setNewMilestoneNotes] = useState('Championship campaign recorded in archives.');

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchSignups = async () => {
    setSignupsLoading(true);
    try {
      const q = signupSearch ? `?search=${encodeURIComponent(signupSearch)}` : '';
      const headers: Record<string, string> = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const res = await fetch(`/api/admin/signups${q}`, { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setSignups(data.signups || []);
        setTotalSignups(data.totalCount || 0);
      } else if (res.status === 401) {
        showToast('error', 'Admin session expired. Please re-authenticate.');
      }
    } catch {
      showToast('error', 'Failed to retrieve signups list.');
    } finally {
      setSignupsLoading(false);
    }
  };

  const handleDeleteSignup = async (id: number) => {
    if (!confirm(`Are you sure you want to remove signup #${id}?`)) return;
    setDeletingId(id);
    try {
      const headers: Record<string, string> = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const res = await fetch(`/api/admin/signups/${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', data.message || 'Signup removed.');
        fetchSignups();
      } else {
        showToast('error', data.error || 'Failed to remove.');
      }
    } catch {
      showToast('error', 'Error removing signup.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleManualSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail || !manualEmail.includes('@')) {
      showToast('error', 'Please enter a valid email address.');
      return;
    }
    setManualLoading(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      };
      const res = await fetch('/api/admin/signups/manual', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: manualEmail, interest: manualInterest }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', `Added ${manualEmail} to signups.`);
        setManualEmail('');
        fetchSignups();
      } else {
        showToast('error', data.error || 'Failed to add manual signup.');
      }
    } catch {
      showToast('error', 'Network error adding manual signup.');
    } finally {
      setManualLoading(false);
    }
  };

  const handleClearAllSignups = async () => {
    if (!confirm('WARNING: Are you sure you want to permanently clear ALL signups from the SQLite database?')) {
      return;
    }
    try {
      const headers: Record<string, string> = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const res = await fetch('/api/admin/signups/clear-all', { method: 'DELETE', headers });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'All signups have been cleared.');
        fetchSignups();
      } else {
        showToast('error', data.error || 'Failed to clear signups.');
      }
    } catch {
      showToast('error', 'Network failure clearing signups.');
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      showToast('error', 'Please provide both current and new password.');
      return;
    }
    if (newPass.length < 4) {
      showToast('error', 'New password must be at least 4 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      showToast('error', 'New password and confirm password do not match.');
      return;
    }

    setPassSubmitting(true);
    const result = await changeAdminPassword(currentPass, newPass);
    setPassSubmitting(false);

    if (result.success) {
      showToast('success', 'Admin password changed successfully! Remember your new credentials.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      showToast('error', result.error || 'Failed to change password.');
    }
  };

  const handleInlineLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlinePass) {
      showToast('error', 'Please enter your admin password.');
      return;
    }
    setInlineLoading(true);
    const res = await loginAdmin(inlinePass, inlineUser || 'admin');
    setInlineLoading(false);
    if (res.success) {
      showToast('success', 'Admin authenticated successfully!');
      setInlinePass('');
    } else {
      showToast('error', res.error || 'Authentication rejected.');
    }
  };

  const handleExportSignupsCsv = () => {
    if (signups.length === 0) {
      showToast('error', 'No signups to export.');
      return;
    }
    const headers = ['ID', 'Email', 'Interest', 'Source', 'Consent', 'Created At'];
    const rows = signups.map((s) => [
      s.id,
      `"${s.email.replace(/"/g, '""')}"`,
      `"${s.interest.replace(/"/g, '""')}"`,
      `"${s.source.replace(/"/g, '""')}"`,
      s.consent ? 'Yes' : 'No',
      `"${s.created_at}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pipeband_signups_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', `Exported ${signups.length} signups to CSV.`);
  };

  const handleCopyAllEmails = async () => {
    if (signups.length === 0) {
      showToast('error', 'No signups available.');
      return;
    }
    const filtered =
      signupFilterInstrument === 'all'
        ? signups
        : signups.filter((s) => s.interest.toLowerCase().includes(signupFilterInstrument.toLowerCase()));
    const emails = filtered.map((s) => s.email).join(', ');
    try {
      await navigator.clipboard.writeText(emails);
      showToast('success', `Copied ${filtered.length} emails to clipboard.`);
    } catch {
      showToast('error', 'Failed to copy to clipboard.');
    }
  };

  const handleApplyMilestonePreset = (presetKey: 'inveraray' | 'boghall' | 'fmm') => {
    if (presetKey === 'inveraray') {
      updateChartModule('ascent', {
        bandName: 'INVERARAY & DISTRICT',
        journeySubtitle: 'Novice Juvenile (2005) to Premier Grade 1 World Champions (2017 & 2019)',
        startingGrade: 'Novice Juvenile',
        startingYear: '2005',
        peakGrade: 'Grade 1',
        promotionsCount: '3',
        yearsToGrade1: '5 Yrs',
        milestones: DEFAULT_WEBSITE_SETTINGS.charts.ascent.milestones,
      });
      showToast('success', 'Loaded Inveraray & District 2005–2026 archive campaign!');
    } else if (presetKey === 'boghall') {
      const boghallMilestones: AscentMilestone[] = [
        { id: 'b1', year: '1972', grade: 'Juvenile', eventTitle: 'West Lothian Inception', isPromotion: false, isWorldChampion: false, notes: 'Founded by P/M Tom Brown in West Lothian.' },
        { id: 'b2', year: '1980', grade: 'Grade 1', eventTitle: 'Elevated to Grade 1 Premier', isPromotion: true, isWorldChampion: false, notes: 'Promoted to premier grade.' },
        { id: 'b3', year: '2001', grade: 'Grade 1', eventTitle: 'World Drumming Champions', isPromotion: false, isWorldChampion: false, notes: 'Drum corps took World Drumming banner.' },
        { id: 'b4', year: '2019', grade: 'Grade 1', eventTitle: 'Major Championship Double', isPromotion: false, isWorldChampion: false, notes: 'Captured Scottish and British titles.' },
        { id: 'b5', year: '2023', grade: 'Grade 1', eventTitle: 'Grade 1 World Champions', isPromotion: false, isWorldChampion: true, notes: 'Historical 1st World Title on Glasgow Green under P/M Ross Harvey.' },
        { id: 'b6', year: '2026', grade: 'Grade 1', eventTitle: 'Defending Scottish Champions', isPromotion: false, isWorldChampion: false, notes: 'Consistent podium finisher across all 5 RSPBA major championships.' },
      ];
      updateChartModule('ascent', {
        bandName: 'PEOPLES FORD BOGHALL & BATHGATE CALEDONIA',
        journeySubtitle: 'Fifty years of competitive pride culminating in 2023 World Championship glory',
        startingGrade: 'Juvenile',
        startingYear: '1972',
        peakGrade: 'Grade 1',
        promotionsCount: '1',
        yearsToGrade1: '8 Yrs',
        milestones: boghallMilestones,
      });
      showToast('success', 'Loaded Boghall & Bathgate Caledonia 2023 World Champions archive!');
    } else if (presetKey === 'fmm') {
      const fmmMilestones: AscentMilestone[] = [
        { id: 'f1', year: '1945', grade: 'Grade 3', eventTitle: 'Formed in Lisburn, Co. Antrim', isPromotion: false, isWorldChampion: false, notes: 'Formed in Northern Ireland post-WWII.' },
        { id: 'f2', year: '1981', grade: 'Grade 1', eventTitle: 'Elevated to Grade 1 Premier', isPromotion: true, isWorldChampion: false, notes: 'Elevated to the premier flight.' },
        { id: 'f3', year: '1992', grade: 'Grade 1', eventTitle: '1st World Championship Win', isPromotion: false, isWorldChampion: true, notes: 'Breakthrough victory under P/M Richard Parkes MBE.' },
        { id: 'f4', year: '2016', grade: 'Grade 1', eventTitle: 'Grand Slam Major Sweep', isPromotion: false, isWorldChampion: true, notes: 'Swept all 5 majors in a single calendar season.' },
        { id: 'f5', year: '2022', grade: 'Grade 1', eventTitle: '13th World Championship Crown', isPromotion: false, isWorldChampion: true, notes: 'Record-extending 13th Grade 1 World Championship.' },
        { id: 'f6', year: '2026', grade: 'Grade 1', eventTitle: '75+ Major Titles Milestone', isPromotion: false, isWorldChampion: false, notes: 'The most decorated pipe band of the modern competition era.' },
      ];
      updateChartModule('ascent', {
        bandName: 'FIELD MARSHAL MONTGOMERY',
        journeySubtitle: '13-time Grade 1 World Champions and standard-bearer of piping ensemble',
        startingGrade: 'Grade 3',
        startingYear: '1945',
        peakGrade: 'Grade 1',
        promotionsCount: '2',
        yearsToGrade1: '36 Yrs',
        milestones: fmmMilestones,
      });
      showToast('success', 'Loaded Field Marshal Montgomery 13-title championship archive!');
    }
  };

  const handleSave = async () => {
    const res = await saveChanges();
    if (res.success) {
      showToast('success', res.message || 'Changes saved successfully.');
    } else {
      showToast('error', res.error || 'Failed to save changes.');
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        'Are you sure you want to revert all custom text, announcements, chart configs and colours to the original default values?'
      )
    ) {
      return;
    }
    const res = await resetToDefaults();
    if (res.success) {
      showToast('success', 'Reset all settings to defaults.');
    } else {
      showToast('error', res.error || 'Failed to reset.');
    }
  };

  const runHealthCheck = async () => {
    setTestingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch (err: unknown) {
      setHealthStatus({ status: 'error', error: String(err) });
    } finally {
      setTestingHealth(false);
    }
  };

  const runSimulatedSignup = async () => {
    setTestStatus('Submitting test signup...');
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          interest: testInterest,
          consent: true,
          source: 'admin_test_console',
        }),
      });
      const data = await res.json();
      setTestStatus(
        res.ok
          ? `Status ${res.status}: ${data.message || (data.isNew ? 'Added successfully' : 'Existing record handled')}`
          : `Error ${res.status}: ${data.error || 'Request rejected'}`
      );
      if (activeTab === 'signups') fetchSignups();
    } catch (err: unknown) {
      setTestStatus(`Network failure: ${String(err)}`);
    }
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeband_settings_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Settings configuration downloaded.');
  };

  const handleApplyJson = () => {
    try {
      setJsonError('');
      const parsed = JSON.parse(jsonText);
      if (!parsed.colors || !parsed.hero) {
        throw new Error('Invalid settings JSON format. Missing colors or hero definition.');
      }
      updateSettingSection('colors', parsed.colors);
      if (parsed.announcement) updateSettingSection('announcement', parsed.announcement);
      if (parsed.navigation) updateSettingSection('navigation', parsed.navigation);
      if (parsed.hero) updateSettingSection('hero', parsed.hero);
      if (parsed.features) updateSettingSection('features', parsed.features);
      if (parsed.charts) updateSettingSection('charts', parsed.charts);
      if (parsed.roadmap) updateSettingSection('roadmap', parsed.roadmap);
      if (parsed.signup) updateSettingSection('signup', parsed.signup);
      if (parsed.footer) updateSettingSection('footer', parsed.footer);
      showToast('success', 'JSON settings imported into live preview! Click Save to keep.');
    } catch (err: unknown) {
      setJsonError((err as Error).message || 'Invalid JSON syntax.');
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Website Customizer & Admin Panel"
      className="fixed inset-0 z-50 overflow-hidden flex justify-end"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsAdminOpen(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Main Drawer Container - Full screen on mobile, 4xl on desktop */}
      <div className="relative w-full sm:max-w-4xl bg-[#0B1425] border-l border-white/[0.12] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300 text-[#F5F8FC]">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`absolute top-3 left-4 right-4 sm:top-4 sm:left-6 sm:right-6 z-50 p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/95 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:text-white text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-white/[0.08] bg-[#111B2B] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-xl bg-[#8ABFFF]/15 border border-[#8ABFFF]/30 text-[#8ABFFF] shrink-0">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">Admin Customizer</h2>
                <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#11213A] border border-white/10 text-[#8ABFFF]">
                  LIVE SYNC
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#A7B4C7] truncate hidden sm:block">
                Tweak colors, chart metrics, copy, test forms & inspect database.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isAdminLoggedIn ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Admin Auth</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-pointer"
                title="Authenticate as Admin"
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Admin Login</span>
              </button>
            )}

            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={discardChanges}
                className="px-2 sm:px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-[#A7B4C7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Discard unsaved local changes"
              >
                Discard
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#8ABFFF] hover:bg-[#A3CEFF] text-[#0B1425] text-xs font-bold transition-all shadow-md shadow-[#8ABFFF]/25 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={logoutAdmin}
                className="p-1.5 rounded-lg border border-white/10 text-[#A7B4C7] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Sign out of admin session"
                aria-label="Sign out of admin session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg text-[#A7B4C7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close Admin Panel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation - Horizontal scroll with zero wasted space */}
        <div className="px-3 sm:px-6 border-b border-white/[0.08] bg-[#0E1726] flex items-center gap-0.5 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'colors'
                ? 'border-[#8ABFFF] text-[#8ABFFF] bg-white/[0.02]'
                : 'border-transparent text-[#A7B4C7] hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colours</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'charts'
                ? 'border-[#8ABFFF] text-[#8ABFFF] bg-white/[0.02]'
                : 'border-transparent text-[#A7B4C7] hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Charts & Milestones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('texts')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'texts'
                ? 'border-[#8ABFFF] text-[#8ABFFF] bg-white/[0.02]'
                : 'border-transparent text-[#A7B4C7] hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Website Text</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('styling')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'styling'
                ? 'border-[#8ABFFF] text-[#8ABFFF] bg-white/[0.02]'
                : 'border-transparent text-[#A7B4C7] hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Layout & Glow</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#8ABFFF] text-[#8ABFFF] bg-white/[0.02]'
                : 'border-transparent text-[#A7B4C7] hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security & Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('signups')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'signups'
                ? 'border-[#8ABFFF] text-[#8ABFFF] bg-white/[0.02]'
                : 'border-transparent text-[#A7B4C7] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Signups</span>
            {totalSignups > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#8ABFFF]/20 text-[#8ABFFF] font-mono">
                {totalSignups}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testing')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'testing'
                ? 'border-[#8ABFFF] text-[#8ABFFF] bg-white/[0.02]'
                : 'border-transparent text-[#A7B4C7] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Test Console</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'data'
                ? 'border-[#8ABFFF] text-[#8ABFFF] bg-white/[0.02]'
                : 'border-transparent text-[#A7B4C7] hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Backup</span>
          </button>
        </div>

        {/* Tab Body (Scrollable, mobile padded) */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">

          {/* =========================================================================
              TAB 1: COLOURS & THEME
             ========================================================================= */}
          {activeTab === 'colors' && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
              {/* Presets Grid */}
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#A7B4C7] font-mono">
                    Scottish & Piping Color Presets
                  </h3>
                  <span className="text-[11px] text-[#A7B4C7]">Preview instantly</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = settings.themePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyThemePreset(preset.id)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#11213A] border-[#8ABFFF] shadow-md shadow-[#8ABFFF]/20 ring-1 ring-[#8ABFFF]'
                            : 'bg-[#111B2B] border-white/[0.08] hover:border-white/20 hover:bg-[#11213A]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                          {isSelected && (
                            <span className="text-[9px] font-mono bg-[#8ABFFF] text-[#0B1425] px-1 py-0.2 rounded font-bold shrink-0">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#A7B4C7] mb-2 leading-tight line-clamp-1">{preset.description}</p>

                        {/* Palette Swatches Bar */}
                        <div className="flex items-center gap-1 pt-1.5 border-t border-white/[0.06]">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0" style={{ backgroundColor: preset.colors.primaryAccent }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0" style={{ backgroundColor: preset.colors.secondaryAccent }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: preset.colors.bgDark }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: preset.colors.cardSurface }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Individual Color Pickers */}
              <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A7B4C7] font-mono flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#8ABFFF]" />
                    <span>Granular Colour Controls</span>
                  </h3>
                  <span className="text-[11px] text-[#A7B4C7]">Live sync on page</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                  <ColorControlItem
                    label="Primary Accent"
                    description="Main interactive buttons, icons & active highlights"
                    value={settings.colors.primaryAccent}
                    onChange={(val) => updateColors({ primaryAccent: val })}
                  />
                  <ColorControlItem
                    label="Secondary Accent"
                    description="Complementary gradient tones & secondary badges"
                    value={settings.colors.secondaryAccent}
                    onChange={(val) => updateColors({ secondaryAccent: val })}
                  />
                  <ColorControlItem
                    label="Deep Background"
                    description="Main background body shade of the page"
                    value={settings.colors.bgDark}
                    onChange={(val) => updateColors({ bgDark: val })}
                  />
                  <ColorControlItem
                    label="Card & Panel Surface"
                    description="Teaser modules, signup panel & major card bases"
                    value={settings.colors.cardSurface}
                    onChange={(val) => updateColors({ cardSurface: val })}
                  />
                  <ColorControlItem
                    label="Elevated Navy Surface"
                    description="Nested sub-cards, statistic pills, header backdrop"
                    value={settings.colors.navySurface}
                    onChange={(val) => updateColors({ navySurface: val })}
                  />
                  <ColorControlItem
                    label="Primary Heading Text"
                    description="High-contrast readable headers & titles"
                    value={settings.colors.textPrimary}
                    onChange={(val) => updateColors({ textPrimary: val })}
                  />
                  <ColorControlItem
                    label="Muted Secondary Text"
                    description="Subtitles, descriptions, timestamps & labels"
                    value={settings.colors.textMuted}
                    onChange={(val) => updateColors({ textMuted: val })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: CHARTS & MODULES CUSTOMIZATION (NEW!)
             ========================================================================= */}
          {activeTab === 'charts' && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* Chart Module Switcher */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#111B2B] rounded-xl border border-white/[0.08]">
                {[
                  { id: 'ascent', label: '1. Grade Ascent Curve' },
                  { id: 'adjudicator', label: '2. Adjudicator Variance' },
                  { id: 'rivalry', label: '3. Rivalry Arena Clash' },
                  { id: 'trophy', label: '4. Virtual Trophy Case' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setChartModule(m.id as typeof chartModule)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      chartModule === m.id
                        ? 'bg-[#8ABFFF] text-[#0B1425]'
                        : 'text-[#A7B4C7] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Chart Submodule 1: Ascent Curve */}
              {chartModule === 'ascent' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span>Grade Ascent Trajectory Chart</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#8ABFFF]">TAB 1 PREVIEW</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Band Profile Name</label>
                      <input
                        type="text"
                        value={charts.ascent.bandName}
                        onChange={(e) => updateChartModule('ascent', { bandName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">World Titles Summary</label>
                      <input
                        type="text"
                        value={charts.ascent.worldTitlesLabel}
                        onChange={(e) => updateChartModule('ascent', { worldTitlesLabel: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Journey Subtitle</label>
                    <input
                      type="text"
                      value={charts.ascent.journeySubtitle}
                      onChange={(e) => updateChartModule('ascent', { journeySubtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Starting Grade</label>
                      <input
                        type="text"
                        value={charts.ascent.startingGrade}
                        onChange={(e) => updateChartModule('ascent', { startingGrade: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Start Year</label>
                      <input
                        type="text"
                        value={charts.ascent.startingYear}
                        onChange={(e) => updateChartModule('ascent', { startingYear: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Peak Grade</label>
                      <input
                        type="text"
                        value={charts.ascent.peakGrade}
                        onChange={(e) => updateChartModule('ascent', { peakGrade: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Ascent Time</label>
                      <input
                        type="text"
                        value={charts.ascent.yearsToGrade1}
                        onChange={(e) => updateChartModule('ascent', { yearsToGrade1: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Gradient Start</label>
                      <input
                        type="text"
                        value={charts.ascent.trajectoryGradientStart}
                        onChange={(e) => updateChartModule('ascent', { trajectoryGradientStart: e.target.value })}
                        className="w-full px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs font-mono text-white text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Gradient Mid</label>
                      <input
                        type="text"
                        value={charts.ascent.trajectoryGradientMid}
                        onChange={(e) => updateChartModule('ascent', { trajectoryGradientMid: e.target.value })}
                        className="w-full px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs font-mono text-white text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Gradient End</label>
                      <input
                        type="text"
                        value={charts.ascent.trajectoryGradientEnd}
                        onChange={(e) => updateChartModule('ascent', { trajectoryGradientEnd: e.target.value })}
                        className="w-full px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs font-mono text-white text-center"
                      />
                    </div>
                  </div>

                  {/* Theme match & Mobile layout preferences */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#0B1425] rounded-xl border border-white/10">
                    <div>
                      <label className="block text-[11px] font-mono text-white font-semibold mb-1">
                        Theme Colors Synchronization
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={charts.ascent.accentThemeMatch !== false}
                          onChange={(e) => updateChartModule('ascent', { accentThemeMatch: e.target.checked })}
                          className="rounded border-white/20 text-[#8ABFFF] focus:ring-0"
                        />
                        <span className="text-xs text-[#A7B4C7]">
                          Dynamically match curve to site accent colors
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-white font-semibold mb-1">
                        Default Mobile View Layout
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => updateChartModule('ascent', { defaultMobileView: 'stepper' })}
                          className={`px-3 py-1 rounded text-xs font-mono font-semibold border transition-all cursor-pointer ${
                            charts.ascent.defaultMobileView !== 'curve'
                              ? 'bg-[#8ABFFF] text-[#0B1425] border-[#8ABFFF]'
                              : 'bg-[#111B2B] text-[#A7B4C7] border-white/10'
                          }`}
                        >
                          Milestones Stepper
                        </button>
                        <button
                          type="button"
                          onClick={() => updateChartModule('ascent', { defaultMobileView: 'curve' })}
                          className={`px-3 py-1 rounded text-xs font-mono font-semibold border transition-all cursor-pointer ${
                            charts.ascent.defaultMobileView === 'curve'
                              ? 'bg-[#8ABFFF] text-[#0B1425] border-[#8ABFFF]'
                              : 'bg-[#111B2B] text-[#A7B4C7] border-white/10'
                          }`}
                        >
                          Trajectory Curve
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Historical Campaign Presets */}
                  <div className="p-3 bg-[#0B1425] rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-mono text-white font-semibold">
                        Load Band Era Presets
                      </label>
                      <span className="text-[10px] font-mono text-[#8ABFFF]">ARCHIVE ARCHETYPES</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleApplyMilestonePreset('inveraray')}
                        className="p-2 rounded-lg bg-[#111B2B] hover:bg-[#8ABFFF]/15 border border-white/10 hover:border-[#8ABFFF]/40 text-left transition-all cursor-pointer group"
                      >
                        <div className="text-xs font-bold text-white group-hover:text-[#8ABFFF]">Inveraray (2005–'26)</div>
                        <div className="text-[10px] text-[#A7B4C7]">Novice to 2x World Champions</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyMilestonePreset('boghall')}
                        className="p-2 rounded-lg bg-[#111B2B] hover:bg-amber-500/15 border border-white/10 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
                      >
                        <div className="text-xs font-bold text-white group-hover:text-amber-300">Boghall & Bathgate</div>
                        <div className="text-[10px] text-[#A7B4C7]">50-Year journey to '23 World Title</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyMilestonePreset('fmm')}
                        className="p-2 rounded-lg bg-[#111B2B] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-left transition-all cursor-pointer group"
                      >
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300">Field Marshal (FMM)</div>
                        <div className="text-[10px] text-[#A7B4C7]">13 World Titles & Grand Slams</div>
                      </button>
                    </div>
                  </div>

                  {/* Visual Trajectory Curve Styling */}
                  <div className="p-3 bg-[#0B1425] rounded-xl border border-white/10 space-y-3">
                    <label className="block text-[11px] font-mono text-white font-semibold">
                      Curve Line & Node Styling
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="block text-[10px] font-mono text-[#A7B4C7] mb-1">Curve Stroke Weight</span>
                        <div className="flex items-center gap-1.5">
                          {(['fine', 'medium', 'bold'] as const).map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => updateChartModule('ascent', { curveStrokeWidth: w })}
                              className={`px-2.5 py-1 rounded text-xs font-mono capitalize border transition-all cursor-pointer ${
                                (charts.ascent.curveStrokeWidth || 'medium') === w
                                  ? 'bg-[#8ABFFF] text-[#0B1425] border-[#8ABFFF] font-bold'
                                  : 'bg-[#111B2B] text-[#A7B4C7] border-white/10'
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-mono text-[#A7B4C7] mb-1">Grid & Glow</span>
                        <div className="space-y-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A7B4C7]">
                            <input
                              type="checkbox"
                              checked={charts.ascent.showGridlines !== false}
                              onChange={(e) => updateChartModule('ascent', { showGridlines: e.target.checked })}
                              className="rounded border-white/20 text-[#8ABFFF]"
                            />
                            <span>Background Gridlines</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A7B4C7]">
                            <input
                              type="checkbox"
                              checked={charts.ascent.showNodeGlow !== false}
                              onChange={(e) => updateChartModule('ascent', { showNodeGlow: e.target.checked })}
                              className="rounded border-white/20 text-[#8ABFFF]"
                            />
                            <span>Active Node Neon Glow</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-mono text-[#A7B4C7] mb-1">Rival Benchmark Overlay</span>
                        <input
                          type="text"
                          value={charts.ascent.rivalOverlayBandName || ''}
                          onChange={(e) => updateChartModule('ascent', { rivalOverlayBandName: e.target.value })}
                          placeholder="e.g. Field Marshal Montgomery (leave blank to hide)"
                          className="w-full px-2 py-1 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Landmarks badges */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-1">Landmark Badges on Curve</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={charts.ascent.landmark1Label}
                        onChange={(e) => updateChartModule('ascent', { landmark1Label: e.target.value })}
                        placeholder="Landmark 1"
                        className="px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={charts.ascent.landmark2Label}
                        onChange={(e) => updateChartModule('ascent', { landmark2Label: e.target.value })}
                        placeholder="Landmark 2"
                        className="px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={charts.ascent.landmark3Label}
                        onChange={(e) => updateChartModule('ascent', { landmark3Label: e.target.value })}
                        placeholder="Landmark 3"
                        className="px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={charts.ascent.landmark4Label}
                        onChange={(e) => updateChartModule('ascent', { landmark4Label: e.target.value })}
                        placeholder="Landmark 4"
                        className="px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={charts.ascent.landmark5Label}
                        onChange={(e) => updateChartModule('ascent', { landmark5Label: e.target.value })}
                        placeholder="Landmark 5"
                        className="px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={charts.ascent.landmark6Label}
                        onChange={(e) => updateChartModule('ascent', { landmark6Label: e.target.value })}
                        placeholder="Landmark 6"
                        className="px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Milestones Timeline Editor */}
                  <div className="p-3 bg-[#0B1425] rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#8ABFFF]" />
                          <span>Interactive Milestones ({currentMilestones.length} Seasons)</span>
                        </h4>
                        <p className="text-[10px] text-[#A7B4C7]">
                          Customize the progression cards displayed on mobile and desktop
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#8ABFFF]/20 border border-[#8ABFFF]/40 text-[#8ABFFF] hover:bg-[#8ABFFF]/30 text-xs font-mono font-semibold transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Season</span>
                      </button>
                    </div>

                    {/* Add Milestone Form if open */}
                    {isAddingMilestone && (
                      <div className="p-3 rounded-lg bg-[#111B2B] border border-[#8ABFFF]/30 space-y-2.5 animate-in fade-in">
                        <div className="text-xs font-bold text-white">Add New Milestone</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] font-mono text-[#A7B4C7]">Year</label>
                            <input
                              type="text"
                              value={newMilestoneYear}
                              onChange={(e) => setNewMilestoneYear(e.target.value)}
                              placeholder="2025"
                              className="w-full px-2 py-1 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-[#A7B4C7]">Grade</label>
                            <input
                              type="text"
                              value={newMilestoneGrade}
                              onChange={(e) => setNewMilestoneGrade(e.target.value)}
                              placeholder="Grade 1"
                              className="w-full px-2 py-1 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-[#A7B4C7]">Event / Title</label>
                            <input
                              type="text"
                              value={newMilestoneTitle}
                              onChange={(e) => setNewMilestoneTitle(e.target.value)}
                              placeholder="Major Championship Win"
                              className="w-full px-2 py-1 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#A7B4C7]">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newMilestoneIsPromo}
                              onChange={(e) => setNewMilestoneIsPromo(e.target.checked)}
                              className="rounded border-white/20 text-[#8ABFFF]"
                            />
                            <span>🚀 Promotion Season</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newMilestoneIsWorldChamp}
                              onChange={(e) => setNewMilestoneIsWorldChamp(e.target.checked)}
                              className="rounded border-white/20 text-amber-400"
                            />
                            <span>👑 World Champions Title</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-[#A7B4C7]">Archive Historical Notes</label>
                          <input
                            type="text"
                            value={newMilestoneNotes}
                            onChange={(e) => setNewMilestoneNotes(e.target.value)}
                            placeholder="Historic context or competition record..."
                            className="w-full px-2 py-1 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsAddingMilestone(false)}
                            className="px-2.5 py-1 rounded text-xs text-[#A7B4C7] hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddNewMilestone}
                            className="px-3 py-1 rounded bg-[#8ABFFF] text-[#0B1425] font-bold text-xs"
                          >
                            Save Milestone
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Milestones List */}
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {currentMilestones.map((m) => (
                        <div
                          key={m.id}
                          className="p-2.5 rounded-lg bg-[#111B2B] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                        >
                          <div className="flex-1 min-w-0 space-y-1 w-full">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-white bg-white/10 px-1.5 py-0.5 rounded">
                                {m.year}
                              </span>
                              <span className="text-xs font-semibold text-[#8ABFFF]">{m.grade}</span>
                              {m.isWorldChampion && (
                                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                                  👑 WORLD TITLE
                                </span>
                              )}
                              {m.isPromotion && (
                                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">
                                  🚀 PROMO
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={m.eventTitle}
                              onChange={(e) => handleUpdateMilestone(m.id, { eventTitle: e.target.value })}
                              className="w-full px-2 py-0.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                              title="Milestone title"
                            />
                            <input
                              type="text"
                              value={m.notes || ''}
                              onChange={(e) => handleUpdateMilestone(m.id, { notes: e.target.value })}
                              placeholder="Archive notes..."
                              className="w-full px-2 py-0.5 bg-[#0B1425] border border-white/5 rounded text-[11px] text-[#A7B4C7]"
                              title="Archive notes"
                            />
                          </div>

                          <div className="flex sm:flex-col items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleUpdateMilestone(m.id, { isWorldChampion: !m.isWorldChampion })}
                              className={`p-1 rounded text-xs ${m.isWorldChampion ? 'text-amber-400 bg-amber-400/10' : 'text-white/30 hover:text-white/70'}`}
                              title="Toggle World Champions crown"
                            >
                              <Crown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateMilestone(m.id, { isPromotion: !m.isPromotion })}
                              className={`p-1 rounded text-xs ${m.isPromotion ? 'text-purple-400 bg-purple-400/10' : 'text-white/30 hover:text-white/70'}`}
                              title="Toggle Promotion rocket"
                            >
                              <Rocket className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMilestone(m.id)}
                              className="p-1 rounded text-xs text-white/30 hover:text-rose-400"
                              title="Delete milestone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chart Submodule 2: Adjudicator Profile */}
              {chartModule === 'adjudicator' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-400" />
                      <span>Adjudicator Analytics Module</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#8ABFFF]">TAB 2 PREVIEW</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Adjudicator Name</label>
                      <input
                        type="text"
                        value={charts.adjudicator.adjudicatorName}
                        onChange={(e) => updateChartModule('adjudicator', { adjudicatorName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Discipline Badge</label>
                      <input
                        type="text"
                        value={charts.adjudicator.discipline}
                        onChange={(e) => updateChartModule('adjudicator', { discipline: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Career Span</label>
                      <input
                        type="text"
                        value={charts.adjudicator.careerSpan}
                        onChange={(e) => updateChartModule('adjudicator', { careerSpan: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Worlds Panels Badge</label>
                      <input
                        type="text"
                        value={charts.adjudicator.worldsPanels}
                        onChange={(e) => updateChartModule('adjudicator', { worldsPanels: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Assignments</label>
                      <input
                        type="text"
                        value={charts.adjudicator.assignments}
                        onChange={(e) => updateChartModule('adjudicator', { assignments: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Bands Scored</label>
                      <input
                        type="text"
                        value={charts.adjudicator.bandsScored}
                        onChange={(e) => updateChartModule('adjudicator', { bandsScored: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Contests</label>
                      <input
                        type="text"
                        value={charts.adjudicator.contests}
                        onChange={(e) => updateChartModule('adjudicator', { contests: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Majors</label>
                      <input
                        type="text"
                        value={charts.adjudicator.majors}
                        onChange={(e) => updateChartModule('adjudicator', { majors: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Chart Submodule 3: Rivalry Arena */}
              {chartModule === 'rivalry' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <Swords className="w-4 h-4 text-rose-400" />
                      <span>Rivalry Clash Arena Module</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#8ABFFF]">TAB 3 PREVIEW</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Band 1 */}
                    <div className="p-3 bg-[#0B1425] rounded-lg border border-white/10 space-y-2">
                      <label className="block text-[11px] font-mono text-[#8ABFFF] font-bold">Band #1</label>
                      <input
                        type="text"
                        value={charts.rivalry.band1Name}
                        onChange={(e) => updateChartModule('rivalry', { band1Name: e.target.value })}
                        placeholder="Band 1 Name"
                        className="w-full px-2.5 py-1.5 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={charts.rivalry.band1Wins}
                          onChange={(e) => updateChartModule('rivalry', { band1Wins: Number(e.target.value) })}
                          placeholder="Wins"
                          className="px-2 py-1 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                        />
                        <input
                          type="text"
                          value={charts.rivalry.band1WinPercent}
                          onChange={(e) => updateChartModule('rivalry', { band1WinPercent: e.target.value })}
                          placeholder="Win %"
                          className="px-2 py-1 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Band 2 */}
                    <div className="p-3 bg-[#0B1425] rounded-lg border border-white/10 space-y-2">
                      <label className="block text-[11px] font-mono text-emerald-400 font-bold">Band #2</label>
                      <input
                        type="text"
                        value={charts.rivalry.band2Name}
                        onChange={(e) => updateChartModule('rivalry', { band2Name: e.target.value })}
                        placeholder="Band 2 Name"
                        className="w-full px-2.5 py-1.5 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={charts.rivalry.band2Wins}
                          onChange={(e) => updateChartModule('rivalry', { band2Wins: Number(e.target.value) })}
                          placeholder="Wins"
                          className="px-2 py-1 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                        />
                        <input
                          type="text"
                          value={charts.rivalry.band2WinPercent}
                          onChange={(e) => updateChartModule('rivalry', { band2WinPercent: e.target.value })}
                          placeholder="Win %"
                          className="px-2 py-1 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Piping Corps Score</label>
                      <input
                        type="text"
                        value={charts.rivalry.pipingScore}
                        onChange={(e) => updateChartModule('rivalry', { pipingScore: e.target.value })}
                        className="w-full px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Drumming Score</label>
                      <input
                        type="text"
                        value={charts.rivalry.drummingScore}
                        onChange={(e) => updateChartModule('rivalry', { drummingScore: e.target.value })}
                        className="w-full px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Ensemble Score</label>
                      <input
                        type="text"
                        value={charts.rivalry.ensembleScore}
                        onChange={(e) => updateChartModule('rivalry', { ensembleScore: e.target.value })}
                        className="w-full px-2 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Iconic Decider Headline & Story</label>
                    <input
                      type="text"
                      value={charts.rivalry.iconicDeciderTitle}
                      onChange={(e) => updateChartModule('rivalry', { iconicDeciderTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white mb-1.5 font-bold"
                    />
                    <textarea
                      rows={2}
                      value={charts.rivalry.iconicDeciderDesc}
                      onChange={(e) => updateChartModule('rivalry', { iconicDeciderDesc: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Chart Submodule 4: Trophy Cabinet */}
              {chartModule === 'trophy' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Virtual Trophy Cabinet Module</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#8ABFFF]">TAB 4 PREVIEW</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Band Cabinet Name</label>
                      <input
                        type="text"
                        value={charts.trophy.bandName}
                        onChange={(e) => updateChartModule('trophy', { bandName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Archive Summary Tag</label>
                      <input
                        type="text"
                        value={charts.trophy.bandSummary}
                        onChange={(e) => updateChartModule('trophy', { bandSummary: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 bg-[#0B1425] rounded border border-white/10 space-y-1">
                      <span className="text-[10px] font-mono text-[#8ABFFF]">Trophy #1</span>
                      <input
                        type="text"
                        value={charts.trophy.trophy1Title}
                        onChange={(e) => updateChartModule('trophy', { trophy1Title: e.target.value })}
                        placeholder="Title"
                        className="w-full px-2 py-1 bg-[#111B2B] rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={charts.trophy.trophy1Year}
                        onChange={(e) => updateChartModule('trophy', { trophy1Year: e.target.value })}
                        placeholder="Year"
                        className="w-full px-2 py-1 bg-[#111B2B] rounded text-xs text-white"
                      />
                    </div>

                    <div className="p-2 bg-[#0B1425] rounded border border-white/10 space-y-1">
                      <span className="text-[10px] font-mono text-[#8ABFFF]">Trophy #2</span>
                      <input
                        type="text"
                        value={charts.trophy.trophy2Title}
                        onChange={(e) => updateChartModule('trophy', { trophy2Title: e.target.value })}
                        placeholder="Title"
                        className="w-full px-2 py-1 bg-[#111B2B] rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={charts.trophy.trophy2Year}
                        onChange={(e) => updateChartModule('trophy', { trophy2Year: e.target.value })}
                        placeholder="Year"
                        className="w-full px-2 py-1 bg-[#111B2B] rounded text-xs text-white"
                      />
                    </div>

                    <div className="p-2 bg-[#0B1425] rounded border border-white/10 space-y-1">
                      <span className="text-[10px] font-mono text-[#8ABFFF]">Trophy #3</span>
                      <input
                        type="text"
                        value={charts.trophy.trophy3Title}
                        onChange={(e) => updateChartModule('trophy', { trophy3Title: e.target.value })}
                        placeholder="Title"
                        className="w-full px-2 py-1 bg-[#111B2B] rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={charts.trophy.trophy3Year}
                        onChange={(e) => updateChartModule('trophy', { trophy3Year: e.target.value })}
                        placeholder="Year"
                        className="w-full px-2 py-1 bg-[#111B2B] rounded text-xs text-white"
                      />
                    </div>

                    <div className="p-2 bg-[#0B1425] rounded border border-white/10 space-y-1">
                      <span className="text-[10px] font-mono text-[#8ABFFF]">Trophy #4</span>
                      <input
                        type="text"
                        value={charts.trophy.trophy4Title}
                        onChange={(e) => updateChartModule('trophy', { trophy4Title: e.target.value })}
                        placeholder="Title"
                        className="w-full px-2 py-1 bg-[#111B2B] rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={charts.trophy.trophy4Year}
                        onChange={(e) => updateChartModule('trophy', { trophy4Year: e.target.value })}
                        placeholder="Year"
                        className="w-full px-2 py-1 bg-[#111B2B] rounded text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-1">Leadership Credits</label>
                    <input
                      type="text"
                      value={charts.trophy.leadershipText}
                      onChange={(e) => updateChartModule('trophy', { leadershipText: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: WEBSITE TEXT & COPY
             ========================================================================= */}
          {activeTab === 'texts' && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
              {/* Section Sub-Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#111B2B] rounded-xl border border-white/[0.08]">
                {[
                  { id: 'hero', label: '1. Hero Title' },
                  { id: 'stats', label: '2. Stat Bars' },
                  { id: 'announcement', label: '3. Announcement' },
                  { id: 'features', label: '4. Features Header' },
                  { id: 'roadmap', label: '5. Roadmap' },
                  { id: 'signup', label: '6. Signup Card' },
                  { id: 'footer', label: '7. Footer' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTextSection(s.id as typeof textSection)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      textSection === s.id
                        ? 'bg-[#8ABFFF] text-[#0B1425]'
                        : 'text-[#A7B4C7] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Sub-Section 1: Hero */}
              {textSection === 'hero' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3 sm:space-y-4">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8ABFFF]" />
                    <span>Hero Section Copy</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-mono text-[#A7B4C7] mb-1">Eyebrow Archive Badge</label>
                    <input
                      type="text"
                      value={settings.hero.badge}
                      onChange={(e) => updateSettingSection('hero', { badge: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-mono text-[#A7B4C7] mb-1">Line 1</label>
                      <input
                        type="text"
                        value={settings.hero.titleLine1}
                        onChange={(e) => updateSettingSection('hero', { titleLine1: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#A7B4C7] mb-1">Line 2 (Gradient)</label>
                      <input
                        type="text"
                        value={settings.hero.titleLine2}
                        onChange={(e) => updateSettingSection('hero', { titleLine2: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#A7B4C7] mb-1">Line 3 (Accent)</label>
                      <input
                        type="text"
                        value={settings.hero.titleLine3}
                        onChange={(e) => updateSettingSection('hero', { titleLine3: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#A7B4C7] mb-1">Hero Description</label>
                    <textarea
                      rows={2}
                      value={settings.hero.description}
                      onChange={(e) => updateSettingSection('hero', { description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-mono text-[#A7B4C7] mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={settings.hero.ctaText}
                        onChange={(e) => updateSettingSection('hero', { ctaText: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#A7B4C7] mb-1">Input Placeholder</label>
                      <input
                        type="text"
                        value={settings.hero.inputPlaceholder}
                        onChange={(e) => updateSettingSection('hero', { inputPlaceholder: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-Section 2: Stats */}
              {textSection === 'stats' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-white">4 Key Statistics Cards</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {settings.hero.stats.map((st, idx) => (
                      <div key={idx} className="bg-[#0B1425] p-3 rounded-lg border border-white/[0.08] space-y-1.5">
                        <div className="text-[10px] font-mono text-[#8ABFFF] font-bold">Stat Card #{idx + 1}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={st.value}
                            onChange={(e) => {
                              const newStats = [...settings.hero.stats];
                              newStats[idx] = { ...newStats[idx], value: e.target.value };
                              updateSettingSection('hero', { stats: newStats });
                            }}
                            className="w-full px-2 py-1 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                          />
                          <input
                            type="text"
                            value={st.color || '#FFFFFF'}
                            onChange={(e) => {
                              const newStats = [...settings.hero.stats];
                              newStats[idx] = { ...newStats[idx], color: e.target.value };
                              updateSettingSection('hero', { stats: newStats });
                            }}
                            className="w-full px-2 py-1 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                          />
                        </div>
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => {
                            const newStats = [...settings.hero.stats];
                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                            updateSettingSection('hero', { stats: newStats });
                          }}
                          className="w-full px-2 py-1 bg-[#111B2B] border border-white/10 rounded text-[11px] text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Section 3: Announcement */}
              {textSection === 'announcement' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">Top Announcement Bar</h3>
                      <p className="text-[11px] text-[#A7B4C7]">Toggle banner message at page top</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.announcement.enabled}
                        onChange={(e) => updateSettingSection('announcement', { enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8ABFFF]"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Badge</label>
                      <input
                        type="text"
                        value={settings.announcement.badgeText}
                        onChange={(e) => updateSettingSection('announcement', { badgeText: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Link Text</label>
                      <input
                        type="text"
                        value={settings.announcement.linkText}
                        onChange={(e) => updateSettingSection('announcement', { linkText: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Target URL</label>
                      <input
                        type="text"
                        value={settings.announcement.linkUrl}
                        onChange={(e) => updateSettingSection('announcement', { linkUrl: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Announcement Message</label>
                    <input
                      type="text"
                      value={settings.announcement.text}
                      onChange={(e) => updateSettingSection('announcement', { text: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Section 4: Features */}
              {textSection === 'features' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-white">Features Section Header Copy</h3>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Tagline Pill</label>
                    <input
                      type="text"
                      value={settings.features.tag}
                      onChange={(e) => updateSettingSection('features', { tag: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Section Title</label>
                    <input
                      type="text"
                      value={settings.features.title}
                      onChange={(e) => updateSettingSection('features', { title: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Subtitle</label>
                    <textarea
                      rows={2}
                      value={settings.features.subtitle}
                      onChange={(e) => updateSettingSection('features', { subtitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Section 5: Roadmap */}
              {textSection === 'roadmap' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-white">Roadmap Section Copy</h3>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Tagline</label>
                    <input
                      type="text"
                      value={settings.roadmap.tag}
                      onChange={(e) => updateSettingSection('roadmap', { tag: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Section Heading</label>
                    <input
                      type="text"
                      value={settings.roadmap.title}
                      onChange={(e) => updateSettingSection('roadmap', { title: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Subtitle</label>
                    <textarea
                      rows={2}
                      value={settings.roadmap.subtitle}
                      onChange={(e) => updateSettingSection('roadmap', { subtitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Section 6: Signup */}
              {textSection === 'signup' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-white">Launch Signup Card Copy</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Badge</label>
                      <input
                        type="text"
                        value={settings.signup.tag}
                        onChange={(e) => updateSettingSection('signup', { tag: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">CTA Button Text</label>
                      <input
                        type="text"
                        value={settings.signup.ctaText}
                        onChange={(e) => updateSettingSection('signup', { ctaText: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Title</label>
                    <input
                      type="text"
                      value={settings.signup.title}
                      onChange={(e) => updateSettingSection('signup', { title: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Subtitle</label>
                    <textarea
                      rows={2}
                      value={settings.signup.subtitle}
                      onChange={(e) => updateSettingSection('signup', { subtitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Consent Text</label>
                    <input
                      type="text"
                      value={settings.signup.consentText}
                      onChange={(e) => updateSettingSection('signup', { consentText: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Section 7: Footer */}
              {textSection === 'footer' && (
                <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3">
                  <h3 className="text-xs sm:text-sm font-bold text-white">Footer Copy</h3>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Tagline Quote</label>
                    <input
                      type="text"
                      value={settings.footer.tagline}
                      onChange={(e) => updateSettingSection('footer', { tagline: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={settings.footer.description}
                      onChange={(e) => updateSettingSection('footer', { description: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">RSPBA Disclaimer</label>
                    <input
                      type="text"
                      value={settings.footer.disclaimer}
                      onChange={(e) => updateSettingSection('footer', { disclaimer: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: STYLING & ATMOSPHERIC EFFECTS (NEW!)
             ========================================================================= */}
          {activeTab === 'styling' && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
              <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <Layout className="w-4 h-4 text-[#8ABFFF]" />
                    <span>Visual Atmosphere & Layout Options</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    REALTIME CSS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Glow intensity */}
                  <div className="p-3 bg-[#0B1425] rounded-xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-white">Atmospheric Background Glow</label>
                    <p className="text-[11px] text-[#A7B4C7]">
                      Adjust the ambient lighting halo behind hero and teaser sections
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      {(['subtle', 'vibrant', 'none'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() =>
                            updateSettingSection('visuals', {
                              ...(settings.visuals || DEFAULT_WEBSITE_SETTINGS.visuals),
                              glowIntensity: mode,
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold capitalize border transition-all cursor-pointer ${
                            (settings.visuals?.glowIntensity || 'subtle') === mode
                              ? 'bg-[#8ABFFF] text-[#0B1425] border-[#8ABFFF]'
                              : 'bg-[#111B2B] text-[#A7B4C7] border-white/10 hover:text-white'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Technical grid */}
                  <div className="p-3 bg-[#0B1425] rounded-xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-white">Technical Grid Overlay</label>
                    <p className="text-[11px] text-[#A7B4C7]">
                      Blueprint matrix background grid inspired by historic archives
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      {(['subtle', 'dense', 'off'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() =>
                            updateSettingSection('visuals', {
                              ...(settings.visuals || DEFAULT_WEBSITE_SETTINGS.visuals),
                              gridStyle: mode,
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold capitalize border transition-all cursor-pointer ${
                            (settings.visuals?.gridStyle || 'subtle') === mode
                              ? 'bg-[#8ABFFF] text-[#0B1425] border-[#8ABFFF]'
                              : 'bg-[#111B2B] text-[#A7B4C7] border-white/10 hover:text-white'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card radius */}
                  <div className="p-3 bg-[#0B1425] rounded-xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-white">Card Border Radius</label>
                    <p className="text-[11px] text-[#A7B4C7]">
                      Corner curvature applied to containers and modules
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      {(['rounded-xl', 'rounded-2xl', 'rounded-3xl'] as const).map((radius) => (
                        <button
                          key={radius}
                          type="button"
                          onClick={() =>
                            updateSettingSection('visuals', {
                              ...(settings.visuals || DEFAULT_WEBSITE_SETTINGS.visuals),
                              cardRadius: radius,
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                            (settings.visuals?.cardRadius || 'rounded-2xl') === radius
                              ? 'bg-[#8ABFFF] text-[#0B1425] border-[#8ABFFF]'
                              : 'bg-[#111B2B] text-[#A7B4C7] border-white/10 hover:text-white'
                          }`}
                        >
                          {radius.replace('rounded-', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography heading style */}
                  <div className="p-3 bg-[#0B1425] rounded-xl border border-white/10 space-y-2">
                    <label className="block text-xs font-bold text-white">Heading Typography Font</label>
                    <p className="text-[11px] text-[#A7B4C7]">
                      Typeface personality for titles and statistics
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      {(['sans', 'mono', 'serif'] as const).map((font) => (
                        <button
                          key={font}
                          type="button"
                          onClick={() =>
                            updateSettingSection('visuals', {
                              ...(settings.visuals || DEFAULT_WEBSITE_SETTINGS.visuals),
                              fontFamily: font,
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold capitalize border transition-all cursor-pointer ${
                            (settings.visuals?.fontFamily || 'sans') === font
                              ? 'bg-[#8ABFFF] text-[#0B1425] border-[#8ABFFF]'
                              : 'bg-[#111B2B] text-[#A7B4C7] border-white/10 hover:text-white'
                          }`}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Tartan Texture & Button style */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-[#0B1425] rounded-xl border border-white/10 space-y-2">
                      <label className="block text-xs font-bold text-white">Tartan Texture Background</label>
                      <p className="text-[11px] text-[#A7B4C7]">Subtle Scottish clan weave ambient texture</p>
                      <div className="flex items-center gap-2 pt-1">
                        {(['subtle', 'visible', 'none'] as const).map((style) => (
                          <button
                            key={style}
                            type="button"
                            onClick={() =>
                              updateSettingSection('visuals', {
                                ...(settings.visuals || DEFAULT_WEBSITE_SETTINGS.visuals),
                                tartanOverlay: style,
                              })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold capitalize border transition-all cursor-pointer ${
                              (settings.visuals?.tartanOverlay || 'subtle') === style
                                ? 'bg-[#8ABFFF] text-[#0B1425] border-[#8ABFFF]'
                                : 'bg-[#111B2B] text-[#A7B4C7] border-white/10 hover:text-white'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-[#0B1425] rounded-xl border border-white/10 space-y-2">
                      <label className="block text-xs font-bold text-white">Button Curvature Style</label>
                      <p className="text-[11px] text-[#A7B4C7]">Corner geometry on primary action buttons</p>
                      <div className="flex items-center gap-2 pt-1">
                        {(['rounded', 'pill', 'sharp'] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() =>
                              updateSettingSection('visuals', {
                                ...(settings.visuals || DEFAULT_WEBSITE_SETTINGS.visuals),
                                buttonStyle: b,
                              })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold capitalize border transition-all cursor-pointer ${
                              (settings.visuals?.buttonStyle || 'rounded') === b
                                ? 'bg-[#8ABFFF] text-[#0B1425] border-[#8ABFFF]'
                                : 'bg-[#111B2B] text-[#A7B4C7] border-white/10 hover:text-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Metadata Subcard */}
                <div className="p-3.5 bg-[#0B1425] rounded-xl border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8ABFFF]" />
                    <span>SEO Meta Title, Social Share & Cards</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Page Title (&lt;title&gt;)</label>
                      <input
                        type="text"
                        value={settings.seo?.metaTitle || ''}
                        onChange={(e) =>
                          updateSettingSection('seo', {
                            ...(settings.seo || DEFAULT_WEBSITE_SETTINGS.seo),
                            metaTitle: e.target.value,
                          })
                        }
                        placeholder="PipeBand.app — 28 Years of Championship Archives"
                        className="w-full px-2.5 py-1.5 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Social Share Card Title (og:title)</label>
                      <input
                        type="text"
                        value={settings.seo?.ogTitle || ''}
                        onChange={(e) =>
                          updateSettingSection('seo', {
                            ...(settings.seo || DEFAULT_WEBSITE_SETTINGS.seo),
                            ogTitle: e.target.value,
                          })
                        }
                        placeholder="PipeBand.app — Historic Pipe Band Archives"
                        className="w-full px-2.5 py-1.5 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Meta Description</label>
                      <textarea
                        rows={2}
                        value={settings.seo?.metaDescription || ''}
                        onChange={(e) =>
                          updateSettingSection('seo', {
                            ...(settings.seo || DEFAULT_WEBSITE_SETTINGS.seo),
                            metaDescription: e.target.value,
                          })
                        }
                        placeholder="Historic RSPBA competition results, grade trajectories, adjudicator variance..."
                        className="w-full px-2.5 py-1.5 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Twitter / X Handle</label>
                      <input
                        type="text"
                        value={settings.seo?.twitterHandle || ''}
                        onChange={(e) =>
                          updateSettingSection('seo', {
                            ...(settings.seo || DEFAULT_WEBSITE_SETTINGS.seo),
                            twitterHandle: e.target.value,
                          })
                        }
                        placeholder="@PipeBandApp"
                        className="w-full px-2.5 py-1.5 bg-[#111B2B] border border-white/10 rounded text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: SECURITY & ADMIN AUTHENTICATION (NEW!)
             ========================================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
              {!isAdminLoggedIn ? (
                /* Unauthenticated State: Inline Admin Login */
                <div className="space-y-4">
                  <div className="bg-[#111B2B] rounded-xl border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white">Admin Authentication Required</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            UNAUTHENTICATED
                          </span>
                        </div>
                        <p className="text-xs text-[#A7B4C7] mt-0.5">
                          Sign in below to unlock saving changes, managing SQLite signups, and modifying credentials.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Inline Login Form */}
                  <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-4 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#8ABFFF]" />
                        <h3 className="text-sm font-bold text-white">Sign In to Admin Session</h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11213A] border border-white/10 text-[#8ABFFF]">
                        DEFAULT: admin / admin123
                      </span>
                    </div>

                    <form onSubmit={handleInlineLoginSubmit} className="space-y-3.5 max-w-md">
                      <div>
                        <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Username</label>
                        <input
                          type="text"
                          value={inlineUser}
                          onChange={(e) => setInlineUser(e.target.value)}
                          placeholder="admin"
                          className="w-full px-3 py-2 bg-[#0B1425] border border-white/10 rounded-lg text-xs sm:text-sm text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Password</label>
                        <input
                          type="password"
                          value={inlinePass}
                          onChange={(e) => setInlinePass(e.target.value)}
                          placeholder="Enter admin password (default: admin123)"
                          className="w-full px-3 py-2 bg-[#0B1425] border border-white/10 rounded-lg text-xs sm:text-sm text-white font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={inlineLoading}
                          className="px-4 py-2 rounded-xl bg-[#8ABFFF] hover:bg-[#A3CEFF] text-[#0B1425] text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                        >
                          {inlineLoading ? 'Verifying...' : 'Log In As Admin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsLoginModalOpen(true)}
                          className="px-3 py-2 rounded-xl border border-white/10 text-xs text-[#A7B4C7] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          Open Modal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                /* Authenticated State */
                <>
                  {/* Session Status Banner */}
                  <div className="bg-[#111B2B] rounded-xl border border-emerald-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white">Admin Session Active</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            AUTHENTICATED
                          </span>
                        </div>
                        <p className="text-xs text-[#A7B4C7] mt-0.5">
                          Session protected by cryptographic token stored in SQLite database.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={logoutAdmin}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out Admin</span>
                    </button>
                  </div>

                  {/* Password Change Form */}
                  <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-4 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#8ABFFF]" />
                      <h3 className="text-sm font-bold text-white">Change Admin Password</h3>
                    </div>
                    <p className="text-xs text-[#A7B4C7]">
                      Update your admin login password. Passwords are saved with PBKDF2 SHA-512 salting and hashing.
                    </p>

                    <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 max-w-md">
                      <div>
                        <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Current Password</label>
                        <input
                          type="password"
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          placeholder="Enter current password (default: admin123)"
                          className="w-full px-3 py-2 bg-[#0B1425] border border-white/10 rounded-lg text-xs sm:text-sm text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">New Password</label>
                        <input
                          type="password"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="At least 4 characters"
                          className="w-full px-3 py-2 bg-[#0B1425] border border-white/10 rounded-lg text-xs sm:text-sm text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#A7B4C7] mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full px-3 py-2 bg-[#0B1425] border border-white/10 rounded-lg text-xs sm:text-sm text-white font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={passSubmitting}
                        className="px-4 py-2 rounded-xl bg-[#8ABFFF] hover:bg-[#A3CEFF] text-[#0B1425] text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {passSubmitting ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: WEBSITE TEST & HEALTH
             ========================================================================= */}
          {activeTab === 'testing' && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* Form & Signup Sandbox */}
              <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-[#8ABFFF]" />
                      <span>Signup Endpoint & Validation Tester</span>
                    </h3>
                    <p className="text-[11px] text-[#A7B4C7]">Test email validation & database writes</p>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30">
                    DIAGNOSTICS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Test Email</label>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A7B4C7] mb-0.5">Role / Interest</label>
                    <select
                      value={testInterest}
                      onChange={(e) => setTestInterest(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/10 rounded-lg text-xs text-white"
                    >
                      <option value="piper">Piper</option>
                      <option value="drummer">Drummer</option>
                      <option value="band_member">Band Member</option>
                      <option value="supporter">Supporter</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={runSimulatedSignup}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8ABFFF] hover:bg-[#A3CEFF] text-[#0B1425] text-xs font-bold rounded-lg cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Request</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestEmail(`piper_${Date.now().toString().slice(-4)}@pipeband.app`)}
                    className="px-2.5 py-1.5 bg-[#11213A] text-xs text-[#A7B4C7] hover:text-white rounded-lg border border-white/10"
                  >
                    Random Email
                  </button>
                </div>

                {testStatus && (
                  <div className="p-2.5 bg-[#0B1425] border border-white/10 rounded-lg font-mono text-[11px] text-[#8ABFFF]">
                    {testStatus}
                  </div>
                )}
              </div>

              {/* Server & DB Health Monitor */}
              <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Server & SQLite Diagnostics</span>
                  </h3>
                  <button
                    type="button"
                    onClick={runHealthCheck}
                    disabled={testingHealth}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#11213A] border border-white/10 text-xs text-[#8ABFFF] rounded-lg cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${testingHealth ? 'animate-spin' : ''}`} />
                    <span>Ping</span>
                  </button>
                </div>

                {healthStatus ? (
                  <div className="bg-[#0B1425] rounded-lg p-3 border border-white/[0.08] font-mono text-[11px] space-y-1.5">
                    <div className="flex justify-between items-center pb-1 border-b border-white/[0.06]">
                      <span className="text-[#A7B4C7]">Database:</span>
                      <span className="text-emerald-400 font-bold">{String(healthStatus.database || 'connected').toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1 border-b border-white/[0.06]">
                      <span className="text-[#A7B4C7]">Signups:</span>
                      <span className="text-white font-bold">{String(healthStatus.signupsCount ?? totalSignups)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#A7B4C7]">Uptime:</span>
                      <span className="text-white">{Math.floor(Number(healthStatus.uptime || 0))}s</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-[#0B1425] rounded-lg border border-white/[0.06] text-xs text-[#A7B4C7] text-center">
                    Click "Ping" to check API latency and SQLite database connection.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: SIGNUPS LIST
             ========================================================================= */}
          {activeTab === 'signups' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {/* Quick Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 bg-[#111B2B] rounded-lg border border-white/10">
                  <div className="text-[10px] font-mono text-[#A7B4C7]">TOTAL SIGNUPS</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-white">{signups.length}</div>
                </div>
                <div className="p-2.5 bg-[#111B2B] rounded-lg border border-white/10">
                  <div className="text-[10px] font-mono text-[#8ABFFF]">PIPERS</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-[#8ABFFF]">
                    {signups.filter((s) => s.interest.toLowerCase().includes('piper')).length}
                  </div>
                </div>
                <div className="p-2.5 bg-[#111B2B] rounded-lg border border-white/10">
                  <div className="text-[10px] font-mono text-amber-400">DRUMMERS</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-amber-400">
                    {signups.filter((s) => s.interest.toLowerCase().includes('drum')).length}
                  </div>
                </div>
                <div className="p-2.5 bg-[#111B2B] rounded-lg border border-white/10">
                  <div className="text-[10px] font-mono text-emerald-400">SUPPORTERS</div>
                  <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                    {signups.filter((s) => s.interest.toLowerCase().includes('supporter') || s.interest.toLowerCase().includes('general')).length}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A7B4C7]" />
                  <input
                    type="text"
                    value={signupSearch}
                    onChange={(e) => setSignupSearch(e.target.value)}
                    placeholder="Search by email or interest..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#111B2B] border border-white/[0.12] rounded-lg text-xs text-white placeholder-[#A7B4C7]/60"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <select
                    value={signupFilterInstrument}
                    onChange={(e) => setSignupFilterInstrument(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#111B2B] border border-white/10 rounded-lg text-xs text-white"
                  >
                    <option value="all">All Roles</option>
                    <option value="piper">Pipers</option>
                    <option value="drum">Drummers</option>
                    <option value="band_member">Band Members</option>
                    <option value="supporter">Supporters</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleCopyAllEmails}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-[#11213A] border border-white/10 rounded-lg text-xs text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Copy email addresses to clipboard"
                  >
                    <span>Copy Emails</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportSignupsCsv}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-[#8ABFFF]/20 border border-[#8ABFFF]/40 text-[#8ABFFF] hover:bg-[#8ABFFF]/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={fetchSignups}
                    className="p-1.5 bg-[#11213A] border border-white/10 rounded-lg text-[#A7B4C7] hover:text-white cursor-pointer"
                    title="Refresh list"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${signupsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#0E1726] border-b border-white/[0.08] font-mono text-[10px] text-[#A7B4C7]">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Interest</th>
                        <th className="py-2.5 px-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {signups.filter((s) => signupFilterInstrument === 'all' || s.interest.toLowerCase().includes(signupFilterInstrument.toLowerCase())).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-[#A7B4C7]">
                            {signupsLoading ? 'Loading signups...' : 'No signups matching criteria.'}
                          </td>
                        </tr>
                      ) : (
                        signups
                          .filter((s) => signupFilterInstrument === 'all' || s.interest.toLowerCase().includes(signupFilterInstrument.toLowerCase()))
                          .map((s) => (
                          <tr key={s.id} className="hover:bg-white/[0.02]">
                            <td className="py-2 px-3 font-mono text-[#A7B4C7] text-[11px]">#{s.id}</td>
                            <td className="py-2 px-3 font-medium text-white truncate max-w-[160px] sm:max-w-none">{s.email}</td>
                            <td className="py-2 px-3">
                              <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-[#11213A] text-[#8ABFFF]">
                                {s.interest || 'general'}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteSignup(s.id)}
                                disabled={deletingId === s.id}
                                className="p-1 text-rose-400 hover:text-rose-300 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: IMPORT / RESET / DATA BACKUP
             ========================================================================= */}
          {activeTab === 'data' && (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-[#8ABFFF]" />
                  <span>Download Configuration Backup</span>
                </h3>
                <p className="text-[11px] text-[#A7B4C7]">
                  Download a complete JSON snapshot of all customized texts, colors, chart metrics and banners.
                </p>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-3.5 py-1.5 bg-[#11213A] border border-white/10 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#8ABFFF]" />
                  <span>Download JSON</span>
                </button>
              </div>

              <div className="bg-[#111B2B] rounded-xl border border-white/[0.08] p-3.5 sm:p-5 space-y-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-[#8ABFFF]" />
                  <span>Import JSON Configuration</span>
                </h3>
                <textarea
                  rows={3}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder='{"colors": {...}, "charts": {...}}'
                  className="w-full px-2.5 py-1.5 bg-[#0B1425] border border-white/[0.12] rounded-lg text-xs font-mono text-white"
                />
                {jsonError && (
                  <div className="text-[11px] text-rose-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{jsonError}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleApplyJson}
                  disabled={!jsonText.trim()}
                  className="px-3 py-1.5 bg-[#8ABFFF] hover:bg-[#A3CEFF] text-[#0B1425] text-xs font-bold rounded-lg disabled:opacity-50"
                >
                  Apply to Preview
                </button>
              </div>

              <div className="bg-rose-950/20 rounded-xl border border-rose-500/30 p-3.5 sm:p-5 space-y-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-rose-300 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  <span>Factory Reset</span>
                </h3>
                <p className="text-[11px] text-[#A7B4C7]">
                  Reset all custom texts, colors, and charts to factory defaults.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg"
                >
                  Reset Everything
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Drawer Footer */}
        <div className="px-3.5 sm:px-6 py-2.5 border-t border-white/[0.08] bg-[#0E1726] flex items-center justify-between text-[11px] text-[#A7B4C7] shrink-0 font-mono">
          <span className="truncate">Esc to close · Ctrl+Shift+A</span>
          <span className="text-[#8ABFFF] shrink-0">PipeBand.app Admin</span>
        </div>
      </div>
    </div>
  );
};

interface ColorControlItemProps {
  label: string;
  description: string;
  value: string;
  onChange: (val: string) => void;
}

const ColorControlItem: React.FC<ColorControlItemProps> = ({
  label,
  description,
  value,
  onChange,
}) => {
  return (
    <div className="p-2.5 sm:p-3 bg-[#0B1425] rounded-xl border border-white/[0.06] flex items-center justify-between gap-2.5">
      <div className="space-y-0.5 flex-1 min-w-0">
        <div className="text-xs font-bold text-white truncate">{label}</div>
        <div className="text-[10px] text-[#A7B4C7] truncate">{description}</div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-18 px-1.5 py-1 bg-[#111B2B] border border-white/[0.12] rounded text-xs font-mono text-white text-center uppercase"
        />

        <label className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/20 cursor-pointer shrink-0 block">
          <input
            type="color"
            value={value.startsWith('#') && value.length === 7 ? value : '#8ABFFF'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer opacity-0"
          />
          <span className="block w-full h-full" style={{ backgroundColor: value }} />
        </label>
      </div>
    </div>
  );
};
