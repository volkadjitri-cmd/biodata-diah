-- Supabase SQL untuk mengizinkan upload tugas dan menyimpan metadata
-- Jalankan di SQL Editor Supabase

-- 0. Pastikan kolom description ada di tabel uploads
ALTER TABLE public.uploads
ADD COLUMN IF NOT EXISTS description text;

-- 1. Buat policy insert untuk tabel uploads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow admins and authenticated users to insert uploads'
  ) THEN
    CREATE POLICY "Allow admins and authenticated users to insert uploads"
    ON public.uploads
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
  END IF;
END $$;

-- 2. Buat policy select untuk tabel uploads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow public read access to uploads'
  ) THEN
    CREATE POLICY "Allow public read access to uploads"
    ON public.uploads
    FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;

-- 3. Izinkan upload ke bucket tugas
insert into storage.buckets (id, name, public)
values ('tugas', 'tugas', true)
on conflict (id) do nothing;

-- 4. Policy untuk upload/download file di bucket tugas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow public read access to tugas bucket'
  ) THEN
    CREATE POLICY "Allow public read access to tugas bucket"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'tugas');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated upload to tugas bucket'
  ) THEN
    CREATE POLICY "Allow authenticated upload to tugas bucket"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'tugas');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated update to tugas bucket'
  ) THEN
    CREATE POLICY "Allow authenticated update to tugas bucket"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'tugas')
    WITH CHECK (bucket_id = 'tugas');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy WHERE polname = 'Allow authenticated delete to tugas bucket'
  ) THEN
    CREATE POLICY "Allow authenticated delete to tugas bucket"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'tugas');
  END IF;
END $$;
