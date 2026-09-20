import { supabase } from '../../lib/supabase';
import type { Enquiry, EnquiryInsert, EnquiryStatus } from '../types';

export async function submitEnquiry(enquiry: EnquiryInsert): Promise<void> {
  const { error } = await supabase
    .from('enquiries')
    .insert(enquiry);
  if (error) throw error;
}

export async function fetchAllEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchEnquiryById(id: string): Promise<Enquiry | null> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const { error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function fetchEnquiryCounts(): Promise<Record<EnquiryStatus, number>> {
  const { data, error } = await supabase
    .from('enquiries')
    .select('status');
  if (error) throw error;
  
  const counts: Record<EnquiryStatus, number> = { new: 0, contacted: 0, 'follow-up': 0, closed: 0 };
  for (const row of data ?? []) {
    counts[row.status as EnquiryStatus]++;
  }
  return counts;
}
