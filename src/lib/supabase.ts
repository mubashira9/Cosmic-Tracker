import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      items: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          location: string;
          description: string | null;
          category: string;
          item_image_url: string | null;
          location_image_url: string | null;
          is_starred: boolean;
          has_pin: boolean;
          pin_code_hash: string | null;
          tags: string[];
          notes: string;
          last_moved_at: string;
          created_at: string;
          updated_at: string;
          group_id: string | null;
          container_id: string | null;
          encryption_salt: string | null;
          is_pin_protected: boolean;
          pin_encrypted_data: string | null;
          pin_salt: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          location: string;
          description?: string | null;
          category?: string;
          item_image_url?: string | null;
          location_image_url?: string | null;
          is_starred?: boolean;
          has_pin?: boolean;
          pin_code_hash?: string | null;
          tags?: string[];
          notes?: string;
          last_moved_at?: string;
          created_at?: string;
          updated_at?: string;
          group_id?: string | null;
          container_id?: string | null;
          encryption_salt?: string | null;
          is_pin_protected?: boolean;
          pin_encrypted_data?: string | null;
          pin_salt?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          location?: string;
          description?: string | null;
          category?: string;
          item_image_url?: string | null;
          location_image_url?: string | null;
          is_starred?: boolean;
          has_pin?: boolean;
          pin_code_hash?: string | null;
          tags?: string[];
          notes?: string;
          last_moved_at?: string;
          created_at?: string;
          updated_at?: string;
          group_id?: string | null;
          container_id?: string | null;
          encryption_salt?: string | null;
          is_pin_protected?: boolean;
          pin_encrypted_data?: string | null;
          pin_salt?: string | null;
        };
      };
      item_history: {
        Row: {
          id: string;
          user_id: string;
          item_id: string | null;
          item_name: string;
          action: string;
          old_values: any;
          new_values: any;
          created_at: string;
          encryption_salt: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id?: string | null;
          item_name: string;
          action: string;
          old_values?: any;
          new_values?: any;
          created_at?: string;
          encryption_salt?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string | null;
          item_name?: string;
          action?: string;
          old_values?: any;
          new_values?: any;
          created_at?: string;
          encryption_salt?: string | null;
        };
      };
      item_reminders: {
        Row: {
          id: string;
          user_id: string;
          item_id: string;
          expiry_date: string;
          reminder_days_before: number;
          is_active: boolean;
          reminder_sent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_id: string;
          expiry_date: string;
          reminder_days_before?: number;
          is_active?: boolean;
          reminder_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_id?: string;
          expiry_date?: string;
          reminder_days_before?: number;
          is_active?: boolean;
          reminder_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      visual_maps: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          image_url: string | null;
          markers: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          image_url?: string | null;
          markers?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          image_url?: string | null;
          markers?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      item_groups: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          color: string;
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          color?: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          color?: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      virtual_containers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          parent_id: string | null;
          level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          parent_id?: string | null;
          level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          parent_id?: string | null;
          level?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};