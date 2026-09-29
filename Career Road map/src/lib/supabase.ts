import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim().length > 0 &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      message: 'Supabase credentials not set in .env. Running in offline zero-data mode.',
    };
  }

  try {
    const { error } = await supabase.from('career_paths').select('id').limit(1);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected to Supabase PostgreSQL database successfully!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection test failed.' };
  }
};
