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

        {/* Always-Visible Orbital Navigation */}
        {!searchTerm && (
          <div className="relative flex items-center justify-center mb-8" style={{ height: '500px' }}>
            {/* Orbital rings (visual guides) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-60 h-60 border border-gray-700/30 rounded-full"></div>
              <div className="absolute w-80 h-80 border border-gray-700/20 rounded-full"></div>
              <div className="absolute w-96 h-96 border border-gray-700/15 rounded-full"></div>
              <div className="absolute w-[28rem] h-[28rem] border border-gray-700/10 rounded-full"></div>
            </div>

            {/* Central Add Button (Sun) */}
            <button
              onClick={() => onViewChange('add')}
              className="relative z-20 w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full font-bold hover:from-yellow-400 hover:to-orange-500 transition-all flex items-center justify-center shadow-2xl text-white group animate-pulse"
              style={{ animationDuration: '1.5s' }}
            >
              <Plus className="w-8 h-8" />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                Add New Item
              </div>
            </button>

            {/* First Orbit - Main Navigation */}
            {[
              { icon: Package, label: 'Inventory', view: 'inventory', color: 'from-gray-600 to-slate-600', startAngle: 0, size: 'w-16 h-16' },
              { icon: Map, label: 'Visual Maps', view: 'visual-map', color: 'from-blue-600 to-indigo-600', startAngle: 120, size: 'w-16 h-16' },
              { icon: Users, label: 'Item Groups', view: 'groups', color: 'from-emerald-600 to-teal-600', startAngle: 240, size: 'w-16 h-16' },
            ].map((item, index) => (
              <div
                key={`orbit1-${item.view}`}
                className="absolute w-60 h-60 animate-spin"
                style={{
                  animationDuration: '30s',
                  animationTimingFunction: 'linear',
                  animationDelay: `${item.startAngle / 360 * 30}s`,
                  transform: `rotate(${item.startAngle}deg)`
                }}
              >
                <button
                  onClick={() => onViewChange(item.view)}
                  className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${item.size} bg-gradient-to-r ${item.color} rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group`}
                  style={{
                    animationDuration: '30s',
                    animationTimingFunction: 'linear',
                    animationDelay: `${item.startAngle / 360 * -30}s`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                  onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                >
                  <item.icon className="w-6 h-6 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    {item.label}
                  </div>
                </button>
              </div>
            ))}

            {/* Second Orbit - Time & Alerts */}
            {[
              { icon: Bell, label: 'Reminders', view: 'reminders', color: 'from-orange-600 to-red-600', startAngle: 45, size: 'w-14 h-14' },
              { icon: History, label: 'History', view: 'history', color: 'from-green-600 to-teal-600', startAngle: 225, size: 'w-14 h-14' },
            ].map((item, index) => (
              <div
                key={`orbit2-${item.view}`}
                className="absolute w-80 h-80 animate-spin"
                style={{
                  animationDuration: '45s',
                  animationTimingFunction: 'linear',
                  animationDelay: `${item.startAngle / 360 * 45}s`,
                  transform: `rotate(${item.startAngle}deg)`
                }}
              >
                <button
                  onClick={() => onViewChange(item.view)}
                  className={`absolute -top-7 left-1/2 transform -translate-x-1/2 ${item.size} bg-gradient-to-r ${item.color} rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group`}
                  style={{
                    animationDuration: '45s',
                    animationTimingFunction: 'linear',
                    animationDelay: `${item.startAngle / 360 * -45}s`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                  onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                >
                  <item.icon className="w-5 h-5 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    {item.label}
                    {item.view === 'reminders' && upcomingReminders.length > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded-full">
                        {upcomingReminders.length}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            ))}

            {/* Third Orbit - Settings & Support */}
            {[
              { icon: Settings, label: 'Settings', view: 'settings', color: 'from-gray-600 to-slate-600', startAngle: 90, size: 'w-12 h-12' },
              { icon: HelpCircle, label: 'Help & Guide', view: 'help', color: 'from-purple-600 to-pink-600', startAngle: 270, size: 'w-12 h-12' },
            ].map((item, index) => (
              <div
                key={`orbit3-${item.view}`}
                className="absolute w-96 h-96 animate-spin"
                style={{
                  animationDuration: '60s',
                  animationTimingFunction: 'linear',
                  animationDelay: `${item.startAngle / 360 * 60}s`,
                  transform: `rotate(${item.startAngle}deg)`
                }}
              >
                <button
                  onClick={() => onViewChange(item.view)}
                  className={`absolute -top-6 left-1/2 transform -translate-x-1/2 ${item.size} bg-gradient-to-r ${item.color} rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group`}
                  style={{
                    animationDuration: '60s',
                    animationTimingFunction: 'linear',
                    animationDelay: `${item.startAngle / 360 * -60}s`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                  onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                >
                  <item.icon className="w-4 h-4 animate-spin" style={{ animationDuration: '60s', animationDirection: 'reverse' }} />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    {item.label}
                  </div>
                </button>
              </div>
            ))}

            {/* Fourth Orbit - Additional Features */}
            {[
              { icon: Camera, label: 'Quick Scan', view: 'quick-scan', color: 'from-cyan-600 to-blue-600', startAngle: 0, size: 'w-10 h-10' },
              { icon: Route, label: 'Find Items', view: 'find-items', color: 'from-indigo-600 to-purple-600', startAngle: 180, size: 'w-10 h-10' },
            ].map((item, index) => (
              <div
                key={`orbit4-${item.view}`}
                className="absolute w-[28rem] h-[28rem] animate-spin"
                style={{
                  animationDuration: '75s',
                  animationTimingFunction: 'linear',
                  animationDelay: `${item.startAngle / 360 * 75}s`,
                  transform: `rotate(${item.startAngle}deg)`
                }}
              >
                <button
                  onClick={() => onViewChange(item.view)}
                  className={`absolute -top-5 left-1/2 transform -translate-x-1/2 ${item.size} bg-gradient-to-r ${item.color} rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group`}
                  style={{
                    animationDuration: '75s',
                    animationTimingFunction: 'linear',
                    animationDelay: `${item.startAngle / 360 * -75}s`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                  onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                >
                  <item.icon className="w-4 h-4 animate-spin" style={{ animationDuration: '75s', animationDirection: 'reverse' }} />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                    {item.label}
                  </div>
                </button>
              </div>
            ))}
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
