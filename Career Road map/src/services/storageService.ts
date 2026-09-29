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

/**
 * Upload image for Roadmaps, Phases, and Courses
 * Validates JPG, JPEG, PNG, WEBP, and file size (max 10MB)
 */
export const uploadImageFile = async (
  file: File,
  bucket = 'roadmap-images'
): Promise<UploadResult> => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = file.name.split('.').pop()?.toLowerCase();
  const validExts = ['jpg', 'jpeg', 'png', 'webp'];

  if (!allowedTypes.includes(file.type) && !validExts.includes(ext || '')) {
    return {
      url: '',
      path: '',
      error: 'Invalid file format. Please upload JPG, JPEG, PNG, or WEBP image.',
    };
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    return {
      url: '',
      path: '',
      error: 'Image file size exceeds maximum allowed limit of 10MB.',
    };
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        return {
          url: publicUrlData.publicUrl,
          path: data.path,
        };
      }
    } catch (err: any) {
      console.warn('Supabase storage upload error, falling back to local storage URL:', err);
    }
  }

  // Local/Offline file fallback: Read as persistent base64 Data URL so it reloads correctly
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        path: `local/${file.name}`,
      });
    };
    reader.onerror = () => {
      resolve({
        url: URL.createObjectURL(file),
        path: `local/${file.name}`,
      });
    };
    reader.readAsDataURL(file);
  });
};
