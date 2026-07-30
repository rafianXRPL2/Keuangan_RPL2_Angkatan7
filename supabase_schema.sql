-- ==============================================================================
-- SCHEMA SQL SUPABASE - KEUANGAN KAS XI RPL 2
-- ==============================================================================
-- Skrip ini menyiapkan semua tabel, fungsi, trigger, Row Level Security (RLS), 
-- Realtime Publication, dan Storage Bucket 'bukti' untuk aplikasi Kas Kelas.
-- Cara Menggunakan: Copy-paste seluruh isi skrip ini ke SQL Editor di Supabase Dashboard.
-- ==============================================================================

-- 1. EKSIENSI & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL-TABEL UTAMA DATABASE KAS

-- A. Tabel Kas Bulanan Siswa (kas_xi_rpl2)
CREATE TABLE IF NOT EXISTS public.kas_xi_rpl2 (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bulan VARCHAR(50) NOT NULL,
    siswa_id INT NOT NULL,
    m1 INT DEFAULT 0,
    m2 INT DEFAULT 0,
    m3 INT DEFAULT 0,
    m4 INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_bulan_siswa UNIQUE (bulan, siswa_id)
);

-- B. Tabel Override Nama Custom Siswa (nama_siswa_custom)
CREATE TABLE IF NOT EXISTS public.nama_siswa_custom (
    siswa_id INT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- C. Tabel Status Siswa Nonaktif (siswa_nonaktif)
CREATE TABLE IF NOT EXISTS public.siswa_nonaktif (
    siswa_id INT PRIMARY KEY,
    is_nonaktif BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- D. Tabel Pengeluaran Kas (pengeluaran_kas)
CREATE TABLE IF NOT EXISTS public.pengeluaran_kas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanggal VARCHAR(100) NOT NULL,
    keperluan TEXT NOT NULL,
    kategori VARCHAR(100) DEFAULT 'Umum',
    nominal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    nota TEXT DEFAULT '#',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- E. Tabel Pemasukan Lain Kas (pemasukan_lain_kas)
CREATE TABLE IF NOT EXISTS public.pemasukan_lain_kas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanggal VARCHAR(100) NOT NULL,
    sumber TEXT NOT NULL,
    nominal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    bukti TEXT DEFAULT '#',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- F. Tabel Rencana Anggaran (anggaran_kas)
CREATE TABLE IF NOT EXISTS public.anggaran_kas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kegiatan TEXT NOT NULL,
    estimasi NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- G. Tabel Target Tabungan / Event (target_dana_kas)
CREATE TABLE IF NOT EXISTS public.target_dana_kas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    target NUMERIC(15, 2) NOT NULL DEFAULT 0,
    terkumpul NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- H. Tabel Agenda Kalender Kelas (agenda_kalender)
CREATE TABLE IF NOT EXISTS public.agenda_kalender (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    start VARCHAR(100) NOT NULL,
    background_color VARCHAR(50) DEFAULT '#4f46e5',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- I. Tabel Saran & Aspirasi Anonim (saran_kelas)
CREATE TABLE IF NOT EXISTS public.saran_kelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teks TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- J. Tabel App Metadata / Log (app_metadata)
CREATE TABLE IF NOT EXISTS public.app_metadata (
    key VARCHAR(100) PRIMARY KEY,
    val TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inisialisasi awal log metadata
INSERT INTO public.app_metadata (key, val)
VALUES ('Terakhir_Diperbarui', 'Baru saja')
ON CONFLICT (key) DO NOTHING;


-- ==============================================================================
-- 3. PUBLIKASI REALTIME SUPABASE (POSTGRES CHANGES SUBSCRIPTION)
-- ==============================================================================

-- Aktifkan Realtime Publication pada semua tabel kas agar frontend ter-update secara otomatis
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.kas_xi_rpl2; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.nama_siswa_custom; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.siswa_nonaktif; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.pengeluaran_kas; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.pemasukan_lain_kas; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.anggaran_kas; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.target_dana_kas; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.agenda_kalender; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.saran_kelas; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.app_metadata; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;



-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) & PUBLIC PERMISSIONS
-- ==============================================================================

ALTER TABLE public.kas_xi_rpl2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nama_siswa_custom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa_nonaktif ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengeluaran_kas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pemasukan_lain_kas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anggaran_kas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.target_dana_kas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_kalender ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saran_kelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_metadata ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses Publik (Allow All Read/Write untuk aplikasi Web Kas)
DROP POLICY IF EXISTS "Public Full Access" ON public.kas_xi_rpl2;
CREATE POLICY "Public Full Access" ON public.kas_xi_rpl2 FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON public.nama_siswa_custom;
CREATE POLICY "Public Full Access" ON public.nama_siswa_custom FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON public.siswa_nonaktif;
CREATE POLICY "Public Full Access" ON public.siswa_nonaktif FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON public.pengeluaran_kas;
CREATE POLICY "Public Full Access" ON public.pengeluaran_kas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON public.pemasukan_lain_kas;
CREATE POLICY "Public Full Access" ON public.pemasukan_lain_kas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON public.anggaran_kas;
CREATE POLICY "Public Full Access" ON public.anggaran_kas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON public.target_dana_kas;
CREATE POLICY "Public Full Access" ON public.target_dana_kas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON public.agenda_kalender;
CREATE POLICY "Public Full Access" ON public.agenda_kalender FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON public.saran_kelas;
CREATE POLICY "Public Full Access" ON public.saran_kelas FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Full Access" ON public.app_metadata;
CREATE POLICY "Public Full Access" ON public.app_metadata FOR ALL USING (true) WITH CHECK (true);


-- ==============================================================================
-- 5. KONFIGURASI SUPABASE STORAGE BUCKET 'bukti'
-- ==============================================================================

-- Buat bucket 'bukti' jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('bukti', 'bukti', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Kebijakan Akses Storage Bucket
DROP POLICY IF EXISTS "Public Storage Read Access" ON storage.objects;
CREATE POLICY "Public Storage Read Access" ON storage.objects
FOR SELECT USING (bucket_id = 'bukti');

DROP POLICY IF EXISTS "Public Storage Insert Access" ON storage.objects;
CREATE POLICY "Public Storage Insert Access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'bukti');

DROP POLICY IF EXISTS "Public Storage Delete Access" ON storage.objects;
CREATE POLICY "Public Storage Delete Access" ON storage.objects
FOR DELETE USING (bucket_id = 'bukti');
