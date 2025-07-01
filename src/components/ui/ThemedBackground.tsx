import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { StarField } from './StarField';

interface ThemedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemedBackground: React.FC<ThemedBackgroundProps> = ({ 
  children, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.gradients.background} text-${currentTheme.colors.text} relative ${className}`}>
      <StarField />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};