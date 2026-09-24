import { supabase } from '../../lib/supabase';
import type { BlockedTime } from '../types';

export async function fetchAllBlockedTimes(): Promise<BlockedTime[]> {
  const { data, error } = await supabase
    .from('blocked_times')
    .select('*')
    .order('starts_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchBlockedTimesByResource(resourceId: string): Promise<BlockedTime[]> {
  const { data, error } = await supabase
    .from('blocked_times')
    .select('*')
    .eq('resource_id', resourceId)
    .order('starts_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createBlockedTime(blocked: Omit<BlockedTime, 'id' | 'created_at'>): Promise<BlockedTime> {
  const { data, error } = await supabase
    .from('blocked_times')
    .insert(blocked)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBlockedTime(id: string): Promise<void> {
  const { error } = await supabase.from('blocked_times').delete().eq('id', id);
  if (error) throw error;
}
