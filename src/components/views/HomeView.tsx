import React, { useState } from 'react';
import { Search, Plus, Package, Globe, LogOut, History, Bell, Settings, HelpCircle, Star, Lock, Map, Users, Camera, Route, X } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-slate-900 text-white relative">
      <StarField />
      
      <div className="relative z-10 p-4 max-w-md mx-auto">
        <div className="text-center mb-6 pt-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-8 h-8 text-slate-400 animate-spin" style={{animationDuration: '10s'}} />
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">
              <span className="text-slate-400">Cosmic</span>{' '}
              <span className="text-white">Tracker</span>
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
            className="w-full pl-10 pr-4 py-3 bg-black bg-opacity-70 border border-gray-500/30 rounded-xl text-white placeholder-gray-400 focus:border-slate-400 focus:outline-none backdrop-blur-sm"
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

        {/* Solar System Navigation */}
        {!searchTerm && (
          <div className="relative flex items-center justify-center mb-8" style={{ height: '500px' }}>
            {/* Orbital paths (visual rings) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-60 h-60 border border-gray-700/20 rounded-full"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 border border-gray-600/20 rounded-full"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 border border-gray-500/20 rounded-full"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-112 h-112 border border-gray-400/15 rounded-full"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-128 h-128 border border-gray-300/10 rounded-full"></div>
            </div>

            {/* Add CSS for continuous animations */}
            <style jsx>{`
              .orbit-1 { animation: orbit-1 15s linear infinite; }
              .orbit-2 { animation: orbit-2 20s linear infinite; }
              .orbit-3 { animation: orbit-3 25s linear infinite; }
              .orbit-4 { animation: orbit-4 30s linear infinite; }
              .orbit-5 { animation: orbit-5 35s linear infinite; }
              .orbit-6 { animation: orbit-6 45s linear infinite; }
              .orbit-7 { animation: orbit-7 55s linear infinite; }
              
              .planet-1 { animation: counter-rotate-1 15s linear infinite reverse; }
              .planet-2 { animation: counter-rotate-2 20s linear infinite reverse; }
              .planet-3 { animation: counter-rotate-3 25s linear infinite reverse; }
              .planet-4 { animation: counter-rotate-4 30s linear infinite reverse; }
              .planet-5 { animation: counter-rotate-5 35s linear infinite reverse; }
              .planet-6 { animation: counter-rotate-6 45s linear infinite reverse; }
              .planet-7 { animation: counter-rotate-7 55s linear infinite reverse; }

              @keyframes orbit-1 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes orbit-2 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes orbit-3 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes orbit-4 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes orbit-5 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes orbit-6 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes orbit-7 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              
              @keyframes counter-rotate-1 { from { transform: translateY(-120px) rotate(0deg); } to { transform: translateY(-120px) rotate(-360deg); } }
              @keyframes counter-rotate-2 { from { transform: translateY(-140px) rotate(0deg); } to { transform: translateY(-140px) rotate(-360deg); } }
              @keyframes counter-rotate-3 { from { transform: translateY(-160px) rotate(0deg); } to { transform: translateY(-160px) rotate(-360deg); } }
              @keyframes counter-rotate-4 { from { transform: translateY(-180px) rotate(0deg); } to { transform: translateY(-180px) rotate(-360deg); } }
              @keyframes counter-rotate-5 { from { transform: translateY(-200px) rotate(0deg); } to { transform: translateY(-200px) rotate(-360deg); } }
              @keyframes counter-rotate-6 { from { transform: translateY(-225px) rotate(0deg); } to { transform: translateY(-225px) rotate(-360deg); } }
              @keyframes counter-rotate-7 { from { transform: translateY(-250px) rotate(0deg); } to { transform: translateY(-250px) rotate(-360deg); } }
            `}</style>

            {/* Central Sun (Add Button) */}
            <button
              onClick={() => onViewChange('add')}
              className="relative z-20 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-bold hover:from-yellow-300 hover:to-orange-400 transition-all flex items-center justify-center shadow-2xl text-white group animate-pulse"
              style={{ animationDuration: '3s' }}
            >
              <Plus className="w-10 h-10" />
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                ☀️ Add New Item
              </div>
            </button>

            {/* Planet 1 - Inventory (Mercury) */}
            <div className="absolute inset-0 flex items-center justify-center orbit-1">
              <button
                onClick={() => onViewChange('inventory')}
                className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group planet-1"
              >
                <Package className="w-5 h-5" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  🪐 Inventory
                </div>
              </button>
            </div>

            {/* Planet 2 - Visual Maps (Venus) */}
            <div className="absolute inset-0 flex items-center justify-center orbit-2">
              <button
                onClick={() => onViewChange('visual-map')}
                className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group planet-2"
              >
                <Map className="w-6 h-6" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  🌍 Visual Maps
                </div>
              </button>
            </div>

            {/* Planet 3 - Item Groups (Mars) */}
            <div className="absolute inset-0 flex items-center justify-center orbit-3">
              <button
                onClick={() => onViewChange('groups')}
                className="w-13 h-13 bg-gradient-to-r from-red-500 to-red-700 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group planet-3"
              >
                <Users className="w-5 h-5" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  🔴 Item Groups
                </div>
              </button>
            </div>

            {/* Planet 4 - Reminders (Jupiter) */}
            <div className="absolute inset-0 flex items-center justify-center orbit-4">
              <button
                onClick={() => onViewChange('reminders')}
                className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-700 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group planet-4"
              >
                <Bell className="w-6 h-6" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  🟠 Reminders
                  {upcomingReminders.length > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded-full">
                      {upcomingReminders.length}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Planet 5 - History (Saturn) */}
            <div className="absolute inset-0 flex items-center justify-center orbit-5">
              <button
                onClick={() => onViewChange('history')}
                className="w-15 h-15 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group planet-5"
              >
                <History className="w-5 h-5" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  🪐 History
                </div>
              </button>
            </div>

            {/* Planet 6 - Settings (Uranus) */}
            <div className="absolute inset-0 flex items-center justify-center orbit-6">
              <button
                onClick={() => onViewChange('settings')}
                className="w-11 h-11 bg-gradient-to-r from-cyan-500 to-cyan-700 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group planet-6"
              >
                <Settings className="w-4 h-4" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  ⚙️ Settings
                </div>
              </button>
            </div>

            {/* Planet 7 - Help (Neptune) */}
            <div className="absolute inset-0 flex items-center justify-center orbit-7">
              <button
                onClick={() => onViewChange('help')}
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group planet-7"
              >
                <HelpCircle className="w-4 h-4" />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  💫 Help & Guide
                </div>
              </button>
            </div>
          </div>
        )}

        {searchTerm && (
          <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30 mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
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
                        <span className="text-slate-400 text-sm truncate">{item.name}</span>
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
                      className="text-slate-400 hover:text-gray-300 ml-1"
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
          <div className="mt-8 bg-black bg-opacity-70 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Mission Stats</h3>
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
