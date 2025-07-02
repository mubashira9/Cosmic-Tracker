/*
  # Add Groups and Virtual Containers Support

  1. New Tables
    - `item_groups` - For organizing related items into collections
    - `virtual_containers` - For nested drawer/box organization
    
  2. Table Updates
    - Add `group_id` and `container_id` to items table
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
*/

-- Create item_groups table
CREATE TABLE IF NOT EXISTS item_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT 'blue',
  icon text DEFAULT '📦',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create virtual_containers table
CREATE TABLE IF NOT EXISTS virtual_containers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  parent_id uuid,
  level integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add group_id and container_id to items table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'group_id'
  ) THEN
    ALTER TABLE items ADD COLUMN group_id uuid;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'container_id'
  ) THEN
    ALTER TABLE items ADD COLUMN container_id uuid;
  END IF;
END $$;

-- Add foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'item_groups_user_id_fkey'
  ) THEN
    ALTER TABLE item_groups ADD CONSTRAINT item_groups_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'virtual_containers_user_id_fkey'
  ) THEN
    ALTER TABLE virtual_containers ADD CONSTRAINT virtual_containers_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'virtual_containers_parent_id_fkey'
  ) THEN
    ALTER TABLE virtual_containers ADD CONSTRAINT virtual_containers_parent_id_fkey 
    FOREIGN KEY (parent_id) REFERENCES virtual_containers(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'items_group_id_fkey'
  ) THEN
    ALTER TABLE items ADD CONSTRAINT items_group_id_fkey 
    FOREIGN KEY (group_id) REFERENCES item_groups(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'items_container_id_fkey'
  ) THEN
    ALTER TABLE items ADD CONSTRAINT items_container_id_fkey 
    FOREIGN KEY (container_id) REFERENCES virtual_containers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS item_groups_user_id_idx ON item_groups (user_id);
CREATE INDEX IF NOT EXISTS item_groups_created_at_idx ON item_groups (created_at DESC);
CREATE INDEX IF NOT EXISTS virtual_containers_user_id_idx ON virtual_containers (user_id);
CREATE INDEX IF NOT EXISTS virtual_containers_parent_id_idx ON virtual_containers (parent_id);
CREATE INDEX IF NOT EXISTS items_group_id_idx ON items (group_id);
CREATE INDEX IF NOT EXISTS items_container_id_idx ON items (container_id);

-- Enable RLS
ALTER TABLE item_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_containers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for item_groups
CREATE POLICY "Users can manage their own groups"
  ON item_groups
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for virtual_containers
CREATE POLICY "Users can manage their own containers"
  ON virtual_containers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);