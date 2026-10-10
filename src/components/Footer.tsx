import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { PrivacyPolicyModal } from './PrivacyPolicyModal.tsx';

interface FooterProps {
  onScrollToSignup: () => void;
  onScrollToPreview: () => void;
  onScrollToDiscover: () => void;
  onScrollToHowItWorks: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToSignup,
  onScrollToPreview,
  onScrollToDiscover,
  onScrollToHowItWorks,
}) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#070D19] border-t border-white/[0.08] text-[#A7B4C7] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <BrandLogo size="md" />
            <p className="text-sm text-[#F5F8FC] font-medium tracking-tight pt-1">
              "Every contest. Every result. Every story."
            </p>
            <p className="text-xs text-[#A7B4C7] leading-relaxed max-w-md">
              The home of pipe band results, competitive history and statistics.
              Bringing performances, rivalries and records from the pipe band world together in one place.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#8ABFFF] pt-2">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 fill-[#8ABFFF]" />
              <span>for the pipe band community</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F8FC]">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={onScrollToPreview}
                  className="hover:text-[#F5F8FC] transition-colors cursor-pointer"
                >
                  Teased Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onScrollToHowItWorks}
                  className="hover:text-[#F5F8FC] transition-colors cursor-pointer"
                >
                  2026 Roadmap
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onScrollToSignup}
                  className="text-[#8ABFFF] hover:underline cursor-pointer font-medium"
                >
                  Join the launch list
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Project Status */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F5F8FC]">Information</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="hover:text-[#F5F8FC] transition-colors cursor-pointer"
                >
                  Privacy Policy & Data Notice
                </button>
              </li>
              <li>
                <span className="text-[#A7B4C7]">Contact: privacy@pipeband.app</span>
              </li>
              <li>
                <span className="text-[11px] text-[#A7B4C7]/70 font-mono block pt-1">
                  Status: Coming Soon · In Development
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A7B4C7]/80 gap-4">
          <p>© {currentYear} PipeBand.app. All rights reserved.</p>
          <p className="text-[11px] text-center sm:text-right font-mono text-[#A7B4C7]/60">
            Independent community archive platform. Not affiliated with or endorsed by the RSPBA.
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
