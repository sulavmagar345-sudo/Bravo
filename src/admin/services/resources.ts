import { supabase } from '../../lib/supabase';
import type { Resource } from '../types';

export async function fetchAllResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('type')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchActiveResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('active', true)
    .order('type')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchResourcesByType(type: 'table' | 'netflix_room'): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('type', type)
    .eq('active', true)
    .order('capacity');
  if (error) throw error;
  return data ?? [];
}

export async function updateResource(id: string, updates: Partial<Pick<Resource, 'name' | 'capacity' | 'active'>>): Promise<void> {
  const { error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function createResource(resource: Pick<Resource, 'type' | 'name' | 'capacity'>): Promise<Resource> {
  const { data, error } = await supabase
    .from('resources')
    .insert({ ...resource, active: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteResource(id: string): Promise<void> {
  const { error } = await supabase.from('resources').delete().eq('id', id);
  if (error) throw error;
}
