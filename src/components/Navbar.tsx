import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sliders } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import navbarLogoImage from '../assets/images/regenerated_image_1791656993424.png';
import { useSettings } from '../context/SettingsContext.tsx';

export const Navbar: React.FC = () => {
  const { settings, openAdmin, hasUnsavedChanges, isAdminLoggedIn } = useSettings();
  const { navigation, colors } = settings;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-md border-b shadow-lg shadow-black/20 py-3'
          : 'bg-transparent border-b border-transparent py-4'
      }`}
      style={{
        backgroundColor: isScrolled ? `${colors.bgDark}E6` : 'transparent',
        borderColor: isScrolled ? `${colors.primaryAccent}20` : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Subtitle Badge */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 rounded-lg group"
              style={{ outlineColor: colors.primaryAccent }}
              aria-label="PipeBand.app Home"
            >
              <BrandLogo size="md" variant="glow" imageSrc={navbarLogoImage} />
            </a>
            {navigation.logoSubtitle && (
              <span
                className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase border"
                style={{
                  backgroundColor: colors.navySurface,
                  color: colors.primaryAccent,
                  borderColor: `${colors.primaryAccent}30`,
                }}
              >
                {navigation.logoSubtitle}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-sm font-medium transition-colors rounded px-2 py-1 hover:opacity-100"
              style={{ color: colors.textMuted }}
            >
              {navigation.featuresLabel}
            </a>
            <a
              href="#roadmap"
              onClick={(e) => scrollToSection(e, 'roadmap')}
              className="text-sm font-medium transition-colors rounded px-2 py-1 hover:opacity-100"
              style={{ color: colors.textMuted }}
            >
              {navigation.roadmapLabel}
            </a>

            {/* Quick Admin Customizer Button */}
            <button
              type="button"
              onClick={openAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer hover:bg-white/5"
              style={{
                borderColor: hasUnsavedChanges ? '#F59E0B' : `${colors.primaryAccent}35`,
                color: hasUnsavedChanges ? '#F59E0B' : colors.primaryAccent,
                backgroundColor: `${colors.navySurface}80`,
              }}
              title="Open Admin Panel to customize texts, colors & test forms (Ctrl+Shift+A)"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Admin</span>
              {isAdminLoggedIn ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Admin Logged In" />
              ) : hasUnsavedChanges ? (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              ) : null}
            </button>

            <a
              href="#signup"
              onClick={(e) => scrollToSection(e, 'signup')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm focus-visible:outline-none focus-visible:ring-2 cursor-pointer hover:brightness-110 active:brightness-95"
              style={{
                backgroundColor: colors.primaryAccent,
                color: colors.bgDark,
                boxShadow: `0 2px 10px ${colors.primaryAccent}35`,
              }}
            >
              <span>{navigation.ctaButtonText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={openAdmin}
              className="p-2 rounded-lg border text-xs"
              style={{
                borderColor: `${colors.primaryAccent}30`,
                color: colors.primaryAccent,
                backgroundColor: colors.navySurface,
              }}
              title="Admin Panel"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white focus-visible:outline-none focus-visible:ring-2 rounded-lg"
              style={{ color: colors.textMuted }}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-[60px] bottom-0 backdrop-blur-xl border-t px-6 py-8 flex flex-col justify-between z-40"
          style={{
            backgroundColor: `${colors.bgDark}FA`,
            borderColor: `${colors.primaryAccent}20`,
          }}
        >
          <div className="flex flex-col space-y-4">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-lg font-medium py-2 border-b border-white/[0.06]"
              style={{ color: colors.textPrimary }}
            >
              {navigation.featuresLabel}
            </a>
            <a
              href="#roadmap"
              onClick={(e) => scrollToSection(e, 'roadmap')}
              className="text-lg font-medium py-2 border-b border-white/[0.06]"
              style={{ color: colors.textPrimary }}
            >
              {navigation.roadmapLabel}
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openAdmin();
              }}
              className="text-left text-lg font-medium py-2 border-b border-white/[0.06] flex items-center justify-between"
              style={{ color: colors.primaryAccent }}
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                <span>Admin & Theme Customizer</span>
              </span>
              <span className="text-xs font-mono uppercase bg-white/10 px-2 py-0.5 rounded">
                {isAdminLoggedIn ? 'Logged In' : 'Sign In'}
              </span>
            </button>
          </div>

          <div className="pt-8 border-t border-white/[0.08]">
            <a
              href="#signup"
              onClick={(e) => scrollToSection(e, 'signup')}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-base font-semibold rounded-xl transition-all shadow-md"
              style={{
                backgroundColor: colors.primaryAccent,
                color: colors.bgDark,
              }}
            >
              <span>{navigation.ctaButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="mt-3 text-center text-xs font-mono" style={{ color: colors.textMuted }}>
              {navigation.logoSubtitle} · Results · History · Statistics
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
