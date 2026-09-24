-- ============================================================
-- BRAVO BARISTA SCHOOL - RESOURCE MANAGEMENT MIGRATION
-- Migration 004: Soft delete (archived), uniqueness, availability
-- ============================================================

-- 1. Add archived column if not already present
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;

-- 2. Index for filtering active vs archived
CREATE INDEX IF NOT EXISTS idx_resources_archived ON public.resources(archived);

-- 3. Partial unique index on type + name for active/paused (non-archived) resources
-- Prevents duplicate non-archived resource names while allowing archived names to be recycled
CREATE UNIQUE INDEX IF NOT EXISTS idx_resources_active_name
  ON public.resources (type, lower(trim(name)))
  WHERE (archived = false);

-- 4. Update public read RLS policy: public can only see active, non-archived resources
DROP POLICY IF EXISTS resources_public_read ON public.resources;
CREATE POLICY resources_public_read ON public.resources
  FOR SELECT USING (active = true AND archived = false);

-- 5. Update resource_is_available function:
-- Checks that resource is active = true AND archived = false,
-- plus no overlapping confirmed bookings, plus no overlapping blocked times
CREATE OR REPLACE FUNCTION public.resource_is_available(
  p_resource_id     uuid,
  p_starts_at       timestamptz,
  p_ends_at         timestamptz,
  p_exclude_booking uuid DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  v_active boolean;
  v_archived boolean;
  conflict_count int;
BEGIN
  -- Verify resource is active and not archived
  SELECT active, archived INTO v_active, v_archived
  FROM public.resources
  WHERE id = p_resource_id;

  IF v_active IS NOT TRUE OR v_archived IS TRUE THEN
    RETURN false;
  END IF;

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

-- 6. Update create_booking RPC to ensure archived = false
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
  v_table_enabled    boolean := true;
  v_netflix_enabled  boolean := true;
  v_booking_ref      text;
  v_booking          jsonb;
  v_max_advance_days int;
  v_min_advance_min  int;
  v_now              timestamptz;
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
      AND archived = false
      AND capacity >= p_guest_count
      AND public.resource_is_available(id, p_starts_at, v_ends_at)
    ORDER BY capacity ASC
    LIMIT 1;

    IF v_resource_id IS NULL THEN
      RETURN jsonb_build_object('error', 'No available table found for your party size and requested time. Please try a different time.');
    END IF;

    v_total_amount := 0;
  END IF;

  -- For Netflix room: find available netflix_room resource
  IF p_booking_type = 'netflix_room' THEN
    IF p_resource_id IS NOT NULL THEN
      -- Admin specified resource
      SELECT id, capacity INTO v_resource_id, v_resource_capacity
      FROM public.resources
      WHERE id = p_resource_id
        AND type = 'netflix_room'
        AND active = true
        AND archived = false;
    ELSE
      SELECT id, capacity INTO v_resource_id, v_resource_capacity
      FROM public.resources
      WHERE type = 'netflix_room'
        AND active = true
        AND archived = false
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
