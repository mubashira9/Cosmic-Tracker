import React from 'react';

interface CrewmateIconProps {
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'pink' | 'orange' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

export const CrewmateIcon: React.FC<CrewmateIconProps> = ({ 
  color = 'blue', 
  size = 'md',
  className = '',
  animate = false
}) => {
  const colors = {
    red: '#C51111',
    blue: '#132ED1',
    green: '#117F2D',
    yellow: '#F7F557',
    pink: '#ED54BA',
    orange: '#F07613',
    purple: '#6B2FBB',
    cyan: '#38FEDC'
  };

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizes[size]} ${className} ${animate ? 'animate-bounce' : ''}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Body */}
        <ellipse cx="50" cy="65" rx="25" ry="30" fill={colors[color]} />
        
        {/* Visor */}
        <ellipse cx="50" cy="45" rx="18" ry="20" fill="#87CEEB" opacity="0.9" />
        
        {/* Visor reflection */}
        <ellipse cx="45" cy="40" rx="8" ry="10" fill="#FFFFFF" opacity="0.6" />
        
        {/* Legs */}
        <ellipse cx="42" cy="88" rx="6" ry="8" fill={colors[color]} />
        <ellipse cx="58" cy="88" rx="6" ry="8" fill={colors[color]} />
        
        {/* Shadow under body */}
        <ellipse cx="50" cy="95" rx="20" ry="3" fill="#000000" opacity="0.2" />
      </svg>
    </div>
  );
};

export const FloatingCrewmate: React.FC<{ color?: string; className?: string }> = ({ 
  color = 'blue', 
  className = '' 
}) => {
  return (
    <div className={`absolute ${className}`} style={{
      animation: 'float 3s ease-in-out infinite'
    }}>
      <CrewmateIcon color={color as any} size="sm" />
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};