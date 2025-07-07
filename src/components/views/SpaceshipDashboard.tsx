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
  shape?: 'rectangle' | 'circle' | 'hexagon';
}

const Room: React.FC<RoomProps> = ({ 
  name, 
  icon, 
  position, 
  size, 
  color, 
  onClick, 
  badge,
  crewmateColor,
  shape = 'rectangle'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getShapeClasses = () => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'hexagon':
        return 'rounded-lg transform rotate-45';
      default:
        return 'rounded-lg';
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case 'cyan': return isHovered ? 'border-cyan-400' : 'border-cyan-600/50';
      case 'purple': return isHovered ? 'border-purple-400' : 'border-purple-600/50';
      case 'green': return isHovered ? 'border-green-400' : 'border-green-600/50';
      case 'orange': return isHovered ? 'border-orange-400' : 'border-orange-600/50';
      case 'blue': return isHovered ? 'border-blue-400' : 'border-blue-600/50';
      case 'red': return isHovered ? 'border-red-400' : 'border-red-600/50';
      case 'yellow': return isHovered ? 'border-yellow-400' : 'border-yellow-600/50';
      default: return isHovered ? 'border-gray-400' : 'border-gray-600/50';
    }
  };

  const getBgColor = () => {
    switch (color) {
      case 'cyan': return isHovered ? 'bg-cyan-500/30' : 'bg-cyan-900/20';
      case 'purple': return isHovered ? 'bg-purple-500/30' : 'bg-purple-900/20';
      case 'green': return isHovered ? 'bg-green-500/30' : 'bg-green-900/20';
      case 'orange': return isHovered ? 'bg-orange-500/30' : 'bg-orange-900/20';
      case 'blue': return isHovered ? 'bg-blue-500/30' : 'bg-blue-900/20';
      case 'red': return isHovered ? 'bg-red-500/30' : 'bg-red-900/20';
      case 'yellow': return isHovered ? 'bg-yellow-500/30' : 'bg-yellow-900/20';
      default: return isHovered ? 'bg-gray-500/30' : 'bg-gray-900/20';
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'cyan': return 'text-cyan-400';
      case 'purple': return 'text-purple-400';
      case 'green': return 'text-green-400';
      case 'orange': return 'text-orange-400';
      case 'blue': return 'text-blue-400';
      case 'red': return 'text-red-400';
      case 'yellow': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

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
        className={`w-full h-full border-2 transition-all duration-300 ${getShapeClasses()} ${getBorderColor()} ${getBgColor()}`}
      >
        {/* Room content */}
        <div className={`flex flex-col items-center justify-center h-full p-2 relative ${shape === 'hexagon' ? 'transform -rotate-45' : ''}`}>
          {/* Icon */}
          <div className={getTextColor()}>
            {icon}
          </div>
          
          {/* Room name */}
          <span className={`text-xs font-medium text-center leading-tight mt-1 ${getTextColor()}`}>
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
            <div className={`absolute inset-0 ${getShapeClasses()} animate-pulse border-2 ${getBorderColor()}`} />
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
      className={`absolute bg-gray-600/30 ${className}`}
      style={{
        left: `${start.x}%`,
        top: `${start.y}%`,
        width: `${length}%`,
        height: '4px',
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

  // Define spaceship rooms layout - scattered like Among Us map
  const rooms = [
    // Upper Engine (Add Item)
    {
      id: 'add',
      name: 'Add New Item',
      icon: <Plus className="w-6 h-6" />,
      position: { x: 15, y: 8 },
      size: { width: 120, height: 80 },
      color: 'cyan',
      crewmateColor: 'green',
      onClick: () => handleRoomClick('add'),
      shape: 'rectangle' as const
    },
    
    // Upper Left - Visual Maps (like Weapons)
    {
      id: 'visual-map',
      name: 'Visual Maps',
      icon: <Map className="w-5 h-5" />,
      position: { x: 5, y: 25 },
      size: { width: 100, height: 70 },
      color: 'blue',
      crewmateColor: 'cyan',
      onClick: () => handleRoomClick('visual-map'),
      shape: 'rectangle' as const
    },
    
    // Left side - Virtual Drawers (like Storage)
    {
      id: 'virtual-drawers',
      name: 'Virtual Drawers',
      icon: <Archive className="w-5 h-5" />,
      position: { x: 8, y: 50 },
      size: { width: 100, height: 70 },
      color: 'purple',
      crewmateColor: 'purple',
      onClick: () => handleRoomClick('virtual-drawers'),
      shape: 'rectangle' as const
    },
    
    // Center - Main Inventory (like Cafeteria)
    {
      id: 'inventory',
      name: 'Full Inventory',
      icon: <Package className="w-7 h-7" />,
      position: { x: 35, y: 35 },
      size: { width: 140, height: 100 },
      color: 'cyan',
      crewmateColor: 'blue',
      onClick: () => handleRoomClick('inventory'),
      shape: 'hexagon' as const
    },
    
    // Upper Right - Groups (like Medbay)
    {
      id: 'groups',
      name: 'Item Groups',
      icon: <Users className="w-5 h-5" />,
      position: { x: 75, y: 20 },
      size: { width: 100, height: 70 },
      color: 'green',
      crewmateColor: 'green',
      onClick: () => handleRoomClick('groups'),
      shape: 'circle' as const
    },
    
    // Right side - Virtual Tour (like Navigation)
    {
      id: 'virtual-tour',
      name: 'Virtual Tour',
      icon: <Route className="w-5 h-5" />,
      position: { x: 78, y: 45 },
      size: { width: 100, height: 70 },
      color: 'orange',
      crewmateColor: 'yellow',
      onClick: () => handleRoomClick('virtual-tour'),
      shape: 'rectangle' as const
    },
    
    // Lower Left - Photo Search (like Electrical)
    {
      id: 'photo-search',
      name: 'Photo Search',
      icon: <Camera className="w-5 h-5" />,
      position: { x: 12, y: 75 },
      size: { width: 100, height: 70 },
      color: 'yellow',
      crewmateColor: 'pink',
      onClick: () => handleRoomClick('photo-search'),
      shape: 'rectangle' as const
    },
    
    // Lower Center - Reminders (like Admin)
    {
      id: 'reminders',
      name: 'Reminders',
      icon: <Bell className="w-5 h-5" />,
      position: { x: 40, y: 75 },
      size: { width: 100, height: 70 },
      color: 'orange',
      crewmateColor: 'orange',
      onClick: () => handleRoomClick('reminders'),
      badge: upcomingReminders.length,
      shape: 'rectangle' as const
    },
    
    // Lower Right - History (like Security)
    {
      id: 'history',
      name: 'History',
      icon: <History className="w-5 h-5" />,
      position: { x: 68, y: 75 },
      size: { width: 100, height: 70 },
      color: 'blue',
      crewmateColor: 'blue',
      onClick: () => handleRoomClick('history'),
      shape: 'rectangle' as const
    },
    
    // Lower Engine - Settings
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      position: { x: 75, y: 8 },
      size: { width: 100, height: 70 },
      color: 'red',
      crewmateColor: 'red',
      onClick: () => handleRoomClick('settings'),
      shape: 'rectangle' as const
    }
  ];

  // Define corridors connecting rooms like Among Us hallways
  const corridors = [
    // Main horizontal corridor (top)
    { start: { x: 25, y: 20 }, end: { x: 75, y: 20 } },
    // Main horizontal corridor (middle)
    { start: { x: 15, y: 50 }, end: { x: 85, y: 50 } },
    // Main horizontal corridor (bottom)
    { start: { x: 20, y: 80 }, end: { x: 80, y: 80 } },
    // Vertical connectors
    { start: { x: 50, y: 20 }, end: { x: 50, y: 80 } },
    { start: { x: 25, y: 20 }, end: { x: 25, y: 50 } },
    { start: { x: 75, y: 20 }, end: { x: 75, y: 80 } },
    // Diagonal connectors
    { start: { x: 35, y: 35 }, end: { x: 25, y: 50 } },
    { start: { x: 55, y: 35 }, end: { x: 75, y: 50 } },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle starfield background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
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

        {/* Spaceship Floor Plan - Among Us Style */}
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-[500px] bg-gray-900/30 rounded-2xl border border-cyan-400/20 overflow-hidden">
            {/* Spaceship outline - more angular like Among Us */}
            <div 
              className="absolute inset-8 border-2 border-gray-600/40 bg-gray-800/20"
              style={{
                clipPath: 'polygon(20% 0%, 80% 0%, 95% 15%, 95% 85%, 80% 100%, 20% 100%, 5% 85%, 5% 15%)'
              }}
            />

            {/* Corridors - Among Us style hallways */}
            {corridors.map((corridor, index) => (
              <Corridor
                key={index}
                start={corridor.start}
                end={corridor.end}
                className="opacity-40"
              />
            ))}

            {/* Rooms scattered like Among Us map */}
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
            <FloatingCrewmate color="blue" className="top-6 left-12" />
            <FloatingCrewmate color="green" className="top-12 right-16" />
            <FloatingCrewmate color="yellow" className="bottom-12 left-20" />
            <FloatingCrewmate color="purple" className="bottom-6 right-12" />
            <FloatingCrewmate color="red" className="top-1/2 left-6" />
            <FloatingCrewmate color="orange" className="top-1/2 right-6" />
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