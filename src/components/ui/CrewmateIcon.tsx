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

  // Get darker shade for body outline and shadows
  const getDarkerShade = (hexColor: string) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const darkerR = Math.floor(r * 0.7);
    const darkerG = Math.floor(g * 0.7);
    const darkerB = Math.floor(b * 0.7);
    
    return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
  };

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const baseColor = colors[color];
  const darkColor = getDarkerShade(baseColor);

  return (
    <div className={`${sizes[size]} ${className} ${animate ? 'animate-bounce' : ''}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Drop shadow */}
        <ellipse
          cx="51"
          cy="92"
          rx="22"
          ry="3"
          fill="#000000"
          opacity="0.25"
        />
        
        {/* Legs */}
        <ellipse
          cx="42"
          cy="87"
          rx="5"
          ry="8"
          fill={baseColor}
        />
        <ellipse
          cx="58"
          cy="87"
          rx="5"
          ry="8"
          fill={baseColor}
        />
        
        {/* Leg outlines */}
        <ellipse
          cx="42"
          cy="87"
          rx="5"
          ry="8"
          fill="none"
          stroke={darkColor}
          strokeWidth="1.5"
        />
        <ellipse
          cx="58"
          cy="87"
          rx="5"
          ry="8"
          fill="none"
          stroke={darkColor}
          strokeWidth="1.5"
        />
        
        {/* Main body - more authentic Among Us bean shape */}
        <path
          d="M50 18 
             C67 18, 78 28, 78 42 
             L78 68 
             C78 78, 67 82, 50 82 
             C33 82, 22 78, 22 68 
             L22 42 
             C22 28, 33 18, 50 18 Z"
          fill={baseColor}
        />
        
        {/* Body shadow/depth on the right side */}
        <path
          d="M65 25 
             C72 30, 76 38, 76 47 
             L76 68 
             C76 75, 70 80, 62 81 
             C68 79, 72 74, 72 68 
             L72 47 
             C72 38, 68 30, 65 25 Z"
          fill={darkColor}
          opacity="0.3"
        />
        
        {/* Body highlight on the left */}
        <path
          d="M30 30 
             C30 25, 35 22, 42 22 
             C48 22, 52 25, 52 30 
             L52 55 
             C52 60, 48 63, 42 63 
             C35 63, 30 60, 30 55 Z"
          fill="#FFFFFF"
          opacity="0.2"
        />
        
        {/* Visor/Glass - more accurate Among Us visor shape */}
        <path
          d="M32 32 
             C32 26, 38 22, 50 22 
             C62 22, 68 26, 68 32 
             L68 52 
             C68 58, 62 62, 50 62 
             C38 62, 32 58, 32 52 Z"
          fill="#87CEEB"
          stroke="#5A9FD4"
          strokeWidth="1"
          opacity="0.95"
        />
        
        {/* Visor inner area */}
        <path
          d="M35 34 
             C35 29, 40 26, 50 26 
             C60 26, 65 29, 65 34 
             L65 50 
             C65 55, 60 58, 50 58 
             C40 58, 35 55, 35 50 Z"
          fill="#B8E6FF"
          opacity="0.4"
        />
        
        {/* Main visor highlight */}
        <ellipse
          cx="46"
          cy="38"
          rx="10"
          ry="14"
          fill="#FFFFFF"
          opacity="0.6"
        />
        
        {/* Secondary highlight */}
        <ellipse
          cx="44"
          cy="34"
          rx="4"
          ry="7"
          fill="#FFFFFF"
          opacity="0.8"
        />
        
        {/* Bright spot highlight */}
        <circle
          cx="42"
          cy="31"
          r="2"
          fill="#FFFFFF"
          opacity="0.95"
        />
        
        {/* Tiny bright reflection */}
        <circle
          cx="41"
          cy="29"
          r="1"
          fill="#FFFFFF"
        />
        
        {/* Body main outline */}
        <path
          d="M50 18 
             C67 18, 78 28, 78 42 
             L78 68 
             C78 78, 67 82, 50 82 
             C33 82, 22 78, 22 68 
             L22 42 
             C22 28, 33 18, 50 18 Z"
          fill="none"
          stroke={darkColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        
        {/* Visor outline */}
        <path
          d="M32 32 
             C32 26, 38 22, 50 22 
             C62 22, 68 26, 68 32 
             L68 52 
             C68 58, 62 62, 50 62 
             C38 62, 32 58, 32 52 Z"
          fill="none"
          stroke={darkColor}
          strokeWidth="1.5"
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
