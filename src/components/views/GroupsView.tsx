import React, { useState, useEffect } from 'react';
import { Users, Plus, X, Edit, Trash2, Package, LogOut, Tag, Star } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { StarField } from '../ui/StarField';
import type { Item } from '../SpaceTracker';

interface GroupsViewProps {
  items: Item[];
  onBack: () => void;
  onSignOut: () => void;
  user: User | null;
  onItemsUpdated: () => void;
}

interface ItemGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  created_at: string;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  items,
  onBack,
  onSignOut,
  user,
  onItemsUpdated
}) => {
  const [groups, setGroups] = useState<ItemGroup[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    color: 'blue',
    icon: '📦'
  });
  const [loading, setLoading] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ItemGroup | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groupColors = [
    { id: 'blue', name: 'Blue', class: 'from-blue-500 to-blue-600' },
    { id: 'green', name: 'Green', class: 'from-green-500 to-green-600' },
    { id: 'purple', name: 'Purple', class: 'from-purple-500 to-purple-600' },
    { id: 'red', name: 'Red', class: 'from-red-500 to-red-600' },
    { id: 'yellow', name: 'Yellow', class: 'from-yellow-500 to-yellow-600' },
    { id: 'pink', name: 'Pink', class: 'from-pink-500 to-pink-600' },
    { id: 'indigo', name: 'Indigo', class: 'from-indigo-500 to-indigo-600' },
    { id: 'teal', name: 'Teal', class: 'from-teal-500 to-teal-600' }
  ];

  const groupIcons = ['📦', '🎯', '⚡', '🔧', '🎨', '🏠', '💼', '🎮', '📚', '🍳', '🧰', '🎵', '🏃', '💡'];

  useEffect(() => {
    if (user) {
      loadGroups();
    }
  }, [user]);

  const loadGroups = async () => {
    // For now, we'll simulate groups with a simple structure
    // In a real implementation, you'd have a groups table
    const mockGroups: ItemGroup[] = [
      {
        id: 'photography',
        name: 'Photography Equipment',
        description: 'All camera gear, lenses, and accessories',
        color: 'blue',
        icon: '📷',
        created_at: new Date().toISOString()
      },
      {
        id: 'kitchen',
        name: 'Kitchen Gadgets',
        description: 'Small appliances and cooking tools',
        color: 'green',
        icon: '🍳',
        created_at: new Date().toISOString()
      },
      {
        id: 'electronics',
        name: 'Electronics Collection',
        description: 'Cables, chargers, and electronic devices',
        color: 'purple',
        icon: '⚡',
        created_at: new Date().toISOString()
      }
    ];
    setGroups(mockGroups);
  };

  const createGroup = async () => {
    if (!newGroup.name.trim() || !user) return;

    try {
      setLoading(true);
      
      // In a real implementation, you'd save to a groups table
      const group: ItemGroup = {
        id: `group_${Date.now()}`,
        name: newGroup.name.trim(),
        description: newGroup.description.trim(),
        color: newGroup.color,
        icon: newGroup.icon,
        created_at: new Date().toISOString()
      };

      setGroups(prev => [...prev, group]);
      setNewGroup({ name: '', description: '', color: 'blue', icon: '📦' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Error creating group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group? Items will be ungrouped but not deleted.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Remove group and update items
      setGroups(prev => prev.filter(g => g.id !== groupId));
      
      // In a real implementation, you'd update items in the database
      onItemsUpdated();
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Error deleting group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGroupItems = (groupId: string) => {
    // In a real implementation, items would have a group_id field
    // For now, we'll simulate by checking tags or names
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    
    return items.filter(item => 
      item.tags?.some(tag => tag.toLowerCase().includes(group.name.toLowerCase().split(' ')[0])) ||
      item.name.toLowerCase().includes(group.name.toLowerCase().split(' ')[0]) ||
      item.category.name.toLowerCase().includes(group.name.toLowerCase().split(' ')[0])
    );
  };

  const getColorClass = (colorId: string) => {
    return groupColors.find(c => c.id === colorId)?.class || 'from-gray-500 to-gray-600';
  };

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
            <Users className="w-6 h-6" />
            Item Groups
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
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30 mb-6">
          <h2 className="text-lg font-semibold text-emerald-300 mb-2">Organize Related Items Together</h2>
          <p className="text-gray-300 text-sm">
            Create collections of related items like "Photography Equipment", "Kitchen Gadgets", or "Travel Gear". 
            Groups help you manage and find related items quickly, like repositories for your belongings.
          </p>
        </div>

        {/* Add Group Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl font-medium hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center justify-center gap-2 text-white"
          >
            <Plus className="w-5 h-5" />
            Create New Group
          </button>
        </div>

        {/* Add Group Form */}
        {showAddForm && (
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/50 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-emerald-300">Create New Group</h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewGroup({ name: '', description: '', color: 'blue', icon: '📦' });
                }}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-emerald-300">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Photography Equipment, Kitchen Gadgets"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-emerald-300">
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of what this group contains..."
                  rows={2}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-emerald-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-emerald-300">
                    Icon
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {groupIcons.map(icon => (
                      <button
                        key={icon}
                        onClick={() => setNewGroup(prev => ({ ...prev, icon }))}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          newGroup.icon === icon 
                            ? 'border-emerald-400 bg-emerald-400/20' 
                            : 'border-gray-600 hover:border-emerald-400/50'
                        }`}
                      >
                        <span className="text-lg">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-emerald-300">
                    Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {groupColors.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setNewGroup(prev => ({ ...prev, color: color.id }))}
                        className={`p-3 rounded-lg border-2 transition-all bg-gradient-to-r ${color.class} ${
                          newGroup.color === color.id 
                            ? 'border-white' 
                            : 'border-gray-600 hover:border-white/50'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={createGroup}
                disabled={!newGroup.name.trim() || loading}
                className="w-full p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg font-medium hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Create Group
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Groups List */}
        <div className="space-y-4">
          {groups.length === 0 ? (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-12 border border-gray-500/30 text-center">
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                No item groups created yet. Start organizing your items into collections!
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>💡 Group Ideas:</p>
                <p>• Photography Equipment (cameras, lenses, tripods)</p>
                <p>• Kitchen Gadgets (small appliances, tools)</p>
                <p>• Travel Gear (luggage, accessories, documents)</p>
                <p>• Electronics Collection (cables, chargers, devices)</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-400 mb-4">
                Your Item Groups ({groups.length})
              </h2>
              {groups.map((group) => {
                const groupItems = getGroupItems(group.id);
                const isSelected = selectedGroup === group.id;
                
                return (
                  <div key={group.id} className="space-y-2">
                    <div 
                      className={`bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30 hover:border-emerald-400/50 transition-all cursor-pointer`}
                      onClick={() => setSelectedGroup(isSelected ? null : group.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getColorClass(group.color)} flex items-center justify-center`}>
                            <span className="text-xl">{group.icon}</span>
                          </div>
                          
                          <div>
                            <h3 className="font-semibold text-emerald-300">{group.name}</h3>
                            <p className="text-sm text-gray-400">{group.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {groupItems.length} items • Created {new Date(group.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">
                            {groupItems.length} items
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingGroup(group);
                            }}
                            className="p-1 hover:bg-gray-700 rounded transition-colors text-blue-400"
                            title="Edit group"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteGroup(group.id);
                            }}
                            className="p-1 hover:bg-gray-700 rounded transition-colors text-red-400"
                            title="Delete group"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Show items in this group */}
                    {isSelected && groupItems.length > 0 && (
                      <div className="ml-4 space-y-2">
                        {groupItems.map(item => (
                          <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/50">
                            {item.item_image_url ? (
                              <div className="w-10 h-10 rounded overflow-hidden border border-gray-600 flex-shrink-0">
                                <img src={item.item_image_url} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">{item.category.icon}</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-white truncate">{item.name}</p>
                                {item.is_starred && <Star className="w-3 h-3 text-yellow-400 fill-current flex-shrink-0" />}
                              </div>
                              <p className="text-xs text-gray-400 truncate">{item.location}</p>
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-1 py-0.5 bg-emerald-600/30 rounded text-xs text-emerald-200">
                                      #{tag}
                                    </span>
                                  ))}
                                  {item.tags.length > 3 && (
                                    <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Stats */}
        {groups.length > 0 && (
          <div className="mt-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Group Stats</h3>
            <div className="text-sm text-gray-300">
              <p>👥 Total Groups: {groups.length}</p>
              <p>📦 Items in Groups: {groups.reduce((sum, group) => sum + getGroupItems(group.id).length, 0)}</p>
              <p>📋 Ungrouped Items: {items.length - groups.reduce((sum, group) => sum + getGroupItems(group.id).length, 0)}</p>
              <p>🎯 Average Items per Group: {groups.length > 0 ? Math.round(groups.reduce((sum, group) => sum + getGroupItems(group.id).length, 0) / groups.length) : 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};