import React, { useState } from 'react';
import { Search, Plus, Package, Globe, LogOut, History, Bell, Settings, HelpCircle, Star, Lock } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StarField } from '../ui/StarField';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative">
      <StarField />
      
      <div className="relative z-10 p-4 max-w-md mx-auto">
        <div className="text-center mb-6 pt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-8 h-8 text-cyan-400 animate-spin" style={{animationDuration: '10s'}} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Cosmic Tracker
            </h1>
          </div>
          <p className="text-sm text-gray-300">Welcome back, {user?.email}</p>
          <button
            onClick={onSignOut}
            className="mt-2 px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-red-300 hover:bg-red-600/30 transition-colors text-xs flex items-center gap-1 mx-auto"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Quick search across the galaxy..."
            className="w-full pl-10 pr-4 py-3 bg-black bg-opacity-40 border border-purple-500 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none backdrop-blur-sm"
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
            className="w-full p-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-medium hover:from-cyan-400 hover:to-purple-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5" />
            Add New Item to Inventory
          </button>

          <button
            onClick={() => onViewChange('inventory')}
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25"
          >
            <Package className="w-5 h-5" />
            View Full Inventory ({items.length} items)
          </button>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onViewChange('reminders')}
            className="p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-medium hover:from-orange-500 hover:to-red-500 transition-all flex flex-col items-center gap-2 shadow-lg hover:shadow-orange-500/25"
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
            className="p-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl font-medium hover:from-green-500 hover:to-teal-500 transition-all flex flex-col items-center gap-2 shadow-lg hover:shadow-green-500/25"
          >
            <History className="w-6 h-6" />
            <span className="text-sm">History</span>
          </button>

          <button
            onClick={() => onViewChange('settings')}
            className="p-4 bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl font-medium hover:from-gray-500 hover:to-slate-500 transition-all flex flex-col items-center gap-2 shadow-lg hover:shadow-gray-500/25"
          >
            <Settings className="w-6 h-6" />
            <span className="text-sm">Settings</span>
          </button>

          <button
            onClick={() => onViewChange('help')}
            className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 transition-all flex flex-col items-center gap-2 shadow-lg hover:shadow-blue-500/25"
          >
            <HelpCircle className="w-6 h-6" />
            <span className="text-sm">Help</span>
          </button>
        </div>

        {searchTerm && (
          <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 mb-6">
            <h3 className="text-sm font-medium text-cyan-300 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Quick Search Results
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
                        <span className="text-cyan-300 text-sm truncate">{item.name}</span>
                        {item.is_starred && <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />}
                        {item.has_pin && <Lock className="w-3 h-3 text-red-400 flex-shrink-0" />}
                      </div>
                    </div>
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
          </div>
        )}

        {items.length > 0 && !searchTerm && (
          <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <h3 className="text-sm font-medium text-cyan-300 mb-2">Mission Stats</h3>
            <div className="text-sm text-gray-300">
              <p>🚀 Total Items: {items.length}</p>
              <p>⭐ Starred Items: {items.filter(item => item.is_starred).length}</p>
              <p>🔒 Secured Items: {items.filter(item => item.has_pin).length}</p>
              <p>🏷️ Total Tags: {getAllTags().length}</p>
              <p>⏰ Active Reminders: {reminders.filter(r => r.is_active).length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};