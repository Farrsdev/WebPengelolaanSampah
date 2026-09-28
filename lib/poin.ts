// ponytail: konstanta sistem poin — satu tempat, gampang diubah
// Upgrade path: pindah ke tabel DB kalau mau admin bisa atur sendiri

/** Rupiah per kg × multiplier ini = poin yang diterima warga */
export const POIN_MULTIPLIER = 10;

/** Nilai rupiah per 1 poin saat cash out (margin ~20% dari 1/MULTIPLIER) */
export const CASH_RATE = 0.08; // 1 poin = Rp 0.08 → 80% dari nilai asli

/** Helper: hitung poin dari rupiah */
export const rupiahToPoin = (rupiah: number) =>
  Math.floor(rupiah * POIN_MULTIPLIER);

/** Helper: hitung estimasi rupiah dari poin (cash out) */
export const poinToRupiah = (poin: number) =>
  Math.floor(poin * CASH_RATE);

/** Label kurs yang konsisten untuk ditampilkan di UI */
export const cashRateLabel = `1 poin = Rp ${CASH_RATE.toLocaleString("id-ID")} cash`;
