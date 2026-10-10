import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Size mapping
  const sizeMap = {
    sm: { icon: 28, text: 'text-base' },
    md: { icon: 34, text: 'text-lg' },
    lg: { icon: 44, text: 'text-xl' },
    xl: { icon: 56, text: 'text-2xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        {!imageFailed ? (
          <img
            src="/assets/logo.svg"
            alt="PipeBand.app Logo"
            className="w-full h-full object-contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          /* High-precision Vector Fallback */
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="44" height="44" rx="10" fill="#0B1425" stroke="#1E2F4D" strokeWidth="1.5" />
            <rect x="22" y="8" width="4" height="32" rx="1.5" fill="#8ABFFF" />
            <circle cx="24" cy="7" r="2.2" fill="#8ABFFF" />
            <rect x="21" y="15" width="6" height="2" rx="0.5" fill="#F5F8FC" opacity="0.9" />
            <rect x="21" y="27" width="6" height="2" rx="0.5" fill="#F5F8FC" opacity="0.9" />
            <rect x="13" y="13" width="3.5" height="25" rx="1.2" fill="#4C9FFF" />
            <circle cx="14.75" cy="12" r="1.8" fill="#8ABFFF" />
            <rect x="31.5" y="13" width="3.5" height="25" rx="1.2" fill="#4C9FFF" />
            <circle cx="33.25" cy="12" r="1.8" fill="#8ABFFF" />
            <path d="M 8 28 C 11 20, 16 17, 24 17 C 32 17, 37 20, 40 28" stroke="#8ABFFF" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M 10 34 C 13 28, 17 25, 24 25 C 31 25, 35 28, 38 34" stroke="#4C9FFF" strokeWidth="1.25" strokeLinecap="round" />
            <path d="M 12 39 L 24 35 L 36 39" stroke="#8ABFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Brand Wordmark */}
      {showWordmark && (
        <span className={`font-semibold tracking-tight text-[#F5F8FC] ${currentSize.text} flex items-center`}>
          PipeBand<span className="text-[#8ABFFF] font-medium">.app</span>
        </span>
      )}
    </div>
  );
};
