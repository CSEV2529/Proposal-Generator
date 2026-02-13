-- Run this SQL in your Supabase SQL Editor to add folders support
-- This adds a folders table and a folder_id column to projects

-- Create folders table
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX folders_user_id_idx ON folders(user_id);
CREATE INDEX folders_parent_id_idx ON folders(parent_id);

-- Enable RLS
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Policies: all authenticated users can CRUD folders (team-shared)
CREATE POLICY "Authenticated users can view all folders" ON folders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert folders" ON folders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update folders" ON folders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete folders" ON folders
  FOR DELETE USING (auth.role() = 'authenticated');

-- Add folder_id to projects table
ALTER TABLE projects ADD COLUMN folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;
CREATE INDEX projects_folder_id_idx ON projects(folder_id);
