import React, { useState } from 'react';
import { Search, Plus, Package, Globe, LogOut, History, Bell, Settings, HelpCircle, Star, Lock, Map, Archive, Users, Camera, Route } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { SpaceBackground } from '../ui/SpaceBackground';
import { SpaceButton } from '../ui/SpaceButton';
import { SpacePanel } from '../ui/SpacePanel';
import { CrewmateIcon, FloatingCrewmate } from '../ui/CrewmateIcon';
import type { Item, ItemReminder } from '../SpaceTracker';

interface HomeViewProps {
  items: Item[];
  categories: Array<{ id: string; name: string; icon: string }>;
  reminders: ItemReminder[];
  onViewChange: (view: string) => void;
  onItemClick: (item: Item) => void;
  onSignOut: () => void;
  user: User | null;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  categories,
  reminders,
  onViewChange,
  onItemClick,
  onSignOut,
  user
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getAllTags = () => {
    const allTags = new Set<string>();
    items.forEach(item => {
      item.tags?.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Get upcoming reminders (within next 7 days)
  const upcomingReminders = reminders.filter(reminder => {
    if (!reminder.is_active) return false;
    const expiryDate = new Date(reminder.expiry_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= reminder.reminder_days_before && daysUntilExpiry >= 0;
  });

  return (
    <SpaceBackground variant="starfield">
      {/* Floating crewmates */}
      <FloatingCrewmate color="blue" className="top-16 left-8" />
      <FloatingCrewmate color="green" className="top-24 right-12" />
      <FloatingCrewmate color="red" className="bottom-32 left-16" />
      <FloatingCrewmate color="yellow" className="bottom-20 right-8" />
      <FloatingCrewmate color="purple" className="top-1/2 left-4" />
      
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6 pt-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-cyan-400 animate-spin" style={{animationDuration: '10s'}} />
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              <span className="text-cyan-400">Cosmic</span>{' '}
              <span className="text-white">Tracker</span>
            </h1>
            <CrewmateIcon color="cyan" size="md" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CrewmateIcon color="blue" size="sm" />
            <p className="text-sm text-gray-300">Welcome back, {user?.email}</p>
            <CrewmateIcon color="green" size="sm" />
          </div>
          <button
            onClick={onSignOut}
            className="mt-2 px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-red-300 hover:bg-red-600/30 transition-colors text-xs flex items-center gap-1 mx-auto"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
            <CrewmateIcon color="red" size="sm" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Quick search across the galaxy..."
            className="w-full pl-10 pr-12 py-3 bg-black/40 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none backdrop-blur-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CrewmateIcon color="cyan" size="sm" />
          </div>
        </div>

        {/* Upcoming Reminders Alert */}
        {upcomingReminders.length > 0 && (
          <SpacePanel variant="warning" className="mb-6 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-orange-300">Upcoming Expiries!</h3>
              <CrewmateIcon color="orange" size="sm" animate />
            </div>
            <p className="text-sm text-orange-200 mb-2">
              {upcomingReminders.length} item{upcomingReminders.length > 1 ? 's' : ''} expiring soon
            </p>
            <SpaceButton
              onClick={() => onViewChange('reminders')}
              variant="danger"
              size="sm"
            >
              View Reminders →
            </SpaceButton>
          </SpacePanel>
        )}

        <div className="space-y-4 mb-6">
          <SpaceButton
            onClick={() => onViewChange('add')}
            variant="primary"
            className="w-full"
          >
            <Plus className="w-5 h-5" />
            Add New Item to Inventory
            <CrewmateIcon color="green" size="sm" />
          </SpaceButton>

          <SpaceButton
            onClick={() => onViewChange('inventory')}
            variant="secondary"
            className="w-full"
          >
            <Package className="w-5 h-5" />
            View Full Inventory ({items.length} items)
            <CrewmateIcon color="blue" size="sm" />
          </SpaceButton>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <SpaceButton
            onClick={() => onViewChange('visual-map')}
            variant="primary"
            className="p-4 flex flex-col items-center gap-2"
          >
            <Map className="w-6 h-6" />
            <span className="text-sm">Visual Maps</span>
            <CrewmateIcon color="cyan" size="sm" />
          </SpaceButton>

          <SpaceButton
            onClick={() => onViewChange('virtual-drawers')}
            variant="primary"
            className="p-4 flex flex-col items-center gap-2"
          >
            <Archive className="w-6 h-6" />
            <span className="text-sm">Virtual Drawers</span>
            <CrewmateIcon color="purple" size="sm" />
          </SpaceButton>

          <SpaceButton
            onClick={() => onViewChange('groups')}
            variant="primary"
            className="p-4 flex flex-col items-center gap-2"
          >
            <Users className="w-6 h-6" />
            <span className="text-sm">Item Groups</span>
            <CrewmateIcon color="green" size="sm" />
          </SpaceButton>

          <SpaceButton
            onClick={() => onViewChange('virtual-tour')}
            variant="primary"
            className="p-4 flex flex-col items-center gap-2"
          >
            <Route className="w-6 h-6" />
            <span className="text-sm">Virtual Tour</span>
            <CrewmateIcon color="yellow" size="sm" />
          </SpaceButton>

          <SpaceButton
            onClick={() => onViewChange('photo-search')}
            variant="primary"
            className="p-4 flex flex-col items-center gap-2"
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm">Photo Search</span>
            <CrewmateIcon color="pink" size="sm" />
          </SpaceButton>

          <SpaceButton
            onClick={() => onViewChange('reminders')}
            variant="primary"
            className="p-4 flex flex-col items-center gap-2 relative"
          >
            <Bell className="w-6 h-6" />
            <span className="text-sm">Reminders</span>
            <CrewmateIcon color="orange" size="sm" />
            {upcomingReminders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {upcomingReminders.length}
              </span>
            )}
          </SpaceButton>

          <SpaceButton
            onClick={() => onViewChange('history')}
            variant="secondary"
            className="p-4 flex flex-col items-center gap-2"
          >
            <History className="w-6 h-6" />
            <span className="text-sm">History</span>
            <CrewmateIcon color="blue" size="sm" />
          </SpaceButton>

          <SpaceButton
            onClick={() => onViewChange('settings')}
            variant="secondary"
            className="p-4 flex flex-col items-center gap-2"
          >
            <Settings className="w-6 h-6" />
            <span className="text-sm">Settings</span>
            <CrewmateIcon color="gray" size="sm" />
          </SpaceButton>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <SpaceButton
            onClick={() => onViewChange('help')}
            variant="primary"
            className="p-4 flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-6 h-6" />
            <span className="text-sm">Help & Guide</span>
            <CrewmateIcon color="cyan" size="sm" />
          </SpaceButton>
        </div>

        {searchTerm && (
          <SpacePanel variant="control" className="p-4 mb-6">
            <h3 className="text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Quick Search Results
              <CrewmateIcon color="cyan" size="sm" />
            </h3>
            {filteredItems.length === 0 ? (
              <p className="text-gray-400 text-sm">No items found matching "{searchTerm}"</p>
            ) : (
              <div className="space-y-2">
                {filteredItems.slice(0, 3).map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => onItemClick(item)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors"
                  >
                    {/* Show lock icon for PIN-protected items, otherwise show image or category icon */}
                    {item.has_pin ? (
                      <div className="w-8 h-8 rounded bg-red-600/20 border border-red-500/50 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-red-400" />
                      </div>
                    ) : item.item_image_url ? (
                      <div className="w-8 h-8 rounded overflow-hidden border border-gray-600 flex-shrink-0">
                        <img src={item.item_image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">{item.category.icon}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-cyan-400 text-sm truncate">{item.name}</span>
                        {item.is_starred && <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />}
                        {item.has_pin && <Lock className="w-3 h-3 text-red-400 flex-shrink-0" />}
                      </div>
                    </div>
                    <CrewmateIcon color="blue" size="sm" />
                  </div>
                ))}
                {filteredItems.length > 3 && (
                  <p className="text-xs text-gray-400">
                    +{filteredItems.length - 3} more results. 
                    <button 
                      onClick={() => onViewChange('inventory')}
                      className="text-cyan-400 hover:text-cyan-300 ml-1"
                    >
                      View all →
                    </button>
                  </p>
                )}
              </div>
            )}
          </SpacePanel>
        )}

        {items.length > 0 && !searchTerm && (
          <SpacePanel variant="default" className="mt-8 p-4">
            <h3 className="text-sm font-medium text-cyan-400 mb-2 flex items-center gap-2">
              Mission Stats
              <CrewmateIcon color="cyan" size="sm" />
            </h3>
            <div className="text-sm text-gray-300">
              <p>🚀 Total Items: {items.length}</p>
              <p>⭐ Starred Items: {items.filter(item => item.is_starred).length}</p>
              <p>🔒 Secured Items: {items.filter(item => item.has_pin).length}</p>
              <p>🏷️ Total Tags: {getAllTags().length}</p>
              <p>⏰ Active Reminders: {reminders.filter(r => r.is_active).length}</p>
            </div>
          </SpacePanel>
        )}
      </div>
    </SpaceBackground>
  );
};