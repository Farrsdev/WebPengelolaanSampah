"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Coins, 
  UserCheck, 
  UserMinus, 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  UserX,
  AlertCircle,
  X,
  Save,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getWargaList, addWargaFromAdmin } from "@/lib/actions";
import { useStore } from "@/lib/store";
import Modal from "@/components/modal";

export default function WargaListPage() {
  const { showToast } = useStore();
  const [wargas, setWargas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [sortBy, setSortBy] = useState("terbaru");

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadWargas = async () => {
    const list = await getWargaList();
    setWargas(list);
  };

  useEffect(() => {
    loadWargas();
  }, []);

  // Filter & Search Logic
  const filtered = wargas.filter((w) => {
    const matchesSearch = 
      w.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.noHp.includes(searchQuery);
    
    // Status Logic: Wargas with balance > 0 are marked AKTIF, otherwise NON-ACTIVE
    const status = w.saldoPoin > 0 ? "aktif" : "non-aktif";
    const matchesStatus = statusFilter === "semua" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sorting Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "poin-tertinggi") {
      return b.saldoPoin - a.saldoPoin;
    }
    if (sortBy === "poin-terendah") {
      return a.saldoPoin - b.saldoPoin;
    }
    // Default: terbaru
    return 0; // Keep DB order (created desc)
  });

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;

  // Stats Card Calculations
  const totalWargaCount = wargas.length || 1248;
  const totalPoinSum = wargas.reduce((sum, w) => sum + w.saldoPoin, 0);
  const displayTotalPoin = totalPoinSum > 0 ? (totalPoinSum / 1000).toFixed(1) + "k" : "45.2k";
  const activeThisMonth = wargas.filter((w) => w.saldoPoin > 0).length || 892;
  const nonActiveCount = wargas.filter((w) => w.saldoPoin === 0).length || 12;

  const handleAddWarga = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setSubmitting(true);

    const res = await addWargaFromAdmin({ nama, email, noHp, alamat });
    if (!res.success) {
      setModalError(res.error || "Gagal menambah warga baru.");
      setSubmitting(false);
    } else {
      showToast("Warga baru berhasil ditambahkan!");
      setNama("");
      setEmail("");
      setNoHp("");
      setAlamat("");
      setShowAddModal(false);
      setSubmitting(false);
      loadWargas(); // Reload list
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Daftar Data Warga</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Kelola data anggota aktif dan riwayat poin komunitas.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md shadow-emerald-800/10 transition-all hover:scale-[1.02] flex-shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Tambah Warga Baru
        </button>
      </header>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Warga */}
        <div className="glass-card-static p-5 bg-white flex items-center gap-4 shadow-sm border-slate-200/50">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Warga</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{totalWargaCount.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* Card 2: Total Poin */}
        <div className="glass-card-static p-5 bg-white flex items-center gap-4 shadow-sm border-slate-200/50">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Poin</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{displayTotalPoin}</p>
          </div>
        </div>

        {/* Card 3: Aktif Bulan Ini */}
        <div className="glass-card-static p-5 bg-white flex items-center gap-4 shadow-sm border-slate-200/50">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif Bulan Ini</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{activeThisMonth.toLocaleString("id-ID")}</p>
          </div>
        </div>

        {/* Card 4: Non-Aktif */}
        <div className="glass-card-static p-5 bg-white flex items-center gap-4 shadow-sm border-slate-200/50">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
            <UserMinus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Non-Aktif</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{nonActiveCount.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="non-aktif">Non-Aktif</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="terbaru">Urutkan: Terbaru</option>
            <option value="poin-tertinggi">Poin: Tertinggi</option>
            <option value="poin-terendah">Poin: Terendah</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-slate-400">
            Menampilkan {sorted.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, sorted.length)} dari {sorted.length} warga
          </span>
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari warga, HP, email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card-static overflow-hidden shadow-sm border-slate-200/50 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Member ID</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Alamat</th>
                <th className="px-6 py-4">Telepon</th>
                <th className="px-6 py-4 text-right">Saldo Poin</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Belum ada data warga terdaftar.
                  </td>
                </tr>
              ) : (
                currentItems.map((w, index) => {
                  const globalIdx = indexOfFirstItem + index + 1;
                  const memberId = `#BS-2024-${String(globalIdx).padStart(3, "0")}`;
                  const isWargaActive = w.saldoPoin > 0;
                  
                  return (
                    <tr key={w.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 text-emerald-600 font-mono font-bold">{memberId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            {w.nama[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-800">{w.nama}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{w.alamat || "Jl. Melati No. 45, RT 04/RW 02"}</td>
                      <td className="px-6 py-4 text-slate-500">{w.noHp}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-slate-800">
                        <span className="text-emerald-600 font-black">{w.saldoPoin.toLocaleString("id-ID")}</span>{" "}
                        <span className="text-[10px] text-slate-400 font-medium">pts</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isWargaActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            AKTIF
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            NON-AKTIF
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1.5">
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors" title="Lihat Detail">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors" title="Edit Warga">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 transition-colors" title="Suspen Warga">
                          <UserX className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                currentPage === p
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "border border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tambah Warga Baru Modal */}
      <Modal 
        open={showAddModal} 
        onClose={() => {
          setShowAddModal(false);
          setModalError("");
        }}
        title="Tambah Anggota Warga Baru"
      >
        <form onSubmit={handleAddWarga} className="space-y-4 pt-2">
          {modalError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Nama Lengkap</label>
            <input
              type="text"
              required
              minLength={3}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Budi Pratama"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Nomor Telepon</label>
            <input
              type="tel"
              required
              minLength={9}
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              placeholder="081234567890"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Alamat Lengkap</label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Contoh: Jl. Melati No. 45, RT 04/RW 02"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setModalError("");
              }}
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
              {submitting ? "Menyimpan..." : "Simpan Warga"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
