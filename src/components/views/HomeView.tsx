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
      
      {/* Add custom CSS for orbital animations */}
      <style jsx>{`
        @keyframes orbit1 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes orbit2 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes orbit3 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes orbit4 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes orbit5 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes counterRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        .orbit-container-1 {
          animation: orbit1 20s linear infinite;
        }
        
        .orbit-container-2 {
          animation: orbit2 25s linear infinite;
        }
        
        .orbit-container-3 {
          animation: orbit3 30s linear infinite;
        }
        
        .orbit-container-4 {
          animation: orbit4 35s linear infinite reverse;
        }
        
        .orbit-container-5 {
          animation: orbit5 40s linear infinite;
        }
        
        .orbit-button {
          animation: counterRotate 20s linear infinite;
        }
        
        .orbit-button-2 {
          animation: counterRotate 25s linear infinite;
        }
        
        .orbit-button-3 {
          animation: counterRotate 30s linear infinite;
        }
        
        .orbit-button-4 {
          animation: counterRotate 35s linear infinite reverse;
        }
        
        .orbit-button-5 {
          animation: counterRotate 40s linear infinite;
        }
      `}</style>
      
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
          
          {/* Header buttons row */}
          <div className="flex justify-center gap-2 mt-3">
            <button
              onClick={() => onViewChange('settings')}
              className="px-3 py-1 bg-gray-600/20 border border-gray-500/50 rounded-full text-gray-300 hover:bg-gray-600/30 transition-colors text-xs flex items-center gap-1"
            >
              <Settings className="w-3 h-3" />
              Settings
            </button>
            <button
              onClick={() => onViewChange('help')}
              className="px-3 py-1 bg-purple-600/20 border border-purple-500/50 rounded-full text-purple-300 hover:bg-purple-600/30 transition-colors text-xs flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Help
            </button>
            <button
              onClick={onSignOut}
              className="px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-red-300 hover:bg-red-600/30 transition-colors text-xs flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
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

        {/* Orbital Navigation */}
        {!searchTerm && (
          <div className="relative flex items-center justify-center mb-8" style={{ height: '420px' }}>
            {/* Fixed orbital rings for visual effect */}
            <div className="absolute inset-0 rounded-full border border-gray-600/20" style={{ 
              width: '280px', 
              height: '280px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>
            <div className="absolute inset-0 rounded-full border border-gray-600/10" style={{ 
              width: '360px', 
              height: '360px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>
            <div className="absolute inset-0 rounded-full border border-gray-600/10" style={{ 
              width: '440px', 
              height: '440px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>

            {/* Central Add Button - Sun */}
            <button
              onClick={() => onViewChange('add')}
              className="relative z-20 w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-bold hover:from-yellow-400 hover:to-orange-400 transition-all flex items-center justify-center shadow-2xl text-white group animate-pulse"
              style={{ animationDuration: '3s' }}
            >
              <Plus className="w-10 h-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                Add New Item
              </div>
            </button>

            {/* First orbit - Package/Inventory */}
            <div className="absolute orbit-container-1 pointer-events-none" style={{ 
              width: '280px', 
              height: '280px',
              left: '50%',
              top: '50%'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Navigating to: inventory');
                  onViewChange('inventory');
                }}
                className="absolute w-14 h-14 bg-gradient-to-r from-gray-600 to-slate-600 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group orbit-button pointer-events-auto"
                style={{
                  left: 'calc(50% + 140px - 28px)',
                  top: 'calc(50% + 0px - 28px)'
                }}
              >
                <Package className="w-6 h-6" />
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  Inventory
                </div>
              </button>
            </div>

            {/* Second orbit - Bell/Reminders */}
            <div className="absolute orbit-container-2 pointer-events-none" style={{ 
              width: '360px', 
              height: '360px',
              left: '50%',
              top: '50%'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Navigating to: reminders');
                  onViewChange('reminders');
                }}
                className="absolute w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group orbit-button-2 pointer-events-auto"
                style={{
                  left: 'calc(50% + 180px - 24px)',
                  top: 'calc(50% + 0px - 24px)'
                }}
              >
                <Bell className="w-5 h-5" />
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  Reminders
                  {upcomingReminders.length > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded-full">
                      {upcomingReminders.length}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Third orbit - History */}
            <div className="absolute orbit-container-3 pointer-events-none" style={{ 
              width: '440px', 
              height: '440px',
              left: '50%',
              top: '50%'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Navigating to: history');
                  onViewChange('history');
                }}
                className="absolute w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group orbit-button-3 pointer-events-auto"
                style={{
                  left: 'calc(50% + 220px - 20px)',
                  top: 'calc(50% + 0px - 20px)'
                }}
              >
                <History className="w-4 h-4" />
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  History
                </div>
              </button>
            </div>

            {/* Fourth orbit - Visual Maps */}
            <div className="absolute orbit-container-4 pointer-events-none" style={{ 
              width: '440px', 
              height: '440px',
              left: '50%',
              top: '50%'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Navigating to: visual-map');
                  onViewChange('visual-map');
                }}
                className="absolute w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group orbit-button-4 pointer-events-auto"
                style={{
                  left: 'calc(50% - 220px - 20px)',
                  top: 'calc(50% + 0px - 20px)'
                }}
              >
                <Map className="w-4 h-4" />
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  Visual Maps
                </div>
              </button>
            </div>

            {/* Fifth orbit - Item Groups */}
            <div className="absolute orbit-container-5 pointer-events-none" style={{ 
              width: '440px', 
              height: '440px',
              left: '50%',
              top: '50%'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Navigating to: groups');
                  onViewChange('groups');
                }}
                className="absolute w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group orbit-button-5 pointer-events-auto"
                style={{
                  left: 'calc(50% + 0px - 20px)',
                  top: 'calc(50% + 220px - 20px)'
                }}
              >
                <Users className="w-4 h-4" />
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  Item Groups
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
