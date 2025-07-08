import React, { useState } from 'react';
import { Search, Plus, Package, Globe, LogOut, History, Bell, Settings, HelpCircle, Star, Lock, Map, Archive, Users, Camera, Route, X } from 'lucide-react';
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
  const [showRadialNav, setShowRadialNav] = useState(false);

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

  // Clear search when showing radial nav
  const handleShowRadialNav = () => {
    setSearchTerm('');
    setShowRadialNav(true);
  };

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

        {/* Radial Navigation */}
        {!searchTerm && (
          <div className="relative flex items-center justify-center mb-8" style={{ height: '400px' }}>
            {/* Central Add Button */}
            <button
              onClick={showRadialNav ? () => onViewChange('add') : handleShowRadialNav}
              className="relative z-20 w-20 h-20 bg-gradient-to-r from-slate-500 to-gray-600 rounded-full font-bold hover:from-slate-400 hover:to-gray-500 transition-all flex items-center justify-center shadow-2xl text-white group"
            >
              <Plus className="w-8 h-8" />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Add New Item
              </div>
            </button>

            {/* Orbiting Navigation Options */}
            {showRadialNav && (
              <>
                {/* Close button */}
                <button
                  onClick={() => setShowRadialNav(false)}
                  className="absolute top-0 right-0 z-30 w-8 h-8 bg-red-600/20 hover:bg-red-600/40 rounded-full flex items-center justify-center transition-all border border-red-500/50"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>

                {/* Navigation items in radial pattern */}
                {[
                  { icon: Package, label: 'Inventory', view: 'inventory', color: 'from-gray-600 to-slate-600', angle: 0 },
                  { icon: Map, label: 'Visual Maps', view: 'visual-map', color: 'from-blue-600 to-indigo-600', angle: 45 },
                  { icon: Archive, label: 'Virtual Drawers', view: 'virtual-drawers', color: 'from-purple-600 to-violet-600', angle: 90 },
                  { icon: Users, label: 'Item Groups', view: 'groups', color: 'from-emerald-600 to-teal-600', angle: 135 },
                  { icon: Route, label: 'Virtual Tour', view: 'virtual-tour', color: 'from-cyan-600 to-blue-600', angle: 180 },
                  { icon: Camera, label: 'Photo Search', view: 'photo-search', color: 'from-pink-600 to-rose-600', angle: 225 },
                  { icon: Bell, label: 'Reminders', view: 'reminders', color: 'from-orange-600 to-red-600', angle: 270 },
                  { icon: History, label: 'History', view: 'history', color: 'from-green-600 to-teal-600', angle: 315 },
                ].map((item, index) => {
                  const radius = 140;
                  const radian = (item.angle * Math.PI) / 180;
                  const x = Math.cos(radian) * radius;
                  const y = Math.sin(radian) * radius;
                  
                  return (
                    <button
                      key={item.view}
                      onClick={() => onViewChange(item.view)}
                      className={`absolute w-16 h-16 bg-gradient-to-r ${item.color} rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-xl text-white group animate-pulse`}
                      style={{
                        left: `calc(50% + ${x}px - 32px)`,
                        top: `calc(50% + ${y}px - 32px)`,
                        animationDelay: `${index * 0.1}s`,
                        animationDuration: '2s'
                      }}
                    >
                      <item.icon className="w-6 h-6" />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        {item.label}
                        {item.view === 'reminders' && upcomingReminders.length > 0 && (
                          <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded-full">
                            {upcomingReminders.length}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Secondary ring for additional options */}
                {[
                  { icon: Settings, label: 'Settings', view: 'settings', color: 'from-gray-600 to-slate-600', angle: 22.5 },
                  { icon: HelpCircle, label: 'Help & Guide', view: 'help', color: 'from-purple-600 to-pink-600', angle: 67.5 },
                ].map((item, index) => {
                  const radius = 200;
                  const radian = (item.angle * Math.PI) / 180;
                  const x = Math.cos(radian) * radius;
                  const y = Math.sin(radian) * radius;
                  
                  return (
                    <button
                      key={item.view}
                      onClick={() => onViewChange(item.view)}
                      className={`absolute w-12 h-12 bg-gradient-to-r ${item.color} rounded-full hover:scale-110 transition-all flex items-center justify-center shadow-lg text-white group animate-pulse`}
                      style={{
                        left: `calc(50% + ${x}px - 24px)`,
                        top: `calc(50% + ${y}px - 24px)`,
                        animationDelay: `${(index + 8) * 0.1}s`,
                        animationDuration: '2s'
                      }}
                    >
                      <item.icon className="w-5 h-5" />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </>
            )}
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