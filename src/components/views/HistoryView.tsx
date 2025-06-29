import React from 'react';
import { History, LogOut, Package, Edit, Trash2, Plus, ArrowRight } from 'lucide-react';
import { StarField } from '../ui/StarField';
import type { ItemHistory } from '../SpaceTracker';

interface HistoryViewProps {
  history: ItemHistory[];
  onBack: () => void;
  onSignOut: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onBack,
  onSignOut
}) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <Plus className="w-4 h-4 text-green-400" />;
      case 'updated':
        return <Edit className="w-4 h-4 text-blue-400" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4 text-red-400" />;
      case 'moved':
        return <ArrowRight className="w-4 h-4 text-yellow-400" />;
      default:
        return <Package className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-green-300 bg-green-900/20 border-green-500/30';
      case 'updated':
        return 'text-blue-300 bg-blue-900/20 border-blue-500/30';
      case 'deleted':
        return 'text-red-300 bg-red-900/20 border-red-500/30';
      case 'moved':
        return 'text-yellow-300 bg-yellow-900/20 border-yellow-500/30';
      default:
        return 'text-gray-300 bg-gray-900/20 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderChanges = (oldValues: any, newValues: any, action: string) => {
    if (action === 'created' || action === 'deleted') {
      return null;
    }

    if (!oldValues || !newValues) {
      return null;
    }

    const changes = [];
    const keys = ['name', 'location', 'category', 'description', 'notes', 'is_starred', 'has_pin'];
    
    for (const key of keys) {
      if (oldValues[key] !== newValues[key]) {
        let oldVal = oldValues[key];
        let newVal = newValues[key];
        
        // Format boolean values
        if (typeof oldVal === 'boolean') {
          oldVal = oldVal ? 'Yes' : 'No';
          newVal = newVal ? 'Yes' : 'No';
        }
        
        // Format category
        if (key === 'category') {
          // Assuming category is stored as ID, you might want to map it to name
          // For now, just display the ID
        }
        
        changes.push(
          <div key={key} className="text-xs text-gray-400 mt-1">
            <span className="capitalize">{key.replace('_', ' ')}:</span>
            <span className="text-red-300 line-through ml-1">{oldVal || 'Empty'}</span>
            <span className="mx-1">→</span>
            <span className="text-green-300">{newVal || 'Empty'}</span>
          </div>
        );
      }
    }

    return changes.length > 0 ? (
      <div className="mt-2 p-2 bg-gray-800/50 rounded border border-gray-600">
        <p className="text-xs text-gray-300 font-medium mb-1">Changes:</p>
        {changes}
      </div>
    ) : null;
  };

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
            <History className="w-6 h-6" />
            Activity History
          </h1>
          <button
            onClick={onSignOut}
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No activity history yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Start adding, editing, or moving items to see your activity here.
              </p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className={`bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border ${getActionColor(entry.action)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(entry.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-cyan-300 truncate">
                        {entry.item_name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getActionColor(entry.action)}`}>
                        {entry.action}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2">
                      {formatDate(entry.created_at)}
                    </p>

                    {entry.action === 'created' && (
                      <p className="text-sm text-green-300">
                        Item was added to your inventory
                      </p>
                    )}

                    {entry.action === 'deleted' && (
                      <p className="text-sm text-red-300">
                        Item was removed from your inventory
                      </p>
                    )}

                    {entry.action === 'moved' && entry.old_values?.location && entry.new_values?.location && (
                      <div className="text-sm">
                        <p className="text-yellow-300">Location changed:</p>
                        <p className="text-xs text-gray-400 mt-1">
                          From: <span className="text-red-300">{entry.old_values.location}</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          To: <span className="text-green-300">{entry.new_values.location}</span>
                        </p>
                      </div>
                    )}

                    {renderChanges(entry.old_values, entry.new_values, entry.action)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <h3 className="text-sm font-medium text-cyan-300 mb-2">Activity Summary</h3>
            <div className="text-sm text-gray-300">
              <p>📊 Total Activities: {history.length}</p>
              <p>➕ Items Created: {history.filter(h => h.action === 'created').length}</p>
              <p>✏️ Items Updated: {history.filter(h => h.action === 'updated').length}</p>
              <p>🗑️ Items Deleted: {history.filter(h => h.action === 'deleted').length}</p>
              <p>📦 Items Moved: {history.filter(h => h.action === 'moved').length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};