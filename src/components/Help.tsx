import React from 'react';
import { X, Globe, Package, Plus, Search, Star, Lock, Tag, Camera, MapPin, History, FileText, Mail, Rocket } from 'lucide-react';

interface HelpProps {
  onClose: () => void;
}

const StarField = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(100)].map((_, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full animate-pulse"
        style={{
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 3}s`
        }}
      />
    ))}
  </div>
);

export const Help: React.FC<HelpProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative">
      <StarField />
      
      <div className="relative z-10 p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-purple-800 hover:bg-purple-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="w-7 h-7 text-cyan-400" />
            Mission Control Guide
          </h1>
          <div className="w-9 h-9" /> {/* Spacer */}
        </div>

        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30">
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-cyan-300">Welcome to Cosmic Tracker!</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your personal space inventory management system. Track, organize, and never lose your items again! 
              Whether it's tools in your workshop, documents in your office, or personal belongings around your home, 
              Cosmic Tracker helps you maintain a digital catalog of everything you own.
            </p>
          </div>

          {/* Quick Start */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Start Guide
            </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                <p><strong>Add Your First Item:</strong> Click "Add New Item" and fill in the name and location. This is all you need to get started!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                <p><strong>Organize with Categories:</strong> Choose from Space Tools, Mission Files, Tech Components, and more to categorize your items.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                <p><strong>Search & Find:</strong> Use the search bar to quickly locate any item by name, location, category, or tags.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Core Features
            </h2>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-300">Photo Documentation</h3>
                  <p className="text-gray-300 text-sm">Add photos of your items and their storage locations for visual reference.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-300">Star Important Items</h3>
                  <p className="text-gray-300 text-sm">Mark frequently used or important items with a star for quick access.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-300">PIN Protection</h3>
                  <p className="text-gray-300 text-sm">Secure sensitive items with a 4-digit PIN for privacy protection.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-300">Custom Tags</h3>
                  <p className="text-gray-300 text-sm">Add custom tags to items for flexible organization and filtering.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <History className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-300">Activity History</h3>
                  <p className="text-gray-300 text-sm">Track all changes to your items with detailed history logs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-300">PDF Export</h3>
                  <p className="text-gray-300 text-sm">Export your inventory as a PDF for backup or sharing purposes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips & Tricks */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <h2 className="text-xl font-bold text-green-300 mb-4">💡 Pro Tips</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-green-400">•</span>
                <p><strong>Be Specific with Locations:</strong> Instead of "bedroom," try "bedroom closet, top shelf, left side" for precise tracking.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">•</span>
                <p><strong>Use Descriptive Tags:</strong> Add tags like "seasonal," "fragile," "valuable," or "frequently-used" for better organization.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">•</span>
                <p><strong>Take Clear Photos:</strong> Good lighting and multiple angles help you identify items quickly later.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">•</span>
                <p><strong>Regular Updates:</strong> Update item locations when you move things to keep your inventory accurate.</p>
              </div>
            </div>
          </div>

          {/* Categories Guide */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
            <h2 className="text-xl font-bold text-yellow-300 mb-4">📦 Category Guide</h2>
            <div className="grid gap-3 text-gray-300">
              <div className="flex items-center gap-3">
                <span className="text-xl">🛠️</span>
                <div>
                  <strong className="text-cyan-300">Space Tools:</strong>
                  <span className="text-sm ml-2">Hardware, tools, equipment, gadgets</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <strong className="text-cyan-300">Mission Files:</strong>
                  <span className="text-sm ml-2">Documents, papers, certificates, manuals</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🔧</span>
                <div>
                  <strong className="text-cyan-300">Tech Components:</strong>
                  <span className="text-sm ml-2">Electronics, cables, devices, components</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">👕</span>
                <div>
                  <strong className="text-cyan-300">Space Gear:</strong>
                  <span className="text-sm ml-2">Clothing, accessories, wearables</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🎒</span>
                <div>
                  <strong className="text-cyan-300">Personal Items:</strong>
                  <span className="text-sm ml-2">Personal belongings, keepsakes, everyday items</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">👽</span>
                <div>
                  <strong className="text-cyan-300">Alien Artifacts:</strong>
                  <span className="text-sm ml-2">Miscellaneous items that don't fit other categories</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30">
            <h2 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Need Help?
            </h2>
            <div className="text-gray-300">
              <p className="mb-3">
                If you encounter any issues or have suggestions for improvement, feel free to reach out:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                <p className="text-cyan-300 font-mono">shaikmubashira2006@gmail.com</p>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                We're here to help make your cosmic inventory management experience stellar! 🚀
              </p>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center text-gray-500 text-sm">
            <p>Cosmic Tracker v1.0 - Your Personal Space Inventory System</p>
          </div>
        </div>
      </div>
    </div>
  );
};