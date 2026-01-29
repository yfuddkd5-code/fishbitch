import React from 'react';

const FloatingPixels: React.FC = () => {
  const pixels = [
    { x: '10%', y: '20%', delay: '0s', color: 'bg-primary' },
    { x: '85%', y: '15%', delay: '0.5s', color: 'bg-accent' },
    { x: '75%', y: '70%', delay: '1s', color: 'bg-secondary' },
    { x: '15%', y: '75%', delay: '1.5s', color: 'bg-primary' },
    { x: '50%', y: '10%', delay: '2s', color: 'bg-accent' },
    { x: '90%', y: '50%', delay: '0.7s', color: 'bg-secondary' },
    { x: '5%', y: '50%', delay: '1.2s', color: 'bg-primary' },
    { x: '60%', y: '85%', delay: '0.3s', color: 'bg-accent' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {pixels.map((pixel, index) => (
        <div
          key={index}
          className={`absolute ${pixel.color} opacity-60 pixel-float`}
          style={{
            left: pixel.x,
            top: pixel.y,
            animationDelay: pixel.delay,
            width: '8px',
            height: '8px',
            boxShadow: '2px 2px 0 hsl(var(--pixel-shadow))',
          }}
        />
      ))}
      
      {/* Larger decorative blocks */}
      <div 
        className="absolute w-4 h-4 bg-primary/30 pixel-float"
        style={{ left: '25%', top: '30%', animationDelay: '0.8s' }}
      />
      <div 
        className="absolute w-4 h-4 bg-accent/30 pixel-float-delayed"
        style={{ left: '70%', top: '25%' }}
      />
      <div 
        className="absolute w-3 h-3 bg-secondary/40 pixel-float"
        style={{ left: '80%', top: '80%', animationDelay: '1.3s' }}
      />
    </div>
  );
};

export default FloatingPixels;
