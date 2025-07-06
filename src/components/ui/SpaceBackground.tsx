import React from 'react';

interface SpaceBackgroundProps {
  children: React.ReactNode;
  variant?: 'starfield' | 'spaceship' | 'nebula';
  className?: string;
}

export const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ 
  children, 
  variant = 'starfield',
  className = '' 
}) => {
  const getBackgroundClass = () => {
    switch (variant) {
      case 'starfield':
        return 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900';
      case 'spaceship':
        return 'bg-gradient-to-br from-slate-800 via-gray-900 to-blue-900';
      case 'nebula':
        return 'bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900';
      default:
        return 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} text-white relative overflow-hidden ${className}`}>
      {/* Animated stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Spaceship grid overlay */}
      {variant === 'spaceship' && (
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      )}

      {/* Glowing particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-ping"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'][Math.floor(Math.random() * 4)],
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};