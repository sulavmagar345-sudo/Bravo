import { supabase } from '../../lib/supabase';
import type { BookingSetting, BookingSettingsMap } from '../types';

export async function fetchAllBookingSettings(): Promise<BookingSetting[]> {
  const { data, error } = await supabase
    .from('booking_settings')
    .select('*')
    .order('key');
  if (error) throw error;
  return data ?? [];
}

export async function fetchBookingSettingsMap(): Promise<Partial<BookingSettingsMap>> {
  const rows = await fetchAllBookingSettings();
  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value ?? '';
  }
  return map as Partial<BookingSettingsMap>;
}

export async function updateBookingSetting(key: string, value: string): Promise<void> {
  const { error } = await supabase
    .from('booking_settings')
    .update({ value })
    .eq('key', key);
  if (error) throw error;
}

export async function updateAllBookingSettings(settings: Partial<BookingSettingsMap>): Promise<void> {
  const updates = Object.entries(settings).map(([key, value]) =>
    supabase.from('booking_settings').update({ value: value ?? '' }).eq('key', key)
  );
  const results = await Promise.all(updates);
  const firstError = results.find(r => r.error)?.error;
  if (firstError) throw firstError;
}
