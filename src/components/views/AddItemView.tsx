import React, { useState } from 'react';
import { Rocket, Camera, MapPin, Star, Lock, Tag, X, Satellite, Calendar, Bell } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { StarField } from '../ui/StarField';
import type { NewItem, Item } from '../SpaceTracker';

interface AddItemViewProps {
  categories: Array<{ id: string; name: string; icon: string }>;
  onBack: () => void;
  onItemAdded: (item: Item) => void;
  user: User | null;
}

export const AddItemView: React.FC<AddItemViewProps> = ({
  categories,
  onBack,
  onItemAdded,
  user
}) => {
  const [newItem, setNewItem] = useState<NewItem>({
    name: '',
    location: '',
    description: '',
    category: 'tools',
    itemImage: null,
    locationImage: null,
    isStarred: false,
    hasPin: false,
    pinCode: '',
    tags: [],
    notes: '',
    expiryDate: '',
    reminderDaysBefore: 7
  });
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'itemImage' | 'locationImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewItem(prev => ({
          ...prev,
          [type]: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !newItem.tags.includes(currentTag.trim())) {
      setNewItem(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewItem(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addItem = async () => {
    if (!newItem.name.trim() || !newItem.location.trim() || !user) {
      return;
    }

    if (newItem.hasPin && newItem.pinCode.length !== 4) {
      alert('PIN must be exactly 4 digits');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('items')
        .insert([
          {
            user_id: user.id,
            name: newItem.name.trim(),
            location: newItem.location.trim(),
            description: newItem.description.trim(),
            category: newItem.category,
            item_image_url: newItem.itemImage,
            location_image_url: newItem.locationImage,
            is_starred: newItem.isStarred,
            has_pin: newItem.hasPin,
            pin_code_hash: newItem.hasPin ? newItem.pinCode : null, // Note: In production, this should be hashed
            tags: newItem.tags,
            notes: newItem.notes.trim(),
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding item:', error);
        alert('Error adding item. Please try again.');
        return;
      }

      // Add reminder if expiry date is set
      if (newItem.expiryDate) {
        const { error: reminderError } = await supabase
          .from('item_reminders')
          .insert([
            {
              user_id: user.id,
              item_id: data.id,
              expiry_date: newItem.expiryDate,
              reminder_days_before: newItem.reminderDaysBefore,
              is_active: true,
            }
          ]);

        if (reminderError) {
          console.error('Error adding reminder:', reminderError);
          // Don't fail the whole operation for reminder error
        }
      }

      const itemWithCategory = {
        ...data,
        category: categories.find(cat => cat.id === data.category) || categories[0]
      };

      onItemAdded(itemWithCategory);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item. Please try again.');
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
            ← Back to Command Center
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            Add New Item
          </h1>
        </div>

        <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-2xl p-6 border border-gray-500/30">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Item Name *</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Quantum Screwdriver"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Location *</label>
              <input
                type="text"
                value={newItem.location}
                onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Engineering Bay, Drawer 3"
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
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
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details about this item..."
                rows={3}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-cyan-300">Notes</label>
              <textarea
                value={newItem.notes}
                onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Personal notes, maintenance info, etc..."
                rows={2}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            {/* Expiry Date and Reminder */}
            <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
              <h3 className="text-sm font-medium text-cyan-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Expiry & Reminders
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {newItem.expiryDate && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    <Bell className="w-4 h-4 inline mr-1" />
                    Remind me (days before expiry)
                  </label>
                  <select
                    value={newItem.reminderDaysBefore}
                    onChange={(e) => setNewItem(prev => ({ ...prev, reminderDaysBefore: parseInt(e.target.value) }))}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value={1}>1 day before</option>
                    <option value={3}>3 days before</option>
                    <option value={7}>1 week before</option>
                    <option value={14}>2 weeks before</option>
                    <option value={30}>1 month before</option>
                  </select>
                </div>
              )}
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
              {newItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {newItem.tags.map(tag => (
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
                  checked={newItem.isStarred}
                  onChange={(e) => setNewItem(prev => ({ ...prev, isStarred: e.target.checked }))}
                  className="w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400"
                />
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Star this item (mark as favorite)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItem.hasPin}
                  onChange={(e) => setNewItem(prev => ({ ...prev, hasPin: e.target.checked }))}
                  className="w-4 h-4 text-red-400 bg-gray-700 border-gray-600 rounded focus:ring-red-400"
                />
                <Lock className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">Secure with PIN (for very personal items)</span>
              </label>

              {newItem.hasPin && (
                <div className="ml-7">
                  <input
                    type="password"
                    value={newItem.pinCode}
                    onChange={(e) => setNewItem(prev => ({ ...prev, pinCode: e.target.value }))}
                    placeholder="Enter 4-digit PIN"
                    maxLength={4}
                    className="w-32 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-center tracking-widest focus:border-red-400 focus:outline-none"
                  />
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
                    {newItem.itemImage ? (
                      <img src={newItem.itemImage} alt="Item" className="w-full h-full object-cover rounded-lg" />
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
                    {newItem.locationImage ? (
                      <img src={newItem.locationImage} alt="Location" className="w-full h-full object-cover rounded-lg" />
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

            <button
              onClick={addItem}
              disabled={!newItem.name.trim() || !newItem.location.trim() || (newItem.hasPin && newItem.pinCode.length !== 4) || loading}
              className="w-full p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-medium hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Satellite className="w-5 h-5" />
                  Add to Database
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};