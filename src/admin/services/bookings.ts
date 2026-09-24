import { supabase } from '../../lib/supabase';
import type { Booking, BookingStatus, BookingType, AvailableSlot } from '../types';

const TZ = 'Asia/Kathmandu';

/** Admin: fetch all bookings with optional filters */
export async function fetchAllBookings(filters?: {
  type?: BookingType | 'all';
  status?: BookingStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
}): Promise<Booking[]> {
  let query = supabase
    .from('bookings')
    .select('*')
    .order('starts_at', { ascending: false });

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('booking_type', filters.type);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.dateFrom) {
    query = query.gte('starts_at', filters.dateFrom);
  }
  if (filters?.dateTo) {
    query = query.lte('starts_at', filters.dateTo);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/** Admin: fetch today's bookings */
export async function fetchTodayBookings(): Promise<Booking[]> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  return fetchAllBookings({
    dateFrom: todayStart.toISOString(),
    dateTo: todayEnd.toISOString(),
  });
}

/** Admin: fetch booking by ID */
export async function fetchBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Admin: update booking status */
export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

/** Admin: count bookings by status */
export async function fetchBookingCounts(): Promise<{
  today: number;
  pending: number;
  confirmed: number;
  total: number;
}> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('bookings')
    .select('status, starts_at');
  if (error) throw error;

  const rows = data ?? [];
  const todayStart_t = todayStart.getTime();
  const todayEnd_t = todayEnd.getTime();

  return {
    today:    rows.filter(r => { const t = new Date(r.starts_at).getTime(); return t >= todayStart_t && t <= todayEnd_t; }).length,
    pending:  rows.filter(r => r.status === 'pending').length,
    confirmed: rows.filter(r => r.status === 'confirmed').length,
    total:    rows.length,
  };
}

/** Public: get available time slots via RPC */
export async function getAvailableSlots(
  resourceId: string,
  date: string,
  durationMinutes: number,
  intervalMinutes: number = 30
): Promise<AvailableSlot[]> {
  const { data, error } = await supabase.rpc('get_available_slots', {
    p_resource_id: resourceId,
    p_date: date,
    p_duration_minutes: durationMinutes,
    p_interval_minutes: intervalMinutes,
  });
  if (error) throw error;
  return data ?? [];
}

/** Public: create a booking via the secure RPC */
export async function createBookingRpc(params: {
  booking_type: BookingType;
  customer_name: string;
  phone: string;
  email?: string;
  guest_count: number;
  starts_at: string;
  duration_minutes: number;
  special_request?: string;
  resource_id?: string;
}): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const { data, error } = await supabase.rpc('create_booking', {
    p_booking_type:     params.booking_type,
    p_customer_name:    params.customer_name,
    p_phone:            params.phone,
    p_email:            params.email || null,
    p_guest_count:      params.guest_count,
    p_starts_at:        params.starts_at,
    p_duration_minutes: params.duration_minutes,
    p_special_request:  params.special_request || null,
    p_resource_id:      params.resource_id || null,
  });

  if (error) return { success: false, error: error.message };
  if (data?.error) return { success: false, error: data.error };
  return { success: true, booking: data.booking };
}

/** Format a timestamptz to Nepal local display time */
export function formatBookingTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-NP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TZ,
  });
}

export function formatBookingDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NP', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TZ,
  });
}

export function formatBookingDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: TZ,
  });
}
