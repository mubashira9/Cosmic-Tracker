import React, { useState } from 'react';
import { Search, Plus, Package, Globe, LogOut, History, Bell, Settings, HelpCircle, Star, Lock, Map } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedBackground } from '../ui/ThemedBackground';
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
  const { currentTheme } = useTheme();

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
    <ThemedBackground>
      <div className="p-4 max-w-md mx-auto">
        <div className="text-center mb-6 pt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className={`w-8 h-8 text-${currentTheme.colors.primary} animate-spin`} style={{animationDuration: '10s'}} />
            <h1 className={`text-2xl font-bold text-${currentTheme.colors.text} drop-shadow-lg`}>
              <span className={`text-${currentTheme.colors.primary}`}>Cosmic</span>{' '}
              <span className={`text-${currentTheme.colors.secondary}`}>Tracker</span>
            </h1>
          </div>
          <p className={`text-sm text-${currentTheme.colors.textSecondary}`}>Welcome back, {user?.email}</p>
          <button
            onClick={onSignOut}
            className="mt-2 px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-red-300 hover:bg-red-600/30 transition-colors text-xs flex items-center gap-1 mx-auto"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>

        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-${currentTheme.colors.textSecondary}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Quick search across the galaxy..."
            className={`w-full pl-10 pr-4 py-3 ${currentTheme.gradients.card} border border-${currentTheme.colors.border} rounded-xl text-${currentTheme.colors.text} placeholder-${currentTheme.colors.textSecondary} focus:border-${currentTheme.colors.primary} focus:outline-none`}
          />
        </div>

        {/* Upcoming Reminders Alert */}
        {upcomingReminders.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-xl p-4 border border-orange-500/50">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-orange-300">Upcoming Expiries!</h3>
            </div>
            <p className="text-sm text-orange-200 mb-2">
              {upcomingReminders.length} item{upcomingReminders.length > 1 ? 's' : ''} expiring soon
            </p>
            <button
              onClick={() => onViewChange('reminders')}
              className="text-xs bg-orange-500/30 hover:bg-orange-500/50 px-3 py-1 rounded-full text-orange-200 transition-colors"
            >
              View Reminders →
            </button>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <button
            onClick={() => onViewChange('add')}
            className={`w-full p-4 ${currentTheme.gradients.button} rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg text-white`}
          >
            <Plus className="w-5 h-5" />
            Add New Item to Inventory
          </button>

          <button
            onClick={() => onViewChange('inventory')}
            className={`w-full p-4 bg-gradient-to-r from-${currentTheme.colors.secondary} to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg text-white`}
          >
            <Package className="w-5 h-5" />
            View Full Inventory ({items.length} items)
          </button>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onViewChange('visual-map')}
            className={`p-4 bg-gradient-to-r from-${currentTheme.colors.primary} to-${currentTheme.colors.secondary} rounded-xl font-medium hover:opacity-90 transition-all flex flex-col items-center gap-2 shadow-lg text-white`}
          >
            <Map className="w-6 h-6" />
            <span className="text-sm">Visual Map</span>
          </button>

          <button
            onClick={() => onViewChange('reminders')}
            className="p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-medium hover:opacity-90 transition-all flex flex-col items-center gap-2 shadow-lg text-white"
          >
            <Bell className="w-6 h-6" />
            <span className="text-sm">Reminders</span>
            {upcomingReminders.length > 0 && (
              <span className="bg-white text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                {upcomingReminders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onViewChange('history')}
            className="p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl font-medium hover:opacity-90 transition-all flex flex-col items-center gap-2 shadow-lg text-white"
          >
            <History className="w-6 h-6" />
            <span className="text-sm">History</span>
          </button>

          <button
            onClick={() => onViewChange('settings')}
            className="p-4 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl font-medium hover:opacity-90 transition-all flex flex-col items-center gap-2 shadow-lg text-white"
          >
            <Settings className="w-6 h-6" />
            <span className="text-sm">Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <button
            onClick={() => onViewChange('help')}
            className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg text-white"
          >
            <HelpCircle className="w-6 h-6" />
            <span className="text-sm">Help & Guide</span>
          </button>
        </div>

        {searchTerm && (
          <div className={`${currentTheme.gradients.card} rounded-xl p-4 border border-${currentTheme.colors.border} mb-6`}>
            <h3 className={`text-sm font-medium text-${currentTheme.colors.primary} mb-3 flex items-center gap-2`}>
              <Search className="w-4 h-4" />
              Quick Search Results
            </h3>
            {filteredItems.length === 0 ? (
              <p className={`text-${currentTheme.colors.textSecondary} text-sm`}>No items found matching "{searchTerm}"</p>
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
                        <span className={`text-${currentTheme.colors.primary} text-sm truncate`}>{item.name}</span>
                        {item.is_starred && <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />}
                        {item.has_pin && <Lock className="w-3 h-3 text-red-400 flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredItems.length > 3 && (
                  <p className={`text-xs text-${currentTheme.colors.textSecondary}`}>
                    +{filteredItems.length - 3} more results. 
                    <button 
                      onClick={() => onViewChange('inventory')}
                      className={`text-${currentTheme.colors.primary} hover:text-${currentTheme.colors.secondary} ml-1`}
                    >
                      View all →
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {items.length > 0 && !searchTerm && (
          <div className={`mt-8 ${currentTheme.gradients.card} rounded-xl p-4 border border-${currentTheme.colors.border}`}>
            <h3 className={`text-sm font-medium text-${currentTheme.colors.primary} mb-2`}>Mission Stats</h3>
            <div className={`text-sm text-${currentTheme.colors.textSecondary}`}>
              <p>🚀 Total Items: {items.length}</p>
              <p>⭐ Starred Items: {items.filter(item => item.is_starred).length}</p>
              <p>🔒 Secured Items: {items.filter(item => item.has_pin).length}</p>
              <p>🏷️ Total Tags: {getAllTags().length}</p>
              <p>⏰ Active Reminders: {reminders.filter(r => r.is_active).length}</p>
            </div>
          </div>
        )}
      </div>
    </ThemedBackground>
  );
};