// ─── ADMIN PANEL TYPES ─────────────────────────────────────

export type AdminRole = 'admin' | 'owner';

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  created_at: string;
}

// ─── BANNERS ───────────────────────────────────────────────

export type BannerStatus = 'draft' | 'published' | 'hidden';
export type DisplayLocation = 'homepage' | 'all';

export interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_path: string;
  button_text: string | null;
  button_url: string | null;
  display_location: DisplayLocation;
  starts_at: string;
  expires_at: string | null;
  status: BannerStatus;
  created_at: string;
  updated_at: string;
}

export type BannerInsert = Omit<Banner, 'id' | 'created_at' | 'updated_at'>;
export type BannerUpdate = Partial<BannerInsert>;

/** Computed display state based on status + schedule */
export type BannerComputedState = 'draft' | 'scheduled' | 'active' | 'expired' | 'hidden';

export function getBannerComputedState(banner: Banner): BannerComputedState {
  if (banner.status === 'draft') return 'draft';
  if (banner.status === 'hidden') return 'hidden';
  const now = new Date();
  const start = new Date(banner.starts_at);
  const end = banner.expires_at ? new Date(banner.expires_at) : null;
  if (now < start) return 'scheduled';
  if (end && now > end) return 'expired';
  return 'active';
}

// ─── GALLERY ───────────────────────────────────────────────

export type GalleryCategory = 'training' | 'barista' | 'cafe' | 'bar' | 'chef' | 'students' | 'events';

export const GALLERY_CATEGORIES: { label: string; value: GalleryCategory }[] = [
  { label: 'Training', value: 'training' },
  { label: 'Barista', value: 'barista' },
  { label: 'Café & Bar', value: 'cafe' },
  { label: 'Bar', value: 'bar' },
  { label: 'Chef', value: 'chef' },
  { label: 'Students', value: 'students' },
  { label: 'Events', value: 'events' },
];

export interface GalleryItem {
  id: string;
  image_path: string;
  title: string | null;
  category: GalleryCategory;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type GalleryItemInsert = Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>;

// ─── VIDEOS ────────────────────────────────────────────────

export interface Video {
  id: string;
  slot_name: string;
  display_name: string;
  description: string | null;
  video_path: string;
  active: boolean;
  updated_at: string;
}

export type VideoUpdate = Pick<Video, 'video_path' | 'active' | 'description'>;

// ─── ENQUIRIES ─────────────────────────────────────────────

export type EnquiryStatus = 'new' | 'contacted' | 'follow-up' | 'closed';

export interface Enquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  program: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  updated_at: string;
}

export type EnquiryInsert = Omit<Enquiry, 'id' | 'status' | 'created_at' | 'updated_at'>;

// ─── PROGRAM STATUS ────────────────────────────────────────

export type EnrollmentStatus = 'open' | 'coming-soon' | 'closed' | 'hidden';

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  'open': 'Open for Enrollment',
  'coming-soon': 'Coming Soon',
  'closed': 'Enrollment Closed',
  'hidden': 'Hidden',
};

export interface ProgramStatus {
  id: string;
  slug: string;
  display_name: string;
  enrollment_status: EnrollmentStatus;
  updated_at: string;
}

// ─── SITE SETTINGS ─────────────────────────────────────────

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface SiteSettingsMap {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours_school: string;
  hours_cafe: string;
  facebook_url: string;
  instagram_url: string;
}

// ─── AUTH ──────────────────────────────────────────────────

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  userId: string | null;
  email: string | null;
}

// ─── BOOKING SYSTEM ────────────────────────────────────────

export type ResourceType = 'table' | 'netflix_room';
export type ResourceStatus = 'available' | 'occupied' | 'paused' | 'archived';

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  capacity: number;
  status: ResourceStatus;
  active: boolean;
  archived?: boolean;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
export type BookingType = 'table' | 'netflix_room';

export interface Booking {
  id: string;
  booking_reference: string;
  booking_type: BookingType;
  resource_id: string | null;
  customer_name: string;
  phone: string;
  email: string | null;
  guest_count: number;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  total_amount: number;
  currency: string;
  status: BookingStatus;
  special_request: string | null;
  created_at: string;
  updated_at: string;
  resource?: { id: string; name: string; type: string; capacity?: number; status?: ResourceStatus } | null;
}

export interface BlockedTime {
  id: string;
  resource_id: string;
  starts_at: string;
  ends_at: string;
  reason: string | null;
  created_at: string;
  resource?: { id: string; name: string; type: ResourceType } | null;
}

export interface BookingSetting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

export interface BookingSettingsMap {
  table_booking_enabled: string;
  netflix_booking_enabled: string;
  netflix_price_per_hour: string;
  netflix_min_duration_hours: string;
  netflix_max_duration_hours: string;
  table_default_duration_minutes: string;
  booking_interval_minutes: string;
  min_advance_minutes: string;
  max_advance_days: string;
  opening_time: string;
  closing_time: string;
}

export interface AvailableSlot {
  slot_start: string;
  slot_end: string;
  available: boolean;
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
  'no-show': 'No-show',
};

export const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  table:       'Table Reservation',
  netflix_room: 'Netflix Room',
};

