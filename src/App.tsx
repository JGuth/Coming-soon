import React, { useRef } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext.tsx';
import { AnnouncementBar } from './components/AnnouncementBar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { FeatureTeaser } from './components/FeatureTeaser.tsx';
import { RoadmapSection } from './components/RoadmapSection.tsx';
import { Footer } from './components/Footer.tsx';
import { SplashPage } from './components/SplashPage.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { AdminTrigger } from './components/AdminTrigger.tsx';
import { Eye, ArrowLeft } from 'lucide-react';

function MainApp() {
  const { settings, isAdminLoggedIn, previewFullSite, setPreviewFullSite } = useSettings();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const isFullSiteActive = settings.siteMode === 'live' || (isAdminLoggedIn && previewFullSite);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const pos = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: pos - navOffset,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollToSignup = () => {
    scrollToSection('signup');
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 450);
  };

  return (
    <div
      className="font-sans transition-colors duration-300"
      style={{
        backgroundColor: settings.colors.bgDark,
        color: settings.colors.textPrimary,
      }}
    >
      {/* If full site preview is active for logged-in admin or live mode */}
      {isFullSiteActive ? (
        <div className="min-h-screen flex flex-col">
          {/* Admin Banner when previewing full site */}
          {isAdminLoggedIn && previewFullSite && settings.siteMode !== 'live' && (
            <div className="bg-[#111B2B] border-b border-[#8ABFFF]/30 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-[#8ABFFF] sticky top-0 z-50 shadow-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ADMIN PREVIEW: Multi-section view active. Public visitors see only the single splash page.</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewFullSite(false)}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#8ABFFF]/20 hover:bg-[#8ABFFF]/30 text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Splash View</span>
              </button>
            </div>
          )}

          {/* Top Announcement Bar */}
          <AnnouncementBar />

          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">
            {/* Section 1: Hero & Vision + Instant Launch List Capture */}
            <Hero
              onScrollToTeasers={() => scrollToSection('features')}
              onScrollToRoadmap={() => scrollToSection('roadmap')}
            />

            {/* Section 2: Interactive Feature Teasers */}
            <FeatureTeaser />

            {/* Section 3: 2026 Delivery Roadmap & Dedicated Conversion Section */}
            <RoadmapSection emailInputRef={emailInputRef} />
          </main>

          {/* Footer */}
          <Footer
            onScrollToSignup={handleScrollToSignup}
            onScrollToPreview={() => scrollToSection('features')}
            onScrollToDiscover={() => scrollToSection('features')}
            onScrollToHowItWorks={() => scrollToSection('roadmap')}
          />
        </div>
      ) : (
        /* =========================================================================
           DEFAULT PUBLIC MODE: SINGLE PAGE WITH NO SCROLLING (Matching Screenshot)
           ========================================================================= */
        <SplashPage />
      )}

      {/* Floating Admin Control (Hidden from public; visible to logged-in admin) */}
      <AdminTrigger />

      {/* Admin Login Modal & Admin Panel Drawer */}
      <AdminLoginModal />
      <AdminPanel />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <MainApp />
    </SettingsProvider>
  );
}
