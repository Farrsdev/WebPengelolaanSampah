"use client";

import { useEffect, useState } from "react";
import { Gift, Coins, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { submitPenukaran, getSaldoWarga, getPenukaranList } from "@/lib/actions";
import { poinToRupiah, cashRateLabel } from "@/lib/poin";

export default function PenukaranPoinPage() {
  const { user } = useAuth();
  const [saldo, setSaldo] = useState(0);
  const [jumlahPoin, setJumlahPoin] = useState("");
  const [jenis, setJenis] = useState<"uang_tunai" | "reward">("uang_tunai");
  const [keteranganReward, setKeteranganReward] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [penukaranList, setPenukaranList] = useState<any[]>([]);

  const loadData = async () => {
    if (!user) return;
    const s = await getSaldoWarga(user.id);
    setSaldo(s.saldoPoin);

    const list = await getPenukaranList();
    setPenukaranList(list.filter((p) => p.idWarga === user.id || p.warga?.email === user.email));
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const numPoin = parseFloat(jumlahPoin);
    if (isNaN(numPoin) || numPoin <= 0) {
      setError("Jumlah poin harus > 0.");
      return;
    }

    if (numPoin > saldo) {
      setError(`Saldo poin tidak mencukupi (Saldo kamu: ${saldo.toLocaleString("id-ID")}).`);
      return;
    }

    if (!user) return;

    const res = await submitPenukaran({
      userId: user.id,
      jumlahPoin: numPoin,
      jenis,
      keteranganReward: keteranganReward.trim() || undefined,
    });

    if (!res.success) {
      setError(res.error || "Gagal mengajukan penukaran.");
    } else {
      setSuccessMsg("Pengajuan penukaran poin berhasil dikirim! Menunggu konfirmasi Admin.");
      setJumlahPoin("");
      setKeteranganReward("");
      loadData();
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Penukaran Poin Warga</h1>
        <p className="text-slate-500 mt-1 text-sm">Tukarkan saldo poin kamu dengan Uang Tunai atau Hadiah Reward</p>
      </div>

      {/* Saldo Indicator Card */}
      <div className="glass-card p-6 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent flex items-center justify-between border border-emerald-500/30">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo Poin Saat Ini</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {saldo.toLocaleString("id-ID")} <span className="text-sm text-slate-400 font-normal">poin</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-medium">Estimasi Cash Out</p>
          <p className="text-lg font-bold text-slate-700 mt-0.5">≈ Rp {poinToRupiah(saldo).toLocaleString("id-ID")}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{cashRateLabel}</p>
        </div>
      </div>

      {/* Form Penukaran */}
      <form onSubmit={handleSubmit} className="glass-card-static p-8 space-y-6 animate-fade-in-up">
        <h2 className="font-bold text-slate-800 text-lg border-b border-slate-200/60 pb-4">
          Form Pengajuan Penukaran
        </h2>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 flex items-center gap-3 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Jenis Penukaran</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setJenis("uang_tunai")}
              className={`p-4 rounded-2xl border text-sm font-bold transition-all duration-300 ${
                jenis === "uang_tunai"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-700 shadow-md shadow-emerald-500/10"
                  : "bg-slate-100/50 border-slate-200 text-slate-500 hover:bg-slate-200/50"
              }`}
            >
              💵 Uang Tunai
            </button>
            <button
              type="button"
              onClick={() => setJenis("reward")}
              className={`p-4 rounded-2xl border text-sm font-bold transition-all duration-300 ${
                jenis === "reward"
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-700 shadow-md shadow-emerald-500/10"
                  : "bg-slate-100/50 border-slate-200 text-slate-500 hover:bg-slate-200/50"
              }`}
            >
              🎁 Reward / Sembako
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Jumlah Poin Ditukar</label>
          <input
            type="number"
            min="100"
            required
            value={jumlahPoin}
            onChange={(e) => setJumlahPoin(e.target.value)}
            placeholder="Contoh: 10000"
            className="w-full px-4 py-3.5 glass-input text-slate-800 text-sm font-semibold placeholder:text-slate-300"
          />
          {jumlahPoin && !isNaN(Number(jumlahPoin)) && (
            <p className="text-xs text-emerald-600 font-semibold mt-2">
              Setara: Rp {poinToRupiah(Number(jumlahPoin)).toLocaleString("id-ID")}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Catatan / Detail Reward (Opsional)</label>
          <input
            type="text"
            value={keteranganReward}
            onChange={(e) => setKeteranganReward(e.target.value)}
            placeholder={jenis === "uang_tunai" ? "Nomor Rekening / E-Wallet" : "Contoh: Paket Sembako"}
            className="w-full px-4 py-3.5 glass-input text-slate-800 text-sm font-medium placeholder:text-slate-300"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
        >
          <Gift className="w-5 h-5" />
          Kirim Pengajuan Penukaran
        </button>
      </form>

      {/* List Status Pengajuan */}
      <div className="glass-card-static overflow-hidden animate-fade-in-up">
        <div className="px-7 py-6 border-b border-slate-200/60 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent">
          <h2 className="text-lg font-bold text-slate-800">Riwayat Pengajuan Penukaran</h2>
          <p className="text-xs text-slate-400 mt-0.5">Status persetujuan oleh Admin Bank Sampah</p>
        </div>

        <div className="divide-y divide-slate-100 p-4">
          {penukaranList.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">Belum ada pengajuan penukaran poin.</p>
          ) : (
            penukaranList.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 rounded-2xl transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {p.jenis === "uang_tunai" ? "💵 Uang Tunai" : "🎁 Reward"} — {p.jumlahPoin.toLocaleString("id-ID")} Poin
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {p.keteranganReward} • {p.createdAt ? new Date(p.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                  </p>
                </div>
                <div className="text-right">
                  {p.status === "menunggu" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                      <Clock className="w-3.5 h-3.5" /> Menunggu Admin
                    </span>
                  )}
                  {p.status === "disetujui" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                    </span>
                  )}
                  {p.status === "ditolak" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 border border-rose-500/20">
                      <XCircle className="w-3.5 h-3.5" /> Ditolak
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
