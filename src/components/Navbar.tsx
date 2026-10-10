import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

export const Navbar: React.FC = () => {
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1425]/90 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/20 py-3.5'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
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
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ABFFF] rounded-lg group"
              aria-label="PipeBand.app Home"
            >
              <BrandLogo size="md" variant="glow" />
            </a>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#11213A] text-[#8ABFFF] border border-[#8ABFFF]/20">
              1998–2026 Archive
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-sm font-medium text-[#A7B4C7] hover:text-[#F5F8FC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ABFFF] rounded px-1.5 py-1"
            >
              Teased Features
            </a>
            <a
              href="#roadmap"
              onClick={(e) => scrollToSection(e, 'roadmap')}
              className="text-sm font-medium text-[#A7B4C7] hover:text-[#F5F8FC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ABFFF] rounded px-1.5 py-1"
            >
              2026 Roadmap
            </a>
            <a
              href="#signup"
              onClick={(e) => scrollToSection(e, 'signup')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0B1425] bg-[#8ABFFF] hover:bg-[#A3CEFF] active:bg-[#72AEEF] rounded-lg transition-all duration-150 shadow-sm shadow-[#8ABFFF]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1425] focus-visible:ring-[#8ABFFF]"
            >
              Join the launch list
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#A7B4C7] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ABFFF] rounded-lg"
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
        <div className="md:hidden fixed inset-x-0 top-[60px] bottom-0 bg-[#0B1425]/98 backdrop-blur-xl border-t border-white/[0.08] px-6 py-8 flex flex-col justify-between z-40">
          <div className="flex flex-col space-y-6">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, 'features')}
              className="text-lg font-medium text-[#F5F8FC] hover:text-[#8ABFFF] py-2 border-b border-white/[0.06]"
            >
              Teased Features
            </a>
            <a
              href="#roadmap"
              onClick={(e) => scrollToSection(e, 'roadmap')}
              className="text-lg font-medium text-[#F5F8FC] hover:text-[#8ABFFF] py-2 border-b border-white/[0.06]"
            >
              2026 Roadmap
            </a>
          </div>

          <div className="pt-8 border-t border-white/[0.08]">
            <a
              href="#signup"
              onClick={(e) => scrollToSection(e, 'signup')}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-base font-semibold text-[#0B1425] bg-[#8ABFFF] hover:bg-[#A3CEFF] rounded-xl transition-all shadow-md shadow-[#8ABFFF]/25"
            >
              Join the launch list
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="mt-3 text-center text-xs text-[#A7B4C7]">
              1998–2026 RSPBA Archive · Results · History · Statistics
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
