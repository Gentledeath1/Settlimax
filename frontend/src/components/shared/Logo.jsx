import React from 'react'

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = { sm: 28, md: 36, lg: 48, xl: 64 }
  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl', xl: 'text-3xl' }
  const s = sizes[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="12" fill="url(#logoGrad)" />
        <rect x="8" y="28" width="8" height="14" rx="2" fill="white" opacity="0.7" />
        <rect x="20" y="20" width="8" height="22" rx="2" fill="white" opacity="0.85" />
        <rect x="32" y="12" width="8" height="30" rx="2" fill="white" />
        <path d="M10 32 Q24 14 40 10" stroke="#f5c842" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <circle cx="40" cy="10" r="3" fill="#f5c842" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5c35f5" />
            <stop offset="100%" stopColor="#3b12cc" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className={`font-display font-bold tracking-tight text-white ${textSizes[size]}`}>
          SETTLIMAX
        </span>
      )}
    </div>
  )
}
