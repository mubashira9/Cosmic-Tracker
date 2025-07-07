import React from 'react';

interface CrewmateIconProps {
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'pink' | 'orange' | 'purple' | 'cyan' | 'white' | 'black' | 'brown' | 'lime';
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
    cyan: '#38FEDC',
    white: '#D6E0F0',
    black: '#3F474E',
    brown: '#71491E',
    lime: '#50EF39'
  };

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizes[size]} ${className} ${animate ? 'animate-bounce' : ''}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Main body - bean shape */}
        <path
          d="M50 15 C65 15, 75 25, 75 40 L75 70 C75 85, 65 95, 50 95 C35 95, 25 85, 25 70 L25 40 C25 25, 35 15, 50 15 Z"
          fill={colors[color]}
          stroke="#000000"
          strokeWidth="2"
        />
        
        {/* Visor/Glass - characteristic Among Us shape */}
        <path
          d="M35 25 C35 20, 40 15, 50 15 C60 15, 65 20, 65 25 L65 45 C65 50, 60 55, 50 55 C40 55, 35 50, 35 45 Z"
          fill="#87CEEB"
          stroke="#5A9FD4"
          strokeWidth="1"
          opacity="0.9"
        />
        
        {/* Visor highlight */}
        <ellipse
          cx="45"
          cy="30"
          rx="8"
          ry="12"
          fill="#FFFFFF"
          opacity="0.6"
        />
        
        {/* Small visor reflection */}
        <ellipse
          cx="42"
          cy="27"
          rx="3"
          ry="5"
          fill="#FFFFFF"
          opacity="0.8"
        />
        
        {/* Legs - small rounded rectangles */}
        <rect
          x="38"
          y="88"
          width="8"
          height="12"
          rx="4"
          fill={colors[color]}
          stroke="#000000"
          strokeWidth="1"
        />
        <rect
          x="54"
          y="88"
          width="8"
          height="12"
          rx="4"
          fill={colors[color]}
          stroke="#000000"
          strokeWidth="1"
        />
        
        {/* Shadow under body */}
        <ellipse
          cx="50"
          cy="98"
          rx="18"
          ry="2"
          fill="#000000"
          opacity="0.2"
        />
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