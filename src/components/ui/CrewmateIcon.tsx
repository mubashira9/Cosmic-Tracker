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
        {/* Shadow */}
        <ellipse
          cx="50"
          cy="95"
          rx="25"
          ry="4"
          fill="#000000"
          opacity="0.3"
        />
        
        {/* Legs */}
        <ellipse
          cx="42"
          cy="88"
          rx="6"
          ry="10"
          fill={colors[color]}
        />
        <ellipse
          cx="58"
          cy="88"
          rx="6"
          ry="10"
          fill={colors[color]}
        />
        
        {/* Main body - authentic Among Us bean shape */}
        <path
          d="M50 20 
             C65 20, 75 30, 75 45 
             L75 70 
             C75 80, 65 85, 50 85 
             C35 85, 25 80, 25 70 
             L25 45 
             C25 30, 35 20, 50 20 Z"
          fill={colors[color]}
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* Body highlight/shine */}
        <path
          d="M35 30 
             C35 25, 40 22, 45 22 
             C50 22, 52 25, 52 30 
             L52 50 
             C52 55, 50 58, 45 58 
             C40 58, 35 55, 35 50 Z"
          fill="#FFFFFF"
          opacity="0.15"
        />
        
        {/* Visor/Glass - authentic Among Us shape */}
        <path
          d="M35 30 
             C35 25, 40 20, 50 20 
             C60 20, 65 25, 65 30 
             L65 50 
             C65 55, 60 60, 50 60 
             C40 60, 35 55, 35 50 Z"
          fill="#87CEEB"
          stroke="#5A9FD4"
          strokeWidth="1.5"
          opacity="0.95"
        />
        
        {/* Visor inner reflection */}
        <path
          d="M38 32 
             C38 28, 42 25, 48 25 
             C54 25, 58 28, 58 32 
             L58 48 
             C58 52, 54 55, 48 55 
             C42 55, 38 52, 38 48 Z"
          fill="#B8E6FF"
          opacity="0.6"
        />
        
        {/* Main visor highlight */}
        <ellipse
          cx="45"
          cy="35"
          rx="8"
          ry="12"
          fill="#FFFFFF"
          opacity="0.7"
        />
        
        {/* Small bright highlight */}
        <ellipse
          cx="43"
          cy="32"
          rx="3"
          ry="5"
          fill="#FFFFFF"
          opacity="0.9"
        />
        
        {/* Tiny bright spot */}
        <circle
          cx="41"
          cy="30"
          r="1.5"
          fill="#FFFFFF"
        />
        
        {/* Body outline for definition */}
        <path
          d="M50 20 
             C65 20, 75 30, 75 45 
             L75 70 
             C75 80, 65 85, 50 85 
             C35 85, 25 80, 25 70 
             L25 45 
             C25 30, 35 20, 50 20 Z"
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
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