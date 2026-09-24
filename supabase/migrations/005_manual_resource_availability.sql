-- ============================================================
-- BRAVO BARISTA SCHOOL - MANUAL RESOURCE AVAILABILITY MIGRATION
-- Migration 005: Manual physical availability (available / occupied / paused / archived)
-- ============================================================

-- 1. Add status column to resources table
ALTER TABLE public.resources
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'available'
  CHECK (status IN ('available', 'occupied', 'paused', 'archived'));

-- 2. Populate status from existing flags
UPDATE public.resources
SET status = CASE
  WHEN archived = true THEN 'archived'
  WHEN active = false THEN 'paused'
  ELSE 'available'
END;

-- 3. Create index for fast status lookups
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);

-- 4. Trigger to keep status, active, and archived flags synchronized
CREATE OR REPLACE FUNCTION public.sync_resource_status_and_flags()
RETURNS trigger AS $$
BEGIN
  -- If status explicitly changed
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'available' THEN
      NEW.active := true;
      NEW.archived := false;
    ELSIF NEW.status = 'occupied' THEN
      NEW.active := true;
      NEW.archived := false;
    ELSIF NEW.status = 'paused' THEN
      NEW.active := false;
      NEW.archived := false;
    ELSIF NEW.status = 'archived' THEN
      NEW.active := false;
      NEW.archived := true;
    END IF;
  -- If archived explicitly set to true
  ELSIF NEW.archived = true THEN
    NEW.status := 'archived';
    NEW.active := false;
  -- If active changed without explicit status change
  ELSIF TG_OP = 'UPDATE' AND NEW.active IS DISTINCT FROM OLD.active THEN
    IF NEW.active = false AND OLD.status NOT IN ('archived') THEN
      NEW.status := 'paused';
    ELSIF NEW.active = true AND OLD.status = 'paused' THEN
      NEW.status := 'available';
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    IF NEW.status IS NULL THEN
      IF NEW.archived = true THEN
        NEW.status := 'archived';
        NEW.active := false;
      ELSIF NEW.active = false THEN
        NEW.status := 'paused';
      ELSE
        NEW.status := 'available';
        NEW.active := true;
        NEW.archived := false;
      END IF;
    ELSE
      IF NEW.status = 'available' THEN
        NEW.active := true;
        NEW.archived := false;
      ELSIF NEW.status = 'occupied' THEN
        NEW.active := true;
        NEW.archived := false;
      ELSIF NEW.status = 'paused' THEN
        NEW.active := false;
        NEW.archived := false;
      ELSIF NEW.status = 'archived' THEN
        NEW.active := false;
        NEW.archived := true;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_resource_status ON public.resources;
CREATE TRIGGER trg_sync_resource_status
  BEFORE INSERT OR UPDATE ON public.resources
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_resource_status_and_flags();

-- 5. Public read policy: public can see non-archived resources and their current status
DROP POLICY IF EXISTS resources_public_read ON public.resources;
CREATE POLICY resources_public_read ON public.resources
  FOR SELECT USING (archived = false);

-- 6. RPC: mark_resource_status (Used by Admin to set available / occupied / paused / archived)
CREATE OR REPLACE FUNCTION public.mark_resource_status(
  p_resource_id uuid,
  p_status      text
)
RETURNS jsonb AS $$
DECLARE
  v_res public.resources%ROWTYPE;
BEGIN
  IF p_status NOT IN ('available', 'occupied', 'paused', 'archived') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid status: must be available, occupied, paused, or archived');
  END IF;

  UPDATE public.resources
  SET
    status = p_status,
    updated_at = now()
  WHERE id = p_resource_id
  RETURNING * INTO v_res;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Resource not found');
  END IF;

  RETURN jsonb_build_object('success', true, 'resource', to_jsonb(v_res));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update resource_is_available function to check status = 'available'
CREATE OR REPLACE FUNCTION public.resource_is_available(
  p_resource_id     uuid,
  p_starts_at       timestamptz DEFAULT NULL,
  p_ends_at         timestamptz DEFAULT NULL,
  p_exclude_booking uuid DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  v_status text;
  conflict_count int;
BEGIN
  -- Verify resource is currently AVAILABLE
  SELECT status INTO v_status
  FROM public.resources
  WHERE id = p_resource_id;

  IF v_status IS DISTINCT FROM 'available' THEN
    RETURN false;
  END IF;

  -- If time window provided, check blocked_times
  IF p_starts_at IS NOT NULL AND p_ends_at IS NOT NULL THEN
    SELECT COUNT(*) INTO conflict_count
    FROM public.blocked_times
    WHERE resource_id = p_resource_id
      AND starts_at < p_ends_at
      AND ends_at > p_starts_at;

    IF conflict_count > 0 THEN RETURN false; END IF;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 8. Atomic booking creation RPC with manual availability assignment and locking
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
  v_resource_id       uuid;
  v_resource_name     text;
  v_resource_capacity int;
  v_ends_at           timestamptz;
  v_total_amount      numeric(10,2) := 0;
  v_netflix_price     numeric(10,2);
  v_table_enabled     boolean := true;
  v_netflix_enabled   boolean := true;
  v_booking_ref       text;
  v_booking           jsonb;
  v_max_advance_days  int;
  v_min_advance_min   int;
  v_now               timestamptz;
BEGIN
  v_now := now();

  -- Validate booking type
  IF p_booking_type NOT IN ('table', 'netflix_room') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid booking type');
  END IF;

  -- Validate customer info
  IF length(trim(COALESCE(p_customer_name, ''))) < 2 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Please provide a valid name');
  END IF;

  IF length(trim(COALESCE(p_phone, ''))) < 7 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Please provide a valid phone number');
  END IF;

  -- Validate enabled in settings
  IF p_booking_type = 'table' THEN
    SELECT COALESCE(value, 'true')::boolean INTO v_table_enabled
    FROM public.booking_settings WHERE key = 'table_booking_enabled';
    IF NOT v_table_enabled THEN
      RETURN jsonb_build_object('success', false, 'error', 'Table booking is currently unavailable');
    END IF;
  END IF;

  IF p_booking_type = 'netflix_room' THEN
    SELECT COALESCE(value, 'true')::boolean INTO v_netflix_enabled
    FROM public.booking_settings WHERE key = 'netflix_booking_enabled';
    IF NOT v_netflix_enabled THEN
      RETURN jsonb_build_object('success', false, 'error', 'Netflix room booking is currently unavailable');
    END IF;
  END IF;

  -- Validate advance booking window
  SELECT COALESCE(value, '30')::int INTO v_min_advance_min
  FROM public.booking_settings WHERE key = 'min_advance_minutes';

  SELECT COALESCE(value, '60')::int INTO v_max_advance_days
  FROM public.booking_settings WHERE key = 'max_advance_days';

  IF p_starts_at < v_now + (v_min_advance_min * interval '1 minute') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Booking must be made at least ' || v_min_advance_min || ' minutes in advance');
  END IF;

  IF p_starts_at > v_now + (v_max_advance_days * interval '1 day') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot book more than ' || v_max_advance_days || ' days in advance');
  END IF;

  -- Calculate end time from duration (informational for customer / staff record)
  v_ends_at := p_starts_at + (p_duration_minutes * interval '1 minute');

  -- ── TABLE BOOKING FLOW ───────────────────────────────────────
  IF p_booking_type = 'table' THEN
    IF p_guest_count > 6 THEN
      RETURN jsonb_build_object('success', false, 'error', 'Maximum party size for table reservations is 6 guests');
    END IF;

    -- Atomically select one suitable AVAILABLE table with row-level locking
    SELECT id, name, capacity INTO v_resource_id, v_resource_name, v_resource_capacity
    FROM public.resources
    WHERE type = 'table'
      AND status = 'available'
      AND active = true
      AND archived = false
      AND capacity >= p_guest_count
    ORDER BY capacity ASC, name ASC
    LIMIT 1
    FOR UPDATE;

    IF v_resource_id IS NULL THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'NO_TABLES_AVAILABLE',
        'message', 'No tables currently available. All tables are currently reserved. Please check again later.'
      );
    END IF;

    -- Atomically mark table OCCUPIED. Admin must release manually.
    UPDATE public.resources
    SET status = 'occupied', updated_at = now()
    WHERE id = v_resource_id;

    v_total_amount := 0;
  END IF;

  -- ── NETFLIX ROOM BOOKING FLOW ────────────────────────────────
  IF p_booking_type = 'netflix_room' THEN
    IF p_resource_id IS NOT NULL THEN
      -- Specific room requested
      SELECT id, name, capacity INTO v_resource_id, v_resource_name, v_resource_capacity
      FROM public.resources
      WHERE id = p_resource_id
        AND type = 'netflix_room'
        AND status = 'available'
        AND active = true
        AND archived = false
      FOR UPDATE;
    ELSE
      -- Find available room
      SELECT id, name, capacity INTO v_resource_id, v_resource_name, v_resource_capacity
      FROM public.resources
      WHERE type = 'netflix_room'
        AND status = 'available'
        AND active = true
        AND archived = false
      ORDER BY capacity ASC, name ASC
      LIMIT 1
      FOR UPDATE;
    END IF;

    IF v_resource_id IS NULL THEN
      RETURN jsonb_build_object(
        'success', false,
        'error', 'NETFLIX_ROOM_UNAVAILABLE',
        'message', 'The Netflix room is currently unavailable. Please check again later or contact Bravo.'
      );
    END IF;

    -- Atomically mark room OCCUPIED. Admin must release manually.
    UPDATE public.resources
    SET status = 'occupied', updated_at = now()
    WHERE id = v_resource_id;

    -- Authoritative price calculation from booking_settings
    SELECT COALESCE(value, '300')::numeric INTO v_netflix_price
    FROM public.booking_settings WHERE key = 'netflix_price_per_hour';

    v_total_amount := (p_duration_minutes::numeric / 60.0) * v_netflix_price;
  END IF;

  -- Validate guest count against resource capacity if applicable
  IF v_resource_capacity IS NOT NULL AND p_guest_count > v_resource_capacity THEN
    RETURN jsonb_build_object('success', false, 'error', 'Guest count exceeds capacity for this resource');
  END IF;

  -- Generate unique booking reference (e.g. BRV-1045)
  v_booking_ref := public.generate_booking_reference();

  -- Insert booking record
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

  -- Attach resource info to returned JSON for seamless UI confirmation
  v_booking := jsonb_set(v_booking, '{resource}', jsonb_build_object(
    'id', v_resource_id,
    'name', v_resource_name,
    'capacity', v_resource_capacity,
    'type', p_booking_type
  ));

  RETURN jsonb_build_object('success', true, 'booking', v_booking);

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
