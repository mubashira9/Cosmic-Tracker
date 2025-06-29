import React from 'react';
import { Lock } from 'lucide-react';
import { StarField } from './StarField';
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative">
      <StarField />
      <div className="relative z-10 bg-black bg-opacity-60 backdrop-blur-sm rounded-2xl p-8 border border-purple-500 max-w-sm w-full">
        <div className="text-center mb-6">
          <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Secure Item Access</h2>
          <p className="text-gray-300 text-sm">Enter PIN to view "{item.name}"</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="password"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            placeholder="Enter 4-digit PIN"
            maxLength={4}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest focus:border-cyan-400 focus:outline-none"
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
              className="flex-1 p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-white hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};