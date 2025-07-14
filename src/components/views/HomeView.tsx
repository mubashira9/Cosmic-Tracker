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
      
      {/* Add custom CSS for orbital animations with galaxy effects */}
      <style jsx>{`
        @keyframes orbit1 {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes orbit2 {
          from { transform: translate(-50%, -50%) rotate(90deg); }
          to { transform: translate(-50%, -50%) rotate(450deg); }
        }
        
        @keyframes orbit3 {
          from { transform: translate(-50%, -50%) rotate(180deg); }
          to { transform: translate(-50%, -50%) rotate(540deg); }
        }
        
        @keyframes orbit4 {
          from { transform: translate(-50%, -50%) rotate(270deg); }
          to { transform: translate(-50%, -50%) rotate(630deg); }
        }
        
        @keyframes orbit5 {
          from { transform: translate(-50%, -50%) rotate(45deg); }
          to { transform: translate(-50%, -50%) rotate(405deg); }
        }
        
        @keyframes counterRotate1 {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        
        @keyframes counterRotate2 {
          from { transform: rotate(-90deg); }
          to { transform: rotate(-450deg); }
        }
        
        @keyframes counterRotate3 {
          from { transform: rotate(-180deg); }
          to { transform: rotate(-540deg); }
        }
        
        @keyframes counterRotate4 {
          from { transform: rotate(-270deg); }
          to { transform: rotate(-630deg); }
        }
        
        @keyframes counterRotate5 {
          from { transform: rotate(-45deg); }
          to { transform: rotate(-405deg); }
        }
        
        @keyframes galaxyRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .orbit-container-1 {
          animation: orbit1 60s linear infinite;
        }
        
        .orbit-container-2 {
          animation: orbit2 80s linear infinite;
        }
        
        .orbit-container-3 {
          animation: orbit3 100s linear infinite;
        }
        
        .orbit-container-4 {
          animation: orbit4 120s linear infinite;
        }
        
        .orbit-container-5 {
          animation: orbit5 140s linear infinite;
        }
        
        .orbit-button {
          animation: counterRotate1 60s linear infinite;
        }
        
        .orbit-button-2 {
          animation: counterRotate2 80s linear infinite;
        }
        
        .orbit-button-3 {
          animation: counterRotate3 100s linear infinite;
        }
        
        .orbit-button-4 {
          animation: counterRotate4 120s linear infinite;
        }
        
        .orbit-button-5 {
          animation: counterRotate5 140s linear infinite;
        }
        
        .galaxy-ring {
          animation: galaxyRotate 200s linear infinite;
        }
        
        .galaxy-ring-reverse {
          animation: galaxyRotate 300s linear infinite reverse;
        }
        
        .star {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .floating-star {
          animation: float 3s ease-in-out infinite;
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
          <div className="relative flex items-center justify-center mb-8" style={{ height: '480px' }}>
            {/* Galaxy Background Stars */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Static background stars */}
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full star"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
              
              {/* Floating stars */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={`float-${i}`}
                  className="absolute w-2 h-2 bg-blue-300 rounded-full floating-star opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>

            {/* Galaxy Spiral Arms */}
            <div className="absolute galaxy-ring" style={{ 
              width: '500px', 
              height: '500px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              <div className="absolute inset-0 rounded-full border border-purple-400/20" style={{
                borderStyle: 'dashed',
                borderWidth: '1px'
              }}></div>
            </div>
            
            <div className="absolute galaxy-ring-reverse" style={{ 
              width: '400px', 
              height: '400px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              <div className="absolute inset-0 rounded-full border border-blue-400/15" style={{
                borderStyle: 'dotted',
                borderWidth: '2px'
              }}></div>
            </div>

            {/* Central galaxy glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-purple-500/10 via-blue-500/5 to-transparent" style={{ 
              width: '600px', 
              height: '600px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>

            {/* Fixed orbital rings for visual effect - Made more visible */}
            <div className="absolute inset-0 rounded-full border-2 border-gray-300/50 shadow-lg" style={{ 
              width: '280px', 
              height: '280px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 20px rgba(255,255,255,0.2)'
            }}></div>
            <div className="absolute inset-0 rounded-full border border-gray-300/40 shadow-md" style={{ 
              width: '360px', 
              height: '360px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px rgba(255,255,255,0.1)'
            }}></div>
            <div className="absolute inset-0 rounded-full border border-gray-300/30 shadow-sm" style={{ 
              width: '440px', 
              height: '440px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px rgba(255,255,255,0.05)'
            }}></div>

            {/* Central Add Button - Sun with enhanced glow */}
            <button
              onClick={() => onViewChange('add')}
              className="relative z-30 w-28 h-28 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full font-bold hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transition-all flex items-center justify-center shadow-2xl text-white group"
              style={{ 
                boxShadow: '0 0 40px rgba(255,165,0,0.6), 0 0 80px rgba(255,165,0,0.3)',
                animation: 'pulse 4s ease-in-out infinite'
              }}
            >
              <Plus className="w-12 h-12" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full animate-ping opacity-10" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
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
                className="absolute w-16 h-16 bg-gradient-to-r from-gray-500 to-slate-700 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group orbit-button pointer-events-auto"
                style={{
                  left: 'calc(50% + 140px - 32px)',
                  top: 'calc(50% + 0px - 32px)',
                  boxShadow: '0 0 20px rgba(107,114,128,0.4)'
                }}
              >
                <Package className="w-7 h-7" />
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
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
                className="absolute w-14 h-14 bg-gradient-to-r from-orange-500 to-red-600 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group orbit-button-2 pointer-events-auto"
                style={{
                  left: 'calc(50% + 180px - 28px)',
                  top: 'calc(50% + 0px - 28px)',
                  boxShadow: '0 0 20px rgba(234,88,12,0.4)'
                }}
              >
                <Bell className="w-6 h-6" />
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
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
                className="absolute w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group orbit-button-3 pointer-events-auto"
                style={{
                  left: 'calc(50% + 220px - 24px)',
                  top: 'calc(50% + 0px - 24px)',
                  boxShadow: '0 0 20px rgba(34,197,94,0.4)'
                }}
              >
                <History className="w-5 h-5" />
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
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
                className="absolute w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group orbit-button-4 pointer-events-auto"
                style={{
                  left: 'calc(50% + 220px - 24px)',
                  top: 'calc(50% + 0px - 24px)',
                  boxShadow: '0 0 20px rgba(59,130,246,0.4)'
                }}
              >
                <Map className="w-5 h-5" />
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
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
                className="absolute w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group orbit-button-5 pointer-events-auto"
                style={{
                  left: 'calc(50% + 220px - 24px)',
                  top: 'calc(50% + 0px - 24px)',
                  boxShadow: '0 0 20px rgba(16,185,129,0.4)'
                }}
              >
                <Users className="w-5 h-5" />
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
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
