import React, { useState, useRef } from 'react';
import { Route, ArrowRight, ArrowLeft, Home, LogOut, Package, MapPin, Eye, Plus, Upload, Save, X, Map } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { StarField } from '../ui/StarField';
import type { Item } from '../SpaceTracker';

interface VirtualTourViewProps {
  items: Item[];
  onBack: () => void;
  onSignOut: () => void;
  user: User | null;
}

interface Room {
  id: string;
  name: string;
  description: string;
  image?: string;
  zones: Zone[];
}

interface Zone {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  items: Item[];
}

interface VisualMap {
  id?: string;
  user_id: string;
  name: string;
  image_url: string;
  markers: any[];
  created_at?: string;
  updated_at?: string;
}

export const VirtualTourView: React.FC<VirtualTourViewProps> = ({
  items,
  onBack,
  onSignOut,
  user
}) => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [tourHistory, setTourHistory] = useState<string[]>([]);
  const [showCreateMap, setShowCreateMap] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock rooms data - in a real implementation, this would come from the database
  const rooms: Room[] = [
    {
      id: 'kitchen',
      name: 'Kitchen',
      description: 'The heart of the home where culinary magic happens',
      zones: [
        {
          id: 'counter',
          name: 'Kitchen Counter',
          description: 'Main preparation area',
          x: 30,
          y: 40,
          items: items.filter(item => item.location.toLowerCase().includes('kitchen') && item.location.toLowerCase().includes('counter'))
        },
        {
          id: 'cabinets',
          name: 'Upper Cabinets',
          description: 'Storage for dishes and food',
          x: 60,
          y: 20,
          items: items.filter(item => item.location.toLowerCase().includes('kitchen') && item.location.toLowerCase().includes('cabinet'))
        },
        {
          id: 'drawers',
          name: 'Kitchen Drawers',
          description: 'Utensils and small tools',
          x: 45,
          y: 60,
          items: items.filter(item => item.location.toLowerCase().includes('kitchen') && item.location.toLowerCase().includes('drawer'))
        }
      ]
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      description: 'Personal sanctuary for rest and relaxation',
      zones: [
        {
          id: 'closet',
          name: 'Closet',
          description: 'Clothing and personal items storage',
          x: 20,
          y: 30,
          items: items.filter(item => item.location.toLowerCase().includes('bedroom') && item.location.toLowerCase().includes('closet'))
        },
        {
          id: 'nightstand',
          name: 'Nightstand',
          description: 'Bedside essentials',
          x: 70,
          y: 50,
          items: items.filter(item => item.location.toLowerCase().includes('bedroom') && item.location.toLowerCase().includes('nightstand'))
        },
        {
          id: 'dresser',
          name: 'Dresser',
          description: 'Clothing and accessories',
          x: 50,
          y: 20,
          items: items.filter(item => item.location.toLowerCase().includes('bedroom') && item.location.toLowerCase().includes('dresser'))
        }
      ]
    },
    {
      id: 'office',
      name: 'Office',
      description: 'Productive workspace for work and creativity',
      zones: [
        {
          id: 'desk',
          name: 'Desk Area',
          description: 'Main work surface',
          x: 40,
          y: 45,
          items: items.filter(item => item.location.toLowerCase().includes('office') && item.location.toLowerCase().includes('desk'))
        },
        {
          id: 'bookshelf',
          name: 'Bookshelf',
          description: 'Books and reference materials',
          x: 20,
          y: 25,
          items: items.filter(item => item.location.toLowerCase().includes('office') && item.location.toLowerCase().includes('shelf'))
        },
        {
          id: 'filing',
          name: 'Filing Cabinet',
          description: 'Documents and paperwork',
          x: 70,
          y: 30,
          items: items.filter(item => item.location.toLowerCase().includes('office') && item.location.toLowerCase().includes('filing'))
        }
      ]
    },
    {
      id: 'garage',
      name: 'Garage',
      description: 'Storage for tools, equipment, and vehicles',
      zones: [
        {
          id: 'workbench',
          name: 'Workbench',
          description: 'Tool storage and workspace',
          x: 30,
          y: 60,
          items: items.filter(item => item.location.toLowerCase().includes('garage') && item.location.toLowerCase().includes('workbench'))
        },
        {
          id: 'shelving',
          name: 'Storage Shelves',
          description: 'General storage area',
          x: 60,
          y: 40,
          items: items.filter(item => item.location.toLowerCase().includes('garage') && item.location.toLowerCase().includes('shelf'))
        },
        {
          id: 'toolbox',
          name: 'Tool Box',
          description: 'Organized tool storage',
          x: 45,
          y: 70,
          items: items.filter(item => item.location.toLowerCase().includes('garage') && item.location.toLowerCase().includes('tool'))
        }
      ]
    }
  ];

  const navigateToRoom = (roomId: string) => {
    if (currentRoom) {
      setTourHistory(prev => [...prev, currentRoom]);
    }
    setCurrentRoom(roomId);
    setCurrentZone(null);
  };

  const navigateToZone = (zoneId: string) => {
    setCurrentZone(zoneId);
  };

  const goBack = () => {
    if (currentZone) {
      setCurrentZone(null);
    } else if (currentRoom) {
      const lastRoom = tourHistory[tourHistory.length - 1];
      if (lastRoom) {
        setTourHistory(prev => prev.slice(0, -1));
        setCurrentRoom(lastRoom);
      } else {
        setCurrentRoom(null);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        createVisualMap(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const createVisualMap = async (imageUrl: string) => {
    if (!user || !newMapName.trim()) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('visual_maps')
        .insert([
          {
            user_id: user.id,
            name: newMapName.trim(),
            image_url: imageUrl,
            markers: [],
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating visual map:', error);
        alert('Error creating visual map. Please try again.');
        return;
      }

      alert(`Visual map "${newMapName}" created successfully! You can now access it from the Visual Maps section.`);
      setNewMapName('');
      setShowCreateMap(false);
    } catch (error) {
      console.error('Error creating visual map:', error);
      alert('Error creating visual map. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentRoom = () => rooms.find(r => r.id === currentRoom);
  const getCurrentZone = () => {
    const room = getCurrentRoom();
    return room?.zones.find(z => z.id === currentZone);
  };

  // Room overview
  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white relative">
        <StarField />
        
        <div className="relative z-10 p-4 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-gray-500/30"
            >
              ← Back to Command Center
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2 text-slate-400">
              <Route className="w-6 h-6" />
              Virtual Tour
            </h1>
            <button
              onClick={onSignOut}
              className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/30 transition-colors border border-red-500/50"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>

          {/* Description */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30 mb-6">
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">Take a Virtual Walk</h2>
            <p className="text-gray-300 text-sm">
              Explore your spaces virtually! Click on rooms to enter them, then explore zones within each room 
              to see what items are stored there. Like Google Street View for your home inventory.
            </p>
          </div>

          {/* Create Visual Map Section */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                <Map className="w-5 h-5" />
                Create Visual House Map
              </h2>
              <button
                onClick={() => setShowCreateMap(!showCreateMap)}
                className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 transition-colors border border-blue-500/50"
              >
                <Plus className="w-4 h-4 text-blue-400" />
              </button>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              Upload a floor plan, house layout, or room diagram to create an interactive visual map. 
              You can then place item markers directly on your house layout for precise location tracking.
            </p>

            {showCreateMap && (
              <div className="space-y-4 p-4 bg-blue-900/10 rounded-lg border border-blue-500/30">
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-300">
                    Map Name
                  </label>
                  <input
                    type="text"
                    value={newMapName}
                    onChange={(e) => setNewMapName(e.target.value)}
                    placeholder="e.g., House Floor Plan, Living Room Layout"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-300">
                    Upload House Layout
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!newMapName.trim() || loading}
                    className="w-full p-4 border-2 border-dashed border-blue-600/50 rounded-lg hover:border-blue-400/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-3 text-blue-300 hover:text-blue-200"
                  >
                    <Upload className="w-8 h-8" />
                    <div className="text-center">
                      <p className="font-medium">Click to upload floor plan or house layout</p>
                      <p className="text-sm text-gray-400">JPG, PNG, or other image formats</p>
                    </div>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCreateMap(false);
                      setNewMapName('');
                    }}
                    className="flex-1 p-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {loading && (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-blue-300 text-sm">Creating visual map...</p>
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-gray-400 mt-3">
              💡 Tip: After creating a visual map, go to "Visual Maps" section to add item markers to your house layout
            </div>
          </div>

          {/* Room Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-400 mb-4">Choose a Room to Explore</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {rooms.map((room) => {
                const roomItemCount = room.zones.reduce((sum, zone) => sum + zone.items.length, 0);
                
                return (
                  <button
                    key={room.id}
                    onClick={() => navigateToRoom(room.id)}
                    className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 border border-gray-500/30 hover:border-cyan-400/50 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                          <Home className="w-8 h-8 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold text-cyan-300 mb-1">{room.name}</h3>
                          <p className="text-sm text-gray-400 mb-2">{room.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{room.zones.length} zones</span>
                            <span>{roomItemCount} items</span>
                          </div>
                        </div>
                      </div>
                      
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tour Stats */}
          <div className="mt-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Tour Overview</h3>
            <div className="text-sm text-gray-300">
              <p>🏠 Total Rooms: {rooms.length}</p>
              <p>📍 Total Zones: {rooms.reduce((sum, room) => sum + room.zones.length, 0)}</p>
              <p>📦 Items to Discover: {items.length}</p>
              <p>🗺️ Ready for Virtual Exploration!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const room = getCurrentRoom();
  const zone = getCurrentZone();

  // Zone detail view
  if (currentZone && zone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white relative">
        <StarField />
        
        <div className="relative z-10 p-4 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <button
              onClick={goBack}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-gray-500/30 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {room?.name}
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2 text-slate-400">
              <Eye className="w-6 h-6" />
              {zone.name}
            </h1>
            <button
              onClick={onSignOut}
              className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/30 transition-colors border border-red-500/50"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>

          {/* Zone Info */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30 mb-6">
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">{zone.name}</h2>
            <p className="text-gray-300 text-sm mb-3">{zone.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {zone.items.length} items stored here
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {room?.name} → {zone.name}
              </span>
            </div>
          </div>

          {/* Items in Zone */}
          <div className="space-y-4">
            {zone.items.length === 0 ? (
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-8 border border-gray-500/30 text-center">
                <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No items found in this zone.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Items might be stored elsewhere or not yet cataloged.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-400">Items in {zone.name}</h3>
                {zone.items.map((item) => (
                  <div key={item.id} className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30">
                    <div className="flex items-center gap-4">
                      {item.item_image_url ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                          <img src={item.item_image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{item.category.icon}</span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-cyan-300 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">{item.location}</p>
                        {item.description && (
                          <p className="text-sm text-gray-300 mb-2">{item.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-700 px-2 py-1 rounded">{item.category.name}</span>
                          {item.is_starred && <span className="text-yellow-400">⭐ Starred</span>}
                          {item.has_pin && <span className="text-red-400">🔒 Secured</span>}
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-cyan-600/30 rounded-full text-xs text-cyan-200">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Room view with zones
  if (room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 text-white relative">
        <StarField />
        
        <div className="relative z-10 p-4 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <button
              onClick={goBack}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-gray-500/30 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              All Rooms
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2 text-slate-400">
              <Home className="w-6 h-6" />
              {room.name}
            </h1>
            <button
              onClick={onSignOut}
              className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/30 transition-colors border border-red-500/50"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>

          {/* Room Info */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30 mb-6">
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">{room.name}</h2>
            <p className="text-gray-300 text-sm">{room.description}</p>
          </div>

          {/* Room Map with Zones */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-500/30 mb-6">
            <h3 className="text-lg font-semibold text-slate-400 mb-4">Room Layout</h3>
            <div className="relative w-full h-64 bg-gray-800/50 rounded-lg border border-gray-600 overflow-hidden">
              {/* Room background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/30 to-gray-800/30" />
              
              {/* Zone markers */}
              {room.zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => navigateToZone(zone.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                >
                  <div className="w-8 h-8 bg-cyan-500 rounded-full border-2 border-white shadow-lg group-hover:bg-cyan-400 transition-colors flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {zone.name}
                    <br />
                    {zone.items.length} items
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Click on the blue markers to explore different zones in this room
            </p>
          </div>

          {/* Zones List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-400">Zones in {room.name}</h3>
            
            {room.zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => navigateToZone(zone.id)}
                className="w-full bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30 hover:border-cyan-400/50 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-cyan-300 mb-1">{zone.name}</h4>
                      <p className="text-sm text-gray-400 mb-1">{zone.description}</p>
                      <p className="text-xs text-gray-500">{zone.items.length} items stored</p>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};