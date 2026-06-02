"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService } from "../api/auth.service";
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from "../types/auth";
import { getPostLoginPath } from "@/lib/routes";
import HTTPToast from "@/components/organisms/HTTPToast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials, redirectTo?: string | null) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_DATA_COOKIE = "user_data";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error calling logout endpoint:", error);
    } finally {
      Cookies.remove(USER_DATA_COOKIE);
      setUser(null);
      router.replace("/");
      router.refresh();
    }
  }, [router]);

  // Listen for forced logout events (dispatched globally by the API client)
  useEffect(() => {
    // Toast state is handled below via React state
    const handleForceLogout = (e: Event) => {
      const ce = e as CustomEvent | undefined;
      const detail = ce?.detail as { message?: string; status?: number } | undefined;
      const serverMessage = detail?.message || "Your session has expired. Please log in again.";

      // show a brief toast before/while logging out
      setToast({ visible: true, message: serverMessage });

      // hide after a short delay
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 5000);

      // perform logout (redirects to '/'), keep it async but fire-and-forget
      void logout();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("archify:force-logout", handleForceLogout as EventListener);
      return () => {
        window.removeEventListener("archify:force-logout", handleForceLogout as EventListener);
      };
    }
    return;
  }, [logout]);

  // Toast UI state
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  useEffect(() => {
    const savedUser = Cookies.get(USER_DATA_COOKIE);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parseando user_data de cookies", error);
        Cookies.remove(USER_DATA_COOKIE);
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const establishSession = (profile: User, redirectTo?: string | null) => {
    Cookies.set(USER_DATA_COOKIE, JSON.stringify(profile), {
      expires: 7,
      sameSite: "lax",
      path: "/",
    });
    setUser(profile);
    router.replace(getPostLoginPath(profile, redirectTo));
    router.refresh();
  };

  const login = async (
    credentials: LoginCredentials,
    redirectTo?: string | null
  ) => {
    const data: AuthResponse = await authService.login(credentials);
    establishSession(data.profile, redirectTo);
  };

  const register = async (credentials: RegisterCredentials) => {
    const data = await authService.register(credentials);
    establishSession(data.profile);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, register, logout }}
    >
      <>
        {children}

        {/* Global HTTP toasts (success / error) */}
        <HTTPToast />

        {/* Simple toast for global notifications (e.g., forced logout) */}
        <div aria-live="polite" className="pointer-events-none">
          {toast.visible && (
            <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
              <div className="max-w-sm w-full bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg dark:bg-slate-800">
                <div className="text-sm">
                  {toast.message}
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
