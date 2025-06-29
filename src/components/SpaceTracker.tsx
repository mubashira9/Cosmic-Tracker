import React, { useState, useEffect } from 'react';
import { Globe, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

// Import all the separate components
import { HomeView } from './views/HomeView';
import { InventoryView } from './views/InventoryView';
import { AddItemView } from './views/AddItemView';
import { EditItemView } from './views/EditItemView';
import { HistoryView } from './views/HistoryView';
import { RemindersView } from './views/RemindersView';
import { SettingsView } from './views/SettingsView';
import { VisualMapView } from './views/VisualMapView';
import { Help } from './Help';
import { PinPrompt } from './ui/PinPrompt';
import { StarField } from './ui/StarField';

// Types
export type Item = Database['public']['Tables']['items']['Row'] & {
  category: {
    id: string;
    name: string;
    icon: string;
  };
};

export type ItemHistory = Database['public']['Tables']['item_history']['Row'];
export type ItemReminder = Database['public']['Tables']['item_reminders']['Row'];

export type NewItem = {
  name: string;
  location: string;
  description: string;
  category: string;
  itemImage: string | null;
  locationImage: string | null;
  isStarred: boolean;
  hasPin: boolean;
  pinCode: string;
  tags: string[];
  notes: string;
  expiryDate: string;
  reminderDaysBefore: number;
};

export const categories = [
  { id: 'tools', name: 'Space Tools (Tools)', icon: '🛠️' },
  { id: 'documents', name: 'Mission Files (Documents)', icon: '📋' },
  { id: 'electronics', name: 'Tech Components (Electronics)', icon: '🔧' },
  { id: 'clothing', name: 'Space Gear (Clothing)', icon: '👕' },
  { id: 'personal', name: 'Personal Items (Personal)', icon: '🎒' },
  { id: 'other', name: 'Alien Artifacts (Others)', icon: '👽' }
];

interface SpaceTrackerProps {
  showAboutFirst?: boolean;
  onAboutClose?: () => void;
}

const SpaceTracker: React.FC<SpaceTrackerProps> = ({ showAboutFirst = false, onAboutClose }) => {
  const { user, signOut } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [history, setHistory] = useState<ItemHistory[]>([]);
  const [reminders, setReminders] = useState<ItemReminder[]>([]);
  const [currentView, setCurrentView] = useState(showAboutFirst ? 'help' : 'home');
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [pinPrompt, setPinPrompt] = useState<{ itemId: string; item: Item } | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadItems(),
        loadHistory(),
        loadReminders()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading items:', error);
      return;
    }

    const itemsWithCategories = data.map(item => ({
      ...item,
      category: categories.find(cat => cat.id === item.category) || categories[0]
    }));

    setItems(itemsWithCategories);
  };

  const loadHistory = async () => {
    const { data, error } = await supabase
      .from('item_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading history:', error);
      return;
    }

    setHistory(data || []);
  };

  const loadReminders = async () => {
    const { data, error } = await supabase
      .from('item_reminders')
      .select('*')
      .order('expiry_date', { ascending: true });

    if (error) {
      console.error('Error loading reminders:', error);
      return;
    }

    setReminders(data || []);
  };

  const addToHistory = async (itemId: string | null, itemName: string, action: string, oldValues?: any, newValues?: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('item_history')
        .insert([
          {
            user_id: user.id,
            item_id: itemId,
            item_name: itemName,
            action,
            old_values: oldValues,
            new_values: newValues,
          }
        ]);

      if (error) {
        console.error('Error adding to history:', error);
      } else {
        loadHistory(); // Reload history
      }
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const handleItemClick = (item: Item) => {
    if (item.has_pin && !unlockedItems.has(item.id)) {
      setPinPrompt({ itemId: item.id, item });
    } else {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    }
  };

  const handlePinSubmit = () => {
    if (pinPrompt && enteredPin === pinPrompt.item.pin_code_hash) {
      setUnlockedItems(prev => new Set([...prev, pinPrompt.itemId]));
      setExpandedItem(pinPrompt.itemId);
      setPinPrompt(null);
      setEnteredPin('');
    } else {
      alert('Incorrect PIN');
      setEnteredPin('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setExpandedItem(null);
    setEditingItem(null);
  };

  const handleHelpClose = () => {
    setCurrentView('home');
    if (onAboutClose) {
      onAboutClose();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <StarField />
        <div className="relative z-10 text-center">
          <Globe className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" style={{animationDuration: '2s'}} />
          <p className="text-white text-lg">Loading your cosmic inventory...</p>
        </div>
      </div>
    );
  }

  // PIN Prompt Modal
  if (pinPrompt) {
    return (
      <PinPrompt
        item={pinPrompt.item}
        enteredPin={enteredPin}
        setEnteredPin={setEnteredPin}
        onSubmit={handlePinSubmit}
        onCancel={() => {
          setPinPrompt(null);
          setEnteredPin('');
        }}
      />
    );
  }

  // Route to different views
  const renderView = () => {
    switch (currentView) {
      case 'help':
        return <Help onClose={handleHelpClose} />;
      
      case 'inventory':
        return (
          <InventoryView
            items={items}
            categories={categories}
            expandedItem={expandedItem}
            unlockedItems={unlockedItems}
            onBack={() => handleViewChange('home')}
            onItemClick={handleItemClick}
            onExpandedItemChange={setExpandedItem}
            onEditItem={(item) => {
              setEditingItem(item);
              setCurrentView('edit');
            }}
            onSignOut={handleSignOut}
          />
        );
      
      case 'add':
        return (
          <AddItemView
            categories={categories}
            onBack={() => handleViewChange('home')}
            onItemAdded={(newItem) => {
              setItems(prev => [newItem, ...prev]);
              addToHistory(newItem.id, newItem.name, 'created', null, newItem);
              handleViewChange('home');
            }}
            user={user}
          />
        );
      
      case 'edit':
        return editingItem ? (
          <EditItemView
            item={editingItem}
            categories={categories}
            onBack={() => handleViewChange('inventory')}
            onItemUpdated={(updatedItem, oldItem) => {
              setItems(prev => prev.map(item => 
                item.id === updatedItem.id ? updatedItem : item
              ));
              addToHistory(updatedItem.id, updatedItem.name, 'updated', oldItem, updatedItem);
              setEditingItem(null);
              handleViewChange('inventory');
            }}
            onItemDeleted={(deletedItem) => {
              setItems(prev => prev.filter(item => item.id !== deletedItem.id));
              addToHistory(null, deletedItem.name, 'deleted', deletedItem, null);
              setEditingItem(null);
              handleViewChange('inventory');
            }}
          />
        ) : null;
      
      case 'history':
        return (
          <HistoryView
            history={history}
            onBack={() => handleViewChange('home')}
            onSignOut={handleSignOut}
          />
        );
      
      case 'reminders':
        return (
          <RemindersView
            reminders={reminders}
            items={items}
            onBack={() => handleViewChange('home')}
            onRemindersUpdated={loadReminders}
            onSignOut={handleSignOut}
            user={user}
          />
        );
      
      case 'settings':
        return (
          <SettingsView
            items={items}
            onBack={() => handleViewChange('home')}
            onSignOut={handleSignOut}
            user={user}
          />
        );

      case 'visual-map':
        return (
          <VisualMapView
            items={items}
            onBack={() => handleViewChange('home')}
            onSignOut={handleSignOut}
            user={user}
          />
        );
      
      default:
        return (
          <HomeView
            items={items}
            categories={categories}
            reminders={reminders}
            onViewChange={handleViewChange}
            onItemClick={handleItemClick}
            onSignOut={handleSignOut}
            user={user}
          />
        );
    }
  };

  return renderView();
};

export default SpaceTracker;