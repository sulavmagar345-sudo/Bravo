import { supabase } from '../../lib/supabase';
import type { SiteSetting, SiteSettingsMap } from '../types';

export async function fetchAllSettings(): Promise<SiteSetting[]> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key');
  if (error) throw error;
  return data ?? [];
}

export async function fetchSettingsMap(): Promise<Partial<SiteSettingsMap>> {
  const rows = await fetchAllSettings();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value ?? '';
  }
  return map as Partial<SiteSettingsMap>;
}

export async function updateSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('site_settings')
    .update({ value })
    .eq('key', key);
  if (error) throw error;
}

export async function updateAllSettings(settings: Partial<SiteSettingsMap>): Promise<void> {
  const updates = Object.entries(settings).map(([key, value]) =>
    supabase.from('site_settings').update({ value: value ?? '' }).eq('key', key)
  );
  const results = await Promise.all(updates);
  const firstError = results.find(r => r.error)?.error;
  if (firstError) throw firstError;
}
