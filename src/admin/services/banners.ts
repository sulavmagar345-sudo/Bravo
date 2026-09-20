import { supabase, getPublicUrl } from '../../lib/supabase';
import type { Banner, BannerInsert, BannerUpdate } from '../types';

const BUCKET = 'bravo-banners';

export async function fetchAllBanners(): Promise<Banner[]> {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchActiveBanners(location: 'homepage' | 'all' = 'homepage'): Promise<Banner[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('status', 'published')
    .lte('starts_at', now)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .or(`display_location.eq.${location},display_location.eq.all`)
    .order('starts_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createBanner(insert: Omit<BannerInsert, 'image_path'>, imageFile: File): Promise<Banner> {
  const ext = imageFile.name.split('.').pop();
  const filePath = `banner-${Date.now()}.${ext}`;
  
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, imageFile, { upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from('banners')
    .insert({ ...insert, image_path: filePath })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBanner(id: string, update: BannerUpdate): Promise<Banner> {
  const { data, error } = await supabase
    .from('banners')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function replaceBannerImage(bannerId: string, imageFile: File, oldImagePath: string): Promise<string> {
  const ext = imageFile.name.split('.').pop();
  const filePath = `banner-${Date.now()}.${ext}`;
  
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, imageFile, { upsert: false });
  if (uploadError) throw uploadError;

  await supabase
    .from('banners')
    .update({ image_path: filePath })
    .eq('id', bannerId);

  // Best-effort delete old image
  if (oldImagePath) {
    await supabase.storage.from(BUCKET).remove([oldImagePath]);
  }
  
  return filePath;
}

export async function deleteBanner(id: string, imagePath: string): Promise<void> {
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id);
  if (error) throw error;
  
  // Best-effort delete storage file
  if (imagePath) {
    await supabase.storage.from(BUCKET).remove([imagePath]);
  }
}

export function getBannerImageUrl(imagePath: string): string {
  return getPublicUrl(BUCKET, imagePath);
}
