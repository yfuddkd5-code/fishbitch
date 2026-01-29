import React from 'react';

interface PixelAxolotlProps {
  size?: number;
  className?: string;
  variant?: 'happy' | 'excited' | 'cool';
}

const PixelAxolotl: React.FC<PixelAxolotlProps> = ({ 
  size = 80, 
  className = '',
  variant = 'happy'
}) => {
  // Pixel art representation of cute axolotl
  const colors = {
    body: '#FFB6C1', // Light pink
    gills: '#FF69B4', // Hot pink
    eyes: '#2D1B69', // Dark purple
    cheeks: '#FF1493', // Deep pink
    outline: '#1a1a2e',
    white: '#FFFFFF',
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      className={`${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Body base */}
      <rect x="10" y="12" width="12" height="10" fill={colors.body} />
      <rect x="8" y="14" width="2" height="6" fill={colors.body} />
      <rect x="22" y="14" width="2" height="6" fill={colors.body} />
      
      {/* Head */}
      <rect x="8" y="8" width="16" height="8" fill={colors.body} />
      <rect x="6" y="10" width="2" height="4" fill={colors.body} />
      <rect x="24" y="10" width="2" height="4" fill={colors.body} />
      
      {/* Gills - Left */}
      <rect x="4" y="6" width="2" height="6" fill={colors.gills} />
      <rect x="2" y="8" width="2" height="2" fill={colors.gills} />
      <rect x="6" y="4" width="2" height="4" fill={colors.gills} />
      
      {/* Gills - Right */}
      <rect x="26" y="6" width="2" height="6" fill={colors.gills} />
      <rect x="28" y="8" width="2" height="2" fill={colors.gills} />
      <rect x="24" y="4" width="2" height="4" fill={colors.gills} />
      
      {/* Eyes */}
      {variant === 'cool' ? (
        <>
          {/* Sunglasses */}
          <rect x="9" y="10" width="5" height="3" fill={colors.outline} />
          <rect x="18" y="10" width="5" height="3" fill={colors.outline} />
          <rect x="14" y="11" width="4" height="1" fill={colors.outline} />
        </>
      ) : (
        <>
          <rect x="10" y="10" width="3" height="3" fill={colors.white} />
          <rect x="19" y="10" width="3" height="3" fill={colors.white} />
          <rect x="11" y="11" width="2" height="2" fill={colors.eyes} />
          <rect x="20" y="11" width="2" height="2" fill={colors.eyes} />
          {variant === 'excited' && (
            <>
              {/* Sparkle eyes */}
              <rect x="11" y="11" width="1" height="1" fill={colors.white} />
              <rect x="20" y="11" width="1" height="1" fill={colors.white} />
            </>
          )}
        </>
      )}
      
      {/* Cheeks */}
      <rect x="8" y="13" width="2" height="1" fill={colors.cheeks} />
      <rect x="22" y="13" width="2" height="1" fill={colors.cheeks} />
      
      {/* Smile */}
      <rect x="14" y="14" width="4" height="1" fill={colors.outline} />
      {variant === 'excited' && (
        <rect x="15" y="15" width="2" height="1" fill={colors.outline} />
      )}
      
      {/* Tail */}
      <rect x="14" y="22" width="4" height="2" fill={colors.body} />
      <rect x="13" y="24" width="6" height="2" fill={colors.body} />
      <rect x="12" y="26" width="8" height="2" fill={colors.body} />
      
      {/* Feet */}
      <rect x="10" y="20" width="3" height="2" fill={colors.body} />
      <rect x="19" y="20" width="3" height="2" fill={colors.body} />
    </svg>
  );
};

export default PixelAxolotl;
