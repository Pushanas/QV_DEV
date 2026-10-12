import React from 'react';

interface QvDevLogoProps {
  variant?: 'header' | 'hero' | 'compact' | 'admin';
  showSubtitle?: boolean;
  className?: string;
}

export const QvDevEmblem: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl'
  };

  const svgDimensions = {
    sm: 24,
    md: 28,
    lg: 40,
    xl: 56
  };

  const dim = svgDimensions[size];

  return (
    <div className="relative group shrink-0 select-none">
      {/* Dynamic ambient cyber glow */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-[#00F0FF] via-[#3B82F6] to-[#8B5CF6] rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
      
      {/* Emblem Frame Container */}
      <div className={`${sizeClasses[size]} bg-gradient-to-b from-[#0B0F26] via-[#070A1C] to-[#030511] border border-[#00F0FF]/40 group-hover:border-[#00F0FF]/80 flex items-center justify-center relative overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all duration-300`}>
        {/* Subtle grid background inside emblem */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #00F0FF 1px, transparent 0)',
            backgroundSize: '6px 6px'
          }} 
        />
        
        {/* Top laser reflection */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent opacity-80" />

        {/* Custom High-Tech Stylized QV Vector Monogram */}
        <svg 
          width={dim} 
          height={dim} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]"
        >
          <defs>
            <linearGradient id="qvCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#0099FF" />
              <stop offset="100%" stopColor="#7000FF" />
            </linearGradient>
            <linearGradient id="qvGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>
          </defs>

          {/* Outer futuristic hex / diamond frame outline */}
          <polygon 
            points="50,6 90,28 90,72 50,94 10,72 10,28" 
            stroke="url(#qvCyanGrad)" 
            strokeWidth="3.5" 
            strokeLinejoin="round" 
            strokeOpacity="0.4"
          />

          {/* Stylized 'Q' Geometry: Modern Orbital Ring */}
          <circle 
            cx="44" 
            cy="46" 
            r="24" 
            stroke="url(#qvCyanGrad)" 
            strokeWidth="6" 
            strokeLinecap="round"
          />

          {/* Tail of the 'Q' angled as a lightning / trend surge */}
          <path 
            d="M56 58 L72 74" 
            stroke="url(#qvGoldGrad)" 
            strokeWidth="6.5" 
            strokeLinecap="round"
          />

          {/* Interlocking 'V' (Sharp futuristic chevron) */}
          <path 
            d="M54 30 L67 58 L80 30" 
            stroke="url(#qvCyanGrad)" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Core Pulse Node */}
          <circle cx="50" cy="50" r="3.5" fill="#00FF95" className="animate-pulse" />
        </svg>

        {/* Diagonal gloss shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default function QvDevLogo({ 
  variant = 'header', 
  showSubtitle = true, 
  className = '' 
}: QvDevLogoProps) {

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        {/* Large Emblem */}
        <div className="mb-3.5">
          <QvDevEmblem size="lg" />
        </div>

        {/* Wordmark with spacious, balanced typography */}
        <div className="flex items-center justify-center gap-2.5 dir-ltr">
          <span className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#0099FF] drop-shadow-[0_0_12px_rgba(0,240,255,0.4)] font-mono">
            QV
          </span>
          <span className="text-2xl sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 font-mono">
            DEV
          </span>
        </div>

        {/* Subtitle / Bot Descriptor with clean letter spacing */}
        {showSubtitle && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="h-[1px] w-5 bg-gradient-to-r from-transparent to-[#00F0FF]/50" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-cyan-300/80">
              ALGORITHMIC BOT VIP
            </span>
            <span className="h-[1px] w-5 bg-gradient-to-l from-transparent to-[#00F0FF]/50" />
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 dir-ltr ${className}`}>
        <QvDevEmblem size="sm" />
        <div className="flex items-baseline gap-1.5 font-mono">
          <span className="font-black text-[#00F0FF] text-sm tracking-wide">QV</span>
          <span className="font-black text-white text-sm tracking-wider">DEV</span>
        </div>
      </div>
    );
  }

  // Default 'header' variant: horizontal, perfectly spaced for navbar / topbars
  return (
    <div className={`flex items-center gap-3 dir-ltr ${className}`}>
      {/* Emblem */}
      <QvDevEmblem size="md" />

      {/* Brand Text Block */}
      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5 leading-none">
          {/* QV in neon cyan */}
          <span className="font-black text-base sm:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#38BDF8] drop-shadow-[0_0_8px_rgba(0,240,255,0.35)] font-mono">
            QV
          </span>
          {/* DEV in ice white */}
          <span className="font-black text-base sm:text-lg tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 font-mono">
            DEV
          </span>
          {/* Cyber VIP Dot Tag */}
          <span className="ml-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-black tracking-widest bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 uppercase">
            BOT
          </span>
        </div>

        {/* Subtitle / Status with spacious tracking */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF95] animate-pulse shrink-0" />
            <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase">
              VIP ALGO SYSTEM
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
