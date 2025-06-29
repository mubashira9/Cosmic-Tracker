import React, { useState } from 'react';
import { Search, Package, LogOut, Star, Lock, MapPin, X, Edit } from 'lucide-react';
import { StarField } from '../ui/StarField';
import type { Item } from '../SpaceTracker';

interface InventoryViewProps {
  items: Item[];
  categories: Array<{ id: string; name: string; icon: string }>;
  expandedItem: string | null;
  unlockedItems: Set<string>;
  onBack: () => void;
  onItemClick: (item: Item) => void;
  onExpandedItemChange: (itemId: string | null) => void;
  onEditItem: (item: Item) => void;
  onSignOut: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  categories,
  expandedItem,
  unlockedItems,
  onBack,
  onItemClick,
  onExpandedItemChange,
  onEditItem,
  onSignOut
}) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
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
    
    const matchesCategory = filterCategory === 'all' || item.category.id === filterCategory;
    const matchesTag = filterTag === 'all' || item.tags?.includes(filterTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative">
      <StarField />
      
      <div className="relative z-10 p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-purple-800 hover:bg-purple-700 transition-colors"
          >
            ← Back to Command Center
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Inventory
          </h1>
          <button
            onClick={onSignOut}
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your cosmic inventory..."
              className="w-full pl-10 pr-4 py-3 bg-black bg-opacity-40 border border-purple-500 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none backdrop-blur-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-3 bg-black bg-opacity-40 border border-purple-500 rounded-xl text-white focus:border-cyan-400 focus:outline-none backdrop-blur-sm text-sm"
              >
                <option value="all">🌌 All</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Tags</label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-full p-3 bg-black bg-opacity-40 border border-purple-500 rounded-xl text-white focus:border-cyan-400 focus:outline-none backdrop-blur-sm text-sm"
              >
                <option value="all">🏷️ All Tags</option>
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {items.length === 0 
                  ? "Your cosmic inventory is empty. Start by adding your first item!"
                  : "No items found matching your search or filter."
                }
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="space-y-2">
                {/* Compact View */}
                <div
                  onClick={() => onItemClick(item)}
                  className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 hover:border-cyan-400/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Show lock icon for PIN-protected items, otherwise show image or category icon */}
                    {item.has_pin && !unlockedItems.has(item.id) ? (
                      <div className="w-12 h-12 rounded-lg bg-red-600/20 border border-red-500/50 flex items-center justify-center flex-shrink-0">
                        <Lock className="w-6 h-6 text-red-400" />
                      </div>
                    ) : item.item_image_url ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                        <img src={item.item_image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">{item.category.icon}</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-cyan-300 truncate">{item.name}</h3>
                        {item.is_starred && <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />}
                        {item.has_pin && <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{item.location}</p>
                    </div>
                  </div>
                </div>

                {/* Expanded View */}
                {expandedItem === item.id && (item.has_pin ? unlockedItems.has(item.id) : true) && (
                  <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/50 ml-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-400">{item.category.name}</p>
                          <div className="flex items-center gap-2 text-purple-300 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{item.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditItem(item);
                            }}
                            className="p-1 hover:bg-gray-700 rounded text-cyan-400 hover:text-cyan-300"
                            title="Edit Item"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onExpandedItemChange(null);
                            }}
                            className="p-1 hover:bg-gray-700 rounded"
                          >
                            <X className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-300">{item.description}</p>
                      )}

                      {item.notes && (
                        <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-600">
                          <p className="text-xs text-gray-400 mb-1">Notes:</p>
                          <p className="text-sm text-gray-300">{item.notes}</p>
                        </div>
                      )}

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-purple-600/30 rounded-full text-xs text-purple-200">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {(item.item_image_url || item.location_image_url) && (
                        <div className="flex gap-2">
                          {item.item_image_url && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-600">
                              <img src={item.item_image_url} alt="Item" className="w-full h-full object-cover" />
                            </div>
                          )}
                          {item.location_image_url && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-600">
                              <img src={item.location_image_url} alt="Location" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        📅 Added: {new Date(item.created_at).toLocaleDateString()}
                        {item.updated_at !== item.created_at && (
                          <span className="ml-2">
                            ✏️ Updated: {new Date(item.updated_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <h3 className="text-sm font-medium text-cyan-300 mb-2">Mission Stats</h3>
            <div className="text-sm text-gray-300">
              <p>🚀 Total Items: {items.length}</p>
              <p>⭐ Starred Items: {items.filter(item => item.is_starred).length}</p>
              <p>🔒 Secured Items: {items.filter(item => item.has_pin).length}</p>
              <p>🏷️ Total Tags: {getAllTags().length}</p>
              <p>🔍 Items Shown: {filteredItems.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};