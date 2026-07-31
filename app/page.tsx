"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Users, 
  Recycle, 
  Coins, 
  HelpCircle, 
  Bell, 
  ShieldAlert, 
  Sparkles,
  BookOpen,
  ChevronRight,
  MapPin,
  Leaf
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";

// Custom SVG Logo component matching the user's mockup image
function BankSampahLogo({ className = "w-40 h-40" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Leaf Circle (Green Arch) */}
      <path 
        d="M68 62C76 48 94 40 115 40C140 40 160 55 168 76C174 92 172 108 162 122C150 138 132 144 118 144" 
        stroke="#16a34a" 
        strokeWidth="10" 
        strokeLinecap="round" 
      />
      {/* Inner Leaf Detail */}
      <path 
        d="M68 62C90 62 110 52 135 44C115 56 100 74 76 76" 
        fill="#22c55e" 
        opacity="0.8"
      />
      <path 
        d="M68 62C60 76 56 94 60 112C66 130 80 144 98 148" 
        stroke="#15803d" 
        strokeWidth="12" 
        strokeLinecap="round" 
      />
      
      {/* Golden Coin at the Bottom Center */}
      <circle 
        cx="100" 
        cy="125" 
        r="28" 
        fill="#eab308" 
        stroke="#ca8a04" 
        strokeWidth="3" 
      />
      {/* Inner White Compass/Arrow Circle */}
      <circle 
        cx="100" 
        cy="125" 
        r="18" 
        fill="white" 
      />
      {/* Gold Compass Needle pointing Northeast */}
      <path 
        d="M106 119L97 121L99 123L93 129L95 131L101 125L103 127L106 119Z" 
        fill="#ca8a04" 
      />
    </svg>
  );
}

export default function LandingPage() {
  const { user, logout } = useAuth();
  const { berat, jenisSampah, users, stats } = useStore();

  // Dynamic values from database
  const liveUsersCount = users.filter((u) => u.role === "warga").length;
  // Seed offsets to make dashboard look realistic, mirroring user's stats
  const displayWargaCount = liveUsersCount > 0 ? 1248 + (liveUsersCount - 1) : 1248;
  const displaySampahKg = stats.totalBerat > 0 ? 45920 + stats.totalBerat : 45920;
  const displayPoints = stats.totalBerat > 0 ? 82400000 + (stats.totalBerat * 10) : 82400000;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-md shadow-emerald-500/20 flex items-center justify-center text-white">
              <Leaf className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-lg font-black text-slate-800 tracking-tight block">EcoWaste</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider -mt-1 block">Komunitas</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Home</a>
            <a href="#cara-kerja" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Cara Kerja</a>
            <a href="#harga" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Harga</a>
            <a href="#tentang" className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">Tentang</a>
          </nav>

          {/* Auth Actions (Dynamic) */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors" title="Notifikasi">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors" title="Bantuan">
              <HelpCircle className="w-5 h-5" />
            </button>
            
            <div className="h-5 w-px bg-slate-200" />

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={user.role === "warga" ? "/warga/dashboard" : "/admin/dashboard"}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all"
                >
                  Dashboard ({user.nama.split(" ")[0]})
                </Link>
                <button
                  onClick={logout}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-4.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/10 transition-all hover:scale-[1.02]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Hero Text */}
        <div className="lg:col-span-7 space-y-6 lg:pr-8 animate-fade-in-up">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Eco-Friendly Community Initiative
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 leading-[1.1] tracking-tight">
            Ubah Sampah Jadi <br className="hidden sm:inline" />
            <span className="relative inline-block text-emerald-600">
              Berkah
              <span className="absolute bottom-1 left-0 w-full h-1.5 bg-emerald-200/60 rounded-full -z-10" />
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
            Bergabunglah dengan Bank Sampah Komunitas. Kelola sampah rumah tangga Anda secara bertanggung jawab dan tukarkan dengan poin bernilai ekonomi.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link 
              href={user ? (user.role === "warga" ? "/warga/dashboard" : "/admin/dashboard") : "/register"}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-xl shadow-emerald-800/10 hover:shadow-emerald-800/20 transition-all hover:scale-[1.01]"
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#harga"
              className="flex items-center justify-center px-6 py-4 rounded-2xl bg-emerald-100 hover:bg-emerald-200/80 text-emerald-800 font-bold text-sm transition-all"
            >
              Cek Harga Sampah
            </a>
          </div>
        </div>

        {/* Right Column: Premium Mockup Logo Card */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <div className="relative w-full max-w-sm glass-card-static p-8 sm:p-10 flex flex-col items-center justify-center bg-white/80 shadow-2xl shadow-slate-200/50 group hover:-translate-y-1 transition-all duration-500">
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            
            <BankSampahLogo className="w-48 h-48 drop-shadow-xl animate-float" />
            
            <div className="text-center mt-6 relative z-10">
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight uppercase">Bank Sampah</h2>
              <h3 className="text-lg font-bold text-slate-500 tracking-wide uppercase mt-0.5">Komunitas</h3>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-slate-100/50 border-y border-slate-200/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-12 stagger">
          {/* Card 1: Warga */}
          <div className="glass-card p-6 flex items-center gap-5 border-slate-200/40 animate-fade-in-up">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-sm">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Warga</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                {displayWargaCount.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Card 2: Sampah Terkumpul */}
          <div className="glass-card p-6 flex items-center gap-5 border-slate-200/40 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center shadow-sm">
              <Recycle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sampah Terkumpul</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                {displaySampahKg.toLocaleString("id-ID")} <span className="text-xs text-slate-400 font-semibold">kg</span>
              </p>
            </div>
          </div>

          {/* Card 3: Poin Tersalurkan */}
          <div className="glass-card p-6 flex items-center gap-5 border-slate-200/40 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shadow-sm">
              <Coins className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Poin Tersalurkan</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">
                {(displayPoints / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="cara-kerja" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 space-y-14">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bagaimana Cara Kerjanya?</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Tiga langkah sederhana untuk mulai berkontribusi pada lingkungan dan mendapatkan manfaat ekonomi.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger">
          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center group animate-fade-in-up">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500 text-emerald-600 font-extrabold text-sm flex items-center justify-center bg-white shadow-md relative z-10">
              1
            </div>
            <div className="w-full glass-card p-6 pt-10 mt-[-24px] border-slate-200/40 bg-white/70 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Pilah Sampah</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Pisahkan sampah organik dan anorganik dari rumah Anda.
              </p>
            </div>
            {/* Connector Line */}
            <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 border-t border-dashed border-slate-200 -z-10" />
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center group animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500 text-emerald-600 font-extrabold text-sm flex items-center justify-center bg-white shadow-md relative z-10">
              2
            </div>
            <div className="w-full glass-card p-6 pt-10 mt-[-24px] border-slate-200/40 bg-white/70 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Setor ke Bank</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Bawa sampah yang sudah dipilah ke titik penjemputan RT/RW.
              </p>
            </div>
            {/* Connector Line */}
            <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 border-t border-dashed border-slate-200 -z-10" />
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center group animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500 text-emerald-600 font-extrabold text-sm flex items-center justify-center bg-white shadow-md relative z-10">
              3
            </div>
            <div className="w-full glass-card p-6 pt-10 mt-[-24px] border-slate-200/40 bg-white/70 hover:border-emerald-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Tukar Poin</h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-2">
                Dapatkan poin yang bisa ditukar dengan uang atau barang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DOUBLE-COLUMN DETAILS SECTION */}
      <section id="harga" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Waste Prices Card */}
        <div className="lg:col-span-7 glass-card-static p-8 animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-5 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Harga Sampah Hari Ini</h2>
              <p className="text-xs text-slate-400 mt-0.5">Dapatkan poin maksimal berdasarkan jenis sampah</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
              Update: 12 Okt 2024
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {jenisSampah.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">Loading daftar harga sampah...</p>
            ) : (
              jenisSampah.map((j) => (
                <div key={j.id} className="py-4 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
                      <Leaf className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{j.namaJenis}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{j.keterangan || "Dapat didaur ulang"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-800">Rp {Number(j.hargaPerKg).toLocaleString("id-ID")}</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">/ kg</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Visi & Tentang Komunitas */}
        <div id="tentang" className="lg:col-span-5 space-y-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          {/* Card 1: Tentang Komunitas (Green Background) */}
          <div className="p-8 rounded-3xl bg-emerald-800 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-600/30 blur-2xl" />
            <h3 className="text-lg font-bold">Tentang Komunitas</h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed mt-3">
              Bank Sampah Komunitas adalah inisiatif berbasis warga (RT/RW) yang bertujuan mengelola limbah domestik secara mandiri dan berkelanjutan.
            </p>
            
            {/* Active Members Avatars */}
            <div className="flex items-center gap-2 mt-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 border-2 border-emerald-800 text-[10px] font-bold flex items-center justify-center">AR</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 border-2 border-emerald-800 text-[10px] font-bold flex items-center justify-center">SN</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-emerald-800 text-[10px] font-bold flex items-center justify-center">BS</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-200">10+ Pengelola Aktif</span>
            </div>
          </div>

          {/* Card 2: Visi Kami (Light Green Card) */}
          <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 shadow-sm">
            <h3 className="text-lg font-bold text-emerald-900">Visi Kami</h3>
            <p className="text-xs text-emerald-800/80 leading-relaxed mt-3">
              Menjadikan lingkungan RT/RW bebas sampah plastik sekaligus memberdayakan ekonomi warga melalui sistem perbankan poin yang transparan.
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative p-10 sm:p-14 rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Backlight elements */}
          <div className="absolute top-[-50%] left-[-20%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px]" />
          <div className="absolute bottom-[-50%] right-[-20%] w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[90px]" />

          <div className="space-y-4 max-w-xl relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight">Siap Menjadi Pahlawan Lingkungan?</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mulai langkah kecilmu hari ini. Bergabung dengan ribuan warga lainnya yang sudah berkontribusi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative z-10 flex-shrink-0">
            <Link
              href={user ? (user.role === "warga" ? "/warga/dashboard" : "/admin/dashboard") : "/register"}
              className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-extrabold text-sm text-center shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              Daftar Sekarang
            </Link>
            <button className="px-6 py-4 rounded-2xl border border-white/20 hover:bg-white/10 text-white font-bold text-sm text-center transition-all">
              Hubungi Admin RW
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-200/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Bank Sampah Komunitas</p>
            <p className="text-[10px] text-slate-400">© 2026 EcoWaste Bank. Empowering Communities Through Green Action.</p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">About Us</a>
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">Contact</a>
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-emerald-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
