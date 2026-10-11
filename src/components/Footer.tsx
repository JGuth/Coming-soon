import React, { useState } from 'react';
import { Heart, Sliders } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { PrivacyPolicyModal } from './PrivacyPolicyModal.tsx';
import { useSettings } from '../context/SettingsContext.tsx';

interface FooterProps {
  onScrollToSignup: () => void;
  onScrollToPreview: () => void;
  onScrollToDiscover: () => void;
  onScrollToHowItWorks: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToSignup,
  onScrollToPreview,
  onScrollToHowItWorks,
}) => {
  const { settings, openAdmin } = useSettings();
  const { footer, colors } = settings;
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative border-t py-8 sm:py-14 transition-colors"
      style={{
        backgroundColor: colors.bgDark,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        color: colors.textMuted,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 pb-8 sm:pb-12 border-b border-white/[0.06]">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-3 sm:space-y-4">
            <BrandLogo size="lg" variant="glow" />
            <p className="text-sm font-medium tracking-tight pt-0.5 sm:pt-1" style={{ color: colors.textPrimary }}>
              {footer.tagline}
            </p>
            <p className="text-xs leading-relaxed max-w-md" style={{ color: colors.textMuted }}>
              {footer.description}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs pt-1 sm:pt-2" style={{ color: colors.primaryAccent }}>
              <span>{footer.communityNote || 'Made with ❤️ for the pipe band community'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider" style={{ color: colors.textPrimary }}>
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onScrollToPreview}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Teased Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onScrollToHowItWorks}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  2026 Roadmap
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onScrollToSignup}
                  className="hover:underline cursor-pointer font-medium"
                  style={{ color: colors.primaryAccent }}
                >
                  Join the launch list
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openAdmin}
                  className="flex items-center gap-1 text-xs font-mono hover:underline cursor-pointer"
                  style={{ color: colors.primaryAccent }}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Admin Customizer</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Project Status */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider" style={{ color: colors.textPrimary }}>
              Information
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy & Data Notice
                </button>
              </li>
              <li>
                <span>Contact: {footer.contactEmail || 'privacy@pipeband.app'}</span>
              </li>
              <li>
                <span className="text-[11px] opacity-70 font-mono block pt-1">
                  Status: Coming Soon · In Development
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 opacity-80">
          <p>© {currentYear} {footer.copyrightText || 'PipeBand.app. All rights reserved.'}</p>
          <p className="text-[11px] text-center sm:text-right font-mono opacity-60">
            {footer.disclaimer || 'Independent community archive platform. Not affiliated with or endorsed by the RSPBA.'}
          </p>
        </div>
      </div>

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </footer>
  );
};
