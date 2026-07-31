"use client";

import { useState } from "react";
import { Recycle, Plus, Pencil, Trash2, Leaf, AlertCircle } from "lucide-react";
import { useStore, type JenisSampahModel } from "@/lib/store";
import Modal from "@/components/modal";
import DeleteConfirm from "@/components/delete-confirm";

const emptyForm = { namaJenis: "", hargaPerKg: 3000, bisaDidaurUlang: true, keterangan: "" };

export default function JenisSampahPage() {
  const { jenisSampah, addJenisSampah, updateJenisSampah, deleteJenisSampah, showToast } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<JenisSampahModel | null>(null);
  const [deleting, setDeleting] = useState<JenisSampahModel | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (j: JenisSampahModel) => {
    setForm({
      namaJenis: j.namaJenis,
      hargaPerKg: j.hargaPerKg || 3000,
      bisaDidaurUlang: j.bisaDidaurUlang,
      keterangan: j.keterangan || "",
    });
    setEditing(j);
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const nama = form.namaJenis.trim();
    const keterangan = form.keterangan.trim();
    const harga = Number(form.hargaPerKg);

    if (!nama) {
      const msg = "Nama jenis sampah tidak boleh kosong.";
      setFormError(msg);
      showToast(msg, "error");
      return;
    }

    if (isNaN(harga) || harga <= 0) {
      const msg = "Harga/poin per kg harus angka positif.";
      setFormError(msg);
      showToast(msg, "error");
      return;
    }

    let success = false;
    if (editing) {
      success = await updateJenisSampah(editing.id, {
        namaJenis: nama,
        hargaPerKg: harga,
        bisaDidaurUlang: form.bisaDidaurUlang,
        keterangan,
      });
    } else {
      success = await addJenisSampah({
        namaJenis: nama,
        hargaPerKg: harga,
        bisaDidaurUlang: form.bisaDidaurUlang,
        keterangan,
      });
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
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Master Data Jenis Sampah</h1>
          <p className="text-slate-500 mt-1 text-sm">Kelola kategori jenis sampah (`JenisSampah` Model dengan `@unique` namaJenis)</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Plus className="w-4.5 h-4.5" />
          Tambah Jenis Sampah
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
        {jenisSampah.map((j) => (
          <div
            key={j.id}
            className="glass-card p-6 flex flex-col justify-between animate-fade-in-up group relative"
          >
            <div>
              {/* Action Buttons */}
              <div className="absolute top-5 right-5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => openEdit(j)}
                  className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleting(j)}
                  className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Icon & Badge */}
              <div className="flex items-center gap-3.5 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    j.bisaDidaurUlang
                      ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-500/20"
                      : "bg-slate-200/70 text-slate-500 shadow-slate-200/50"
                  }`}
                >
                  {j.bisaDidaurUlang ? <Recycle className="w-6 h-6" /> : <Leaf className="w-6 h-6" />}
                </div>

                {j.bisaDidaurUlang ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 backdrop-blur-md">
                    <Recycle className="w-3 h-3" />
                    Daur Ulang
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/50 text-slate-500 border border-slate-300/40 backdrop-blur-md">
                    Tidak Daur Ulang
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-800 text-lg mb-0.5">{j.namaJenis}</h3>
              <p className="text-xs font-bold text-emerald-600 mb-2">Rp {Number(j.hargaPerKg || 0).toLocaleString("id-ID")} / kg</p>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{j.keterangan}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Edit Jenis Sampah" : "Tambah Jenis Sampah"}
      >
        <form onSubmit={handleSave} className="space-y-5">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
              <AlertCircle className="w-4.5 h-4.5 text-rose-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className={labelClass}>Nama Jenis Sampah — Unique</label>
            <input
              required
              value={form.namaJenis}
              onChange={(e) => {
                setForm({ ...form, namaJenis: e.target.value });
                setFormError("");
              }}
              placeholder="Contoh: Plastik"
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-medium placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className={labelClass}>Harga / Poin per Kg (Rp)</label>
            <input
              type="number"
              required
              min="100"
              value={form.hargaPerKg}
              onChange={(e) => {
                setForm({ ...form, hargaPerKg: Number(e.target.value) });
                setFormError("");
              }}
              placeholder="Contoh: 3000"
              className="w-full px-4 py-3 glass-input text-slate-800 text-sm font-medium placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className={labelClass}>Dapat Didaur Ulang?</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, bisaDidaurUlang: !form.bisaDidaurUlang })}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 p-1 border ${
                  form.bisaDidaurUlang
                    ? "bg-emerald-500 border-emerald-600 shadow-md shadow-emerald-500/20"
                    : "bg-slate-200 border-slate-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    form.bisaDidaurUlang ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs font-semibold text-slate-700">
                {form.bisaDidaurUlang ? "Ya, Bisa Didaur Ulang" : "Tidak"}
              </span>
            </div>
          </div>

          <div>
            <label className={labelClass}>Keterangan</label>
            <textarea
              rows={3}
              value={form.keterangan}
              onChange={(e) => {
                setForm({ ...form, keterangan: e.target.value });
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
              {editing ? "Simpan Perubahan" : "Tambah Jenis Sampah"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && deleteJenisSampah(deleting.id)}
        itemName={deleting?.namaJenis || ""}
      />
    </div>
  );
}
