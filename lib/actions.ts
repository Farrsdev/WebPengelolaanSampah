"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Seed Initial Data for Bank Sampah ────────────────────
export async function seedIfEmpty() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) return;

    // Seed Admin & Warga
    const admin = await prisma.user.create({
      data: {
        nama: "Ahmad Rifai (Admin)",
        email: "admin@ecowaste.id",
        noHp: "081234567890",
        password: "password123",
        role: "admin",
      },
    });

    const warga1 = await prisma.user.create({
      data: {
        nama: "Siti Nurhaliza",
        email: "siti@ecowaste.id",
        noHp: "081298765432",
        password: "password123",
        role: "warga",
      },
    });

    const warga2 = await prisma.user.create({
      data: {
        nama: "Budi Santoso",
        email: "budi@ecowaste.id",
        noHp: "081311223344",
        password: "password123",
        role: "warga",
      },
    });

    // Seed Wilayah
    const w1 = await prisma.wilayah.create({
      data: {
        namaWilayah: "Kecamatan Menteng",
        kodeWilayah: "JKT-MTG",
        deskripsi: "Wilayah pemukiman padat Jakarta Pusat",
      },
    });

    const w2 = await prisma.wilayah.create({
      data: {
        namaWilayah: "Kecamatan Kebayoran",
        kodeWilayah: "JKT-KBY",
        deskripsi: "Kawasan perkantoran Jakarta Selatan",
      },
    });

    // Seed JenisSampah
    const j1 = await prisma.jenisSampah.create({
      data: {
        namaJenis: "Plastik",
        hargaPerKg: 3000,
        bisaDidaurUlang: true,
        keterangan: "Botol, kemasan, kantong plastik",
      },
    });

    const j2 = await prisma.jenisSampah.create({
      data: {
        namaJenis: "Kertas",
        hargaPerKg: 2000,
        bisaDidaurUlang: true,
        keterangan: "Koran, kardus, kertas HVS",
      },
    });

    // Seed Initial Laporan & Foto
    const lap1 = await prisma.laporanSampah.create({
      data: {
        userId: warga1.id,
        jenisSampahId: j1.id,
        wilayahId: w1.id,
        beratKg: 15.5,
        hargaSnapshot: 3000,
        subtotalPoin: 46500,
        catatan: "Setoran botol plastik bersih",
      },
    });

    await prisma.fotoSampah.create({
      data: {
        laporanId: lap1.id,
        urlFoto: "/uploads/sample_plastik.jpg",
        ukuranKb: 1024,
        tipeFile: "image/jpeg",
      },
    });

    // Seed Saldo Ledger
    await prisma.saldoLog.create({
      data: {
        userId: warga1.id,
        tipe: "kredit",
        jumlah: 46500,
        referensiId: lap1.id,
        referensiTipe: "setor",
        keterangan: "Setor plastik 15.5 kg",
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
  }
}

// ── Auth Actions (Multi-User) ───────────────────────────
export async function loginUser(
  emailOrHp: string,
  pass: string
): Promise<ActionResult<any>> {
  await seedIfEmpty();
  const identifier = emailOrHp.trim().toLowerCase();

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { noHp: identifier }],
      },
    });

    if (!user) {
      return { success: false, error: "Email atau Nomor HP tidak terdaftar." };
    }

    if (user.password !== pass.trim()) {
      return { success: false, error: "Password salah." };
    }

    const { password, ...userWithoutPassword } = user;
    return { success: true, data: userWithoutPassword };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal melakukan login." };
  }
}

export async function registerUser(data: {
  nama: string;
  email: string;
  noHp: string;
  password: string;
  alamat?: string;
}): Promise<ActionResult<any>> {
  await seedIfEmpty();
  const nama = data.nama.trim();
  const email = data.email.trim().toLowerCase();
  const noHp = data.noHp.trim();
  const password = data.password.trim();

  if (!nama || nama.length < 3) return { success: false, error: "Nama minimal 3 karakter." };
  if (!email || !email.includes("@")) return { success: false, error: "Format email tidak valid." };
  if (!noHp || noHp.length < 9) return { success: false, error: "Nomor HP minimal 9 digit." };
  if (!password || password.length < 6) return { success: false, error: "Password minimal 6 karakter." };

  try {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return { success: false, error: "Email sudah terdaftar." };

    const existingHp = await prisma.user.findUnique({ where: { noHp } });
    if (existingHp) return { success: false, error: "Nomor HP sudah terdaftar." };

    const newUser = await prisma.user.create({
      data: {
        nama,
        email,
        noHp,
        password,
        alamat: data.alamat?.trim() || null,
        role: "warga",
      },
    });

    const { password: _, ...userClean } = newUser;
    return { success: true, data: userClean };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mendaftarkan akun warga baru." };
  }
}

// ── Saldo Ledger Calculations ────────────────────────────
export async function getSaldoWarga(userId: string) {
  const logs = await prisma.saldoLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const totalKredit = logs
    .filter((l) => l.tipe === "kredit")
    .reduce((sum, l) => sum + Number(l.jumlah), 0);

  const totalDebit = logs
    .filter((l) => l.tipe === "debit")
    .reduce((sum, l) => sum + Number(l.jumlah), 0);

  const saldoPoin = totalKredit - totalDebit;

  const serializedLogs = logs.map((l) => ({
    ...l,
    jumlah: Number(l.jumlah),
    createdAt: l.createdAt.toISOString(),
  }));

  return {
    saldoPoin,
    totalKredit,
    totalDebit,
    logs: serializedLogs,
  };
}

// ── Penukaran Poin Actions ──────────────────────────────
export async function submitPenukaran(data: {
  userId: string;
  jumlahPoin: number;
  jenis: "uang_tunai" | "reward";
  keteranganReward?: string;
}): Promise<ActionResult<any>> {
  if (data.jumlahPoin <= 0) return { success: false, error: "Jumlah poin harus > 0." };

  const { saldoPoin } = await getSaldoWarga(data.userId);
  if (saldoPoin < data.jumlahPoin) {
    return { success: false, error: `Saldo poin tidak cukup. Poin kamu: ${saldoPoin.toLocaleString("id-ID")}` };
  }

  try {
    const penukaran = await prisma.penukaran.create({
      data: {
        idWarga: data.userId,
        jumlahPoin: data.jumlahPoin,
        jenis: data.jenis,
        keteranganReward: data.keteranganReward || (data.jenis === "uang_tunai" ? "Pencairan Uang Tunai" : "Voucher Sembako"),
        status: "menunggu",
      },
    });

    revalidatePath("/warga/penukaran");
    revalidatePath("/admin/penukaran");
    return {
      success: true,
      data: {
        ...penukaran,
        jumlahPoin: Number(penukaran.jumlahPoin),
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengajukan penukaran poin." };
  }
}

export async function processPenukaran(data: {
  penukaranId: string;
  adminId: string;
  action: "approve" | "reject";
}): Promise<ActionResult<any>> {
  try {
    const p = await prisma.penukaran.findUnique({ where: { id: data.penukaranId } });
    if (!p) return { success: false, error: "Penukaran tidak ditemukan." };
    if (p.status !== "menunggu") return { success: false, error: "Permintaan penukaran ini sudah diproses." };

    if (data.action === "reject") {
      const updated = await prisma.penukaran.update({
        where: { id: data.penukaranId },
        data: {
          status: "ditolak",
          idAdminProses: data.adminId,
          processedAt: new Date(),
        },
      });
      revalidatePath("/admin/penukaran");
      return {
        success: true,
        data: {
          ...updated,
          jumlahPoin: Number(updated.jumlahPoin),
        },
      };
    }

    // Approve transaction: Debit from SaldoLog
    const updated = await prisma.$transaction(async (tx) => {
      const pUpdated = await tx.penukaran.update({
        where: { id: data.penukaranId },
        data: {
          status: "disetujui",
          idAdminProses: data.adminId,
          processedAt: new Date(),
        },
      });

      await tx.saldoLog.create({
        data: {
          userId: p.idWarga,
          tipe: "debit",
          jumlah: p.jumlahPoin,
          referensiId: p.id,
          referensiTipe: "penukaran",
          keterangan: `Penukaran ${p.jenis} (${p.keteranganReward || "Poin"})`,
        },
      });

      return pUpdated;
    });

    revalidatePath("/admin/penukaran");
    revalidatePath("/warga/penukaran");
    return {
      success: true,
      data: {
        ...updated,
        jumlahPoin: Number(updated.jumlahPoin),
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memproses penukaran." };
  }
}

export async function getPenukaranList() {
  await seedIfEmpty();
  const list = await prisma.penukaran.findMany({
    include: { warga: true, adminProses: true },
    orderBy: { createdAt: "desc" },
  });

  return list.map((p) => ({
    ...p,
    jumlahPoin: Number(p.jumlahPoin),
    createdAt: p.createdAt.toISOString(),
    processedAt: p.processedAt ? p.processedAt.toISOString() : null,
  }));
}

// ── Wilayah Actions ─────────────────────────────────────
export async function getWilayah() {
  await seedIfEmpty();
  return prisma.wilayah.findMany({ orderBy: { createdAt: "asc" } });
}

export async function createWilayah(data: {
  namaWilayah: string;
  kodeWilayah: string;
  deskripsi: string;
}): Promise<ActionResult<any>> {
  const nama = data.namaWilayah.trim();
  const kode = data.kodeWilayah.trim().toUpperCase();
  const deskripsi = data.deskripsi.trim();

  if (!nama) return { success: false, error: "Nama wilayah tidak boleh kosong." };
  if (!kode || kode.length < 2) return { success: false, error: "Kode wilayah minimal 2 karakter." };

  try {
    const existing = await prisma.wilayah.findFirst({
      where: { OR: [{ namaWilayah: nama }, { kodeWilayah: kode }] },
    });
    if (existing) return { success: false, error: "Nama atau Kode Wilayah sudah terdaftar." };

    const res = await prisma.wilayah.create({
      data: { namaWilayah: nama, kodeWilayah: kode, deskripsi },
    });
    revalidatePath("/wilayah");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal membuat wilayah." };
  }
}

export async function updateWilayah(
  id: string,
  data: { namaWilayah: string; kodeWilayah: string; deskripsi: string }
): Promise<ActionResult<any>> {
  const nama = data.namaWilayah.trim();
  const kode = data.kodeWilayah.trim().toUpperCase();
  const deskripsi = data.deskripsi.trim();

  if (!nama) return { success: false, error: "Nama wilayah tidak boleh kosong." };

  try {
    const res = await prisma.wilayah.update({
      where: { id: String(id) },
      data: { namaWilayah: nama, kodeWilayah: kode, deskripsi },
    });
    revalidatePath("/wilayah");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui wilayah." };
  }
}

export async function deleteWilayah(id: string): Promise<ActionResult<any>> {
  try {
    const res = await prisma.wilayah.delete({ where: { id: String(id) } });
    revalidatePath("/wilayah");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: "Tidak dapat menghapus wilayah yang memiliki relasi LaporanSampah (onDelete: Restrict)." };
  }
}

// ── JenisSampah Actions ──────────────────────────────────
export async function getJenisSampah() {
  await seedIfEmpty();
  const list = await prisma.jenisSampah.findMany({ orderBy: { createdAt: "asc" } });
  return list.map((j) => ({
    ...j,
    hargaPerKg: Number(j.hargaPerKg),
  }));
}

export async function createJenisSampah(data: {
  namaJenis: string;
  hargaPerKg?: number;
  bisaDidaurUlang: boolean;
  keterangan: string;
}): Promise<ActionResult<any>> {
  const nama = data.namaJenis.trim();
  if (!nama) return { success: false, error: "Nama jenis sampah tidak boleh kosong." };

  try {
    const existing = await prisma.jenisSampah.findUnique({ where: { namaJenis: nama } });
    if (existing) return { success: false, error: "Nama Jenis Sampah sudah digunakan." };

    const res = await prisma.jenisSampah.create({
      data: {
        namaJenis: nama,
        hargaPerKg: data.hargaPerKg || 2000,
        bisaDidaurUlang: data.bisaDidaurUlang,
        keterangan: data.keterangan.trim(),
      },
    });
    revalidatePath("/jenis-sampah");
    return {
      success: true,
      data: { ...res, hargaPerKg: Number(res.hargaPerKg) },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menambah jenis sampah." };
  }
}

export async function updateJenisSampah(
  id: string,
  data: { namaJenis: string; hargaPerKg?: number; bisaDidaurUlang: boolean; keterangan: string }
): Promise<ActionResult<any>> {
  const nama = data.namaJenis.trim();
  if (!nama) return { success: false, error: "Nama jenis sampah tidak boleh kosong." };

  try {
    const res = await prisma.jenisSampah.update({
      where: { id: String(id) },
      data: {
        namaJenis: nama,
        hargaPerKg: data.hargaPerKg || 2000,
        bisaDidaurUlang: data.bisaDidaurUlang,
        keterangan: data.keterangan.trim(),
      },
    });
    revalidatePath("/jenis-sampah");
    return {
      success: true,
      data: { ...res, hargaPerKg: Number(res.hargaPerKg) },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui jenis sampah." };
  }
}

export async function deleteJenisSampah(id: string): Promise<ActionResult<any>> {
  try {
    const res = await prisma.jenisSampah.delete({ where: { id: String(id) } });
    revalidatePath("/jenis-sampah");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: "Tidak dapat menghapus JenisSampah yang terikat LaporanSampah (onDelete: Restrict)." };
  }
}

// ── Users Actions ────────────────────────────────────────
export async function getUsers() {
  await seedIfEmpty();
  return prisma.user.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getWargaList() {
  await seedIfEmpty();
  const wargas = await prisma.user.findMany({
    where: { role: "warga" },
    include: {
      saldoLog: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return wargas.map((w) => {
    const totalKredit = w.saldoLog
      .filter((l) => l.tipe === "kredit")
      .reduce((sum, l) => sum + Number(l.jumlah), 0);
    const totalDebit = w.saldoLog
      .filter((l) => l.tipe === "debit")
      .reduce((sum, l) => sum + Number(l.jumlah), 0);
    const saldoPoin = totalKredit - totalDebit;

    return {
      id: w.id,
      nama: w.nama,
      email: w.email,
      noHp: w.noHp,
      alamat: w.alamat,
      saldoPoin,
    };
  });
}

export async function addWargaFromAdmin(data: {
  nama: string;
  email: string;
  noHp: string;
  alamat?: string;
}): Promise<ActionResult<any>> {
  const nama = data.nama.trim();
  const email = data.email.trim().toLowerCase();
  const noHp = data.noHp.trim();

  if (!nama || nama.length < 3) return { success: false, error: "Nama minimal 3 karakter." };
  if (!email || !email.includes("@")) return { success: false, error: "Format email tidak valid." };
  if (!noHp || noHp.length < 9) return { success: false, error: "Nomor HP minimal 9 digit." };

  try {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return { success: false, error: "Email sudah terdaftar." };

    const existingHp = await prisma.user.findUnique({ where: { noHp } });
    if (existingHp) return { success: false, error: "Nomor HP sudah terdaftar." };

    const res = await prisma.user.create({
      data: {
        nama,
        email,
        noHp,
        password: "password123", // Default password for newly created warga
        alamat: data.alamat?.trim() || null,
        role: "warga",
      },
    });

    revalidatePath("/admin/warga");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menambah warga baru." };
  }
}

// ── LaporanSampah Actions ────────────────────────────────
export async function getLaporanRecords() {
  await seedIfEmpty();
  const records = await prisma.laporanSampah.findMany({
    include: {
      user: true,
      jenisSampah: true,
      wilayah: true,
      fotoSampah: true,
    },
    orderBy: { tanggalSetor: "desc" },
  });

  return records.map((r) => ({
    ...r,
    beratKg: Number(r.beratKg),
    hargaSnapshot: Number(r.hargaSnapshot),
    subtotalPoin: Number(r.subtotalPoin),
    tanggalSetor: r.tanggalSetor.toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    jenisSampah: {
      ...r.jenisSampah,
      hargaPerKg: Number(r.jenisSampah.hargaPerKg),
    },
  }));
}

export async function createLaporanSampah(data: {
  userId: string;
  jenisSampahId: string;
  wilayahId: string;
  beratKg: number;
  catatan?: string;
  urlFoto?: string;
}): Promise<ActionResult<any>> {
  if (isNaN(data.beratKg) || data.beratKg <= 0) {
    return { success: false, error: "Berat sampah harus lebih besar dari 0 (Berat > 0)." };
  }
  if (!data.userId) return { success: false, error: "User/Warga wajib dipilih." };
  if (!data.jenisSampahId) return { success: false, error: "Jenis Sampah wajib dipilih." };
  if (!data.wilayahId) return { success: false, error: "Wilayah wajib dipilih." };

  const fotoUrl = data.urlFoto || "/uploads/foto_sampah_default.jpg";

  try {
    const jenis = await prisma.jenisSampah.findUnique({ where: { id: data.jenisSampahId } });
    if (!jenis) return { success: false, error: "Jenis sampah tidak ditemukan." };

    const hargaSnapshot = Number(jenis.hargaPerKg);
    const subtotalPoin = data.beratKg * hargaSnapshot;

    const result = await prisma.$transaction(async (tx) => {
      const laporan = await tx.laporanSampah.create({
        data: {
          userId: data.userId,
          jenisSampahId: data.jenisSampahId,
          wilayahId: data.wilayahId,
          beratKg: data.beratKg,
          hargaSnapshot: hargaSnapshot,
          subtotalPoin: subtotalPoin,
          catatan: data.catatan || "Pencatatan setor sampah",
        },
      });

      await tx.fotoSampah.create({
        data: {
          laporanId: laporan.id,
          urlFoto: fotoUrl,
          ukuranKb: 512,
          tipeFile: "image/jpeg",
        },
      });

      await tx.saldoLog.create({
        data: {
          userId: data.userId,
          tipe: "kredit",
          jumlah: subtotalPoin,
          referensiId: laporan.id,
          referensiTipe: "setor",
          keterangan: `Setor ${jenis.namaJenis} (${data.beratKg} kg)`,
        },
      });

      return laporan;
    });

    revalidatePath("/");
    revalidatePath("/input");
    return {
      success: true,
      data: {
        ...result,
        beratKg: Number(result.beratKg),
        hargaSnapshot: Number(result.hargaSnapshot),
        subtotalPoin: Number(result.subtotalPoin),
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menyimpan laporan sampah." };
  }
}

// ── KegiatanKomunitas Actions (Table 9) ──────────────────
export async function getKegiatan() {
  return prisma.kegiatanKomunitas.findMany({
    orderBy: { tanggal: "asc" }
  });
}

export async function createKegiatan(data: {
  judul: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string;
}): Promise<ActionResult<any>> {
  try {
    const res = await prisma.kegiatanKomunitas.create({
      data: {
        judul: data.judul.trim(),
        deskripsi: data.deskripsi.trim(),
        tanggal: new Date(data.tanggal),
        lokasi: data.lokasi.trim(),
      }
    });
    revalidatePath("/admin/kegiatan");
    revalidatePath("/warga/dashboard");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal membuat kegiatan komunitas." };
  }
}

export async function deleteKegiatan(id: string): Promise<ActionResult<any>> {
  try {
    const res = await prisma.kegiatanKomunitas.delete({
      where: { id }
    });
    revalidatePath("/admin/kegiatan");
    revalidatePath("/warga/dashboard");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus kegiatan." };
  }
}

// ── FeedbackWarga Actions (Table 10) ────────────────────
export async function getFeedbackList() {
  return prisma.feedbackWarga.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function submitFeedback(data: {
  userId: string;
  judul: string;
  isiFeedback: string;
}): Promise<ActionResult<any>> {
  try {
    const res = await prisma.feedbackWarga.create({
      data: {
        userId: data.userId,
        judul: data.judul.trim(),
        isiFeedback: data.isiFeedback.trim(),
        status: "pending"
      }
    });
    revalidatePath("/admin/feedback");
    revalidatePath("/warga/feedback");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengirimkan feedback." };
  }
}

export async function updateFeedbackStatus(
  id: string,
  status: string
): Promise<ActionResult<any>> {
  try {
    const res = await prisma.feedbackWarga.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/feedback");
    return { success: true, data: res };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui status feedback." };
  }
}
