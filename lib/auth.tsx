"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { loginUser, registerUser, type ActionResult } from "./actions";
import { useRouter, usePathname } from "next/navigation";

export interface UserSession {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  role: "admin" | "warga";
  alamat?: string | null;
  foto?: string | null;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  isAdmin: boolean;
  isWarga: boolean;
  login: (emailOrHp: string, pass: string) => Promise<ActionResult<UserSession>>;
  register: (data: {
    nama: string;
    email: string;
    noHp: string;
    password: string;
    alamat?: string;
  }) => Promise<ActionResult<UserSession>>;
  logout: () => void;
  updateUserSession: (session: UserSession) => void;
}

const AuthCtx = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthCtx);

const AUTH_STORAGE_KEY = "ecowaste_session_v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (emailOrHp: string, pass: string): Promise<ActionResult<UserSession>> => {
      const res = await loginUser(emailOrHp, pass);
      if (res.success && res.data) {
        const session: UserSession = {
          id: res.data.id,
          nama: res.data.nama,
          email: res.data.email,
          noHp: res.data.noHp,
          role: res.data.role,
          alamat: res.data.alamat,
          foto: res.data.foto,
        };
        setUser(session);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

        if (session.role === "warga") {
          router.push("/warga/dashboard");
        } else {
          router.push("/");
        }
      }
      return res;
    },
    [router]
  );

  const register = useCallback(
    async (data: {
      nama: string;
      email: string;
      noHp: string;
      password: string;
      alamat?: string;
    }): Promise<ActionResult<UserSession>> => {
      const res = await registerUser(data);
      if (res.success && res.data) {
        const session: UserSession = {
          id: res.data.id,
          nama: res.data.nama,
          email: res.data.email,
          noHp: res.data.noHp,
          role: res.data.role,
          alamat: res.data.alamat,
          foto: res.data.foto,
        };
        setUser(session);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        router.push("/warga/dashboard");
      }
      return res;
    },
    [router]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push("/login");
  }, [router]);

  const updateUserSession = useCallback((session: UserSession) => {
    setUser(session);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }, []);

  const isAdmin = user?.role === "admin";
  const isWarga = user?.role === "warga";

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        isAdmin,
        isWarga,
        login,
        register,
        logout,
        updateUserSession,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
