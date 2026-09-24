import { supabase } from '../../lib/supabase';
import type { BlockedTime, ResourceType } from '../types';

export async function fetchAllBlockedTimes(): Promise<BlockedTime[]> {
  const { data, error } = await supabase
    .from('blocked_times')
    .select('*, resource:resources(id, name, type)')
    .order('starts_at', { ascending: false });
  if (error) throw error;
  return (data as BlockedTime[]) ?? [];
}

export async function fetchBlockedTimesByResource(resourceId: string): Promise<BlockedTime[]> {
  const { data, error } = await supabase
    .from('blocked_times')
    .select('*, resource:resources(id, name, type)')
    .eq('resource_id', resourceId)
    .order('starts_at', { ascending: false });
  if (error) throw error;
  return (data as BlockedTime[]) ?? [];
}

export async function fetchBlockedTimesByType(type: ResourceType): Promise<BlockedTime[]> {
  const { data, error } = await supabase
    .from('blocked_times')
    .select('*, resource:resources!inner(id, name, type)')
    .eq('resource.type', type)
    .order('starts_at', { ascending: false });
  if (error) throw error;
  return (data as BlockedTime[]) ?? [];
}

export async function createBlockedTime(blocked: Omit<BlockedTime, 'id' | 'created_at' | 'resource'>): Promise<BlockedTime> {
  const { data, error } = await supabase
    .from('blocked_times')
    .insert(blocked)
    .select('*, resource:resources(id, name, type)')
    .single();
  if (error) throw error;
  return data as BlockedTime;
}

export async function deleteBlockedTime(id: string): Promise<void> {
  const { error } = await supabase.from('blocked_times').delete().eq('id', id);
  if (error) throw error;
}
