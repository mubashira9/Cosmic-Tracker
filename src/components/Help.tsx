import React from 'react';
import { X, Globe, Package, Plus, Search, Star, Lock, Tag, Camera, MapPin, History, FileText, Mail, Rocket, Map, Archive, Users, Route } from 'lucide-react';
import { SpaceBackground } from './ui/SpaceBackground';
import { SpaceButton } from './ui/SpaceButton';
import { SpacePanel } from './ui/SpacePanel';
import { CrewmateIcon, FloatingCrewmate } from './ui/CrewmateIcon';

interface HelpProps {
  onClose: () => void;
}

export const Help: React.FC<HelpProps> = ({ onClose }) => {
  return (
    <SpaceBackground variant="nebula">
      {/* Floating crewmates */}
      <FloatingCrewmate color="red" className="top-20 left-10" />
      <FloatingCrewmate color="blue" className="top-32 right-16" />
      <FloatingCrewmate color="green" className="bottom-40 left-20" />
      <FloatingCrewmate color="yellow" className="bottom-20 right-12" />
      <FloatingCrewmate color="purple" className="top-1/2 right-8" />
      
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 pt-4">
          <SpaceButton
            onClick={onClose}
            variant="secondary"
            size="sm"
          >
            <X className="w-4 h-4" />
            Back
          </SpaceButton>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-white drop-shadow-lg">
            <Globe className="w-7 h-7 text-cyan-400" />
            <span className="text-cyan-400">Mission</span>{' '}
            <span className="text-white">Control</span>{' '}
            <span className="text-white">Guide</span>
            <CrewmateIcon color="cyan" size="md" />
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        <div className="space-y-6">
          {/* Welcome Section */}
          <SpacePanel variant="control" className="p-6" glowing>
            <div className="flex items-center gap-3 mb-4">
              <Rocket className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-cyan-400">Welcome to Cosmic Tracker!</h2>
              <CrewmateIcon color="blue" size="md" />
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your personal space inventory management system. Track, organize, and never lose your items again! 
              Whether it's tools in your workshop, documents in your office, or personal belongings around your home, 
              Cosmic Tracker helps you maintain a digital catalog of everything you own.
            </p>
          </SpacePanel>

          {/* Quick Start */}
          <SpacePanel variant="default" className="p-6">
            <h2 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Start Guide
              <CrewmateIcon color="green" size="sm" />
            </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="bg-cyan-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                <p><strong>Add Your First Item:</strong> Click "Add New Item" and fill in the name and location. This is all you need to get started!</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-cyan-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                <p><strong>Organize with Categories:</strong> Choose from Space Tools, Mission Files, Tech Components, and more to categorize your items.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-cyan-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                <p><strong>Search & Find:</strong> Use the search bar to quickly locate any item by name, location, category, or tags.</p>
              </div>
            </div>
          </SpacePanel>

          {/* Features */}
          <SpacePanel variant="default" className="p-6">
            <h2 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Core Features
              <CrewmateIcon color="purple" size="sm" />
            </h2>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">Photo Documentation</h3>
                  <p className="text-gray-300 text-sm">Add photos of your items and their storage locations for visual reference.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">Star Important Items</h3>
                  <p className="text-gray-300 text-sm">Mark frequently used or important items with a star for quick access.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">PIN Protection</h3>
                  <p className="text-gray-300 text-sm">Secure sensitive items with a 4-digit PIN for privacy protection.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">Custom Tags</h3>
                  <p className="text-gray-300 text-sm">Add custom tags to items for flexible organization and filtering.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Map className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">Visual Maps</h3>
                  <p className="text-gray-300 text-sm">Upload floor plans or storage diagrams and place visual markers to show exactly where items are located.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Archive className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">Virtual Drawers & Boxes</h3>
                  <p className="text-gray-300 text-sm">Create nested containers like "Drawer 2 → Box A → USB drives" for micro-organization.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">Item Groups</h3>
                  <p className="text-gray-300 text-sm">Group related items together into collections or repositories for better organization.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Route className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">Virtual Tour</h3>
                  <p className="text-gray-300 text-sm">Take a virtual walk through your rooms and storage spaces to visualize your inventory.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">Photo Search</h3>
                  <p className="text-gray-300 text-sm">Search for items by uploading a photo and matching it with your inventory images.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <History className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">Activity History</h3>
                  <p className="text-gray-300 text-sm">Track all changes to your items with detailed history logs.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-cyan-400">PDF Export</h3>
                  <p className="text-gray-300 text-sm">Export your complete inventory as a PDF for backup or sharing purposes.</p>
                </div>
              </div>
            </div>
          </SpacePanel>

          {/* Tips & Tricks */}
          <SpacePanel variant="success" className="p-6">
            <h2 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
              💡 Pro Tips
              <CrewmateIcon color="green" size="sm" />
            </h2>
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
                <p><strong>Use Visual Maps:</strong> Upload floor plans and mark item locations for a visual overview of your storage spaces.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">•</span>
                <p><strong>Create Virtual Containers:</strong> Use drawers and boxes to organize small items within larger storage areas.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">•</span>
                <p><strong>Group Related Items:</strong> Create collections for related items like "Photography Equipment" or "Kitchen Gadgets".</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">•</span>
                <p><strong>Regular Updates:</strong> Update item locations when you move things to keep your inventory accurate.</p>
              </div>
            </div>
          </SpacePanel>

          {/* Categories Guide */}
          <SpacePanel variant="warning" className="p-6">
            <h2 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              📦 Category Guide
              <CrewmateIcon color="yellow" size="sm" />
            </h2>
            <div className="grid gap-3 text-gray-300">
              <div className="flex items-center gap-3">
                <span className="text-xl">🛠️</span>
                <div>
                  <strong className="text-cyan-400">Space Tools:</strong>
                  <span className="text-sm ml-2">Hardware, tools, equipment, gadgets</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <strong className="text-cyan-400">Mission Files:</strong>
                  <span className="text-sm ml-2">Documents, papers, certificates, manuals</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🔧</span>
                <div>
                  <strong className="text-cyan-400">Tech Components:</strong>
                  <span className="text-sm ml-2">Electronics, cables, devices, components</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">👕</span>
                <div>
                  <strong className="text-cyan-400">Space Gear:</strong>
                  <span className="text-sm ml-2">Clothing, accessories, wearables</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🎒</span>
                <div>
                  <strong className="text-cyan-400">Personal Items:</strong>
                  <span className="text-sm ml-2">Personal belongings, keepsakes, everyday items</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">👽</span>
                <div>
                  <strong className="text-cyan-400">Alien Artifacts:</strong>
                  <span className="text-sm ml-2">Miscellaneous items that don't fit other categories</span>
                </div>
              </div>
            </div>
          </SpacePanel>

          {/* Support */}
          <SpacePanel variant="warning" className="p-6">
            <h2 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Need Help?
              <CrewmateIcon color="red" size="sm" />
            </h2>
            <div className="text-gray-300">
              <p className="mb-3">
                If you encounter any issues or have suggestions for improvement, feel free to reach out:
              </p>
              <SpacePanel variant="control" className="p-3">
                <p className="text-cyan-400 font-mono">shaikmubashira2006@gmail.com</p>
              </SpacePanel>
              <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                We're here to help make your cosmic inventory management experience stellar! 🚀
                <CrewmateIcon color="cyan" size="sm" />
              </p>
            </div>
          </SpacePanel>

          {/* Version Info */}
          <div className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
            <CrewmateIcon color="blue" size="sm" />
            <p>Cosmic Tracker v1.0 - Your Personal Space Inventory System</p>
            <CrewmateIcon color="green" size="sm" />
          </div>
        </div>
      </div>
    </SpaceBackground>
  );
};