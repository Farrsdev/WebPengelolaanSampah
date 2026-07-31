"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { useStore, type WilayahModel } from "@/lib/store";
import Modal from "@/components/modal";
import DeleteConfirm from "@/components/delete-confirm";

const emptyForm = { namaWilayah: "", kodeWilayah: "", deskripsi: "" };

export default function WilayahPage() {
  const { wilayah, addWilayah, updateWilayah, deleteWilayah, showToast } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WilayahModel | null>(null);
  const [deleting, setDeleting] = useState<WilayahModel | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (w: WilayahModel) => {
    setForm({ namaWilayah: w.namaWilayah, kodeWilayah: w.kodeWilayah, deskripsi: w.deskripsi || "" });
    setEditing(w);
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const nama = form.namaWilayah.trim();
    const kode = form.kodeWilayah.trim().toUpperCase();
    const deskripsi = form.deskripsi.trim();

    if (!nama) {
      const msg = "Nama wilayah tidak boleh kosong.";
      setFormError(msg);
      showToast(msg, "error");
      return;
    }

    if (!kode || kode.length < 2) {
      const msg = "Kode wilayah minimal 2 karakter.";
      setFormError(msg);
      showToast(msg, "error");
      return;
    }

    let success = false;
    if (editing) {
      success = await updateWilayah(editing.id, { namaWilayah: nama, kodeWilayah: kode, deskripsi });
    } else {
      success = await addWilayah({ namaWilayah: nama, kodeWilayah: kode, deskripsi });
    }

    if (success) {
      setShowModal(false);
    }
  };

  const labelClass = "block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Master Data Wilayah</h1>
          <p className="text-slate-500 mt-1 text-sm">Kelola data daftar wilayah (`Wilayah` Model dengan Primary Key UUID)</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Plus className="w-4.5 h-4.5" />
          Tambah Wilayah
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 stagger">
        {wilayah.map((w) => (
          <div
            key={w.id}
            className="glass-card p-6 flex flex-col justify-between animate-fade-in-up group relative"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/10">
                    <MapPin className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{w.namaWilayah}</h3>
                    <span className="inline-block mt-0.5 text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {w.kodeWilayah}
                    </span>
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEdit(w)}
                    className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-700 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(w)}
                    className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-medium mt-2">{w.deskripsi}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Edit Wilayah" : "Tambah Wilayah Baru"}
      >
        <form onSubmit={handleSave} className="space-y-5">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
              <AlertCircle className="w-4.5 h-4.5 text-rose-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className={labelClass}>Nama Wilayah — Wajib</label>
            <input
              required
              value={form.namaWilayah}
              onChange={(e) => {
                setForm({ ...form, namaWilayah: e.target.value });
                setFormError("");
              }}
              placeholder="Contoh: Kecamatan Menteng"
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-medium placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className={labelClass}>Kode Wilayah</label>
            <input
              required
              minLength={2}
              value={form.kodeWilayah}
              onChange={(e) => {
                setForm({ ...form, kodeWilayah: e.target.value.toUpperCase() });
                setFormError("");
              }}
              placeholder="Contoh: JKT-MTG"
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-mono font-medium placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className={labelClass}>Deskripsi Wilayah</label>
            <textarea
              rows={3}
              value={form.deskripsi}
              onChange={(e) => {
                setForm({ ...form, deskripsi: e.target.value });
                setFormError("");
              }}
              placeholder="Keterangan singkat..."
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-medium placeholder:text-slate-300 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100/60 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {editing ? "Simpan Perubahan" : "Tambah Wilayah"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteWilayah(deleting.id)}
        itemName={deleting?.namaWilayah || ""}
      />
    </div>
  );
}
