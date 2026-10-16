import React from 'react';

interface BrandLogoProps {
  className?: string;
  light?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  badgeOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  light = false,
  size = 'md',
  badgeOnly = false
}) => {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] md:text-xs tracking-wider',
    lg: 'text-xs md:text-sm tracking-widest',
    xl: 'text-sm tracking-widest',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Vintage Kruffles Circular Badge */}
      <div className={`relative shrink-0 ${iconSizes[size]} transition-transform duration-300 hover:scale-105 drop-shadow-md`}>
        <img
          src="/logo.png"
          alt="Vintage Kruffles Official Logo - Waffles & Pancakes"
          className="w-full h-full object-contain rounded-full bg-cream-warm"
        />
      </div>

      {!badgeOnly && (
        <div className="flex flex-col">
          <span className={`font-serif font-black tracking-tight leading-none ${titleSizes[size]} ${light ? 'text-white' : 'text-espresso'}`}>
            VINTAGE <span className="text-burnt">KRUFFLES</span>
          </span>
          <span className={`font-sans uppercase font-bold text-golden-dark ${subSizes[size]} mt-0.5`}>
            Waffles & Pancakes • RK Beach, Vizag
          </span>
        </div>
      )}
    </div>
  );
};
