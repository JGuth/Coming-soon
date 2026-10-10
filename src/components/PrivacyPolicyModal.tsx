import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="relative bg-[#111B2B] border border-white/[0.12] rounded-2xl max-w-2xl w-full p-6 sm:p-8 text-[#F5F8FC] shadow-2xl shadow-black/80 max-h-[88vh] overflow-y-auto focus:outline-none"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#11213A] border border-[#8ABFFF]/25 flex items-center justify-center text-[#8ABFFF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="privacy-policy-title" className="text-xl font-bold text-white">
                Privacy Policy & Data Notice
              </h3>
              <p className="text-xs text-[#A7B4C7] font-mono">Last updated: October 2026</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#A7B4C7] hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ABFFF]"
            aria-label="Close privacy notice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Content */}
        <div className="space-y-5 text-sm text-[#A7B4C7] leading-relaxed">
          <section>
            <h4 className="text-base font-semibold text-white mb-1.5">1. What Information We Collect</h4>
            <p>
              When you submit your email address on the PipeBand.app launch list, we collect:
            </p>
            <ul className="list-disc pl-5 mt-1.5 space-y-1">
              <li>Your submitted email address.</li>
              <li>Your optional interest category (e.g. Piper, Drummer, Band Member, Fan).</li>
              <li>Timestamp of your submission and explicit consent confirmation.</li>
              <li>A cryptographic, one-way hashed IP representation solely used for automated abuse mitigation and rate-limiting. We never store raw IP addresses.</li>
            </ul>
          </section>

          <section>
            <h4 className="text-base font-semibold text-white mb-1.5">2. Why We Collect It</h4>
            <p>
              We collect this information strictly for one purpose: to notify you when PipeBand.app launches, and to invite early testers from the pipe band community to explore the platform.
            </p>
          </section>

          <section>
            <h4 className="text-base font-semibold text-white mb-1.5">3. Data Storage & Protection</h4>
            <p>
              Your information is stored securely in an isolated, encrypted SQLite database running on our dedicated server environment. We do not sell, rent, monetize, or share your contact information with any advertisers, third-party brokers, or commercial sponsors.
            </p>
          </section>

          <section>
            <h4 className="text-base font-semibold text-white mb-1.5">4. Right to Deletion & Unsubscribe</h4>
            <p>
              You maintain full ownership of your personal data. You may request immediate removal from our launch list and total erasure from our database at any time by contacting us. Every email sent at launch will also include a one-click unsubscribe mechanism.
            </p>
          </section>

          <section>
            <h4 className="text-base font-semibold text-white mb-1.5">5. Contact Information</h4>
            <p>
              For privacy inquiries, data deletion requests, or general questions regarding PipeBand.app, please reach out to the project maintainer at:
            </p>
            <div className="mt-2 p-3 bg-[#0B1425] rounded-xl border border-white/[0.06] font-mono text-xs text-[#8ABFFF]">
              privacy@pipeband.app · maintainer: PipeBand.app Team
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#8ABFFF] text-[#0B1425] hover:bg-[#A3CEFF] font-semibold text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ABFFF]"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
};
