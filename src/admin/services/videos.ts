import { supabase, getPublicUrl } from '../../lib/supabase';
import type { Video } from '../types';

const BUCKET = 'bravo-videos';
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export function validateVideoFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only MP4, WebM, and MOV video files are allowed.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Video must be under 200MB.';
  }
  return null;
}

export async function fetchAllVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('slot_name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchActiveVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('active', true)
    .order('slot_name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchVideoBySlot(slotName: string): Promise<Video | null> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('slot_name', slotName)
    .eq('active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function replaceVideo(
  id: string,
  file: File,
  oldVideoPath: string,
  slotName: string
): Promise<Video> {
  const validationError = validateVideoFile(file);
  if (validationError) throw new Error(validationError);

  const ext = file.name.split('.').pop();
  const filePath = `${slotName}-${Date.now()}.${ext}`;

  // Upload new video first - if this fails, old video remains intact
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { upsert: false });
  if (uploadError) throw uploadError;

  // Only update DB reference AFTER successful upload
  const { data, error } = await supabase
    .from('videos')
    .update({ video_path: filePath })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;

  // Delete old storage file only after DB is updated
  if (oldVideoPath && !oldVideoPath.startsWith('/assets/')) {
    await supabase.storage.from(BUCKET).remove([oldVideoPath]);
  }

  return data;
}

export async function updateVideoStatus(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from('videos')
    .update({ active })
    .eq('id', id);
  if (error) throw error;
}

export function getVideoUrl(videoPath: string): string {
  // Local asset paths (seeded) are served directly
  if (videoPath.startsWith('/assets/') || videoPath.startsWith('/')) {
    return videoPath;
  }
  return getPublicUrl(BUCKET, videoPath);
}
