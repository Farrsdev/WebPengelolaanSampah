"use client";

import { useEffect, useState } from "react";
import { User, Bell, Shield, Palette, ChevronRight, Mail, MapPin, Save, AlertCircle, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { updateUserProfile } from "@/lib/actions";
import Modal from "@/components/modal";

const sections = [
  {
    icon: User,
    title: "Profil Pengguna",
    description: "Kelola informasi akun dan preferensi pribadi",
    accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    icon: Bell,
    title: "Notifikasi",
    description: "Atur pemberitahuan dan reminder harian",
    accent: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    icon: Shield,
    title: "Keamanan",
    description: "Password, autentikasi dua faktor, dan log aktivitas",
    accent: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    icon: Palette,
    title: "Tampilan",
    description: "Tema, bahasa, dan preferensi tampilan Glassmorphism",
    accent: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
];

export default function SettingsPage() {
  const { user, updateUserSession } = useAuth();
  const { showToast } = useStore();

  // Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Initialize input fields when user loads
  useEffect(() => {
    if (user) {
      setNama(user.nama || "");
      setEmail(user.email || "");
      setNoHp(user.noHp || "");
      setAlamat(user.alamat || "");
    }
  }, [user, showEditModal]);

  const userInitial = user?.nama ? user.nama[0].toUpperCase() : "U";
  const userRoleText = user?.role === "admin" ? "Administrator" : "Warga Penyetor";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setModalError("");
    setSubmitting(true);

    const res = await updateUserProfile({
      userId: user.id,
      nama,
      email,
      noHp,
      alamat,
      password: password || undefined,
    });

    if (!res.success) {
      setModalError(res.error || "Gagal memperbarui profil.");
      setSubmitting(false);
    } else {
      showToast("Profil Anda berhasil diperbarui!");
      setPassword("");
      setShowEditModal(false);
      setSubmitting(false);
      
      // Update local storage session cache
      if (updateUserSession) {
        updateUserSession(res.data);
      }
    }
  };

  return (
    <div className="max-w-2xl space-y-8 animate-fade-in">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Pengaturan</h1>
        <p className="text-slate-500 mt-1 text-sm">Kelola preferensi dan konfigurasi sistem</p>
      </div>

      {/* User Profile Card */}
      <div className="glass-card-static p-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-xl shadow-emerald-500/30 ring-4 ring-white">
              {userInitial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-800 truncate">{user?.nama || "Loading..."}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1.5 text-xs text-slate-400 justify-center sm:justify-start">
              <span className="flex items-center gap-1 justify-center sm:justify-start truncate">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-350" /> {user?.email || "-"}
              </span>
              <span className="flex items-center gap-1 justify-center sm:justify-start truncate">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-slate-350" /> {user?.noHp || "-"}
              </span>
              <span className="flex items-center gap-1 justify-center sm:justify-start truncate">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-350" /> {user?.alamat || "Alamat belum diisi"}
              </span>
            </div>
            <span className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              {userRoleText} (`User` Model)
            </span>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-650 hover:bg-slate-50 transition-all flex-shrink-0"
          >
            Edit Profil
          </button>
        </div>
      </div>

      {/* Settings Navigation Cards */}
      <div className="space-y-4 stagger">
        {sections.map((sec) => (
          <button
            key={sec.title}
            onClick={() => {
              if (sec.title === "Profil Pengguna" || sec.title === "Keamanan") {
                setShowEditModal(true);
              } else {
                showToast(`Fitur ${sec.title} segera hadir pada update berikutnya!`);
              }
            }}
            className="w-full glass-card p-6 flex items-center justify-between text-left animate-fade-in-up group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${sec.accent} border flex items-center justify-center shadow-md`}>
                <sec.icon className="w-5.5 h-5.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors text-base">{sec.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">{sec.description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200" />
          </button>
        ))}
      </div>

      {/* Edit Profil Modal */}
      <Modal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setModalError("");
        }}
        title="Edit Profil Akun Anda"
      >
        <form onSubmit={handleUpdate} className="space-y-4 pt-2">
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Nomor HP / Telepon</label>
            <input
              type="tel"
              required
              minLength={9}
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Alamat Rumah</label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="RT/RW, Jalan, Blok..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Ganti Password (Kosongkan jika tidak diubah)</label>
            <input
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 Karakter"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
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
              {submitting ? "Menyimpan..." : "Simpan Profil"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
