import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client during build - it won't be used
    if (typeof window === 'undefined') {
      return {
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
          signInWithPassword: async () => ({ error: { message: 'Not configured' } }),
          signUp: async () => ({ error: { message: 'Not configured' } }),
          signOut: async () => ({ error: null }),
        },
        from: () => ({
          select: () => ({ order: () => ({ data: [], error: null }), eq: () => ({ single: () => ({ data: null, error: null }) }) }),
          insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }) }),
          update: () => ({ eq: () => ({ error: null }) }),
          delete: () => ({ eq: () => ({ error: null }) }),
        }),
      } as unknown as SupabaseClient;
    }
    throw new Error('Supabase environment variables not configured');
  }

  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// Export as a getter for backward compatibility
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

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
