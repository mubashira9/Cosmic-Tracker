import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Circle, Text, Group, Rect } from 'react-konva';
import { Map, Upload, Save, X, Plus, Trash2, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Package, ArrowLeft } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemedBackground } from '../ui/ThemedBackground';
import type { Item } from '../SpaceTracker';

interface VisualMapViewProps {
  items: Item[];
  onBack: () => void;
  onSignOut: () => void;
  user: User | null;
  selectedItem?: Item | null;
  onSelectedItemChange?: (item: Item | null) => void;
}

interface ItemMarker {
  id: string;
  itemId: string;
  x: number;
  y: number;
  visible: boolean;
}

interface MapData {
  id?: string;
  user_id: string;
  name: string;
  image_url: string;
  markers: ItemMarker[];
  created_at?: string;
  updated_at?: string;
}

export const VisualMapView: React.FC<VisualMapViewProps> = ({
  items,
  onBack,
  onSignOut,
  user,
  selectedItem,
  onSelectedItemChange
}) => {
  const { currentTheme } = useTheme();
  const [maps, setMaps] = useState<MapData[]>([]);
  const [currentMap, setCurrentMap] = useState<MapData | null>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [markers, setMarkers] = useState<ItemMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [showAddMarker, setShowAddMarker] = useState(false);
  const [newMarkerItem, setNewMarkerItem] = useState('');
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [draggedMarker, setDraggedMarker] = useState<string | null>(null);
  const [showMapsList, setShowMapsList] = useState(false);
  
  const stageRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      loadMaps();
    }
  }, [user]);

  useEffect(() => {
    if (currentMap) {
      loadMapImage();
      setMarkers(currentMap.markers || []);
    }
  }, [currentMap]);

  // Auto-select item for mapping if coming from inventory
  useEffect(() => {
    if (selectedItem && !newMarkerItem) {
      setNewMarkerItem(selectedItem.id);
      setShowAddMarker(true);
    }
  }, [selectedItem]);

  const loadMaps = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('visual_maps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading maps:', error);
        return;
      }

      setMaps(data || []);
      if (data && data.length > 0 && !currentMap) {
        setCurrentMap(data[0]);
      }
    } catch (error) {
      console.error('Error loading maps:', error);
    }
  };

  const loadMapImage = () => {
    if (!currentMap?.image_url) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setMapImage(img);
      // Reset zoom and position when loading new map
      setScale(1);
      setStagePos({ x: 0, y: 0 });
    };
    img.src = currentMap.image_url;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        createNewMap(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const createNewMap = async (imageUrl: string) => {
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
        console.error('Error creating map:', error);
        alert('Error creating map. Please try again.');
        return;
      }

      setMaps(prev => [data, ...prev]);
      setCurrentMap(data);
      setNewMapName('');
      setShowUploadForm(false);
    } catch (error) {
      console.error('Error creating map:', error);
      alert('Error creating map. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveMarkers = async () => {
    if (!currentMap || !user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('visual_maps')
        .update({
          markers: markers,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentMap.id);

      if (error) {
        console.error('Error saving markers:', error);
        alert('Error saving markers. Please try again.');
        return;
      }

      // Update local state
      setCurrentMap(prev => prev ? { ...prev, markers } : null);
      setMaps(prev => prev.map(map => 
        map.id === currentMap.id ? { ...map, markers } : map
      ));

      alert('Markers saved successfully!');
    } catch (error) {
      console.error('Error saving markers:', error);
      alert('Error saving markers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addMarker = (x: number, y: number) => {
    if (!newMarkerItem) return;

    const newMarker: ItemMarker = {
      id: `marker_${Date.now()}`,
      itemId: newMarkerItem,
      x,
      y,
      visible: true,
    };

    setMarkers(prev => [...prev, newMarker]);
    setNewMarkerItem('');
    setShowAddMarker(false);
    
    // Clear selected item after placing marker
    if (onSelectedItemChange) {
      onSelectedItemChange(null);
    }
  };

  const removeMarker = (markerId: string) => {
    setMarkers(prev => prev.filter(marker => marker.id !== markerId));
    setSelectedMarker(null);
  };

  const toggleMarkerVisibility = (markerId: string) => {
    setMarkers(prev => prev.map(marker =>
      marker.id === markerId ? { ...marker, visible: !marker.visible } : marker
    ));
  };

  const handleMarkerDragEnd = (markerId: string, e: any) => {
    const newX = e.target.x();
    const newY = e.target.y();
    
    setMarkers(prev => prev.map(marker =>
      marker.id === markerId ? { ...marker, x: newX, y: newY } : marker
    ));
    setDraggedMarker(null);
  };

  const handleStageClick = (e: any) => {
    // If we're in add marker mode, add a marker at click position
    if (showAddMarker && newMarkerItem) {
      const pos = e.target.getStage().getPointerPosition();
      const stageBox = e.target.getStage().container().getBoundingClientRect();
      const x = (pos.x - stagePos.x) / scale;
      const y = (pos.y - stagePos.y) / scale;
      addMarker(x, y);
      return;
    }

    // Otherwise, deselect marker if clicking on empty space
    if (e.target === e.target.getStage()) {
      setSelectedMarker(null);
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    
    // Limit zoom
    const clampedScale = Math.max(0.1, Math.min(5, newScale));
    
    setScale(clampedScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  };

  const resetView = () => {
    setScale(1);
    setStagePos({ x: 0, y: 0 });
  };

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  const getItemIcon = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.category.icon : '📦';
  };

  const availableItems = items.filter(item => 
    !markers.some(marker => marker.itemId === item.id)
  );

  if (!user) return null;

  // Show maps list view
  if (showMapsList || maps.length === 0) {
    return (
      <ThemedBackground>
        <div className="p-4 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <button
              onClick={onBack}
              className={`p-2 rounded-full bg-${currentTheme.colors.secondary}/20 hover:bg-${currentTheme.colors.secondary}/30 transition-colors border border-${currentTheme.colors.border}`}
            >
              ← Back to Command Center
            </button>
            <h1 className={`text-xl font-bold flex items-center gap-2 text-${currentTheme.colors.primary}`}>
              <Map className="w-6 h-6" />
              Visual Maps
            </h1>
            <button
              onClick={onSignOut}
              className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/30 transition-colors border border-red-500/50"
              title="Sign Out"
            >
              <X className="w-5 h-5 text-red-400" />
            </button>
          </div>

          {/* Create New Map Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowUploadForm(true)}
              className={`w-full p-4 ${currentTheme.gradients.button} rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 text-white`}
            >
              <Upload className="w-5 h-5" />
              Create New Visual Map
            </button>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <div className={`${currentTheme.gradients.card} rounded-xl p-4 border border-${currentTheme.colors.primary}/50 mb-6`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold text-${currentTheme.colors.primary}`}>Create New Map</h3>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    setNewMapName('');
                  }}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 text-${currentTheme.colors.primary}`}>
                    Map Name
                  </label>
                  <input
                    type="text"
                    value={newMapName}
                    onChange={(e) => setNewMapName(e.target.value)}
                    placeholder="e.g., Living Room Floor Plan"
                    className={`w-full p-2 bg-gray-800 border border-${currentTheme.colors.border} rounded-lg text-${currentTheme.colors.text} placeholder-gray-400 focus:border-${currentTheme.colors.primary} focus:outline-none`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 text-${currentTheme.colors.primary}`}>
                    Map Image
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
                    disabled={!newMapName.trim()}
                    className={`w-full p-3 border-2 border-dashed border-${currentTheme.colors.border} rounded-lg hover:border-${currentTheme.colors.primary}/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-${currentTheme.colors.textSecondary}`}
                  >
                    <Upload className="w-5 h-5" />
                    Click to upload floor plan, shelf diagram, or storage map
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Maps List */}
          <div className="space-y-4">
            {maps.length === 0 ? (
              <div className={`${currentTheme.gradients.card} rounded-xl p-12 border border-${currentTheme.colors.border} text-center`}>
                <Map className={`w-16 h-16 text-${currentTheme.colors.textSecondary} mx-auto mb-4`} />
                <p className={`text-${currentTheme.colors.textSecondary} mb-4`}>
                  No visual maps created yet. Upload your first floor plan or storage diagram to get started!
                </p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className={`px-6 py-3 ${currentTheme.gradients.button} rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 text-white mx-auto`}
                >
                  <Upload className="w-5 h-5" />
                  Upload Your First Map
                </button>
              </div>
            ) : (
              <>
                <h2 className={`text-lg font-semibold text-${currentTheme.colors.primary} mb-4`}>
                  Your Visual Maps ({maps.length})
                </h2>
                {maps.map((map) => (
                  <div
                    key={map.id}
                    className={`${currentTheme.gradients.card} rounded-xl p-4 border border-${currentTheme.colors.border} hover:border-${currentTheme.colors.primary}/50 transition-all cursor-pointer`}
                    onClick={() => {
                      setCurrentMap(map);
                      setShowMapsList(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {map.image_url && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                          <img src={map.image_url} alt={map.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className={`font-semibold text-${currentTheme.colors.primary} mb-1`}>
                          {map.name}
                        </h3>
                        <p className={`text-sm text-${currentTheme.colors.textSecondary}`}>
                          {map.markers?.length || 0} item markers
                        </p>
                        <p className={`text-xs text-${currentTheme.colors.textSecondary}`}>
                          Created: {new Date(map.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ArrowLeft className={`w-5 h-5 text-${currentTheme.colors.textSecondary} transform rotate-180`} />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground>
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <button
            onClick={() => setShowMapsList(true)}
            className={`p-2 rounded-full bg-${currentTheme.colors.secondary}/20 hover:bg-${currentTheme.colors.secondary}/30 transition-colors border border-${currentTheme.colors.border}`}
          >
            ← Back to Maps
          </button>
          <h1 className={`text-xl font-bold flex items-center gap-2 text-${currentTheme.colors.primary}`}>
            <Map className="w-6 h-6" />
            {currentMap?.name || 'Visual Map'}
          </h1>
          <button
            onClick={onSignOut}
            className="p-2 rounded-full bg-red-600/20 hover:bg-red-600/30 transition-colors border border-red-500/50"
            title="Sign Out"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>

        {/* Map Controls */}
        {currentMap && (
          <div className={`${currentTheme.gradients.card} rounded-xl p-4 border border-${currentTheme.colors.border} mb-6`}>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAddMarker(!showAddMarker)}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showAddMarker 
                    ? `bg-${currentTheme.colors.primary}/20 text-${currentTheme.colors.primary} border border-${currentTheme.colors.primary}/50`
                    : `bg-gray-700 text-gray-300 hover:bg-gray-600`
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Marker
              </button>

              <button
                onClick={saveMarkers}
                disabled={loading}
                className={`px-3 py-2 ${currentTheme.gradients.button} rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 text-white disabled:opacity-50`}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>

              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => setScale(prev => Math.min(5, prev * 1.2))}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4 text-gray-300" />
                </button>
                <button
                  onClick={() => setScale(prev => Math.max(0.1, prev / 1.2))}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4 text-gray-300" />
                </button>
                <button
                  onClick={resetView}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4 text-gray-300" />
                </button>
              </div>

              <div className={`text-sm text-${currentTheme.colors.textSecondary} ml-4`}>
                Zoom: {Math.round(scale * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Add Marker Form */}
        {showAddMarker && (
          <div className={`${currentTheme.gradients.card} rounded-xl p-4 border border-${currentTheme.colors.primary}/50 mb-6`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold text-${currentTheme.colors.primary}`}>Add Item Marker</h3>
              <button
                onClick={() => {
                  setShowAddMarker(false);
                  setNewMarkerItem('');
                  if (onSelectedItemChange) {
                    onSelectedItemChange(null);
                  }
                }}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-2 text-${currentTheme.colors.primary}`}>
                  Select Item to Mark
                </label>
                <select
                  value={newMarkerItem}
                  onChange={(e) => setNewMarkerItem(e.target.value)}
                  className={`w-full p-2 bg-gray-800 border border-${currentTheme.colors.border} rounded-lg text-${currentTheme.colors.text} focus:border-${currentTheme.colors.primary} focus:outline-none`}
                >
                  <option value="">Choose an item...</option>
                  {availableItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.category.icon} {item.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {newMarkerItem && (
                <div className={`text-sm text-${currentTheme.colors.primary} px-3 py-2 bg-${currentTheme.colors.primary}/10 rounded-lg`}>
                  Click on the map to place marker
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Canvas Area */}
        {currentMap && mapImage ? (
          <div className="flex gap-6">
            {/* Canvas */}
            <div className={`flex-1 ${currentTheme.gradients.card} rounded-xl border border-${currentTheme.colors.border} overflow-hidden`}>
              <Stage
                ref={stageRef}
                width={800}
                height={600}
                scaleX={scale}
                scaleY={scale}
                x={stagePos.x}
                y={stagePos.y}
                draggable={!showAddMarker}
                onWheel={handleWheel}
                onClick={handleStageClick}
                onDragEnd={(e) => {
                  setStagePos({
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
              >
                <Layer>
                  {/* Background Map Image */}
                  <KonvaImage
                    image={mapImage}
                    width={mapImage.width}
                    height={mapImage.height}
                  />
                  
                  {/* Item Markers */}
                  {markers.filter(marker => marker.visible).map((marker) => (
                    <Group
                      key={marker.id}
                      x={marker.x}
                      y={marker.y}
                      draggable
                      onDragStart={() => setDraggedMarker(marker.id)}
                      onDragEnd={(e) => handleMarkerDragEnd(marker.id, e)}
                      onClick={() => setSelectedMarker(marker.id)}
                    >
                      {/* Marker Circle */}
                      <Circle
                        radius={20}
                        fill={selectedMarker === marker.id ? '#ff6b6b' : '#4ecdc4'}
                        stroke={selectedMarker === marker.id ? '#ff5252' : '#26a69a'}
                        strokeWidth={3}
                        shadowColor="black"
                        shadowBlur={10}
                        shadowOpacity={0.6}
                      />
                      
                      {/* Item Icon/Text */}
                      <Text
                        text={getItemIcon(marker.itemId)}
                        fontSize={16}
                        fill="white"
                        x={-8}
                        y={-8}
                        fontFamily="Arial"
                      />
                      
                      {/* Item Name Label */}
                      <Group y={25}>
                        <Rect
                          width={getItemName(marker.itemId).length * 8 + 10}
                          height={20}
                          fill="rgba(0,0,0,0.8)"
                          cornerRadius={4}
                          x={-(getItemName(marker.itemId).length * 4 + 5)}
                        />
                        <Text
                          text={getItemName(marker.itemId)}
                          fontSize={12}
                          fill="white"
                          x={-(getItemName(marker.itemId).length * 4)}
                          y={4}
                          fontFamily="Arial"
                        />
                      </Group>
                    </Group>
                  ))}
                </Layer>
              </Stage>
            </div>

            {/* Markers Panel */}
            <div className={`w-80 ${currentTheme.gradients.card} rounded-xl p-4 border border-${currentTheme.colors.border}`}>
              <h3 className={`font-semibold text-${currentTheme.colors.primary} mb-4 flex items-center gap-2`}>
                <Package className="w-5 h-5" />
                Item Markers ({markers.length})
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {markers.length === 0 ? (
                  <p className={`text-${currentTheme.colors.textSecondary} text-sm text-center py-8`}>
                    No markers added yet. Click "Add Marker" to start placing items on your map.
                  </p>
                ) : (
                  markers.map((marker) => (
                    <div
                      key={marker.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedMarker === marker.id
                          ? `border-${currentTheme.colors.primary} bg-${currentTheme.colors.primary}/10`
                          : `border-${currentTheme.colors.border} hover:border-${currentTheme.colors.primary}/50`
                      }`}
                      onClick={() => setSelectedMarker(marker.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getItemIcon(marker.itemId)}</span>
                          <div>
                            <p className={`font-medium text-${currentTheme.colors.text} text-sm`}>
                              {getItemName(marker.itemId)}
                            </p>
                            <p className={`text-xs text-${currentTheme.colors.textSecondary}`}>
                              Position: ({Math.round(marker.x)}, {Math.round(marker.y)})
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMarkerVisibility(marker.id);
                            }}
                            className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                              marker.visible ? 'text-green-400' : 'text-gray-500'
                            }`}
                            title={marker.visible ? 'Hide marker' : 'Show marker'}
                          >
                            {marker.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMarker(marker.id);
                            }}
                            className="p-1 rounded hover:bg-gray-700 transition-colors text-red-400"
                            title="Remove marker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : currentMap ? (
          <div className={`${currentTheme.gradients.card} rounded-xl p-12 border border-${currentTheme.colors.border} text-center`}>
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`text-${currentTheme.colors.textSecondary}`}>Loading map image...</p>
          </div>
        ) : (
          <div className={`${currentTheme.gradients.card} rounded-xl p-12 border border-${currentTheme.colors.border} text-center`}>
            <Map className={`w-16 h-16 text-${currentTheme.colors.textSecondary} mx-auto mb-4`} />
            <p className={`text-${currentTheme.colors.textSecondary} mb-4`}>
              No map selected. Go back to maps list to select or create a map.
            </p>
            <button
              onClick={() => setShowMapsList(true)}
              className={`px-6 py-3 ${currentTheme.gradients.button} rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 text-white mx-auto`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Maps
            </button>
          </div>
        )}
      </div>
    </ThemedBackground>
  );
};