import React, { useState, useEffect } from 'react';
import { Archive, Plus, X, Edit, Trash2, Package, LogOut, ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { StarField } from '../ui/StarField';
import type { Item } from '../SpaceTracker';

interface VirtualDrawersViewProps {
  items: Item[];
  onBack: () => void;
  onSignOut: () => void;
  user: User | null;
  onItemsUpdated: () => void;
}

interface Container {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
  created_at: string;
}

export const VirtualDrawersView: React.FC<VirtualDrawersViewProps> = ({
  items,
  onBack,
  onSignOut,
  user,
  onItemsUpdated
}) => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [expandedContainers, setExpandedContainers] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContainerName, setNewContainerName] = useState('');
  const [selectedParent, setSelectedParent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);

  useEffect(() => {
    if (user) {
      loadContainers();
    }
  }, [user]);

  const loadContainers = async () => {
    // For now, we'll simulate containers with a simple structure
    // In a real implementation, you'd have a containers table
    const mockContainers: Container[] = [
      { id: 'drawer1', name: 'Kitchen Drawer 1', parent_id: null, level: 0, created_at: new Date().toISOString() },
      { id: 'box1', name: 'Utensil Box', parent_id: 'drawer1', level: 1, created_at: new Date().toISOString() },
      { id: 'compartment1', name: 'Spoon Section', parent_id: 'box1', level: 2, created_at: new Date().toISOString() },
      { id: 'drawer2', name: 'Office Drawer 2', parent_id: null, level: 0, created_at: new Date().toISOString() },
      { id: 'box2', name: 'Electronics Box', parent_id: 'drawer2', level: 1, created_at: new Date().toISOString() },
    ];
    setContainers(mockContainers);
  };

  const createContainer = async () => {
    if (!newContainerName.trim() || !user) return;

    try {
      setLoading(true);
      
      // In a real implementation, you'd save to a containers table
      const newContainer: Container = {
        id: `container_${Date.now()}`,
        name: newContainerName.trim(),
        parent_id: selectedParent,
        level: selectedParent ? (containers.find(c => c.id === selectedParent)?.level || 0) + 1 : 0,
        created_at: new Date().toISOString()
      };

      setContainers(prev => [...prev, newContainer]);
      setNewContainerName('');
      setSelectedParent(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating container:', error);
      alert('Error creating container. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteContainer = async (containerId: string) => {
    if (!confirm('Are you sure you want to delete this container? Items inside will be moved to the parent container.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Remove container and update items
      setContainers(prev => prev.filter(c => c.id !== containerId));
      
      // In a real implementation, you'd update items in the database
      // For now, we'll just reload items
      onItemsUpdated();
    } catch (error) {
      console.error('Error deleting container:', error);
      alert('Error deleting container. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (containerId: string) => {
    setExpandedContainers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(containerId)) {
        newSet.delete(containerId);
      } else {
        newSet.add(containerId);
      }
      return newSet;
    });
  };

  const getContainerItems = (containerId: string) => {
    // In a real implementation, items would have a container_id field
    // For now, we'll simulate by checking if location contains container name
    const container = containers.find(c => c.id === containerId);
    if (!container) return [];
    
    return items.filter(item => 
      item.location.toLowerCase().includes(container.name.toLowerCase())
    );
  };

  const getChildContainers = (parentId: string | null) => {
    return containers.filter(c => c.parent_id === parentId);
  };

  const renderContainer = (container: Container) => {
    const childContainers = getChildContainers(container.id);
    const containerItems = getContainerItems(container.id);
    const isExpanded = expandedContainers.has(container.id);
    const hasChildren = childContainers.length > 0 || containerItems.length > 0;

    return (
      <div key={container.id} className="space-y-2">
        <div 
          className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30 hover:border-slate-400/50 transition-all"
          style={{ marginLeft: `${container.level * 20}px` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(container.id)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              )}
              
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                ) : (
                  <Folder className="w-5 h-5 text-blue-400" />
                )}
                <h3 className="font-semibold text-slate-400">{container.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {containerItems.length} items
              </span>
              
              <button
                onClick={() => {
                  setSelectedParent(container.id);
                  setShowAddForm(true);
                }}
                className="p-1 hover:bg-gray-700 rounded transition-colors text-green-400"
                title="Add sub-container"
              >
                <Plus className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setEditingContainer(container)}
                className="p-1 hover:bg-gray-700 rounded transition-colors text-blue-400"
                title="Edit container"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => deleteContainer(container.id)}
                className="p-1 hover:bg-gray-700 rounded transition-colors text-red-400"
                title="Delete container"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Show items in this container */}
          {isExpanded && containerItems.length > 0 && (
            <div className="mt-3 space-y-2">
              {containerItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg">
                  {item.item_image_url ? (
                    <div className="w-8 h-8 rounded overflow-hidden border border-gray-600 flex-shrink-0">
                      <img src={item.item_image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{item.category.icon}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 truncate">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Render child containers */}
        {isExpanded && childContainers.map(child => renderContainer(child))}
      </div>
    );
  };

  const rootContainers = getChildContainers(null);

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
            <Archive className="w-6 h-6" />
            Virtual Drawers & Boxes
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
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 mb-6">
          <h2 className="text-lg font-semibold text-purple-300 mb-2">Micro-Organization Made Easy</h2>
          <p className="text-gray-300 text-sm">
            Create nested virtual containers to organize your items with precision. Think "Drawer 2 → Box A → USB drives" 
            for ultimate organization. Perfect for small items that need detailed categorization.
          </p>
        </div>

        {/* Add Container Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setSelectedParent(null);
              setShowAddForm(true);
            }}
            className="w-full p-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl font-medium hover:from-purple-400 hover:to-violet-500 transition-all flex items-center justify-center gap-2 text-white"
          >
            <Plus className="w-5 h-5" />
            Create New Container
          </button>
        </div>

        {/* Add Container Form */}
        {showAddForm && (
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/50 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-purple-300">
                {selectedParent ? 'Add Sub-Container' : 'Add Root Container'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewContainerName('');
                  setSelectedParent(null);
                }}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedParent && (
                <div className="text-sm text-gray-300">
                  <span className="text-purple-300">Parent:</span> {containers.find(c => c.id === selectedParent)?.name}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-2 text-purple-300">
                  Container Name
                </label>
                <input
                  type="text"
                  value={newContainerName}
                  onChange={(e) => setNewContainerName(e.target.value)}
                  placeholder="e.g., Kitchen Drawer 1, Electronics Box, USB Section"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <button
                onClick={createContainer}
                disabled={!newContainerName.trim() || loading}
                className="w-full p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg font-medium hover:from-purple-400 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Archive className="w-5 h-5" />
                    Create Container
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Containers List */}
        <div className="space-y-4">
          {rootContainers.length === 0 ? (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-12 border border-gray-500/30 text-center">
              <Archive className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                No virtual containers created yet. Start organizing your items with nested containers!
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>💡 Examples:</p>
                <p>• Kitchen → Drawer 1 → Utensil Box → Spoon Section</p>
                <p>• Office → Desk → Electronics Box → Cable Organizer</p>
                <p>• Bedroom → Closet → Shoe Box → Winter Boots</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-400 mb-4">
                Your Virtual Containers ({containers.length})
              </h2>
              {rootContainers.map(container => renderContainer(container))}
            </>
          )}
        </div>

        {/* Stats */}
        {containers.length > 0 && (
          <div className="mt-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Container Stats</h3>
            <div className="text-sm text-gray-300">
              <p>📦 Total Containers: {containers.length}</p>
              <p>🗂️ Root Containers: {rootContainers.length}</p>
              <p>📁 Nested Levels: {Math.max(...containers.map(c => c.level)) + 1}</p>
              <p>📋 Items Organized: {items.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};