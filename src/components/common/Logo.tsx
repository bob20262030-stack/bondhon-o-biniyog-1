import React from 'react';
import { useApp } from '../../context/AppContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textColor?: string;
  watermark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textColor = 'text-white',
  watermark = false
}) => {
  const { settings } = useApp();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  const renderLogoGraphic = () => {
    if (settings.logoUrl && settings.logoUrl.trim() !== '') {
      return (
        <img
          src={settings.logoUrl}
          alt={settings.brandName}
          className={`${currentSizeClass} object-contain rounded-xl drop-shadow-md`}
        />
      );
    }

    // Official BoB Emblem Vector Graphic
    return (
      <div
        className={`${currentSizeClass} relative rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 p-[2px] shadow-lg flex items-center justify-center shrink-0 overflow-hidden ${
          watermark ? 'opacity-15' : ''
        }`}
      >
        <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center relative overflow-hidden">
          {/* Inner subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-amber-500/20" />
          
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 text-amber-400 drop-shadow"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer sacred circle */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" className="text-amber-400/60" />
            <circle cx="50" cy="50" r="41" stroke="#2563EB" strokeWidth="2" />
            
            {/* Tree roots / bonding foundation */}
            <path
              d="M32 74 C 42 66, 46 56, 50 48 C 54 56, 58 66, 68 74"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            
            {/* Tree trunk & growth branches */}
            <path
              d="M50 48 L50 25 M50 36 C42 32, 36 28, 33 22 M50 36 C58 32, 64 28, 67 22 M50 26 C45 20, 42 16, 40 12 M50 26 C55 20, 58 16, 60 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Radiant leaves / golden coins */}
            <circle cx="33" cy="21" r="3.5" fill="#16A34A" />
            <circle cx="67" cy="21" r="3.5" fill="#16A34A" />
            <circle cx="40" cy="11" r="3" fill="#F59E0B" />
            <circle cx="60" cy="11" r="3" fill="#F59E0B" />
            <circle cx="50" cy="8" r="3.5" fill="#F59E0B" />

            {/* BoB Center Badge */}
            <circle cx="50" cy="50" r="14" fill="#0F172A" stroke="currentColor" strokeWidth="2" />
            <text
              x="50"
              y="54"
              textAnchor="middle"
              fill="#F59E0B"
              fontSize="9"
              fontWeight="900"
              fontFamily="Inter, sans-serif"
              letterSpacing="0.5"
            >
              BoB
            </text>

            {/* Bottom foundation banner */}
            <path
              d="M26 80 L74 80"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {renderLogoGraphic()}

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight ${textColor} text-base sm:text-lg`}>
              বন্ধন ও বিনিয়োগ
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-inter">
              BoB
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-amber-400/90 font-medium">
            {settings.slogan}
          </span>
        </div>
      )}
    </div>
  );
};
