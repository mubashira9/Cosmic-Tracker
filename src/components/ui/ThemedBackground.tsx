import React from 'react';
import { StarField } from './StarField';

interface ThemedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemedBackground: React.FC<ThemedBackgroundProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white relative ${className}`}>
      <StarField />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};