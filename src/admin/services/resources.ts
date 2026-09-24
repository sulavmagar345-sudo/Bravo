import { supabase } from '../../lib/supabase';
import type { Resource, ResourceType, ResourceStatus } from '../types';

/** Fetch all non-archived resources for admin view */
export async function fetchAllResources(includeArchived = false): Promise<Resource[]> {
  let query = supabase.from('resources').select('*');
  if (!includeArchived) {
    query = query.eq('archived', false).neq('status', 'archived');
  }
  const { data, error } = await query.order('type').order('name');
  if (error) throw error;
  return (data as Resource[]) ?? [];
}

/** Fetch active, non-archived resources */
export async function fetchActiveResources(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('active', true)
    .eq('archived', false)
    .neq('status', 'archived')
    .order('type')
    .order('name');
  if (error) throw error;
  return (data as Resource[]) ?? [];
}

/** Fetch resources of a specific type (e.g. 'table' or 'netflix_room') that are not archived */
export async function fetchResourcesByType(
  type: ResourceType,
  options?: { onlyActive?: boolean; status?: ResourceStatus }
): Promise<Resource[]> {
  let query = supabase
    .from('resources')
    .select('*')
    .eq('type', type)
    .eq('archived', false)
    .neq('status', 'archived');

  if (options?.onlyActive) {
    query = query.eq('active', true);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  const { data, error } = await query.order('name');
  if (error) throw error;
  return (data as Resource[]) ?? [];
}

/** Update resource fields (name, capacity, status, active, archived) */
export async function updateResource(
  id: string,
  updates: Partial<Pick<Resource, 'name' | 'capacity' | 'status' | 'active' | 'archived'>>
): Promise<void> {
  const payload: any = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // If status is provided, ensure active and archived are aligned
  if (updates.status) {
    if (updates.status === 'available' || updates.status === 'occupied') {
      payload.active = true;
      payload.archived = false;
    } else if (updates.status === 'paused') {
      payload.active = false;
      payload.archived = false;
    } else if (updates.status === 'archived') {
      payload.active = false;
      payload.archived = true;
    }
  }

  const { error } = await supabase
    .from('resources')
    .update(payload)
    .eq('id', id);
  if (error) throw error;
}

/** Set resource status via the secure RPC (available | occupied | paused | archived) */
export async function setResourceStatus(id: string, status: ResourceStatus): Promise<Resource> {
  const { data, error } = await supabase.rpc('mark_resource_status', {
    p_resource_id: id,
    p_status: status,
  });

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error || 'Failed to update resource status');
  return data.resource as Resource;
}

/** Admin action: mark a resource AVAILABLE (manual physical release) */
export async function markResourceAvailable(id: string): Promise<Resource> {
  return setResourceStatus(id, 'available');
}

/** Admin action: mark a resource OCCUPIED (manual physical occupation) */
export async function markResourceOccupied(id: string): Promise<Resource> {
  return setResourceStatus(id, 'occupied');
}

/** Admin action: pause a resource */
export async function pauseResource(id: string): Promise<Resource> {
  return setResourceStatus(id, 'paused');
}

/** Admin action: activate a resource */
export async function activateResource(id: string): Promise<Resource> {
  return setResourceStatus(id, 'available');
}

/** Create a new resource (defaults to status = 'available', active = true, archived = false) */
export async function createResource(resource: {
  type: ResourceType;
  name: string;
  capacity: number;
  status?: ResourceStatus;
  active?: boolean;
}): Promise<Resource> {
  const initialStatus = resource.status || (resource.active === false ? 'paused' : 'available');
  const { data, error } = await supabase
    .from('resources')
    .insert({
      type: resource.type,
      name: resource.name.trim(),
      capacity: resource.capacity,
      status: initialStatus,
      active: initialStatus === 'available' || initialStatus === 'occupied',
      archived: false,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Resource;
}

/** Toggle pause status (active/available -> paused, paused -> available) */
export async function toggleResourcePause(id: string, currentActiveOrStatus: boolean | ResourceStatus): Promise<void> {
  const isCurrentlyPaused = currentActiveOrStatus === false || currentActiveOrStatus === 'paused';
  const targetStatus: ResourceStatus = isCurrentlyPaused ? 'available' : 'paused';
  await setResourceStatus(id, targetStatus);
}

/** Archive a resource (SOFT DELETE). Preserves historical booking records. */
export async function archiveResource(id: string): Promise<void> {
  await setResourceStatus(id, 'archived');
}

/** Deprecated hard delete: redirects to soft-archive to protect historical bookings */
export async function deleteResource(id: string): Promise<void> {
  return archiveResource(id);
}
