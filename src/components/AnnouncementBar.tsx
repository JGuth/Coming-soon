import React from 'react';
import { ArrowRight, Bell } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useSettings();
  const { announcement, colors } = settings;

  if (!announcement.enabled || !announcement.text) {
    return null;
  }

  return (
    <div
      role="banner"
      className="relative z-40 border-b transition-colors text-xs py-2 px-4"
      style={{
        backgroundColor: colors.navySurface,
        borderColor: `${colors.primaryAccent}25`,
        color: colors.textPrimary,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center">
        {announcement.badgeText && (
          <span
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0"
            style={{
              backgroundColor: `${colors.primaryAccent}20`,
              borderColor: `${colors.primaryAccent}40`,
              color: colors.primaryAccent,
            }}
          >
            {announcement.badgeText}
          </span>
        )}

        <span className="font-medium text-xs truncate max-w-xl">
          {announcement.text}
        </span>

        {announcement.linkText && (
          <a
            href={announcement.linkUrl || '#features'}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity shrink-0 ml-1"
            style={{ color: colors.primaryAccent }}
          >
            <span>{announcement.linkText}</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
