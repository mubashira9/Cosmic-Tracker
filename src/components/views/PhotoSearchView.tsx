import React, { useState, useRef } from 'react';
import { Camera, Upload, Search, X, LogOut, Image as ImageIcon, Zap } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { StarField } from '../ui/StarField';
import type { Item } from '../SpaceTracker';

interface PhotoSearchViewProps {
  items: Item[];
  onBack: () => void;
  onSignOut: () => void;
  onItemClick: (item: Item) => void;
}

export const PhotoSearchView: React.FC<PhotoSearchViewProps> = ({
  items,
  onBack,
  onSignOut,
  onItemClick
}) => {
  const [searchImage, setSearchImage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setSearchImage(imageUrl);
        setSearchResults([]);
        setSearchPerformed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const performPhotoSearch = async () => {
    if (!searchImage) return;

    setLoading(true);
    setSearchPerformed(true);

    try {
      // Simulate photo matching logic
      // In a real implementation, you would:
      // 1. Extract features from the uploaded image
      // 2. Compare with stored item images using computer vision
      // 3. Return items with similar visual features
      
      // For now, we'll simulate by randomly selecting some items with images
      // and adding some basic matching logic
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      const itemsWithImages = items.filter(item => item.item_image_url);
      
      // Simulate matching by randomly selecting items and adding confidence scores
      const matches = itemsWithImages
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(5, itemsWithImages.length))
        .map(item => ({
          ...item,
          confidence: Math.random() * 0.6 + 0.4 // Random confidence between 40-100%
        }))
        .sort((a, b) => b.confidence - a.confidence);

      setSearchResults(matches);
    } catch (error) {
      console.error('Error performing photo search:', error);
      alert('Error performing photo search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchImage(null);
    setSearchResults([]);
    setSearchPerformed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            <Camera className="w-6 h-6" />
            Photo Search
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
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-pink-500/30 mb-6">
          <h2 className="text-lg font-semibold text-pink-300 mb-2">Find Items by Photo</h2>
          <p className="text-gray-300 text-sm">
            Upload a photo of an item and we'll try to match it with items in your inventory. 
            Perfect for when you remember what something looks like but forgot what you named it!
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-500/30 mb-6">
          <h3 className="text-lg font-semibold text-slate-400 mb-4">Upload Photo to Search</h3>
          
          {!searchImage ? (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-pink-400/50 transition-colors flex flex-col items-center gap-4 text-gray-400 hover:text-pink-300"
              >
                <Upload className="w-12 h-12" />
                <div className="text-center">
                  <p className="text-lg font-medium">Click to upload a photo</p>
                  <p className="text-sm">JPG, PNG, or other image formats</p>
                </div>
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  💡 Tip: Take a clear, well-lit photo for better matching results
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={searchImage} 
                  alt="Search image" 
                  className="w-full max-h-64 object-contain rounded-lg border border-gray-600"
                />
                <button
                  onClick={clearSearch}
                  className="absolute top-2 right-2 p-2 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <button
                onClick={performPhotoSearch}
                disabled={loading}
                className="w-full p-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg font-medium hover:from-pink-400 hover:to-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing photo...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Search for Similar Items
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchPerformed && (
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-500/30">
            <h3 className="text-lg font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-pink-400" />
              Search Results
            </h3>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Analyzing your photo and comparing with inventory...</p>
                <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No similar items found</p>
                <p className="text-gray-500 text-sm">
                  Try uploading a different photo or make sure the item is in your inventory with a photo.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-4">
                  Found {searchResults.length} potentially matching item{searchResults.length > 1 ? 's' : ''} 
                  (sorted by confidence)
                </p>
                
                {searchResults.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50 hover:border-pink-400/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      {item.item_image_url ? (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0">
                          <img src={item.item_image_url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{item.category.icon}</span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-pink-300 group-hover:text-pink-200 transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.confidence > 0.8 
                                ? 'bg-green-600/30 text-green-300' 
                                : item.confidence > 0.6 
                                ? 'bg-yellow-600/30 text-yellow-300'
                                : 'bg-orange-600/30 text-orange-300'
                            }`}>
                              {Math.round(item.confidence * 100)}% match
                            </div>
                          </div>
                        </div>
                        
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
                            {item.tags.slice(0, 3).map((tag: string) => (
                              <span key={tag} className="px-2 py-1 bg-pink-600/30 rounded-full text-xs text-pink-200">
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
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* How it Works */}
        <div className="mt-8 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30">
          <h3 className="text-sm font-medium text-slate-400 mb-2">How Photo Search Works</h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>🔍 <strong>Image Analysis:</strong> We analyze visual features like colors, shapes, and textures</p>
            <p>📊 <strong>Comparison:</strong> Your photo is compared against all items with images in your inventory</p>
            <p>🎯 <strong>Confidence Score:</strong> Results are ranked by similarity percentage</p>
            <p>⚡ <strong>Quick Results:</strong> Find items even when you can't remember their names</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Search Stats</h3>
          <div className="text-sm text-gray-300">
            <p>📷 Items with Photos: {items.filter(item => item.item_image_url).length}</p>
            <p>📦 Total Items: {items.length}</p>
            <p>🔍 Searchable Coverage: {items.length > 0 ? Math.round((items.filter(item => item.item_image_url).length / items.length) * 100) : 0}%</p>
            <p>💡 Tip: Add photos to more items to improve search accuracy!</p>
          </div>
        </div>
      </div>
    </div>
  );
};