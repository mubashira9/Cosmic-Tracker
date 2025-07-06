import React from 'react';
import { Lock } from 'lucide-react';
import { SpaceBackground } from './SpaceBackground';
import { SpacePanel } from './SpacePanel';
import { SpaceButton } from './SpaceButton';
import { CrewmateIcon } from './CrewmateIcon';
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
    <SpaceBackground variant="spaceship">
      <div className="flex items-center justify-center min-h-screen p-4">
        <SpacePanel variant="warning" className="p-8 max-w-sm w-full" glowing>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lock className="w-12 h-12 text-orange-400" />
              <CrewmateIcon color="red" size="lg" animate />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Secure Item Access</h2>
            <p className="text-gray-300 text-sm">Enter PIN to view "{item.name}"</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <CrewmateIcon color="yellow" size="sm" />
              <span className="text-xs text-orange-300">Security Protocol Active</span>
              <CrewmateIcon color="orange" size="sm" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="w-full p-3 bg-gray-800/50 border border-orange-400/30 rounded-lg text-white text-center text-2xl tracking-widest focus:border-orange-400 focus:outline-none backdrop-blur-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CrewmateIcon color="red" size="sm" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <SpaceButton
                onClick={onCancel}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </SpaceButton>
              <SpaceButton
                onClick={onSubmit}
                disabled={enteredPin.length !== 4}
                variant="danger"
                className="flex-1"
              >
                <Lock className="w-4 h-4" />
                Unlock
              </SpaceButton>
            </div>
          </div>
        </SpacePanel>
      </div>
    </SpaceBackground>
  );
};