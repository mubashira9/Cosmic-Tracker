import React, { useState } from 'react';
import { Search, Plus, Package, Globe, LogOut, History, Bell, Settings, HelpCircle, Star, Lock, Map, Archive, Users, Camera, Route } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { SpaceBackground } from '../ui/SpaceBackground';
import { SpaceButton } from '../ui/SpaceButton';
import { SpacePanel } from '../ui/SpacePanel';
import { CrewmateIcon, FloatingCrewmate } from '../ui/CrewmateIcon';
import type { Item, ItemReminder } from '../SpaceTracker';

interface SpaceshipDashboardProps {
  items: Item[];
  categories: Array<{ id: string; name: string; icon: string }>;
  reminders: ItemReminder[];
  onViewChange: (view: string) => void;
  onItemClick: (item: Item) => void;
  onSignOut: () => void;
  user: User | null;
}

interface RoomProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  onClick: () => void;
  badge?: number;
  crewmateColor: string;
}

const Room: React.FC<RoomProps> = ({ 
  name, 
  icon, 
  position, 
  size, 
  color, 
  onClick, 
  badge,
  crewmateColor 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 ${
        isHovered ? 'scale-110 z-20' : 'z-10'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Room background */}
      <div
        className={`w-full h-full rounded-lg border-2 transition-all duration-300 ${
          isHovered 
            ? `border-${color}-400 bg-${color}-500/30 shadow-lg shadow-${color}-500/50` 
            : `border-${color}-600/50 bg-${color}-900/20`
        }`}
        style={{
          backgroundColor: isHovered 
            ? `${color === 'cyan' ? '#0891b2' : color === 'purple' ? '#7c3aed' : color === 'green' ? '#059669' : color === 'orange' ? '#ea580c' : color === 'blue' ? '#2563eb' : color === 'red' ? '#dc2626' : '#64748b'}20`
            : `${color === 'cyan' ? '#0891b2' : color === 'purple' ? '#7c3aed' : color === 'green' ? '#059669' : color === 'orange' ? '#ea580c' : color === 'blue' ? '#2563eb' : color === 'red' ? '#dc2626' : '#64748b'}10`
        }}
      >
        {/* Room content */}
        <div className="flex flex-col items-center justify-center h-full p-2 relative">
          {/* Icon */}
          <div className={`text-${color}-400 mb-1`}>
            {icon}
          </div>
          
          {/* Room name */}
          <span className={`text-xs font-medium text-${color}-300 text-center leading-tight`}>
            {name}
          </span>
          
          {/* Crewmate */}
          <div className="mt-1">
            <CrewmateIcon color={crewmateColor as any} size="sm" />
          </div>

          {/* Badge */}
          {badge && badge > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold min-w-[20px] text-center">
              {badge}
            </div>
          )}

          {/* Hover glow effect */}
          {isHovered && (
            <div 
              className="absolute inset-0 rounded-lg animate-pulse"
              style={{
                boxShadow: `inset 0 0 20px ${color === 'cyan' ? '#06b6d4' : color === 'purple' ? '#8b5cf6' : color === 'green' ? '#10b981' : color === 'orange' ? '#f97316' : color === 'blue' ? '#3b82f6' : color === 'red' ? '#ef4444' : '#64748b'}40`
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Corridor: React.FC<{
  start: { x: number; y: number };
  end: { x: number; y: number };
  className?: string;
}> = ({ start, end, className = '' }) => {
  const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;

  return (
    <div
      className={`absolute bg-cyan-400/20 ${className}`}
      style={{
        left: `${start.x}%`,
        top: `${start.y}%`,
        width: `${length}%`,
        height: '3px',
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
        zIndex: 1,
      }}
    />
  );
};

export const SpaceshipDashboard: React.FC<SpaceshipDashboardProps> = ({
  items,
  categories,
  reminders,
  onViewChange,
  onItemClick,
  onSignOut,
  user
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movingCrewmate, setMovingCrewmate] = useState<string | null>(null);

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

  const handleRoomClick = (view: string) => {
    setMovingCrewmate(view);
    setTimeout(() => {
      onViewChange(view);
      setMovingCrewmate(null);
    }, 500);
  };

  // Define spaceship rooms layout
  const rooms = [
    // Upper section
    {
      id: 'add',
      name: 'Add New Item',
      icon: <Plus className="w-6 h-6" />,
      position: { x: 42, y: 8 },
      size: { width: 120, height: 80 },
      color: 'cyan',
      crewmateColor: 'green',
      onClick: () => handleRoomClick('add')
    },
    
    // Left wing
    {
      id: 'visual-map',
      name: 'Visual Maps',
      icon: <Map className="w-5 h-5" />,
      position: { x: 8, y: 25 },
      size: { width: 100, height: 70 },
      color: 'blue',
      crewmateColor: 'cyan',
      onClick: () => handleRoomClick('visual-map')
    },
    {
      id: 'virtual-drawers',
      name: 'Virtual Drawers',
      icon: <Archive className="w-5 h-5" />,
      position: { x: 8, y: 45 },
      size: { width: 100, height: 70 },
      color: 'purple',
      crewmateColor: 'purple',
      onClick: () => handleRoomClick('virtual-drawers')
    },
    
    // Center section
    {
      id: 'inventory',
      name: 'Full Inventory',
      icon: <Package className="w-6 h-6" />,
      position: { x: 35, y: 35 },
      size: { width: 130, height: 90 },
      color: 'cyan',
      crewmateColor: 'blue',
      onClick: () => handleRoomClick('inventory')
    },
    
    // Right wing
    {
      id: 'groups',
      name: 'Item Groups',
      icon: <Users className="w-5 h-5" />,
      position: { x: 75, y: 25 },
      size: { width: 100, height: 70 },
      color: 'green',
      crewmateColor: 'green',
      onClick: () => handleRoomClick('groups')
    },
    {
      id: 'virtual-tour',
      name: 'Virtual Tour',
      icon: <Route className="w-5 h-5" />,
      position: { x: 75, y: 45 },
      size: { width: 100, height: 70 },
      color: 'orange',
      crewmateColor: 'yellow',
      onClick: () => handleRoomClick('virtual-tour')
    },
    
    // Lower section
    {
      id: 'photo-search',
      name: 'Photo Search',
      icon: <Camera className="w-5 h-5" />,
      position: { x: 15, y: 65 },
      size: { width: 100, height: 70 },
      color: 'purple',
      crewmateColor: 'pink',
      onClick: () => handleRoomClick('photo-search')
    },
    {
      id: 'reminders',
      name: 'Reminders',
      icon: <Bell className="w-5 h-5" />,
      position: { x: 35, y: 70 },
      size: { width: 100, height: 70 },
      color: 'orange',
      crewmateColor: 'orange',
      onClick: () => handleRoomClick('reminders'),
      badge: upcomingReminders.length
    },
    {
      id: 'history',
      name: 'History',
      icon: <History className="w-5 h-5" />,
      position: { x: 55, y: 70 },
      size: { width: 100, height: 70 },
      color: 'blue',
      crewmateColor: 'blue',
      onClick: () => handleRoomClick('history')
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      position: { x: 75, y: 65 },
      size: { width: 100, height: 70 },
      color: 'red',
      crewmateColor: 'red',
      onClick: () => handleRoomClick('settings')
    }
  ];

  // Define corridors connecting rooms
  const corridors = [
    // Main central corridor
    { start: { x: 50, y: 15 }, end: { x: 50, y: 85 } },
    // Horizontal corridors
    { start: { x: 20, y: 40 }, end: { x: 80, y: 40 } },
    { start: { x: 20, y: 75 }, end: { x: 80, y: 75 } },
    // Connecting corridors
    { start: { x: 35, y: 40 }, end: { x: 35, y: 75 } },
    { start: { x: 65, y: 40 }, end: { x: 65, y: 75 } },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle starfield background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 p-4">
        {/* Header */}
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

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
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
        </div>

        {/* Upcoming Reminders Alert */}
        {upcomingReminders.length > 0 && (
          <div className="max-w-md mx-auto mb-6">
            <SpacePanel variant="warning" className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-orange-400" />
                <h3 className="font-semibold text-orange-300">Upcoming Expiries!</h3>
                <CrewmateIcon color="orange" size="sm" animate />
              </div>
              <p className="text-sm text-orange-200 mb-2">
                {upcomingReminders.length} item{upcomingReminders.length > 1 ? 's' : ''} expiring soon
              </p>
              <SpaceButton
                onClick={() => handleRoomClick('reminders')}
                variant="danger"
                size="sm"
              >
                View Reminders →
              </SpaceButton>
            </SpacePanel>
          </div>
        )}

        {/* Spaceship Floor Plan */}
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full h-96 bg-gray-900/30 rounded-2xl border border-cyan-400/20 overflow-hidden">
            {/* Spaceship outline */}
            <div className="absolute inset-4 border-2 border-cyan-400/30 rounded-full" style={{
              clipPath: 'polygon(50% 0%, 85% 25%, 85% 75%, 50% 100%, 15% 75%, 15% 25%)'
            }} />

            {/* Corridors */}
            {corridors.map((corridor, index) => (
              <Corridor
                key={index}
                start={corridor.start}
                end={corridor.end}
                className="opacity-30"
              />
            ))}

            {/* Rooms */}
            {rooms.map((room) => (
              <Room
                key={room.id}
                {...room}
                badge={room.id === 'reminders' ? upcomingReminders.length : undefined}
              />
            ))}

            {/* Moving crewmate animation */}
            {movingCrewmate && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="animate-ping">
                  <CrewmateIcon color="cyan" size="md" animate />
                </div>
              </div>
            )}

            {/* Floating decorative crewmates */}
            <FloatingCrewmate color="blue" className="top-4 left-8" />
            <FloatingCrewmate color="green" className="top-8 right-12" />
            <FloatingCrewmate color="yellow" className="bottom-8 left-16" />
            <FloatingCrewmate color="purple" className="bottom-4 right-8" />
          </div>

          {/* Help button below the ship */}
          <div className="text-center mt-6">
            <SpaceButton
              onClick={() => handleRoomClick('help')}
              variant="primary"
              className="px-6 py-3"
            >
              <HelpCircle className="w-5 h-5" />
              Help & Guide
              <CrewmateIcon color="cyan" size="sm" />
            </SpaceButton>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="max-w-md mx-auto mt-6">
            <SpacePanel variant="control" className="p-4">
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
                        onClick={() => handleRoomClick('inventory')}
                        className="text-cyan-400 hover:text-cyan-300 ml-1"
                      >
                        View all →
                      </button>
                    </p>
                  )}
                </div>
              )}
            </SpacePanel>
          </div>
        )}

        {/* Mission Stats */}
        {items.length > 0 && !searchTerm && (
          <div className="max-w-md mx-auto mt-6">
            <SpacePanel variant="default" className="p-4">
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
          </div>
        )}
      </div>
    </div>
  );
};