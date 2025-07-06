import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Group, Rect, Text } from 'react-konva';
import { Map, Upload, Save, X, Plus, Trash2, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, Package, ArrowLeft, LogOut } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { SpaceBackground } from '../ui/SpaceBackground';
import { SpaceButton } from '../ui/SpaceButton';
import { SpacePanel } from '../ui/SpacePanel';
import { CrewmateIcon, FloatingCrewmate } from '../ui/CrewmateIcon';
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

// Crewmate marker component for Konva
const CrewmateMarker: React.FC<{
  x: number;
  y: number;
  color: string;
  selected: boolean;
  onClick: () => void;
  onDragEnd: (e: any) => void;
}> = ({ x, y, color, selected, onClick, onDragEnd }) => {
  const colors: { [key: string]: string } = {
    red: '#C51111',
    blue: '#132ED1',
    green: '#117F2D',
    yellow: '#F7F557',
    pink: '#ED54BA',
    orange: '#F07613',
    purple: '#6B2FBB',
    cyan: '#38FEDC'
  };

  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={onClick}
      onDragEnd={onDragEnd}
    >
      {/* Body */}
      <Rect
        width={30}
        height={40}
        fill={colors[color] || colors.blue}
        cornerRadius={15}
        offsetX={15}
        offsetY={20}
        stroke={selected ? '#FFFFFF' : '#000000'}
        strokeWidth={selected ? 3 : 1}
      />
      
      {/* Visor */}
      <Rect
        width={20}
        height={25}
        fill="#87CEEB"
        cornerRadius={10}
        offsetX={10}
        offsetY={12}
        y={-8}
        opacity={0.9}
      />
      
      {/* Visor reflection */}
      <Rect
        width={8}
        height={10}
        fill="#FFFFFF"
        cornerRadius={4}
        offsetX={4}
        offsetY={5}
        x={-8}
        y={-12}
        opacity={0.6}
      />
    </Group>
  );
};

export const VisualMapView: React.FC<VisualMapViewProps> = ({
  items,
  onBack,
  onSignOut,
  user,
  selectedItem,
  onSelectedItemChange
}) => {
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
  
  const stageRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const crewmateColors = ['red', 'blue', 'green', 'yellow', 'pink', 'orange', 'purple', 'cyan'];

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
  };

  const handleStageClick = (e: any) => {
    // If we're in add marker mode, add a marker at click position
    if (showAddMarker && newMarkerItem) {
      const pos = e.target.getStage().getPointerPosition();
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

  const getMarkerColor = (index: number) => {
    return crewmateColors[index % crewmateColors.length];
  };

  const availableItems = items.filter(item => 
    !markers.some(marker => marker.itemId === item.id)
  );

  if (!user) return null;

  // Show maps list view by default
  if (!currentMap) {
    return (
      <SpaceBackground variant="spaceship">
        {/* Floating crewmates */}
        <FloatingCrewmate color="blue" className="top-20 left-10" />
        <FloatingCrewmate color="green" className="top-32 right-16" />
        <FloatingCrewmate color="red" className="bottom-40 left-20" />
        <FloatingCrewmate color="yellow" className="bottom-20 right-12" />
        
        <div className="p-4 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <SpaceButton
              onClick={onBack}
              variant="secondary"
              size="sm"
            >
              ← Back to Command Center
            </SpaceButton>
            <h1 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
              <Map className="w-6 h-6" />
              Visual Maps
              <CrewmateIcon color="cyan" size="md" />
            </h1>
            <SpaceButton
              onClick={onSignOut}
              variant="danger"
              size="sm"
              className="p-2"
            >
              <LogOut className="w-4 h-4" />
            </SpaceButton>
          </div>

          {/* Create New Map Button */}
          <div className="mb-6">
            <SpaceButton
              onClick={() => setShowUploadForm(true)}
              variant="primary"
              className="w-full"
            >
              <Upload className="w-5 h-5" />
              Create New Visual Map
              <CrewmateIcon color="green" size="sm" />
            </SpaceButton>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <SpacePanel variant="control" className="p-4 mb-6" glowing>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-cyan-400 flex items-center gap-2">
                  Create New Map
                  <CrewmateIcon color="cyan" size="sm" />
                </h3>
                <SpaceButton
                  onClick={() => {
                    setShowUploadForm(false);
                    setNewMapName('');
                  }}
                  variant="secondary"
                  size="sm"
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </SpaceButton>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-cyan-400">
                    Map Name
                  </label>
                  <input
                    type="text"
                    value={newMapName}
                    onChange={(e) => setNewMapName(e.target.value)}
                    placeholder="e.g., Living Room Floor Plan"
                    className="w-full p-2 bg-gray-800/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-cyan-400">
                    Map Image
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <SpaceButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!newMapName.trim()}
                    variant="secondary"
                    className="w-full p-3 border-2 border-dashed border-cyan-400/30"
                  >
                    <Upload className="w-5 h-5" />
                    Click to upload floor plan, shelf diagram, or storage map
                  </SpaceButton>
                </div>
              </div>
            </SpacePanel>
          )}

          {/* Maps List */}
          <div className="space-y-4">
            {maps.length === 0 ? (
              <SpacePanel variant="default" className="p-12 text-center">
                <Map className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  No visual maps created yet. Upload your first floor plan or storage diagram to get started!
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CrewmateIcon color="blue" size="sm" />
                  <span className="text-cyan-300 text-sm">Ready for spaceship mapping!</span>
                  <CrewmateIcon color="green" size="sm" />
                </div>
                <SpaceButton
                  onClick={() => setShowUploadForm(true)}
                  variant="primary"
                >
                  <Upload className="w-5 h-5" />
                  Upload Your First Map
                </SpaceButton>
              </SpacePanel>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                  Your Visual Maps ({maps.length})
                  <CrewmateIcon color="cyan" size="sm" />
                </h2>
                {maps.map((map) => (
                  <SpacePanel
                    key={map.id}
                    variant="default"
                    className="p-4 hover:border-cyan-400/50 transition-all cursor-pointer"
                    onClick={() => setCurrentMap(map)}
                  >
                    <div className="flex items-center gap-4">
                      {map.image_url && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                          <img src={map.image_url} alt={map.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-cyan-400 mb-1 flex items-center gap-2">
                          {map.name}
                          <CrewmateIcon color="blue" size="sm" />
                        </h3>
                        <p className="text-sm text-gray-400">
                          {map.markers?.length || 0} crewmate markers
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(map.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-gray-400 transform rotate-180" />
                    </div>
                  </SpacePanel>
                ))}
              </>
            )}
          </div>
        </div>
      </SpaceBackground>
    );
  }

  return (
    <SpaceBackground variant="spaceship">
      <div className="p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <SpaceButton
            onClick={() => setCurrentMap(null)}
            variant="secondary"
            size="sm"
          >
            ← Back to Maps
          </SpaceButton>
          <h1 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
            <Map className="w-6 h-6" />
            {currentMap?.name || 'Visual Map'}
            <CrewmateIcon color="cyan" size="md" />
          </h1>
          <SpaceButton
            onClick={onSignOut}
            variant="danger"
            size="sm"
            className="p-2"
          >
            <LogOut className="w-4 h-4" />
          </SpaceButton>
        </div>

        {/* Map Controls */}
        {currentMap && (
          <SpacePanel variant="control" className="p-4 mb-6" glowing>
            <div className="flex flex-wrap items-center gap-2">
              <SpaceButton
                onClick={() => setShowAddMarker(!showAddMarker)}
                variant={showAddMarker ? "primary" : "secondary"}
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Crewmate Marker
                <CrewmateIcon color="green" size="sm" />
              </SpaceButton>

              <SpaceButton
                onClick={saveMarkers}
                disabled={loading}
                variant="success"
                size="sm"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </SpaceButton>

              <div className="flex items-center gap-1 ml-4">
                <SpaceButton
                  onClick={() => setScale(prev => Math.min(5, prev * 1.2))}
                  variant="secondary"
                  size="sm"
                  className="p-2"
                >
                  <ZoomIn className="w-4 h-4" />
                </SpaceButton>
                <SpaceButton
                  onClick={() => setScale(prev => Math.max(0.1, prev / 1.2))}
                  variant="secondary"
                  size="sm"
                  className="p-2"
                >
                  <ZoomOut className="w-4 h-4" />
                </SpaceButton>
                <SpaceButton
                  onClick={resetView}
                  variant="secondary"
                  size="sm"
                  className="p-2"
                >
                  <RotateCcw className="w-4 h-4" />
                </SpaceButton>
              </div>

              <div className="text-sm text-cyan-300 ml-4 flex items-center gap-2">
                <CrewmateIcon color="cyan" size="sm" />
                Zoom: {Math.round(scale * 100)}%
              </div>
            </div>
          </SpacePanel>
        )}

        {/* Add Marker Form */}
        {showAddMarker && (
          <SpacePanel variant="control" className="p-4 mb-6" glowing>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-cyan-400 flex items-center gap-2">
                Add Crewmate Marker
                <CrewmateIcon color="green" size="sm" />
              </h3>
              <SpaceButton
                onClick={() => {
                  setShowAddMarker(false);
                  setNewMarkerItem('');
                  if (onSelectedItemChange) {
                    onSelectedItemChange(null);
                  }
                }}
                variant="secondary"
                size="sm"
                className="p-1"
              >
                <X className="w-4 h-4" />
              </SpaceButton>
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2 text-cyan-400">
                  Select Item to Mark
                </label>
                <select
                  value={newMarkerItem}
                  onChange={(e) => setNewMarkerItem(e.target.value)}
                  className="w-full p-2 bg-gray-800/50 border border-cyan-400/30 rounded-lg text-white focus:border-cyan-400 focus:outline-none backdrop-blur-sm"
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
                <div className="text-sm text-cyan-400 px-3 py-2 bg-cyan-400/10 rounded-lg flex items-center gap-2">
                  <CrewmateIcon color="cyan" size="sm" />
                  Click on the map to place crewmate
                </div>
              )}
            </div>
          </SpacePanel>
        )}

        {/* Main Canvas Area */}
        {currentMap && mapImage ? (
          <div className="flex gap-6">
            {/* Canvas */}
            <SpacePanel variant="default" className="flex-1 overflow-hidden">
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
                  
                  {/* Crewmate Markers */}
                  {markers.filter(marker => marker.visible).map((marker, index) => (
                    <CrewmateMarker
                      key={marker.id}
                      x={marker.x}
                      y={marker.y}
                      color={getMarkerColor(index)}
                      selected={selectedMarker === marker.id}
                      onClick={() => setSelectedMarker(marker.id)}
                      onDragEnd={(e) => handleMarkerDragEnd(marker.id, e)}
                    />
                  ))}
                </Layer>
              </Stage>
            </SpacePanel>

            {/* Markers Panel */}
            <SpacePanel variant="default" className="w-80 p-4">
              <h3 className="font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Crewmate Markers ({markers.length})
                <CrewmateIcon color="cyan" size="sm" />
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {markers.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8 flex flex-col items-center gap-2">
                    <CrewmateIcon color="blue" size="md" />
                    No crewmate markers added yet. Click "Add Crewmate Marker" to start placing items on your spaceship map.
                  </p>
                ) : (
                  markers.map((marker, index) => (
                    <SpacePanel
                      key={marker.id}
                      variant={selectedMarker === marker.id ? "control" : "default"}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedMarker === marker.id ? 'border-cyan-400' : 'hover:border-cyan-400/50'
                      }`}
                      onClick={() => setSelectedMarker(marker.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CrewmateIcon color={getMarkerColor(index)} size="sm" />
                          <div>
                            <p className="font-medium text-white text-sm">
                              {getItemName(marker.itemId)}
                            </p>
                            <p className="text-xs text-gray-400">
                              Position: ({Math.round(marker.x)}, {Math.round(marker.y)})
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <SpaceButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMarkerVisibility(marker.id);
                            }}
                            variant="secondary"
                            size="sm"
                            className={`p-1 ${marker.visible ? 'text-green-400' : 'text-gray-500'}`}
                          >
                            {marker.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </SpaceButton>
                          
                          <SpaceButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMarker(marker.id);
                            }}
                            variant="danger"
                            size="sm"
                            className="p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </SpaceButton>
                        </div>
                      </div>
                    </SpacePanel>
                  ))
                )}
              </div>
            </SpacePanel>
          </div>
        ) : currentMap ? (
          <SpacePanel variant="default" className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <CrewmateIcon color="cyan" size="sm" />
              Loading spaceship map...
              <CrewmateIcon color="blue" size="sm" />
            </p>
          </SpacePanel>
        ) : (
          <SpacePanel variant="default" className="p-12 text-center">
            <Map className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4 flex items-center justify-center gap-2">
              <CrewmateIcon color="blue" size="sm" />
              No map selected. Go back to maps list to select or create a map.
              <CrewmateIcon color="green" size="sm" />
            </p>
            <SpaceButton
              onClick={() => setCurrentMap(null)}
              variant="primary"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Maps
            </SpaceButton>
          </SpacePanel>
        )}
      </div>
    </SpaceBackground>
  );
};