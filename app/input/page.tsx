"use client";

import { useState } from "react";
import { 
  Search, 
  PlusCircle, 
  Trash2, 
  Save, 
  MapPin, 
  Info,
  Calendar,
  X,
  Upload,
  ImagePlus,
  ChevronDown
} from "lucide-react";
import { useStore } from "@/lib/store";
import { POIN_MULTIPLIER, poinToRupiah } from "@/lib/poin";

interface WasteRow {
  id: number;
  jenisId: string;
  beratKg: string;
}

export default function InputSetorPage() {
  const { wilayah, jenisSampah, users, addBerat, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWarga, setSelectedWarga] = useState<any | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [wilayahId, setWilayahId] = useState("");
  const [rows, setRows] = useState<WasteRow[]>([
    { id: Date.now(), jenisId: "", beratKg: "" }
  ]);

  // Photo state (Base64 file reader)
  const [fileName, setFileName] = useState("");
  const [fotoBase64, setFotoBase64] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Date representation
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Filter citizens for search autocomplete
  const wargas = users.filter((u) => u.role === "warga" || !u.role);
  const citizenSuggestions = searchQuery.trim()
    ? wargas.filter((u) => {
        const q = searchQuery.toLowerCase().trim();
        const nama = (u.nama || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const noHp = (u.noHp || "");
        return nama.includes(q) || email.includes(q) || noHp.includes(q);
      })
    : wargas;

  // Add row
  const addRow = () => {
    setRows([...rows, { id: Date.now(), jenisId: "", beratKg: "" }]);
  };

  // Remove row
  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    } else {
      showToast("Minimal satu baris input diperlukan.", "error");
    }
  };

  // Update row values
  const updateRow = (id: number, field: "jenisId" | "beratKg", value: string) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Handle image upload Base64 conversion
  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast("Ukuran foto maksimal 5MB.", "error");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Calculations
  const totalWeight = rows.reduce((sum, row) => sum + (parseFloat(row.beratKg) || 0), 0);
  
  const totalPoints = rows.reduce((sum, row) => {
    const item = jenisSampah.find((j) => j.id === row.jenisId);
    const weight = parseFloat(row.beratKg) || 0;
    const price = item ? Number(item.hargaPerKg) : 0;
    return sum + Math.floor(weight * price * POIN_MULTIPLIER);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWarga) {
      showToast("Silakan pilih identitas warga terlebih dahulu.", "error");
      return;
    }

    if (!wilayahId) {
      showToast("Silakan pilih Wilayah setor.", "error");
      return;
    }

    // Validate rows
    for (const row of rows) {
      if (!row.jenisId) {
        showToast("Ada kategori sampah yang belum dipilih.", "error");
        return;
      }
      const weight = parseFloat(row.beratKg);
      if (isNaN(weight) || weight <= 0) {
        showToast("Berat sampah harus lebih besar dari 0.", "error");
        return;
      }
    }

    const selectedWilayah = wilayah.find((w) => w.id === wilayahId);
    if (!selectedWilayah) return;

    setSubmitting(true);

    try {
      let successCount = 0;
      // Loop to submit multiple items sequentially
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const jen = jenisSampah.find((j) => j.id === row.jenisId);
        if (!jen) continue;

        const success = await addBerat({
          nilai_berat: parseFloat(row.beratKg),
          user: selectedWarga,
          wilayah: selectedWilayah,
          jenis: jen,
          urlFoto: i === 0 ? fotoBase64 : undefined // Attach photo to the first item
        });

        if (success) {
          successCount++;
        }
      }

      if (successCount === rows.length) {
        setRows([{ id: Date.now(), jenisId: "", beratKg: "" }]);
        setSelectedWarga(null);
        setSearchQuery("");
        setWilayahId("");
        setFileName("");
        setFotoBase64("");
      }
    } catch {
      showToast("Terjadi kesalahan sistem saat menyimpan setoran.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Input Setor Sampah</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Catat transaksi setoran sampah dari warga hari ini.</p>
        </div>
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-xl px-4 py-2 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700">{currentDate}</span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Columns (Form area) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Identitas Warga */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/50 space-y-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identitas Warga</label>
            
            {!selectedWarga ? (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Cari dari ${wargas.length} warga atau klik untuk memilih...`}
                  value={searchQuery}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-700 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors"
                  title="Lihat Semua Warga"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Suggestions */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200/60 z-20 max-h-60 overflow-y-auto divide-y divide-slate-100">
                    {citizenSuggestions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 space-y-1">
                        <p>Warga tidak ditemukan.</p>
                        {wargas.length === 0 && (
                          <p className="text-emerald-600 font-semibold">Belum ada akun warga di sistem. Silakan tambah di menu Warga.</p>
                        )}
                      </div>
                    ) : (
                      citizenSuggestions.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setSelectedWarga(u);
                            setShowDropdown(false);
                            setSearchQuery("");
                          }}
                          className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-800 flex items-center justify-center font-bold text-xs">
                              {(u.nama && u.nama[0]) ? u.nama[0].toUpperCase() : "W"}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{u.nama}</p>
                              <p className="text-[10px] text-slate-400 font-medium">Email: {u.email} • HP: {u.noHp || "-"}</p>
                            </div>
                          </div>
                          <span className="text-xs text-emerald-600 font-bold hover:underline">Pilih</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-fade-in">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {selectedWarga.nama[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">{selectedWarga.nama}</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Email: {selectedWarga.email} • HP: {selectedWarga.noHp}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedWarga(null);
                    setSearchQuery("");
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>

          {/* Wilayah Selection */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/50 space-y-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wilayah Setor</label>
            <select
              required
              value={wilayahId}
              onChange={(e) => setWilayahId(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-700 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none"
            >
              <option value="" disabled>Pilih wilayah pengumpulan...</option>
              {wilayah.map((w) => (
                <option key={w.id} value={w.id}>{w.namaWilayah} ({w.kodeWilayah})</option>
              ))}
            </select>
          </section>

          {/* Detail Item Sampah */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/50 space-y-6">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detail Item Sampah</label>
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors"
              >
                <PlusCircle className="w-4.5 h-4.5" /> Tambah Baris
              </button>
            </div>

            <div className="space-y-4" id="rows-container">
              {rows.map((row) => {
                return (
                  <div key={row.id} className="grid grid-cols-12 gap-4 items-end animate-fade-in">
                    {/* Category Select */}
                    <div className="col-span-6">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Kategori Sampah</label>
                      <select
                        required
                        value={row.jenisId}
                        onChange={(e) => updateRow(row.id, "jenisId", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl text-slate-700 font-semibold text-xs py-3.5 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      >
                        <option value="" disabled>Pilih Kategori</option>
                        {jenisSampah.map((j) => (
                          <option key={j.id} value={j.id}>
                            {j.namaJenis} (Rp {Number(j.hargaPerKg).toLocaleString("id-ID")}/kg)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Weight Input */}
                    <div className="col-span-4">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Berat (kg)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          required
                          value={row.beratKg}
                          onChange={(e) => updateRow(row.id, "beratKg", e.target.value)}
                          placeholder="0.0"
                          className="w-full bg-slate-50 border border-slate-200/60 rounded-xl text-slate-700 font-semibold text-xs py-3.5 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xs font-extrabold">KG</span>
                      </div>
                    </div>

                    {/* Delete Action */}
                    <div className="col-span-2 flex justify-center pb-1">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Hapus Baris"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Photo upload dropzone (preserved and stylized) */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/50 space-y-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Foto Bukti Sampah</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                dragActive
                  ? "border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/5"
                  : fileName
                  ? "border-emerald-400 bg-emerald-50/20"
                  : "border-slate-300/80 hover:border-emerald-400 hover:bg-slate-50/50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              {fileName ? (
                <>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <ImagePlus className="w-5.5 h-5.5" />
                  </div>
                  <p className="text-xs font-bold text-emerald-700">{fileName}</p>
                  <p className="text-[10px] text-slate-400">Bukti foto sampah berhasil ditautkan</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <Upload className="w-5.5 h-5.5" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-600 font-bold">Seret foto bukti atau <span className="text-emerald-600">pilih file</span></p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG hingga 5MB</p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Right Columns (Stats card & Submit buttons) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Point Preview Card */}
          <div className="bg-emerald-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
            {/* Subtle glow elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12 blur-2xl" />
            </div>

            <h3 className="text-[10px] font-bold uppercase tracking-wider opacity-85 mb-2">Estimasi Poin Diperoleh</h3>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-extrabold tracking-tight">
                {Math.round(totalPoints).toLocaleString("id-ID")}
              </span>
              <span className="text-sm opacity-80 font-bold">Poin</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/15 text-xs">
              <div className="flex justify-between items-center">
                <span className="opacity-75">Total Berat</span>
                <span className="font-extrabold">{totalWeight.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-75">Estimasi Cash Out</span>
                <span className="font-extrabold">≈ Rp {poinToRupiah(totalPoints).toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Sparkline Micro-viz */}
            <div className="mt-8 h-12 flex items-end gap-1.5">
              <div className="flex-1 bg-white/20 rounded-t-sm" style={{ height: "30%" }} />
              <div className="flex-1 bg-white/20 rounded-t-sm" style={{ height: "50%" }} />
              <div className="flex-1 bg-white/20 rounded-t-sm" style={{ height: "40%" }} />
              <div className="flex-1 bg-white/20 rounded-t-sm" style={{ height: "70%" }} />
              <div className="flex-1 bg-white/20 rounded-t-sm" style={{ height: "60%" }} />
              <div className="flex-1 bg-white/20 rounded-t-sm" style={{ height: "90%" }} />
              <div className="flex-1 bg-white/40 rounded-t-sm animate-pulse" style={{ height: "80%" }} />
            </div>
          </div>

          {/* Submit Button Area */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/50 space-y-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-emerald-800/10 flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4.5 h-4.5" />
              {submitting ? "Memproses..." : "Simpan Setoran"}
            </button>
            <button
              type="button"
              onClick={() => {
                setRows([{ id: Date.now(), jenisId: "", beratKg: "" }]);
                setSelectedWarga(null);
                setSearchQuery("");
                setWilayahId("");
                setFileName("");
                setFotoBase64("");
              }}
              className="w-full bg-transparent hover:bg-slate-50 text-slate-500 font-bold py-3 rounded-xl text-xs transition-colors"
            >
              Batalkan Sesi
            </button>
          </div>

          {/* Kurs Info Card */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 flex-shrink-0">
                <Info className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">Informasi Kurs</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Kurs poin diperbarui setiap Senin pukul 00.00 WIB. Pastikan timbangan digital telah dikalibrasi sebelum input data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
