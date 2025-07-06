import React from 'react';

interface SpacePanelProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
  variant?: 'default' | 'control' | 'warning' | 'success';
}

export const SpacePanel: React.FC<SpacePanelProps> = ({
  children,
  className = '',
  glowing = false,
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'control':
        return 'border-cyan-400/30 bg-cyan-900/10';
      case 'warning':
        return 'border-orange-400/30 bg-orange-900/10';
      case 'success':
        return 'border-green-400/30 bg-green-900/10';
      default:
        return 'border-gray-500/30 bg-black/40';
    }
  };

  return (
    <div className={`
      ${getVariantClasses()}
      backdrop-blur-sm rounded-xl border
      ${glowing ? 'shadow-lg shadow-cyan-500/20' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};