-- ============================================================
-- BRAVO BARISTA SCHOOL - BOOKING SYSTEM MIGRATION
-- Migration 003: Complete booking system
-- ============================================================

-- ── 1. RESOURCES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resources (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL CHECK (type IN ('table', 'netflix_room')),
  name        text NOT NULL,
  capacity    int NOT NULL CHECK (capacity > 0),
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_resources_type   ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_active ON public.resources(active);

-- ── 2. BOOKING SETTINGS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.booking_settings (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  value       text,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_booking_settings_key ON public.booking_settings(key);

-- ── 3. BOOKINGS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference   text NOT NULL UNIQUE,
  booking_type        text NOT NULL CHECK (booking_type IN ('table', 'netflix_room')),
  resource_id         uuid REFERENCES public.resources(id),
  customer_name       text NOT NULL CHECK (char_length(customer_name) >= 2 AND char_length(customer_name) <= 100),
  phone               text NOT NULL CHECK (char_length(phone) >= 7 AND char_length(phone) <= 25),
  email               text CHECK (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  guest_count         int NOT NULL CHECK (guest_count > 0),
  starts_at           timestamptz NOT NULL,
  ends_at             timestamptz NOT NULL,
  duration_minutes    int NOT NULL CHECK (duration_minutes > 0),
  total_amount        numeric(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  currency            text NOT NULL DEFAULT 'NPR',
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed','no-show')),
  special_request     text CHECK (special_request IS NULL OR char_length(special_request) <= 500),
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_ends_after_starts CHECK (ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS idx_bookings_status         ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_type   ON public.bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_bookings_resource_id    ON public.bookings(resource_id);
CREATE INDEX IF NOT EXISTS idx_bookings_starts_at      ON public.bookings(starts_at);
CREATE INDEX IF NOT EXISTS idx_bookings_reference      ON public.bookings(booking_reference);

-- ── 4. BLOCKED TIMES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blocked_times (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid REFERENCES public.resources(id) ON DELETE CASCADE,
  starts_at   timestamptz NOT NULL,
  ends_at     timestamptz NOT NULL,
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blocked_ends_after_starts CHECK (ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS idx_blocked_times_resource ON public.blocked_times(resource_id);
CREATE INDEX IF NOT EXISTS idx_blocked_times_starts   ON public.blocked_times(starts_at);

-- ── 5. UPDATED_AT TRIGGERS ────────────────────────────────
CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_booking_settings_updated_at
  BEFORE UPDATE ON public.booking_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 6. BOOKING REFERENCE SEQUENCE ─────────────────────────
CREATE SEQUENCE IF NOT EXISTS public.booking_ref_seq START 1000;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS text AS $$
  SELECT 'BRV-' || nextval('public.booking_ref_seq')::text;
$$ LANGUAGE sql;

-- ── 7. AVAILABILITY CHECK FUNCTION ────────────────────────
-- Returns TRUE if a resource has NO conflicting active booking or block
-- in [p_starts_at, p_ends_at), ignoring a specific booking_id (for updates)
CREATE OR REPLACE FUNCTION public.resource_is_available(
  p_resource_id     uuid,
  p_starts_at       timestamptz,
  p_ends_at         timestamptz,
  p_exclude_booking uuid DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  conflict_count int;
BEGIN
  -- Check bookings overlap: not cancelled, not completed, not the excluded booking
  SELECT COUNT(*) INTO conflict_count
  FROM public.bookings
  WHERE resource_id = p_resource_id
    AND status NOT IN ('cancelled', 'completed', 'no-show')
    AND (id IS DISTINCT FROM p_exclude_booking)
    AND starts_at < p_ends_at
    AND ends_at > p_starts_at;

  IF conflict_count > 0 THEN RETURN false; END IF;

  -- Check blocked_times overlap
  SELECT COUNT(*) INTO conflict_count
  FROM public.blocked_times
  WHERE resource_id = p_resource_id
    AND starts_at < p_ends_at
    AND ends_at > p_starts_at;

  IF conflict_count > 0 THEN RETURN false; END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ── 8. GET AVAILABLE SLOTS FUNCTION ───────────────────────
-- Returns available time slots for a resource on a given date
CREATE OR REPLACE FUNCTION public.get_available_slots(
  p_resource_id      uuid,
  p_date             date,
  p_duration_minutes int,
  p_interval_minutes int DEFAULT 30
)
RETURNS TABLE(slot_start timestamptz, slot_end timestamptz, available boolean) AS $$
DECLARE
  v_open_time    text;
  v_close_time   text;
  v_tz           text := 'Asia/Kathmandu';
  v_slot_start   timestamptz;
  v_slot_end     timestamptz;
  v_day_start    timestamptz;
  v_day_end      timestamptz;
  v_min_advance  int;
  v_now          timestamptz;
BEGIN
  -- Get open/close times from booking_settings
  SELECT COALESCE(value, '08:00') INTO v_open_time
  FROM public.booking_settings WHERE key = 'opening_time';

  SELECT COALESCE(value, '22:00') INTO v_close_time
  FROM public.booking_settings WHERE key = 'closing_time';

  SELECT COALESCE(value, '30')::int INTO v_min_advance
  FROM public.booking_settings WHERE key = 'min_advance_minutes';

  v_now := now() AT TIME ZONE v_tz;
  v_day_start := (p_date::text || ' ' || v_open_time)::timestamp AT TIME ZONE v_tz;
  v_day_end   := (p_date::text || ' ' || v_close_time)::timestamp AT TIME ZONE v_tz;

  v_slot_start := v_day_start;

  WHILE v_slot_start + (p_duration_minutes * interval '1 minute') <= v_day_end LOOP
    v_slot_end := v_slot_start + (p_duration_minutes * interval '1 minute');

    -- Skip slots in the past or within min_advance window
    IF v_slot_start > v_now + (v_min_advance * interval '1 minute') THEN
      RETURN QUERY SELECT
        v_slot_start,
        v_slot_end,
        public.resource_is_available(p_resource_id, v_slot_start, v_slot_end);
    END IF;

    v_slot_start := v_slot_start + (p_interval_minutes * interval '1 minute');
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 9. ATOMIC BOOKING CREATION RPC ────────────────────────
-- This is the ONLY way public users can create a booking.
-- All validation, resource assignment, and price calculation happen here.
CREATE OR REPLACE FUNCTION public.create_booking(
  p_booking_type      text,
  p_customer_name     text,
  p_phone             text,
  p_email             text,
  p_guest_count       int,
  p_starts_at         timestamptz,
  p_duration_minutes  int,
  p_special_request   text DEFAULT NULL,
  p_resource_id       uuid DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_resource_id      uuid;
  v_resource_capacity int;
  v_ends_at          timestamptz;
  v_total_amount     numeric(10,2) := 0;
  v_netflix_price    numeric(10,2);
  v_table_duration   int;
  v_netflix_duration int;
  v_table_enabled    boolean := true;
  v_netflix_enabled  boolean := true;
  v_booking_ref      text;
  v_booking          jsonb;
  v_max_advance_days int;
  v_min_advance_min  int;
  v_now              timestamptz;
  v_max_guests       int;
BEGIN
  v_now := now();

  -- Validate booking type
  IF p_booking_type NOT IN ('table', 'netflix_room') THEN
    RETURN jsonb_build_object('error', 'Invalid booking type');
  END IF;

  -- Validate enabled
  IF p_booking_type = 'table' THEN
    SELECT COALESCE(value, 'true')::boolean INTO v_table_enabled
    FROM public.booking_settings WHERE key = 'table_booking_enabled';
    IF NOT v_table_enabled THEN
      RETURN jsonb_build_object('error', 'Table booking is currently unavailable');
    END IF;
  END IF;

  IF p_booking_type = 'netflix_room' THEN
    SELECT COALESCE(value, 'true')::boolean INTO v_netflix_enabled
    FROM public.booking_settings WHERE key = 'netflix_booking_enabled';
    IF NOT v_netflix_enabled THEN
      RETURN jsonb_build_object('error', 'Netflix room booking is currently unavailable');
    END IF;
  END IF;

  -- Validate advance booking window
  SELECT COALESCE(value, '30')::int INTO v_min_advance_min
  FROM public.booking_settings WHERE key = 'min_advance_minutes';

  SELECT COALESCE(value, '60')::int INTO v_max_advance_days
  FROM public.booking_settings WHERE key = 'max_advance_days';

  IF p_starts_at < v_now + (v_min_advance_min * interval '1 minute') THEN
    RETURN jsonb_build_object('error', 'Booking must be made at least ' || v_min_advance_min || ' minutes in advance');
  END IF;

  IF p_starts_at > v_now + (v_max_advance_days * interval '1 day') THEN
    RETURN jsonb_build_object('error', 'Cannot book more than ' || v_max_advance_days || ' days in advance');
  END IF;

  -- Calculate end time from duration
  v_ends_at := p_starts_at + (p_duration_minutes * interval '1 minute');

  -- For table bookings: find an available table with enough capacity
  IF p_booking_type = 'table' THEN
    SELECT id, capacity INTO v_resource_id, v_resource_capacity
    FROM public.resources
    WHERE type = 'table'
      AND active = true
      AND capacity >= p_guest_count
      AND public.resource_is_available(id, p_starts_at, v_ends_at)
    ORDER BY capacity ASC
    LIMIT 1;

    IF v_resource_id IS NULL THEN
      RETURN jsonb_build_object('error', 'No available table found for your party size and requested time. Please try a different time.');
    END IF;

    v_total_amount := 0; -- Table bookings have no direct charge
  END IF;

  -- For Netflix room: find available netflix_room resource
  IF p_booking_type = 'netflix_room' THEN
    IF p_resource_id IS NOT NULL THEN
      -- Admin specified resource
      SELECT id, capacity INTO v_resource_id, v_resource_capacity
      FROM public.resources
      WHERE id = p_resource_id AND type = 'netflix_room' AND active = true;
    ELSE
      SELECT id, capacity INTO v_resource_id, v_resource_capacity
      FROM public.resources
      WHERE type = 'netflix_room'
        AND active = true
        AND public.resource_is_available(id, p_starts_at, v_ends_at)
      ORDER BY capacity ASC
      LIMIT 1;
    END IF;

    IF v_resource_id IS NULL THEN
      RETURN jsonb_build_object('error', 'The Netflix room is not available at that time. Please choose a different time.');
    END IF;

    -- Verify still available (race condition protection)
    IF NOT public.resource_is_available(v_resource_id, p_starts_at, v_ends_at) THEN
      RETURN jsonb_build_object('error', 'Sorry, this time slot was just taken. Please choose another time.');
    END IF;

    -- Calculate price from booking_settings (authoritative)
    SELECT COALESCE(value, '300')::numeric INTO v_netflix_price
    FROM public.booking_settings WHERE key = 'netflix_price_per_hour';

    v_total_amount := (p_duration_minutes::numeric / 60.0) * v_netflix_price;
  END IF;

  -- Validate guest count against resource capacity
  IF v_resource_capacity IS NOT NULL AND p_guest_count > v_resource_capacity THEN
    RETURN jsonb_build_object('error', 'Guest count exceeds capacity for this resource');
  END IF;

  -- Generate unique booking reference
  v_booking_ref := public.generate_booking_reference();

  -- Insert booking atomically
  INSERT INTO public.bookings (
    booking_reference, booking_type, resource_id,
    customer_name, phone, email,
    guest_count, starts_at, ends_at, duration_minutes,
    total_amount, currency, status, special_request
  ) VALUES (
    v_booking_ref, p_booking_type, v_resource_id,
    p_customer_name, p_phone, p_email,
    p_guest_count, p_starts_at, v_ends_at, p_duration_minutes,
    v_total_amount, 'NPR', 'confirmed', p_special_request
  )
  RETURNING to_jsonb(bookings.*) INTO v_booking;

  RETURN jsonb_build_object('success', true, 'booking', v_booking);

EXCEPTION WHEN unique_violation THEN
  RETURN jsonb_build_object('error', 'A booking conflict occurred. Please try again.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on RPC to anon
GRANT EXECUTE ON FUNCTION public.create_booking TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_available_slots TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.resource_is_available TO anon, authenticated;

-- ── 10. ROW LEVEL SECURITY ────────────────────────────────

-- RESOURCES: public can read active; admins can do all
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY resources_public_read ON public.resources
  FOR SELECT USING (active = true);
CREATE POLICY resources_admin_all ON public.resources
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- BOOKING_SETTINGS: public can read; admins can do all
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY booking_settings_public_read ON public.booking_settings
  FOR SELECT USING (true);
CREATE POLICY booking_settings_admin_all ON public.booking_settings
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- BOOKINGS: public cannot read/update/delete; create only via RPC
-- Admins can read/update
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookings_admin_read ON public.bookings
  FOR SELECT USING (public.is_admin());
CREATE POLICY bookings_admin_update ON public.bookings
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());
-- No public SELECT/UPDATE/DELETE policy — RPC handles inserts with SECURITY DEFINER

-- BLOCKED_TIMES: public can read (for availability); admins can do all
ALTER TABLE public.blocked_times ENABLE ROW LEVEL SECURITY;
CREATE POLICY blocked_times_public_read ON public.blocked_times
  FOR SELECT USING (true);
CREATE POLICY blocked_times_admin_all ON public.blocked_times
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ── 11. SEED DEFAULT BOOKING SETTINGS ─────────────────────
INSERT INTO public.booking_settings (key, value) VALUES
  ('table_booking_enabled',       'true'),
  ('netflix_booking_enabled',     'true'),
  ('netflix_price_per_hour',      '300'),
  ('netflix_min_duration_hours',  '1'),
  ('netflix_max_duration_hours',  '4'),
  ('table_default_duration_minutes', '90'),
  ('booking_interval_minutes',    '30'),
  ('min_advance_minutes',         '30'),
  ('max_advance_days',            '30'),
  ('opening_time',                '08:00'),
  ('closing_time',                '22:00')
ON CONFLICT (key) DO NOTHING;

-- ── 12. SEED INITIAL RESOURCES ────────────────────────────
-- These are placeholder resources. Admin should configure real ones.
INSERT INTO public.resources (type, name, capacity, active) VALUES
  ('table', 'Table 1', 2, true),
  ('table', 'Table 2', 4, true),
  ('table', 'Table 3', 6, true),
  ('netflix_room', 'Netflix Room', 6, true)
ON CONFLICT DO NOTHING;
