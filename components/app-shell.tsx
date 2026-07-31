"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/lib/auth";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

const AUTH_PAGES = ["/login", "/register"];
const ADMIN_ONLY_PAGES = ["/admin/dashboard", "/input", "/wilayah", "/jenis-sampah", "/admin/penukaran", "/settings"];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isLandingPage = pathname === "/";

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in -> send to login if trying to access protected app routes
      if (!isAuthPage && !isLandingPage) {
        router.replace("/login");
      }
    } else {
      // Logged in -> guard role authorization
      if (isAuthPage) {
        router.replace(user.role === "warga" ? "/warga/dashboard" : "/admin/dashboard");
      } else if (user.role === "warga" && ADMIN_ONLY_PAGES.includes(pathname)) {
        // Warga tries to access admin dashboard or admin settings/setup pages -> redirect
        router.replace("/warga/dashboard");
      } else if (user.role === "admin" && pathname.startsWith("/warga")) {
        // Admin tries to access citizens dashboard/penukaran/history -> redirect to admin dashboard
        router.replace("/admin/dashboard");
      }
    }
  }, [user, loading, pathname, isAuthPage, isLandingPage, router]);

  // Beautiful loading skeleton to prevent flash of unauthorized screens
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md relative z-[99]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-4">Menyiapkan Sesi Sesuai Role...</p>
      </div>
    );
  }

  // Double check authorization gate before rendering children to prevent visual leak
  if (!user && !isAuthPage && !isLandingPage) {
    return null;
  }

  if (user) {
    if (user.role === "warga" && ADMIN_ONLY_PAGES.includes(pathname)) {
      return null;
    }
    if (user.role === "admin" && pathname.startsWith("/warga")) {
      return null;
    }
  }

  if (isLandingPage) {
    // Full-width landing page layout — no sidebar, no left margin
    return (
      <main className="flex-1 min-h-screen relative z-10 w-full">
        {children}
      </main>
    );
  }

  if (isAuthPage) {
    // Full-screen centered layout for login/register — no sidebar, no margin
    return (
      <main className="flex-1 min-h-screen flex items-center justify-center relative z-10">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] min-h-screen relative z-10">
        <div className="p-6 sm:p-8 lg:p-10 pt-16 lg:pt-10">{children}</div>
      </main>
    </>
  );
}
