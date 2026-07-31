"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getWilayah,
  createWilayah as dbCreateWilayah,
  updateWilayah as dbUpdateWilayah,
  deleteWilayah as dbDeleteWilayah,
  getJenisSampah,
  createJenisSampah as dbCreateJenisSampah,
  updateJenisSampah as dbUpdateJenisSampah,
  deleteJenisSampah as dbDeleteJenisSampah,
  getUsers,
  getLaporanRecords,
  createLaporanSampah as dbCreateLaporan,
} from "./actions";
import { CheckCircle2, XCircle } from "lucide-react";

export interface WilayahModel {
  id: string;
  namaWilayah: string;
  kodeWilayah: string;
  deskripsi?: string | null;
}

export interface JenisSampahModel {
  id: string;
  namaJenis: string;
  hargaPerKg: number;
  bisaDidaurUlang: boolean;
  keterangan?: string | null;
}

export interface UserModel {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  role: string;
}

export interface LaporanRecordModel {
  id: string;
  kodeSetor: string;
  beratKg: number;
  hargaSnapshot: number;
  subtotalPoin: number;
  catatan?: string | null;
  tanggalSetor: string;
  user: UserModel;
  wilayah: WilayahModel;
  jenisSampah: JenisSampahModel;
  fotoSampah?: { urlFoto: string } | null;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface Store {
  wilayah: WilayahModel[];
  jenisSampah: JenisSampahModel[];
  users: UserModel[];
  berat: LaporanRecordModel[];
  stats: { totalBerat: number; activeWilayah: number; totalUsers: number };
  loading: boolean;

  addWilayah: (w: { namaWilayah: string; kodeWilayah: string; deskripsi: string }) => Promise<boolean>;
  updateWilayah: (id: string, w: { namaWilayah: string; kodeWilayah: string; deskripsi: string }) => Promise<boolean>;
  deleteWilayah: (id: string) => Promise<boolean>;

  addJenisSampah: (j: { namaJenis: string; bisaDidaurUlang: boolean; keterangan: string; hargaPerKg?: number }) => Promise<boolean>;
  updateJenisSampah: (id: string, j: { namaJenis: string; bisaDidaurUlang: boolean; keterangan: string; hargaPerKg?: number }) => Promise<boolean>;
  deleteJenisSampah: (id: string) => Promise<boolean>;

  addBerat: (b: {
    nilai_berat: number;
    user: UserModel;
    wilayah: WilayahModel;
    jenis: JenisSampahModel;
    urlFoto?: string;
  }) => Promise<boolean>;

  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error") => void;
  refreshData: () => Promise<void>;
}

const Ctx = createContext<Store>(null!);
export const useStore = () => useContext(Ctx);

let _toastId = 0;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [wilayah, setWilayah] = useState<WilayahModel[]>([]);
  const [jenisSampah, setJenisSampah] = useState<JenisSampahModel[]>([]);
  const [users, setUsers] = useState<UserModel[]>([]);
  const [berat, setBerat] = useState<LaporanRecordModel[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = ++_toastId;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
    },
    []
  );

  const refreshData = useCallback(async () => {
    try {
      const [wList, jList, uList, bList] = await Promise.all([
        getWilayah(),
        getJenisSampah(),
        getUsers(),
        getLaporanRecords(),
      ]);
      setWilayah(wList as WilayahModel[]);
      setJenisSampah(jList as JenisSampahModel[]);
      setUsers(uList as UserModel[]);
      setBerat(bList as unknown as LaporanRecordModel[]);
    } catch (err) {
      console.warn("Store sync error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ── Wilayah CRUD ──
  const addWilayah = useCallback(
    async (w: { namaWilayah: string; kodeWilayah: string; deskripsi: string }): Promise<boolean> => {
      const res = await dbCreateWilayah(w);
      if (!res.success) {
        showToast(res.error || "Gagal menambah wilayah.", "error");
        return false;
      }
      setWilayah((prev) => [...prev, res.data]);
      showToast("Wilayah berhasil ditambahkan ke Database!");
      return true;
    },
    [showToast]
  );

  const updateWilayah = useCallback(
    async (id: string, w: { namaWilayah: string; kodeWilayah: string; deskripsi: string }): Promise<boolean> => {
      const res = await dbUpdateWilayah(id, w);
      if (!res.success) {
        showToast(res.error || "Gagal memperbarui wilayah.", "error");
        return false;
      }
      setWilayah((prev) => prev.map((x) => (x.id === id ? res.data : x)));
      showToast("Wilayah berhasil diperbarui!");
      return true;
    },
    [showToast]
  );

  const deleteWilayah = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await dbDeleteWilayah(id);
      if (!res.success) {
        showToast(res.error || "Gagal menghapus wilayah.", "error");
        return false;
      }
      setWilayah((prev) => prev.filter((x) => x.id !== id));
      showToast("Wilayah terhapus!");
      return true;
    },
    [showToast]
  );

  // ── Jenis Sampah CRUD ──
  const addJenisSampah = useCallback(
    async (j: { namaJenis: string; bisaDidaurUlang: boolean; keterangan: string; hargaPerKg?: number }): Promise<boolean> => {
      const res = await dbCreateJenisSampah(j);
      if (!res.success) {
        showToast(res.error || "Gagal menambah jenis sampah.", "error");
        return false;
      }
      setJenisSampah((prev) => [...prev, res.data]);
      showToast("Jenis sampah berhasil ditambahkan!");
      return true;
    },
    [showToast]
  );

  const updateJenisSampah = useCallback(
    async (id: string, j: { namaJenis: string; bisaDidaurUlang: boolean; keterangan: string; hargaPerKg?: number }): Promise<boolean> => {
      const res = await dbUpdateJenisSampah(id, j);
      if (!res.success) {
        showToast(res.error || "Gagal memperbarui jenis sampah.", "error");
        return false;
      }
      setJenisSampah((prev) => prev.map((x) => (x.id === id ? res.data : x)));
      showToast("Jenis sampah berhasil diperbarui!");
      return true;
    },
    [showToast]
  );

  const deleteJenisSampah = useCallback(
    async (id: string): Promise<boolean> => {
      const res = await dbDeleteJenisSampah(id);
      if (!res.success) {
        showToast(res.error || "Gagal menghapus jenis sampah.", "error");
        return false;
      }
      setJenisSampah((prev) => prev.filter((x) => x.id !== id));
      showToast("Jenis sampah terhapus!");
      return true;
    },
    [showToast]
  );

  // ── Laporan / Setor Sampah ──
  const addBerat = useCallback(
    async (b: {
      nilai_berat: number;
      user: UserModel;
      wilayah: WilayahModel;
      jenis: JenisSampahModel;
      urlFoto?: string;
    }): Promise<boolean> => {
      const res = await dbCreateLaporan({
        userId: b.user.id,
        jenisSampahId: b.jenis.id,
        wilayahId: b.wilayah.id,
        beratKg: b.nilai_berat,
        urlFoto: b.urlFoto,
      });

      if (!res.success) {
        showToast(res.error || "Gagal menyimpan laporan.", "error");
        return false;
      }

      await refreshData();
      showToast("Laporan Sampah & Foto tersimpan ke Database!");
      return true;
    },
    [showToast, refreshData]
  );

  const stats = {
    totalBerat: berat.reduce((sum, r) => sum + Number(r.beratKg), 0),
    activeWilayah: wilayah.length,
    totalUsers: users.length,
  };

  return (
    <Ctx.Provider
      value={{
        wilayah,
        jenisSampah,
        users,
        berat,
        stats,
        loading,
        addWilayah,
        updateWilayah,
        deleteWilayah,
        addJenisSampah,
        updateJenisSampah,
        deleteJenisSampah,
        addBerat,
        toasts,
        showToast,
        refreshData,
      }}
    >
      {children}

      {/* Glassmorphism Toast Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[70] space-y-3 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl backdrop-blur-xl border animate-fade-in-up ${
                t.type === "success"
                  ? "bg-emerald-500/90 text-white border-emerald-400/50 shadow-emerald-500/20"
                  : "bg-rose-500/90 text-white border-rose-400/50 shadow-rose-500/20"
              }`}
            >
              {t.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-white flex-shrink-0" />
              )}
              <p className="text-xs font-bold leading-tight">{t.message}</p>
            </div>
          ))}
        </div>
      )}
    </Ctx.Provider>
  );
}
