import React, { useState } from 'react';
import { Edit, Camera, MapPin, Star, Lock, Tag, X, Save, Trash2, Calendar, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { StarField } from '../ui/StarField';
import type { Item, NewItem } from '../SpaceTracker';

interface EditItemViewProps {
  item: Item;
  categories: Array<{ id: string; name: string; icon: string }>;
  onBack: () => void;
  onItemUpdated: (updatedItem: Item, oldItem: Item) => void;
  onItemDeleted: (deletedItem: Item) => void;
}

export const EditItemView: React.FC<EditItemViewProps> = ({
  item,
  categories,
  onBack,
  onItemUpdated,
  onItemDeleted
}) => {
  const [editedItem, setEditedItem] = useState<NewItem>({
    name: item.name,
    location: item.location,
    description: item.description || '',
    category: item.category.id,
    itemImage: item.item_image_url,
    locationImage: item.location_image_url,
    isStarred: item.is_starred,
    hasPin: item.has_pin,
    pinCode: '', // Don't pre-fill PIN for security
    tags: item.tags || [],
    notes: item.notes || '',
    expiryDate: '',
    reminderDaysBefore: 7
  });
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'itemImage' | 'locationImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedItem(prev => ({
          ...prev,
          [type]: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !editedItem.tags.includes(currentTag.trim())) {
      setEditedItem(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedItem(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const updateItem = async () => {
    if (!editedItem.name.trim() || !editedItem.location.trim()) {
      return;
    }

    if (editedItem.hasPin && editedItem.pinCode && editedItem.pinCode.length !== 4) {
      alert('PIN must be exactly 4 digits');
      return;
    }

    try {
      setLoading(true);

      const updateData: any = {
        name: editedItem.name.trim(),
        location: editedItem.location.trim(),
        description: editedItem.description.trim(),
        category: editedItem.category,
        item_image_url: editedItem.itemImage,
        location_image_url: editedItem.locationImage,
        is_starred: editedItem.isStarred,
        has_pin: editedItem.hasPin,
        tags: editedItem.tags,
        notes: editedItem.notes.trim(),
        updated_at: new Date().toISOString(),
      };

      // Only update PIN if a new one was provided
      if (editedItem.hasPin && editedItem.pinCode) {
        updateData.pin_code_hash = editedItem.pinCode; // Note: In production, this should be hashed
      }

      const { data, error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', item.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating item:', error);
        alert('Error updating item. Please try again.');
        return;
      }

      const updatedItemWithCategory = {
        ...data,
        category: categories.find(cat => cat.id === data.category) || categories[0]
      };

      onItemUpdated(updatedItemWithCategory, item);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', item.id);

      if (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again.');
        return;
      }

      onItemDeleted(item);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-slate-900 text-white relative">
      <StarField />
      
      <div className="relative z-10 p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-purple-800 hover:bg-purple-700 transition-colors"
          >
            ← Back to Inventory
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Edit className="w-6 h-6" />
            Edit Item
          </h1>
        </div>

        <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 border border-gray-500/30">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Item Name *</label>
              <input
                type="text"
                value={editedItem.name}
                onChange={(e) => setEditedItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Quantum Screwdriver"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Location *</label>
              <input
                type="text"
                value={editedItem.location}
                onChange={(e) => setEditedItem(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Engineering Bay, Drawer 3"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Category</label>
              <select
                value={editedItem.category}
                onChange={(e) => setEditedItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Description</label>
              <textarea
                value={editedItem.description}
                onChange={(e) => setEditedItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details about this item..."
                rows={3}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Notes</label>
              <textarea
                value={editedItem.notes}
                onChange={(e) => setEditedItem(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Personal notes, maintenance info, etc..."
                rows={2}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            {/* Tags Section */}
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              {editedItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {editedItem.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-600/30 rounded-full text-xs text-purple-200 flex items-center gap-1">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-300">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Special Options */}
            <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
              <h3 className="text-sm font-medium text-cyan-300">Special Options</h3>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editedItem.isStarred}
                  onChange={(e) => setEditedItem(prev => ({ ...prev, isStarred: e.target.checked }))}
                  className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                />
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Star this item (mark as favorite)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editedItem.hasPin}
                  onChange={(e) => setEditedItem(prev => ({ ...prev, hasPin: e.target.checked }))}
                  className="w-4 h-4 text-red-400 bg-gray-700 border-gray-600 rounded focus:ring-red-400"
                />
                <Lock className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">Secure with PIN</span>
              </label>

              {editedItem.hasPin && (
                <div className="ml-7">
                  <input
                    type="password"
                    value={editedItem.pinCode}
                    onChange={(e) => setEditedItem(prev => ({ ...prev, pinCode: e.target.value }))}
                    placeholder={item.has_pin ? "Enter new PIN (leave empty to keep current)" : "Enter 4-digit PIN"}
                    maxLength={4}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center tracking-widest focus:border-red-400 focus:outline-none"
                  />
                  {item.has_pin && (
                    <p className="text-xs text-gray-400 mt-1">Leave empty to keep current PIN</p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-cyan-300">Item Photo</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'itemImage')}
                    className="hidden"
                    id="item-photo"
                  />
                  <label
                    htmlFor="item-photo"
                    className="flex flex-col items-center justify-center h-24 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    {editedItem.itemImage ? (
                      <img src={editedItem.itemImage} alt="Item" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <Camera className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">Add Photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-cyan-300">Location Photo</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'locationImage')}
                    className="hidden"
                    id="location-photo"
                  />
                  <label
                    htmlFor="location-photo"
                    className="flex flex-col items-center justify-center h-24 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    {editedItem.locationImage ? (
                      <img src={editedItem.locationImage} alt="Location" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
                        <MapPin className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-400 mt-1">Add Photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={updateItem}
                disabled={!editedItem.name.trim() || !editedItem.location.trim() || (editedItem.hasPin && editedItem.pinCode && editedItem.pinCode.length !== 4) || loading}
                className="flex-1 p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-medium hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                title="Delete Item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {showDeleteConfirm && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                <p className="text-red-200 mb-3">Are you sure you want to delete "{item.name}"? This action cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={deleteItem}
                    disabled={loading}
                    className="flex-1 p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors disabled:opacity-50"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};