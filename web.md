# Rancangan Web — Aplikasi Pemilahan Sampah (Next.js & Prisma)

Dokumen ini berisi rancangan arsitektur dan alur kerja aplikasi pemilahan sampah yang diselaraskan dengan codebase Next.js + Prisma + PostgreSQL + Tailwind v4 yang ada di direktori `D:\Koding\NextJs\sampah`.

---

## 1. Overview & Integrasi Database

Aplikasi ini menggunakan Next.js (TypeScript) dengan ORM Prisma dan PostgreSQL. Desain tabel sudah terstruktur dengan model **2 Role** (`admin` & `warga`) sesuai yang didefinisikan pada [schema.prisma](file:///D:/Koding/NextJs/sampah/prisma/schema.prisma):

```
User (admin / warga)
 ├── LaporanSampah (Pencatatan setor per kategori & wilayah)
 │     └── FotoSampah
 ├── SaldoLog (Histori mutasi poin warga)
 └── Penukaran (Request redeem poin/reward)
```

---

## 2. Struktur Halaman (Next.js App Router)

Dengan Next.js App Router, berikut struktur routing `/app` yang direkomendasikan:

```
app/
├── layout.tsx                # Global layout (font, metadata, providers)
├── page.tsx                  # Landing page publik (info, ajakan mendaftar)
├── login/
│   └── page.tsx              # Form Login
├── register/
│   └── page.tsx              # Form Register Warga
│
├── warga/                    # Group Route khusus Warga
│   ├── layout.tsx            # Sidebar & Navbar khusus warga
│   ├── dashboard/
│   │   └── page.tsx          # Saldo poin, total setor, riwayat ringkas
│   ├── histori/
│   │   └── page.tsx          # Tabel lengkap LaporanSampah milik warga
│   ├── penukaran/
│   │   └── page.tsx          # Ajukan penukaran poin & list status pengajuan
│   └── profil/
│       └── page.tsx          # Edit profil & ganti password
│
└── admin/                    # Group Route khusus Admin
    ├── layout.tsx            # Sidebar & Navbar khusus admin
    ├── dashboard/
    │   └── page.tsx          # Statistik hari ini, grafik sampah masuk
    ├── setor/
    │   ├── page.tsx          # Daftar semua laporan masuk
    │   └── create/
    │       └── page.tsx      # Form input setoran baru (pilih warga, jenis, wilayah)
    ├── penukaran/
    │   └── page.tsx          # Verifikasi ajukan penukaran (approve / reject)
    ├── jenis-sampah/
    │   └── page.tsx          # CRUD daftar jenis sampah & harga per kg
    ├── wilayah/
    │   └── page.tsx          # CRUD daftar wilayah kerja bank sampah
    └── warga/
        └── page.tsx          # List warga terdaftar & profil histori detailnya
```

---

## 3. Penyelarasan Alur Fitur Utama & Validasi

### A. Fitur Setor Sampah (Admin Input)
1. **Form Input (`/admin/setor/create`)**:
   - Admin memilih **Warga** (dari searchable select / list users).
   - Admin memilih **Wilayah** (dari table `Wilayah` hasil database).
   - Admin memilih **Jenis Sampah** (dari table `JenisSampah`).
   - Admin memasukkan **Berat (kg)**.
2. **Kalkulasi di Server/Action**:
   - Ambil data harga live dari `JenisSampah.hargaPerKg`.
   - Hitung `subtotalPoin = beratKg * hargaSnapshot`.
   - Jalankan `db.$transaction()` untuk:
     1. Menulis data ke `LaporanSampah` (menyimpan `hargaSnapshot` agar tidak berubah jika di masa depan harga di-update).
     2. Menulis data ke `SaldoLog` dengan tipe `kredit` senilai `subtotalPoin`.
     3. Mengunggah gambar ke `FotoSampah` jika dilampirkan.

### B. Fitur Penukaran Poin (Warga Request → Admin Approve)
1. **Pengajuan Warga (`/warga/penukaran`)**:
   - Warga mengisi form request penukaran dengan `jumlahPoin` dan `jenis` (`uang_tunai` / `reward`).
   - Validasi Server: Cek apakah saldo poin saat ini (`SUM(kredit) - SUM(debit)`) mencukupi. Jika kurang, tolak request.
   - Status awal di set ke `menunggu`.
2. **Persetujuan Admin (`/admin/penukaran`)**:
   - Admin melihat daftar pengajuan dengan status `menunggu`.
   - Jika **Disetujui**:
     - Sistem membuat entry `SaldoLog` baru dengan tipe `debit` senilai `jumlahPoin` dengan keterangan penukaran.
     - Ubah status `Penukaran` menjadi `disetujui` dan catat `idAdminProses` serta `processedAt`.
   - Jika **Ditolak**:
     - Cukup ubah status `Penukaran` menjadi `ditolak` (saldo tidak berkurang karena saldoLog debit belum dibuat).

---

## 4. Keuntungan Skema Database Anda Saat Ini

1. **Keamanan Finansial (Saldo Log)**:
   Model `SaldoLog` dengan `tipe` (`kredit` / `debit`) sangat baik karena menggunakan pendekatan ledger. Ini menghindari inkonsistensi saldo akibat kegagalan query update user.
2. **Wilayah Multi-Kopdes/Cluster**:
   Keberadaan model `Wilayah` memudahkan segmentasi warga berdasarkan kluster daerah (RT/RW/Dusun) sehingga rekapitulasi data sampah per wilayah menjadi sangat mudah.
3. **Harga Snapshot**:
   Kolom `hargaSnapshot` di `LaporanSampah` mengamankan histori transaksi lama agar tidak berubah ketika admin mengedit harga per kg jenis sampah.
