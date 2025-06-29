import React from 'react';
import { Lock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedBackground } from './ThemedBackground';
import type { Item } from '../SpaceTracker';

interface PinPromptProps {
  item: Item;
  enteredPin: string;
  setEnteredPin: (pin: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const PinPrompt: React.FC<PinPromptProps> = ({
  item,
  enteredPin,
  setEnteredPin,
  onSubmit,
  onCancel
}) => {
  const { currentTheme } = useTheme();

  return (
    <ThemedBackground className="flex items-center justify-center p-4">
      <div className={`${currentTheme.gradients.card} rounded-2xl p-8 border border-${currentTheme.colors.border} max-w-sm w-full`}>
        <div className="text-center mb-6">
          <Lock className={`w-12 h-12 text-${currentTheme.colors.primary} mx-auto mb-4`} />
          <h2 className={`text-xl font-bold text-${currentTheme.colors.text} mb-2`}>Secure Item Access</h2>
          <p className={`text-${currentTheme.colors.textSecondary} text-sm`}>Enter PIN to view "{item.name}"</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="password"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            placeholder="Enter 4-digit PIN"
            maxLength={4}
            className={`w-full p-3 bg-gray-800 border border-${currentTheme.colors.border} rounded-lg text-${currentTheme.colors.text} text-center text-2xl tracking-widest focus:border-${currentTheme.colors.primary} focus:outline-none`}
          />
          
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 p-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={enteredPin.length !== 4}
              className={`flex-1 p-3 ${currentTheme.gradients.button} rounded-lg text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    </ThemedBackground>
  );
};