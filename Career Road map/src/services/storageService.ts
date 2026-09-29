import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export const uploadStudyMaterialFile = async (
  file: File,
  folder = 'materials'
): Promise<UploadResult> => {
  // Validate file size (max 25MB)
  const MAX_SIZE = 25 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { url: '', path: '', error: 'File size exceeds maximum allowed limit of 25MB.' };
  }

  // If Supabase is active
  if (isSupabaseConfigured() && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('careerpath-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('careerpath-assets')
        .getPublicUrl(data.path);

      return {
        url: publicUrlData.publicUrl,
        path: data.path,
      };
    } catch (err: any) {
      console.warn('Supabase storage upload failed, falling back to local object URL:', err);
    }
  }

  // Local/Offline file fallback: Create blob URL
  const localUrl = URL.createObjectURL(file);
  return {
    url: localUrl,
    path: `local/${file.name}`,
  };
};
