/*
  # Create visual_maps table

  1. New Tables
    - `visual_maps`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text, name of the visual map)
      - `image_url` (text, URL to the map image)
      - `markers` (jsonb, array of marker data with positions and item references)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `visual_maps` table
    - Add policy for authenticated users to manage their own visual maps

  3. Indexes
    - Add index on user_id for efficient querying
    - Add index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS visual_maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  image_url text,
  markers jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint
ALTER TABLE visual_maps 
ADD CONSTRAINT visual_maps_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE visual_maps ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own visual maps"
  ON visual_maps
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS visual_maps_user_id_idx ON visual_maps(user_id);
CREATE INDEX IF NOT EXISTS visual_maps_created_at_idx ON visual_maps(created_at DESC);