# 🏙️ RW-Digital: Sistem Informasi & Layanan Mandiri Rukun Warga

Aplikasi web modern berbasis **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, dan **E-Surat Ber-QR Code** yang dirancang khusus untuk memenuhi kebutuhan pelayanan warga dan tata kelola administrasi kepengurusan Rukun Warga (RW) dan Rukun Tetangga (RT) di Indonesia.

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

### 1. Prasyarat
- **Node.js**: v18+ atau v20+ (Telah terpasang)
- **NPM** / Yarn / PNPM

### 2. Menjalankan Server Development
Buka terminal di direktori proyek (`c:\Users\AXIOO\Documents\rw`), lalu jalankan:

```bash
npm run dev
```

Akses aplikasi di browser: **`http://localhost:3050`**

### 3. Build & Production
Untuk membuat build produksi teroptimasi:
```bash
npm run build
npm run start
```

---

## 🌟 Fitur Utama Sistem

### 1. Landing Page Publik & Portal Warga
- **Beranda Lingkungan (`/`)**:
  - Hero banner, profil RW, sambutan Ketua RW, dan visi-misi.
  - Counter statistik kependudukan live (Total RT, KK, Warga, UMKM, Saldo Kas Terbuka).
  - Widget **Transparansi Kas RW** & 5 transaksi mutasi kas terakhir.
  - Berita, agenda kegiatan posyandu, kerja bakti, dan pengumuman resmi.
  - Showcase etalase UMKM warga sekitar.
  - Bagan struktur kepengurusan RW dan daftar Ketua RT 01 s/d RT 05.
  - Bilah **Kontak Darurat 24 Jam** (Pos Satpam, Bhabinkamtibmas, Babinsa, Damkar, Puskesmas).
- **Layanan E-Surat Pengantar Mandiri (`/surat-online`)**:
  - Form pengajuan online berbagai jenis surat (SKCK, Domisili, Usaha, Kematian, Belum Menikah, dll).
  - Pelacakan progress surat berjenjang (Warga $\rightarrow$ RT $\rightarrow$ RW).
  - Download & Preview Surat resmi ber-**QR Code verifikasi digital**.
- **Cek & Bayar Iuran Warga (`/iuran`)**:
  - Cek rincian tagihan per Kepala Keluarga (Keamanan, Kebersihan, Kas RW).
  - Modal pembayaran via **QRIS dinamis/otomatis** & simulasi bayar instan atau transfer bank.
- **Lapor Aduan Warga (`/lapor`)**:
  - Pengaduan kerusakan lampu jalan (PJU), sampah, keamanan, atau ketertiban.
  - Opsi pelapor anonim (*privacy mode*) dan tracking status tindak lanjut.
- **Peminjaman Fasilitas Balai RW (`/fasilitas`)**:
  - Direktori Balai Warga, Lapangan Olahraga, Tenda/Kursi.
  - Form booking peminjaman dan kalender pemakaian.
- **Pasar & UMKM Warga (`/umkm`)**:
  - Direktori produk/jasa buatan tetangga lengkap dengan tombol chat WhatsApp langsung ke penjual.
  - Form pendaftaran UMKM baru bagi warga.
- **Halaman Verifikasi Publik QR Code (`/verify/[token]`)**:
  - Halaman resmi yang terbuka ketika QR Code pada dokumen surat fisik/PDF di-scan oleh instansi/kelurahan/kepolisian untuk memastikan keabsahan tanda tangan pengurus.

---

### 2. Admin Dashboard Pengurus (`/admin`)
- **Demo Role Switcher**:
  - **Ketua RW (Superadmin)**: Pengesahan final E-Surat, pengawasan kas umum dan seluruh RT.
  - **Ketua RT 01 (Admin RT)**: Validasi surat warga RT 01 dan manajemen warga RT bersangkutan.
  - **Bendahara RW**: Verifikasi pembayaran transfer dan pencatatan Buku Kas Umum (Kas Masuk/Keluar).
  - **Petugas Keamanan / Lapangan**: Update penanganan tiket aduan warga.
- **Overview Dashboard (`/admin`)**: KPI ringkasan kependudukan, iuran tertagih, saldo kas, dan antrean persetujuan.
- **Manajemen Kependudukan (`/admin/kependudukan`)**:
  - Data Kartu Keluarga (KK) dan Data Jiwa Penduduk.
  - Filter per RT, status tinggal (Tetap/Kontrak), dan fitur sensor NIK untuk kepatuhan UU PDP.
  - Form Tambah KK & Tambah Warga.
- **Manajemen E-Surat (`/admin/surat`)**:
  - Approval flow RT $\rightarrow$ RW.
  - Pratinjau & Cetak Dokumen PDF Resmi format standar administrasi RT/RW Indonesia dengan Kop Surat, Stempel, dan QR Code.
- **Manajemen Keuangan & Kas (`/admin/keuangan`)**:
  - Monitoring status pembayaran tagihan iuran warga.
  - Pencatatan mutasi kas masuk/keluar buku kas umum.
- **Helpdesk Aduan (`/admin/aduan`)**:
  - Penugasan aduan ke seksi terkait dan update progres penanganan hingga tuntas.
- **CMS Konten (`/admin/cms`)**:
  - Publikasi berita & pengumuman, kurasi katalog UMKM, serta persetujuan booking balai warga.

---

## 🗂️ Struktur Direktori Proyek

```
rw-digital/
├── PRD_SISTEM_INFORMASI_RW.md   # Dokumen PRD & Skema Lengkap
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root Layout & AppProvider
│   │   ├── page.tsx             # Landing Page Publik
│   │   ├── globals.css          # Tailwind CSS & Print Stylesheet
│   │   ├── surat-online/page.tsx# E-Surat Mandiri & Tracking
│   │   ├── iuran/page.tsx       # Cek & Bayar Iuran QRIS
│   │   ├── lapor/page.tsx       # Pengaduan Warga Lingkungan
│   │   ├── fasilitas/page.tsx   # Direktori & Booking Balai
│   │   ├── umkm/page.tsx        # Direktori UMKM Warga
│   │   ├── verify/[token]/page.tsx # Verifikasi QR Dokumen Publik
│   │   └── admin/
│   │       ├── layout.tsx       # Admin Layout & Role Switcher
│   │       ├── page.tsx         # Overview Dashboard
│   │       ├── kependudukan/page.tsx # Manajemen KK & Warga
│   │       ├── surat/page.tsx   # Workflow Approval & Cetak Surat
│   │       ├── keuangan/page.tsx# Billing Iuran & Buku Kas
│   │       ├── aduan/page.tsx   # Helpdesk Aduan Warga
│   │       └── cms/page.tsx     # CMS Berita & Approval Booking
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   ├── common/              # EmergencyBar
│   │   └── landing/             # HeroSection, Stats, Transparency, dll.
│   ├── data/
│   │   └── mockData.ts          # Dataset Awal Realistis RW 05
│   ├── lib/
│   │   ├── store.tsx            # State Provider & LocalStorage Persistence
│   │   └── utils.ts             # Helper Rupiah, Tanggal, Mask NIK
│   └── types/
│       └── index.ts             # Definisi TypeScript Interfaces
```

---

## 🔒 Keamanan & Perlindungan Data Pribadi (UU PDP)
- Seluruh NIK dan Nomor KK disensor secara default (`320101******0001`) di tampilan umum.
- Tanda tangan digital menggunakan token hash unik (`/verify/[token]`) yang aman untuk keperluan audit dan pembuktian instansi luar tanpa mengekspos data rahasia keluarga.
