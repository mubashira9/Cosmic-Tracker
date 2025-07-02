import React, { useState, useEffect } from 'react';
import { Users, Plus, X, Edit, Trash2, Package, LogOut, Tag, Star, Check } from 'lucide-react';
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
  user_id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
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
  const [showItemSelector, setShowItemSelector] = useState<string | null>(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    color: 'blue',
    icon: '📦'
  });
  const [loading, setLoading] = useState(false);
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('item_groups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading groups:', error);
        return;
      }

      setGroups(data || []);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const createGroup = async () => {
    if (!newGroup.name.trim() || !user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('item_groups')
        .insert([
          {
            user_id: user.id,
            name: newGroup.name.trim(),
            description: newGroup.description.trim(),
            color: newGroup.color,
            icon: newGroup.icon,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating group:', error);
        alert('Error creating group. Please try again.');
        return;
      }

      setGroups(prev => [data, ...prev]);
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
      
      // First, remove group_id from all items in this group
      const { error: itemsError } = await supabase
        .from('items')
        .update({ group_id: null })
        .eq('group_id', groupId);

      if (itemsError) {
        console.error('Error ungrouping items:', itemsError);
        alert('Error ungrouping items. Please try again.');
        return;
      }

      // Then delete the group
      const { error } = await supabase
        .from('item_groups')
        .delete()
        .eq('id', groupId);

      if (error) {
        console.error('Error deleting group:', error);
        alert('Error deleting group. Please try again.');
        return;
      }

      setGroups(prev => prev.filter(g => g.id !== groupId));
      onItemsUpdated();
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Error deleting group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addItemToGroup = async (itemId: string, groupId: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('items')
        .update({ group_id: groupId })
        .eq('id', itemId);

      if (error) {
        console.error('Error adding item to group:', error);
        alert('Error adding item to group. Please try again.');
        return;
      }

      onItemsUpdated();
      setShowItemSelector(null);
    } catch (error) {
      console.error('Error adding item to group:', error);
      alert('Error adding item to group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromGroup = async (itemId: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('items')
        .update({ group_id: null })
        .eq('id', itemId);

      if (error) {
        console.error('Error removing item from group:', error);
        alert('Error removing item from group. Please try again.');
        return;
      }

      onItemsUpdated();
    } catch (error) {
      console.error('Error removing item from group:', error);
      alert('Error removing item from group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGroupItems = (groupId: string) => {
    return items.filter(item => item.group_id === groupId);
  };

  const getUngroupedItems = () => {
    return items.filter(item => !item.group_id);
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

        {/* Item Selector Modal */}
        {showItemSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-500/30 max-w-md w-full max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-emerald-300">Add Items to Group</h3>
                <button
                  onClick={() => setShowItemSelector(null)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-2">
                {getUngroupedItems().map(item => (
                  <div
                    key={item.id}
                    onClick={() => addItemToGroup(item.id, showItemSelector)}
                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/50 hover:border-emerald-400/50 cursor-pointer transition-all"
                  >
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
                      <p className="text-sm text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 truncate">{item.location}</p>
                    </div>
                  </div>
                ))}
                
                {getUngroupedItems().length === 0 && (
                  <p className="text-gray-400 text-center py-4">
                    All items are already in groups
                  </p>
                )}
              </div>
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowItemSelector(group.id);
                            }}
                            className="p-1 hover:bg-gray-700 rounded transition-colors text-green-400"
                            title="Add items to group"
                          >
                            <Plus className="w-4 h-4" />
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
                    {isSelected && (
                      <div className="ml-4 space-y-2">
                        {groupItems.length === 0 ? (
                          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-600/30 text-center">
                            <p className="text-gray-400 text-sm">No items in this group yet.</p>
                            <button
                              onClick={() => setShowItemSelector(group.id)}
                              className="mt-2 px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 rounded text-emerald-300 text-sm transition-colors"
                            >
                              Add Items
                            </button>
                          </div>
                        ) : (
                          groupItems.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-600/50 group">
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
                              <button
                                onClick={() => removeItemFromGroup(item.id)}
                                className="p-1 hover:bg-gray-700 rounded transition-colors text-red-400 opacity-0 group-hover:opacity-100"
                                title="Remove from group"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Ungrouped Items */}
        {getUngroupedItems().length > 0 && (
          <div className="mt-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
            <h3 className="text-lg font-semibold text-yellow-300 mb-3">Ungrouped Items ({getUngroupedItems().length})</h3>
            <p className="text-gray-300 text-sm mb-3">
              These items aren't in any group yet. Click on a group's + button to add them.
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {getUngroupedItems().slice(0, 10).map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded text-sm">
                  <span className="text-lg">{item.category.icon}</span>
                  <span className="text-white truncate">{item.name}</span>
                </div>
              ))}
              {getUngroupedItems().length > 10 && (
                <div className="col-span-2 text-center text-gray-400 text-xs">
                  +{getUngroupedItems().length - 10} more items
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        {groups.length > 0 && (
          <div className="mt-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Group Stats</h3>
            <div className="text-sm text-gray-300">
              <p>👥 Total Groups: {groups.length}</p>
              <p>📦 Items in Groups: {groups.reduce((sum, group) => sum + getGroupItems(group.id).length, 0)}</p>
              <p>📋 Ungrouped Items: {getUngroupedItems().length}</p>
              <p>🎯 Average Items per Group: {groups.length > 0 ? Math.round(groups.reduce((sum, group) => sum + getGroupItems(group.id).length, 0) / groups.length) : 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};