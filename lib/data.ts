// Mock data shaped to match the Prisma schema for pemilahan_sampah
// ponytail: single file for all mock data, no over-abstraction

export interface Wilayah {
  id: number;
  nama_wilayah: string;
  kode_wilayah: string;
  deskripsi: string;
}

export interface JenisSampah {
  id: number;
  nama_jenis: string;
  bisa_didaur_ulang: boolean;
  keterangan: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface BeratRecord {
  id: number;
  nilai_berat: number;
  user: User;
  wilayah: Wilayah;
  jenis: JenisSampah;
  dibuat_pada: string;
}

export const wilayahData: Wilayah[] = [
  { id: 1, nama_wilayah: "Kecamatan Menteng", kode_wilayah: "JKT-MTG", deskripsi: "Wilayah pemukiman padat Jakarta Pusat" },
  { id: 2, nama_wilayah: "Kecamatan Kebayoran", kode_wilayah: "JKT-KBY", deskripsi: "Kawasan perkantoran Jakarta Selatan" },
  { id: 3, nama_wilayah: "Kecamatan Cempaka Putih", kode_wilayah: "JKT-CPT", deskripsi: "Wilayah campuran residensial dan komersial" },
  { id: 4, nama_wilayah: "Kecamatan Tanah Abang", kode_wilayah: "JKT-TAB", deskripsi: "Kawasan pasar dan perdagangan" },
  { id: 5, nama_wilayah: "Kecamatan Kemayoran", kode_wilayah: "JKT-KMY", deskripsi: "Kawasan expo dan hunian vertikal" },
];

export const jenisSampahData: JenisSampah[] = [
  { id: 1, nama_jenis: "Plastik", bisa_didaur_ulang: true, keterangan: "Botol, kemasan, kantong plastik" },
  { id: 2, nama_jenis: "Kertas", bisa_didaur_ulang: true, keterangan: "Koran, kardus, kertas HVS" },
  { id: 3, nama_jenis: "Organik", bisa_didaur_ulang: false, keterangan: "Sisa makanan, daun, ranting" },
  { id: 4, nama_jenis: "Logam", bisa_didaur_ulang: true, keterangan: "Kaleng, besi, aluminium" },
  { id: 5, nama_jenis: "Kaca", bisa_didaur_ulang: true, keterangan: "Botol kaca, cermin, gelas" },
  { id: 6, nama_jenis: "B3 (Berbahaya)", bisa_didaur_ulang: false, keterangan: "Baterai, lampu neon, obat kedaluwarsa" },
];

export const usersData: User[] = [
  { id: 1, username: "ahmad_r", email: "ahmad@ecowaste.id", role: "petugas" },
  { id: 2, username: "siti_n", email: "siti@ecowaste.id", role: "petugas" },
  { id: 3, username: "budi_s", email: "budi@ecowaste.id", role: "petugas" },
  { id: 4, username: "dewi_a", email: "dewi@ecowaste.id", role: "petugas" },
];

export const beratData: BeratRecord[] = [
  { id: 1, nilai_berat: 45.5, user: usersData[0], wilayah: wilayahData[0], jenis: jenisSampahData[0], dibuat_pada: "2026-07-23T08:30:00" },
  { id: 2, nilai_berat: 32.0, user: usersData[1], wilayah: wilayahData[1], jenis: jenisSampahData[2], dibuat_pada: "2026-07-23T09:15:00" },
  { id: 3, nilai_berat: 18.7, user: usersData[2], wilayah: wilayahData[2], jenis: jenisSampahData[1], dibuat_pada: "2026-07-23T10:00:00" },
  { id: 4, nilai_berat: 67.3, user: usersData[0], wilayah: wilayahData[3], jenis: jenisSampahData[0], dibuat_pada: "2026-07-22T14:20:00" },
  { id: 5, nilai_berat: 12.1, user: usersData[3], wilayah: wilayahData[4], jenis: jenisSampahData[3], dibuat_pada: "2026-07-22T11:45:00" },
  { id: 6, nilai_berat: 55.0, user: usersData[1], wilayah: wilayahData[0], jenis: jenisSampahData[4], dibuat_pada: "2026-07-22T16:30:00" },
  { id: 7, nilai_berat: 28.9, user: usersData[2], wilayah: wilayahData[1], jenis: jenisSampahData[5], dibuat_pada: "2026-07-21T09:00:00" },
  { id: 8, nilai_berat: 41.2, user: usersData[3], wilayah: wilayahData[3], jenis: jenisSampahData[1], dibuat_pada: "2026-07-21T13:10:00" },
];

export const stats = {
  totalBerat: beratData.reduce((sum, r) => sum + r.nilai_berat, 0),
  activeWilayah: wilayahData.length,
  totalUsers: usersData.length,
};
