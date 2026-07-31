"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Trash2, 
  Save, 
  Clock, 
  Megaphone,
  X
} from "lucide-react";
import { getKegiatan, createKegiatan, deleteKegiatan } from "@/lib/actions";
import { useStore } from "@/lib/store";
import Modal from "@/components/modal";

export default function AdminKegiatanPage() {
  const { showToast } = useStore();
  const [kegiatans, setKegiatans] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadKegiatans = async () => {
    const data = await getKegiatan();
    setKegiatans(data);
  };

  useEffect(() => {
    loadKegiatans();
  }, []);

  const handleAddKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !deskripsi || !tanggal || !lokasi) {
      showToast("Seluruh isian wajib diisi.", "error");
      return;
    }

    setSubmitting(true);
    const res = await createKegiatan({ judul, deskripsi, tanggal, lokasi });

    if (res.success) {
      showToast("Agenda Kegiatan berhasil dipublikasikan!");
      setJudul("");
      setDeskripsi("");
      setTanggal("");
      setLokasi("");
      setShowAddModal(false);
      loadKegiatans();
    } else {
      showToast(res.error || "Gagal membuat kegiatan.", "error");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus agenda kegiatan ini?")) return;
    const res = await deleteKegiatan(id);
    if (res.success) {
      showToast("Agenda kegiatan berhasil dihapus.");
      loadKegiatans();
    } else {
      showToast(res.error || "Gagal menghapus.", "error");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Agenda Kegiatan Komunitas</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola informasi jadwal kerja bakti, penyuluhan, dan kegiatan warga.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md shadow-emerald-800/10 transition-all hover:scale-[1.02] flex-shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Tambah Kegiatan Baru
        </button>
      </header>

      {/* Grid List Kegiatan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kegiatans.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200/60 text-slate-400 font-medium text-xs">
            Belum ada kegiatan komunitas yang terdaftar.
          </div>
        ) : (
          kegiatans.map((k) => (
            <div key={k.id} className="bg-white rounded-2xl border border-slate-200/50 p-6 flex flex-col justify-between shadow-sm relative group">
              <button
                onClick={() => handleDelete(k.id)}
                className="absolute top-4 right-4 p-2 bg-rose-50 hover:bg-rose-500/10 text-rose-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                title="Hapus Kegiatan"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{k.judul}</h3>
                  <p className="text-2xs font-medium text-slate-400 mt-1">Diposting: {new Date(k.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
                <p className="text-xs text-slate-500 font-medium line-clamp-3">{k.deskripsi}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-600 font-semibold">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>
                    {new Date(k.tanggal).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{k.lokasi}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah Kegiatan */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Buat Agenda Kegiatan Baru">
        <form onSubmit={handleAddKegiatan} className="space-y-4 pt-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Judul Kegiatan</label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Kerja Bakti Akbar RT 04"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Deskripsi Kegiatan</label>
            <textarea
              required
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan mengenai agenda kegiatan komunitas..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Tanggal Pelaksanaan</label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Lokasi Kegiatan</label>
              <input
                type="text"
                required
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Lokasi kerja bakti/aula"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-800/10"
            >
              <Save className="w-4 h-4" />
              {submitting ? "Menyimpan..." : "Simpan Kegiatan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
