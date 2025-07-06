import React from 'react';

interface SpaceButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export const SpaceButton: React.FC<SpaceButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-cyan-400/50 shadow-cyan-500/25';
      case 'secondary':
        return 'bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-500 hover:to-gray-600 border-slate-400/50 shadow-slate-500/25';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 border-red-400/50 shadow-red-500/25';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 border-green-400/50 shadow-green-500/25';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-cyan-400/50 shadow-cyan-500/25';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-base';
      case 'lg':
        return 'px-6 py-4 text-lg';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-xl font-medium transition-all duration-200
        border backdrop-blur-sm shadow-lg
        hover:shadow-xl hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        flex items-center justify-center gap-2 text-white
        relative overflow-hidden
        ${className}
      `}
    >
      {/* Glowing effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {children}
    </button>
  );
};