-- ============================================================
-- BRAVO BARISTA SCHOOL - ADMIN PANEL MIGRATION
-- Run this once against your Supabase project
-- ============================================================

-- ── 1. ADMIN USERS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'owner')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- ── 2. BANNERS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.banners (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  description       text,
  image_path        text NOT NULL,
  button_text       text,
  button_url        text,
  display_location  text NOT NULL DEFAULT 'homepage' CHECK (display_location IN ('homepage', 'all')),
  starts_at         timestamptz NOT NULL DEFAULT now(),
  expires_at        timestamptz,
  status            text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'hidden')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_banners_status ON public.banners(status);
CREATE INDEX IF NOT EXISTS idx_banners_starts_at ON public.banners(starts_at);
CREATE INDEX IF NOT EXISTS idx_banners_expires_at ON public.banners(expires_at);

-- ── 3. GALLERY ITEMS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path  text NOT NULL,
  title       text,
  category    text NOT NULL DEFAULT 'training' 
              CHECK (category IN ('training','barista','cafe','bar','chef','students','events')),
  featured    boolean NOT NULL DEFAULT false,
  published   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery_items(published);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery_items(category);

-- ── 4. VIDEOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.videos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_name     text NOT NULL UNIQUE,
  display_name  text NOT NULL,
  description   text,
  video_path    text NOT NULL,
  active        boolean NOT NULL DEFAULT true,
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_videos_active ON public.videos(active);

-- ── 5. ENQUIRIES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enquiries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   text NOT NULL CHECK (char_length(full_name) >= 2 AND char_length(full_name) <= 100),
  email       text NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone       text NOT NULL CHECK (char_length(phone) >= 7 AND char_length(phone) <= 25),
  program     text NOT NULL,
  message     text NOT NULL CHECK (char_length(message) >= 5 AND char_length(message) <= 2000),
  status      text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','follow-up','closed')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at DESC);

-- ── 6. PROGRAM STATUS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.program_status (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text NOT NULL UNIQUE,
  display_name       text NOT NULL,
  enrollment_status  text NOT NULL DEFAULT 'open' 
                     CHECK (enrollment_status IN ('open','coming-soon','closed','hidden')),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- Seed initial program data
INSERT INTO public.program_status (slug, display_name, enrollment_status)
VALUES
  ('barista-training',   'Barista Training',   'open'),
  ('cafe-bar-training',  'Café & Bar Training', 'open'),
  ('chef-training',      'Chef Training',       'coming-soon')
ON CONFLICT (slug) DO NOTHING;

-- ── 7. SITE SETTINGS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  value       text,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- Seed initial settings
INSERT INTO public.site_settings (key, value)
VALUES
  ('phone',         '+977 980-2004823'),
  ('whatsapp',      '+977 980-2004823'),
  ('email',         'info@bravocafebar.com'),
  ('address',       'Bravo Barista School & Café, Kathmandu, Nepal'),
  ('hours_school',  'Mon – Sat, 7:00 AM – 6:30 PM'),
  ('hours_cafe',    'Everyday, 8:00 AM – 10:00 PM'),
  ('facebook_url',  'https://www.facebook.com/share/1DG2ULoNwS/'),
  ('instagram_url', '')
ON CONFLICT (key) DO NOTHING;

-- Seed initial video slots
INSERT INTO public.videos (slot_name, display_name, description, video_path, active)
VALUES
  ('welcome',
   'Welcome / About Video',
   'Main welcome video shown on the homepage.',
   '/assets/AQMc8AXPZcoYSBYQjfRbHUAv5_M0fX7UZ_bQviBTR7TPPtgG0cKqpu9QxJax39ISQAWaoP9P46qq3keIxBh9XT2mIUWasllppmatyRFh8aW8Lg.mp4',
   true),
  ('barista-demo',
   'Barista Training Demo',
   'Training action video shown in the gallery.',
   '/assets/AQMMqaPfj01ksylGcqLS_dIJNYi5oHxrzMI-ZmQyJ0KAOH95JilAIPO9Ruy3gukWc1ORwiUwbP8UmkBD0_nPDIsJrz_38RN6aBEwZKtrzV1g8w.mp4',
   true)
ON CONFLICT (slot_name) DO NOTHING;

-- ── 8. UPDATED_AT TRIGGER FUNCTION ────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_gallery_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_enquiries_updated_at
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_program_status_updated_at
  BEFORE UPDATE ON public.program_status
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 9. ROW LEVEL SECURITY ─────────────────────────────────

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ADMIN_USERS: only admins can see their own row, no public access
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_users_self ON public.admin_users
  FOR SELECT USING (user_id = auth.uid());

-- BANNERS: public can read active banners; admins can do all
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY banners_public_read ON public.banners
  FOR SELECT USING (
    status = 'published'
    AND starts_at <= now()
    AND (expires_at IS NULL OR expires_at > now())
  );
CREATE POLICY banners_admin_all ON public.banners
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- GALLERY: public can read published; admins can do all
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY gallery_public_read ON public.gallery_items
  FOR SELECT USING (published = true);
CREATE POLICY gallery_admin_all ON public.gallery_items
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- VIDEOS: public can read active; admins can do all
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY videos_public_read ON public.videos
  FOR SELECT USING (active = true);
CREATE POLICY videos_admin_all ON public.videos
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ENQUIRIES: public can insert; admins can read/update; nobody else can read
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY enquiries_public_insert ON public.enquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY enquiries_admin_read ON public.enquiries
  FOR SELECT USING (public.is_admin());
CREATE POLICY enquiries_admin_update ON public.enquiries
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- PROGRAM STATUS: public can read; admins can update
ALTER TABLE public.program_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY program_status_public_read ON public.program_status
  FOR SELECT USING (true);
CREATE POLICY program_status_admin_update ON public.program_status
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- SITE SETTINGS: public can read; admins can update
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY site_settings_public_read ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY site_settings_admin_update ON public.site_settings
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());
