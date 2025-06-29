import React, { useState } from 'react';
import { Bell, LogOut, Calendar, Plus, X, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { StarField } from '../ui/StarField';
import type { ItemReminder, Item } from '../SpaceTracker';

interface RemindersViewProps {
  reminders: ItemReminder[];
  items: Item[];
  onBack: () => void;
  onRemindersUpdated: () => void;
  onSignOut: () => void;
  user: User | null;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  items,
  onBack,
  onRemindersUpdated,
  onSignOut,
  user
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ItemReminder | null>(null);
  const [newReminder, setNewReminder] = useState({
    itemId: '',
    expiryDate: '',
    reminderDaysBefore: 7,
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getReminderStatus = (reminder: ItemReminder) => {
    const daysUntil = getDaysUntilExpiry(reminder.expiry_date);
    
    if (daysUntil < 0) {
      return { status: 'expired', color: 'text-red-400', bgColor: 'bg-red-900/20 border-red-500/30' };
    } else if (daysUntil <= reminder.reminder_days_before) {
      return { status: 'due', color: 'text-orange-400', bgColor: 'bg-orange-900/20 border-orange-500/30' };
    } else {
      return { status: 'upcoming', color: 'text-green-400', bgColor: 'bg-green-900/20 border-green-500/30' };
    }
  };

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  const addReminder = async () => {
    if (!newReminder.itemId || !newReminder.expiryDate || !user) {
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('item_reminders')
        .insert([
          {
            user_id: user.id,
            item_id: newReminder.itemId,
            expiry_date: newReminder.expiryDate,
            reminder_days_before: newReminder.reminderDaysBefore,
            is_active: newReminder.isActive,
          }
        ]);

      if (error) {
        console.error('Error adding reminder:', error);
        alert('Error adding reminder. Please try again.');
        return;
      }

      setNewReminder({
        itemId: '',
        expiryDate: '',
        reminderDaysBefore: 7,
        isActive: true
      });
      setShowAddForm(false);
      onRemindersUpdated();
    } catch (error) {
      console.error('Error adding reminder:', error);
      alert('Error adding reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateReminder = async (reminder: ItemReminder, updates: Partial<ItemReminder>) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('item_reminders')
        .update(updates)
        .eq('id', reminder.id);

      if (error) {
        console.error('Error updating reminder:', error);
        alert('Error updating reminder. Please try again.');
        return;
      }

      onRemindersUpdated();
    } catch (error) {
      console.error('Error updating reminder:', error);
      alert('Error updating reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('item_reminders')
        .delete()
        .eq('id', reminderId);

      if (error) {
        console.error('Error deleting reminder:', error);
        alert('Error deleting reminder. Please try again.');
        return;
      }

      onRemindersUpdated();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('Error deleting reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    const daysA = getDaysUntilExpiry(a.expiry_date);
    const daysB = getDaysUntilExpiry(b.expiry_date);
    return daysA - daysB;
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
            <Bell className="w-6 h-6" />
            Reminders
          </h1>
          <button
            onClick={onSignOut}
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full p-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-medium hover:from-cyan-400 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Reminder
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-cyan-300">Add New Reminder</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-cyan-300">Select Item</label>
                <select
                  value={newReminder.itemId}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, itemId: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="">Choose an item...</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.category.icon} {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-cyan-300">Expiry Date</label>
                <input
                  type="date"
                  value={newReminder.expiryDate}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-cyan-300">Remind me (days before)</label>
                <select
                  value={newReminder.reminderDaysBefore}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, reminderDaysBefore: parseInt(e.target.value) }))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value={1}>1 day before</option>
                  <option value={3}>3 days before</option>
                  <option value={7}>1 week before</option>
                  <option value={14}>2 weeks before</option>
                  <option value={30}>1 month before</option>
                </select>
              </div>

              <button
                onClick={addReminder}
                disabled={!newReminder.itemId || !newReminder.expiryDate || loading}
                className="w-full p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg font-medium hover:from-green-400 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    Add Reminder
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {sortedReminders.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No reminders set yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Add reminders for items with expiry dates to stay organized.
              </p>
            </div>
          ) : (
            sortedReminders.map((reminder) => {
              const status = getReminderStatus(reminder);
              const daysUntil = getDaysUntilExpiry(reminder.expiry_date);
              
              return (
                <div
                  key={reminder.id}
                  className={`bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-4 border ${status.bgColor}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-cyan-300">
                          {getItemName(reminder.item_id)}
                        </h3>
                        {!reminder.is_active && (
                          <span className="px-2 py-1 bg-gray-600/50 rounded-full text-xs text-gray-300">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">
                            Expires: {new Date(reminder.expiry_date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className={`flex items-center gap-2 ${status.color}`}>
                          {status.status === 'expired' && <AlertTriangle className="w-4 h-4" />}
                          {status.status === 'due' && <Bell className="w-4 h-4" />}
                          {status.status === 'upcoming' && <Calendar className="w-4 h-4" />}
                          
                          <span>
                            {daysUntil < 0 
                              ? `Expired ${Math.abs(daysUntil)} day${Math.abs(daysUntil) > 1 ? 's' : ''} ago`
                              : daysUntil === 0
                              ? 'Expires today!'
                              : `${daysUntil} day${daysUntil > 1 ? 's' : ''} remaining`
                            }
                          </span>
                        </div>

                        <p className="text-xs text-gray-400">
                          Reminder set for {reminder.reminder_days_before} day{reminder.reminder_days_before > 1 ? 's' : ''} before expiry
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => updateReminder(reminder, { is_active: !reminder.is_active })}
                        className={`p-2 rounded-lg transition-colors ${
                          reminder.is_active 
                            ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30' 
                            : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                        }`}
                        title={reminder.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                        title="Delete Reminder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {reminders.length > 0 && (
          <div className="mt-8 bg-black bg-opacity-30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
            <h3 className="text-sm font-medium text-cyan-300 mb-2">Reminder Summary</h3>
            <div className="text-sm text-gray-300">
              <p>📊 Total Reminders: {reminders.length}</p>
              <p>✅ Active Reminders: {reminders.filter(r => r.is_active).length}</p>
              <p>🔔 Due Soon: {reminders.filter(r => {
                const days = getDaysUntilExpiry(r.expiry_date);
                return days <= r.reminder_days_before && days >= 0 && r.is_active;
              }).length}</p>
              <p>⚠️ Expired: {reminders.filter(r => getDaysUntilExpiry(r.expiry_date) < 0).length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};