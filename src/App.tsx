import React, { useRef } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { FeatureTeaser } from './components/FeatureTeaser.tsx';
import { RoadmapSection } from './components/RoadmapSection.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
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
    <div className="min-h-screen bg-[#0B1425] text-[#F5F8FC] selection:bg-[#4C9FFF]/30 selection:text-white flex flex-col font-sans">
      {/* Navigation */}
      <Navbar />

      {/* Main Content - Tight, High-Impact 3 Sections */}
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
  );
}
