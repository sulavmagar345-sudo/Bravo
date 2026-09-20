import { supabase } from '../../lib/supabase';
import type { ProgramStatus, EnrollmentStatus } from '../types';

export async function fetchAllProgramStatuses(): Promise<ProgramStatus[]> {
  const { data, error } = await supabase
    .from('program_status')
    .select('*')
    .order('slug');
  if (error) throw error;
  return data ?? [];
}

export async function updateProgramStatus(
  slug: string,
  enrollmentStatus: EnrollmentStatus
): Promise<void> {
  const { error } = await supabase
    .from('program_status')
    .update({ enrollment_status: enrollmentStatus })
    .eq('slug', slug);
  if (error) throw error;
}

export async function fetchProgramStatusBySlug(slug: string): Promise<ProgramStatus | null> {
  const { data, error } = await supabase
    .from('program_status')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}
