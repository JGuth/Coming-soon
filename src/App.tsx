import React, { useRef } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext.tsx';
import { AnnouncementBar } from './components/AnnouncementBar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { FeatureTeaser } from './components/FeatureTeaser.tsx';
import { RoadmapSection } from './components/RoadmapSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { AdminTrigger } from './components/AdminTrigger.tsx';

function MainApp() {
  const { settings } = useSettings();
  const emailInputRef = useRef<HTMLInputElement>(null);

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
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{
        backgroundColor: settings.colors.bgDark,
        color: settings.colors.textPrimary,
      }}
    >
      {/* Optional Top Announcement Bar */}
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

      {/* Floating Admin Quick Access Trigger */}
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

