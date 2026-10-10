import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showWordmark?: boolean;
  variant?: 'default' | 'glow' | 'white';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  variant = 'default',
}) => {
  // Dimensional size mapping
  const sizeMap = {
    sm: { width: 34, height: 38, text: 'text-base' },
    md: { width: 44, height: 48, text: 'text-lg' },
    lg: { width: 72, height: 80, text: 'text-2xl' },
    xl: { width: 104, height: 114, text: 'text-3xl' },
    hero: { width: 140, height: 154, text: 'text-4xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official "pb" Bagpipe Drones Monogram Icon */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 ${
          variant === 'glow' ? 'drop-shadow-[0_0_16px_rgba(138,191,255,0.45)]' : ''
        }`}
        style={{ width: currentSize.width, height: currentSize.height }}
      >
        <img
          src="/assets/logo.svg?v=4"
          alt="PipeBand.app Logo"
          className="w-full h-full object-contain select-none"
        />
      </div>

      {/* Brand Wordmark */}
      {showWordmark && (
        <span className={`font-extrabold tracking-tight text-[#F5F8FC] ${currentSize.text} flex items-center`}>
          PipeBand<span className="text-[#8ABFFF] font-medium">.app</span>
        </span>
      )}
    </div>
  );
};
