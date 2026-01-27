import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface SavedProject {
  id: string;
  user_id: string;
  name: string;
  customer_name: string;
  project_data: string; // JSON stringified Proposal
  status: 'draft' | 'sent' | 'accepted' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
}
