import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoWaste — Sistem Pemilahan & Bank Sampah",
  description:
    "Platform modern berbasis Glassmorphism untuk manajemen bank sampah warga & admin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-50/70 text-slate-800 flex relative selection:bg-emerald-500 selection:text-white">
        {/* Ambient Glowing Background Orbs */}
        <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-300/30 via-teal-200/20 to-transparent blur-[120px] pointer-events-none animate-float" />
        <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-green-300/25 via-emerald-200/20 to-transparent blur-[140px] pointer-events-none animate-float" style={{ animationDelay: "-4s" }} />
        <div className="fixed top-[40%] right-[20%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-sky-200/20 to-emerald-100/30 blur-[100px] pointer-events-none animate-pulse-glow" />

        <AuthProvider>
          <StoreProvider>
            <AppShell>{children}</AppShell>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
