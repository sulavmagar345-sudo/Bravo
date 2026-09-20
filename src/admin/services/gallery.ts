import { supabase, getPublicUrl } from '../../lib/supabase';
import type { GalleryItem, GalleryItemInsert, GalleryCategory } from '../types';

const BUCKET = 'bravo-gallery';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, and WebP images are allowed.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be under 10MB.';
  }
  return null;
}

export async function fetchAllGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedGalleryItems(category?: GalleryCategory): Promise<GalleryItem[]> {
  let query = supabase
    .from('gallery_items')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function uploadGalleryImage(
  file: File,
  category: GalleryCategory,
  title?: string
): Promise<GalleryItem> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const ext = file.name.split('.').pop();
  const filePath = `${category}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { upsert: false });
  if (uploadError) throw uploadError;

  const insert: GalleryItemInsert = {
    image_path: filePath,
    title: title || null,
    category,
    featured: false,
    published: true,
  };

  const { data, error } = await supabase
    .from('gallery_items')
    .insert(insert)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateGalleryItem(
  id: string,
  updates: Partial<Pick<GalleryItem, 'title' | 'category' | 'featured' | 'published'>>
): Promise<GalleryItem> {
  const { data, error } = await supabase
    .from('gallery_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGalleryItem(id: string, imagePath: string): Promise<void> {
  const { error } = await supabase
    .from('gallery_items')
    .delete()
    .eq('id', id);
  if (error) throw error;

  if (imagePath) {
    await supabase.storage.from(BUCKET).remove([imagePath]);
  }
}

export function getGalleryImageUrl(imagePath: string): string {
  return getPublicUrl(BUCKET, imagePath);
}
