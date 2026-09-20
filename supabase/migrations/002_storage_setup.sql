-- Enable RLS on storage.objects if it's not already
-- (usually it is enabled by default in Supabase)

-- Read access for public
CREATE POLICY "Public Read Access for Bravo Buckets"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('bravo-videos', 'bravo-gallery', 'bravo-banners') );

-- Insert access for admins
CREATE POLICY "Admin Insert Access for Bravo Buckets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('bravo-videos', 'bravo-gallery', 'bravo-banners') 
  AND public.is_admin()
);

-- Update access for admins
CREATE POLICY "Admin Update Access for Bravo Buckets"
ON storage.objects FOR UPDATE
USING (
  bucket_id IN ('bravo-videos', 'bravo-gallery', 'bravo-banners') 
  AND public.is_admin()
);

-- Delete access for admins
CREATE POLICY "Admin Delete Access for Bravo Buckets"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('bravo-videos', 'bravo-gallery', 'bravo-banners') 
  AND public.is_admin()
);
