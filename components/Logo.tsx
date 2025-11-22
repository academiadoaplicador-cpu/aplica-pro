import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="vinylGradient" x1="20" y1="100" x2="180" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ea580c" /> {/* Orange-600 */}
          <stop offset="100%" stopColor="#f97316" /> {/* Orange-500 */}
        </linearGradient>
        <linearGradient id="rollGradient" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" /> {/* Blue-700 */}
          <stop offset="100%" stopColor="#3b82f6" /> {/* Blue-500 */}
        </linearGradient>
      </defs>

      {/* The Roll (Cylinder/Spiral effect) */}
      <circle cx="60" cy="100" r="35" fill="url(#rollGradient)" />
      <circle cx="60" cy="100" r="12" fill="#1e1e20" /> {/* Inner core */}
      
      {/* The Vinyl Sheet Unfurling (Dynamic Wave) */}
      <path 
        d="M60 65 C 60 65, 120 65, 160 40 L 180 50 C 140 80, 80 135, 60 135" 
        fill="url(#vinylGradient)" 
        stroke="none"
      />
      
      {/* The Main Body of the Sticker/Calculator */}
      <path
        d="M60 135 C 80 135, 160 90, 180 60 L 180 140 C 180 155, 160 165, 140 165 L 80 165 C 65 165, 60 150, 60 135 Z"
        fill="#f97316"
        opacity="0.9"
      />

      {/* Ruler Markings (The Measurement Tool) */}
      <g transform="rotate(-18 120 100)">
        <rect x="90" y="78" width="4" height="12" rx="1" fill="#ffffff" opacity="0.9" />
        <rect x="110" y="78" width="4" height="8" rx="1" fill="#ffffff" opacity="0.7" />
        <rect x="130" y="78" width="4" height="12" rx="1" fill="#ffffff" opacity="0.9" />
        <rect x="150" y="78" width="4" height="8" rx="1" fill="#ffffff" opacity="0.7" />
        <rect x="170" y="78" width="4" height="12" rx="1" fill="#ffffff" opacity="0.9" />
      </g>

      {/* Green Accent (Precision/Go) */}
      <circle cx="165" cy="150" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
    </svg>
  );
};

export default Logo;