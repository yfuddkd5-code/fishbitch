import React from 'react';

interface PixelIconProps extends React.SVGProps<SVGSVGElement> {
  type: 'wallet' | 'twitter' | 'chat' | 'star' | 'heart' | 'check' | 'x' | 'search';
  size?: number;
}

const PixelIcon: React.FC<PixelIconProps> = ({ type, size = 24, className = '', ...props }) => {
  const iconPaths: Record<string, JSX.Element> = {
    wallet: (
      <>
        <rect x="2" y="6" width="12" height="10" fill="currentColor" />
        <rect x="4" y="8" width="8" height="6" fill="hsl(var(--card))" />
        <rect x="10" y="10" width="4" height="4" fill="hsl(var(--accent))" />
        <rect x="11" y="11" width="2" height="2" fill="currentColor" />
      </>
    ),
    twitter: (
      <>
        <rect x="2" y="4" width="12" height="2" fill="currentColor" />
        <rect x="4" y="6" width="8" height="2" fill="currentColor" />
        <rect x="6" y="8" width="6" height="2" fill="currentColor" />
        <rect x="4" y="10" width="8" height="2" fill="currentColor" />
        <rect x="2" y="12" width="4" height="2" fill="currentColor" />
        <rect x="10" y="12" width="4" height="2" fill="currentColor" />
      </>
    ),
    chat: (
      <>
        <rect x="2" y="2" width="12" height="10" fill="currentColor" />
        <rect x="4" y="4" width="8" height="6" fill="hsl(var(--card))" />
        <rect x="2" y="12" width="4" height="2" fill="currentColor" />
        <rect x="5" y="6" width="2" height="2" fill="currentColor" />
        <rect x="9" y="6" width="2" height="2" fill="currentColor" />
      </>
    ),
    star: (
      <>
        <rect x="7" y="1" width="2" height="3" fill="currentColor" />
        <rect x="5" y="4" width="6" height="2" fill="currentColor" />
        <rect x="3" y="6" width="10" height="2" fill="currentColor" />
        <rect x="4" y="8" width="8" height="2" fill="currentColor" />
        <rect x="5" y="10" width="6" height="2" fill="currentColor" />
        <rect x="4" y="12" width="2" height="2" fill="currentColor" />
        <rect x="10" y="12" width="2" height="2" fill="currentColor" />
      </>
    ),
    heart: (
      <>
        <rect x="2" y="4" width="4" height="4" fill="currentColor" />
        <rect x="10" y="4" width="4" height="4" fill="currentColor" />
        <rect x="4" y="2" width="2" height="2" fill="currentColor" />
        <rect x="10" y="2" width="2" height="2" fill="currentColor" />
        <rect x="6" y="6" width="4" height="2" fill="currentColor" />
        <rect x="4" y="8" width="8" height="2" fill="currentColor" />
        <rect x="5" y="10" width="6" height="2" fill="currentColor" />
        <rect x="6" y="12" width="4" height="2" fill="currentColor" />
        <rect x="7" y="14" width="2" height="1" fill="currentColor" />
      </>
    ),
    check: (
      <>
        <rect x="12" y="2" width="2" height="2" fill="currentColor" />
        <rect x="10" y="4" width="2" height="2" fill="currentColor" />
        <rect x="8" y="6" width="2" height="2" fill="currentColor" />
        <rect x="6" y="8" width="2" height="2" fill="currentColor" />
        <rect x="4" y="6" width="2" height="2" fill="currentColor" />
        <rect x="2" y="4" width="2" height="2" fill="currentColor" />
      </>
    ),
    x: (
      <>
        <rect x="2" y="2" width="2" height="2" fill="currentColor" />
        <rect x="4" y="4" width="2" height="2" fill="currentColor" />
        <rect x="6" y="6" width="4" height="4" fill="currentColor" />
        <rect x="10" y="10" width="2" height="2" fill="currentColor" />
        <rect x="12" y="12" width="2" height="2" fill="currentColor" />
        <rect x="12" y="2" width="2" height="2" fill="currentColor" />
        <rect x="10" y="4" width="2" height="2" fill="currentColor" />
        <rect x="2" y="12" width="2" height="2" fill="currentColor" />
        <rect x="4" y="10" width="2" height="2" fill="currentColor" />
      </>
    ),
    search: (
      <>
        <rect x="4" y="2" width="6" height="2" fill="currentColor" />
        <rect x="2" y="4" width="2" height="6" fill="currentColor" />
        <rect x="10" y="4" width="2" height="6" fill="currentColor" />
        <rect x="4" y="10" width="6" height="2" fill="currentColor" />
        <rect x="10" y="10" width="2" height="2" fill="currentColor" />
        <rect x="12" y="12" width="2" height="2" fill="currentColor" />
        <rect x="14" y="14" width="2" height="2" fill="currentColor" />
      </>
    ),
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      className={className}
      style={{ imageRendering: 'pixelated' }}
      {...props}
    >
      {iconPaths[type]}
    </svg>
  );
};

export default PixelIcon;
