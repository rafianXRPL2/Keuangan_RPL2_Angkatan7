# 💰 Sistem Manajemen Keuangan Kas Kelas XI RPL 2

Aplikasi manajemen keuangan kas kelas modern, realtime, dan interaktif berbasis **Next.js 16 (App Router)** & **Supabase Realtime Cloud Backend**.

![License](https://img.shields.io/badge/License-ISC-blue.svg)
![Next.js](https://img.shields.io/badge/Framework-Next.js%2016-black?logo=nextdotjs)
![Database](https://img.shields.io/badge/Database-Supabase-emerald?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?logo=tailwindcss)

---

## ✨ Fitur Utama

- ⚡ **Monitoring Realtime Supabase**: Semua perubahan data kas (pembayaran, pengeluaran, anggaran) disinkronisasikan secara otomatis via Supabase Postgres Changes.
- 🔐 **Mode Bendahara & JWT Cookie Session (2 Jam)**: Proteksi akses admin menggunakan token JWT bertandatangan digital yang tersimpan di Cookie browser selama 2 jam, sehingga admin tidak perlu terus-menerus melakukan login saat memuat ulang halaman.
- 📊 **Tabel Kas Bulanan & Batch Lunas**: Pencatatan kas bulanan per siswa (Minggu 1 - 4) dengan fitur *Batch Lunas* untuk menandai lunas banyak siswa sekaligus.
- 🧾 **Manajemen Pengeluaran & Nota**: Fitur catat, edit, dan hapus transaksi pengeluaran lengkap dengan unggah bukti foto nota ke Supabase Storage (dilengkapi *Base64 fallback*).
- 💵 **Pemasukan Luar & Rencana Anggaran**: Fitur pencatatan alokasi dana dan dana tak terduga.
- 🎯 **Target Tabungan Event Kelas**: Monitoring progres penggalangan dana kegiatan kelas.
- 📅 **Kalender Agenda Kas**: Integrasi FullCalendar untuk agenda kegiatan kelas.
- ✉️ **Kotak Suara Anonim**: Wadah aspirasi, kritik, dan saran siswa secara anonim.
- 📱 **QRIS Payment & Tagihan WhatsApp**: Fitur *Scan QRIS* dan broadcast pesan tagihan kas personal / grup via WhatsApp Web API.
- 🌙 **Dark Mode & Responsive UI**: Tampilan modern dengan TailwindCSS dan animasi Framer Motion.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 16 (React 19, TypeScript)
- **Backend & Realtime DB**: Supabase (Postgres Changes & Storage)
- **Otentikasi Admin**: Custom JWT Authentication & Cookie Storage
- **UI & Styling**: TailwindCSS, Framer Motion, Lucide Icons, FontAwesome
- **Kalender**: FullCalendar v6
- **Notifikasi & Alert**: SweetAlert2 & Custom Toast

---

## 🚀 Panduan Instalasi Lokal

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/rafianXRPL2/Keuangan_RPL2_Angkatan7.git
cd Keuangan_RPL2_Angkatan7
npm install
```

### 2. Konfigurasi Environment Variables (`.env`)
Buat atau perbarui file `.env` di direktori utama:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🌐 Deploy ke Vercel

Aplikasi ini sudah siap untuk di-deploy ke **Vercel**:

1. Import repositori ini di dashboard [Vercel](https://vercel.com).
2. Tambahkan **Environment Variables** berikut pada menu *Project Settings -> Environment Variables*:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Klik **Deploy**!

---

## 📜 Lisensi & Hak Cipta

Dikembangkan untuk pengelola keuangan kelas **XI RPL 2 Angkatan 7**. Lisensi ISC.
