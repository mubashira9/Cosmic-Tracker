import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging for environment variables
console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[PRESENT]' : '[MISSING]');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. Please check your VITE_SUPABASE_URL in .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'space-tracker-app'
    }
  }
});

// Test connection on initialization
supabase.from('item_history').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful');
    }
  })
  .catch((error) => {
    console.error('Supabase connection test error:', error);
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